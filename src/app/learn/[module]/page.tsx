import Link from "next/link";
import { notFound } from "next/navigation";
import { getStage, STAGE_ORDER, getNextStage, getPrevStage } from "@/lib/stages";
import type { StageId } from "@/lib/types";
import {
  getLearnModule,
  getModuleReferences,
} from "@/lib/learn-modules";

export default async function LearnModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  if (!STAGE_ORDER.includes(module as StageId)) notFound();
  const stageId = module as StageId;
  const stage = getStage(stageId);
  const extended = getLearnModule(stageId);
  const refs = getModuleReferences(stageId);
  const prev = getPrevStage(stage.id);
  const next = getNextStage(stage.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/learn"
        className="text-sm text-teal-700 hover:underline dark:text-teal-300"
      >
        ← All modules
      </Link>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
        Module {stage.number} · Watch · Do curriculum
      </p>
      <h1 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-50">
        {stage.title}
      </h1>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
        {stage.summary}
      </p>
      <p className="mt-2 text-sm text-slate-400">
        Estimated focus time: {stage.learn.timeEstimate}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Link
          href={`/example/tour?step=${stage.number - 1}`}
          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-950"
        >
          Watch this scene
        </Link>
        <Link
          href="/workspace"
          className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 font-semibold text-teal-950"
        >
          Do in workspace
        </Link>
      </div>

      <article className="prose-learn mt-8 space-y-10">
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Overview
          </h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            {extended.overview}
          </p>
        </section>

        <section className="rounded-xl border border-teal-100 bg-teal-50/50 p-5">
          <h2 className="text-lg font-semibold text-teal-950">
            Learning objectives
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-teal-950/90">
            {extended.learningObjectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Why this step exists
          </h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            {stage.learn.why}
          </p>
        </section>

        {extended.sections.map((sec) => (
          <section key={sec.heading}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {sec.heading}
            </h2>
            {sec.paragraphs.map((p) => (
              <p key={p.slice(0, 48)} className="mt-2 text-slate-700 dark:text-slate-300">
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

        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Core concepts (quick list)
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
            {stage.learn.concepts.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-rose-100 bg-rose-50/50 p-5">
          <h2 className="text-lg font-semibold text-rose-950">Common mistakes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-rose-950/90">
            {stage.learn.commonMistakes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="text-lg font-semibold text-amber-950">
            Practice tasks (Do)
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-amber-950/90">
            {extended.practiceTasks.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Key takeaways
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
            {extended.keyTakeaways.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Tools people use here
          </h2>
          <ul className="mt-3 space-y-3">
            {stage.software.map((s) => (
              <li
                key={s.name}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-slate-500">
                    {s.free ? "Free / freemium" : "Paid / institutional"}
                  </span>
                </div>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{s.when}</p>
                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-700 underline dark:text-teal-300"
                  >
                    Website
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="text-lg font-semibold text-indigo-950">Self-check</h2>
          <ul className="mt-3 space-y-4">
            {stage.quiz.map((q) => (
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
            Core methods sources for this module. Prefer primary guidance over
            secondary summaries when writing protocols and papers.
          </p>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {refs.map((r) => (
              <li key={r.id} id={`ref-${r.id}`}>
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
          {extended.furtherReading && extended.furtherReading.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Further reading
              </h3>
              <ul className="mt-2 space-y-1 text-sm">
                {extended.furtherReading.map((f) => (
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

        <p className="text-slate-600 dark:text-slate-400">{stage.nextHint}</p>
      </article>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
        {prev ? (
          <Link
            href={`/learn/${prev.id}`}
            className="text-sm text-slate-600 hover:underline dark:text-slate-400"
          >
            ← {prev.shortTitle}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href="/workspace"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Practice in workspace
        </Link>
        {next ? (
          <Link
            href={`/learn/${next.id}`}
            className="text-sm text-teal-700 hover:underline dark:text-teal-300"
          >
            {next.shortTitle} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
