"use client";

import { useMemo } from "react";
import type { Project } from "@/lib/types";
import { buildProtocolMarkdown, buildFullExportMarkdown } from "@/lib/stages";
import {
  buildMethodsMarkdown,
  buildResultsSkeletonMarkdown,
} from "@/lib/manuscript";
import { parseStudies, studiesToMarkdownTable } from "@/lib/studies";
import { computeReadiness } from "@/lib/readiness";
import { PRISMA_ITEMS } from "@/lib/prisma-items";
import { ExportMenu } from "./ExportMenu";

export function PrintPack({ project }: { project: Project }) {
  const readiness = computeReadiness(project);
  const studies = parseStudies(project.stages.extraction?.data?._studies);
  const prismaRaw = project.stages.reporting?.data?._prismaChecks;
  const prismaChecked = Array.isArray(prismaRaw)
    ? prismaRaw.map(String)
    : [];

  const sections = useMemo(
    () => [
      { id: "protocol", title: "Protocol draft", body: buildProtocolMarkdown(project) },
      { id: "methods", title: "Methods draft", body: buildMethodsMarkdown(project) },
      {
        id: "results",
        title: "Results skeleton",
        body: buildResultsSkeletonMarkdown(project),
      },
      {
        id: "studies",
        title: "Study characteristics",
        body: studiesToMarkdownTable(studies),
      },
    ],
    [project, studies]
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm print:border-0 print:shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div>
          <h3 className="font-semibold text-slate-900">Print / PDF pack</h3>
          <p className="text-xs text-slate-500">
            Use your browser: Print → Save as PDF. Layout is print-optimized below.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Print / Save PDF
        </button>
      </div>

      <div id="print-root" className="mt-6 space-y-8 print:mt-0">
        <header className="border-b border-slate-200 pb-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            EvidenceFlow export
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">{project.title}</h1>
          <p className="mt-1 text-sm text-slate-600">
            Readiness {readiness.score}% · Generated{" "}
            {new Date().toLocaleString()} · Educational draft only
          </p>
        </header>

        <section>
          <h2 className="text-lg font-semibold">Readiness checklist</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {readiness.items.map((i) => (
              <li key={i.id}>
                {i.done ? "☑" : "☐"} {i.label}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">PRISMA-inspired reporting ticks</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {PRISMA_ITEMS.map((item) => (
              <li key={item.id}>
                {prismaChecked.includes(item.id) ? "☑" : "☐"} [{item.section}]{" "}
                {item.label}
              </li>
            ))}
          </ul>
        </section>

        {sections.map((s) => (
          <section key={s.id} className="break-inside-avoid">
            <h2 className="text-lg font-semibold">{s.title}</h2>
            <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">
              {s.body}
            </pre>
          </section>
        ))}

        <section className="break-inside-avoid print:hidden">
          <h2 className="text-lg font-semibold">Downloads (screen only)</h2>
          <p className="mt-1 text-xs text-slate-500">
            Word is primary. Markdown is under Advanced.
          </p>
          <ExportMenu
            className="mt-2"
            title={project.title}
            items={[
              {
                id: "full",
                label: "Full package",
                suffix: "full",
                markdown: () => buildFullExportMarkdown(project),
                variant: "primary",
              },
              {
                id: "protocol",
                label: "Protocol",
                suffix: "protocol",
                markdown: () => buildProtocolMarkdown(project),
              },
              {
                id: "methods",
                label: "Methods",
                suffix: "methods",
                markdown: () => buildMethodsMarkdown(project),
              },
              {
                id: "results",
                label: "Results skeleton",
                suffix: "results",
                markdown: () => buildResultsSkeletonMarkdown(project),
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
