"use client";

import { useMemo, useState } from "react";
import { num, poolEffects } from "@/lib/meta-stats";

type Row = {
  id: string;
  name: string;
  e1: string;
  n1: string;
  e2: string;
  n2: string;
};

function emptyRow(): Row {
  return {
    id: crypto.randomUUID(),
    name: "",
    e1: "",
    n1: "",
    e2: "",
    n2: "",
  };
}

function studyLogEffect(
  e1: number,
  n1: number,
  e2: number,
  n2: number,
  measure: "rr" | "or"
) {
  let a = e1;
  let b = n1 - e1;
  let c = e2;
  let d = n2 - e2;
  if (a < 0 || b < 0 || c < 0 || d < 0 || n1 < 1 || n2 < 1) return null;

  let corrected = false;
  if (a === 0 || b === 0 || c === 0 || d === 0) {
    a += 0.5;
    b += 0.5;
    c += 0.5;
    d += 0.5;
    corrected = true;
  }

  if (measure === "rr") {
    const logRR = Math.log(a / (a + b) / (c / (c + d)));
    const se = Math.sqrt(1 / a - 1 / (a + b) + 1 / c - 1 / (c + d));
    if (!Number.isFinite(logRR) || se <= 0) return null;
    return { logEffect: logRR, se, corrected };
  }

  const logOR = Math.log((a * d) / (b * c));
  const se = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
  if (!Number.isFinite(logOR) || se <= 0) return null;
  return { logEffect: logOR, se, corrected };
}

export function BinaryMetaCalculator({
  initialRows,
  sourceLabel,
}: {
  initialRows?: Row[];
  sourceLabel?: string;
} = {}) {
  const [measure, setMeasure] = useState<"rr" | "or">("rr");
  const [model, setModel] = useState<"fixed" | "random">("random");
  const [rows, setRows] = useState<Row[]>(() => {
    if (initialRows && initialRows.length > 0) {
      return initialRows.map((r) => ({
        ...r,
        id: r.id || crypto.randomUUID(),
      }));
    }
    return [
      { id: "1", name: "Study A", e1: "10", n1: "100", e2: "20", n2: "100" },
      { id: "2", name: "Study B", e1: "8", n1: "80", e2: "15", n2: "82" },
      emptyRow(),
    ];
  });

  const result = useMemo(() => {
    const effects = [];
    const correctedStudies: string[] = [];
    for (const r of rows) {
      const e1 = num(r.e1);
      const n1 = num(r.n1);
      const e2 = num(r.e2);
      const n2 = num(r.n2);
      if ([e1, n1, e2, n2].some((x) => !Number.isFinite(x))) continue;
      if (e1 > n1 || e2 > n2) continue;
      const s = studyLogEffect(e1, n1, e2, n2, measure);
      if (!s) continue;
      const name = r.name || "Study";
      if (s.corrected) correctedStudies.push(name);
      effects.push({ study: name, yi: s.logEffect, sei: s.se });
    }
    const pooled = poolEffects(effects, model);
    if (!pooled) return null;
    return { pooled, correctedStudies };
  }, [rows, measure, model]);

  function update(id: string, key: keyof Row, value: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Binary outcomes: risk ratio / odds ratio
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Analysis on the log scale; results shown as RR/OR. Random = DerSimonian–Laird.
            Zero cells: 0.5 continuity correction. Teaching only.
          </p>
          {sourceLabel && (
            <p className="mt-2 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-xs text-teal-950">
              Pre-filled from <strong>{sourceLabel}</strong>. Edit freely; paste pooled
              results back into your project Meta-analysis stage when ready.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["rr", "or"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMeasure(m)}
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
              measure === m
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {m}
          </button>
        ))}
        {(
          [
            ["random", "Random (DL)"],
            ["fixed", "Fixed (IV)"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setModel(id)}
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              model === id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-2">Study</th>
              <th className="py-2 pr-2">Events int</th>
              <th className="py-2 pr-2">N int</th>
              <th className="py-2 pr-2">Events ctrl</th>
              <th className="py-2 pr-2">N ctrl</th>
              <th className="py-2"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100">
                {(
                  [
                    ["name", r.name],
                    ["e1", r.e1],
                    ["n1", r.n1],
                    ["e2", r.e2],
                    ["n2", r.n2],
                  ] as const
                ).map(([key, val]) => (
                  <td key={key} className="py-1.5 pr-2">
                    <input
                      value={val}
                      onChange={(e) => update(r.id, key, e.target.value)}
                      className="w-20 rounded border border-slate-200 px-1.5 py-1 sm:w-24"
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
        onClick={() => setRows((rs) => [...rs, emptyRow()])}
        className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium"
      >
        + Add study
      </button>

      {result ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-950">
            <p>
              <strong>
                Pooled {measure.toUpperCase()} ({result.pooled.model}
                {result.pooled.model === "random" ? ", DL" : ""}):
              </strong>{" "}
              {Math.exp(result.pooled.pooled).toFixed(3)} (95% CI{" "}
              {Math.exp(result.pooled.low).toFixed(3)} to{" "}
              {Math.exp(result.pooled.high).toFixed(3)})
            </p>
            <p className="mt-1">
              k = {result.pooled.k} · I² ≈ {result.pooled.I2.toFixed(1)}%
              {result.pooled.model === "random" && (
                <> · τ² (log scale) ≈ {result.pooled.tau2.toFixed(4)}</>
              )}
            </p>
            {result.correctedStudies.length > 0 && (
              <p className="mt-1 text-xs text-amber-800">
                Continuity correction applied: {result.correctedStudies.join(", ")}
              </p>
            )}
          </div>
          <ul className="space-y-2 text-sm">
            {result.pooled.effects.map((e) => (
              <li
                key={e.study}
                className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2"
              >
                <span className="font-medium text-slate-800">{e.study}</span>
                <span className="text-slate-600">
                  {measure.toUpperCase()} {Math.exp(e.yi).toFixed(2)} [
                  {Math.exp(e.low).toFixed(2)}, {Math.exp(e.high).toFixed(2)}]
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          Enter events and totals (events ≤ N) for at least one study.
        </p>
      )}
    </div>
  );
}
