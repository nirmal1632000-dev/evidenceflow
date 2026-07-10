"use client";

import type { WdtMode } from "@/lib/pedagogy";
import { countTeachProgress } from "@/lib/pedagogy";

const TABS: {
  id: WdtMode;
  label: string;
  short: string;
  color: string;
  active: string;
}[] = [
  {
    id: "watch",
    label: "Watch",
    short: "Model",
    color: "text-amber-800",
    active: "bg-amber-500 text-white shadow-sm",
  },
  {
    id: "do",
    label: "Do",
    short: "Your work",
    color: "text-teal-800",
    active: "bg-teal-600 text-white shadow-sm",
  },
  {
    id: "teach",
    label: "Teach",
    short: "Explain",
    color: "text-violet-800",
    active: "bg-violet-600 text-white shadow-sm",
  },
];

export function WdtTabs({
  mode,
  onChange,
  stageData,
}: {
  mode: WdtMode;
  onChange: (m: WdtMode) => void;
  stageData?: Record<string, unknown>;
}) {
  const teach = countTeachProgress(stageData);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="mb-2 px-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Learn by doing · watch → do → teach
        </p>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {TABS.map((t) => {
          const isOn = mode === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`rounded-lg px-2 py-2.5 text-center transition ${
                isOn ? t.active : `bg-slate-50 hover:bg-slate-100 ${t.color}`
              }`}
            >
              <span className="block text-sm font-bold">{t.label}</span>
              <span
                className={`block text-[10px] ${
                  isOn ? "text-white/90" : "text-slate-500"
                }`}
              >
                {t.id === "teach"
                  ? `${teach.filled}/4 prompts`
                  : t.short}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
