"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  STAGE_ORDER,
  getStage,
  buildProtocolMarkdown,
  buildFullExportMarkdown,
} from "@/lib/stages";
import { computeProgress, getProject } from "@/lib/storage";
import {
  cloudDisableShare,
  cloudEnableShare,
  cloudGetProject,
  cloudListActivity,
  cloudRegenerateInvite,
  isSupabaseConfigured,
  subscribeProject,
} from "@/lib/cloud";
import type { Project, ProjectActivity, StorageMode } from "@/lib/types";
import {
  buildMethodsMarkdown,
  buildResultsSkeletonMarkdown,
} from "@/lib/manuscript";
import { parseStudies, studiesToCsv, studiesToMarkdownTable } from "@/lib/studies";
import { createLocalShare } from "@/lib/share";
import { openMaCalculatorFromStudies } from "@/lib/study-to-ma";
import { Pipeline, ProgressBar } from "./Pipeline";
import { ReadinessPanel } from "./ReadinessPanel";
import { PrismaFlow } from "./PrismaFlow";
import { PrintPack } from "./PrintPack";
import { PresenceBanner } from "./PresenceBanner";
import { ExportMenu } from "./ExportMenu";
import { exportSlug } from "@/lib/export-docx";

export function ProjectHome({ projectId }: { projectId: string }) {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode") as StorageMode | null;
  const [mode, setMode] = useState<StorageMode>(modeParam || "local");
  const [project, setProject] = useState<Project | null>(null);
  const [activity, setActivity] = useState<ProjectActivity[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [cloudShareUrl, setCloudShareUrl] = useState("");

  const load = useCallback(async () => {
    setError("");
    // Prefer explicit mode; else try cloud if configured, then local
    const tryCloud =
      modeParam === "cloud" ||
      (modeParam !== "local" && isSupabaseConfigured());

    if (tryCloud && isSupabaseConfigured()) {
      try {
        const cloud = await cloudGetProject(projectId);
        if (cloud) {
          setProject(cloud);
          setMode("cloud");
          const act = await cloudListActivity(projectId);
          setActivity(act);
          return;
        }
      } catch (e) {
        if (modeParam === "cloud") {
          setError(e instanceof Error ? e.message : "Could not load cloud project");
          return;
        }
      }
    }

    const local = getProject(projectId);
    if (local) {
      setProject({ ...local, mode: "local" });
      setMode("local");
      setActivity([]);
      return;
    }
    setProject(null);
    setError("Project not found");
  }, [projectId, modeParam]);

  useEffect(() => {
    void load();
    if (mode === "cloud") {
      const unsub = subscribeProject(projectId, () => void load());
      const t = setInterval(() => void load(), 30000);
      return () => {
        unsub();
        clearInterval(t);
      };
    }
  }, [load, mode, projectId]);

  if (error && !project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-600">
        {error}.{" "}
        <Link href="/workspace" className="text-teal-700 underline">
          Workspace
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-500">
        Loading project…
      </div>
    );
  }

  const progress = computeProgress(project);
  const qs = `?mode=${mode}`;
  const base = `/workspace/projects/${projectId}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/workspace" className="text-sm text-teal-700 hover:underline">
        ← All projects
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">{project.title}</h1>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                mode === "cloud"
                  ? "bg-teal-100 text-teal-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {mode}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Guided intervention SR of RCTs · Dual review recommended
          </p>
        </div>
        {mode === "cloud" && (
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
          >
            Refresh team data
          </button>
        )}
      </div>

      {mode === "cloud" && (
        <div className="mt-4">
          <PresenceBanner projectId={projectId} enabled />
        </div>
      )}

      {/* View-only share */}
      <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
        <p className="text-sm font-semibold text-indigo-950">View-only share link</p>
        <p className="mt-1 text-sm text-indigo-900/80">
          Share a read-only snapshot with supervisors or co-authors who should not edit.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-indigo-700 px-3 py-2 text-xs font-semibold text-white"
            onClick={async () => {
              const { url, portableUrl } = createLocalShare(project);
              const text = portableUrl
                ? `${url}\n\nPortable (works without this browser):\n${portableUrl}`
                : url;
              await navigator.clipboard.writeText(portableUrl || url);
              setShareMsg(
                portableUrl
                  ? "Portable view-only link copied (works cross-device)."
                  : "Snapshot link copied (opens on this browser). Project large for portable URL — use cloud share if team."
              );
              // Prefer portable if available
              void text;
              setTimeout(() => setShareMsg(""), 4000);
            }}
          >
            Copy view-only link
          </button>
          {mode === "cloud" && project.myRole === "owner" && (
            <>
              <button
                type="button"
                className="rounded-lg border border-indigo-300 bg-white px-3 py-2 text-xs font-semibold text-indigo-900"
                onClick={async () => {
                  try {
                    const tok = await cloudEnableShare(projectId);
                    const url = `${window.location.origin}/share/${tok}`;
                    setCloudShareUrl(url);
                    await navigator.clipboard.writeText(url);
                    setShareMsg(
                      "Cloud share enabled and link copied. Run supabase/share-and-presence.sql if this fails."
                    );
                  } catch (e) {
                    setShareMsg(
                      e instanceof Error
                        ? `${e.message} — run supabase/share-and-presence.sql in Supabase SQL Editor.`
                        : "Cloud share failed"
                    );
                  }
                }}
              >
                Enable live cloud share
              </button>
              {cloudShareUrl && (
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700"
                  onClick={async () => {
                    try {
                      await cloudDisableShare(projectId);
                      setCloudShareUrl("");
                      setShareMsg("Cloud share disabled.");
                    } catch (e) {
                      setShareMsg(
                        e instanceof Error ? e.message : "Disable failed"
                      );
                    }
                  }}
                >
                  Disable cloud share
                </button>
              )}
            </>
          )}
        </div>
        {shareMsg && (
          <p className="mt-2 text-xs text-indigo-900">{shareMsg}</p>
        )}
        {cloudShareUrl && (
          <p className="mt-2 break-all font-mono text-xs text-indigo-900">
            {cloudShareUrl}
          </p>
        )}
      </div>

      {mode === "cloud" && project.inviteCode && (
        <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50/80 p-4">
          <p className="text-sm font-semibold text-teal-950">Invite collaborators</p>
          <p className="mt-1 text-sm text-teal-900/80">
            Share this code. Teammates sign in → Workspace → Join with code.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="rounded-lg bg-white px-3 py-2 font-mono text-lg font-bold tracking-widest text-slate-900 ring-1 ring-teal-200">
              {project.inviteCode}
            </code>
            <button
              type="button"
              className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white"
              onClick={async () => {
                await navigator.clipboard.writeText(project.inviteCode || "");
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? "Copied" : "Copy code"}
            </button>
            {project.myRole === "owner" && (
              <button
                type="button"
                className="rounded-lg border border-teal-300 px-3 py-2 text-xs font-medium text-teal-900"
                onClick={async () => {
                  if (!confirm("Regenerate invite code? Old code stops working."))
                    return;
                  const code = await cloudRegenerateInvite(projectId);
                  setProject({ ...project, inviteCode: code });
                }}
              >
                Regenerate
              </button>
            )}
          </div>
          {project.members && project.members.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.members.map((m) => (
                <li
                  key={m.userId}
                  className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                >
                  {m.displayName || m.email || "Member"} · {m.role}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-6 max-w-xl">
        <ProgressBar percent={progress.percent} />
        <p className="mt-1 text-xs text-slate-500">
          {progress.completed} of {progress.total} stages complete
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <strong>Loop:</strong>{" "}
        <Link href="/example/tour" className="text-amber-800 underline">
          Watch tour
        </Link>
        {" · then "}
        <span className="font-medium text-teal-800">Do</span> — fill fields and
        checklists on each stage
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        <Pipeline project={project} basePath={base} query={qs} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={`${base}/${project.currentStage}${qs}`}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Continue current stage
        </Link>
        <button
          type="button"
          onClick={() => {
            const studies = parseStudies(
              project.stages.extraction?.data?._studies
            );
            const blob = new Blob([studiesToCsv(studies)], {
              type: "text/csv;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${exportSlug(project.title)}-studies.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium"
        >
          Studies CSV
        </button>
        <button
          type="button"
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
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-950"
        >
          Extraction → MA calc
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Export Word drafts
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Formatted .docx for editing in Word or Google Docs. Markdown is under
          Advanced.
        </p>
        <ExportMenu
          className="mt-3"
          title={project.title}
          items={[
            {
              id: "protocol",
              label: "Protocol",
              suffix: "protocol",
              markdown: () => buildProtocolMarkdown(project),
              variant: "secondary",
            },
            {
              id: "methods",
              label: "Methods",
              suffix: "methods",
              markdown: () => buildMethodsMarkdown(project),
              variant: "secondary",
            },
            {
              id: "results",
              label: "Results skeleton",
              suffix: "results",
              markdown: () => buildResultsSkeletonMarkdown(project),
              variant: "secondary",
            },
            {
              id: "full",
              label: "Full package",
              suffix: "full",
              markdown: () => buildFullExportMarkdown(project),
              variant: "primary",
            },
          ]}
        />
      </div>

      {parseStudies(project.stages.extraction?.data?._studies).length > 0 && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Included studies preview
          </h2>
          <div className="mt-2 overflow-x-auto text-xs prose-learn">
            <pre className="whitespace-pre-wrap font-sans text-slate-700">
              {studiesToMarkdownTable(
                parseStudies(project.stages.extraction?.data?._studies)
              )}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-8">
        <PrintPack project={project} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ReadinessPanel project={project} mode={mode} />

          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {STAGE_ORDER.map((id) => {
              const s = getStage(id);
              const st = project.stages[id]?.status || "not_started";
              const steps = s.processSteps?.length ?? 0;
              return (
                <li key={id}>
                  <Link
                    href={`${base}/${id}${qs}`}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {s.number}. {s.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {s.summary}
                        {steps > 0 && ` · ${steps} process steps`}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                        st === "complete"
                          ? "bg-teal-100 text-teal-800"
                          : st === "in_progress"
                            ? "bg-amber-100 text-amber-900"
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
        </div>

        <aside className="space-y-4">
          <PrismaFlow
            data={{
              identified: project.stages.screening?.data?.identified as
                | number
                | string
                | undefined,
              duplicates: project.stages.screening?.data?.duplicates as
                | number
                | string
                | undefined,
              titleAbstractScreened: project.stages.screening?.data
                ?.titleAbstractScreened as number | string | undefined,
              fullTextAssessed: project.stages.screening?.data
                ?.fullTextAssessed as number | string | undefined,
              included: project.stages.screening?.data?.included as
                | number
                | string
                | undefined,
            }}
          />

          {mode === "cloud" && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-slate-900">Team activity</h2>
              {activity.length === 0 ? (
                <p className="mt-2 text-xs text-slate-500">No activity yet.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {activity.map((a) => (
                    <li key={a.id} className="text-xs text-slate-600">
                      <span className="font-medium text-slate-800">
                        {a.displayName || "Someone"}
                      </span>{" "}
                      {a.message}
                      <div className="text-[10px] text-slate-400">
                        {new Date(a.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            <h2 className="text-sm font-semibold text-slate-900">Team how-to</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs">
              <li>Owner shares invite code</li>
              <li>Both work stages in order; tick process checklists</li>
              <li>Use dual screening/extraction outside (Rayyan) + log counts here</li>
              <li>Watch readiness % climb before manuscript write-up</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
