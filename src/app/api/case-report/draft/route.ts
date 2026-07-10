import { NextResponse } from "next/server";
import {
  buildCaseFieldSchemaForPrompt,
  normalizeCaseAiDraft,
} from "@/lib/case-ai";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You are an expert clinical academic writing assistant for educational case reports (CARE-aligned).
You convert crude clinical notes into a structured case-report draft.

CRITICAL SAFETY RULES:
1. NEVER invent clinical facts, lab values, imaging findings, doses, diagnoses, or outcomes not supported by the notes.
2. If information is missing, leave the field empty or write "[not stated in notes]".
3. Prefer de-identified language. Do not create patient names or identifiers.
4. Do not claim that n=1 proves treatment efficacy. Keep discussion cautious.
5. Output ONLY valid JSON matching the schema. No markdown fences, no commentary outside JSON.
6. This is an educational draft aid, not clinical decision support.`;

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  // strip ```json fences if present
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1].trim() : trimmed;
  try {
    return JSON.parse(body);
  } catch {
    const start = body.indexOf("{");
    const end = body.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(body.slice(start, end + 1));
    }
    throw new Error("Model did not return valid JSON");
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.XAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "AI is not configured. Set XAI_API_KEY (or OPENAI_API_KEY) in the server environment.",
        code: "not_configured",
      },
      { status: 503 }
    );
  }

  let body: {
    notes?: string;
    titleHint?: string;
    mode?: string;
    privacyAck?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.privacyAck) {
    return NextResponse.json(
      {
        error:
          "Privacy acknowledgement required before notes can be sent to the AI provider.",
        code: "privacy_required",
      },
      { status: 400 }
    );
  }

  const notes = String(body.notes || "").trim();
  if (notes.length < 40) {
    return NextResponse.json(
      {
        error:
          "Please paste more clinical detail (at least a short history and key findings).",
      },
      { status: 400 }
    );
  }
  if (notes.length > 40000) {
    return NextResponse.json(
      { error: "Notes too long. Please shorten to under ~40,000 characters." },
      { status: 400 }
    );
  }

  const mode =
    body.mode === "series" || body.mode === "report" ? body.mode : "report";
  const titleHint = String(body.titleHint || "").slice(0, 200);

  const provider = process.env.XAI_API_KEY
    ? "xai"
    : process.env.OPENAI_API_KEY
      ? "openai"
      : "xai";

  const baseUrl =
    process.env.AI_BASE_URL ||
    (provider === "openai"
      ? "https://api.openai.com/v1"
      : "https://api.x.ai/v1");

  const model =
    process.env.AI_MODEL ||
    process.env.XAI_MODEL ||
    (provider === "openai" ? "gpt-4o-mini" : "grok-3-mini");

  const userPrompt = [
    `Preferred mode: ${mode}`,
    titleHint ? `Working title hint: ${titleHint}` : "",
    "",
    "FIELD SCHEMA:",
    buildCaseFieldSchemaForPrompt(),
    "",
    "CRUDE CLINICAL NOTES (user-supplied; may be incomplete):",
    "---",
    notes,
    "---",
    "",
    "Produce the JSON draft now.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const messages = [
      { role: "system", content: SYSTEM },
      { role: "user", content: userPrompt },
    ];

    async function callModel(withJsonMode: boolean) {
      const payload: Record<string, unknown> = {
        model,
        temperature: 0.2,
        messages,
      };
      if (withJsonMode) {
        payload.response_format = { type: "json_object" };
      }
      return fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });
    }

    let res = await callModel(true);
    if (!res.ok) {
      // Some models reject response_format — retry without
      const errText = await res.text().catch(() => "");
      if (res.status === 400 || res.status === 422) {
        res = await callModel(false);
      } else {
        console.error("[case-ai] provider error", res.status, errText.slice(0, 500));
        return NextResponse.json(
          {
            error:
              res.status === 401
                ? "AI API key rejected. Check XAI_API_KEY / OPENAI_API_KEY."
                : `AI provider error (${res.status}). Try again later.`,
            code: "provider_error",
          },
          { status: 502 }
        );
      }
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[case-ai] provider error", res.status, errText.slice(0, 500));
      return NextResponse.json(
        {
          error:
            res.status === 401
              ? "AI API key rejected. Check XAI_API_KEY / OPENAI_API_KEY."
              : `AI provider error (${res.status}). Try again later.`,
          code: "provider_error",
        },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Empty response from AI provider" },
        { status: 502 }
      );
    }

    const parsed = extractJson(content);
    const draft = normalizeCaseAiDraft(parsed);
    if (mode === "series" || mode === "report") draft.mode = mode;

    // Do not log notes or draft content
    return NextResponse.json({
      draft,
      meta: {
        model,
        provider,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (e) {
    console.error("[case-ai] failure", e instanceof Error ? e.message : e);
    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? e.message
            : "Failed to generate draft. Check configuration and try again.",
      },
      { status: 500 }
    );
  }
}

/** Lightweight status for the UI (does not expose keys). */
export async function GET() {
  const configured = !!(process.env.XAI_API_KEY || process.env.OPENAI_API_KEY);
  return NextResponse.json({
    configured,
    provider: process.env.XAI_API_KEY
      ? "xai"
      : process.env.OPENAI_API_KEY
        ? "openai"
        : null,
  });
}
