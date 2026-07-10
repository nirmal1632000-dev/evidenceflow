import Link from "next/link";

const pillars = [
  {
    title: "Watch it",
    body: "Guided tour + annotated worked example — see expert choices before you write a word.",
  },
  {
    title: "Do it",
    body: "Eleven real workspace stages: PICO through PRISMA, with checklists, quizzes, and tools.",
  },
  {
    title: "Teach it",
    body: "Explain-back prompts every stage. Export a learning pack for peers or supervisors.",
  },
  {
    title: "Team + export",
    body: "Optional cloud collab, software map (Zotero, Rayyan, RevMan…), Markdown packages anytime.",
  },
];

const stagesPreview = [
  "Question (PICO)",
  "Eligibility",
  "Protocol",
  "Search",
  "Screening",
  "Extraction",
  "Risk of bias",
  "Synthesis",
  "Meta-analysis",
  "GRADE",
  "Reporting",
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Systematic review · Meta-analysis
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Learn systematic reviews by running a real one
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            EvidenceFlow is a guided workspace and learning space. Follow 11 stages
            from research question to PRISMA reporting, with quizzes, common-mistake
            warnings, and software recommendations at each step.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/example/tour"
              className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700"
            >
              Watch the tour
            </Link>
            <Link
              href="/workspace"
              className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
            >
              Do — open workspace
            </Link>
            <Link
              href="/example"
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Worked example
            </Link>
            <Link
              href="/learn/foundations/history"
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-violet-800 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950"
            >
              History &amp; philosophy
            </Link>
            <Link
              href="/learn"
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-teal-800 hover:bg-teal-50"
            >
              Full curriculum
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-400">
            Free · Watch → Do → Teach · Team projects when signed in · Export anytime
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-semibold text-slate-900">What you get</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            The 11-stage pipeline
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Designed for a first intervention systematic review of RCTs, with optional
            pairwise meta-analysis. Each stage pairs a lesson with a live form.
          </p>
          <ol className="mt-8 flex flex-wrap gap-2">
            {stagesPreview.map((s, i) => (
              <li
                key={s}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700"
              >
                <span className="font-semibold text-teal-700">{i + 1}.</span> {s}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="rounded-2xl bg-slate-900 px-6 py-10 text-white sm:px-10">
          <h2 className="text-2xl font-semibold">How to use it</h2>
          <ol className="mt-6 space-y-3 text-slate-300">
            <li>
              <span className="font-semibold text-white">1.</span> Create a project in
              Workspace and write your PICO.
            </li>
            <li>
              <span className="font-semibold text-white">2.</span> Read the Learn panel,
              avoid the listed mistakes, try the quick quiz.
            </li>
            <li>
              <span className="font-semibold text-white">3.</span> Use the recommended
              external tools (Rayyan, Zotero, RevMan/R) and log results back here.
            </li>
            <li>
              <span className="font-semibold text-white">4.</span> Export protocol and
              methods notes when you write up or register.
            </li>
          </ol>
          <Link
            href="/workspace"
            className="mt-8 inline-block rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-400"
          >
            Start your first project
          </Link>
        </div>
      </section>
    </div>
  );
}
