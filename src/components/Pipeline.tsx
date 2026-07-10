"use client";

import Link from "next/link";
import { STAGE_ORDER, getStage } from "@/lib/stages";
import type { Project, StageId } from "@/lib/types";

export function Pipeline({
  project,
  activeStage,
  basePath,
  compact = false,
  query = "",
}: {
  project: Project;
  activeStage?: StageId;
  basePath: string;
  compact?: boolean;
  /** e.g. "?mode=cloud" */
  query?: string;
}) {
  return (
    <ol
      className={`flex gap-1 overflow-x-auto pb-1 ${compact ? "text-xs" : "text-sm"}`}
    >
      {STAGE_ORDER.map((id, i) => {
        const stage = getStage(id);
        const status = project.stages[id]?.status ?? "not_started";
        const isActive = activeStage === id;
        const colors =
          status === "complete"
            ? "border-teal-600 bg-teal-600 text-white"
            : status === "in_progress"
              ? "border-amber-500 bg-amber-50 text-amber-900"
              : "border-slate-200 bg-white text-slate-500";

        return (
          <li key={id} className="flex shrink-0 items-center gap-1">
            {i > 0 && <span className="mx-0.5 text-slate-300">→</span>}
            <Link
              href={`${basePath}/${id}${query}`}
              title={stage.title}
              className={`rounded-full border px-2.5 py-1 font-medium transition-shadow hover:shadow-sm ${colors} ${
                isActive ? "ring-2 ring-teal-400 ring-offset-1" : ""
              }`}
            >
              {stage.number}. {compact ? stage.shortTitle : stage.shortTitle}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs text-slate-500">
        <span>Review progress</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-teal-600 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
