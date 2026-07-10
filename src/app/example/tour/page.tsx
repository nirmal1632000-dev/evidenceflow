"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getTourSteps, getExampleFieldValue, getStagePedagogy } from "@/lib/pedagogy";
import { getStage } from "@/lib/stages";

function TourInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const steps = useMemo(() => getTourSteps(), []);
  const initial = Number(searchParams.get("step") || "0");
  const [index, setIndex] = useState(
    Number.isFinite(initial) ? Math.min(Math.max(0, initial), steps.length - 1) : 0
  );

  useEffect(() => {
    const s = Number(searchParams.get("step") || "0");
    if (Number.isFinite(s)) {
      setIndex(Math.min(Math.max(0, s), steps.length - 1));
    }
  }, [searchParams, steps.length]);

  const step = steps[index];
  const ped = getStagePedagogy(step.stageId);
  const stage = getStage(step.stageId);
  const highlightFields = stage.fields.filter((f) =>
    ped.watchFieldKeys.includes(f.key)
  );

  function go(i: number) {
    const next = Math.min(Math.max(0, i), steps.length - 1);
    setIndex(next);
    router.replace(`/example/tour?step=${next}`, { scroll: false });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
        Guided tour · Watch it
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
        Watch a full systematic review unfold
      </h1>
      <p className="mt-2 text-slate-600">
        Eleven short scenes from the mindfulness / student anxiety example. Watch
        the expert choices first, then{" "}
        <Link href="/workspace" className="text-teal-700 underline">
          do your own project
        </Link>
        , then teach it back on each stage.
      </p>

      {/* Progress */}
      <div className="mt-6">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>
            Scene {index + 1} of {steps.length}
          </span>
          <span>{Math.round(((index + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-amber-500 transition-all"
            style={{ width: `${((index + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Scene dots */}
      <div className="mt-3 flex flex-wrap gap-1">
        {steps.map((s, i) => (
          <button
            key={s.stageId}
            type="button"
            title={s.tourTitle}
            onClick={() => go(i)}
            className={`h-2.5 w-2.5 rounded-full ${
              i === index
                ? "bg-amber-600"
                : i < index
                  ? "bg-amber-300"
                  : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <article className="mt-8 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
          Stage {step.number} · {step.title}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">
          {step.tourTitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
          {step.narration}
        </p>

        <div className="mt-6 rounded-xl bg-amber-50/80 px-4 py-3">
          <h3 className="text-sm font-semibold text-amber-950">
            Think like the reviewer
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-950/90">
            {ped.expertThinking.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Snapshot from the example
          </h3>
          {highlightFields.slice(0, 3).map((f) => (
            <div
              key={f.key}
              className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
            >
              <p className="text-[11px] font-semibold uppercase text-slate-500">
                {f.label}
              </p>
              <p className="mt-0.5 line-clamp-4 whitespace-pre-wrap text-sm text-slate-800">
                {getExampleFieldValue(step.stageId, f.key) || "—"}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => go(index - 1)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
          >
            ← Previous scene
          </button>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/example/${step.stageId}`}
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-950"
            >
              Full example stage
            </Link>
            {index < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => go(index + 1)}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Next scene →
              </button>
            ) : (
              <Link
                href="/workspace"
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Now Do: open workspace →
              </Link>
            )}
          </div>
        </div>
      </article>

      <p className="mt-6 text-center text-sm text-slate-500">
        Loop:{" "}
        <strong className="text-amber-800">Watch</strong> (this tour) →{" "}
        <strong className="text-teal-800">Do</strong> (your project) →{" "}
        <strong className="text-violet-800">Teach</strong> (stage teach tab)
      </p>
    </div>
  );
}

export default function ExampleTourPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-slate-500">Loading tour…</div>
      }
    >
      <TourInner />
    </Suspense>
  );
}
