import Link from "next/link";
import { SensitivityTools } from "@/components/SensitivityTools";

export default function SensitivityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/tools" className="text-sm text-teal-700 hover:underline">
        ← Software guide
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900">
        Sensitivity & funnel tools
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Practice leave-one-out analysis and read a simple funnel sketch for continuous
        mean differences.
      </p>
      <div className="mt-8">
        <SensitivityTools />
      </div>
    </div>
  );
}
