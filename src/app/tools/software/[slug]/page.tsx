import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSoftwareBySlug,
  getSoftwareReferences,
  SOFTWARE_CATALOG,
} from "@/lib/software";
import { getStage } from "@/lib/stages";
import type { StageId } from "@/lib/types";

export function generateStaticParams() {
  return SOFTWARE_CATALOG.map((s) => ({ slug: s.slug }));
}

export default async function SoftwareModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getSoftwareBySlug(slug);
  if (!item) notFound();
  const refs = getSoftwareReferences(item);

  const idx = SOFTWARE_CATALOG.findIndex((s) => s.slug === slug);
  const prev = idx > 0 ? SOFTWARE_CATALOG[idx - 1] : null;
  const next =
    idx >= 0 && idx < SOFTWARE_CATALOG.length - 1
      ? SOFTWARE_CATALOG[idx + 1]
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/tools"
        className="text-sm text-teal-700 hover:underline dark:text-teal-300"
      >
        ← All software modules
      </Link>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
        Software module · {item.category}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
          {item.name}
        </h1>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
            item.free
              ? "bg-teal-50 text-teal-800"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {item.free ? "Free / freemium" : "Paid / institutional"}
        </span>
      </div>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
        {item.bestFor}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        <strong>Best for:</strong> {item.audience}
      </p>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-teal-700 underline dark:text-teal-300"
        >
          Official website →
        </a>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {item.stageIds.map((id) => {
          const st = getStage(id as StageId);
          return (
            <Link
              key={id}
              href={`/learn/${id}`}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
            >
              Stage: {st.shortTitle}
            </Link>
          );
        })}
      </div>

      <article className="mt-10 space-y-8">
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4">
            <h2 className="text-sm font-semibold text-teal-950">Pros</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-teal-950/90">
              {item.pros.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
            <h2 className="text-sm font-semibold text-rose-950">Cons</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-rose-950/90">
              {item.cons.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            When to use it in a systematic review
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
            {item.whenToUse.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            How to use it (workflow)
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {item.howToUse.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-amber-100 bg-amber-50/50 p-5">
          <h2 className="text-lg font-semibold text-amber-950">
            Pitfalls &amp; common mistakes
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-950/90">
            {item.pitfalls.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="text-lg font-semibold text-indigo-950">
            With EvidenceFlow
          </h2>
          <p className="mt-2 text-sm text-indigo-950/90">{item.withEvidenceFlow}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.stageIds.map((id) => (
              <Link
                key={id}
                href={`/learn/${id}`}
                className="text-xs font-semibold text-indigo-800 underline"
              >
                Learn module: {getStage(id as StageId).shortTitle}
              </Link>
            ))}
            <Link
              href="/workspace"
              className="text-xs font-semibold text-indigo-800 underline"
            >
              Open workspace
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            References
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Methods sources that justify when/why this class of tool is used in
            rigorous reviews. Prefer primary guidance for protocols and papers.
          </p>
          {refs.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No linked references.</p>
          ) : (
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
          )}
          {item.furtherReading && item.furtherReading.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Tool documentation
              </h3>
              <ul className="mt-2 space-y-1 text-sm">
                {item.furtherReading.map((f) => (
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
            href={`/tools/software/${prev.slug}`}
            className="text-sm text-slate-600 hover:underline dark:text-slate-400"
          >
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href="/tools"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
        >
          All modules
        </Link>
        {next ? (
          <Link
            href={`/tools/software/${next.slug}`}
            className="text-sm text-teal-700 hover:underline dark:text-teal-300"
          >
            {next.name} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
