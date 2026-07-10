"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  createProject,
  deleteProject,
  exportProjectJson,
  getProject,
  importProjectJson,
  listProjects,
} from "@/lib/storage";
import {
  cloudCreateProject,
  cloudDeleteProject,
  cloudJoinByCode,
  cloudListProjects,
  getSessionUser,
  isSupabaseConfigured,
  signOut,
  updateDisplayName,
} from "@/lib/cloud";
import type { ProjectMeta } from "@/lib/types";
import { getStage } from "@/lib/stages";
import { SPECIALTY_TEMPLATES, getTemplate } from "@/lib/templates";
import type { User } from "@supabase/supabase-js";

export function WorkspaceDashboard() {
  const [localProjects, setLocalProjects] = useState<ProjectMeta[]>([]);
  const [cloudProjects, setCloudProjects] = useState<ProjectMeta[]>([]);
  const [title, setTitle] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [inviteInput, setInviteInput] = useState("");
  const [importError, setImportError] = useState("");
  const [cloudError, setCloudError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [loadingCloud, setLoadingCloud] = useState(false);
  const configured = isSupabaseConfigured();

  const refreshLocal = useCallback(() => {
    setLocalProjects(listProjects());
  }, []);

  const refreshCloud = useCallback(async () => {
    if (!configured) return;
    setLoadingCloud(true);
    setCloudError("");
    try {
      const u = await getSessionUser();
      setUser(u);
      if (u) {
        setDisplayName(
          (u.user_metadata?.display_name as string) ||
            u.email?.split("@")[0] ||
            ""
        );
        const list = await cloudListProjects();
        setCloudProjects(list);
      } else {
        setCloudProjects([]);
        setDisplayName("");
      }
    } catch (e) {
      setCloudError(e instanceof Error ? e.message : "Could not load cloud projects");
    } finally {
      setLoadingCloud(false);
    }
  }, [configured]);

  useEffect(() => {
    refreshLocal();
    refreshCloud();
  }, [refreshLocal, refreshCloud]);

  function applyTemplateTitle() {
    const t = getTemplate(templateId);
    if (t && !title.trim()) return t.title;
    return title || "My first systematic review";
  }

  function handleCreateLocal(e: React.FormEvent) {
    e.preventDefault();
    const tpl = getTemplate(templateId);
    const p = createProject(applyTemplateTitle(), {
      stagePrefill: tpl?.stages,
    });
    setTitle("");
    setTemplateId("");
    window.location.href = `/workspace/projects/${p.id}/question?mode=local`;
  }

  async function handleCreateCloud(e: React.FormEvent) {
    e.preventDefault();
    setCloudError("");
    try {
      const tpl = getTemplate(templateId);
      const p = await cloudCreateProject(
        title.trim() || tpl?.title || "Team systematic review",
        { stagePrefill: tpl?.stages }
      );
      setTitle("");
      setTemplateId("");
      window.location.href = `/workspace/projects/${p.id}/question?mode=cloud`;
    } catch (err) {
      setCloudError(err instanceof Error ? err.message : "Create failed");
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setCloudError("");
    try {
      const id = await cloudJoinByCode(inviteInput);
      setInviteInput("");
      window.location.href = `/workspace/projects/${id}?mode=cloud`;
    } catch (err) {
      setCloudError(err instanceof Error ? err.message : "Join failed");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Your workspace</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Run a guided systematic review end-to-end. Use{" "}
            <strong>team (cloud)</strong> projects so multiple people can edit the same
            review from different devices. Local projects stay only in this browser.
          </p>
        </div>
        {configured && (
          <div className="shrink-0 text-sm">
            {user ? (
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                <p className="font-medium text-slate-800">
                  {displayName || "Reviewer"}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex gap-1">
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                      placeholder="Display name"
                    />
                    <button
                      type="button"
                      className="shrink-0 rounded bg-slate-100 px-2 py-1 text-xs font-medium"
                      onClick={async () => {
                        try {
                          await updateDisplayName(displayName.trim() || "Reviewer");
                          setProfileMsg("Saved");
                          setTimeout(() => setProfileMsg(""), 1500);
                        } catch (e) {
                          setProfileMsg(
                            e instanceof Error ? e.message : "Save failed"
                          );
                        }
                      }}
                    >
                      Save
                    </button>
                  </div>
                  {profileMsg && (
                    <p className="text-[10px] text-teal-700">{profileMsg}</p>
                  )}
                  <button
                    type="button"
                    className="text-left text-xs text-teal-700 underline"
                    onClick={async () => {
                      await signOut();
                      setUser(null);
                      setCloudProjects([]);
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth"
                className="inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Sign in for teams
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Process overview */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">How a review moves through EvidenceFlow</h2>
        <ol className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <li>1–3 · Question, eligibility, protocol (+ register)</li>
          <li>4–5 · Search & dual screening (Rayyan etc.)</li>
          <li>6–7 · Extraction & risk of bias</li>
          <li>8–11 · Synthesis, MA, GRADE, PRISMA report</li>
        </ol>
        <p className="mt-3 text-xs text-slate-500">
          Each stage has a process checklist, lesson, software tips, and shared fields.
          Prefer dual review for screening, extraction, and RoB.
        </p>
      </div>

      {/* Specialty templates */}
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Start from a specialty template</h2>
        <p className="mt-1 text-sm text-slate-600">
          Prefills PICO, eligibility, and protocol drafts. Edit everything after create.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {SPECIALTY_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTemplateId(t.id);
                if (!title.trim()) setTitle(t.title);
              }}
              className={`rounded-xl border px-3 py-3 text-left text-sm transition ${
                templateId === t.id
                  ? "border-teal-500 bg-teal-50 ring-1 ring-teal-400"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wide text-teal-700">
                {t.specialty}
              </span>
              <p className="mt-0.5 font-medium text-slate-900">{t.title}</p>
              <p className="mt-1 text-xs text-slate-500">{t.blurb}</p>
            </button>
          ))}
        </div>
        {templateId && (
          <button
            type="button"
            className="mt-3 text-xs text-slate-500 underline"
            onClick={() => setTemplateId("")}
          >
            Clear template selection
          </button>
        )}
      </section>

      {/* Cloud team section */}
      <section className="mb-10 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold text-slate-900">Team projects (multi-device)</h2>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Share an invite code so co-reviewers work on the same protocol, PRISMA counts,
          and stage forms.
        </p>

        {!configured ? (
          <p className="mt-4 text-sm text-slate-600">
            Team sync is not enabled on this deployment yet. You can still use{" "}
            <strong>local projects</strong> below for solo work on this device.
          </p>
        ) : !user ? (
          <Link
            href="/auth"
            className="mt-4 inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Sign in to create or join a team project
          </Link>
        ) : (
          <>
            <form onSubmit={handleCreateCloud} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Team review title"
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-600/30"
              />
              <button
                type="submit"
                className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Create team project
                {templateId ? " + template" : ""}
              </button>
            </form>

            <form
              onSubmit={handleJoin}
              className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <input
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value.toUpperCase())}
                placeholder="Invite code (e.g. AB12CD34)"
                className="flex-1 rounded-lg border border-dashed border-teal-300 bg-white px-3 py-2.5 text-sm font-mono uppercase outline-none focus:ring-2 focus:ring-teal-600/30"
              />
              <button
                type="submit"
                className="rounded-lg border border-teal-600 px-5 py-2.5 text-sm font-semibold text-teal-800 hover:bg-teal-50"
              >
                Join with code
              </button>
            </form>

            {cloudError && (
              <p className="mt-2 text-sm text-rose-600">{cloudError}</p>
            )}

            {loadingCloud ? (
              <p className="mt-4 text-sm text-slate-500">Loading team projects…</p>
            ) : cloudProjects.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                No team projects yet. Create one or join with a code from a colleague.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {cloudProjects.map((p) => (
                  <ProjectRow
                    key={p.id}
                    p={p}
                    mode="cloud"
                    onDelete={async () => {
                      if (!confirm(`Delete team project “${p.title}”?`)) return;
                      await cloudDeleteProject(p.id);
                      refreshCloud();
                    }}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      {/* Local section */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900">Local projects (this device)</h2>
        <p className="mt-1 text-sm text-slate-500">
          Good for solo practice. Data does not sync to other devices or teammates.
        </p>

        <form
          onSubmit={handleCreateLocal}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Local practice review title"
            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-400/30"
          />
          <button
            type="submit"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Create local project
            {templateId ? " + template" : ""}
          </button>
        </form>

        {localProjects.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No local projects. Or explore the{" "}
            <Link href="/example" className="text-teal-700 underline">
              worked example
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {localProjects.map((p) => (
              <ProjectRow
                key={p.id}
                p={{ ...p, mode: "local" }}
                mode="local"
                onDelete={() => {
                  if (confirm(`Delete “${p.title}”?`)) {
                    deleteProject(p.id);
                    refreshLocal();
                  }
                }}
                onBackup={() => {
                  const full = getProject(p.id);
                  if (!full) return;
                  const blob = new Blob([exportProjectJson(full)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${p.title.replace(/\s+/g, "-")}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">Import local backup</h2>
        <p className="mt-1 text-sm text-slate-500">
          Restore a project JSON exported from local mode.
        </p>
        <input
          type="file"
          accept="application/json,.json"
          className="mt-3 block w-full text-sm"
          onChange={async (e) => {
            setImportError("");
            const file = e.target.files?.[0];
            if (!file) return;
            const text = await file.text();
            const imported = importProjectJson(text);
            if (!imported) {
              setImportError("Invalid project file.");
              return;
            }
            refreshLocal();
          }}
        />
        {importError && <p className="mt-2 text-sm text-rose-600">{importError}</p>}
      </section>
    </div>
  );
}

function ProjectRow({
  p,
  mode,
  onDelete,
  onBackup,
}: {
  p: ProjectMeta;
  mode: "local" | "cloud";
  onDelete: () => void | Promise<void>;
  onBackup?: () => void;
}) {
  const stage = getStage(p.currentStage);
  const qs = `?mode=${mode}`;
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/workspace/projects/${p.id}${qs}`}
            className="font-medium text-slate-900 hover:text-teal-800"
          >
            {p.title}
          </Link>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
              mode === "cloud"
                ? "bg-teal-100 text-teal-800"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {mode}
          </span>
          {p.myRole && (
            <span className="text-xs text-slate-500">{p.myRole}</span>
          )}
          {p.memberCount != null && mode === "cloud" && (
            <span className="text-xs text-slate-500">
              · {p.memberCount} member{p.memberCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Current: Stage {stage.number} · {stage.shortTitle}
          {p.inviteCode && (
            <>
              {" "}
              · Code <span className="font-mono font-semibold">{p.inviteCode}</span>
            </>
          )}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/workspace/projects/${p.id}/${p.currentStage}${qs}`}
          className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white"
        >
          Continue
        </Link>
        {onBackup && (
          <button
            type="button"
            onClick={onBackup}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
          >
            Backup JSON
          </button>
        )}
        <button
          type="button"
          onClick={() => void onDelete()}
          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
