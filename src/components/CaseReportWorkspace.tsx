"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CASE_STAGE_ORDER,
  CARE_ITEMS,
  buildCaseExportMarkdown,
  computeCaseProgress,
  getCaseProject,
  getCaseStage,
  getExampleCaseProject,
  getNextCaseStage,
  getPrevCaseStage,
  markCaseStageComplete,
  saveCaseStageData,
  type CaseProject,
  type CaseStageId,
} from "@/lib/case-report";
import { ExportMenu } from "./ExportMenu";

type Wdt = "watch" | "do";

export function CaseReportWorkspace({
  projectId,
  stageId,
  readOnly = false,
}: {
  projectId: string;
  stageId: CaseStageId;
  readOnly?: boolean;
}) {
  const stage = getCaseStage(stageId);
  const [project, setProject] = useState<CaseProject | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [careChecks, setCareChecks] = useState<string[]>([]);
  const [wdt, setWdt] = useState<Wdt>(readOnly ? "watch" : "do");
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    if (readOnly && projectId === "example-case-report") {
      const ex = getExampleCaseProject();
      setProject(ex);
      applyStage(ex);
      return;
    }
    const p = getCaseProject(projectId);
    if (!p) {
      setError("Project not found");
      setProject(null);
      return;
    }
    setProject(p);
    applyStage(p);
  }, [projectId, readOnly, stageId]);

  function applyStage(p: CaseProject) {
    const data = p.stages[stageId]?.data || {};
    const next: Record<string, string> = {};
    for (const f of stage.fields) {
      next[f.key] = data[f.key] != null ? String(data[f.key]) : "";
    }
    setForm(next);
    const checks = data._careChecks;
    setCareChecks(Array.isArray(checks) ? checks.map(String) : []);
  }

  useEffect(() => {
    load();
    setWdt(readOnly ? "watch" : "do");
  }, [load, readOnly, stageId]);

  const progress = useMemo(
    () =>
      project
        ? computeCaseProgress(project)
        : { percent: 0, completed: 0, total: CASE_STAGE_ORDER.length },
    [project]
  );

  const prev = getPrevCaseStage(stageId);
  const next = getNextCaseStage(stageId);
  const base = readOnly
    ? "/designs/case-report/example"
    : `/designs/case-report/${projectId}`;

  async function persist(
    extraData?: Record<string, unknown>,
    extras?: Parameters<typeof saveCaseStageData>[3]
  ) {
    if (readOnly || !project) return;
    setSaving(true);
    setError("");
    try {
      const data: Record<string, unknown> = { ...form };
      if (stageId === "reporting") data._careChecks = careChecks;
      if (extraData) Object.assign(data, extraData);
      const updated = saveCaseStageData(projectId, stageId, data, extras);
      if (updated) setProject(updated);
      setFlash(true);
      setTimeout(() => setFlash(false), 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (error && !project) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-600">
        {error}.{" "}
        <Link href="/designs/case-report" className="text-teal-700 underline">
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

  return (
    <div className="mx-auto max-w-3xl px-3 py-6 sm:px-6 sm:py-8">
      {readOnly && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Read-only example — create your own project to edit.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Case {project.mode === "series" ? "series" : "report"} · Watch · Do
          </p>
          <h1 className="mt-1 truncate text-xl font-semibold text-slate-900 sm:text-2xl">
            {project.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Stage {stage.number}: {stage.title}
          </p>
        </div>
        <div className="w-full sm:max-w-[10rem]">
          <div className="mb-1 flex justify-between text-[11px] text-slate-500">
            <span>Progress</span>
            <span>{progress.percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-teal-600"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stage chips — horizontal scroll on mobile */}
      <div className="mt-4 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2">
        {CASE_STAGE_ORDER.map((id) => {
          const s = getCaseStage(id);
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
                    : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {s.number}. {s.shortTitle}
            </Link>
          );
        })}
      </div>

      {/* WDT tabs */}
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-white p-1">
        {(
          [
            ["watch", "Watch", "bg-amber-500"],
            ["do", "Do", "bg-teal-600"],
          ] as const
        ).map(([id, label, activeBg]) => (
          <button
            key={id}
            type="button"
            onClick={() => setWdt(id)}
            className={`rounded-lg py-2.5 text-sm font-bold ${
              wdt === id ? `${activeBg} text-white` : "text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      {wdt === "watch" && (
        <div className="mt-6 space-y-4">
          <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <h2 className="font-semibold text-amber-950">Why this stage</h2>
            <p className="mt-2 text-sm leading-relaxed text-amber-950/90">
              {stage.learn.why}
            </p>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="font-semibold text-slate-900">Concepts</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {stage.learn.concepts.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
            <h2 className="font-semibold text-rose-950">Common mistakes</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-950/90">
              {stage.learn.commonMistakes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
          {!readOnly && (
            <button
              type="button"
              onClick={() => setWdt("do")}
              className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white sm:w-auto sm:px-5"
            >
              Continue to Do →
            </button>
          )}
        </div>
      )}


      {wdt === "do" && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-slate-600">{stage.summary}</p>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            {stage.fields.map((field) => (
              <label key={field.key} className="block">
                <span className="text-sm font-medium text-slate-800">
                  {field.label}
                  {field.required && <span className="text-rose-500"> *</span>}
                </span>
                {field.help && (
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {field.help}
                  </span>
                )}
                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    disabled={readOnly}
                    value={form[field.key] || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field.key]: e.target.value }))
                    }
                    onBlur={() => void persist()}
                    placeholder={field.placeholder}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                ) : field.type === "select" ? (
                  <select
                    disabled={readOnly}
                    value={form[field.key] || ""}
                    onChange={(e) => {
                      const nextForm = { ...form, [field.key]: e.target.value };
                      setForm(nextForm);
                      void persist();
                    }}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  >
                    <option value="">Select…</option>
                    {field.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    disabled={readOnly}
                    value={form[field.key] || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field.key]: e.target.value }))
                    }
                    onBlur={() => void persist()}
                    placeholder={field.placeholder}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                )}
              </label>
            ))}

            {stageId === "reporting" && (
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  CARE-inspired checklist
                </h3>
                <ul className="mt-3 space-y-2">
                  {CARE_ITEMS.map((item) => {
                    const on = careChecks.includes(item.id);
                    return (
                      <li key={item.id}>
                        <label className="flex gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            disabled={readOnly}
                            checked={on}
                            onChange={() => {
                              const next = on
                                ? careChecks.filter((x) => x !== item.id)
                                : [...careChecks, item.id];
                              setCareChecks(next);
                              void persist({ _careChecks: next });
                            }}
                            className="mt-0.5"
                          />
                          <span>
                            <span className="text-[10px] font-bold uppercase text-slate-400">
                              {item.section}
                            </span>{" "}
                            {item.label}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {!readOnly && (
              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void persist(undefined, { status: "in_progress" })}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    void persist(undefined, { status: "complete", lessonRead: true });
                    markCaseStageComplete(projectId, stageId);
                    load();
                  }}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Mark complete
                </button>
                {flash && (
                  <span className="self-center text-sm text-teal-700">Saved</span>
                )}
              </div>
            )}
            <ExportMenu
              className="mt-3 w-full"
              compact
              title={project.title}
              items={[
                {
                  id: "draft",
                  label: "Case draft",
                  markdown: () =>
                    buildCaseExportMarkdown(
                      getCaseProject(projectId) || project
                    ),
                  variant: "primary",
                },
              ]}
            />
          </div>

          <p className="text-sm text-slate-500">{stage.nextHint}</p>
          <div className="flex flex-wrap items-center justify-between gap-2">
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
              <Link
                href={readOnly ? "/designs/case-report" : `/designs/case-report/${projectId}`}
                className="text-sm font-medium text-teal-700"
              >
                Project home →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
