/** Cohort study track — local projects + STROBE cohort-inspired stages. */

export type CohortStageId =
  | "question"
  | "design"
  | "participants"
  | "exposure"
  | "outcomes"
  | "followup"
  | "analysis"
  | "ethics"
  | "reporting";

export type CohortStageStatus = "not_started" | "in_progress" | "complete";

export interface CohortField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface CohortStageDef {
  id: CohortStageId;
  number: number;
  title: string;
  shortTitle: string;
  summary: string;
  learn: {
    why: string;
    concepts: string[];
    commonMistakes: string[];
  };
  fields: CohortField[];
  teach: {
    explain: string;
    reflectDecision: string;
    reflectUncertain: string;
  };
  nextHint: string;
}

export interface CohortStageProgress {
  status: CohortStageStatus;
  lessonRead: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export interface CohortProject {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  currentStage: CohortStageId;
  stages: Record<CohortStageId, CohortStageProgress>;
}

export const COHORT_STAGE_ORDER: CohortStageId[] = [
  "question",
  "design",
  "participants",
  "exposure",
  "outcomes",
  "followup",
  "analysis",
  "ethics",
  "reporting",
];

export function createEmptyCohortStages(): Record<
  CohortStageId,
  CohortStageProgress
> {
  const stages = {} as Record<CohortStageId, CohortStageProgress>;
  for (const id of COHORT_STAGE_ORDER) {
    stages[id] = { status: "not_started", lessonRead: false, data: {} };
  }
  return stages;
}

export const COHORT_STAGES: CohortStageDef[] = [
  {
    id: "question",
    number: 1,
    title: "Research question & hypotheses",
    shortTitle: "Question",
    summary:
      "Frame an incidence, prognosis, or exposure→outcome question over time.",
    learn: {
      why: "Cohort studies follow people over time. Your question must imply temporality: exposure status first, then outcome. That is the main epistemic advantage over cross-sectional designs.",
      concepts: [
        "Incidence / risk / rate questions",
        "Prognosis questions",
        "Exposure → outcome with time order",
        "Primary hypothesis pre-specified",
      ],
      commonMistakes: [
        "Question that is really a prevalence snapshot",
        "No clear exposure or outcome",
        "Multiple unranked aims",
      ],
    },
    fields: [
      {
        key: "topic",
        label: "Topic (plain language)",
        type: "textarea",
        required: true,
        placeholder:
          "e.g. Physical activity and new-onset hypertension in young adults",
      },
      {
        key: "questionType",
        label: "Primary question type",
        type: "select",
        required: true,
        options: [
          { value: "incidence", label: "Incidence / risk of outcome" },
          { value: "association", label: "Exposure–outcome association over time" },
          { value: "prognosis", label: "Prognosis / natural history" },
          { value: "other", label: "Other longitudinal aim" },
        ],
      },
      {
        key: "question",
        label: "Research question (one sentence)",
        type: "textarea",
        required: true,
        placeholder:
          "Among … free of … at baseline, is exposure to … associated with incident … over … years?",
      },
      {
        key: "hypothesis",
        label: "Primary hypothesis",
        type: "textarea",
        required: true,
      },
    ],
    teach: {
      explain:
        "State exposure, outcome, population, and time horizon — and why time order matters.",
      reflectDecision: "Why does this need follow-up rather than a single survey?",
      reflectUncertain: "What reverse-causation risk remains?",
    },
    nextHint: "Next: prospective vs retrospective design and setting.",
  },
  {
    id: "design",
    number: 2,
    title: "Cohort design & setting",
    shortTitle: "Design",
    summary: "Prospective/retrospective, open/closed cohort, setting, calendar.",
    learn: {
      why: "STROBE requires a clear design label. ‘Retrospective cohort from EHR 2018–2024’ is reproducible; ‘we followed patients’ is not.",
      concepts: [
        "Prospective vs retrospective vs ambidirectional",
        "Fixed vs dynamic (open) cohort",
        "Setting and data sources",
        "Study dates and administrative censoring",
      ],
      commonMistakes: [
        "Calling a cross-sectional extract a cohort",
        "Unclear entry and exit rules",
        "No statement of data source",
      ],
    },
    fields: [
      {
        key: "timing",
        label: "Cohort timing",
        type: "select",
        required: true,
        options: [
          { value: "prospective", label: "Prospective" },
          { value: "retrospective", label: "Retrospective" },
          { value: "ambi", label: "Ambidirectional" },
        ],
      },
      {
        key: "cohortType",
        label: "Cohort structure",
        type: "select",
        required: true,
        options: [
          { value: "closed", label: "Closed / fixed cohort" },
          { value: "open", label: "Open / dynamic cohort" },
          { value: "mixed", label: "Mixed / not sure yet" },
        ],
      },
      {
        key: "setting",
        label: "Setting & data source",
        type: "textarea",
        required: true,
        placeholder: "Community cohort / hospital registry / claims / EHR…",
      },
      {
        key: "calendar",
        label: "Study calendar (entry–end)",
        type: "text",
        required: true,
        placeholder: "e.g. Baseline 2020; follow-up through 2025",
      },
    ],
    teach: {
      explain: "Explain prospective vs retrospective using your study as the example.",
      reflectDecision: "Why this data source is adequate for exposure and outcome.",
      reflectUncertain: "Where might entry timing create immortal time bias?",
    },
    nextHint: "Next: who enters the cohort and when.",
  },
  {
    id: "participants",
    number: 3,
    title: "Participants & cohort entry",
    shortTitle: "Participants",
    summary: "Eligibility, entry time zero, exclusions, sample size.",
    learn: {
      why: "Time zero (cohort entry) defines risk sets. Mis-specified entry creates selection and immortal time biases.",
      concepts: [
        "Inclusion/exclusion at baseline",
        "Time zero definition",
        "Source population vs study cohort",
        "Sample size / power for primary contrast",
      ],
      commonMistakes: [
        "Including people who already have the outcome at baseline (for incidence aims)",
        "Vague entry criteria",
        "No sample size thinking",
      ],
    },
    fields: [
      {
        key: "eligibility",
        label: "Inclusion / exclusion at entry",
        type: "textarea",
        required: true,
      },
      {
        key: "timeZero",
        label: "Time zero (cohort entry) definition",
        type: "textarea",
        required: true,
        placeholder: "e.g. Date of first clinic visit in 2020 with no prior HTN diagnosis",
      },
      {
        key: "sourcePop",
        label: "Source population",
        type: "textarea",
        required: true,
      },
      {
        key: "sampleSize",
        label: "Sample size / power plan",
        type: "textarea",
        required: true,
      },
    ],
    teach: {
      explain: "Define time zero so two analysts would build the same cohort.",
      reflectDecision: "Who is excluded to make the incidence question clean?",
      reflectUncertain: "What entry rule is still fuzzy in the data?",
    },
    nextHint: "Next: define and measure exposure.",
  },
  {
    id: "exposure",
    number: 4,
    title: "Exposure definition & measurement",
    shortTitle: "Exposure",
    summary: "How exposure is classified at baseline (and updates if any).",
    learn: {
      why: "Bad exposure classification biases associations. Pre-define categories, timing relative to time zero, and misclassification risks.",
      concepts: [
        "Baseline exposure vs time-varying exposure",
        "Operational definitions",
        "Non-differential vs differential misclassification",
        "Comparison group (unexposed / lower exposure)",
      ],
      commonMistakes: [
        "Exposure assessed after outcome onset",
        "No unexposed reference",
        "Changing exposure cut-points after seeing results",
      ],
    },
    fields: [
      {
        key: "exposureDef",
        label: "Primary exposure definition",
        type: "textarea",
        required: true,
      },
      {
        key: "comparison",
        label: "Comparison / reference group",
        type: "textarea",
        required: true,
      },
      {
        key: "measurement",
        label: "How exposure is measured",
        type: "textarea",
        required: true,
      },
      {
        key: "misclass",
        label: "Misclassification risks & mitigation",
        type: "textarea",
      },
    ],
    teach: {
      explain: "State exposed vs unexposed without jargon a clinician would need explained twice.",
      reflectDecision: "Why this exposure operationalisation?",
      reflectUncertain: "Could exposure be a consequence of early disease?",
    },
    nextHint: "Next: outcomes and ascertainment.",
  },
  {
    id: "outcomes",
    number: 5,
    title: "Outcomes & ascertainment",
    shortTitle: "Outcomes",
    summary: "Primary/secondary outcomes, definitions, and how events are found.",
    learn: {
      why: "Outcome ascertainment must be as complete and equal as possible across exposure groups. Differential surveillance creates bias.",
      concepts: [
        "Primary outcome pre-specification",
        "Event definitions (clinical, coded, self-report)",
        "Competing risks when relevant",
        "Adjudication if used",
      ],
      commonMistakes: [
        "Soft outcome only when hard outcome is needed",
        "Unequal follow-up intensity by exposure",
        "No secondary outcomes plan (or too many)",
      ],
    },
    fields: [
      {
        key: "primaryOutcome",
        label: "Primary outcome definition",
        type: "textarea",
        required: true,
      },
      {
        key: "secondary",
        label: "Secondary outcomes",
        type: "textarea",
      },
      {
        key: "ascertainment",
        label: "Ascertainment methods",
        type: "textarea",
        required: true,
        placeholder: "Registry linkage / chart review / interviews / labs…",
      },
      {
        key: "surveillance",
        label: "Equal surveillance notes",
        type: "textarea",
        help: "How you avoid looking harder for outcomes in one exposure group.",
      },
    ],
    teach: {
      explain: "How is an ‘event’ coded so two abstractors agree?",
      reflectDecision: "Why this primary outcome for decisions?",
      reflectUncertain: "Where might outcome be missed?",
    },
    nextHint: "Next: follow-up, censoring, and loss to follow-up.",
  },
  {
    id: "followup",
    number: 6,
    title: "Follow-up, censoring & LTFU",
    shortTitle: "Follow-up",
    summary: "How long people are followed and how attrition is handled.",
    learn: {
      why: "Loss to follow-up (LTFU) can bias results if related to exposure and outcome. Pre-define censoring rules and how you will report completeness.",
      concepts: [
        "Administrative end of study",
        "Censoring at loss / competing events",
        "Minimum follow-up vs median follow-up",
        "Strategies to reduce LTFU",
      ],
      commonMistakes: [
        "No LTFU numbers planned",
        "Ignoring informative censoring",
        "Immortal time via delayed entry mishandled",
      ],
    },
    fields: [
      {
        key: "followupPlan",
        label: "Follow-up schedule / duration",
        type: "textarea",
        required: true,
      },
      {
        key: "censoring",
        label: "Censoring rules",
        type: "textarea",
        required: true,
      },
      {
        key: "ltfu",
        label: "Loss-to-follow-up handling",
        type: "textarea",
        required: true,
      },
      {
        key: "completeness",
        label: "How you will report follow-up completeness",
        type: "textarea",
      },
    ],
    teach: {
      explain: "What does ‘lost to follow-up’ mean operationally in your study?",
      reflectDecision: "Biggest threat from attrition?",
      reflectUncertain: "Can you link data to reduce LTFU?",
    },
    nextHint: "Next: confounding control and analysis plan.",
  },
  {
    id: "analysis",
    number: 7,
    title: "Confounding & analysis plan",
    shortTitle: "Analysis",
    summary: "Confounders, models, sensitivity analyses — pre-specified.",
    learn: {
      why: "Cohort associations are vulnerable to confounding. Pre-specify confounders and primary model; treat other analyses as secondary or exploratory.",
      concepts: [
        "Confounding vs mediators",
        "Crude vs adjusted estimates",
        "Time-to-event methods when appropriate",
        "Sensitivity analyses (e.g. alternate exposure definitions)",
      ],
      commonMistakes: [
        "Adjusting for mediators as if confounders",
        "Data-driven confounder fishing",
        "Causal language without design support",
      ],
    },
    fields: [
      {
        key: "confounders",
        label: "Pre-specified confounders",
        type: "textarea",
        required: true,
      },
      {
        key: "primaryModel",
        label: "Primary analysis model",
        type: "textarea",
        required: true,
        placeholder: "e.g. Cox model for time to HTN; HR with 95% CI",
      },
      {
        key: "sensitivity",
        label: "Sensitivity analyses",
        type: "textarea",
      },
      {
        key: "software",
        label: "Software",
        type: "text",
        placeholder: "R / Stata / SAS…",
      },
    ],
    teach: {
      explain: "Name two confounders and one variable you will NOT adjust for (and why).",
      reflectDecision: "Why this primary model?",
      reflectUncertain: "What unmeasured confounding worries you most?",
    },
    nextHint: "Next: ethics and data governance.",
  },
  {
    id: "ethics",
    number: 8,
    title: "Ethics & data governance",
    shortTitle: "Ethics",
    summary: "Consent, approvals, privacy for longitudinal data.",
    learn: {
      why: "Longitudinal and registry data raise privacy, linkage, and consent issues. Plan governance before analysis.",
      concepts: [
        "IRB/ethics approval",
        "Consent vs waiver for retrospective data",
        "Secure storage and de-identification",
      ],
      commonMistakes: [
        "Assuming retrospective = no ethics review",
        "Identifiable datasets on personal laptops",
        "No data retention plan",
      ],
    },
    fields: [
      {
        key: "ethicsStatus",
        label: "Ethics status",
        type: "select",
        required: true,
        options: [
          { value: "approved", label: "Approved / exempt documented" },
          { value: "submitted", label: "Submitted / pending" },
          { value: "planned", label: "Planned" },
          { value: "na", label: "Not required (justify)" },
        ],
      },
      {
        key: "consent",
        label: "Consent / waiver approach",
        type: "textarea",
        required: true,
      },
      {
        key: "privacy",
        label: "Privacy, linkage, storage",
        type: "textarea",
        required: true,
      },
    ],
    teach: {
      explain: "How are participant identities protected across years of follow-up?",
      reflectDecision: "What identifiers are essential vs optional?",
      reflectUncertain: "Does linkage require extra approvals?",
    },
    nextHint: "Next: STROBE cohort-inspired checklist and export.",
  },
  {
    id: "reporting",
    number: 9,
    title: "Reporting (STROBE cohort) & export",
    shortTitle: "Reporting",
    summary: "Title, flow, limitations, checklist, manuscript package.",
    learn: {
      why: "STROBE cohort items stress design, participants, follow-up, and statistical methods. Transparent LTFU and confounding discussion build trust.",
      concepts: [
        "Design named early",
        "Participant flow / follow-up completeness",
        "Limitations including residual confounding",
      ],
      commonMistakes: [
        "Hiding LTFU",
        "Causal certainty from observational data",
        "No sensitivity discussion",
      ],
    },
    fields: [
      {
        key: "title",
        label: "Working title",
        type: "text",
        required: true,
        placeholder: "…: a cohort study",
      },
      {
        key: "abstract",
        label: "Abstract skeleton",
        type: "textarea",
      },
      {
        key: "limitations",
        label: "Key limitations to report",
        type: "textarea",
        required: true,
      },
      {
        key: "gaps",
        label: "Gaps before analysis / submission",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Pitch methods including one major confounding threat in 90 seconds.",
      reflectDecision: "Which STROBE cohort areas are still thin?",
      reflectUncertain: "What would a methods reviewer attack first?",
    },
    nextHint: "Export and get supervisor review before locking the analysis.",
  },
];

export function getCohortStage(id: CohortStageId): CohortStageDef {
  const s = COHORT_STAGES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown cohort stage ${id}`);
  return s;
}

export function getNextCohortStage(id: CohortStageId): CohortStageDef | null {
  const i = COHORT_STAGE_ORDER.indexOf(id);
  if (i < 0 || i >= COHORT_STAGE_ORDER.length - 1) return null;
  return getCohortStage(COHORT_STAGE_ORDER[i + 1]);
}

export function getPrevCohortStage(id: CohortStageId): CohortStageDef | null {
  const i = COHORT_STAGE_ORDER.indexOf(id);
  if (i <= 0) return null;
  return getCohortStage(COHORT_STAGE_ORDER[i - 1]);
}

export const STROBE_COHORT_ITEMS: {
  id: string;
  label: string;
  section: string;
}[] = [
  { id: "h1", section: "Title", label: "Design indicated (cohort) in title/abstract" },
  { id: "h2", section: "Objectives", label: "Specific objectives / hypotheses stated" },
  { id: "h3", section: "Setting", label: "Setting, locations, relevant dates described" },
  { id: "h4", section: "Participants", label: "Eligibility, sources, methods of selection; follow-up methods" },
  { id: "h5", section: "Variables", label: "Outcomes, exposures, predictors, confounders, effect modifiers defined" },
  { id: "h6", section: "Data sources", label: "Measurement methods for each variable of interest" },
  { id: "h7", section: "Bias", label: "Efforts to address potential bias described" },
  { id: "h8", section: "Study size", label: "Sample size / power rationale" },
  { id: "h9", section: "Quantitative", label: "How quantitative variables handled described" },
  { id: "h10", section: "Statistics", label: "Statistical methods including confounder control & missing data" },
  { id: "h11", section: "Follow-up", label: "Follow-up time / completeness addressed" },
  { id: "h12", section: "Limitations", label: "Limitations including confounding and generalisability" },
];

const STORAGE_KEY = "evidenceflow_cohort_projects_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function readAll(): CohortProject[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CohortProject[];
  } catch {
    return [];
  }
}

function writeAll(projects: CohortProject[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function listCohortProjects(): CohortProject[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getCohortProject(id: string): CohortProject | null {
  return readAll().find((p) => p.id === id) ?? null;
}

export function createCohortProject(title: string): CohortProject {
  const now = new Date().toISOString();
  const project: CohortProject = {
    id: crypto.randomUUID(),
    title: title.trim() || "Untitled cohort study",
    createdAt: now,
    updatedAt: now,
    currentStage: "question",
    stages: createEmptyCohortStages(),
  };
  const all = readAll();
  all.push(project);
  writeAll(all);
  return project;
}

export function updateCohortProject(project: CohortProject): CohortProject {
  const all = readAll();
  const next = { ...project, updatedAt: new Date().toISOString() };
  const idx = all.findIndex((p) => p.id === project.id);
  if (idx === -1) all.push(next);
  else all[idx] = next;
  writeAll(all);
  return next;
}

export function deleteCohortProject(id: string) {
  writeAll(readAll().filter((p) => p.id !== id));
}

export function saveCohortStageData(
  projectId: string,
  stageId: CohortStageId,
  data: Record<string, unknown>,
  extras?: Partial<Pick<CohortStageProgress, "status" | "lessonRead">>
): CohortProject | null {
  const project = getCohortProject(projectId);
  if (!project) return null;
  const prev = project.stages[stageId];
  const merged: CohortStageProgress = {
    ...prev,
    data: { ...prev.data, ...data },
    ...extras,
  };
  if (!extras?.status) {
    const has = Object.values(merged.data).some((v) =>
      typeof v === "string"
        ? v.trim().length > 0
        : Array.isArray(v)
          ? v.length > 0
          : v != null && v !== ""
    );
    if (merged.status !== "complete" && has) merged.status = "in_progress";
  }
  project.stages[stageId] = merged;
  project.currentStage = stageId;
  return updateCohortProject(project);
}

export function markCohortStageComplete(
  projectId: string,
  stageId: CohortStageId
): CohortProject | null {
  const project = getCohortProject(projectId);
  if (!project) return null;
  project.stages[stageId] = {
    ...project.stages[stageId],
    status: "complete",
    lessonRead: true,
  };
  const idx = COHORT_STAGE_ORDER.indexOf(stageId);
  if (idx >= 0 && idx < COHORT_STAGE_ORDER.length - 1) {
    project.currentStage = COHORT_STAGE_ORDER[idx + 1];
  }
  return updateCohortProject(project);
}

export function computeCohortProgress(project: CohortProject) {
  const total = COHORT_STAGE_ORDER.length;
  const completed = COHORT_STAGE_ORDER.filter(
    (id) => project.stages[id]?.status === "complete"
  ).length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

export function buildCohortExportMarkdown(project: CohortProject): string {
  const lines: string[] = [
    `# ${project.title}`,
    ``,
    `> Cohort study draft — EvidenceFlow educational export`,
    `> Generated ${new Date().toISOString().slice(0, 10)}`,
    ``,
  ];
  for (const id of COHORT_STAGE_ORDER) {
    const def = getCohortStage(id);
    const data = project.stages[id]?.data || {};
    lines.push(`## ${def.number}. ${def.title}`, "");
    for (const f of def.fields) {
      lines.push(`### ${f.label}`, "", String(data[f.key] ?? "—"), "");
    }
  }
  const checks = (() => {
    const raw = project.stages.reporting?.data?._strobeChecks;
    return Array.isArray(raw) ? raw.map(String) : [];
  })();
  lines.push("## STROBE-inspired checklist (cohort)", "");
  for (const item of STROBE_COHORT_ITEMS) {
    lines.push(`- [${checks.includes(item.id) ? "x" : " "}] ${item.label}`);
  }
  lines.push(
    "",
    "---",
    "*Educational draft only. STROBE: https://www.strobe-statement.org/*"
  );
  return lines.join("\n");
}

export function getExampleCohortProject(): CohortProject {
  const stages = createEmptyCohortStages();
  const fill = (id: CohortStageId, data: Record<string, unknown>) => {
    stages[id] = { status: "complete", lessonRead: true, data };
  };
  fill("question", {
    topic: "Baseline physical activity and incident hypertension in young adults",
    questionType: "association",
    question:
      "Among adults 18–35 free of hypertension at baseline, is low physical activity associated with higher risk of incident hypertension over 5 years?",
    hypothesis:
      "Low activity will be associated with higher hazard of incident hypertension after adjustment for baseline BMI, smoking, and family history.",
  });
  fill("design", {
    timing: "prospective",
    cohortType: "closed",
    setting: "Community health examination cohort with annual follow-up visits (example)",
    calendar: "Baseline year 0; follow-up through year 5",
  });
  fill("participants", {
    eligibility:
      "Include ages 18–35; exclude baseline hypertension, pregnancy, incomplete baseline activity data.",
    timeZero: "Date of baseline exam meeting eligibility",
    sourcePop: "Adults attending voluntary baseline health screening in region X",
    sampleSize: "Plan n≈2000 for detecting HR 1.4 with 80% power (illustrative)",
  });
  fill("exposure", {
    exposureDef: "Low physical activity: <150 min/week moderate activity (self-report + device subset)",
    comparison: "Meeting ≥150 min/week guidelines",
    measurement: "Validated activity questionnaire at baseline; optional accelerometer subsample",
    misclass: "Self-report may overestimate activity; non-differential assumed primarily",
  });
  fill("outcomes", {
    primaryOutcome: "Incident hypertension: SBP≥140 or DBP≥90 or new antihypertensive Rx",
    secondary: "Time to first elevated BP reading; CVD events (exploratory)",
    ascertainment: "Annual clinic BP protocol + medication review; chart confirmation",
    surveillance: "Same visit schedule regardless of baseline activity",
  });
  fill("followup", {
    followupPlan: "Annual visits years 1–5; phone if missed visit",
    censoring: "Censor at last contact, death, or admin end year 5",
    ltfu: "Compare baseline characteristics of LTFU vs retained; inverse probability weights as sensitivity",
    completeness: "Report person-years and % with complete 5-year status",
  });
  fill("analysis", {
    confounders: "Age, sex, baseline BMI, smoking, family history of HTN, education",
    primaryModel: "Cox proportional hazards: activity group → incident HTN; report HR 95% CI",
    sensitivity: "Exclude first year events; alternate activity cut-points; complete-case vs MI",
    software: "R (survival)",
  });
  fill("ethics", {
    ethicsStatus: "planned",
    consent: "Written consent at baseline for follow-up contact and data use",
    privacy: "Coded IDs; analysis on secure server; no public identifiable data",
  });
  fill("reporting", {
    title:
      "Physical activity and incident hypertension in young adults: a prospective cohort study (example)",
    abstract:
      "Background… Methods: prospective cohort… Results: (to analyse)… Conclusions: association not proof of causality.",
    limitations:
      "Residual confounding; self-reported activity; single region generalisability.",
    gaps: "Example only — not real recruitment.",
    _strobeChecks: STROBE_COHORT_ITEMS.map((i) => i.id),
  });

  return {
    id: "example-cohort",
    title: "Example: Activity & incident hypertension (cohort)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: "reporting",
    stages,
  };
}
