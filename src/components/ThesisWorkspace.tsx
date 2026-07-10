"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  THESIS_STAGE_ORDER,
  buildThesisExportMarkdown,
  computeThesisProgress,
  getNextThesisStage,
  getPrevThesisStage,
  getThesisProject,
  getThesisStage,
  saveThesisStage,
  suggestThesisFocus,
  type ThesisProject,
  type ThesisStageId,
  type ThesisStageStatus,
} from "@/lib/thesis";
import { ExportMenu } from "./ExportMenu";

const STATUS_OPTS: { value: ThesisStageStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "blocked", label: "Blocked" },
  { value: "complete", label: "Complete" },
];

export function ThesisStageWorkspace({
  projectId,
  stageId,
}: {
  projectId: string;
  stageId: ThesisStageId;
}) {
  const stage = getThesisStage(stageId);
  const [project, setProject] = useState<ThesisProject | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [checks, setChecks] = useState<string[]>([]);
  const [status, setStatus] = useState<ThesisStageStatus>("not_started");
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    const p = getThesisProject(projectId);
    if (!p) {
      setError("Thesis not found");
      setProject(null);
      return;
    }
    setProject(p);
    const st = p.stages[stageId];
    setForm({ ...(st?.data || {}) });
    setChecks([...(st?.checks || [])]);
    setStatus(st?.status || "not_started");
  }, [projectId, stageId]);

  useEffect(() => {
    load();
  }, [load]);

  function persist(nextStatus?: ThesisStageStatus) {
    const updated = saveThesisStage(projectId, stageId, {
      data: form,
      checks,
      status: nextStatus ?? status,
    });
    if (updated) {
      setProject(updated);
      if (nextStatus) setStatus(nextStatus);
      setFlash(true);
      setTimeout(() => setFlash(false), 1200);
    }
  }

  const prev = getPrevThesisStage(stageId);
  const next = getNextThesisStage(stageId);
  const base = `/thesis/${projectId}`;

  if (error && !project) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-600">
        {error}.{" "}
        <Link href="/thesis" className="text-teal-700 underline">
          Back
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  const progress = computeThesisProgress(project);

  return (
    <div className="mx-auto max-w-3xl px-3 py-6 sm:px-6 sm:py-8">
      <Link href={base} className="text-sm text-teal-700 underline">
        ← Thesis dashboard
      </Link>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-teal-700">
        Thesis · {stage.phase} · Stage {stage.number}/12
      </p>
      <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
        {stage.title}
      </h1>
      <p className="mt-1 text-sm text-slate-600">{stage.summary}</p>
      <p className="mt-2 text-xs text-slate-500">
        {project.title} · overall {progress.percent}% stages complete
      </p>

      <div className="mt-4 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2">
        {THESIS_STAGE_ORDER.map((id) => {
          const s = getThesisStage(id);
          const st = project.stages[id]?.status || "not_started";
          const active = id === stageId;
          return (
            <Link
              key={id}
              href={`${base}/${id}`}
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                active
                  ? "border-teal-600 bg-teal-600 text-white"
                  : st === "complete"
                    ? "border-teal-200 bg-teal-50 text-teal-900"
                    : st === "blocked"
                      ? "border-rose-200 bg-rose-50 text-rose-900"
                      : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {s.number}. {s.shortTitle}
            </Link>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/60 p-4 text-sm text-teal-950">
        <p className="font-semibold">Done looks like</p>
        <p className="mt-1 text-sm">{stage.doneLooksLike}</p>
      </div>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
        <p className="text-sm font-semibold text-amber-950">If you feel stuck</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-950/90">
          {stage.stuckTips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold text-slate-900">Progress checklist</h2>
          <label className="text-xs text-slate-600">
            Status{" "}
            <select
              value={status}
              onChange={(e) => {
                const s = e.target.value as ThesisStageStatus;
                setStatus(s);
                saveThesisStage(projectId, stageId, {
                  data: form,
                  checks,
                  status: s,
                });
                load();
              }}
              className="ml-1 rounded border border-slate-200 px-2 py-1"
            >
              {STATUS_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ul className="space-y-2">
          {stage.checklist.map((c) => {
            const on = checks.includes(c.id);
            return (
              <li key={c.id}>
                <label className="flex cursor-pointer gap-2 text-sm text-slate-800">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => {
                      const next = on
                        ? checks.filter((x) => x !== c.id)
                        : [...checks, c.id];
                      setChecks(next);
                      saveThesisStage(projectId, stageId, {
                        data: form,
                        checks: next,
                        status,
                      });
                    }}
                    className="mt-0.5"
                  />
                  <span>{c.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <h2 className="font-semibold text-slate-900">Your notes</h2>
        {stage.fields.map((f) => (
          <label key={f.key} className="block text-sm">
            <span className="font-medium text-slate-800">{f.label}</span>
            {f.type === "textarea" ? (
              <textarea
                rows={3}
                value={form[f.key] || ""}
                onChange={(e) =>
                  setForm((x) => ({ ...x, [f.key]: e.target.value }))
                }
                onBlur={() => persist()}
                placeholder={f.placeholder}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              />
            ) : (
              <input
                type={f.type === "date" ? "date" : "text"}
                value={form[f.key] || ""}
                onChange={(e) =>
                  setForm((x) => ({ ...x, [f.key]: e.target.value }))
                }
                onBlur={() => persist()}
                placeholder={f.placeholder}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              />
            )}
          </label>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => persist()}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => persist("complete")}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Mark complete
        </button>
        <button
          type="button"
          onClick={() => persist("blocked")}
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-900"
        >
          Mark blocked
        </button>
        {flash && (
          <span className="self-center text-sm text-teal-700">Saved</span>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        {prev ? (
          <Link
            href={`${base}/${prev.id}`}
            className="text-sm font-medium text-slate-600"
          >
            ← {prev.shortTitle}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`${base}/${next.id}`}
            className="text-sm font-medium text-teal-700"
          >
            {next.shortTitle} →
          </Link>
        ) : (
          <Link href={base} className="text-sm font-medium text-teal-700">
            Dashboard →
          </Link>
        )}
      </div>
    </div>
  );
}

export function ThesisDashboard({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<ThesisProject | null>(null);

  useEffect(() => {
    setProject(getThesisProject(projectId));
  }, [projectId]);

  if (!project) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-600">
        Thesis not found.{" "}
        <Link href="/thesis" className="text-teal-700 underline">
          Back
        </Link>
      </div>
    );
  }

  const progress = computeThesisProgress(project);
  const focus = suggestThesisFocus(project);
  const base = `/thesis/${projectId}`;

  const phaseGroups: { phase: string; ids: ThesisStageId[] }[] = [];
  for (const id of THESIS_STAGE_ORDER) {
    const phase = getThesisStage(id).phase;
    const last = phaseGroups[phaseGroups.length - 1];
    if (!last || last.phase !== phase) {
      phaseGroups.push({ phase, ids: [id] });
    } else {
      last.ids.push(id);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-3 py-8 sm:px-6">
      <Link href="/thesis" className="text-sm text-teal-700 underline">
        ← All theses
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900">
        {project.title}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {[project.degree, project.specialty, project.institution]
          .filter(Boolean)
          .join(" · ") || "Resident thesis roadmap"}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Stages complete
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {progress.completed}/{progress.total}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-teal-600"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Checklist items
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {progress.checkPercent}%
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {progress.checkDone} of {progress.checkTotal} ticks ·{" "}
            {progress.blocked > 0
              ? `${progress.blocked} blocked`
              : "no blocked stages"}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-semibold uppercase text-amber-800">
          Suggested focus (so you don&apos;t feel stuck)
        </p>
        <p className="mt-1 font-semibold text-amber-950">
          {focus.number}. {focus.title}
        </p>
        <p className="mt-1 text-sm text-amber-950/90">{focus.summary}</p>
        <Link
          href={`${base}/${focus.id}`}
          className="mt-3 inline-block rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Open this stage →
        </Link>
      </div>

      <div className="mt-6">
        <ExportMenu
          title={project.title}
          items={[
            {
              id: "roadmap",
              label: "Thesis roadmap",
              suffix: "thesis-roadmap",
              markdown: () => buildThesisExportMarkdown(project),
              variant: "primary",
            },
          ]}
        />
      </div>

      <div className="mt-8 space-y-6">
        {phaseGroups.map(({ phase, ids }) => (
          <section key={phase}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {phase}
            </h2>
            <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
              {ids.map((id) => {
                const s = getThesisStage(id);
                const st = project.stages[id]?.status || "not_started";
                const nCheck = project.stages[id]?.checks?.length || 0;
                return (
                  <li key={id}>
                    <Link
                      href={`${base}/${id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {s.number}. {s.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {nCheck}/{s.checklist.length} checklist ·{" "}
                          {s.doneLooksLike.slice(0, 80)}
                          {s.doneLooksLike.length > 80 ? "…" : ""}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          st === "complete"
                            ? "bg-teal-50 text-teal-800"
                            : st === "blocked"
                              ? "bg-rose-50 text-rose-800"
                              : st === "in_progress"
                                ? "bg-amber-50 text-amber-900"
                                : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {st.replace("_", " ")}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
