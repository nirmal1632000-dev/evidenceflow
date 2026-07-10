/**
 * Resident thesis progress tracker — protocol → data → writing → submission → publication.
 * Local storage only. Educational roadmap so residents always know the next move.
 */

export type ThesisStageId =
  | "topic"
  | "mentor"
  | "protocol"
  | "ethics"
  | "literature"
  | "methods"
  | "data"
  | "analysis"
  | "writing"
  | "submission"
  | "defense"
  | "publication";

export type ThesisStageStatus = "not_started" | "in_progress" | "blocked" | "complete";

export interface ThesisChecklistItem {
  id: string;
  label: string;
}

export interface ThesisStageDef {
  id: ThesisStageId;
  number: number;
  title: string;
  shortTitle: string;
  phase: string;
  summary: string;
  /** What “done” looks like */
  doneLooksLike: string;
  /** When residents feel stuck */
  stuckTips: string[];
  checklist: ThesisChecklistItem[];
  fields: {
    key: string;
    label: string;
    type: "text" | "textarea" | "date";
    placeholder?: string;
  }[];
}

export interface ThesisStageProgress {
  status: ThesisStageStatus;
  data: Record<string, string>;
  checks: string[];
  updatedAt?: string;
}

export interface ThesisProject {
  id: string;
  title: string;
  specialty: string;
  degree: string;
  institution: string;
  createdAt: string;
  updatedAt: string;
  currentStage: ThesisStageId;
  stages: Record<ThesisStageId, ThesisStageProgress>;
}

export const THESIS_STAGE_ORDER: ThesisStageId[] = [
  "topic",
  "mentor",
  "protocol",
  "ethics",
  "literature",
  "methods",
  "data",
  "analysis",
  "writing",
  "submission",
  "defense",
  "publication",
];

export const THESIS_STAGES: ThesisStageDef[] = [
  {
    id: "topic",
    number: 1,
    title: "Topic & feasibility",
    shortTitle: "Topic",
    phase: "Start",
    summary: "Pick a question you can finish in residency time with available data/patients.",
    doneLooksLike: "One clear research question + why it is feasible in your setting.",
    stuckTips: [
      "Too broad? Narrow population, setting, or outcome until sample size is realistic.",
      "No idea? List 3 problems you see weekly on wards; pick one with measurable outcome.",
      "Guide not free? Draft 1-page synopsis yourself before the meeting.",
    ],
    checklist: [
      { id: "t1", label: "Research question written in one sentence" },
      { id: "t2", label: "Checked that data/patients will be available in time" },
      { id: "t3", label: "Compared with 2–3 recent local/published studies" },
      { id: "t4", label: "Confirmed design type (case series / observational / trial / SR…)" },
    ],
    fields: [
      { key: "question", label: "Research question", type: "textarea", placeholder: "In … does … compared with … affect …?" },
      { key: "why", label: "Why this topic?", type: "textarea" },
      { key: "feasibility", label: "Feasibility notes (time, sample, cost)", type: "textarea" },
      { key: "design", label: "Likely study design", type: "text", placeholder: "e.g. prospective cohort" },
      { key: "deadline", label: "Target date to lock topic", type: "date" },
      { key: "blocker", label: "Current blocker", type: "textarea", placeholder: "What is stopping progress?" },
      { key: "nextAction", label: "Next action this week", type: "textarea" },
    ],
  },
  {
    id: "mentor",
    number: 2,
    title: "Guide, co-guide & expectations",
    shortTitle: "Mentor",
    phase: "Start",
    summary: "Who supervises you, how often you meet, and what they expect at each milestone.",
    doneLooksLike: "Named guide + meeting cadence + shared expectations written down.",
    stuckTips: [
      "No reply from guide? Send a 5-bullet email with question + options + your preferred plan.",
      "Conflicting advice? Ask for one written decision after a joint meeting.",
      "Book the next slot before leaving every meeting.",
    ],
    checklist: [
      { id: "m1", label: "Guide (and co-guide if any) confirmed" },
      { id: "m2", label: "Meeting frequency agreed" },
      { id: "m3", label: "Department thesis rules / deadlines collected" },
      { id: "m4", label: "Roles clear (who analyses, who writes, who funds kits)" },
    ],
    fields: [
      { key: "guide", label: "Guide name & role", type: "text" },
      { key: "coGuide", label: "Co-guide (if any)", type: "text" },
      { key: "meetings", label: "Meeting plan", type: "textarea", placeholder: "e.g. 2nd Tuesday monthly" },
      { key: "expectations", label: "What guide expects by next milestone", type: "textarea" },
      { key: "deadline", label: "Next meeting date", type: "date" },
      { key: "blocker", label: "Current blocker", type: "textarea" },
      { key: "nextAction", label: "Next action this week", type: "textarea" },
    ],
  },
  {
    id: "protocol",
    number: 3,
    title: "Protocol / synopsis",
    shortTitle: "Protocol",
    phase: "Plan",
    summary: "Write the plan before you collect: background, aims, methods, sample size outline, timeline.",
    doneLooksLike: "Synopsis/protocol drafted and reviewed by guide (even if not final).",
    stuckTips: [
      "Blank page? Fill EvidenceFlow design track first, then paste into protocol.",
      "Sample size unknown? Note formula + assumptions; refine with statistician later.",
      "Use a department template if one exists — don’t invent structure.",
    ],
    checklist: [
      { id: "p1", label: "Background + aims written" },
      { id: "p2", label: "Methods (design, eligibility, outcomes) written" },
      { id: "p3", label: "Sample size plan drafted" },
      { id: "p4", label: "Timeline / Gantt for residency years" },
      { id: "p5", label: "Guide has reviewed at least one draft" },
    ],
    fields: [
      { key: "version", label: "Protocol version", type: "text", placeholder: "v0.3" },
      { key: "aims", label: "Primary & secondary aims", type: "textarea" },
      { key: "methodsSummary", label: "Methods summary", type: "textarea" },
      { key: "samplePlan", label: "Sample size plan", type: "textarea" },
      { key: "timeline", label: "Project timeline", type: "textarea" },
      { key: "deadline", label: "Target protocol freeze date", type: "date" },
      { key: "blocker", label: "Current blocker", type: "textarea" },
      { key: "nextAction", label: "Next action this week", type: "textarea" },
    ],
  },
  {
    id: "ethics",
    number: 4,
    title: "Ethics / IEC / IRB",
    shortTitle: "Ethics",
    phase: "Plan",
    summary: "Submit for ethics approval before recruitment or identifiable data use.",
    doneLooksLike: "IEC decision letter received (or documented exemption).",
    stuckTips: [
      "Forms slow? Prepare consent, data sheet, and CVs in one folder first.",
      "Queries from committee? Answer point-by-point in a table; don’t rewrite whole protocol.",
      "Never start identifiable data collection without approval unless formal waiver.",
    ],
    checklist: [
      { id: "e1", label: "Application form completed" },
      { id: "e2", label: "Consent / assent documents ready" },
      { id: "e3", label: "Submitted to IEC/IRB" },
      { id: "e4", label: "Queries responded (if any)" },
      { id: "e5", label: "Approval / exemption letter filed" },
    ],
    fields: [
      { key: "status", label: "Ethics status", type: "text", placeholder: "Drafting / Submitted / Approved / Query" },
      { key: "ref", label: "IEC reference number", type: "text" },
      { key: "notes", label: "Submission notes / queries", type: "textarea" },
      { key: "deadline", label: "Target approval date", type: "date" },
      { key: "blocker", label: "Current blocker", type: "textarea" },
      { key: "nextAction", label: "Next action this week", type: "textarea" },
    ],
  },
  {
    id: "literature",
    number: 5,
    title: "Literature review",
    shortTitle: "Lit review",
    phase: "Plan",
    summary: "Know what is already known; build references as you go (don’t leave it to the end).",
    doneLooksLike: "Living folder of key papers + short summary table of evidence.",
    stuckTips: [
      "Search PubMed + one specialty database; save strings in EvidenceFlow/search notes.",
      "Make a 10-row evidence table (author, n, design, finding, limitation).",
      "Use a reference manager from day 1 (Zotero).",
    ],
    checklist: [
      { id: "l1", label: "Search strategy documented" },
      { id: "l2", label: "Reference manager library started" },
      { id: "l3", label: "Evidence summary table (key papers)" },
      { id: "l4", label: "Gap your study fills is written in 3–5 lines" },
    ],
    fields: [
      { key: "databases", label: "Databases searched", type: "text" },
      { key: "keyPapers", label: "Key papers / themes", type: "textarea" },
      { key: "gap", label: "Evidence gap your thesis addresses", type: "textarea" },
      { key: "deadline", label: "Target date for draft lit chapter outline", type: "date" },
      { key: "blocker", label: "Current blocker", type: "textarea" },
      { key: "nextAction", label: "Next action this week", type: "textarea" },
    ],
  },
  {
    id: "methods",
    number: 6,
    title: "Methods finalisation & tools",
    shortTitle: "Methods",
    phase: "Build",
    summary: "CRF/questionnaire, SOPs, pilot, sample size locked, analysis plan written.",
    doneLooksLike: "Tools piloted; you could hand methods to a junior and they could run day 1.",
    stuckTips: [
      "Pilot on 5 forms — fix confusing items before main study.",
      "Define primary outcome exactly (scale, time point, how missing handled).",
      "Book statistician early with a one-page analysis plan.",
    ],
    checklist: [
      { id: "me1", label: "Case record form / questionnaire final" },
      { id: "me2", label: "Pilot done and form revised" },
      { id: "me3", label: "Sample size calculation documented" },
      { id: "me4", label: "Statistical analysis plan written" },
      { id: "me5", label: "Linked EvidenceFlow design project (optional)" },
    ],
    fields: [
      { key: "tools", label: "Tools / CRF / scales", type: "textarea" },
      { key: "pilot", label: "Pilot findings", type: "textarea" },
      { key: "analysisPlan", label: "Analysis plan summary", type: "textarea" },
      { key: "efLink", label: "EvidenceFlow project link/title (optional)", type: "text" },
      { key: "deadline", label: "Ready-to-collect date", type: "date" },
      { key: "blocker", label: "Current blocker", type: "textarea" },
      { key: "nextAction", label: "Next action this week", type: "textarea" },
    ],
  },
  {
    id: "data",
    number: 7,
    title: "Data collection",
    shortTitle: "Data",
    phase: "Build",
    summary: "Recruit/collect steadily; track numbers weekly so the thesis doesn’t stall silently.",
    doneLooksLike: "Target sample reached (or honest stop with reason) + clean master sheet.",
    stuckTips: [
      "Low recruitment? Log refusals and fix time-of-day / inclusion bottlenecks.",
      "Track n weekly in a simple chart; share with guide monthly.",
      "Back up data in two places; never only on one USB.",
    ],
    checklist: [
      { id: "d1", label: "Recruitment / collection started" },
      { id: "d2", label: "Weekly count logged" },
      { id: "d3", label: "Missing data rules followed" },
      { id: "d4", label: "Target n reached or stop rule documented" },
      { id: "d5", label: "Master data sheet cleaned (v1)" },
    ],
    fields: [
      { key: "targetN", label: "Target sample size", type: "text" },
      { key: "currentN", label: "Current n", type: "text" },
      { key: "period", label: "Collection period", type: "text", placeholder: "Jan 2025 – Jun 2026" },
      { key: "issues", label: "Recruitment / quality issues", type: "textarea" },
      { key: "deadline", label: "Target finish collection", type: "date" },
      { key: "blocker", label: "Current blocker", type: "textarea" },
      { key: "nextAction", label: "Next action this week", type: "textarea" },
    ],
  },
  {
    id: "analysis",
    number: 8,
    title: "Analysis",
    shortTitle: "Analysis",
    phase: "Build",
    summary: "Lock data version, run planned analyses, keep a log of decisions.",
    doneLooksLike: "Primary analysis done with planned sensitivity checks; tables drafted.",
    stuckTips: [
      "Don’t invent analyses after seeing p-values — stick to the plan; label exploratories.",
      "If stuck in software, ask for a 1-hour stats clinic with cleaned variables list.",
      "Save syntax/scripts so results are reproducible.",
    ],
    checklist: [
      { id: "a1", label: "Data frozen / version named" },
      { id: "a2", label: "Descriptive tables done" },
      { id: "a3", label: "Primary analysis done" },
      { id: "a4", label: "Key figures drafted" },
      { id: "a5", label: "Results checked with guide/statistician" },
    ],
    fields: [
      { key: "software", label: "Software used", type: "text", placeholder: "R / SPSS / Stata / Excel" },
      { key: "primaryResult", label: "Primary result (plain language)", type: "textarea" },
      { key: "notes", label: "Analysis notes / decisions", type: "textarea" },
      { key: "deadline", label: "Target analysis complete", type: "date" },
      { key: "blocker", label: "Current blocker", type: "textarea" },
      { key: "nextAction", label: "Next action this week", type: "textarea" },
    ],
  },
  {
    id: "writing",
    number: 9,
    title: "Thesis writing",
    shortTitle: "Writing",
    phase: "Write",
    summary: "Chapters: intro, methods, results, discussion; write methods early, results after tables.",
    doneLooksLike: "Full draft circulated to guide at least once.",
    stuckTips: [
      "Write methods while collecting — memory is fresh.",
      "Results: tables first, text second. Discussion last.",
      "One chapter per weekend sprint beats “I’ll write after exams.”",
    ],
    checklist: [
      { id: "w1", label: "Introduction draft" },
      { id: "w2", label: "Methods draft" },
      { id: "w3", label: "Results draft + tables/figures" },
      { id: "w4", label: "Discussion & conclusion draft" },
      { id: "w5", label: "References formatted" },
      { id: "w6", label: "Full draft to guide" },
    ],
    fields: [
      { key: "progress", label: "Chapter progress notes", type: "textarea" },
      { key: "wordCount", label: "Approx. word count", type: "text" },
      { key: "deadline", label: "Target full draft date", type: "date" },
      { key: "blocker", label: "Current blocker", type: "textarea" },
      { key: "nextAction", label: "Next action this week", type: "textarea" },
    ],
  },
  {
    id: "submission",
    number: 10,
    title: "Department / university submission",
    shortTitle: "Submit",
    phase: "Write",
    summary: "Formatting, plagiarism check, certificates, soft/hard copy rules, fees.",
    doneLooksLike: "Thesis submitted per university checklist; receipt saved.",
    stuckTips: [
      "Download the university thesis manual early — margins and certificates sink weeks.",
      "Run plagiarism check on a near-final draft, not the night before.",
      "Keep a folder: approval letters, consent templates, tool licenses.",
    ],
    checklist: [
      { id: "s1", label: "University formatting rules applied" },
      { id: "s2", label: "Plagiarism / similarity check done" },
      { id: "s3", label: "Required certificates signed" },
      { id: "s4", label: "Soft copy submitted" },
      { id: "s5", label: "Hard copies submitted (if required)" },
    ],
    fields: [
      { key: "portal", label: "Submission portal / office", type: "text" },
      { key: "receipt", label: "Receipt / reference", type: "text" },
      { key: "notes", label: "Submission notes", type: "textarea" },
      { key: "deadline", label: "University deadline", type: "date" },
      { key: "blocker", label: "Current blocker", type: "textarea" },
      { key: "nextAction", label: "Next action this week", type: "textarea" },
    ],
  },
  {
    id: "defense",
    number: 11,
    title: "Viva / defense prep",
    shortTitle: "Defense",
    phase: "Finish",
    summary: "Anticipate questions on methods, bias, sample size, and clinical meaning.",
    doneLooksLike: "Slide deck ready + mock viva done + corrections plan.",
    stuckTips: [
      "Prepare 10 likely questions (limitations, ethics, sample size, one surprising result).",
      "Do a 20-minute mock with a peer who wasn’t on the project.",
      "Print one-page summary of aims, methods, primary result.",
    ],
    checklist: [
      { id: "v1", label: "Presentation slides ready" },
      { id: "v2", label: "Mock viva completed" },
      { id: "v3", label: "Known limitations rehearsed" },
      { id: "v4", label: "Post-viva corrections tracked" },
    ],
    fields: [
      { key: "date", label: "Viva date (if known)", type: "date" },
      { key: "questions", label: "Likely questions & answers", type: "textarea" },
      { key: "corrections", label: "Corrections requested", type: "textarea" },
      { key: "blocker", label: "Current blocker", type: "textarea" },
      { key: "nextAction", label: "Next action this week", type: "textarea" },
    ],
  },
  {
    id: "publication",
    number: 12,
    title: "Publication plan",
    shortTitle: "Publish",
    phase: "Finish",
    summary: "Turn thesis work into a paper: target journal, reporting guideline, authorship, submission.",
    doneLooksLike: "Manuscript submitted (or deliberate decision not to publish + reason).",
    stuckTips: [
      "Start from EvidenceFlow journal Word draft of your design track.",
      "Pick journal by scope + turnaround + open access fees you can afford.",
      "Authorship order agreed in writing before heavy editing.",
    ],
    checklist: [
      { id: "pub1", label: "Target journal shortlist (2–3)" },
      { id: "pub2", label: "Reporting guideline chosen (CARE/STROBE/CONSORT/PRISMA…)" },
      { id: "pub3", label: "Manuscript draft from thesis" },
      { id: "pub4", label: "Authorship agreed" },
      { id: "pub5", label: "Submitted or decision documented" },
    ],
    fields: [
      { key: "journals", label: "Target journals", type: "textarea" },
      { key: "guideline", label: "Reporting guideline", type: "text" },
      { key: "status", label: "Publication status", type: "text", placeholder: "Drafting / Submitted / Under review / Accepted" },
      { key: "deadline", label: "Target submit paper", type: "date" },
      { key: "blocker", label: "Current blocker", type: "textarea" },
      { key: "nextAction", label: "Next action this week", type: "textarea" },
    ],
  },
];

const STORAGE_KEY = "evidenceflow_thesis_projects_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function readAll(): ThesisProject[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ThesisProject[];
  } catch {
    return [];
  }
}

function writeAll(projects: ThesisProject[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getThesisStage(id: ThesisStageId): ThesisStageDef {
  const s = THESIS_STAGES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown thesis stage ${id}`);
  return s;
}

export function getNextThesisStage(id: ThesisStageId): ThesisStageDef | null {
  const i = THESIS_STAGE_ORDER.indexOf(id);
  if (i < 0 || i >= THESIS_STAGE_ORDER.length - 1) return null;
  return getThesisStage(THESIS_STAGE_ORDER[i + 1]);
}

export function getPrevThesisStage(id: ThesisStageId): ThesisStageDef | null {
  const i = THESIS_STAGE_ORDER.indexOf(id);
  if (i <= 0) return null;
  return getThesisStage(THESIS_STAGE_ORDER[i - 1]);
}

export function createEmptyThesisStages(): Record<ThesisStageId, ThesisStageProgress> {
  const stages = {} as Record<ThesisStageId, ThesisStageProgress>;
  for (const id of THESIS_STAGE_ORDER) {
    stages[id] = { status: "not_started", data: {}, checks: [] };
  }
  return stages;
}

export function listThesisProjects(): ThesisProject[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getThesisProject(id: string): ThesisProject | null {
  return readAll().find((p) => p.id === id) ?? null;
}

export function createThesisProject(opts: {
  title: string;
  specialty?: string;
  degree?: string;
  institution?: string;
}): ThesisProject {
  const now = new Date().toISOString();
  const project: ThesisProject = {
    id: crypto.randomUUID(),
    title: opts.title.trim() || "My residency thesis",
    specialty: opts.specialty?.trim() || "",
    degree: opts.degree?.trim() || "MD/MS thesis",
    institution: opts.institution?.trim() || "",
    createdAt: now,
    updatedAt: now,
    currentStage: "topic",
    stages: createEmptyThesisStages(),
  };
  const all = readAll();
  all.push(project);
  writeAll(all);
  return project;
}

export function updateThesisProject(project: ThesisProject): ThesisProject {
  const all = readAll();
  const next = { ...project, updatedAt: new Date().toISOString() };
  const idx = all.findIndex((p) => p.id === project.id);
  if (idx === -1) all.push(next);
  else all[idx] = next;
  writeAll(all);
  return next;
}

export function deleteThesisProject(id: string) {
  writeAll(readAll().filter((p) => p.id !== id));
}

export function saveThesisStage(
  projectId: string,
  stageId: ThesisStageId,
  patch: {
    data?: Record<string, string>;
    checks?: string[];
    status?: ThesisStageStatus;
  }
): ThesisProject | null {
  const project = getThesisProject(projectId);
  if (!project) return null;
  const prev = project.stages[stageId];
  const data = { ...prev.data, ...(patch.data || {}) };
  const checks = patch.checks ?? prev.checks;
  let status = patch.status ?? prev.status;
  if (!patch.status) {
    const has =
      checks.length > 0 ||
      Object.values(data).some((x) => String(x || "").trim().length > 0);
    if (status === "not_started" && has) status = "in_progress";
  }
  project.stages[stageId] = {
    status,
    data,
    checks,
    updatedAt: new Date().toISOString(),
  };
  project.currentStage = stageId;
  return updateThesisProject(project);
}

export function computeThesisProgress(project: ThesisProject) {
  const total = THESIS_STAGE_ORDER.length;
  const completed = THESIS_STAGE_ORDER.filter(
    (id) => project.stages[id]?.status === "complete"
  ).length;
  const blocked = THESIS_STAGE_ORDER.filter(
    (id) => project.stages[id]?.status === "blocked"
  ).length;
  const inProgress = THESIS_STAGE_ORDER.filter(
    (id) => project.stages[id]?.status === "in_progress"
  ).length;

  // Checklist completion across all stages
  let checkDone = 0;
  let checkTotal = 0;
  for (const def of THESIS_STAGES) {
    checkTotal += def.checklist.length;
    const done = project.stages[def.id]?.checks || [];
    checkDone += def.checklist.filter((c) => done.includes(c.id)).length;
  }

  return {
    completed,
    total,
    blocked,
    inProgress,
    percent: Math.round((completed / total) * 100),
    checkDone,
    checkTotal,
    checkPercent: checkTotal
      ? Math.round((checkDone / checkTotal) * 100)
      : 0,
  };
}

/** Suggest where the resident is stuck: first blocked, else first incomplete. */
export function suggestThesisFocus(project: ThesisProject): ThesisStageDef {
  for (const id of THESIS_STAGE_ORDER) {
    if (project.stages[id]?.status === "blocked") return getThesisStage(id);
  }
  for (const id of THESIS_STAGE_ORDER) {
    if (project.stages[id]?.status !== "complete") return getThesisStage(id);
  }
  return getThesisStage("publication");
}

export function buildThesisExportMarkdown(project: ThesisProject): string {
  const progress = computeThesisProgress(project);
  const focus = suggestThesisFocus(project);
  const lines: string[] = [
    `# Thesis roadmap — ${project.title}`,
    ``,
    `> Resident thesis progress tracker · EvidenceFlow`,
    `> ${project.degree}${project.specialty ? ` · ${project.specialty}` : ""}${project.institution ? ` · ${project.institution}` : ""}`,
    `> Stages complete: ${progress.completed}/${progress.total} (${progress.percent}%) · Checklist ${progress.checkPercent}%`,
    `> Suggested focus: ${focus.number}. ${focus.title}`,
    `> Generated ${new Date().toISOString().slice(0, 10)}`,
    ``,
  ];

  for (const id of THESIS_STAGE_ORDER) {
    const def = getThesisStage(id);
    const st = project.stages[id];
    lines.push(
      `## ${def.number}. ${def.title}`,
      ``,
      `**Status:** ${st?.status || "not_started"} · **Phase:** ${def.phase}`,
      ``,
      def.summary,
      ``,
      `### Checklist`,
      ``
    );
    for (const c of def.checklist) {
      const on = st?.checks?.includes(c.id);
      lines.push(`- [${on ? "x" : " "}] ${c.label}`);
    }
    lines.push(``);
    for (const f of def.fields) {
      const val = st?.data?.[f.key];
      if (val && String(val).trim()) {
        lines.push(`### ${f.label}`, ``, String(val), ``);
      }
    }
    if (def.stuckTips.length) {
      lines.push(`### If stuck`, ``);
      for (const t of def.stuckTips) lines.push(`- ${t}`);
      lines.push(``);
    }
  }

  lines.push(
    `---`,
    `*Educational planning aid. Follow your university regulations, guide instructions, and ethics requirements.*`
  );
  return lines.join("\n");
}
