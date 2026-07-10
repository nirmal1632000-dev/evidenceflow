"use client";

import { useMemo, useState } from "react";

export function SearchBuilder({
  onApply,
  readOnly,
}: {
  onApply?: (blocks: string, sample: string) => void;
  readOnly?: boolean;
}) {
  const [p, setP] = useState("student* OR university OR college OR undergraduate*");
  const [i, setI] = useState("mindfulness OR MBSR OR MBCT OR “mindfulness-based”");
  const [o, setO] = useState("anxiety OR anxious OR GAD-7 OR STAI OR BAI");
  const [study, setStudy] = useState(
    "randomized OR randomised OR RCT OR “clinical trial”"
  );
  const [useStudy, setUseStudy] = useState(true);

  const draft = useMemo(() => {
    const parts = [`(${p})`, `(${i})`, `(${o})`];
    if (useStudy && study.trim()) parts.push(`(${study})`);
    return parts.join(" AND ");
  }, [p, i, o, study, useStudy]);

  const blocks = useMemo(
    () =>
      [
        `Block 1 (P): ${p}`,
        `Block 2 (I): ${i}`,
        `Block 3 (O): ${o}`,
        useStudy ? `Block 4 (study design): ${study}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    [p, i, o, study, useStudy]
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-slate-900">Search string builder</h3>
      <p className="mt-1 text-xs text-slate-500">
        Draft concept blocks with OR inside blocks and AND between blocks. Always add
        controlled vocabulary (MeSH/Emtree) on the database platform and peer-review
        before final run.
      </p>

      <div className="mt-4 space-y-3">
        {(
          [
            ["P — Population", p, setP],
            ["I — Intervention", i, setI],
            ["O — Outcomes (optional in search)", o, setO],
          ] as const
        ).map(([label, val, set]) => (
          <label key={label} className="block text-sm">
            <span className="font-medium text-slate-700">{label}</span>
            <textarea
              rows={2}
              disabled={readOnly}
              value={val}
              onChange={(e) => set(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
            />
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={useStudy}
            disabled={readOnly}
            onChange={(e) => setUseStudy(e.target.checked)}
          />
          Include study-design filter block (use carefully — may miss studies)
        </label>
        {useStudy && (
          <textarea
            rows={2}
            disabled={readOnly}
            value={study}
            onChange={(e) => setStudy(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
          />
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-slate-600">Draft combined string</p>
        <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-teal-100 whitespace-pre-wrap">
          {draft}
        </pre>
      </div>

      {!readOnly && onApply && (
        <button
          type="button"
          onClick={() => onApply(blocks, draft)}
          className="mt-3 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white"
        >
          Apply to search fields below
        </button>
      )}
    </div>
  );
}
