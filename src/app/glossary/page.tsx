import { GLOSSARY } from "@/lib/glossary";

export default function GlossaryPage() {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">Glossary</h1>
      <p className="mt-2 text-slate-600">
        Core terms you will meet in systematic reviews and meta-analysis. Plain
        language first.
      </p>
      <dl className="mt-8 space-y-5">
        {sorted.map((g) => (
          <div
            key={g.term}
            className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
          >
            <dt className="font-semibold text-slate-900">{g.term}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-slate-600">
              {g.definition}
            </dd>
            {g.related && g.related.length > 0 && (
              <p className="mt-2 text-xs text-slate-400">
                Related: {g.related.join(" · ")}
              </p>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}
