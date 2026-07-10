"use client";

import { useParams } from "next/navigation";
import { COHORT_STAGE_ORDER, type CohortStageId } from "@/lib/cohort";
import { CohortWorkspace } from "@/components/CohortWorkspace";

export default function ExampleCohortStagePage() {
  const params = useParams();
  const stage = String(params.stage || "") as CohortStageId;
  if (!COHORT_STAGE_ORDER.includes(stage)) {
    return (
      <div className="p-8 text-center text-slate-600">Unknown stage.</div>
    );
  }
  return (
    <CohortWorkspace
      projectId="example-cohort"
      stageId={stage}
      readOnly
    />
  );
}
