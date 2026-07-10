import { Suspense } from "react";
import { StageWorkspace } from "@/components/StageWorkspace";
import { STAGE_ORDER } from "@/lib/stages";
import type { StageId } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function StagePage({
  params,
}: {
  params: Promise<{ id: string; stage: string }>;
}) {
  const { id, stage } = await params;
  if (!STAGE_ORDER.includes(stage as StageId)) notFound();
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-slate-500">Loading stage…</div>
      }
    >
      <StageWorkspace projectId={id} stageId={stage as StageId} />
    </Suspense>
  );
}
