import Link from "next/link";

/**
 * AI case draft is implemented but hidden from product navigation for now.
 * Direct URL kept as a soft “coming later” page so we can re-enable quickly.
 * Full UI: CaseAiDraftStudio + /api/case-report/draft
 */
export const metadata = {
  title: "AI case draft · coming later · EvidenceFlow",
  description: "AI-assisted case report drafting is planned; not open in this release.",
};

export default function CaseReportAiHiddenPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Not open yet
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
        AI case draft
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        This feature is built but paused while we decide privacy, API, and
        rollout. Use the manual case report track for now.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          href="/designs/case-report"
          className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Case report track
        </Link>
        <Link
          href="/designs"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800"
        >
          Designs hub
        </Link>
      </div>
    </div>
  );
}
