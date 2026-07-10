"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MetaCalculator } from "@/components/MetaCalculator";
import { BinaryMetaCalculator } from "@/components/BinaryMetaCalculator";
import { loadMaBridge, type MaBridgePayload } from "@/lib/study-to-ma";

function CalculatorInner() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const from = searchParams.get("from");

  const [bridge, setBridge] = useState<MaBridgePayload | null>(null);
  const [tab, setTab] = useState<"md" | "binary">(
    tabParam === "binary" ? "binary" : "md"
  );

  useEffect(() => {
    if (from === "extraction" || from === "project") {
      const payload = loadMaBridge();
      if (payload) {
        setBridge(payload);
        setTab(payload.kind === "binary" ? "binary" : "md");
      }
    }
  }, [from]);

  useEffect(() => {
    if (tabParam === "binary" || tabParam === "md") {
      setTab(tabParam === "binary" ? "binary" : "md");
    }
  }, [tabParam]);

  const sourceLabel = useMemo(() => {
    if (!bridge) return undefined;
    const n =
      bridge.kind === "binary"
        ? bridge.binary?.length ?? 0
        : bridge.continuous?.length ?? 0;
    const title = bridge.projectTitle || "extraction table";
    return `${title} (${n} stud${n === 1 ? "y" : "ies"})`;
  }, [bridge]);

  return (
    <>
      {bridge && (
        <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/80 px-4 py-3 text-sm text-indigo-950">
          <p className="font-semibold">Loaded from project extraction</p>
          <p className="mt-1 text-indigo-900/80">
            {sourceLabel}
            {bridge.skipped.length > 0 && (
              <>
                {" "}
                · {bridge.skipped.length} row
                {bridge.skipped.length === 1 ? "" : "s"} skipped (missing mean/SD
                or events)
              </>
            )}
          </p>
          {bridge.projectId && (
            <Link
              href={`/workspace/projects/${bridge.projectId}/metaanalysis`}
              className="mt-2 inline-block text-xs font-semibold text-indigo-800 underline"
            >
              Back to Meta-analysis stage →
            </Link>
          )}
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("md")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
            tab === "md"
              ? "bg-teal-600 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Continuous (MD / SMD)
        </button>
        <button
          type="button"
          onClick={() => setTab("binary")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
            tab === "binary"
              ? "bg-teal-600 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Binary (RR / OR)
        </button>
      </div>

      <div className="mt-6">
        {tab === "md" ? (
          <MetaCalculator
            key={bridge?.createdAt || "default-md"}
            initialRows={
              bridge?.kind === "continuous" ? bridge.continuous : undefined
            }
            sourceLabel={
              bridge?.kind === "continuous" ? sourceLabel : undefined
            }
          />
        ) : (
          <BinaryMetaCalculator
            key={bridge?.createdAt || "default-bin"}
            initialRows={bridge?.kind === "binary" ? bridge.binary : undefined}
            sourceLabel={bridge?.kind === "binary" ? sourceLabel : undefined}
          />
        )}
      </div>
    </>
  );
}

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/tools" className="text-sm text-teal-700 hover:underline">
        ← Software guide
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900">
        Meta-analysis practice calculators
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Teaching tools: fixed IV or random-effects (DerSimonian–Laird). MD, Hedges’
        g, RR, and OR. Pull data from your project extraction table with{" "}
        <strong>Run in MA calculator</strong>. Prefer RevMan or R (
        <code className="text-sm">metafor</code>) for publication analyses.
      </p>

      <Suspense
        fallback={
          <p className="mt-8 text-sm text-slate-500">Loading calculator…</p>
        }
      >
        <CalculatorInner />
      </Suspense>
    </div>
  );
}
