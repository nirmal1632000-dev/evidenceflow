"use client";

import Link from "next/link";
import { getExampleProject } from "@/lib/example-project";
import { STAGE_ORDER, getStage } from "@/lib/stages";
import { computeProgress } from "@/lib/storage";
import { Pipeline, ProgressBar } from "@/components/Pipeline";

export default function ExamplePage() {
  const project = getExampleProject();
  const progress = computeProgress(project);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
        Worked example · read only
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">{project.title}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        A complete fictional but realistic review for the{" "}
        <strong>Watch</strong> step of learn-by-doing. Take the guided tour first,
        open any stage (Watch tab shows annotated fields), then create your own
        project to <strong>Do</strong> and <strong>Teach</strong>.
      </p>

      <div className="mt-6 max-w-sm">
        <ProgressBar percent={progress.percent} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        <Pipeline project={project} basePath="/example" />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/example/tour"
          className="inline-flex rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Start guided tour (Watch)
        </Link>
        <Link
          href="/example/question"
          className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
        >
          Browse stage 1
        </Link>
        <Link
          href="/workspace"
          className="inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Do your own project
        </Link>
      </div>

      <ul className="mt-8 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {STAGE_ORDER.map((id) => {
          const s = getStage(id);
          const st = project.stages[id]?.status || "not_started";
          return (
            <li key={id}>
              <Link
                href={`/example/${id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {s.number}. {s.title}
                  </p>
                  <p className="text-xs text-slate-500">{s.summary}</p>
                </div>
                <span className="shrink-0 rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-semibold text-teal-800 capitalize">
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
