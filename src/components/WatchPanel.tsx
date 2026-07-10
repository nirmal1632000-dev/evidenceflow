"use client";

import Link from "next/link";
import type { StageId } from "@/lib/types";
import { getStage } from "@/lib/stages";
import {
  getExampleFieldValue,
  getStagePedagogy,
} from "@/lib/pedagogy";

export function WatchPanel({ stageId }: { stageId: StageId }) {
  const ped = getStagePedagogy(stageId);
  const stage = getStage(stageId);
  const fields = stage.fields.filter((f) =>
    ped.watchFieldKeys.includes(f.key)
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm sm:p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
          Watch · model review
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">
          {ped.tourTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {ped.tourNarration}
        </p>
        <Link
          href={`/example/tour?step=${stage.number - 1}`}
          className="mt-3 inline-block text-xs font-semibold text-amber-900 underline"
        >
          Open guided tour at this scene →
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="font-semibold text-slate-900">Expert thinking aloud</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {ped.expertThinking.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-slate-900">
            Annotated example fields
          </h3>
          <Link
            href={`/example/${stageId}`}
            className="text-xs font-medium text-teal-700 underline"
          >
            Open full example stage
          </Link>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          From the mindfulness / student anxiety worked example. Notice the
          structure — don’t copy the topic if your review differs.
        </p>
        <div className="mt-4 space-y-4">
          {fields.map((f) => {
            const value = getExampleFieldValue(stageId, f.key);
            const insight =
              ped.fieldInsights[f.key] ||
              "Notice how specific and usable this is for dual review.";
            return (
              <div
                key={f.key}
                className="rounded-lg border border-slate-100 bg-slate-50/80 p-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {f.label}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">
                  {value || "—"}
                </p>
                <p className="mt-2 border-t border-amber-100 pt-2 text-xs text-amber-950">
                  <span className="font-semibold">Why this works: </span>
                  {insight}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-slate-500">
        When you understand the model → switch to <strong>Do</strong> and write
        your own.
      </p>
    </div>
  );
}
