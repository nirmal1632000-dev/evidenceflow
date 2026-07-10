"use client";

import { useParams } from "next/navigation";
import { XS_STAGE_ORDER, type XsStageId } from "@/lib/cross-sectional";
import { CrossSectionalWorkspace } from "@/components/CrossSectionalWorkspace";

export default function ExampleXsStagePage() {
  const params = useParams();
  const stage = String(params.stage || "") as XsStageId;
  if (!XS_STAGE_ORDER.includes(stage)) {
    return (
      <div className="p-8 text-center text-slate-600">Unknown stage.</div>
    );
  }
  return (
    <CrossSectionalWorkspace
      projectId="example-cross-sectional"
      stageId={stage}
      readOnly
    />
  );
}
