"use client";

import { useParams } from "next/navigation";
import { RCT_STAGE_ORDER, type RctStageId } from "@/lib/rct";
import { RctWorkspace } from "@/components/RctWorkspace";

export default function RctStagePage() {
  const params = useParams();
  const id = String(params.id || "");
  const stage = String(params.stage || "") as RctStageId;

  if (!RCT_STAGE_ORDER.includes(stage)) {
    return (
      <div className="p-8 text-center text-slate-600">Unknown stage.</div>
    );
  }

  return (
    <RctWorkspace
      projectId={id}
      stageId={stage}
      readOnly={id === "example-rct"}
    />
  );
}
