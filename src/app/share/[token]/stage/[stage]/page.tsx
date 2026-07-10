"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cloudGetSharedProject, isSupabaseConfigured } from "@/lib/cloud";
import { decodePortableProject, getLocalShare } from "@/lib/share";
import type { Project, StageId } from "@/lib/types";
import { STAGE_ORDER, getStage } from "@/lib/stages";
import { StageWorkspace } from "@/components/StageWorkspace";

export default function ShareStagePage() {
  const params = useParams();
  const token = String(params.token || "");
  const stageId = String(params.stage || "") as StageId;
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (token === "p" && typeof window !== "undefined") {
        const hash = window.location.hash.replace(/^#/, "");
        const p = decodePortableProject(hash);
        if (p && !cancelled) setProject(p);
        else if (!cancelled) setError("Invalid portable share.");
        return;
      }
      const local = getLocalShare(token);
      if (local?.project) {
        if (!cancelled) setProject(local.project);
        return;
      }
      if (isSupabaseConfigured()) {
        try {
          const cloud = await cloudGetSharedProject(token);
          if (cloud && !cancelled) {
            setProject(cloud);
            return;
          }
        } catch {
          /* fall through */
        }
      }
      if (!cancelled) setError("Share not found.");
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-600">
        {error}{" "}
        <Link href={`/share/${token}`} className="text-teal-700 underline">
          Back
        </Link>
      </div>
    );
  }

  if (!project || !STAGE_ORDER.includes(stageId)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  // Reuse stage UI in read-only via example-style path: pass project through
  // StageWorkspace with readOnly when initialProject is set from share.
  return (
    <div>
      <div className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-center text-xs text-amber-950">
        View-only · {project.title} · Stage {getStage(stageId).number} ·{" "}
        <Link href={`/share/${token}`} className="font-semibold underline">
          Share home
        </Link>
      </div>
      <ShareStageWorkspace project={project} stageId={stageId} token={token} />
    </div>
  );
}

/** Thin wrapper: StageWorkspace needs projectId + readOnly mode for examples */
function ShareStageWorkspace({
  project,
  stageId,
  token,
}: {
  project: Project;
  stageId: StageId;
  token: string;
}) {
  // StageWorkspace already supports readOnly via initialProject on example routes.
  // For share we pass initialProject and readOnly=true.
  return (
    <StageWorkspace
      projectId={project.id}
      stageId={stageId}
      initialProject={project}
      readOnly
      shareBasePath={`/share/${token}/stage`}
    />
  );
}
