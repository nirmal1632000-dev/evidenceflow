"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cloudGetSharedProject, isSupabaseConfigured } from "@/lib/cloud";
import {
  decodePortableProject,
  getLocalShare,
} from "@/lib/share";
import type { Project } from "@/lib/types";
import { STAGE_ORDER, getStage, buildFullExportMarkdown } from "@/lib/stages";
import { Pipeline, ProgressBar } from "@/components/Pipeline";
import { computeProgress } from "@/lib/storage";
import { ReadinessPanel } from "@/components/ReadinessPanel";
import { ExportMenu } from "@/components/ExportMenu";

export default function SharePage() {
  const params = useParams();
  const token = String(params.token || "");
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"local" | "cloud" | "portable" | "">("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      // Portable hash link: /share/p#base64
      if (token === "p" && typeof window !== "undefined") {
        const hash = window.location.hash.replace(/^#/, "");
        if (hash) {
          const p = decodePortableProject(hash);
          if (p && !cancelled) {
            setProject(p);
            setSource("portable");
            setLoading(false);
            return;
          }
        }
        if (!cancelled) {
          setError("Invalid or empty portable share link.");
          setLoading(false);
        }
        return;
      }

      // Local browser snapshot
      const local = getLocalShare(token);
      if (local?.project) {
        if (!cancelled) {
          setProject(local.project);
          setSource("local");
          setLoading(false);
        }
        return;
      }

      // Cloud share token (if migration applied)
      if (isSupabaseConfigured()) {
        try {
          const cloud = await cloudGetSharedProject(token);
          if (cloud && !cancelled) {
            setProject(cloud);
            setSource("cloud");
            setLoading(false);
            return;
          }
        } catch {
          // fall through
        }
      }

      if (!cancelled) {
        setError(
          "Share not found. Local links only work in the browser that created them (unless you used a portable link). Cloud share requires the SQL migration and an enabled link."
        );
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-500">
        Loading shared review…
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Share unavailable</h1>
        <p className="mt-3 text-sm text-slate-600">{error}</p>
        <Link href="/workspace" className="mt-6 inline-block text-teal-700 underline">
          Open workspace
        </Link>
      </div>
    );
  }

  const progress = computeProgress(project);
  const base = `/share/${token}/stage`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-950">
        <strong>View-only share</strong>
        {source === "local" && " · snapshot from this browser"}
        {source === "portable" && " · portable link (no account needed)"}
        {source === "cloud" && " · live cloud snapshot"}
        {" · "}you cannot edit this review here.
      </div>

      <h1 className="mt-5 text-2xl font-semibold text-slate-900">{project.title}</h1>
      <p className="mt-1 text-sm text-slate-500">
        Shared systematic review · EvidenceFlow
      </p>

      <div className="mt-4 max-w-sm">
        <ProgressBar percent={progress.percent} />
        <p className="mt-1 text-xs text-slate-500">
          {progress.completed} of {progress.total} stages marked complete
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        <Pipeline project={project} basePath={base} query="" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={`${base}/${project.currentStage}`}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Open current stage (read-only)
        </Link>
        <ExportMenu
          title={project.title}
          items={[
            {
              id: "full",
              label: "Full package",
              suffix: "shared",
              markdown: () => buildFullExportMarkdown(project),
              variant: "primary",
            },
          ]}
        />
        <Link
          href="/workspace"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium"
        >
          Create your own project
        </Link>
      </div>

      <div className="mt-8">
        <ReadinessPanel project={project} mode="local" />
      </div>

      <ul className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {STAGE_ORDER.map((id) => {
          const s = getStage(id);
          const st = project.stages[id]?.status || "not_started";
          return (
            <li key={id}>
              <Link
                href={`${base}/${id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {s.number}. {s.title}
                  </p>
                  <p className="text-xs text-slate-500">{s.summary}</p>
                </div>
                <span className="text-[11px] font-semibold capitalize text-slate-500">
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
