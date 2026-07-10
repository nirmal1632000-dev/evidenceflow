import Link from "next/link";
import { DesignChooser } from "@/components/DesignChooser";

export default function DesignChooserPage() {
  return (
    <div className="mx-auto max-w-xl px-3 py-8 sm:px-6">
      <Link href="/designs" className="text-sm text-teal-700 underline">
        ← Designs hub
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900">
        Which study design?
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Answer a few questions. We suggest a design track and whether to{" "}
        <strong>produce</strong> data or <strong>synthesise</strong> studies.
        Educational only — confirm with a supervisor.
      </p>
      <div className="mt-6">
        <DesignChooser />
      </div>
    </div>
  );
}
