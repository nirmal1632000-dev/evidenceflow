"use client";

import { use } from "react";
import { StageWorkspace } from "@/components/StageWorkspace";
import { getExampleProject } from "@/lib/example-project";
import { STAGE_ORDER } from "@/lib/stages";
import type { StageId } from "@/lib/types";

export default function ExampleStagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage } = use(params);
  const stageId = stage as StageId;
  if (!STAGE_ORDER.includes(stageId)) {
    return <div className="p-8">Unknown stage.</div>;
  }
  const project = getExampleProject();
  return (
    <StageWorkspace
      projectId={project.id}
      stageId={stageId}
      readOnly
      initialProject={project}
    />
  );
}
