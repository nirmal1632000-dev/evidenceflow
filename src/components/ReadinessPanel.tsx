"use client";

import Link from "next/link";
import { computeReadiness } from "@/lib/readiness";
import type { Project, StorageMode } from "@/lib/types";

export function ReadinessPanel({
  project,
  mode,
}: {
  project: Project;
  mode: StorageMode;
}) {
  const { items, score, criticalMissing } = computeReadiness(project);
  const qs = `?mode=${mode}`;
  const base = `/workspace/projects/${project.id}`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-semibold text-slate-900">Review readiness</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Methods completeness checklist for your team — not a journal score.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-teal-700">{score}%</p>
          {criticalMissing > 0 ? (
            <p className="text-xs text-amber-700">
              {criticalMissing} critical item{criticalMissing === 1 ? "" : "s"} open
            </p>
          ) : (
            <p className="text-xs text-teal-700">Core methods items covered</p>
          )}
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-teal-600 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>

      <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-2 rounded-lg border border-slate-100 px-2.5 py-2 text-sm"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                item.done
                  ? "bg-teal-100 text-teal-800"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {item.done ? "✓" : "·"}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={
                  item.done
                    ? "text-slate-500 line-through"
                    : "font-medium text-slate-800"
                }
              >
                {item.label}
              </p>
              {!item.done && (
                <p className="text-xs text-slate-500">{item.hint}</p>
              )}
            </div>
            {item.stageId && !item.done && (
              <Link
                href={`${base}/${item.stageId}${qs}`}
                className="shrink-0 text-xs font-semibold text-teal-700"
              >
                Fix
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
