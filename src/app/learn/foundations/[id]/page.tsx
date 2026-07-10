import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FOUNDATION_ORDER,
  getFoundationModule,
  getFoundationReferences,
} from "@/lib/foundation-modules";

export function generateStaticParams() {
  return FOUNDATION_ORDER.map((id) => ({ id }));
}

export default async function FoundationModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mod = getFoundationModule(id);
  if (!mod) notFound();

  const refs = getFoundationReferences(mod.id);
  const idx = FOUNDATION_ORDER.indexOf(mod.id);
  const prevId = idx > 0 ? FOUNDATION_ORDER[idx - 1] : null;
  const nextId =
    idx >= 0 && idx < FOUNDATION_ORDER.length - 1
      ? FOUNDATION_ORDER[idx + 1]
      : null;
  const prev = prevId ? getFoundationModule(prevId) : null;
  const next = nextId ? getFoundationModule(nextId) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/learn"
        className="text-sm text-teal-700 hover:underline dark:text-teal-300"
      >
        ← All learning modules
      </Link>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
        Foundations · Module {mod.number}
      </p>
      <h1 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-50">
        {mod.title}
      </h1>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
        {mod.summary}
      </p>
      <p className="mt-2 text-sm text-slate-400">
        Estimated focus time: {mod.timeEstimate}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {FOUNDATION_ORDER.map((fid) => {
          const m = getFoundationModule(fid)!;
          const on = fid === mod.id;
          return (
            <Link
              key={fid}
              href={`/learn/foundations/${fid}`}
              className={`rounded-full px-3 py-1 font-semibold ${
                on
                  ? "bg-violet-700 text-white"
                  : "border border-violet-200 bg-violet-50 text-violet-950"
              }`}
            >
              {m.shortTitle}
            </Link>
          );
        })}
        <Link
          href="/learn/question"
          className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 font-semibold text-teal-950"
        >
          Then: Stage modules →
        </Link>
      </div>

      <article className="prose-learn mt-8 space-y-10">
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Overview
          </h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            {mod.overview}
          </p>
        </section>

        <section className="rounded-xl border border-violet-100 bg-violet-50/50 p-5">
          <h2 className="text-lg font-semibold text-violet-950">
            Learning objectives
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-violet-950/90">
            {mod.learningObjectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>

        {mod.sections.map((sec) => (
          <section key={sec.heading}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {sec.heading}
            </h2>
            {sec.paragraphs.map((p) => (
              <p
                key={p.slice(0, 64)}
                className="mt-2 text-slate-700 dark:text-slate-300"
              >
                {p}
              </p>
            ))}
            {sec.bullets && sec.bullets.length > 0 && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
                {sec.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="rounded-xl border border-amber-100 bg-amber-50/50 p-5">
          <h2 className="text-lg font-semibold text-amber-950">
            Practice tasks (Do / Teach)
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-amber-950/90">
            {mod.practiceTasks.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Key takeaways
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
            {mod.keyTakeaways.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="text-lg font-semibold text-indigo-950">Self-check</h2>
          <ul className="mt-3 space-y-4">
            {mod.selfCheck.map((q) => (
              <li key={q.id} className="text-sm">
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {q.question}
                </p>
                <ol className="mt-1 list-decimal pl-5 text-slate-600 dark:text-slate-400">
                  {q.options.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ol>
                <p className="mt-2 text-xs text-indigo-900 dark:text-indigo-200">
                  <strong>Answer:</strong> {q.options[q.correctIndex]} —{" "}
                  {q.explanation}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            References
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Historical and philosophical sources for this module. Prefer primary
            texts when citing in academic work.
          </p>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {refs.map((r) => (
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
          {mod.furtherReading && mod.furtherReading.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Further reading
              </h3>
              <ul className="mt-2 space-y-1 text-sm">
                {mod.furtherReading.map((f) => (
                  <li key={f.url}>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-700 underline dark:text-teal-300"
                    >
                      {f.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </article>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
        {prev ? (
          <Link
            href={`/learn/foundations/${prev.id}`}
            className="text-sm text-slate-600 hover:underline dark:text-slate-400"
          >
            ← {prev.shortTitle}
          </Link>
        ) : (
          <Link
            href="/learn"
            className="text-sm text-slate-600 hover:underline dark:text-slate-400"
          >
            ← Learn home
          </Link>
        )}
        <Link
          href="/workspace"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Apply in workspace
        </Link>
        {next ? (
          <Link
            href={`/learn/foundations/${next.id}`}
            className="text-sm text-violet-700 hover:underline dark:text-violet-300"
          >
            {next.shortTitle} →
          </Link>
        ) : (
          <Link
            href="/learn/question"
            className="text-sm text-teal-700 hover:underline dark:text-teal-300"
          >
            Stage 1: Question →
          </Link>
        )}
      </div>
    </div>
  );
}
