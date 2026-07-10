"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STEPS = [
  {
    id: "workspace",
    label: "Open Workspace and create a project",
    href: "/workspace",
  },
  {
    id: "pico",
    label: "Write your PICO (Stage 1)",
    href: "/workspace",
  },
  {
    id: "example",
    label: "Skim the worked example once",
    href: "/example",
  },
  {
    id: "guide",
    label: "Read the How-to path",
    href: "/guide",
  },
  {
    id: "calc",
    label: "Try an MA calculator (optional)",
    href: "/tools/calculator",
  },
];

const KEY = "evidenceflow_onboarding_v1";

export function Onboarding() {
  const [done, setDone] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as { done?: string[]; dismissed?: boolean };
        setDone(p.done || []);
        setDismissed(!!p.dismissed);
      } else {
        setDismissed(false);
      }
    } catch {
      setDismissed(false);
    }
    setReady(true);
  }, []);

  function persist(next: { done: string[]; dismissed: boolean }) {
    setDone(next.done);
    setDismissed(next.dismissed);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  if (!ready || dismissed) return null;

  const pct = Math.round((done.length / STEPS.length) * 100);

  return (
    <div className="border-b border-teal-100 bg-teal-50/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-teal-950">
              Getting started
            </p>
            <span className="text-xs text-teal-800">{pct}%</span>
          </div>
          <ul className="mt-2 space-y-1.5">
            {STEPS.map((s) => {
              const on = done.includes(s.id);
              return (
                <li key={s.id} className="flex items-center gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      const next = on
                        ? done.filter((x) => x !== s.id)
                        : [...done, s.id];
                      persist({ done: next, dismissed: false });
                    }}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[10px] ${
                      on
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-teal-300 bg-white"
                    }`}
                  >
                    {on ? "✓" : ""}
                  </button>
                  <Link
                    href={s.href}
                    className={
                      on
                        ? "text-teal-800/70 line-through"
                        : "font-medium text-teal-950 hover:underline"
                    }
                  >
                    {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <button
          type="button"
          className="shrink-0 text-xs font-semibold text-teal-800 underline"
          onClick={() => persist({ done, dismissed: true })}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
