"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";

export function Quiz({
  questions,
  onPassed,
}: {
  questions: QuizQuestion[];
  onPassed?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!questions.length) return null;

  const allAnswered = questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== null);
  const score = questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const passed = submitted && score === questions.length;

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-indigo-950">Quick check</h3>
      <p className="mt-1 text-xs text-indigo-800/80">
        Optional — solidifies the concept before you move on.
      </p>
      <div className="mt-4 space-y-5">
        {questions.map((q, qi) => (
          <fieldset key={q.id}>
            <legend className="text-sm font-medium text-slate-800">
              {qi + 1}. {q.question}
            </legend>
            <div className="mt-2 space-y-1.5">
              {q.options.map((opt, oi) => {
                const selected = answers[q.id] === oi;
                let style = "border-slate-200 bg-white hover:border-indigo-300";
                if (submitted) {
                  if (oi === q.correctIndex)
                    style = "border-teal-500 bg-teal-50 text-teal-900";
                  else if (selected)
                    style = "border-rose-400 bg-rose-50 text-rose-900";
                } else if (selected) {
                  style = "border-indigo-500 bg-indigo-50";
                }
                return (
                  <label
                    key={oi}
                    className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm ${style}`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      className="mt-0.5"
                      checked={selected}
                      disabled={submitted}
                      onChange={() =>
                        setAnswers((a) => ({ ...a, [q.id]: oi }))
                      }
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-2 text-xs text-slate-600">{q.explanation}</p>
            )}
          </fieldset>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={() => {
              setSubmitted(true);
              if (
                questions.every((q) => answers[q.id] === q.correctIndex)
              ) {
                onPassed?.();
              }
            }}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40"
          >
            Check answers
          </button>
        ) : (
          <>
            <span className="text-sm font-medium text-slate-700">
              Score: {score}/{questions.length}
              {passed ? " — nice work" : " — review explanations above"}
            </span>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
              }}
              className="text-sm text-indigo-700 underline"
            >
              Retry
            </button>
            {passed && (
              <button
                type="button"
                onClick={() => onPassed?.()}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white"
              >
                Mark quiz done
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
