"use client";

import { useMemo, useState } from "react";
import { mdEffect, num, poolEffects, type Effect } from "@/lib/meta-stats";

type Row = {
  id: string;
  name: string;
  mean1: string;
  sd1: string;
  n1: string;
  mean2: string;
  sd2: string;
  n2: string;
};

function rowsToEffects(rows: Row[]): Effect[] {
  const effects: Effect[] = [];
  for (const r of rows) {
    const m1 = num(r.mean1);
    const sd1 = num(r.sd1);
    const n1 = num(r.n1);
    const m2 = num(r.mean2);
    const sd2 = num(r.sd2);
    const n2 = num(r.n2);
    if ([m1, sd1, n1, m2, sd2, n2].some((x) => !Number.isFinite(x))) continue;
    const e = mdEffect(m1, sd1, n1, m2, sd2, n2);
    if (!e) continue;
    effects.push({ study: r.name || "Study", yi: e.md, sei: e.se });
  }
  return effects;
}

export function SensitivityTools() {
  const [rows, setRows] = useState<Row[]>([
    {
      id: "1",
      name: "A",
      mean1: "10",
      sd1: "3",
      n1: "50",
      mean2: "12",
      sd2: "3.2",
      n2: "48",
    },
    {
      id: "2",
      name: "B",
      mean1: "11",
      sd1: "4",
      n1: "40",
      mean2: "14",
      sd2: "4.1",
      n2: "40",
    },
    {
      id: "3",
      name: "C",
      mean1: "9",
      sd1: "2.5",
      n1: "60",
      mean2: "9.5",
      sd2: "2.6",
      n2: "58",
    },
    {
      id: "4",
      name: "D",
      mean1: "8",
      sd1: "5",
      n1: "30",
      mean2: "13",
      sd2: "5.5",
      n2: "30",
    },
  ]);

  const effects = useMemo(() => rowsToEffects(rows), [rows]);
  const full = useMemo(
    () => poolEffects(effects, "random"),
    [effects]
  );

  const leaveOneOut = useMemo(() => {
    if (effects.length < 2) return [];
    return effects.map((omit) => {
      const subset = effects.filter((e) => e.study !== omit.study);
      const p = poolEffects(subset, "random");
      return {
        omitted: omit.study,
        pooled: p?.pooled ?? null,
        low: p?.low ?? null,
        high: p?.high ?? null,
        I2: p?.I2 ?? null,
      };
    });
  }, [effects]);

  /** Simple funnel: x = effect, y = 1/SE (precision) */
  const funnel = useMemo(() => {
    if (!effects.length) return null;
    const maxPrec = Math.max(...effects.map((e) => 1 / e.sei), 0.01);
    return effects.map((e) => ({
      study: e.study,
      x: e.yi,
      y: 1 / e.sei,
      yPct: (1 / e.sei / maxPrec) * 100,
    }));
  }, [effects]);

  function update(id: string, key: keyof Row, value: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }

  const xAbs = Math.max(
    ...effects.map((e) => Math.abs(e.yi)),
    full ? Math.abs(full.pooled) : 0,
    0.5
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Sensitivity & small-study tools (MD)
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Leave-one-out and a simple funnel (precision vs effect). Teaching only —
          funnel plots need enough studies and careful interpretation.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-1 pr-2">Study</th>
                <th className="py-1 pr-2">M1</th>
                <th className="py-1 pr-2">SD1</th>
                <th className="py-1 pr-2">n1</th>
                <th className="py-1 pr-2">M2</th>
                <th className="py-1 pr-2">SD2</th>
                <th className="py-1 pr-2">n2</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100">
                  {(
                    [
                      "name",
                      "mean1",
                      "sd1",
                      "n1",
                      "mean2",
                      "sd2",
                      "n2",
                    ] as const
                  ).map((k) => (
                    <td key={k} className="py-1 pr-1">
                      <input
                        value={r[k]}
                        onChange={(e) => update(r.id, k, e.target.value)}
                        className="w-14 rounded border border-slate-200 px-1 py-0.5 sm:w-16"
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      className="text-rose-600"
                      onClick={() =>
                        setRows((rs) => rs.filter((x) => x.id !== r.id))
                      }
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          className="mt-2 text-xs font-semibold text-teal-700"
          onClick={() =>
            setRows((rs) => [
              ...rs,
              {
                id: crypto.randomUUID(),
                name: "",
                mean1: "",
                sd1: "",
                n1: "",
                mean2: "",
                sd2: "",
                n2: "",
              },
            ])
          }
        >
          + Add study
        </button>

        {full && (
          <p className="mt-4 text-sm text-teal-950">
            <strong>All studies (random DL):</strong> MD {full.pooled.toFixed(3)}{" "}
            [{full.low.toFixed(3)}, {full.high.toFixed(3)}] · I² ≈{" "}
            {full.I2.toFixed(1)}% · k={full.k}
          </p>
        )}
      </div>

      {leaveOneOut.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900">Leave-one-out</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Re-pool after omitting each study. Large swings = influential study.
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {leaveOneOut.map((r) => (
              <li
                key={r.omitted}
                className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2"
              >
                <span className="text-slate-700">
                  Omit <strong>{r.omitted}</strong>
                </span>
                <span className="text-slate-600">
                  {r.pooled != null
                    ? `MD ${r.pooled.toFixed(3)} [${r.low!.toFixed(3)}, ${r.high!.toFixed(3)}] · I² ${r.I2!.toFixed(0)}%`
                    : "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {funnel && full && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            Funnel sketch (precision vs MD)
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Y = 1/SE (higher = more precise). Asymmetry may suggest small-study
            effects — unreliable with few studies. Not a formal test.
          </p>
          <div className="relative mt-4 h-56 rounded-lg bg-slate-50 ring-1 ring-slate-100">
            {/* vertical line at pooled */}
            <div
              className="absolute bottom-6 top-4 w-px bg-teal-600/50"
              style={{
                left: `${((full.pooled + xAbs) / (2 * xAbs)) * 100}%`,
              }}
              title="Pooled MD"
            />
            <div className="absolute bottom-2 left-2 text-[10px] text-slate-400">
              −{xAbs.toFixed(1)}
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">
              MD
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] text-slate-400">
              +{xAbs.toFixed(1)}
            </div>
            <div className="absolute left-1 top-2 text-[10px] text-slate-400">
              High precision
            </div>
            {funnel.map((p) => (
              <div
                key={p.study}
                className="absolute h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-teal-600 shadow"
                style={{
                  left: `${((p.x + xAbs) / (2 * xAbs)) * 100}%`,
                  bottom: `${8 + p.yPct * 0.75}%`,
                }}
                title={`${p.study}: MD ${p.x.toFixed(2)}`}
              />
            ))}
          </div>
          <ul className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-500">
            {funnel.map((p) => (
              <li key={p.study}>● {p.study}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
