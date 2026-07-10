"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  COHORT_STAGE_ORDER,
  buildCohortExportMarkdown,
  computeCohortProgress,
  getCohortProject,
  getCohortStage,
  type CohortProject,
} from "@/lib/cohort";
import { ExportMenu } from "@/components/ExportMenu";

export default function CohortProjectHomePage() {
  const params = useParams();
  const id = String(params.id || "");
  const [project, setProject] = useState<CohortProject | null>(null);

  useEffect(() => {
    setProject(getCohortProject(id));
  }, [id]);

  if (!project) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-600">
        Project not found.{" "}
        <Link href="/designs/cohort" className="text-teal-700 underline">
          Back
        </Link>
      </div>
    );
  }

  const progress = computeCohortProgress(project);
  const base = `/designs/cohort/${id}`;

  return (
    <div className="mx-auto max-w-2xl px-3 py-8 sm:px-6">
      <Link href="/designs/cohort" className="text-sm text-teal-700 underline">
        ← All cohort projects
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900">
        {project.title}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Cohort · {progress.completed}/{progress.total} stages complete
      </p>
      <div className="mt-3 h-2 max-w-xs overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-teal-600"
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Link
          href={`${base}/${project.currentStage}`}
          className="rounded-lg bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white sm:w-fit"
        >
          Continue current stage
        </Link>
        <ExportMenu
          title={project.title}
          items={[
            {
              id: "draft",
              label: "Study draft",
              markdown: () => buildCohortExportMarkdown(project),
              variant: "primary",
            },
          ]}
        />
      </div>

      <ul className="mt-8 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {COHORT_STAGE_ORDER.map((sid) => {
          const s = getCohortStage(sid);
          const st = project.stages[sid]?.status || "not_started";
          return (
            <li key={sid}>
              <Link
                href={`${base}/${sid}`}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {s.number}. {s.title}
                  </p>
                  <p className="text-xs text-slate-500">{s.summary}</p>
                </div>
                <span className="shrink-0 text-[11px] font-semibold capitalize text-slate-500">
                  {st.replace("_", " ")}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
