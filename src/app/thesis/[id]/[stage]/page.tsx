"use client";

import { useParams } from "next/navigation";
import { ThesisStageWorkspace } from "@/components/ThesisWorkspace";
import { THESIS_STAGE_ORDER, type ThesisStageId } from "@/lib/thesis";

export default function ThesisStagePage() {
  const params = useParams();
  const id = String(params.id || "");
  const stage = String(params.stage || "") as ThesisStageId;
  if (!THESIS_STAGE_ORDER.includes(stage)) {
    return (
      <div className="p-16 text-center text-slate-600">Unknown stage.</div>
    );
  }
  return <ThesisStageWorkspace projectId={id} stageId={stage} />;
}
