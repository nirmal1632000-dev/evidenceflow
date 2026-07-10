"use client";

import { useEffect, useState } from "react";
import type { StageId } from "@/lib/types";
import {
  TEACH_KEYS,
  countTeachProgress,
  getStagePedagogy,
  getTeachAnswers,
} from "@/lib/pedagogy";

export function TeachPanel({
  stageId,
  data,
  readOnly,
  onSave,
}: {
  stageId: StageId;
  data: Record<string, unknown> | undefined;
  readOnly: boolean;
  onSave: (patch: Record<string, string>) => void | Promise<void>;
}) {
  const ped = getStagePedagogy(stageId);
  const initial = getTeachAnswers(data);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setForm(getTeachAnswers(data));
  }, [data, stageId]);

  const progress = countTeachProgress({
    [TEACH_KEYS.reflectDecision]: form.reflectDecision,
    [TEACH_KEYS.reflectUncertain]: form.reflectUncertain,
    [TEACH_KEYS.teachExplain]: form.teachExplain,
    [TEACH_KEYS.teachPeer]: form.teachPeer,
  });

  async function persist(next = form) {
    if (readOnly) return;
    setSaving(true);
    try {
      await onSave({
        [TEACH_KEYS.reflectDecision]: next.reflectDecision,
        [TEACH_KEYS.reflectUncertain]: next.reflectUncertain,
        [TEACH_KEYS.teachExplain]: next.teachExplain,
        [TEACH_KEYS.teachPeer]: next.teachPeer,
      });
      setFlash(true);
      setTimeout(() => setFlash(false), 1200);
    } finally {
      setSaving(false);
    }
  }

  const fields: {
    key: keyof typeof form;
    label: string;
    prompt: string;
    rows: number;
  }[] = [
    {
      key: "reflectDecision",
      label: "Reflect — decision",
      prompt: ped.teach.reflectDecision,
      rows: 3,
    },
    {
      key: "reflectUncertain",
      label: "Reflect — still uncertain",
      prompt: ped.teach.reflectUncertain,
      rows: 3,
    },
    {
      key: "teachExplain",
      label: "Teach it — 90 second explain",
      prompt: ped.teach.explain,
      rows: 4,
    },
    {
      key: "teachPeer",
      label: "Teach it — questions for a junior",
      prompt: ped.teach.peerTeach,
      rows: 3,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4 shadow-sm sm:p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-violet-800">
          Teach · lock learning
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">
          Explain it so you know you understand
        </h2>
        <p className="mt-2 text-sm text-slate-700">
          Teaching is the final gate. Write as if a peer or junior is listening.
          These answers export into your learning pack for supervisors.
        </p>
        <p className="mt-3 text-xs font-medium text-violet-900">
          {progress.filled}/{progress.total} teach prompts filled this stage
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-violet-100">
          <div
            className="h-full rounded-full bg-violet-600 transition-all"
            style={{ width: `${(progress.filled / progress.total) * 100}%` }}
          />
        </div>
      </div>

      {fields.map((f) => (
        <label
          key={f.key}
          className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <span className="text-sm font-semibold text-slate-900">{f.label}</span>
          <span className="mt-1 block text-xs text-slate-500">{f.prompt}</span>
          <textarea
            rows={f.rows}
            disabled={readOnly}
            value={form[f.key]}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
            }
            onBlur={() => void persist()}
            placeholder={readOnly ? "" : "Write in your own words…"}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm outline-none ring-violet-500/20 focus:bg-white focus:ring-2 disabled:opacity-70"
          />
        </label>
      ))}

      {!readOnly && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => void persist()}
            className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save teach answers"}
          </button>
          {flash && (
            <span className="text-sm text-violet-700">Saved to project</span>
          )}
        </div>
      )}

      <p className="text-xs text-slate-500">
        Tip: after teaching this stage, return to <strong>Do</strong> only if a
        gap appeared — then re-teach in one sentence.
      </p>
    </div>
  );
}
