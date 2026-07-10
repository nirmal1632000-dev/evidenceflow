"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  computeCohortProgress,
  createCohortProject,
  deleteCohortProject,
  getCohortStage,
  listCohortProjects,
  type CohortProject,
} from "@/lib/cohort";

export default function CohortIndexPage() {
  const [projects, setProjects] = useState<CohortProject[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setProjects(listCohortProjects());
  }, []);

  function refresh() {
    setProjects(listCohortProjects());
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const p = createCohortProject(title || "My cohort study");
    window.location.href = `/designs/cohort/${p.id}/question`;
  }

  return (
    <div className="mx-auto max-w-2xl px-3 py-8 sm:px-6">
      <Link href="/designs" className="text-sm text-teal-700 underline">
        ← Designs hub
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900">
        Cohort study
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Learn by planning a STROBE-inspired cohort: exposure first, outcomes over
        time, confounding, and follow-up. 9 stages · Watch · Do · local
        storage.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/designs/cohort/example/question"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm font-semibold text-amber-950"
        >
          Watch example cohort
        </Link>
        <Link
          href="/designs/appraise?design=cohort"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold"
        >
          Appraisal flags
        </Link>
      </div>

      <form
        onSubmit={handleCreate}
        className="mt-8 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <h2 className="font-semibold text-slate-900">New project</h2>
        <label className="block text-sm">
          <span className="font-medium text-slate-800">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Activity and incident hypertension"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white sm:w-auto sm:px-6"
        >
          Create &amp; start Stage 1
        </button>
      </form>

      <section className="mt-10">
        <h2 className="font-semibold text-slate-900">Your projects</h2>
        {projects.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No projects yet on this device.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {projects.map((p) => {
              const prog = computeCohortProgress(p);
              const stage = getCohortStage(p.currentStage);
              return (
                <li
                  key={p.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/designs/cohort/${p.id}`}
                        className="font-medium text-slate-900 hover:text-teal-800"
                      >
                        {p.title}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">
                        Stage {stage.number} {stage.shortTitle} · {prog.percent}%
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/designs/cohort/${p.id}/${p.currentStage}`}
                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Continue
                      </Link>
                      <button
                        type="button"
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700"
                        onClick={() => {
                          if (confirm(`Delete “${p.title}”?`)) {
                            deleteCohortProject(p.id);
                            refresh();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
