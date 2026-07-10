"use client";

import { useEffect, useRef, useState } from "react";
import type { ExtractedStudy } from "@/lib/studies";
import {
  JUDGMENT_COLOR,
  JUDGMENT_LABEL,
  ROB2_DOMAINS,
  emptyRob,
  parseRobGrid,
  suggestOverall,
  type RobGridMap,
  type RobJudgment,
  type StudyRob,
} from "@/lib/rob";

const OPTIONS: RobJudgment[] = ["", "low", "some", "high", "ni"];

export function RobGrid({
  studies,
  raw,
  onChange,
  readOnly,
}: {
  studies: ExtractedStudy[];
  raw: unknown;
  onChange: (grid: RobGridMap) => void | Promise<void>;
  readOnly?: boolean;
}) {
  const [grid, setGrid] = useState<RobGridMap>(() => parseRobGrid(raw));
  const [saving, setSaving] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    if (!dirty.current) setGrid(parseRobGrid(raw));
  }, [raw]);

  // Ensure rows for current studies
  useEffect(() => {
    setGrid((g) => {
      const next = { ...g };
      let changed = false;
      for (const s of studies) {
        if (!next[s.id]) {
          next[s.id] = emptyRob();
          if (s.robOverall) {
            const map: Record<string, RobJudgment> = {
              low: "low",
              "some concerns": "some",
              some: "some",
              high: "high",
            };
            next[s.id].overall =
              map[s.robOverall.toLowerCase()] || next[s.id].overall;
          }
          changed = true;
        }
      }
      return changed ? next : g;
    });
  }, [studies]);

  async function commit(next: RobGridMap) {
    setGrid(next);
    dirty.current = true;
    setSaving(true);
    try {
      await onChange(next);
      dirty.current = false;
    } finally {
      setSaving(false);
    }
  }

  function update(studyId: string, key: keyof StudyRob, value: string) {
    dirty.current = true;
    setGrid((g) => {
      const row = { ...(g[studyId] || emptyRob()), [key]: value };
      if (key !== "overall" && key !== "notes") {
        row.overall = suggestOverall(row) || row.overall;
      }
      return { ...g, [studyId]: row };
    });
  }

  if (!studies.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        Add studies in the Extraction table first, then rate RoB 2 domains here.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">RoB 2 domain grid</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Educational judgments per domain. Overall auto-suggests from domains
            (high if any high; else some concerns if any; else low) — verify against
            official RoB 2 guidance.
          </p>
        </div>
        {!readOnly && (
          <button
            type="button"
            disabled={saving}
            onClick={() => void commit(grid)}
            className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save RoB grid"}
          </button>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-max border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="sticky left-0 bg-white px-2 py-2 font-medium">Study</th>
              {ROB2_DOMAINS.map((d) => (
                <th key={d.id} className="px-2 py-2 font-medium" title={d.label}>
                  {d.short}
                </th>
              ))}
              <th className="px-2 py-2 font-medium">Overall</th>
              <th className="px-2 py-2 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {studies.map((s) => {
              const row = grid[s.id] || emptyRob();
              return (
                <tr key={s.id} className="border-b border-slate-100">
                  <td className="sticky left-0 bg-white px-2 py-1.5 font-medium text-slate-800">
                    {s.authorYear || "Untitled"}
                  </td>
                  {ROB2_DOMAINS.map((d) => (
                    <td key={d.id} className="px-1 py-1">
                      <select
                        disabled={readOnly}
                        value={row[d.id as keyof StudyRob] as string}
                        onChange={(e) => {
                          const value = e.target.value;
                          dirty.current = true;
                          setGrid((g) => {
                            const prev = { ...(g[s.id] || emptyRob()) };
                            (prev as Record<string, string>)[d.id] = value;
                            prev.overall = suggestOverall(prev) || prev.overall;
                            const next = { ...g, [s.id]: prev };
                            void commit(next);
                            return next;
                          });
                        }}
                        className={`rounded border border-slate-200 px-1 py-1 ${JUDGMENT_COLOR[row[d.id as keyof StudyRob] as RobJudgment] || ""}`}
                      >
                        {OPTIONS.map((o) => (
                          <option key={o || "empty"} value={o}>
                            {JUDGMENT_LABEL[o]}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                  <td className="px-1 py-1">
                    <select
                      disabled={readOnly}
                      value={row.overall}
                      onChange={(e) => {
                        const value = e.target.value as RobJudgment;
                        setGrid((g) => {
                          const prev = {
                            ...(g[s.id] || emptyRob()),
                            overall: value,
                          };
                          const next = { ...g, [s.id]: prev };
                          void commit(next);
                          return next;
                        });
                      }}
                      className={`rounded border border-slate-200 px-1 py-1 font-semibold ${JUDGMENT_COLOR[row.overall]}`}
                    >
                      {OPTIONS.map((o) => (
                        <option key={o || "empty"} value={o}>
                          {JUDGMENT_LABEL[o]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-1 py-1">
                    <input
                      disabled={readOnly}
                      value={row.notes}
                      onChange={(e) => update(s.id, "notes", e.target.value)}
                      onBlur={() => {
                        setGrid((g) => {
                          void commit(g);
                          return g;
                        });
                      }}
                      className="w-32 rounded border border-slate-200 px-1.5 py-1"
                      placeholder="Quote / page"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Traffic-light summary */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        {(["low", "some", "high"] as const).map((j) => {
          const n = studies.filter(
            (s) => (grid[s.id] || emptyRob()).overall === j
          ).length;
          return (
            <span
              key={j}
              className={`rounded-full px-2.5 py-1 font-medium ${JUDGMENT_COLOR[j]}`}
            >
              {JUDGMENT_LABEL[j]}: {n}
            </span>
          );
        })}
      </div>
    </div>
  );
}
