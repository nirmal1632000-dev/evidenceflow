"use client";

import { useMemo, useState } from "react";
import { hedgesG, mdEffect, num } from "@/lib/meta-stats";

/** Quick single-study effect size calculator for extraction */
export function EffectConverter() {
  const [m1, setM1] = useState("12");
  const [sd1, setSd1] = useState("4");
  const [n1, setN1] = useState("40");
  const [m2, setM2] = useState("15");
  const [sd2, setSd2] = useState("4.5");
  const [n2, setN2] = useState("38");

  const out = useMemo(() => {
    const a = num(m1);
    const b = num(sd1);
    const c = num(n1);
    const d = num(m2);
    const e = num(sd2);
    const f = num(n2);
    if ([a, b, c, d, e, f].some((x) => !Number.isFinite(x))) return null;
    const md = mdEffect(a, b, c, d, e, f);
    const g = hedgesG(a, b, c, d, e, f);
    if (!md || !g) return null;
    return {
      md: md.md,
      mdSe: md.se,
      mdLow: md.md - 1.96 * md.se,
      mdHigh: md.md + 1.96 * md.se,
      g: g.g,
      gSe: g.se,
      gLow: g.g - 1.96 * g.se,
      gHigh: g.g + 1.96 * g.se,
    };
  }, [m1, sd1, n1, m2, sd2, n2]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-slate-900">
        Single-study effect converter
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        Compute MD and Hedges’ g from arm means for one trial — handy while
        extracting. Direction: intervention − control.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs sm:grid-cols-6">
        {(
          [
            ["Int mean", m1, setM1],
            ["Int SD", sd1, setSd1],
            ["Int n", n1, setN1],
            ["Ctrl mean", m2, setM2],
            ["Ctrl SD", sd2, setSd2],
            ["Ctrl n", n2, setN2],
          ] as const
        ).map(([label, val, set]) => (
          <label key={label} className="block">
            <span className="text-slate-500">{label}</span>
            <input
              value={val}
              onChange={(e) => set(e.target.value)}
              className="mt-0.5 w-full rounded border border-slate-200 px-1.5 py-1"
            />
          </label>
        ))}
      </div>
      {out ? (
        <div className="mt-3 space-y-1 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-950">
          <p>
            <strong>MD</strong> {out.md.toFixed(3)} (SE {out.mdSe.toFixed(3)}; 95%
            CI {out.mdLow.toFixed(3)} to {out.mdHigh.toFixed(3)})
          </p>
          <p>
            <strong>Hedges’ g</strong> {out.g.toFixed(3)} (SE {out.gSe.toFixed(3)};
            95% CI {out.gLow.toFixed(3)} to {out.gHigh.toFixed(3)})
          </p>
          <button
            type="button"
            className="mt-1 text-xs font-semibold text-teal-800 underline"
            onClick={() => {
              const text = `MD ${out.md.toFixed(2)} [${out.mdLow.toFixed(2)}, ${out.mdHigh.toFixed(2)}]; g ${out.g.toFixed(2)} [${out.gLow.toFixed(2)}, ${out.gHigh.toFixed(2)}]`;
              void navigator.clipboard.writeText(text);
            }}
          >
            Copy summary to clipboard
          </button>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-500">Enter valid means, SDs, and n.</p>
      )}
    </div>
  );
}
