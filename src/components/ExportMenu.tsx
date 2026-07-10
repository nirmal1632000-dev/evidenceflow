"use client";

import { useState } from "react";
import {
  downloadMarkdownAsDocx,
  downloadTextFile,
  exportSlug,
} from "@/lib/export-docx";

type MarkdownSource = string | (() => string | Promise<string>);

type ExportItem = {
  id: string;
  /** Button label for Word */
  label: string;
  /** Markdown body (or sync/async builder) */
  markdown: MarkdownSource;
  /** Optional file slug suffix e.g. "methods" */
  suffix?: string;
  /** Primary (Word) vs secondary styling */
  variant?: "primary" | "secondary" | "accent";
};

async function resolveMarkdown(source: MarkdownSource): Promise<string> {
  if (typeof source === "function") return source();
  return source;
}

/**
 * Primary: Word downloads. Markdown kept under collapsible Advanced.
 */
export function ExportMenu({
  title,
  items,
  className = "",
  compact = false,
}: {
  title: string;
  items: ExportItem[];
  className?: string;
  /** Smaller buttons for stage sidebars */
  compact?: boolean;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const slug = exportSlug(title);

  async function exportWord(item: ExportItem) {
    setBusy(item.id);
    try {
      const md = await resolveMarkdown(item.markdown);
      const base = item.suffix ? `${slug}-${item.suffix}` : slug;
      await downloadMarkdownAsDocx(base, md, { title });
    } catch (e) {
      console.error(e);
      alert("Could not build Word file. Try again or use Advanced → Markdown.");
    } finally {
      setBusy(null);
    }
  }

  async function exportMd(item: ExportItem) {
    setBusy(`md-${item.id}`);
    try {
      const md = await resolveMarkdown(item.markdown);
      const base = item.suffix ? `${slug}-${item.suffix}` : slug;
      downloadTextFile(`${base}.md`, md);
    } catch (e) {
      console.error(e);
      alert("Could not export Markdown.");
    } finally {
      setBusy(null);
    }
  }

  const btnBase = compact
    ? "rounded-lg px-3 py-1.5 text-xs font-medium"
    : "rounded-lg px-4 py-2 text-sm font-medium";

  function wordClass(v: ExportItem["variant"]) {
    if (v === "primary")
      return `${btnBase} bg-teal-600 font-semibold text-white hover:bg-teal-700 disabled:opacity-60`;
    if (v === "accent")
      return `${btnBase} border border-violet-200 bg-violet-50 text-violet-950 hover:bg-violet-100 disabled:opacity-60`;
    return `${btnBase} border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 disabled:opacity-60`;
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={busy !== null}
            onClick={() => void exportWord(item)}
            className={wordClass(item.variant ?? "secondary")}
          >
            {busy === item.id
              ? "Building…"
              : compact
                ? `${item.label} (.docx)`
                : `Word: ${item.label}`}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setAdvancedOpen((o) => !o)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
          aria-expanded={advancedOpen}
        >
          <span
            className={`inline-block transition-transform ${advancedOpen ? "rotate-90" : ""}`}
          >
            ▸
          </span>
          Advanced — Markdown export
        </button>
        {advancedOpen && (
          <div className="mt-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-3">
            <p className="mb-2 text-[11px] leading-relaxed text-slate-500">
              Plain Markdown (.md) for tools that prefer text. Prefer Word above
              for a formatted draft you can edit in Microsoft Word or Google
              Docs.
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <button
                  key={`md-${item.id}`}
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void exportMd(item)}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-white disabled:opacity-60"
                >
                  {busy === `md-${item.id}` ? "…" : `${item.label} (.md)`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Single-action Word export + advanced Markdown (design tracks). */
export function ExportWordButton({
  title,
  markdown,
  label = "Download Word",
  className = "",
}: {
  title: string;
  markdown: MarkdownSource;
  label?: string;
  className?: string;
}) {
  return (
    <ExportMenu
      title={title}
      className={className}
      items={[
        {
          id: "main",
          label: label.replace(/^Word:\s*/i, ""),
          markdown,
          variant: "primary",
        },
      ]}
    />
  );
}
