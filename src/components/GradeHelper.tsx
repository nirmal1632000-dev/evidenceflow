"use client";

import { useMemo, useState } from "react";

type Level = "none" | "serious" | "very";

const DOMAINS: {
  id: string;
  title: string;
  prompt: string;
  options: { value: Level; label: string }[];
}[] = [
  {
    id: "rob",
    title: "Risk of bias",
    prompt: "How serious are limitations in study design/conduct for this outcome?",
    options: [
      { value: "none", label: "Not serious" },
      { value: "serious", label: "Serious (−1)" },
      { value: "very", label: "Very serious (−2)" },
    ],
  },
  {
    id: "inconsistency",
    title: "Inconsistency",
    prompt: "Unexplained heterogeneity of effects across studies?",
    options: [
      { value: "none", label: "Not serious" },
      { value: "serious", label: "Serious (−1)" },
      { value: "very", label: "Very serious (−2)" },
    ],
  },
  {
    id: "indirectness",
    title: "Indirectness",
    prompt: "Differences in PICO vs your question (population, intervention, outcomes)?",
    options: [
      { value: "none", label: "Not serious" },
      { value: "serious", label: "Serious (−1)" },
      { value: "very", label: "Very serious (−2)" },
    ],
  },
  {
    id: "imprecision",
    title: "Imprecision",
    prompt: "Wide CIs / few events / CI crosses decision thresholds?",
    options: [
      { value: "none", label: "Not serious" },
      { value: "serious", label: "Serious (−1)" },
      { value: "very", label: "Very serious (−2)" },
    ],
  },
  {
    id: "publication",
    title: "Publication bias",
    prompt: "Suspect missing studies that could change the conclusion?",
    options: [
      { value: "none", label: "Not serious / undetected" },
      { value: "serious", label: "Serious (−1)" },
      { value: "very", label: "Very serious (−2)" },
    ],
  },
];

function levelToPoints(l: Level) {
  if (l === "serious") return 1;
  if (l === "very") return 2;
  return 0;
}

const CERTAINTY = ["High", "Moderate", "Low", "Very low"] as const;

export function GradeHelper({
  onApply,
  readOnly,
}: {
  onApply?: (text: string) => void;
  readOnly?: boolean;
}) {
  const [outcome, setOutcome] = useState("Primary outcome");
  const [start, setStart] = useState<"high" | "low">("high");
  const [levels, setLevels] = useState<Record<string, Level>>({
    rob: "none",
    inconsistency: "none",
    indirectness: "none",
    imprecision: "none",
    publication: "none",
  });
  const [notes, setNotes] = useState("");

  const result = useMemo(() => {
    let deduct = 0;
    const reasons: string[] = [];
    for (const d of DOMAINS) {
      const lv = levels[d.id] || "none";
      const pts = levelToPoints(lv);
      deduct += pts;
      if (pts > 0) {
        reasons.push(
          `${d.title}: ${lv === "very" ? "very serious" : "serious"} (−${pts})`
        );
      }
    }
    let idx = start === "high" ? 0 : 2; // RCTs high; observational often low
    idx = Math.min(3, idx + deduct);
    // cap: more than 3 levels down still very low
    return {
      certainty: CERTAINTY[idx],
      deduct,
      reasons,
    };
  }, [levels, start]);

  const summary = useMemo(() => {
    const why =
      result.reasons.length > 0
        ? result.reasons.join("; ")
        : "no downgrades selected";
    return `${outcome}: ${result.certainty.toUpperCase()} — ${why}${
      notes.trim() ? `. Notes: ${notes.trim()}` : ""
    }`;
  }, [outcome, result, notes]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="font-semibold text-slate-900">GRADE helper (per outcome)</h3>
      <p className="mt-1 text-xs text-slate-500">
        Teaching aid for downgrading certainty. Start high for RCTs (typical). Use
        GRADEpro for formal SoF tables.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="font-medium text-slate-700">Outcome name</span>
          <input
            value={outcome}
            disabled={readOnly}
            onChange={(e) => setOutcome(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Starting certainty</span>
          <select
            value={start}
            disabled={readOnly}
            onChange={(e) => setStart(e.target.value as "high" | "low")}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          >
            <option value="high">High (typical for RCTs)</option>
            <option value="low">Low (typical for non-randomized)</option>
          </select>
        </label>
      </div>

      <ul className="mt-5 space-y-4">
        {DOMAINS.map((d) => (
          <li key={d.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
            <p className="text-sm font-medium text-slate-900">{d.title}</p>
            <p className="text-xs text-slate-500">{d.prompt}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {d.options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  disabled={readOnly}
                  onClick={() =>
                    setLevels((L) => ({ ...L, [d.id]: o.value }))
                  }
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    levels[d.id] === o.value
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <label className="mt-4 block text-sm">
        <span className="font-medium text-slate-700">Optional notes</span>
        <textarea
          rows={2}
          disabled={readOnly}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          placeholder="e.g. downgraded imprecision because CI crosses no effect and MID"
        />
      </label>

      <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
        <p className="text-lg font-bold">{result.certainty}</p>
        <p className="mt-1 text-xs">Total downgrade steps: {result.deduct}</p>
        <p className="mt-2 text-sm">{summary}</p>
      </div>

      {!readOnly && onApply && (
        <button
          type="button"
          onClick={() => onApply(summary)}
          className="mt-3 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white"
        >
          Append to certainty ratings field
        </button>
      )}
    </div>
  );
}
