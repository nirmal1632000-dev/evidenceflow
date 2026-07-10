"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CHOOSER_QUESTIONS,
  classifyDesign,
  type ChooserAnswer,
} from "@/lib/design-chooser";
import { getDesign } from "@/lib/designs";

export function DesignChooser() {
  const [answers, setAnswers] = useState<Record<string, ChooserAnswer>>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const q = CHOOSER_QUESTIONS[step];
  const result = useMemo(
    () => (done ? classifyDesign(answers) : null),
    [done, answers]
  );

  function choose(ans: ChooserAnswer) {
    const next = { ...answers, [q.id]: ans };
    setAnswers(next);
    if (step < CHOOSER_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function reset() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  if (done && result) {
    const primary = getDesign(result.primary);
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
            Suggested design · {result.confidence} confidence
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            {primary.title}
          </h2>
          <p className="mt-2 text-sm text-slate-700">{primary.summary}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {result.rationale.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {primary.href && (
              <Link
                href={primary.href}
                className="rounded-lg bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Open {primary.shortTitle} track
              </Link>
            )}
            <Link
              href={`/designs/appraise?design=${primary.id}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-800"
            >
              Appraisal red flags
            </Link>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-teal-800 underline"
            >
              Retake chooser
            </button>
          </div>
        </div>
        {result.alternatives.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Also consider
            </h3>
            <ul className="mt-2 space-y-2">
              {result.alternatives.map((id) => {
                const d = getDesign(id);
                return (
                  <li key={id} className="text-sm text-slate-700">
                    <span className="font-medium">{d.title}</span> — {d.summary}
                    {d.href && (
                      <>
                        {" "}
                        <Link href={d.href} className="text-teal-700 underline">
                          Open
                        </Link>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <p className="text-xs text-slate-500">
          Educational classifier only — discuss with a supervisor for real projects.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-1 flex justify-between text-xs text-slate-500">
        <span>
          Question {step + 1} of {CHOOSER_QUESTIONS.length}
        </span>
        <span>{Math.round(((step + 1) / CHOOSER_QUESTIONS.length) * 100)}%</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-teal-600 transition-all"
          style={{
            width: `${((step + 1) / CHOOSER_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>
      <h2 className="text-lg font-semibold leading-snug text-slate-900">
        {q.text}
      </h2>
      {q.help && (
        <p className="mt-2 text-sm text-slate-500">{q.help}</p>
      )}
      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {(
          [
            ["yes", "Yes"],
            ["no", "No"],
            ["unsure", "Not sure"],
          ] as const
        ).map(([val, label]) => (
          <button
            key={val}
            type="button"
            onClick={() => choose(val)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 hover:border-teal-400 hover:bg-teal-50"
          >
            {label}
          </button>
        ))}
      </div>
      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-4 text-sm text-slate-500 underline"
        >
          Back
        </button>
      )}
    </div>
  );
}
