/** Case report / case series track — local projects + CARE-inspired stages. */

export type CaseStageId =
  | "why"
  | "consent"
  | "patient"
  | "timeline"
  | "assessment"
  | "intervention"
  | "outcome"
  | "discussion"
  | "reporting";

export type CaseMode = "report" | "series";
export type CaseStageStatus = "not_started" | "in_progress" | "complete";

export interface CaseField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface CaseStageDef {
  id: CaseStageId;
  number: number;
  title: string;
  shortTitle: string;
  summary: string;
  learn: {
    why: string;
    concepts: string[];
    commonMistakes: string[];
  };
  fields: CaseField[];
  teach: {
    explain: string;
    reflectDecision: string;
    reflectUncertain: string;
  };
  nextHint: string;
}

export interface CaseStageProgress {
  status: CaseStageStatus;
  lessonRead: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export interface CaseProject {
  id: string;
  title: string;
  mode: CaseMode;
  createdAt: string;
  updatedAt: string;
  currentStage: CaseStageId;
  stages: Record<CaseStageId, CaseStageProgress>;
}

export const CASE_STAGE_ORDER: CaseStageId[] = [
  "why",
  "consent",
  "patient",
  "timeline",
  "assessment",
  "intervention",
  "outcome",
  "discussion",
  "reporting",
];

export function createEmptyCaseStages(): Record<CaseStageId, CaseStageProgress> {
  const stages = {} as Record<CaseStageId, CaseStageProgress>;
  for (const id of CASE_STAGE_ORDER) {
    stages[id] = { status: "not_started", lessonRead: false, data: {} };
  }
  return stages;
}

export const CASE_STAGES: CaseStageDef[] = [
  {
    id: "why",
    number: 1,
    title: "Why this case (or series)?",
    shortTitle: "Why",
    summary: "Define the educational or scientific reason to report.",
    learn: {
      why: "Case reports are justified by novelty, rarity, unexpected events, or teaching value — not by ‘interesting to me alone’. A clear ‘so what?’ prevents a diary entry.",
      concepts: [
        "Hypothesis-generating, not hypothesis-confirming",
        "What is already known vs what this case adds",
        "Audience: clinicians, trainees, safety systems",
      ],
      commonMistakes: [
        "No clear unique teaching point",
        "Promising proof of treatment efficacy from n=1",
        "Ignoring existing literature context",
      ],
    },
    fields: [
      {
        key: "modeNote",
        label: "Report type",
        type: "select",
        options: [
          { value: "report", label: "Single case report" },
          { value: "series", label: "Case series (multiple patients)" },
        ],
        required: true,
      },
      {
        key: "rationale",
        label: "Why is this worth reporting?",
        type: "textarea",
        placeholder: "Rare presentation / adverse event / diagnostic dilemma / teaching pearl…",
        required: true,
      },
      {
        key: "whatIsKnown",
        label: "What is already known?",
        type: "textarea",
        required: true,
      },
      {
        key: "whatThisAdds",
        label: "What does this case/series add?",
        type: "textarea",
        required: true,
      },
      {
        key: "objective",
        label: "One-sentence objective of the report",
        type: "textarea",
        placeholder: "We report … to highlight …",
        required: true,
      },
    ],
    teach: {
      explain:
        "In 60 seconds, explain to a peer why this is not ‘just another case’ and what claim you will NOT make.",
      reflectDecision: "What is your single main teaching point?",
      reflectUncertain: "What might a reviewer say is not novel enough?",
    },
    nextHint: "Next: ethics, consent, and de-identification before writing clinical detail.",
  },
  {
    id: "consent",
    number: 2,
    title: "Ethics, consent & privacy",
    shortTitle: "Consent",
    summary: "Protect the patient; document permission and de-identification.",
    learn: {
      why: "Case reports can identify people even without names (rare disease + hospital + photos). Consent and de-identification are ethical requirements, not afterthoughts.",
      concepts: [
        "Written consent for publication when required by journal/institution",
        "De-identification of dates, places, images",
        "When ethics committee review is needed (varies by setting)",
      ],
      commonMistakes: [
        "Publishing identifiable images without consent",
        "Assuming ‘anonymised’ equals unidentifiable",
        "No statement on consent in the manuscript",
      ],
    },
    fields: [
      {
        key: "consentStatus",
        label: "Publication consent",
        type: "select",
        options: [
          { value: "written", label: "Written consent obtained" },
          { value: "verbal", label: "Verbal only (document why)" },
          { value: "waived", label: "Waiver / not required (justify)" },
          { value: "pending", label: "Pending" },
        ],
        required: true,
      },
      {
        key: "consentNotes",
        label: "Consent & ethics notes",
        type: "textarea",
        placeholder: "Who consented, date, IRB/ethics if any…",
        required: true,
      },
      {
        key: "deidentifyPlan",
        label: "De-identification plan",
        type: "textarea",
        placeholder: "Remove dates of birth, exact dates, rare job, facial photos…",
        required: true,
      },
    ],
    teach: {
      explain: "Teach a junior three ways a case report can re-identify a patient.",
      reflectDecision: "What consent pathway did you choose and why?",
      reflectUncertain: "What detail are you still unsure is safe to publish?",
    },
    nextHint: "Next: de-identified patient / case descriptors.",
  },
  {
    id: "patient",
    number: 3,
    title: "Patient / case information",
    shortTitle: "Patient",
    summary: "De-identified demographics, history, and presentation.",
    learn: {
      why: "Readers need enough clinical context to learn — without unnecessary identifiers. CARE encourages structured patient information.",
      concepts: [
        "Chief complaint and relevant history",
        "Baseline characteristics (age range if needed, sex, key comorbidities)",
        "For series: shared inclusion features",
      ],
      commonMistakes: [
        "Missing key history that explains decisions",
        "Over-sharing identifiers",
        "In series: inconsistent data across patients",
      ],
    },
    fields: [
      {
        key: "presentation",
        label: "Presentation / chief concern",
        type: "textarea",
        required: true,
      },
      {
        key: "history",
        label: "Relevant history",
        type: "textarea",
        required: true,
      },
      {
        key: "baseline",
        label: "Baseline characteristics (de-identified)",
        type: "textarea",
        placeholder: "e.g. man in his 40s; hypertension; no prior surgery…",
        required: true,
      },
      {
        key: "seriesInclusion",
        label: "If series: inclusion rule for cases",
        type: "textarea",
        placeholder: "All patients with X seen between… satisfying…",
      },
    ],
    teach: {
      explain: "Summarise the patient in 3 sentences a non-specialist could follow.",
      reflectDecision: "Which baseline details are necessary vs gossip?",
      reflectUncertain: "What history is still missing from the record?",
    },
    nextHint: "Next: build a clear clinical timeline.",
  },
  {
    id: "timeline",
    number: 4,
    title: "Timeline",
    shortTitle: "Timeline",
    summary: "Chronology of symptoms, tests, treatments, and outcomes.",
    learn: {
      why: "A timeline is the spine of a case report. CARE emphasises chronological organisation so readers see cause–effect claims carefully.",
      concepts: [
        "Symptom onset → presentation → workup → treatment → follow-up",
        "Relative times (day 0, week 2) instead of calendar dates when safer",
        "Series: common milestones across patients",
      ],
      commonMistakes: [
        "Jumbled chronology",
        "Exact dates that re-identify",
        "Skipping failed treatments that matter",
      ],
    },
    fields: [
      {
        key: "timeline",
        label: "Clinical timeline",
        type: "textarea",
        placeholder: "Day 0: …\nDay 3: …\nWeek 2: …",
        required: true,
      },
      {
        key: "keyDecisionPoints",
        label: "Key decision points",
        type: "textarea",
        required: true,
      },
    ],
    teach: {
      explain: "Walk a peer through the timeline without notes.",
      reflectDecision: "Where did management change direction and why?",
      reflectUncertain: "Where is the record unclear on timing?",
    },
    nextHint: "Next: diagnostic assessment and differentials.",
  },
  {
    id: "assessment",
    number: 5,
    title: "Diagnostic assessment",
    shortTitle: "Assessment",
    summary: "Findings, tests, differential diagnosis, and final diagnosis.",
    learn: {
      why: "Teaching value often lives in the diagnostic reasoning — what was considered, what was ruled out, and how uncertainty was handled.",
      concepts: [
        "Physical / exam / key investigations",
        "Differential diagnosis ranked",
        "Diagnostic challenges and reasoning",
      ],
      commonMistakes: [
        "Diagnosis stated with no differential",
        "Lab dumps without interpretation",
        "Hindsight bias: making the path look obvious",
      ],
    },
    fields: [
      {
        key: "findings",
        label: "Important findings & tests",
        type: "textarea",
        required: true,
      },
      {
        key: "differential",
        label: "Differential diagnosis",
        type: "textarea",
        required: true,
      },
      {
        key: "finalDx",
        label: "Working / final diagnosis",
        type: "textarea",
        required: true,
      },
      {
        key: "challenges",
        label: "Diagnostic challenges",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Teach the differential: top 3 alternatives and how you excluded them.",
      reflectDecision: "What was the pivotal test or finding?",
      reflectUncertain: "What diagnosis could still be wrong?",
    },
    nextHint: "Next: interventions and clinical reasoning for treatment.",
  },
  {
    id: "intervention",
    number: 6,
    title: "Therapeutic intervention",
    shortTitle: "Intervention",
    summary: "What was done, doses/procedures, and changes over time.",
    learn: {
      why: "Interventions must be reproducible enough for learning — and framed without overclaiming efficacy.",
      concepts: [
        "Types: pharmacologic, procedural, educational, supportive",
        "Sequence and rationale",
        "Adverse effects",
      ],
      commonMistakes: [
        "Vague ‘treated medically’",
        "Implying proof of benefit",
        "Omitting complications",
      ],
    },
    fields: [
      {
        key: "interventions",
        label: "Interventions (detail)",
        type: "textarea",
        required: true,
      },
      {
        key: "rationale",
        label: "Why these interventions?",
        type: "textarea",
        required: true,
      },
      {
        key: "harms",
        label: "Adverse effects / harms",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Explain treatment choices without claiming ‘this proves X works’.",
      reflectDecision: "What would you do differently next time?",
      reflectUncertain: "Which part of treatment is least evidence-based?",
    },
    nextHint: "Next: outcomes and follow-up.",
  },
  {
    id: "outcome",
    number: 7,
    title: "Follow-up and outcomes",
    shortTitle: "Outcomes",
    summary: "Clinician- and patient-important results over time.",
    learn: {
      why: "Without follow-up, readers cannot judge course or safety. Report both improvement and residual problems.",
      concepts: [
        "Clinical outcomes and timing",
        "Patient perspective when available",
        "Series: how many improved / harmed / lost",
      ],
      commonMistakes: [
        "Stopping the story at discharge only",
        "Only positive outcomes",
        "No functional status",
      ],
    },
    fields: [
      {
        key: "outcomes",
        label: "Outcomes",
        type: "textarea",
        required: true,
      },
      {
        key: "followup",
        label: "Follow-up duration & status",
        type: "textarea",
        required: true,
      },
      {
        key: "patientPerspective",
        label: "Patient perspective (if available)",
        type: "textarea",
      },
    ],
    teach: {
      explain: "State outcomes in plain language including what did not improve.",
      reflectDecision: "How long was follow-up and is it enough to teach the point?",
      reflectUncertain: "What outcome data are missing?",
    },
    nextHint: "Next: discussion and take-home messages.",
  },
  {
    id: "discussion",
    number: 8,
    title: "Discussion & take-home messages",
    shortTitle: "Discussion",
    summary: "Literature context, limitations, and cautious conclusions.",
    learn: {
      why: "Discussion connects the case to evidence without overreach. Limitations and alternative explanations are strengths, not weakness.",
      concepts: [
        "Compare with published literature",
        "Limitations of n=1 or small series",
        "Take-home messages for practice/teaching",
      ],
      commonMistakes: [
        "Causal claims",
        "No limitations section",
        "No link to existing evidence",
      ],
    },
    fields: [
      {
        key: "literature",
        label: "How this fits the literature",
        type: "textarea",
        required: true,
      },
      {
        key: "limitations",
        label: "Limitations",
        type: "textarea",
        required: true,
      },
      {
        key: "takeaways",
        label: "Take-home messages (3 max)",
        type: "textarea",
        required: true,
      },
      {
        key: "conclusions",
        label: "Conclusions (cautious)",
        type: "textarea",
        required: true,
      },
    ],
    teach: {
      explain: "Give two take-home messages and one thing this case cannot prove.",
      reflectDecision: "Where did you resist overclaiming?",
      reflectUncertain: "What alternative explanation still worries you?",
    },
    nextHint: "Next: CARE-inspired checklist and export.",
  },
  {
    id: "reporting",
    number: 9,
    title: "Reporting checklist & export",
    shortTitle: "Reporting",
    summary: "Map your draft to CARE-style items and package outputs.",
    learn: {
      why: "Reporting guidelines make case reports usable and comparable. Journals increasingly expect CARE-aligned structure.",
      concepts: [
        "CARE checklist domains",
        "Title, keywords, abstract structure",
        "Transparency about consent",
      ],
      commonMistakes: [
        "Claiming guideline compliance without checking items",
        "Missing consent statement",
        "No patient perspective when available",
      ],
    },
    fields: [
      {
        key: "title",
        label: "Working title",
        type: "text",
        placeholder: "…: a case report",
        required: true,
      },
      {
        key: "keywords",
        label: "Keywords",
        type: "text",
      },
      {
        key: "abstract",
        label: "Structured abstract draft",
        type: "textarea",
        placeholder: "Background / Case / Conclusions",
      },
      {
        key: "gaps",
        label: "Remaining gaps before submission",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Pitch the case in a 90-second abstract orally.",
      reflectDecision: "Which CARE areas are still thin?",
      reflectUncertain: "Which journal requirements might still block submission?",
    },
    nextHint: "Export your package and get a mentor to review before submission.",
  },
];

export function getCaseStage(id: CaseStageId): CaseStageDef {
  const s = CASE_STAGES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown case stage ${id}`);
  return s;
}

export function getNextCaseStage(id: CaseStageId): CaseStageDef | null {
  const i = CASE_STAGE_ORDER.indexOf(id);
  if (i < 0 || i >= CASE_STAGE_ORDER.length - 1) return null;
  return getCaseStage(CASE_STAGE_ORDER[i + 1]);
}

export function getPrevCaseStage(id: CaseStageId): CaseStageDef | null {
  const i = CASE_STAGE_ORDER.indexOf(id);
  if (i <= 0) return null;
  return getCaseStage(CASE_STAGE_ORDER[i - 1]);
}

/** CARE-inspired checklist (educational subset) */
export const CARE_ITEMS: { id: string; label: string; section: string }[] = [
  { id: "c1", section: "Title", label: "Title identifies the report as a case report (or series)" },
  { id: "c2", section: "Keywords", label: "2–5 keywords included" },
  { id: "c3", section: "Abstract", label: "Structured abstract (background, case, conclusions)" },
  { id: "c4", section: "Introduction", label: "Background and rationale clear" },
  { id: "c5", section: "Patient", label: "De-identified patient information sufficient to learn" },
  { id: "c6", section: "Timeline", label: "Timeline of history and episodes present" },
  { id: "c7", section: "Assessment", label: "Diagnostic methods and reasoning described" },
  { id: "c8", section: "Intervention", label: "Therapeutic intervention details reproducible" },
  { id: "c9", section: "Follow-up", label: "Follow-up and outcomes described" },
  { id: "c10", section: "Discussion", label: "Strengths, limitations, and literature context" },
  { id: "c11", section: "Patient", label: "Patient perspective included or marked unavailable" },
  { id: "c12", section: "Consent", label: "Informed consent statement present" },
];

const STORAGE_KEY = "evidenceflow_case_projects_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function readAll(): CaseProject[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CaseProject[];
  } catch {
    return [];
  }
}

function writeAll(projects: CaseProject[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function listCaseProjects(): CaseProject[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getCaseProject(id: string): CaseProject | null {
  return readAll().find((p) => p.id === id) ?? null;
}

export function createCaseProject(title: string, mode: CaseMode = "report"): CaseProject {
  const now = new Date().toISOString();
  const project: CaseProject = {
    id: crypto.randomUUID(),
    title: title.trim() || (mode === "series" ? "Untitled case series" : "Untitled case report"),
    mode,
    createdAt: now,
    updatedAt: now,
    currentStage: "why",
    stages: createEmptyCaseStages(),
  };
  project.stages.why.data.modeNote = mode;
  const all = readAll();
  all.push(project);
  writeAll(all);
  return project;
}

export function updateCaseProject(project: CaseProject): CaseProject {
  const all = readAll();
  const next = { ...project, updatedAt: new Date().toISOString() };
  const idx = all.findIndex((p) => p.id === project.id);
  if (idx === -1) all.push(next);
  else all[idx] = next;
  writeAll(all);
  return next;
}

export function deleteCaseProject(id: string) {
  writeAll(readAll().filter((p) => p.id !== id));
}

export function saveCaseStageData(
  projectId: string,
  stageId: CaseStageId,
  data: Record<string, unknown>,
  extras?: Partial<Pick<CaseStageProgress, "status" | "lessonRead">>
): CaseProject | null {
  const project = getCaseProject(projectId);
  if (!project) return null;
  const prev = project.stages[stageId];
  const merged: CaseStageProgress = {
    ...prev,
    data: { ...prev.data, ...data },
    ...extras,
  };
  if (!extras?.status) {
    const has = Object.values(merged.data).some((v) =>
      typeof v === "string" ? v.trim().length > 0 : v != null && v !== ""
    );
    if (merged.status !== "complete" && has) merged.status = "in_progress";
  }
  project.stages[stageId] = merged;
  project.currentStage = stageId;
  return updateCaseProject(project);
}

export function markCaseStageComplete(
  projectId: string,
  stageId: CaseStageId
): CaseProject | null {
  const project = getCaseProject(projectId);
  if (!project) return null;
  project.stages[stageId] = {
    ...project.stages[stageId],
    status: "complete",
    lessonRead: true,
  };
  const idx = CASE_STAGE_ORDER.indexOf(stageId);
  if (idx >= 0 && idx < CASE_STAGE_ORDER.length - 1) {
    project.currentStage = CASE_STAGE_ORDER[idx + 1];
  }
  return updateCaseProject(project);
}

export function computeCaseProgress(project: CaseProject) {
  const total = CASE_STAGE_ORDER.length;
  const completed = CASE_STAGE_ORDER.filter(
    (id) => project.stages[id]?.status === "complete"
  ).length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

export function buildCaseExportMarkdown(project: CaseProject): string {
  const lines: string[] = [
    `# ${project.title}`,
    ``,
    `> Case ${project.mode === "series" ? "series" : "report"} draft — EvidenceFlow educational export`,
    `> Generated ${new Date().toISOString().slice(0, 10)}`,
    ``,
  ];
  for (const id of CASE_STAGE_ORDER) {
    const def = getCaseStage(id);
    const data = project.stages[id]?.data || {};
    lines.push(`## ${def.number}. ${def.title}`, "");
    for (const f of def.fields) {
      lines.push(`### ${f.label}`, "", String(data[f.key] ?? "—"), "");
    }
    if (data._reflectDecision || data._teachExplain) {
      lines.push("### Reflections", "");
      if (data._reflectDecision)
        lines.push(`**Decision:** ${data._reflectDecision}`, "");
      if (data._reflectUncertain)
        lines.push(`**Uncertainty:** ${data._reflectUncertain}`, "");
      if (data._teachExplain)
        lines.push(`**Teach-back:** ${data._teachExplain}`, "");
    }
  }
  const checks = dataCareChecks(project);
  lines.push("## CARE-inspired checklist", "");
  for (const item of CARE_ITEMS) {
    lines.push(`- [${checks.includes(item.id) ? "x" : " "}] ${item.label}`);
  }
  lines.push(
    "",
    "---",
    "*Educational draft only. Follow journal and institutional ethics requirements. See CARE guidelines: https://www.care-statement.org/*"
  );
  return lines.join("\n");
}

function dataCareChecks(project: CaseProject): string[] {
  const raw = project.stages.reporting?.data?._careChecks;
  if (Array.isArray(raw)) return raw.map(String);
  return [];
}

export function getExampleCaseProject(): CaseProject {
  const stages = createEmptyCaseStages();
  const fill = (id: CaseStageId, data: Record<string, unknown>) => {
    stages[id] = {
      status: "complete",
      lessonRead: true,
      data,
    };
  };
  fill("why", {
    modeNote: "report",
    rationale:
      "Unexpected prolonged QT interval after a commonly used antibiotic combination in a young adult without structural heart disease — teaching recognition of drug-induced arrhythmia risk.",
    whatIsKnown:
      "Several antimicrobials can prolong QT; risk rises with combinations, electrolyte disturbance, and congenital long-QT predisposition.",
    whatThisAdds:
      "Highlights a near-miss syncope presentation where early ECG and drug review changed management; stresses medication reconciliation teaching point.",
    objective:
      "We report a case of drug-associated QT prolongation presenting with syncope to emphasise ECG review when starting QT-prolonging combinations.",
  });
  fill("consent", {
    consentStatus: "written",
    consentNotes:
      "Written consent for publication obtained from the patient; institutional case-report pathway followed (example only — fictionalised).",
    deidentifyPlan:
      "Age band used; calendar dates shifted to relative days; hospital name omitted; no facial photos.",
  });
  fill("patient", {
    presentation: "Syncope at rest; prodromal dizziness.",
    history:
      "Recent lower-respiratory infection treated with azithromycin + another QT-prolonging agent; no prior syncope; no family history of sudden death reported.",
    baseline:
      "Adult in their 20s; previously well; normal baseline electrolytes on prior labs when available.",
  });
  fill("timeline", {
    timeline:
      "Day 0: antibiotics started.\nDay 3: dizziness.\nDay 4: syncope; ED presentation; ECG with QTc markedly prolonged.\nDay 4–5: offending drugs held; monitoring; electrolytes repleted.\nWeek 2: outpatient ECG improved; no recurrent syncope.",
    keyDecisionPoints:
      "Hold QT-prolonging drugs; continuous monitoring; cardiology input; avoid restarting same combination.",
  });
  fill("assessment", {
    findings: "Prolonged QTc on ECG; troponin negative; electrolytes borderline low potassium.",
    differential:
      "Drug-induced long QT; congenital long QT unmasked; primary arrhythmia; seizure; orthostatic syncope.",
    finalDx: "Likely drug-associated QT prolongation with syncope (clinical diagnosis).",
    challenges: "Distinguishing congenital predisposition vs purely acquired; incomplete pre-drug ECG.",
  });
  fill("intervention", {
    interventions:
      "Discontinued suspect drugs; potassium/magnesium repletion; telemetry; education on future drug cautions.",
    rationale: "Remove triggers; reduce arrhythmia risk; monitor until QTc improved.",
    harms: "None from monitoring strategy; temporary antibiotic regimen change required.",
  });
  fill("outcome", {
    outcomes: "No recurrent syncope; QTc shortened after drug withdrawal and electrolyte care.",
    followup: "2-week clinic follow-up with improved ECG; longer-term cardiology plan documented.",
    patientPerspective: "Patient reported anxiety about recurrence; valued clear list of drugs to avoid.",
  });
  fill("discussion", {
    literature:
      "Consistent with known QT risk of certain antimicrobials; underscores interaction and electrolyte context.",
    limitations:
      "Single case; incomplete baseline ECG; causality probable but not proven (n=1).",
    takeaways:
      "1) Check interacting QT drugs.\n2) ECG when syncope + new meds.\n3) Do not claim population risk from one case.",
    conclusions:
      "This case illustrates a teaching pathway for recognising drug-associated QT prolongation; it does not establish incidence or comparative drug safety.",
  });
  fill("reporting", {
    title:
      "Drug-associated QT prolongation presenting with syncope: a case report (educational example)",
    keywords: "case report; QT prolongation; syncope; drug safety",
    abstract:
      "Background: Antimicrobial combinations may prolong QT. Case: Young adult with syncope and prolonged QTc after combination therapy; improved after withdrawal. Conclusions: Teaching emphasis on ECG and medication review; not a causal proof.",
    gaps: "Example only — not for submission.",
    _careChecks: CARE_ITEMS.map((c) => c.id),
  });

  return {
    id: "example-case-report",
    title: "Example: Drug-associated QT prolongation (teaching case)",
    mode: "report",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: "reporting",
    stages,
  };
}
