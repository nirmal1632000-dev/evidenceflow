"use client";

import { useMemo, useState } from "react";
import {
  hedgesG,
  mdEffect,
  num,
  poolEffects,
  type PoolResult,
} from "@/lib/meta-stats";

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

function emptyRow(): Row {
  return {
    id: crypto.randomUUID(),
    name: "",
    mean1: "",
    sd1: "",
    n1: "",
    mean2: "",
    sd2: "",
    n2: "",
  };
}

function ResultBlock({
  title,
  result,
  scale,
}: {
  title: string;
  result: PoolResult;
  scale: "md" | "smd";
}) {
  const fmt = (x: number) => x.toFixed(3);
  const absMax = Math.max(
    ...result.effects.flatMap((e) => [Math.abs(e.low), Math.abs(e.high)]),
    Math.abs(result.low),
    Math.abs(result.high),
    0.01
  );
  const xPct = (v: number) => ((v + absMax) / (2 * absMax)) * 100;

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-teal-950">
        <strong>
          Pooled {scale.toUpperCase()} ({result.model}
          {result.model === "random" ? ", DL" : ", IV"}):
        </strong>{" "}
        {fmt(result.pooled)} (95% CI {fmt(result.low)} to {fmt(result.high)})
      </p>
      <p className="mt-1 text-xs text-slate-600">
        k = {result.k} · Q = {result.Q.toFixed(2)} (df={result.df}) · I² ≈{" "}
        {result.I2.toFixed(1)}%
        {result.model === "random" && (
          <> · τ² ≈ {result.tau2.toFixed(4)}</>
        )}
      </p>
      <ul className="mt-3 space-y-2">
        {result.effects.map((e) => {
          const left = xPct(e.low);
          const right = xPct(e.high);
          const mid = xPct(e.yi);
          const barLeft = Math.min(left, right);
          const barWidth = Math.max(Math.abs(right - left), 0.5);
          return (
            <li key={e.study} className="text-xs">
              <div className="mb-0.5 flex justify-between text-slate-600">
                <span className="font-medium text-slate-800">{e.study}</span>
                <span>
                  {fmt(e.yi)} [{fmt(e.low)}, {fmt(e.high)}]
                </span>
              </div>
              <div className="relative h-3 rounded bg-white ring-1 ring-slate-100">
                <div className="absolute left-1/2 top-0 h-full w-px bg-slate-400" />
                <div
                  className="absolute top-1 h-1 rounded bg-teal-500"
                  style={{ left: `${barLeft}%`, width: `${barWidth}%` }}
                />
                <div
                  className="absolute top-0.5 h-2 w-2 -translate-x-1/2 rotate-45 bg-teal-700"
                  style={{ left: `${mid}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function MetaCalculator({
  initialRows,
  sourceLabel,
}: {
  initialRows?: Row[];
  sourceLabel?: string;
} = {}) {
  const [measure, setMeasure] = useState<"md" | "smd">("md");
  const [model, setModel] = useState<"fixed" | "random">("random");
  const [rows, setRows] = useState<Row[]>(() => {
    if (initialRows && initialRows.length > 0) {
      return initialRows.map((r) => ({
        ...r,
        id: r.id || crypto.randomUUID(),
      }));
    }
    return [
      {
        id: "1",
        name: "Study A",
        mean1: "12",
        sd1: "4",
        n1: "40",
        mean2: "15",
        sd2: "4.5",
        n2: "38",
      },
      {
        id: "2",
        name: "Study B",
        mean1: "10",
        sd1: "3.5",
        n1: "55",
        mean2: "13",
        sd2: "4",
        n2: "52",
      },
      emptyRow(),
    ];
  });

  const result = useMemo(() => {
    const effects = [];
    for (const r of rows) {
      const m1 = num(r.mean1);
      const sd1 = num(r.sd1);
      const n1 = num(r.n1);
      const m2 = num(r.mean2);
      const sd2 = num(r.sd2);
      const n2 = num(r.n2);
      if ([m1, sd1, n1, m2, sd2, n2].some((x) => !Number.isFinite(x))) continue;
      if (measure === "md") {
        const e = mdEffect(m1, sd1, n1, m2, sd2, n2);
        if (!e) continue;
        effects.push({ study: r.name || "Study", yi: e.md, sei: e.se });
      } else {
        const e = hedgesG(m1, sd1, n1, m2, sd2, n2);
        if (!e) continue;
        effects.push({ study: r.name || "Study", yi: e.g, sei: e.se });
      }
    }
    return poolEffects(effects, model);
  }, [rows, measure, model]);

  function update(id: string, key: keyof Row, value: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        Continuous outcomes
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Mean difference or Hedges’ g (SMD). Random-effects uses DerSimonian–Laird.
        Teaching only — prefer RemL/HKSJ in R for real reviews.
      </p>
      {sourceLabel && (
        <p className="mt-2 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-xs text-teal-950">
          Pre-filled from <strong>{sourceLabel}</strong>. Edit freely; does not write back
          to the project unless you paste results into the Meta-analysis stage.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            ["md", "MD"],
            ["smd", "SMD (Hedges g)"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMeasure(id)}
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              measure === id
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {label}
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
              <th className="py-2 pr-2">Int. mean</th>
              <th className="py-2 pr-2">Int. SD</th>
              <th className="py-2 pr-2">Int. n</th>
              <th className="py-2 pr-2">Ctrl mean</th>
              <th className="py-2 pr-2">Ctrl SD</th>
              <th className="py-2 pr-2">Ctrl n</th>
              <th className="py-2"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100">
                {(
                  [
                    ["name", r.name],
                    ["mean1", r.mean1],
                    ["sd1", r.sd1],
                    ["n1", r.n1],
                    ["mean2", r.mean2],
                    ["sd2", r.sd2],
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
        <div className="mt-6">
          <ResultBlock
            title={`${measure === "md" ? "Mean difference" : "Standardized MD"} · ${model} model`}
            result={result}
            scale={measure}
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          Add complete studies (means, SDs &gt; 0, n ≥ 2 per arm).
        </p>
      )}
    </div>
  );
}
