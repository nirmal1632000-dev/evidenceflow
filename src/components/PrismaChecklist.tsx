"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PRISMA_ITEMS } from "@/lib/prisma-items";

function parseChecked(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? p.map(String) : [];
    } catch {
      return raw ? raw.split(",").map((s) => s.trim()) : [];
    }
  }
  return [];
}

export function PrismaChecklist({
  raw,
  onChange,
  readOnly,
}: {
  raw: unknown;
  onChange: (ids: string[]) => void | Promise<void>;
  readOnly?: boolean;
}) {
  const [checked, setChecked] = useState<string[]>(() => parseChecked(raw));
  const dirty = useRef(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!dirty.current) setChecked(parseChecked(raw));
  }, [raw]);

  const bySection = useMemo(() => {
    const map = new Map<string, typeof PRISMA_ITEMS>();
    for (const item of PRISMA_ITEMS) {
      const list = map.get(item.section) || [];
      list.push(item);
      map.set(item.section, list);
    }
    return map;
  }, []);

  const pct = Math.round((checked.length / PRISMA_ITEMS.length) * 100);

  async function toggle(id: string) {
    if (readOnly) return;
    dirty.current = true;
    const next = checked.includes(id)
      ? checked.filter((x) => x !== id)
      : [...checked, id];
    setChecked(next);
    setSaving(true);
    try {
      await onChange(next);
      dirty.current = false;
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">
            Reporting checklist (PRISMA-inspired)
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Condensed learning checklist. Complete the official PRISMA 2020 items before
            submission.
          </p>
        </div>
        <div className="text-right text-sm">
          <span className="font-bold text-teal-700">{pct}%</span>
          <span className="text-xs text-slate-500">
            {" "}
            · {checked.length}/{PRISMA_ITEMS.length}
            {saving ? " · saving…" : ""}
          </span>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-teal-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-5 space-y-5">
        {[...bySection.entries()].map(([section, items]) => (
          <div key={section}>
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">
              {section}
            </h4>
            <ul className="mt-2 space-y-2">
              {items.map((item) => {
                const on = checked.includes(item.id);
                return (
                  <li key={item.id}>
                    <label
                      className={`flex cursor-pointer gap-3 rounded-lg border px-3 py-2 text-sm ${
                        on
                          ? "border-teal-200 bg-teal-50/50"
                          : "border-slate-100 bg-slate-50/50"
                      } ${readOnly ? "cursor-default" : ""}`}
                    >
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={on}
                        disabled={readOnly}
                        onChange={() => void toggle(item.id)}
                      />
                      <span>
                        <span
                          className={
                            on
                              ? "text-slate-500 line-through"
                              : "font-medium text-slate-800"
                          }
                        >
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {item.tip}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
