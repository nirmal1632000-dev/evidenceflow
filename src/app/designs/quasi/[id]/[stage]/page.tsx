"use client";

import { useParams } from "next/navigation";
import { QUASI_STAGE_ORDER, type QuasiStageId } from "@/lib/quasi";
import { QuasiWorkspace } from "@/components/QuasiWorkspace";

export default function QuasiStagePage() {
  const params = useParams();
  const id = String(params.id || "");
  const stage = String(params.stage || "") as QuasiStageId;

  if (!QUASI_STAGE_ORDER.includes(stage)) {
    return (
      <div className="p-8 text-center text-slate-600">Unknown stage.</div>
    );
  }

  return (
    <QuasiWorkspace
      projectId={id}
      stageId={stage}
      readOnly={id === "example-quasi"}
    />
  );
}
