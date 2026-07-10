"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DESIGN_TRACKS, type DesignId } from "@/lib/designs";

function AppraiseInner() {
  const search = useSearchParams();
  const initial = (search.get("design") as DesignId) || "case-report";
  const [id, setId] = useState<DesignId>(
    DESIGN_TRACKS.some((d) => d.id === initial) ? initial : "case-report"
  );
  const design = useMemo(
    () => DESIGN_TRACKS.find((d) => d.id === id)!,
    [id]
  );

  return (
    <div className="mx-auto max-w-2xl px-3 py-8 sm:px-6">
      <Link href="/designs" className="text-sm text-teal-700 underline">
        ← Designs hub
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900">
        Appraisal red flags
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        When reading a paper, match its design and scan for these problems. Not a
        full critical-appraisal tool — a teaching checklist.
      </p>

      <label className="mt-6 block text-sm font-medium text-slate-800">
        Design
        <select
          value={id}
          onChange={(e) => setId(e.target.value as DesignId)}
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
        >
          {DESIGN_TRACKS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">{design.title}</h2>
        <p className="mt-1 text-sm text-slate-600">{design.summary}</p>
        <p className="mt-3 text-xs text-slate-500">
          <strong>Use when:</strong> {design.whenToUse}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <strong>Not for:</strong> {design.whenNot}
        </p>
        {design.reportingUrl && (
          <a
            href={design.reportingUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm text-teal-700 underline"
          >
            {design.reportingGuide} →
          </a>
        )}
      </div>

      <section className="mt-4 rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
        <h3 className="font-semibold text-rose-950">Red flags</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-rose-950/90">
          {design.redFlags.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
        <h3 className="font-semibold text-teal-950">Strengths of this design</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-teal-950/90">
          {design.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        {design.href && (
          <Link
            href={design.href}
            className="rounded-lg bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
          >
            Open track
          </Link>
        )}
        <Link
          href="/designs/chooser"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold"
        >
          Design chooser
        </Link>
      </div>
    </div>
  );
}

export default function AppraisePage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-slate-500">Loading…</div>
      }
    >
      <AppraiseInner />
    </Suspense>
  );
}
