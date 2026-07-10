"use client";

import { useEffect, useState } from "react";

export function TeamNotes({
  value,
  onSave,
  readOnly,
  lastHint,
}: {
  value: string;
  onSave: (text: string) => void | Promise<void>;
  readOnly?: boolean;
  lastHint?: string;
}) {
  const [text, setText] = useState(value);
  const [saving, setSaving] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(value);
  }, [value, focused]);

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 shadow-sm">
      <h2 className="font-semibold text-indigo-950">Team notes (this stage)</h2>
      <p className="mt-0.5 text-xs text-indigo-900/70">
        Shared discussion: conflicts, decisions, who does what next. Visible to all
        collaborators on cloud projects.
      </p>
      <textarea
        rows={4}
        disabled={readOnly}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="e.g. R1 and R2 disagreed on 12 abstracts — resolved by third reviewer. Next: full texts in Drive folder X."
        className="mt-3 w-full rounded-lg border border-indigo-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400/40 disabled:opacity-70"
      />
      {!readOnly && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await onSave(text);
              } finally {
                setSaving(false);
              }
            }}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save team notes"}
          </button>
          {lastHint && (
            <span className="text-[10px] text-indigo-800/60">{lastHint}</span>
          )}
        </div>
      )}
    </div>
  );
}
