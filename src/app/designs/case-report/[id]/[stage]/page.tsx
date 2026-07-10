"use client";

import { useParams } from "next/navigation";
import { CASE_STAGE_ORDER, type CaseStageId } from "@/lib/case-report";
import { CaseReportWorkspace } from "@/components/CaseReportWorkspace";

export default function CaseStagePage() {
  const params = useParams();
  const id = String(params.id || "");
  const stage = String(params.stage || "") as CaseStageId;

  if (!CASE_STAGE_ORDER.includes(stage)) {
    return (
      <div className="p-8 text-center text-slate-600">Unknown stage.</div>
    );
  }

  return (
    <CaseReportWorkspace
      projectId={id}
      stageId={stage}
      readOnly={id === "example-case-report"}
    />
  );
}
