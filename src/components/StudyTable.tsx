"use client";

import { useEffect, useRef, useState } from "react";
import {
  EMPTY_STUDY,
  parseStudies,
  studiesToCsv,
  type ExtractedStudy,
} from "@/lib/studies";
import { studiesFromClipboard, studiesFromCsv } from "@/lib/csv-import";
import {
  openMaCalculatorFromStudies,
  studiesToBinaryRows,
  studiesToContinuousRows,
} from "@/lib/study-to-ma";
import { SimpleForest } from "./SimpleForest";

const COLS: {
  key: keyof ExtractedStudy;
  label: string;
  width?: string;
  long?: boolean;
}[] = [
  { key: "authorYear", label: "Author year", width: "w-28" },
  { key: "country", label: "Country", width: "w-20" },
  { key: "design", label: "Design", width: "w-16" },
  { key: "nTotal", label: "N", width: "w-14" },
  { key: "nInt", label: "N int", width: "w-14" },
  { key: "nCtrl", label: "N ctrl", width: "w-14" },
  { key: "intervention", label: "Intervention", long: true },
  { key: "comparator", label: "Comparator", long: true },
  { key: "outcome", label: "Primary outcome", long: true },
  { key: "effect", label: "Effect / ES", width: "w-28" },
  { key: "intStats", label: "Int mean/SD or events", width: "w-28" },
  { key: "ctrlStats", label: "Ctrl mean/SD or events", width: "w-28" },
  { key: "timepoint", label: "Time", width: "w-20" },
  { key: "robOverall", label: "RoB", width: "w-24" },
  { key: "funding", label: "Funding", width: "w-24" },
  { key: "notes", label: "Notes", long: true },
];

export function StudyTable({
  raw,
  onChange,
  readOnly,
  projectId,
  projectTitle,
}: {
  raw: unknown;
  onChange: (studies: ExtractedStudy[]) => void | Promise<void>;
  readOnly?: boolean;
  projectId?: string;
  projectTitle?: string;
}) {
  const [rows, setRows] = useState<ExtractedStudy[]>(() => parseStudies(raw));
  const [saving, setSaving] = useState(false);
  const [bridgeMsg, setBridgeMsg] = useState("");
  const dirty = useRef(false);

  const contCount = studiesToContinuousRows(rows).rows.length;
  const binCount = studiesToBinaryRows(rows).rows.length;

  function runMa(forceKind?: "continuous" | "binary") {
    const result = openMaCalculatorFromStudies(rows, {
      projectId,
      projectTitle,
      forceKind,
    });
    if (!result.ok) {
      setBridgeMsg(result.message);
      alert(result.message);
      return;
    }
    setBridgeMsg(result.message);
    window.location.href = result.href;
  }

  useEffect(() => {
    if (!dirty.current) setRows(parseStudies(raw));
  }, [raw]);

  async function commit(next: ExtractedStudy[]) {
    setRows(next);
    dirty.current = true;
    setSaving(true);
    try {
      await onChange(next);
      dirty.current = false;
    } finally {
      setSaving(false);
    }
  }

  function update(id: string, key: keyof ExtractedStudy, value: string) {
    dirty.current = true;
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [key]: value } : r))
    );
  }

  function downloadCsv() {
    const blob = new Blob([studiesToCsv(rows)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extraction-table.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">
            Included studies — extraction table
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            One row per study (or per comparison). Dual-extract effect sizes. Export CSV
            for RevMan/R.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadCsv}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
          >
            Export CSV
          </button>
          <button
            type="button"
            disabled={rows.length === 0}
            title={
              contCount
                ? `Open continuous MA with ${contCount} parseable stud${contCount === 1 ? "y" : "ies"}`
                : binCount
                  ? `Open binary MA with ${binCount} parseable stud${binCount === 1 ? "y" : "ies"}`
                  : "Needs mean (SD) + arm N, or events/N in stats columns"
            }
            onClick={() => runMa()}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-950 disabled:opacity-40"
          >
            Run in MA calculator
            {contCount > 0
              ? ` (${contCount} cont.)`
              : binCount > 0
                ? ` (${binCount} bin.)`
                : ""}
          </button>
          {(contCount > 0 || binCount > 0) && contCount > 0 && binCount > 0 && (
            <>
              <button
                type="button"
                onClick={() => runMa("continuous")}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-[10px] font-medium text-slate-600"
              >
                Force MD
              </button>
              <button
                type="button"
                onClick={() => runMa("binary")}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-[10px] font-medium text-slate-600"
              >
                Force RR/OR
              </button>
            </>
          )}
          {!readOnly && (
            <>
              <label className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                Import CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const text = await file.text();
                    const imported = studiesFromCsv(text);
                    if (!imported.length) {
                      alert(
                        "No studies found. Use headers like authorYear, nInt, nCtrl, intStats, ctrlStats…"
                      );
                      return;
                    }
                    const replace = confirm(
                      `Found ${imported.length} stud${imported.length === 1 ? "y" : "ies"}.\n\nOK = replace current table\nCancel = append to existing rows`
                    );
                    void commit(replace ? imported : [...rows, ...imported]);
                    e.target.value = "";
                  }}
                />
              </label>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    const imported = studiesFromClipboard(text);
                    if (!imported.length) {
                      alert(
                        "Clipboard empty or unrecognized. Paste from Excel/Sheets with columns:\nAuthor year | Country | N | Intervention | Comparator | Outcome | Effect | Int stats | Ctrl stats | N int | N ctrl"
                      );
                      return;
                    }
                    const replace = confirm(
                      `Paste ${imported.length} stud${imported.length === 1 ? "y" : "ies"} from clipboard.\n\nOK = replace table\nCancel = append`
                    );
                    void commit(replace ? imported : [...rows, ...imported]);
                  } catch {
                    alert(
                      "Could not read clipboard. Allow clipboard permission, or use Import CSV."
                    );
                  }
                }}
              >
                Paste from Excel
              </button>
              <button
                type="button"
                onClick={() => void commit([...rows, EMPTY_STUDY()])}
                className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-900"
              >
                + Add study
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void commit(rows)}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save table"}
              </button>
            </>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-sm text-slate-500">
          No studies yet. After full-text inclusion, add each study here.
          {!readOnly && " Click “Add study”."}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-max border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                {COLS.map((c) => (
                  <th key={c.key} className="whitespace-nowrap px-1.5 py-2 font-medium">
                    {c.label}
                  </th>
                ))}
                {!readOnly && <th className="px-1.5 py-2"> </th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 align-top">
                  {COLS.map((c) => (
                    <td key={c.key} className="px-1 py-1">
                      {c.long ? (
                        <textarea
                          rows={2}
                          disabled={readOnly}
                          value={row[c.key] || ""}
                          onChange={(e) => update(row.id, c.key, e.target.value)}
                          onBlur={() => {
                            setRows((prev) => {
                              void commit(prev);
                              return prev;
                            });
                          }}
                          className="min-w-[8rem] rounded border border-slate-200 px-1.5 py-1 disabled:bg-slate-50"
                        />
                      ) : (
                        <input
                          disabled={readOnly}
                          value={row[c.key] || ""}
                          onChange={(e) => update(row.id, c.key, e.target.value)}
                          onBlur={() => {
                            setRows((prev) => {
                              void commit(prev);
                              return prev;
                            });
                          }}
                          className={`rounded border border-slate-200 px-1.5 py-1 disabled:bg-slate-50 ${c.width || "w-24"}`}
                        />
                      )}
                    </td>
                  ))}
                  {!readOnly && (
                    <td className="px-1 py-1">
                      <button
                        type="button"
                        className="text-rose-600"
                        onClick={() =>
                          void commit(rows.filter((r) => r.id !== row.id))
                        }
                      >
                        ✕
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-[10px] text-slate-400">
        {rows.length} stud{rows.length === 1 ? "y" : "ies"}
        {contCount > 0 && ` · ${contCount} continuous-ready`}
        {binCount > 0 && ` · ${binCount} binary-ready`}
        {saving ? " · saving…" : ""}
        {bridgeMsg ? ` · ${bridgeMsg}` : ""}
      </p>
      <p className="mt-1 text-[10px] text-slate-400">
        For MA bridge: continuous uses Int/Ctrl mean (SD) + N int/ctrl; binary uses
        events as <code>10/100</code> or events + N columns.
      </p>

      <div className="mt-4">
        <SimpleForest studies={rows} />
      </div>
    </div>
  );
}
