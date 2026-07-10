import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-3 py-10 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 sm:text-sm">
            Produce · synthesise · learn by doing
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Learn clinical evidence methods by doing them
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            EvidenceFlow guides you with <strong>Watch · Do</strong> — see a
            worked model, then write your own fields. From case reports to
            systematic reviews.
          </p>
          <div className="mt-6 grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <Link
              href="/designs"
              className="rounded-lg bg-teal-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm"
            >
              Explore designs
            </Link>
            <Link
              href="/designs/case-report"
              className="rounded-lg bg-amber-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm"
            >
              Case report
            </Link>
            <Link
              href="/designs/cross-sectional"
              className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-950"
            >
              Cross-sectional
            </Link>
            <Link
              href="/designs/cohort"
              className="rounded-lg border border-teal-300 bg-teal-50 px-4 py-3 text-center text-sm font-semibold text-teal-950"
            >
              Cohort
            </Link>
            <Link
              href="/designs/quasi"
              className="rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-3 text-center text-sm font-semibold text-indigo-950"
            >
              Quasi
            </Link>
            <Link
              href="/designs/rct"
              className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-950"
            >
              RCT
            </Link>
            <Link
              href="/workspace"
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800"
            >
              SR / MA workspace
            </Link>
            <Link
              href="/thesis"
              className="rounded-lg border border-violet-300 bg-violet-50 px-4 py-3 text-center text-sm font-semibold text-violet-950"
            >
              Thesis roadmap
            </Link>
            <Link
              href="/designs/chooser"
              className="rounded-lg px-4 py-3 text-center text-sm font-semibold text-teal-800"
            >
              Which design am I doing?
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-400">
            Free · mobile-friendly paths · local mode needs no signup
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-3 py-10 sm:px-6 sm:py-14">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Two ways in
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Link
            href="/designs"
            className="block rounded-2xl border border-teal-200 bg-teal-50/50 p-5 shadow-sm"
          >
            <p className="text-xs font-bold uppercase text-teal-800">
              Produce evidence
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Study design tracks
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Case → RCT with Watch · Do and journal-shaped Word export.
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-teal-800">
              Open designs →
            </span>
          </Link>
          <Link
            href="/workspace"
            className="block rounded-2xl border border-violet-200 bg-violet-50/50 p-5 shadow-sm"
          >
            <p className="text-xs font-bold uppercase text-violet-800">
              Synthesise evidence
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Systematic review &amp; MA
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              11-stage workspace, tools, and PRISMA-ordered journal package.
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-violet-800">
              Open SR/MA →
            </span>
          </Link>
          <Link
            href="/thesis"
            className="block rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm"
          >
            <p className="text-xs font-bold uppercase text-amber-800">
              Residency
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Thesis roadmap
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Protocol → data → writing → viva → publication. Never stuck on
              “what next?”
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-amber-900">
              Open thesis guide →
            </span>
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-3 py-10 sm:px-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Watch · Do
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              {
                t: "Watch",
                b: "Worked example and key concepts before you write",
                c: "border-amber-200 bg-amber-50",
              },
              {
                t: "Do",
                b: "Real fields, checklists, and Word export drafts",
                c: "border-teal-200 bg-teal-50",
              },
            ].map((x) => (
              <div
                key={x.t}
                className={`rounded-xl border p-4 ${x.c}`}
              >
                <h3 className="font-semibold text-slate-900">{x.t}</h3>
                <p className="mt-1 text-sm text-slate-700">{x.b}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              href="/example/tour"
              className="text-sm font-semibold text-teal-800 underline"
            >
              SR watch tour
            </Link>
            <Link
              href="/learn/foundations/history"
              className="text-sm font-semibold text-violet-800 underline"
            >
              History &amp; philosophy
            </Link>
            <Link
              href="/tools"
              className="text-sm font-semibold text-slate-700 underline"
            >
              Software modules
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
