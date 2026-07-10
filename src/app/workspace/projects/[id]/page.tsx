import { Suspense } from "react";
import { ProjectHome } from "@/components/ProjectHome";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-slate-500">Loading project…</div>
      }
    >
      <ProjectHome projectId={id} />
    </Suspense>
  );
}
