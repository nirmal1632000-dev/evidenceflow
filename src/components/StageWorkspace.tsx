"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getNextStage,
  getPrevStage,
  getStage,
  buildProtocolMarkdown,
  buildFullExportMarkdown,
} from "@/lib/stages";
import {
  computeProgress,
  getProject,
  markStageComplete,
  saveStageData,
} from "@/lib/storage";
import {
  cloudGetProject,
  cloudMarkStageComplete,
  cloudSaveStageData,
  isSupabaseConfigured,
  subscribeProject,
} from "@/lib/cloud";
import type { Project, StageId, StorageMode } from "@/lib/types";
import type { ExtractedStudy } from "@/lib/studies";
import { Pipeline, ProgressBar } from "./Pipeline";
import { Quiz } from "./Quiz";
import { PrismaFlow } from "./PrismaFlow";
import { TeamNotes } from "./TeamNotes";
import { DualReviewBanner } from "./DualReviewBanner";
import { StudyTable } from "./StudyTable";
import { PoolDecision } from "./PoolDecision";
import { RobGrid } from "./RobGrid";
import { KappaCalc } from "./KappaCalc";
import { PrismaChecklist } from "./PrismaChecklist";
import { SearchBuilder } from "./SearchBuilder";
import { GradeHelper } from "./GradeHelper";
import { PrintPack } from "./PrintPack";
import { EffectConverter } from "./EffectConverter";
import { parseStudies } from "@/lib/studies";
import { openMaCalculatorFromStudies } from "@/lib/study-to-ma";
import type { WdtMode } from "@/lib/pedagogy";
import type { RobGridMap } from "@/lib/rob";
import { PresenceBanner } from "./PresenceBanner";
import { WdtTabs } from "./WdtTabs";
import { WatchPanel } from "./WatchPanel";
import { TeachPanel } from "./TeachPanel";
import { ExportMenu } from "./ExportMenu";

function ProcessChecklist({
  stageId,
  checked,
  onToggle,
  readOnly,
  steps,
}: {
  stageId: StageId;
  checked: string[];
  onToggle: (id: string) => void;
  readOnly: boolean;
  steps: { id: string; label: string; detail: string }[];
}) {
  if (!steps.length) return null;
  const done = steps.filter((s) => checked.includes(s.id)).length;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-900">Process checklist</h2>
        <span className="text-xs text-slate-500">
          {done}/{steps.length} done
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Follow these in order for a rigorous SR. Tick as your team completes them.
      </p>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => {
          const isOn = checked.includes(step.id);
          return (
            <li key={step.id} className="flex gap-3 text-sm">
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onToggle(step.id)}
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                  isOn
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-slate-300 bg-white"
                } disabled:opacity-70`}
                aria-label={`Toggle ${step.label}`}
              >
                {isOn ? "✓" : i + 1}
              </button>
              <div>
                <p
                  className={`font-medium ${
                    isOn ? "text-slate-500 line-through" : "text-slate-900"
                  }`}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{step.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-[10px] text-slate-400">Stage key: {stageId}</p>
    </div>
  );
}

export function StageWorkspace({
  projectId,
  stageId,
  readOnly = false,
  initialProject,
  shareBasePath,
}: {
  projectId: string;
  stageId: StageId;
  readOnly?: boolean;
  initialProject?: Project;
  /** Override stage links (e.g. /share/TOKEN/stage) */
  shareBasePath?: string;
}) {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode") as StorageMode | null;
  const stage = getStage(stageId);
  const [mode, setMode] = useState<StorageMode>(
    initialProject?.mode || modeParam || "local"
  );
  const [project, setProject] = useState<Project | null>(initialProject ?? null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [checkedSteps, setCheckedSteps] = useState<string[]>([]);
  const [savedFlash, setSavedFlash] = useState(false);
  const [showLearn, setShowLearn] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [wdtMode, setWdtMode] = useState<WdtMode>(
    readOnly && !shareBasePath ? "watch" : "do"
  );

  // Reset pedagogy tab when changing stages
  useEffect(() => {
    setWdtMode(readOnly && !shareBasePath ? "watch" : "do");
  }, [stageId, readOnly, shareBasePath]);

  const applyProject = useCallback(
    (p: Project) => {
      setProject(p);
      const data = p.stages[stageId]?.data || {};
      const next: Record<string, string> = {};
      for (const f of stage.fields) {
        const v = data[f.key];
        next[f.key] = v === undefined || v === null ? "" : String(v);
      }
      setForm(next);
      const steps = data._processChecks;
      if (Array.isArray(steps)) setCheckedSteps(steps.map(String));
      else if (typeof steps === "string" && steps) {
        try {
          const parsed = JSON.parse(steps);
          if (Array.isArray(parsed)) setCheckedSteps(parsed.map(String));
        } catch {
          setCheckedSteps([]);
        }
      } else setCheckedSteps([]);
    },
    [stage.fields, stageId]
  );

  const load = useCallback(async () => {
    if (initialProject) {
      applyProject(initialProject);
      return;
    }
    setError("");

    const preferCloud =
      modeParam === "cloud" ||
      (modeParam !== "local" && isSupabaseConfigured());

    if (preferCloud && isSupabaseConfigured()) {
      try {
        const cloud = await cloudGetProject(projectId);
        if (cloud) {
          setMode("cloud");
          applyProject(cloud);
          setLastSynced(new Date().toLocaleTimeString());
          return;
        }
      } catch (e) {
        if (modeParam === "cloud") {
          setError(e instanceof Error ? e.message : "Load failed");
          return;
        }
      }
    }

    const local = getProject(projectId);
    if (local) {
      setMode("local");
      applyProject({ ...local, mode: "local" });
      return;
    }
    setProject(null);
    setError("Project not found");
  }, [applyProject, initialProject, modeParam, projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  // Realtime + light poll fallback for team updates
  useEffect(() => {
    if (readOnly || mode !== "cloud") return;
    const unsub = subscribeProject(projectId, () => {
      void load();
    });
    const t = setInterval(() => void load(), 30000);
    return () => {
      unsub();
      clearInterval(t);
    };
  }, [load, mode, readOnly, projectId]);

  const progress = useMemo(
    () =>
      project
        ? computeProgress(project)
        : { percent: 0, completed: 0, total: 0 },
    [project]
  );

  const prev = getPrevStage(stageId);
  const next = getNextStage(stageId);
  const qs = shareBasePath
    ? ""
    : mode === "cloud"
      ? "?mode=cloud"
      : "?mode=local";
  const basePath = shareBasePath
    ? shareBasePath
    : readOnly
      ? "/example"
      : `/workspace/projects/${projectId}`;

  const canEdit =
    !readOnly &&
    (mode === "local" ||
      project?.myRole === "owner" ||
      project?.myRole === "collaborator" ||
      (mode === "cloud" && !project?.myRole));

  async function persist(
    extras?: Parameters<typeof saveStageData>[3],
    dataOverride?: Record<string, string>,
    stepsOverride?: string[]
  ) {
    if (!canEdit || !project) return;
    setSaving(true);
    setError("");
    try {
      const source = dataOverride ?? form;
      const data: Record<string, string | number | string[]> = {};
      for (const f of stage.fields) {
        const raw = source[f.key] ?? "";
        if (f.type === "number" && raw !== "") data[f.key] = Number(raw);
        else data[f.key] = raw;
      }
      data._processChecks = stepsOverride ?? checkedSteps;

      if (mode === "cloud") {
        const updated = await cloudSaveStageData(
          projectId,
          stageId,
          data,
          extras
        );
        applyProject(updated);
        setLastSynced(new Date().toLocaleTimeString());
      } else {
        const updated = saveStageData(projectId, stageId, data, extras);
        if (updated) applyProject({ ...updated, mode: "local" });
      }
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete() {
    if (!canEdit) return;
    await persist({ status: "complete", lessonRead: true });
    if (mode === "cloud") {
      const updated = await cloudMarkStageComplete(projectId, stageId);
      applyProject(updated);
    } else {
      const updated = markStageComplete(projectId, stageId);
      if (updated) applyProject({ ...updated, mode: "local" });
    }
  }

  function toggleStep(id: string) {
    if (!canEdit) return;
    const nextSteps = checkedSteps.includes(id)
      ? checkedSteps.filter((x) => x !== id)
      : [...checkedSteps, id];
    setCheckedSteps(nextSteps);
    void persist(undefined, undefined, nextSteps);
  }

  if (error && !project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-600">{error}</p>
        <Link href="/workspace" className="mt-4 inline-block text-teal-700 underline">
          Back to workspace
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  const processSteps = stage.processSteps ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      {readOnly && !shareBasePath && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Read-only worked example — create a project in Workspace to edit.
        </div>
      )}

      {mode === "cloud" && !readOnly && (
        <PresenceBanner
          projectId={projectId}
          stageId={stageId}
          enabled
        />
      )}

      {mode === "cloud" && !readOnly && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm text-teal-950">
          <span>
            <strong>Team sync on</strong>
            {project.inviteCode && (
              <>
                {" "}
                · Invite <span className="font-mono font-bold">{project.inviteCode}</span>
              </>
            )}
            {lastSynced && (
              <span className="text-teal-800/70"> · Synced {lastSynced}</span>
            )}
          </span>
          <button
            type="button"
            onClick={() => void load()}
            className="text-xs font-semibold underline"
          >
            Pull latest
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
            {readOnly ? "Example project" : mode === "cloud" ? "Team workspace" : "Local workspace"}
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            {project.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Stage {stage.number}: {stage.title}
          </p>
        </div>
        <div className="w-full sm:max-w-xs">
          <ProgressBar percent={progress.percent} />
        </div>
      </div>

      <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/80 p-3">
        <Pipeline
          project={project}
          activeStage={stageId}
          basePath={basePath}
          compact
          query={readOnly ? "" : qs}
        />
      </div>

      {error && (
        <p className="mb-4 text-sm text-rose-600">{error}</p>
      )}

      <div className="mb-6 max-w-xl">
        <WdtTabs
          mode={wdtMode}
          onChange={setWdtMode}
          stageData={project.stages[stageId]?.data}
        />
      </div>

      {wdtMode === "watch" && (
        <div className="max-w-3xl">
          <WatchPanel stageId={stageId} />
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setWdtMode("do")}
              className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Continue to Do →
            </button>
          </div>
        </div>
      )}

      {wdtMode === "teach" && (
        <div className="max-w-3xl">
          <TeachPanel
            stageId={stageId}
            data={project.stages[stageId]?.data}
            readOnly={!canEdit}
            onSave={async (patch) => {
              if (mode === "cloud") {
                const updated = await cloudSaveStageData(
                  projectId,
                  stageId,
                  patch
                );
                applyProject(updated);
              } else {
                const updated = saveStageData(projectId, stageId, patch);
                if (updated) applyProject({ ...updated, mode: "local" });
              }
            }}
          />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setWdtMode("do")}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
            >
              ← Back to Do
            </button>
            {next && (
              <Link
                href={`${basePath}/${next.id}${readOnly && !shareBasePath ? "" : qs}`}
                className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Next stage →
              </Link>
            )}
          </div>
        </div>
      )}

      {wdtMode === "do" && (
      <div className="grid gap-6 lg:grid-cols-5">
        <aside className="space-y-4 lg:col-span-2">
          <DualReviewBanner stageId={stageId} />

          <ProcessChecklist
            stageId={stageId}
            steps={processSteps}
            checked={checkedSteps}
            onToggle={toggleStep}
            readOnly={!canEdit}
          />

          <TeamNotes
            value={String(project.stages[stageId]?.data?._teamNotes || "")}
            readOnly={!canEdit}
            lastHint={
              project.stages[stageId]?.updatedAt
                ? `Stage data updated ${new Date(
                    project.stages[stageId]!.updatedAt!
                  ).toLocaleString()}`
                : undefined
            }
            onSave={async (text) => {
              const nextForm = { ...form };
              setForm(nextForm);
              // persist team notes into stage data
              if (mode === "cloud") {
                const updated = await cloudSaveStageData(projectId, stageId, {
                  _teamNotes: text,
                });
                applyProject(updated);
              } else {
                const updated = saveStageData(projectId, stageId, {
                  _teamNotes: text,
                });
                if (updated) applyProject({ ...updated, mode: "local" });
              }
              setSavedFlash(true);
              setTimeout(() => setSavedFlash(false), 1500);
            }}
          />

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-slate-900">Learn this step</h2>
              <button
                type="button"
                onClick={() => setShowLearn((s) => !s)}
                className="text-xs text-teal-700"
              >
                {showLearn ? "Collapse" : "Expand"}
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-600">{stage.summary}</p>
            <p className="mt-2 text-xs text-slate-400">
              Est. time: {stage.learn.timeEstimate}
            </p>

            {showLearn && (
              <div className="mt-4 space-y-4 text-sm text-slate-700">
                <div>
                  <h3 className="font-medium text-slate-900">Why it matters</h3>
                  <p className="mt-1 leading-relaxed">{stage.learn.why}</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Key concepts</h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {stage.learn.concepts.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-rose-900">Common mistakes</h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-rose-950/80">
                    {stage.learn.commonMistakes.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => void persist({ lessonRead: true })}
                    className="text-xs font-medium text-teal-700 underline"
                  >
                    Mark lesson as read
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="font-semibold text-slate-900">Software for this stage</h2>
            <ul className="mt-3 space-y-3">
              {stage.software.map((s) => (
                <li key={s.name} className="text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-800">{s.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        s.free
                          ? "bg-teal-50 text-teal-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {s.free ? "Free / freemium" : "Paid / institutional"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-slate-600">{s.when}</p>
                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-teal-700 underline"
                    >
                      Open site
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {stage.quiz.length > 0 && (
            <Quiz
              questions={stage.quiz}
              onPassed={() => {
                if (canEdit)
                  void persist({ quizPassed: true, lessonRead: true });
              }}
            />
          )}
        </aside>

        <section className="lg:col-span-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold text-slate-900">Shared workspace fields</h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  project.stages[stageId]?.status === "complete"
                    ? "bg-teal-100 text-teal-800"
                    : project.stages[stageId]?.status === "in_progress"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {project.stages[stageId]?.status?.replace("_", " ") ||
                  "not started"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {mode === "cloud"
                ? "Everyone on the team sees these fields. Save often; page pulls latest every ~15s."
                : "Stored in this browser only. Switch to a team project for multi-device work."}
            </p>

            <div className="mt-6 space-y-5">
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
                      disabled={!canEdit}
                      value={form[field.key] || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field.key]: e.target.value }))
                      }
                      onBlur={() => void persist()}
                      placeholder={field.placeholder}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 outline-none ring-teal-600/30 placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:opacity-70"
                    />
                  ) : field.type === "select" ? (
                    <select
                      disabled={!canEdit}
                      value={form[field.key] || ""}
                      onChange={(e) => {
                        const nextForm = {
                          ...form,
                          [field.key]: e.target.value,
                        };
                        setForm(nextForm);
                        void persist(undefined, nextForm);
                      }}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-teal-600/30 disabled:opacity-70"
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
                      type={field.type === "number" ? "number" : "text"}
                      disabled={!canEdit}
                      value={form[field.key] || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field.key]: e.target.value }))
                      }
                      onBlur={() => void persist()}
                      placeholder={field.placeholder}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-teal-600/30 disabled:opacity-70"
                    />
                  )}
                </label>
              ))}
            </div>

            {stageId === "search" && (
              <div className="mt-6">
                <SearchBuilder
                  readOnly={!canEdit}
                  onApply={(blocks, sample) => {
                    const nextForm = {
                      ...form,
                      conceptBlocks: blocks,
                      sampleString: sample,
                    };
                    setForm(nextForm);
                    void persist(undefined, nextForm);
                  }}
                />
              </div>
            )}

            {stageId === "screening" && (
              <div className="mt-6 space-y-4">
                <PrismaFlow
                  data={{
                    identified: form.identified,
                    duplicates: form.duplicates,
                    titleAbstractScreened: form.titleAbstractScreened,
                    fullTextAssessed: form.fullTextAssessed,
                    included: form.included,
                  }}
                />
                <KappaCalc />
              </div>
            )}

            {(stageId === "extraction" || stageId === "rob") && (
              <div className="mt-6 space-y-4">
                {stageId === "extraction" && <EffectConverter />}
                <StudyTable
                  raw={project.stages.extraction?.data?._studies}
                  readOnly={!canEdit || stageId === "rob"}
                  projectId={projectId}
                  projectTitle={project.title}
                  onChange={async (studies: ExtractedStudy[]) => {
                    if (mode === "cloud") {
                      const updated = await cloudSaveStageData(
                        projectId,
                        "extraction",
                        { _studies: studies },
                        { status: "in_progress" }
                      );
                      applyProject(updated);
                    } else {
                      const updated = saveStageData(
                        projectId,
                        "extraction",
                        { _studies: studies },
                        { status: "in_progress" }
                      );
                      if (updated) applyProject({ ...updated, mode: "local" });
                    }
                    setSavedFlash(true);
                    setTimeout(() => setSavedFlash(false), 1500);
                  }}
                />
                {stageId === "rob" && (
                  <RobGrid
                    studies={parseStudies(
                      project.stages.extraction?.data?._studies
                    )}
                    raw={project.stages.rob?.data?._robGrid}
                    readOnly={!canEdit}
                    onChange={async (grid: RobGridMap) => {
                      if (mode === "cloud") {
                        const updated = await cloudSaveStageData(
                          projectId,
                          "rob",
                          { _robGrid: grid },
                          { status: "in_progress" }
                        );
                        applyProject(updated);
                      } else {
                        const updated = saveStageData(
                          projectId,
                          "rob",
                          { _robGrid: grid },
                          { status: "in_progress" }
                        );
                        if (updated)
                          applyProject({ ...updated, mode: "local" });
                      }
                      setSavedFlash(true);
                      setTimeout(() => setSavedFlash(false), 1500);
                    }}
                  />
                )}
              </div>
            )}

            {(stageId === "synthesis" || stageId === "metaanalysis") && (
              <div className="mt-6 space-y-4">
                <PoolDecision />
                {stageId === "metaanalysis" && (
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-sm text-indigo-950">
                    <p className="font-semibold">Practice tools</p>
                    <p className="mt-1 text-indigo-900/80">
                      Pull studies from your extraction table into the calculators, or
                      open them empty. Also try{" "}
                      <a
                        href="/tools/sensitivity"
                        className="font-medium underline"
                      >
                        leave-one-out / funnel
                      </a>
                      , then paste pooled results into the fields above.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-indigo-700 px-3 py-1.5 text-xs font-semibold text-white"
                        onClick={() => {
                          const studies = parseStudies(
                            project.stages.extraction?.data?._studies
                          );
                          const result = openMaCalculatorFromStudies(studies, {
                            projectId,
                            projectTitle: project.title,
                          });
                          if (!result.ok) {
                            alert(result.message);
                            return;
                          }
                          window.location.href = result.href;
                        }}
                      >
                        Extraction → MA calculator
                      </button>
                      <a
                        href="/tools/calculator"
                        className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-900"
                      >
                        Open empty calculator
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {stageId === "grade" && (
              <div className="mt-6">
                <GradeHelper
                  readOnly={!canEdit}
                  onApply={(text) => {
                    const prev = form.certaintyRatings || "";
                    const nextForm = {
                      ...form,
                      certaintyRatings: prev
                        ? `${prev}\n${text}`
                        : text,
                    };
                    setForm(nextForm);
                    void persist(undefined, nextForm);
                  }}
                />
              </div>
            )}

            {stageId === "reporting" && (
              <div className="mt-6 space-y-4">
                <PrismaChecklist
                  raw={project.stages.reporting?.data?._prismaChecks}
                  readOnly={!canEdit}
                  onChange={async (ids) => {
                    if (mode === "cloud") {
                      const updated = await cloudSaveStageData(
                        projectId,
                        "reporting",
                        { _prismaChecks: ids },
                        { status: "in_progress" }
                      );
                      applyProject(updated);
                    } else {
                      const updated = saveStageData(
                        projectId,
                        "reporting",
                        { _prismaChecks: ids },
                        { status: "in_progress" }
                      );
                      if (updated) applyProject({ ...updated, mode: "local" });
                    }
                    setSavedFlash(true);
                    setTimeout(() => setSavedFlash(false), 1500);
                  }}
                />
                <PrintPack project={project} />
              </div>
            )}

            {canEdit && (
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void persist({ status: "in_progress" })}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save progress"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleComplete()}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  Mark stage complete
                </button>
                {savedFlash && (
                  <span className="text-sm text-teal-700">Saved</span>
                )}
              </div>
            )}

            <p className="mt-4 text-sm text-slate-500">{stage.nextHint}</p>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              {prev ? (
                <Link
                  href={`${basePath}/${prev.id}${readOnly && !shareBasePath ? "" : qs}`}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  ← {prev.shortTitle}
                </Link>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => setWdtMode("teach")}
                className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-900"
              >
                Teach this stage →
              </button>
              {next ? (
                <Link
                  href={`${basePath}/${next.id}${readOnly && !shareBasePath ? "" : qs}`}
                  className="text-sm font-medium text-teal-700 hover:text-teal-900"
                >
                  {next.shortTitle} →
                </Link>
              ) : (
                <Link
                  href={
                    shareBasePath
                      ? shareBasePath.replace(/\/stage$/, "")
                      : readOnly
                        ? "/workspace"
                        : `/workspace/projects/${projectId}${qs}`
                  }
                  className="text-sm font-medium text-teal-700"
                >
                  Project home →
                </Link>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Export</h3>
              <p className="mt-1 text-xs text-slate-500">
                Formatted Word drafts from current project data. Markdown under
                Advanced.
              </p>
              <ExportMenu
                className="mt-3"
                compact
                title={project.title}
                items={[
                  {
                    id: "protocol",
                    label: "Protocol",
                    suffix: "protocol",
                    markdown: async () => {
                      await persist();
                      const p =
                        mode === "cloud"
                          ? await cloudGetProject(projectId)
                          : getProject(projectId);
                      return buildProtocolMarkdown(p || project);
                    },
                    variant: "secondary",
                  },
                  {
                    id: "full",
                    label: "Full package",
                    suffix: "full",
                    markdown: async () => {
                      await persist();
                      const p =
                        mode === "cloud"
                          ? await cloudGetProject(projectId)
                          : getProject(projectId);
                      return buildFullExportMarkdown(p || project);
                    },
                    variant: "primary",
                  },
                ]}
              />
            </div>
          )}
        </section>
      </div>
      )}
    </div>
  );
}
