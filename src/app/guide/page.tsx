import Link from "next/link";

const phases = [
  {
    title: "Phase A — Plan (before you search at scale)",
    items: [
      "Write PICO and a single review question",
      "Draft inclusion/exclusion; pilot wording with a second person",
      "Write protocol methods (search, dual screen, RoB, synthesis rules)",
      "Register (PROSPERO/OSF) when eligible",
      "Create a Team project in EvidenceFlow and invite co-reviewers",
    ],
  },
  {
    title: "Phase B — Find & select studies",
    items: [
      "Multi-database search + grey literature as planned",
      "Peer-review search strings (PRESS) if possible",
      "De-duplicate in Zotero/EndNote",
      "Dual title/abstract then dual full-text (Rayyan/Covidence)",
      "Log PRISMA counts + exclusion reasons + conflicts in EvidenceFlow",
    ],
  },
  {
    title: "Phase C — Appraise & extract",
    items: [
      "Pilot extraction form on 2 studies",
      "Dual-extract critical outcomes",
      "RoB 2 (RCTs) dual assessment + robvis plots",
      "Decide narrative vs meta-analysis per outcome",
    ],
  },
  {
    title: "Phase D — Synthesize & report",
    items: [
      "Run MA in RevMan/R when appropriate; interpret heterogeneity",
      "GRADE certainty + Summary of Findings",
      "PRISMA 2020 checklist + balanced conclusions",
      "Export protocol/package from EvidenceFlow into your manuscript",
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        How to run a systematic review in EvidenceFlow
      </h1>
      <p className="mt-2 text-slate-600">
        EvidenceFlow follows <strong>watch it → do it → teach it</strong>. Use
        specialist tools for bulk screening and statistics; keep decisions, counts,
        reflections, and team notes here so learning and the review stay aligned.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong>1. Watch</strong>
          <p className="mt-1 text-xs">
            Guided tour + annotated example on each stage’s Watch tab.
          </p>
        </div>
        <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-950">
          <strong>2. Do</strong>
          <p className="mt-1 text-xs">
            Your project fields, checklists, tools, dual-review notes.
          </p>
        </div>
        <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-950">
          <strong>3. Teach</strong>
          <p className="mt-1 text-xs">
            Explain-back prompts → learning pack for peers/supervisors.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/50 px-4 py-3 text-sm text-teal-950">
        <strong>Team path:</strong> Sign in → Create team project → Share invite code →
        Work stages 1→11 (Watch/Do/Teach each) → readiness + teach-back % → Export.
      </div>

      <div className="mt-10 space-y-8">
        {phases.map((p) => (
          <section key={p.title}>
            <h2 className="text-lg font-semibold text-slate-900">{p.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              {p.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">Recommended free stack</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-700">
          <li>Zotero — references & PDFs</li>
          <li>Rayyan — dual screening</li>
          <li>EvidenceFlow — process, learning, shared logs</li>
          <li>RevMan Web or R metafor — meta-analysis</li>
          <li>GRADEpro — certainty of evidence</li>
          <li>PRISMA 2020 checklist — reporting</li>
        </ol>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/workspace"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Open workspace
        </Link>
        <Link
          href="/example"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
        >
          Worked example
        </Link>
        <Link
          href="/learn"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
        >
          Curriculum
        </Link>
      </div>
    </div>
  );
}
