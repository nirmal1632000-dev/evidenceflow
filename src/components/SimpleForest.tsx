"use client";

import { useMemo } from "react";
import type { ExtractedStudy } from "@/lib/studies";

/** Try to parse "mean (sd)" or "mean±sd" */
function parseMeanSd(s: string): { mean: number; sd: number } | null {
  if (!s) return null;
  const m = s
    .replace(/,/g, "")
    .match(/(-?\d+\.?\d*)\s*[\(\[]\s*(-?\d+\.?\d*)\s*[\)\]]/);
  if (m) return { mean: Number(m[1]), sd: Number(m[2]) };
  const m2 = s.replace(/,/g, "").match(/(-?\d+\.?\d*)\s*[±+]\s*(-?\d+\.?\d*)/);
  if (m2) return { mean: Number(m2[1]), sd: Number(m2[2]) };
  return null;
}

function parseN(s: string): number | null {
  const n = Number(String(s).trim());
  return Number.isFinite(n) && n >= 2 ? n : null;
}

type EffectRow = {
  label: string;
  md: number;
  se: number;
  low: number;
  high: number;
};

export function SimpleForest({ studies }: { studies: ExtractedStudy[] }) {
  const { rows, pooled } = useMemo(() => {
    const effects: EffectRow[] = [];
    for (const st of studies) {
      const a = parseMeanSd(st.intStats);
      const b = parseMeanSd(st.ctrlStats);
      const n1 = parseN(st.nInt);
      const n2 = parseN(st.nCtrl);
      if (!a || !b || !n1 || !n2 || a.sd <= 0 || b.sd <= 0) continue;
      const md = a.mean - b.mean;
      const se = Math.sqrt((a.sd * a.sd) / n1 + (b.sd * b.sd) / n2);
      if (se <= 0) continue;
      effects.push({
        label: st.authorYear || "Study",
        md,
        se,
        low: md - 1.96 * se,
        high: md + 1.96 * se,
      });
    }
    if (!effects.length) return { rows: [] as EffectRow[], pooled: null };

    const weights = effects.map((e) => 1 / (e.se * e.se));
    const sumW = weights.reduce((a, b) => a + b, 0);
    const md = effects.reduce((a, e, i) => a + weights[i] * e.md, 0) / sumW;
    const se = Math.sqrt(1 / sumW);
    return {
      rows: effects,
      pooled: {
        label: "Pooled (fixed IV)",
        md,
        se,
        low: md - 1.96 * se,
        high: md + 1.96 * se,
      },
    };
  }, [studies]);

  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
        Forest preview needs rows with <strong>Int mean/SD</strong>,{" "}
        <strong>Ctrl mean/SD</strong> (e.g. <code>42.1 (8.2)</code>), and arm N ≥ 2.
        Teaching plot only — use RevMan/R for publication.
      </div>
    );
  }

  const all = pooled ? [...rows, pooled] : rows;
  const absMax = Math.max(
    ...all.flatMap((r) => [Math.abs(r.low), Math.abs(r.high), Math.abs(r.md)]),
    0.01
  );

  function xPct(v: number) {
    // map [-absMax, absMax] → [0, 100]
    return ((v + absMax) / (2 * absMax)) * 100;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-slate-900">
        Teaching forest plot (mean difference)
      </h3>
      <p className="mt-0.5 text-xs text-slate-500">
        MD = intervention − control from extraction stats. Fixed-effect inverse-variance
        for illustration only.
      </p>
      <div className="mt-4 space-y-3">
        {all.map((r, i) => {
          const isPool = pooled && i === all.length - 1;
          const left = xPct(r.low);
          const right = xPct(r.high);
          const mid = xPct(r.md);
          const barLeft = Math.min(left, right);
          const barWidth = Math.abs(right - left);
          return (
            <div key={r.label + i}>
              <div className="mb-0.5 flex justify-between text-xs">
                <span
                  className={
                    isPool ? "font-bold text-teal-800" : "font-medium text-slate-800"
                  }
                >
                  {r.label}
                </span>
                <span className="text-slate-500">
                  {r.md.toFixed(2)} [{r.low.toFixed(2)}, {r.high.toFixed(2)}]
                </span>
              </div>
              <div className="relative h-4 rounded bg-slate-100">
                <div
                  className="absolute top-0 h-full w-px bg-slate-400"
                  style={{ left: "50%" }}
                />
                <div
                  className={`absolute top-1.5 h-1 rounded ${
                    isPool ? "bg-teal-700" : "bg-teal-500/80"
                  }`}
                  style={{ left: `${barLeft}%`, width: `${Math.max(barWidth, 0.5)}%` }}
                />
                <div
                  className={`absolute top-0.5 h-3 w-3 -translate-x-1/2 rotate-45 ${
                    isPool ? "bg-teal-800" : "bg-teal-600"
                  }`}
                  style={{ left: `${mid}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[10px] text-slate-400">
        Center line = 0. Diamond/box marks point estimate; bar is 95% CI.
      </p>
    </div>
  );
}
