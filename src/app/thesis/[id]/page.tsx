"use client";

import { useParams } from "next/navigation";
import { ThesisDashboard } from "@/components/ThesisWorkspace";

export default function ThesisProjectPage() {
  const params = useParams();
  const id = String(params.id || "");
  return <ThesisDashboard projectId={id} />;
}
