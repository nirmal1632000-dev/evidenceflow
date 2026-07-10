import Link from "next/link";
import { DESIGN_TRACKS, produceDesigns, synthesizeDesigns } from "@/lib/designs";

export default function DesignsHubPage() {
  return (
    <div className="mx-auto max-w-4xl px-3 py-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
        EvidenceFlow · expand
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
        Study designs &amp; evidence tracks
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
        Produce primary evidence (case reports → trials) or synthesise studies
        (systematic reviews). Same principle: <strong>Watch · Do · Teach</strong>.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/designs/chooser"
          className="rounded-2xl border border-teal-200 bg-teal-50 p-4 shadow-sm"
        >
          <p className="text-xs font-bold uppercase text-teal-800">Tool</p>
          <h2 className="mt-1 font-semibold text-slate-900">
            Which design am I doing?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Short quiz → suggested design + next steps
          </p>
        </Link>
        <Link
          href="/designs/appraise"
          className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm"
        >
          <p className="text-xs font-bold uppercase text-indigo-800">Tool</p>
          <h2 className="mt-1 font-semibold text-slate-900">
            Appraisal red flags
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Spot weak claims by design type when reading papers
          </p>
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">
          Produce evidence
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Primary research pathways. Live tracks are editable workspaces.
        </p>
        <ul className="mt-4 space-y-3">
          {produceDesigns().map((d) => (
            <li
              key={d.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{d.title}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        d.status === "live"
                          ? "bg-teal-50 text-teal-800"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {d.status === "live" ? "Live" : "Soon"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{d.summary}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    <strong>Guide:</strong> {d.reportingGuide}
                  </p>
                </div>
                {d.status === "live" && d.href ? (
                  <Link
                    href={d.href}
                    className="shrink-0 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Open track
                  </Link>
                ) : (
                  <span className="shrink-0 text-xs text-slate-400">
                    Coming next
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">
          Synthesise evidence
        </h2>
        <ul className="mt-4 space-y-3">
          {synthesizeDesigns().map((d) => (
            <li
              key={d.id}
              className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">{d.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{d.summary}</p>
                </div>
                {d.href && (
                  <Link
                    href={d.href}
                    className="shrink-0 rounded-lg bg-violet-700 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Open SR/MA
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <strong className="text-slate-900">Live now:</strong> Case report/series,
        cross-sectional, and SR/MA.{" "}
        <strong className="text-slate-900">Roadmap:</strong> cohort,
        quasi-experimental, and RCT full workspaces — same Watch · Do · Teach
        pattern. Appraisal flags for all designs are already live.
        <ul className="mt-2 list-disc pl-5 text-xs">
          {DESIGN_TRACKS.filter((d) => d.status === "soon").map((d) => (
            <li key={d.id}>{d.title}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
