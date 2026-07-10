"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  PRIVACY_CHECKLIST,
  applyAiDraftToNewProject,
  buildManuscriptFromAiDraft,
  scanIdentifierHints,
  type CaseAiDraft,
} from "@/lib/case-ai";
import { CASE_STAGE_ORDER, getCaseStage, type CaseMode } from "@/lib/case-report";
import { downloadMarkdownAsDocx, exportSlug } from "@/lib/export-docx";
import { ExportMenu } from "./ExportMenu";

export function CaseAiDraftStudio() {
  const [notes, setNotes] = useState("");
  const [titleHint, setTitleHint] = useState("");
  const [mode, setMode] = useState<CaseMode>("report");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<CaseAiDraft | null>(null);
  const [meta, setMeta] = useState<{ model?: string; provider?: string } | null>(
    null
  );
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState<(typeof CASE_STAGE_ORDER)[number]>(
    "why"
  );

  useEffect(() => {
    fetch("/api/case-report/draft")
      .then((r) => r.json())
      .then((d: { configured?: boolean }) => setConfigured(!!d.configured))
      .catch(() => setConfigured(false));
  }, []);

  const privacyReady = PRIVACY_CHECKLIST.every((c) => checks[c.id]);
  const idHints = useMemo(() => scanIdentifierHints(notes), [notes]);

  const toggleCheck = (id: string) =>
    setChecks((c) => ({ ...c, [id]: !c[id] }));

  async function generate() {
    setError("");
    setSavedProjectId(null);
    if (!privacyReady) {
      setError("Complete all privacy checkboxes before generating.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/case-report/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes,
          titleHint,
          mode,
          privacyAck: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }
      setDraft(data.draft as CaseAiDraft);
      setMeta(data.meta || null);
      setActiveStage("why");
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  }

  function updateField(stageId: (typeof CASE_STAGE_ORDER)[number], key: string, value: string) {
    setDraft((d) => {
      if (!d) return d;
      const stages = { ...d.stages };
      stages[stageId] = { ...(stages[stageId] || {}), [key]: value };
      const next = { ...d, stages };
      if (stageId === "reporting" && key === "title" && value.trim()) {
        next.title = value.trim();
      }
      if (stageId === "why" && key === "modeNote") {
        next.mode = value === "series" ? "series" : "report";
      }
      return next;
    });
  }

  function openAsProject() {
    if (!draft) return;
    try {
      const project = applyAiDraftToNewProject(draft);
      setSavedProjectId(project.id);
      window.location.href = `/designs/case-report/${project.id}/why`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create project");
    }
  }

  const manuscript = draft ? buildManuscriptFromAiDraft(draft) : "";

  const loadDemo = useCallback(() => {
    setNotes(DEMO_NOTES);
    setTitleHint("Drug-associated QT prolongation: a case report");
    setMode("report");
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-6">
      <Link href="/designs/case-report" className="text-sm text-teal-700 underline">
        ← Case report track
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
        AI case report draft
      </h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">
        Paste crude history and investigations. After a privacy checklist, AI
        structures a CARE-style draft you can edit, download as Word, or open as
        a full case-report project (Watch · Do stages).
      </p>

      {/* How AI + privacy works */}
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <h2 className="font-semibold text-slate-900">How AI is integrated</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs leading-relaxed">
            <li>You paste notes in this browser only.</li>
            <li>
              On generate, notes go to our server API, which calls the configured
              LLM (xAI or OpenAI-compatible) — we do not save notes to a database.
            </li>
            <li>
              The model returns structured CARE fields as JSON.
            </li>
            <li>
              You edit here, export Word, or open a local case project
              (saved only in your browser until you choose cloud elsewhere).
            </li>
          </ol>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <h2 className="font-semibold">Confidentiality</h2>
          <p className="mt-2 text-xs leading-relaxed">
            <strong>Yes, this has privacy implications.</strong> De-identified
            notes still leave your device and are processed by a third-party AI
            provider under their data terms. Do not paste full names, MRNs,
            phone numbers, or identifiable images. Follow your hospital policy;
            when in doubt, use institutional tools or fully synthetic teaching
            cases. EvidenceFlow does not retain your notes server-side after the
            request finishes.
          </p>
          {configured === false && (
            <p className="mt-2 rounded-lg bg-white/80 px-2 py-1.5 text-xs text-rose-800">
              AI is not configured on this deployment (missing{" "}
              <code className="text-[11px]">XAI_API_KEY</code>). You can still
              review the UI; generation will fail until a key is set in Vercel /
              env.
            </p>
          )}
          {configured && (
            <p className="mt-2 text-xs text-teal-900">
              AI provider configured on server.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Input column */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold text-slate-900">1. Crude notes</h2>
              <button
                type="button"
                onClick={loadDemo}
                className="text-xs font-semibold text-teal-800 underline"
              >
                Load synthetic demo notes
              </button>
            </div>
            <label className="mt-3 block text-sm">
              <span className="font-medium text-slate-800">Working title (optional)</span>
              <input
                value={titleHint}
                onChange={(e) => setTitleHint(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="e.g. Prolonged QT after antibiotic combination"
              />
            </label>
            <label className="mt-3 block text-sm">
              <span className="font-medium text-slate-800">Type</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as CaseMode)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="report">Single case report</option>
                <option value="series">Case series</option>
              </select>
            </label>
            <label className="mt-3 block text-sm">
              <span className="font-medium text-slate-800">
                History, exam, investigations, course…
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={14}
                placeholder="Paste de-identified notes here…"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs leading-relaxed"
              />
            </label>
            <p className="mt-1 text-[11px] text-slate-500">
              {notes.length.toLocaleString()} characters
            </p>
            {idHints.length > 0 && (
              <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-900">
                <p className="font-semibold">Possible identifiers still in text</p>
                <ul className="mt-1 list-disc pl-4">
                  {idHints.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <p className="mt-1 text-[11px]">
                  Soft check only — not a guarantee of anonymity.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
            <h2 className="font-semibold text-amber-950">
              2. Privacy checklist (required)
            </h2>
            <ul className="mt-3 space-y-2">
              {PRIVACY_CHECKLIST.map((c) => (
                <li key={c.id}>
                  <label className="flex cursor-pointer gap-2 text-xs text-amber-950">
                    <input
                      type="checkbox"
                      checked={!!checks[c.id]}
                      onChange={() => toggleCheck(c.id)}
                      className="mt-0.5"
                    />
                    <span>{c.label}</span>
                  </label>
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={busy || !privacyReady || notes.trim().length < 40}
              onClick={() => void generate()}
              className="mt-4 w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Generating draft…" : "3. Generate CARE draft"}
            </button>
            {error && (
              <p className="mt-2 text-sm text-rose-700" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Output column */}
        <div className="space-y-4">
          {!draft && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Your editable draft will appear here after generation.
              <p className="mt-2 text-xs">
                Then: edit fields → Word export (A) → or open as case project
                stages (B).
              </p>
            </div>
          )}

          {draft && (
            <>
              <div className="rounded-2xl border border-teal-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                      Editable draft
                    </p>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {draft.title}
                    </h2>
                    {meta?.model && (
                      <p className="text-[11px] text-slate-500">
                        Model: {meta.model}
                        {meta.provider ? ` · ${meta.provider}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void downloadMarkdownAsDocx(
                        exportSlug(draft.title) + "-case-draft",
                        manuscript,
                        { title: draft.title }
                      )}
                      className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Download Word
                    </button>
                    <button
                      type="button"
                      onClick={openAsProject}
                      className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-950"
                    >
                      Open as case project
                    </button>
                  </div>
                </div>

                {(draft.gaps.length > 0 || draft.warnings.length > 0) && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {draft.gaps.length > 0 && (
                      <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-950">
                        <p className="font-semibold">Gaps</p>
                        <ul className="mt-1 list-disc pl-4">
                          {draft.gaps.map((g) => (
                            <li key={g}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {draft.warnings.length > 0 && (
                      <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                        <p className="font-semibold">Model warnings</p>
                        <ul className="mt-1 list-disc pl-4">
                          {draft.warnings.map((w) => (
                            <li key={w}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <ExportMenu
                  className="mt-3"
                  compact
                  title={draft.title}
                  items={[
                    {
                      id: "manuscript",
                      label: "Manuscript",
                      suffix: "case-draft",
                      markdown: () => buildManuscriptFromAiDraft(draft),
                      variant: "primary",
                    },
                  ]}
                />
              </div>

              <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
                {CASE_STAGE_ORDER.map((id) => {
                  const s = getCaseStage(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveStage(id)}
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                        activeStage === id
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      {s.number}. {s.shortTitle}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-slate-900">
                  {getCaseStage(activeStage).number}.{" "}
                  {getCaseStage(activeStage).title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Edit freely — AI is a starting point only.
                </p>
                <div className="mt-4 space-y-3">
                  {getCaseStage(activeStage).fields.map((f) => (
                    <label key={f.key} className="block text-sm">
                      <span className="font-medium text-slate-800">{f.label}</span>
                      {f.type === "select" && f.options ? (
                        <select
                          value={draft.stages[activeStage]?.[f.key] || ""}
                          onChange={(e) =>
                            updateField(activeStage, f.key, e.target.value)
                          }
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        >
                          <option value="">—</option>
                          {f.options.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      ) : f.type === "textarea" ? (
                        <textarea
                          rows={4}
                          value={draft.stages[activeStage]?.[f.key] || ""}
                          onChange={(e) =>
                            updateField(activeStage, f.key, e.target.value)
                          }
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                        />
                      ) : (
                        <input
                          value={draft.stages[activeStage]?.[f.key] || ""}
                          onChange={(e) =>
                            updateField(activeStage, f.key, e.target.value)
                          }
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {savedProjectId && (
                <p className="text-sm text-teal-800">
                  Project created.{" "}
                  <Link
                    href={`/designs/case-report/${savedProjectId}/why`}
                    className="font-semibold underline"
                  >
                    Open stages →
                  </Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {!draft && (
        <p className="mt-6 text-center text-[11px] text-slate-400">
          Prefer empty stages?{" "}
          <Link href="/designs/case-report" className="underline">
            Start a blank case project
          </Link>
        </p>
      )}
    </div>
  );
}

const DEMO_NOTES = `Synthetic teaching case only — no real patient.

Adult in mid-30s, previously well, presented to ED after a brief syncopal episode at home. No chest pain. Had been taking a common macrolide antibiotic plus an additional QT-prolonging agent (prescribed elsewhere) for 4 days for presumed respiratory infection.

Exam: alert, BP 118/72, HR 88, O2 sat normal. Cardiac exam unremarkable. No focal neuro deficit.

ECG: QTc markedly prolonged (reported ~520–540 ms range in notes); no ischaemic ST changes. Electrolytes including K and Mg within normal limits per ED labs. Troponin negative. CXR no focal consolidation.

Course: both culprit drugs held. Monitored on telemetry overnight. QTc improved toward normal over 24–48 h. Cardiology reviewed; no structural disease suspected on bedside echo description. Discharged with written advice on drug interactions and GP follow-up; outpatient ECG planned ~1 week.

No recurrent syncope at short telephone follow-up (~2 weeks) per clinic note.

Teaching intent: highlight drug–drug QT risk and early ECG in unexplained syncope. Consent for educational write-up: written consent obtained (simulated). De-identify: use age range, relative days, no names or hospital IDs.
`;

