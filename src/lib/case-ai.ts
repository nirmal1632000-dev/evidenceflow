/**
 * AI-assisted case report draft — types, field schema for the model,
 * apply into CaseProject, and manuscript export helpers.
 *
 * Confidentiality: clinical notes should only be sent to the model after
 * explicit user consent and de-identification. We do not persist notes
 * server-side; the API is a pass-through.
 */
import {
  CASE_STAGE_ORDER,
  CASE_STAGES,
  CARE_ITEMS,
  createCaseProject,
  getCaseProject,
  getCaseStage,
  saveCaseStageData,
  type CaseMode,
  type CaseProject,
  type CaseStageId,
} from "./case-report";

/** Stage field map the model must fill (string values only). */
export type CaseAiStageData = Partial<
  Record<CaseStageId, Record<string, string>>
>;

export interface CaseAiDraft {
  title: string;
  mode: CaseMode;
  stages: CaseAiStageData;
  /** Items still missing from notes */
  gaps: string[];
  /** Model caveats (e.g. invented-looking claims avoided) */
  warnings: string[];
}

/** Flat schema description for the LLM system prompt */
export function buildCaseFieldSchemaForPrompt(): string {
  const lines: string[] = [
    "Return a single JSON object with this exact shape:",
    "{",
    '  "title": string,',
    '  "mode": "report" | "series",',
    '  "gaps": string[],',
    '  "warnings": string[],',
    '  "stages": {',
  ];
  for (const id of CASE_STAGE_ORDER) {
    const def = getCaseStage(id);
    lines.push(`    "${id}": {`);
    for (const f of def.fields) {
      lines.push(
        `      "${f.key}": string,  // ${f.label}${f.required ? " (required if known)" : ""}`
      );
    }
    lines.push("    },");
  }
  lines.push("  }", "}");
  lines.push(
    "",
    "Rules:",
    "- Use ONLY facts present in the user notes. Never invent labs, doses, diagnoses, or outcomes.",
    "- If unknown, put empty string \"\" or a short note like \"[not stated in notes]\".",
    "- Prefer de-identified language (age ranges, relative days). Do not invent names or MRNs.",
    "- modeNote in stage why must match mode (report or series).",
    "- consentStatus: one of written | verbal | waived | pending if inferable, else pending.",
    "- Be cautious in discussion/conclusions: n=1 cannot prove efficacy.",
    "- gaps: list CARE-relevant missing pieces.",
    "- warnings: list any places the notes were ambiguous."
  );
  return lines.join("\n");
}

export function emptyCaseAiDraft(): CaseAiDraft {
  const stages: CaseAiStageData = {};
  for (const def of CASE_STAGES) {
    const data: Record<string, string> = {};
    for (const f of def.fields) data[f.key] = "";
    stages[def.id] = data;
  }
  return {
    title: "Untitled case report",
    mode: "report",
    stages,
    gaps: [],
    warnings: [],
  };
}

/** Normalize / merge model JSON into a safe draft */
export function normalizeCaseAiDraft(raw: unknown): CaseAiDraft {
  const base = emptyCaseAiDraft();
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;

  if (typeof o.title === "string" && o.title.trim()) {
    base.title = o.title.trim().slice(0, 200);
  }
  if (o.mode === "series" || o.mode === "report") base.mode = o.mode;

  if (Array.isArray(o.gaps)) {
    base.gaps = o.gaps.map(String).filter(Boolean).slice(0, 30);
  }
  if (Array.isArray(o.warnings)) {
    base.warnings = o.warnings.map(String).filter(Boolean).slice(0, 30);
  }

  const stagesIn =
    o.stages && typeof o.stages === "object"
      ? (o.stages as Record<string, unknown>)
      : {};

  for (const id of CASE_STAGE_ORDER) {
    const def = getCaseStage(id);
    const src =
      stagesIn[id] && typeof stagesIn[id] === "object"
        ? (stagesIn[id] as Record<string, unknown>)
        : {};
    const data: Record<string, string> = { ...(base.stages[id] || {}) };
    for (const f of def.fields) {
      const v = src[f.key];
      data[f.key] = v == null ? "" : String(v);
    }
    if (id === "why") {
      data.modeNote = base.mode;
    }
    base.stages[id] = data;
  }

  return base;
}

/** Create a new local case project and fill all stages from the AI draft. */
export function applyAiDraftToNewProject(draft: CaseAiDraft): CaseProject {
  const project = createCaseProject(draft.title, draft.mode);
  for (const id of CASE_STAGE_ORDER) {
    const data: Record<string, unknown> = { ...(draft.stages[id] || {}) };
    if (id === "why") data.modeNote = draft.mode;
    if (id === "reporting") {
      // Suggest CARE items that look filled enough
      data._careChecks = suggestCareChecks(draft);
    }
    saveCaseStageData(project.id, id, data, {
      status: hasMeaningfulContent(data) ? "in_progress" : "not_started",
      lessonRead: true,
    });
  }
  return getCaseProject(project.id) || project;
}

function hasMeaningfulContent(data: Record<string, unknown>): boolean {
  return Object.entries(data).some(([k, v]) => {
    if (k.startsWith("_")) return false;
    return typeof v === "string" ? v.trim().length > 8 : v != null && v !== "";
  });
}

function suggestCareChecks(draft: CaseAiDraft): string[] {
  const r = draft.stages.reporting || {};
  const c = draft.stages.consent || {};
  const p = draft.stages.patient || {};
  const t = draft.stages.timeline || {};
  const a = draft.stages.assessment || {};
  const i = draft.stages.intervention || {};
  const o = draft.stages.outcome || {};
  const d = draft.stages.discussion || {};
  const checks: string[] = [];
  if (r.title) checks.push("c1");
  if (r.keywords) checks.push("c2");
  if (r.abstract) checks.push("c3");
  if (draft.stages.why?.rationale) checks.push("c4");
  if (p.presentation || p.history) checks.push("c5");
  if (t.timeline) checks.push("c6");
  if (a.findings || a.finalDx) checks.push("c7");
  if (i.interventions) checks.push("c8");
  if (o.outcomes || o.followup) checks.push("c9");
  if (d.literature || d.limitations) checks.push("c10");
  if (o.patientPerspective) checks.push("c11");
  if (c.consentStatus || c.consentNotes) checks.push("c12");
  return checks;
}

/** Full manuscript-style markdown from structured draft (for Word). */
export function buildManuscriptFromAiDraft(draft: CaseAiDraft): string {
  const why = draft.stages.why || {};
  const consent = draft.stages.consent || {};
  const patient = draft.stages.patient || {};
  const timeline = draft.stages.timeline || {};
  const assess = draft.stages.assessment || {};
  const interv = draft.stages.intervention || {};
  const outcome = draft.stages.outcome || {};
  const disc = draft.stages.discussion || {};
  const rep = draft.stages.reporting || {};

  const lines: string[] = [
    `# ${rep.title || draft.title}`,
    ``,
    `> Educational case report draft generated with AI assistance in EvidenceFlow.`,
    `> Verify every clinical fact against source records before use. Not for unsupervised submission.`,
    ``,
  ];

  if (rep.keywords) {
    lines.push(`**Keywords:** ${rep.keywords}`, ``);
  }

  lines.push(`## Abstract`, ``, rep.abstract || "—", ``);

  lines.push(
    `## Introduction`,
    ``,
    why.whatIsKnown || "—",
    ``,
    why.rationale || why.objective || "—",
    ``,
    why.whatThisAdds ? `This report adds: ${why.whatThisAdds}` : "",
    ``
  );

  lines.push(
    `## Patient information`,
    ``,
    patient.baseline || "—",
    ``,
    `### Presentation`,
    ``,
    patient.presentation || "—",
    ``,
    `### History`,
    ``,
    patient.history || "—",
    ``
  );

  if (patient.seriesInclusion) {
    lines.push(`### Series inclusion`, ``, patient.seriesInclusion, ``);
  }

  lines.push(
    `## Timeline`,
    ``,
    timeline.timeline || "—",
    ``,
    `### Key decision points`,
    ``,
    timeline.keyDecisionPoints || "—",
    ``
  );

  lines.push(
    `## Diagnostic assessment`,
    ``,
    `### Findings and investigations`,
    ``,
    assess.findings || "—",
    ``,
    `### Differential diagnosis`,
    ``,
    assess.differential || "—",
    ``,
    `### Diagnosis`,
    ``,
    assess.finalDx || "—",
    ``
  );
  if (assess.challenges) {
    lines.push(`### Diagnostic challenges`, ``, assess.challenges, ``);
  }

  lines.push(
    `## Therapeutic intervention`,
    ``,
    interv.interventions || "—",
    ``,
    `### Rationale`,
    ``,
    interv.rationale || "—",
    ``
  );
  if (interv.harms) {
    lines.push(`### Adverse effects`, ``, interv.harms, ``);
  }

  lines.push(
    `## Follow-up and outcomes`,
    ``,
    outcome.outcomes || "—",
    ``,
    `### Follow-up`,
    ``,
    outcome.followup || "—",
    ``
  );
  if (outcome.patientPerspective) {
    lines.push(`### Patient perspective`, ``, outcome.patientPerspective, ``);
  }

  lines.push(
    `## Discussion`,
    ``,
    disc.literature || "—",
    ``,
    `### Limitations`,
    ``,
    disc.limitations || "—",
    ``,
    `### Take-home messages`,
    ``,
    disc.takeaways || "—",
    ``,
    `### Conclusions`,
    ``,
    disc.conclusions || "—",
    ``
  );

  lines.push(
    `## Consent and privacy`,
    ``,
    `Consent status: ${consent.consentStatus || "—"}`,
    ``,
    consent.consentNotes || "—",
    ``,
    `### De-identification`,
    ``,
    consent.deidentifyPlan || "—",
    ``
  );

  if (draft.gaps.length) {
    lines.push(`## Gaps to complete before submission`, ``);
    for (const g of draft.gaps) lines.push(`- ${g}`);
    lines.push(``);
  }
  if (draft.warnings.length) {
    lines.push(`## Model warnings`, ``);
    for (const w of draft.warnings) lines.push(`- ${w}`);
    lines.push(``);
  }

  lines.push(`## CARE-inspired checklist (educational)`, ``);
  for (const item of CARE_ITEMS) {
    lines.push(`- [ ] ${item.label}`);
  }
  lines.push(
    ``,
    `---`,
    `*Educational draft only. Follow institutional ethics, patient consent, and journal CARE requirements. https://www.care-statement.org/*`
  );

  return lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");
}

/** Soft client-side hints for leftover identifiers (not a guarantee). */
export function scanIdentifierHints(text: string): string[] {
  const hints: string[] = [];
  if (/\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/.test(text)) {
    hints.push("Possible national ID / SSN-like number pattern");
  }
  if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)) {
    hints.push("Email address detected");
  }
  if (/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(text)) {
    hints.push("Phone-like number pattern");
  }
  if (/\b(?:MRN|Hosp(?:ital)?\s*(?:No|Number|#)|UHID|IP\s*No)[:\s#]*\w+/i.test(text)) {
    hints.push("Medical record / hospital number label");
  }
  if (/\b(?:19|20)\d{2}[-/.]\d{1,2}[-/.]\d{1,2}\b/.test(text)) {
    hints.push("Exact calendar dates — consider relative days (Day 0, Week 2)");
  }
  if (/\b(?:Mr|Mrs|Ms|Dr)\.?\s+[A-Z][a-z]+\b/.test(text)) {
    hints.push("Possible name with title — remove personal names");
  }
  return hints;
}

export const PRIVACY_CHECKLIST = [
  {
    id: "names",
    label: "I removed patient names, relatives’ names, and clinician names not needed for learning",
  },
  {
    id: "ids",
    label: "I removed MRN/hospital IDs, phone numbers, emails, and addresses",
  },
  {
    id: "dates",
    label: "I replaced exact dates of birth / admission dates with age range or Day 0 style timing where possible",
  },
  {
    id: "rare",
    label: "I removed rare jobs, exact locations, or details that could re-identify in my setting",
  },
  {
    id: "images",
    label: "I am not pasting raw photos or scans that show faces or identifiers (describe findings in text only)",
  },
  {
    id: "consent",
    label: "I understand these notes will be sent to an external AI API for processing and are not stored as a project until I save them",
  },
] as const;
