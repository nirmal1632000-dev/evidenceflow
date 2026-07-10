"use client";

import { useMemo, useState } from "react";

type Ans = "yes" | "no" | "unsure" | "";

const QUESTIONS: { id: string; q: string; why: string }[] = [
  {
    id: "pico",
    q: "Do studies answer essentially the same PICO question?",
    why: "If populations, interventions, or outcomes differ too much, a single pooled estimate may mislead.",
  },
  {
    id: "design",
    q: "Are study designs similar enough to combine (e.g. all RCTs)?",
    why: "Mixing designs can inflate heterogeneity and bias; often synthesize separately.",
  },
  {
    id: "outcome",
    q: "Is the outcome measured in a comparable way (or convertible to SMD/OR)?",
    why: "Without a common effect measure, quantitative pooling is not appropriate.",
  },
  {
    id: "data",
    q: "Can you extract (or calculate) effect estimates with uncertainty for ≥2 studies?",
    why: "Meta-analysis needs usable quantitative data, not p-values alone.",
  },
  {
    id: "clinical",
    q: "Would a pooled average be clinically meaningful to decision-makers?",
    why: "Even with numbers, pooling “apples and oranges” can produce a useless average.",
  },
];

export function PoolDecision() {
  const [answers, setAnswers] = useState<Record<string, Ans>>({});

  const result = useMemo(() => {
    const vals = QUESTIONS.map((q) => answers[q.id] || "");
    if (vals.some((v) => !v)) return null;
    const nos = vals.filter((v) => v === "no").length;
    const unsures = vals.filter((v) => v === "unsure").length;
    const yeses = vals.filter((v) => v === "yes").length;

    if (nos >= 2) {
      return {
        label: "Prefer narrative synthesis",
        detail:
          "Multiple “no” answers suggest pooling may be inappropriate. Structure findings by outcome/population and explain why MA was not done.",
        color: "border-amber-200 bg-amber-50 text-amber-950",
      };
    }
    if (nos === 1 || unsures >= 2) {
      return {
        label: "Proceed with caution",
        detail:
          "Consider MA only for a pre-specified homogeneous subset, report high heterogeneity, and pair with narrative synthesis. Document the decision in the Synthesis stage.",
        color: "border-indigo-200 bg-indigo-50 text-indigo-950",
      };
    }
    if (yeses >= 4) {
      return {
        label: "Meta-analysis is reasonable to plan",
        detail:
          "Pre-specify effect measure and random-effects model, investigate heterogeneity, and still check clinical diversity. Record the plan in Protocol and Synthesis stages.",
        color: "border-teal-200 bg-teal-50 text-teal-950",
      };
    }
    return {
      label: "Need clearer judgments",
      detail: "Revisit eligibility and outcome definitions with your co-reviewer.",
      color: "border-slate-200 bg-slate-50 text-slate-800",
    };
  }, [answers]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="font-semibold text-slate-900">
        Should we pool? (decision coach)
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        Quick team check before meta-analysis. Not a substitute for methods expertise.
      </p>
      <ul className="mt-4 space-y-4">
        {QUESTIONS.map((item) => (
          <li key={item.id}>
            <p className="text-sm font-medium text-slate-800">{item.q}</p>
            <p className="mt-0.5 text-xs text-slate-500">{item.why}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["yes", "no", "unsure"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setAnswers((a) => ({ ...a, [item.id]: opt }))
                  }
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    answers[item.id] === opt
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {result && (
        <div className={`mt-5 rounded-lg border px-4 py-3 text-sm ${result.color}`}>
          <p className="font-semibold">{result.label}</p>
          <p className="mt-1">{result.detail}</p>
        </div>
      )}
    </div>
  );
}
