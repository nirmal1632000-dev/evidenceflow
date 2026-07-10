"use client";

import { useParams } from "next/navigation";
import { CASE_STAGE_ORDER, type CaseStageId } from "@/lib/case-report";
import { CaseReportWorkspace } from "@/components/CaseReportWorkspace";

export default function ExampleCaseStagePage() {
  const params = useParams();
  const stage = String(params.stage || "") as CaseStageId;
  if (!CASE_STAGE_ORDER.includes(stage)) {
    return (
      <div className="p-8 text-center text-slate-600">Unknown stage.</div>
    );
  }
  return (
    <CaseReportWorkspace
      projectId="example-case-report"
      stageId={stage}
      readOnly
    />
  );
}
