import Link from "next/link";
import { STAGES } from "@/lib/stages";
import { getLearnModule, allLearningReferences } from "@/lib/learn-modules";
import {
  FOUNDATION_ORDER,
  FOUNDATION_MODULES,
  allFoundationReferences,
} from "@/lib/foundation-modules";

export default function LearnPage() {
  const bibliography = [
    ...allFoundationReferences(),
    ...allLearningReferences().filter(
      (r) => !allFoundationReferences().some((f) => f.id === r.id)
    ),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
        Learning path
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
        Start with <strong>foundations</strong> (history &amp; philosophy of
        systematic reviews and meta-analysis), then follow the 11 stage modules for
        a first intervention SR of RCTs. Each module includes deep-dive text,
        practice tasks, self-checks, and <strong>key references</strong>.
      </p>

      <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50/60 p-4 text-sm text-teal-950">
        <strong>Recommended path:</strong>{" "}
        <Link href="/learn/foundations/history" className="underline">
          History
        </Link>{" "}
        →{" "}
        <Link href="/learn/foundations/philosophy" className="underline">
          Philosophy
        </Link>{" "}
        →{" "}
        <Link href="/example/tour" className="underline">
          Watch tour
        </Link>{" "}
        → create a project → stages 1–11 (Watch · Do) →{" "}
        <Link href="/tools" className="underline">
          software modules
        </Link>
        .
      </div>

      {/* Foundations */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Foundations — why SR &amp; MA exist
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          History and philosophy before you touch databases. These explain{" "}
          <em>why</em> protocols, comprehensive search, RoB, and GRADE are not
          optional bureaucracy.
        </p>
        <ol className="mt-4 space-y-3">
          {FOUNDATION_ORDER.map((id) => {
            const m = FOUNDATION_MODULES[id];
            return (
              <li
                key={id}
                className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4 shadow-sm dark:border-violet-900 dark:from-violet-950/40 dark:to-slate-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                      Module {m.number} · Foundations
                    </p>
                    <h3 className="mt-0.5 font-semibold text-slate-900 dark:text-slate-50">
                      {m.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {m.summary}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      ~{m.timeEstimate} · {m.sections.length} sections ·{" "}
                      {m.refIds.length} references · {m.selfCheck.length} quiz
                      items
                    </p>
                  </div>
                  <Link
                    href={`/learn/foundations/${id}`}
                    className="shrink-0 rounded-lg bg-violet-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-800"
                  >
                    Read module
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Stage curriculum */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Stage curriculum — how to run a review
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Practical modules aligned with the EvidenceFlow workspace pipeline.
        </p>
        <ol className="mt-4 space-y-3">
          {STAGES.map((s) => {
            const ext = getLearnModule(s.id);
            return (
              <li
                key={s.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                      Module {s.number}
                    </p>
                    <h3 className="mt-0.5 font-semibold text-slate-900 dark:text-slate-50">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {s.summary}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      ~{s.learn.timeEstimate} · {ext.sections.length} deep
                      sections · {ext.refIds.length} references ·{" "}
                      {s.quiz.length} quiz item
                      {s.quiz.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Link
                    href={`/learn/${s.id}`}
                    className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    Read module
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Master bibliography (curriculum)
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Foundations + stage sources. Always verify against the latest official
          versions when writing for publication.
        </p>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-slate-700 dark:text-slate-300">
          {bibliography.map((r) => (
            <li key={r.id}>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {r.label}.
              </span>{" "}
              {r.citation}
              {r.url && (
                <>
                  {" "}
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-700 underline dark:text-teal-300"
                  >
                    Link
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10 text-center">
        <Link
          href="/learn/foundations/history"
          className="mr-3 inline-flex rounded-lg border border-violet-300 bg-violet-50 px-5 py-2.5 text-sm font-semibold text-violet-950"
        >
          Start with history
        </Link>
        <Link
          href="/workspace"
          className="inline-flex rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Apply in a project
        </Link>
      </div>
    </div>
  );
}
