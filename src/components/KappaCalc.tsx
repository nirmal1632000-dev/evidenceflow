"use client";

import { useMemo, useState } from "react";

/**
 * Cohen's kappa for two raters, binary decisions (include/exclude).
 * 2x2: a=both include, b=R1 include R2 exclude, c=R1 exclude R2 include, d=both exclude
 */
function kappa(a: number, b: number, c: number, d: number) {
  const n = a + b + c + d;
  if (n <= 0) return null;
  const po = (a + d) / n;
  const pYes1 = (a + b) / n;
  const pYes2 = (a + c) / n;
  const pe = pYes1 * pYes2 + (1 - pYes1) * (1 - pYes2);
  if (pe === 1) return { kappa: 1, po, pe, n };
  return { kappa: (po - pe) / (1 - pe), po, pe, n };
}

function interpret(k: number) {
  if (k < 0) return "Less than chance agreement";
  if (k < 0.2) return "Slight agreement";
  if (k < 0.4) return "Fair agreement";
  if (k < 0.6) return "Moderate agreement";
  if (k < 0.8) return "Substantial agreement";
  return "Almost perfect agreement";
}

export function KappaCalc() {
  const [a, setA] = useState("40");
  const [b, setB] = useState("5");
  const [c, setC] = useState("7");
  const [d, setD] = useState("48");

  const result = useMemo(() => {
    const nums = [a, b, c, d].map((x) => Number(x));
    if (nums.some((n) => !Number.isFinite(n) || n < 0)) return null;
    return kappa(nums[0], nums[1], nums[2], nums[3]);
  }, [a, b, c, d]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-slate-900">
        Dual-screening agreement (Cohen’s κ)
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        Enter counts from independent dual screening (include vs exclude). Useful for
        pilot calibration. Landis &amp; Koch-style labels are rules of thumb only.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="text-sm">
          <thead>
            <tr className="text-xs text-slate-500">
              <th className="p-2" />
              <th className="p-2">R2 Include</th>
              <th className="p-2">R2 Exclude</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 text-xs font-medium text-slate-600">R1 Include</td>
              <td className="p-1">
                <input
                  type="number"
                  min={0}
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  className="w-20 rounded border border-slate-200 px-2 py-1"
                  title="Both include"
                />
              </td>
              <td className="p-1">
                <input
                  type="number"
                  min={0}
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  className="w-20 rounded border border-slate-200 px-2 py-1"
                  title="R1 include, R2 exclude"
                />
              </td>
            </tr>
            <tr>
              <td className="p-2 text-xs font-medium text-slate-600">R1 Exclude</td>
              <td className="p-1">
                <input
                  type="number"
                  min={0}
                  value={c}
                  onChange={(e) => setC(e.target.value)}
                  className="w-20 rounded border border-slate-200 px-2 py-1"
                  title="R1 exclude, R2 include"
                />
              </td>
              <td className="p-1">
                <input
                  type="number"
                  min={0}
                  value={d}
                  onChange={(e) => setD(e.target.value)}
                  className="w-20 rounded border border-slate-200 px-2 py-1"
                  title="Both exclude"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {result && (
        <div className="mt-4 rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-950">
          <p>
            <strong>κ = {result.kappa.toFixed(3)}</strong> — {interpret(result.kappa)}
          </p>
          <p className="mt-1 text-xs text-teal-900/80">
            Observed agreement P<sub>o</sub> = {(result.po * 100).toFixed(1)}% · Chance
            agreement P<sub>e</sub> = {(result.pe * 100).toFixed(1)}% · n = {result.n}
          </p>
          <p className="mt-2 text-xs text-teal-900/70">
            Conflicts (b+c) = {Number(b) + Number(c)}. Resolve these by discussion or a
            third reviewer before final inclusion decisions.
          </p>
        </div>
      )}
    </div>
  );
}
