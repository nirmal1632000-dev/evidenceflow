"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  computeThesisProgress,
  createThesisProject,
  deleteThesisProject,
  listThesisProjects,
  suggestThesisFocus,
  type ThesisProject,
} from "@/lib/thesis";

export default function ThesisIndexPage() {
  const [projects, setProjects] = useState<ThesisProject[]>([]);
  const [title, setTitle] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [degree, setDegree] = useState("MD/MS thesis");
  const [institution, setInstitution] = useState("");

  useEffect(() => {
    setProjects(listThesisProjects());
  }, []);

  function refresh() {
    setProjects(listThesisProjects());
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const p = createThesisProject({
      title: title || "My residency thesis",
      specialty,
      degree,
      institution,
    });
    window.location.href = `/thesis/${p.id}`;
  }

  return (
    <div className="mx-auto max-w-2xl px-3 py-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
        Residents · roadmap
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
        Thesis progress guide
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Track your thesis from topic and protocol through data, writing,
        submission, viva, and publication — so you always know the next move
        when you feel stuck. Stored in this browser (local).
      </p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">12 stages</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Topic → Mentor → Protocol → Ethics → Literature → Methods → Data →
          Analysis → Writing → Submission → Defense → Publication. Each stage
          has a checklist, “done looks like”, and stuck tips.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Pair with an EvidenceFlow design track (case, cohort, RCT, SR…) for
          methods detail, then export a journal Word draft when you write the
          paper.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="mt-8 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <h2 className="font-semibold text-slate-900">Start a thesis roadmap</h2>
        <label className="block text-sm">
          <span className="font-medium text-slate-800">Working title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Glycaemic control after X protocol in type 2 DM"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-slate-800">Degree</span>
            <input
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-800">Specialty</span>
            <input
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g. Medicine"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
            />
          </label>
        </div>
        <label className="block text-sm">
          <span className="font-medium text-slate-800">Institution (optional)</span>
          <input
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white sm:w-auto sm:px-6"
        >
          Create roadmap
        </button>
      </form>

      <section className="mt-10">
        <h2 className="font-semibold text-slate-900">Your roadmaps</h2>
        {projects.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No thesis roadmaps yet. Create one above.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {projects.map((p) => {
              const prog = computeThesisProgress(p);
              const focus = suggestThesisFocus(p);
              return (
                <li key={p.id} className="px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/thesis/${p.id}`}
                        className="font-medium text-slate-900 hover:text-teal-800"
                      >
                        {p.title}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {prog.percent}% stages · focus: {focus.shortTitle}
                        {p.specialty ? ` · ${p.specialty}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/thesis/${p.id}/${focus.id}`}
                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Continue
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Delete this thesis roadmap?")) {
                            deleteThesisProject(p.id);
                            refresh();
                          }
                        }}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600"
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
