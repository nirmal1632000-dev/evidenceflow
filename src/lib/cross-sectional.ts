/** Cross-sectional study track — local projects + STROBE-inspired stages. */

export type XsStageId =
  | "question"
  | "design"
  | "participants"
  | "variables"
  | "measurement"
  | "analysis"
  | "ethics"
  | "reporting";

export type XsStageStatus = "not_started" | "in_progress" | "complete";

export interface XsField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface XsStageDef {
  id: XsStageId;
  number: number;
  title: string;
  shortTitle: string;
  summary: string;
  learn: {
    why: string;
    concepts: string[];
    commonMistakes: string[];
  };
  fields: XsField[];
  teach: {
    explain: string;
    reflectDecision: string;
    reflectUncertain: string;
  };
  nextHint: string;
}

export interface XsStageProgress {
  status: XsStageStatus;
  lessonRead: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export interface XsProject {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  currentStage: XsStageId;
  stages: Record<XsStageId, XsStageProgress>;
}

export const XS_STAGE_ORDER: XsStageId[] = [
  "question",
  "design",
  "participants",
  "variables",
  "measurement",
  "analysis",
  "ethics",
  "reporting",
];

export function createEmptyXsStages(): Record<XsStageId, XsStageProgress> {
  const stages = {} as Record<XsStageId, XsStageProgress>;
  for (const id of XS_STAGE_ORDER) {
    stages[id] = { status: "not_started", lessonRead: false, data: {} };
  }
  return stages;
}

export const XS_STAGES: XsStageDef[] = [
  {
    id: "question",
    number: 1,
    title: "Research question & objectives",
    shortTitle: "Question",
    summary: "Write a clear prevalence or association question for one time point.",
    learn: {
      why: "Cross-sectional studies answer ‘how common?’ or ‘how are X and Y related right now?’ — not ‘what causes what over time’. A sharp question prevents causal overclaim later.",
      concepts: [
        "Prevalence vs association objectives",
        "Target population vs study sample",
        "Primary outcome / measure defined up front",
      ],
      commonMistakes: [
        "Wording that implies longitudinal causality",
        "Vague outcomes (‘mental health’ with no scale)",
        "Multiple unprioritised aims",
      ],
    },
    fields: [
      {
        key: "topic",
        label: "Topic (plain language)",
        type: "textarea",
        required: true,
        placeholder: "e.g. Anxiety symptoms among first-year university students",
      },
      {
        key: "objectiveType",
        label: "Primary aim type",
        type: "select",
        required: true,
        options: [
          { value: "prevalence", label: "Prevalence / frequency" },
          { value: "association", label: "Association between variables" },
          { value: "both", label: "Both prevalence and association" },
          { value: "descriptive", label: "Descriptive profile only" },
        ],
      },
      {
        key: "question",
        label: "Research question (one sentence)",
        type: "textarea",
        required: true,
        placeholder:
          "What is the prevalence of … among …? / Is X associated with Y among … at one time point?",
      },
      {
        key: "hypothesis",
        label: "Hypothesis (if any)",
        type: "textarea",
        placeholder: "Optional for purely descriptive aims",
      },
    ],
    teach: {
      explain:
        "State your question and explicitly say why a single time point is enough (or what it cannot answer).",
      reflectDecision: "Why is this prevalence/association worth measuring now?",
      reflectUncertain: "What causal story might readers wrongly infer?",
    },
    nextHint: "Next: lock design, setting, and study period.",
  },
  {
    id: "design",
    number: 2,
    title: "Design, setting & period",
    shortTitle: "Design",
    summary: "Document that this is cross-sectional and where/when data are collected.",
    learn: {
      why: "STROBE expects clear design labels. ‘Survey of clinic attendees in March 2026’ is reproducible; ‘we studied patients’ is not.",
      concepts: [
        "Cross-sectional = exposure and outcome measured at (roughly) one time",
        "Setting (community, hospital, online)",
        "Study period and data sources",
      ],
      commonMistakes: [
        "Calling a chart review ‘prospective cohort’ when it’s a snapshot",
        "No setting description",
        "Mixing time points without saying so",
      ],
    },
    fields: [
      {
        key: "designLabel",
        label: "Design label",
        type: "select",
        required: true,
        options: [
          { value: "xs_survey", label: "Cross-sectional survey" },
          { value: "xs_clinic", label: "Cross-sectional clinic/facility sample" },
          { value: "xs_secondary", label: "Cross-sectional analysis of existing records" },
          { value: "xs_other", label: "Other cross-sectional" },
        ],
      },
      {
        key: "setting",
        label: "Setting",
        type: "textarea",
        required: true,
        placeholder: "Campus clinics; online student portal; district hospital OPD…",
      },
      {
        key: "period",
        label: "Study period",
        type: "text",
        required: true,
        placeholder: "e.g. March–April 2026",
      },
      {
        key: "dataSource",
        label: "Data source",
        type: "textarea",
        required: true,
        placeholder: "Self-administered questionnaire / EHR extract / interview…",
      },
    ],
    teach: {
      explain: "Explain to a peer why this is cross-sectional, not cohort.",
      reflectDecision: "Why this setting and period?",
      reflectUncertain: "Could data collection span times that blur ‘one snapshot’?",
    },
    nextHint: "Next: define who is eligible and how you sample them.",
  },
  {
    id: "participants",
    number: 3,
    title: "Participants & sampling",
    shortTitle: "Sample",
    summary: "Eligibility, sampling frame, size, and recruitment.",
    learn: {
      why: "Prevalence is only meaningful relative to a defined population. Convenience samples can still be useful — if you don’t oversell generalisability.",
      concepts: [
        "Inclusion / exclusion criteria",
        "Sampling frame and method (random, consecutive, convenience)",
        "Sample size rationale (precision for prevalence or power for association)",
        "Response rate planning",
      ],
      commonMistakes: [
        "No denominator definition",
        "‘Random’ claimed without a frame",
        "Ignoring non-response",
      ],
    },
    fields: [
      {
        key: "eligibility",
        label: "Inclusion / exclusion",
        type: "textarea",
        required: true,
      },
      {
        key: "sampling",
        label: "Sampling method",
        type: "textarea",
        required: true,
        placeholder: "Consecutive attendees / stratified random / snowball…",
      },
      {
        key: "sampleSize",
        label: "Sample size plan",
        type: "textarea",
        required: true,
        placeholder: "n=… based on expected prevalence 20%, precision ±5%…",
      },
      {
        key: "recruitment",
        label: "Recruitment process",
        type: "textarea",
        required: true,
      },
    ],
    teach: {
      explain: "Who is in the sampling frame, and who is missing?",
      reflectDecision: "Why this sampling method given resources?",
      reflectUncertain: "Biggest threat to representativeness?",
    },
    nextHint: "Next: define variables clearly.",
  },
  {
    id: "variables",
    number: 4,
    title: "Variables",
    shortTitle: "Variables",
    summary: "Outcomes, exposures/predictors, confounders, and definitions.",
    learn: {
      why: "Fuzzy variables produce uninterpretable tables. Pre-define primary outcome and how each construct is measured.",
      concepts: [
        "Primary vs secondary outcomes",
        "Exposure / independent variables",
        "Potential confounders (for association aims)",
        "Operational definitions",
      ],
      commonMistakes: [
        "No primary outcome",
        "Collecting 80 variables with no analysis plan",
        "Confounders chosen after seeing results",
      ],
    },
    fields: [
      {
        key: "primaryOutcome",
        label: "Primary outcome / measure",
        type: "textarea",
        required: true,
        placeholder: "e.g. GAD-7 ≥10 = probable anxiety",
      },
      {
        key: "exposures",
        label: "Key exposures / predictors",
        type: "textarea",
        required: true,
      },
      {
        key: "confounders",
        label: "Potential confounders / covariates",
        type: "textarea",
        placeholder: "Age, sex, year of study, prior diagnosis…",
      },
      {
        key: "definitions",
        label: "Operational definitions notes",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Define your primary outcome so two coders would agree.",
      reflectDecision: "Why this scale/cut-off?",
      reflectUncertain: "Which variable is hardest to measure validly?",
    },
    nextHint: "Next: measurement tools and bias control.",
  },
  {
    id: "measurement",
    number: 5,
    title: "Measurement & bias control",
    shortTitle: "Measure",
    summary: "Instruments, validation, training, and information bias.",
    learn: {
      why: "Cross-sectional estimates inherit measurement error. Invalid scales and differential reporting bias can create false associations.",
      concepts: [
        "Validated vs ad-hoc items",
        "Pilot testing",
        "Blinding where feasible (often limited in surveys)",
        "Social desirability and recall bias",
      ],
      commonMistakes: [
        "Unvalidated homemade scales without justification",
        "No pilot",
        "Leading questionnaire wording",
      ],
    },
    fields: [
      {
        key: "instruments",
        label: "Instruments / tools",
        type: "textarea",
        required: true,
      },
      {
        key: "validation",
        label: "Validation / reliability notes",
        type: "textarea",
        required: true,
      },
      {
        key: "biasControl",
        label: "Steps to reduce information bias",
        type: "textarea",
        required: true,
      },
      {
        key: "pilot",
        label: "Pilot plan / results",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Name one bias that could inflate your association and how you reduce it.",
      reflectDecision: "Why these instruments over alternatives?",
      reflectUncertain: "Where might self-report fail?",
    },
    nextHint: "Next: analysis plan before collecting data.",
  },
  {
    id: "analysis",
    number: 6,
    title: "Statistical analysis plan",
    shortTitle: "Analysis",
    summary: "Descriptive stats, prevalence estimation, and association models.",
    learn: {
      why: "Pre-specifying analysis reduces p-hacking. For prevalence, report confidence intervals; for associations, state models and confounder sets.",
      concepts: [
        "Descriptive tables",
        "Prevalence with 95% CI",
        "Crude vs adjusted associations",
        "Missing data approach",
      ],
      commonMistakes: [
        "No CI for prevalence",
        "Causal language for odds ratios from cross-sectional data",
        "Fishing across many predictors",
      ],
    },
    fields: [
      {
        key: "software",
        label: "Analysis software",
        type: "text",
        placeholder: "R / Stata / SPSS / Excel…",
      },
      {
        key: "descriptive",
        label: "Descriptive analysis plan",
        type: "textarea",
        required: true,
      },
      {
        key: "inferential",
        label: "Association / regression plan (if any)",
        type: "textarea",
        required: true,
      },
      {
        key: "missing",
        label: "Missing data plan",
        type: "textarea",
      },
    ],
    teach: {
      explain: "How will you report prevalence with uncertainty?",
      reflectDecision: "Which associations are primary vs exploratory?",
      reflectUncertain: "What would make you avoid multivariable models?",
    },
    nextHint: "Next: ethics and data protection.",
  },
  {
    id: "ethics",
    number: 7,
    title: "Ethics & data protection",
    shortTitle: "Ethics",
    summary: "Consent, IRB/ethics, anonymity, and data security.",
    learn: {
      why: "Surveys still need ethical oversight when identifiable or sensitive. Online studies need clear consent and secure storage.",
      concepts: [
        "Informed consent / waiver criteria",
        "Anonymity vs confidentiality",
        "Sensitive topics and distress protocols",
      ],
      commonMistakes: [
        "No ethics plan for student projects when required",
        "Collecting unnecessary identifiers",
        "Unsecured spreadsheets with names",
      ],
    },
    fields: [
      {
        key: "ethicsStatus",
        label: "Ethics review status",
        type: "select",
        required: true,
        options: [
          { value: "approved", label: "Approved / exempt with documentation" },
          { value: "submitted", label: "Submitted / pending" },
          { value: "planned", label: "Planned" },
          { value: "na", label: "Not required (justify)" },
        ],
      },
      {
        key: "consent",
        label: "Consent process",
        type: "textarea",
        required: true,
      },
      {
        key: "privacy",
        label: "Privacy & data security",
        type: "textarea",
        required: true,
      },
    ],
    teach: {
      explain: "How would you explain data use to a participant in one minute?",
      reflectDecision: "What identifiers will you never collect?",
      reflectUncertain: "Is ethics approval actually required in your institution?",
    },
    nextHint: "Next: STROBE-inspired checklist and export.",
  },
  {
    id: "reporting",
    number: 8,
    title: "Reporting (STROBE-inspired) & export",
    shortTitle: "Reporting",
    summary: "Title, abstract plan, checklist, and manuscript package.",
    learn: {
      why: "STROBE improves transparency of observational research. Cross-sectional items emphasise design, setting, participants, variables, bias, and statistics.",
      concepts: [
        "Design named in title/abstract",
        "Flow of participants / response",
        "Limitations including temporality",
      ],
      commonMistakes: [
        "Causal conclusions",
        "Hiding low response rates",
        "No limitations paragraph",
      ],
    },
    fields: [
      {
        key: "title",
        label: "Working title",
        type: "text",
        required: true,
        placeholder: "…: a cross-sectional study",
      },
      {
        key: "abstract",
        label: "Abstract skeleton",
        type: "textarea",
        placeholder: "Background / Methods / Results / Conclusions",
      },
      {
        key: "limitations",
        label: "Key limitations to report",
        type: "textarea",
        required: true,
      },
      {
        key: "gaps",
        label: "Gaps before data collection / write-up",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Pitch methods in 90 seconds including one major limitation.",
      reflectDecision: "Which STROBE areas are still thin?",
      reflectUncertain: "What would a methods reviewer attack first?",
    },
    nextHint: "Export your protocol-style package and get supervisor feedback before fieldwork.",
  },
];

export function getXsStage(id: XsStageId): XsStageDef {
  const s = XS_STAGES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown XS stage ${id}`);
  return s;
}

export function getNextXsStage(id: XsStageId): XsStageDef | null {
  const i = XS_STAGE_ORDER.indexOf(id);
  if (i < 0 || i >= XS_STAGE_ORDER.length - 1) return null;
  return getXsStage(XS_STAGE_ORDER[i + 1]);
}

export function getPrevXsStage(id: XsStageId): XsStageDef | null {
  const i = XS_STAGE_ORDER.indexOf(id);
  if (i <= 0) return null;
  return getXsStage(XS_STAGE_ORDER[i - 1]);
}

/** Educational STROBE-inspired checklist for cross-sectional studies */
export const STROBE_XS_ITEMS: { id: string; label: string; section: string }[] = [
  { id: "s1", section: "Title", label: "Design indicated in title or abstract (cross-sectional)" },
  { id: "s2", section: "Abstract", label: "Informative abstract with design, setting, participants, key results plan" },
  { id: "s3", section: "Background", label: "Scientific background and rationale stated" },
  { id: "s4", section: "Objectives", label: "Specific objectives / hypotheses pre-stated" },
  { id: "s5", section: "Setting", label: "Setting, locations, and relevant dates described" },
  { id: "s6", section: "Participants", label: "Eligibility criteria and sources/methods of selection" },
  { id: "s7", section: "Variables", label: "Outcomes, exposures, predictors, confounders defined" },
  { id: "s8", section: "Data sources", label: "Measurement methods for each variable of interest" },
  { id: "s9", section: "Bias", label: "Efforts to address potential bias described" },
  { id: "s10", section: "Study size", label: "Sample size rationale explained" },
  { id: "s11", section: "Statistics", label: "Statistical methods including confounder control planned" },
  { id: "s12", section: "Limitations", label: "Limitations including temporality / generalisability noted" },
];

const STORAGE_KEY = "evidenceflow_xs_projects_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function readAll(): XsProject[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as XsProject[];
  } catch {
    return [];
  }
}

function writeAll(projects: XsProject[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function listXsProjects(): XsProject[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getXsProject(id: string): XsProject | null {
  return readAll().find((p) => p.id === id) ?? null;
}

export function createXsProject(title: string): XsProject {
  const now = new Date().toISOString();
  const project: XsProject = {
    id: crypto.randomUUID(),
    title: title.trim() || "Untitled cross-sectional study",
    createdAt: now,
    updatedAt: now,
    currentStage: "question",
    stages: createEmptyXsStages(),
  };
  const all = readAll();
  all.push(project);
  writeAll(all);
  return project;
}

export function updateXsProject(project: XsProject): XsProject {
  const all = readAll();
  const next = { ...project, updatedAt: new Date().toISOString() };
  const idx = all.findIndex((p) => p.id === project.id);
  if (idx === -1) all.push(next);
  else all[idx] = next;
  writeAll(all);
  return next;
}

export function deleteXsProject(id: string) {
  writeAll(readAll().filter((p) => p.id !== id));
}

export function saveXsStageData(
  projectId: string,
  stageId: XsStageId,
  data: Record<string, unknown>,
  extras?: Partial<Pick<XsStageProgress, "status" | "lessonRead">>
): XsProject | null {
  const project = getXsProject(projectId);
  if (!project) return null;
  const prev = project.stages[stageId];
  const merged: XsStageProgress = {
    ...prev,
    data: { ...prev.data, ...data },
    ...extras,
  };
  if (!extras?.status) {
    const has = Object.values(merged.data).some((v) =>
      typeof v === "string" ? v.trim().length > 0 : Array.isArray(v) ? v.length > 0 : v != null && v !== ""
    );
    if (merged.status !== "complete" && has) merged.status = "in_progress";
  }
  project.stages[stageId] = merged;
  project.currentStage = stageId;
  return updateXsProject(project);
}

export function markXsStageComplete(
  projectId: string,
  stageId: XsStageId
): XsProject | null {
  const project = getXsProject(projectId);
  if (!project) return null;
  project.stages[stageId] = {
    ...project.stages[stageId],
    status: "complete",
    lessonRead: true,
  };
  const idx = XS_STAGE_ORDER.indexOf(stageId);
  if (idx >= 0 && idx < XS_STAGE_ORDER.length - 1) {
    project.currentStage = XS_STAGE_ORDER[idx + 1];
  }
  return updateXsProject(project);
}

export function computeXsProgress(project: XsProject) {
  const total = XS_STAGE_ORDER.length;
  const completed = XS_STAGE_ORDER.filter(
    (id) => project.stages[id]?.status === "complete"
  ).length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

export function buildXsExportMarkdown(project: XsProject): string {
  const lines: string[] = [
    `# ${project.title}`,
    ``,
    `> Cross-sectional study draft — EvidenceFlow educational export`,
    `> Generated ${new Date().toISOString().slice(0, 10)}`,
    ``,
  ];
  for (const id of XS_STAGE_ORDER) {
    const def = getXsStage(id);
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
  lines.push("## STROBE-inspired checklist (cross-sectional)", "");
  for (const item of STROBE_XS_ITEMS) {
    lines.push(`- [${checks.includes(item.id) ? "x" : " "}] ${item.label}`);
  }
  lines.push(
    "",
    "---",
    "*Educational draft only. Follow institutional ethics. STROBE: https://www.strobe-statement.org/*"
  );
  return lines.join("\n");
}

export function getExampleXsProject(): XsProject {
  const stages = createEmptyXsStages();
  const fill = (id: XsStageId, data: Record<string, unknown>) => {
    stages[id] = { status: "complete", lessonRead: true, data };
  };
  fill("question", {
    topic: "Anxiety symptoms among first-year university students",
    objectiveType: "both",
    question:
      "What is the prevalence of elevated anxiety symptoms (GAD-7 ≥10) among first-year students at one campus, and is it associated with sleep duration?",
    hypothesis:
      "Shorter self-reported sleep will be associated with higher odds of elevated GAD-7 in this cross-sectional sample.",
  });
  fill("design", {
    designLabel: "xs_survey",
    setting: "Single public university campus; online survey via student portal",
    period: "March–April (single academic term window)",
    dataSource: "Anonymous self-administered online questionnaire",
  });
  fill("participants", {
    eligibility:
      "Include: enrolled first-year undergraduates. Exclude: exchange students <4 weeks on campus.",
    sampling:
      "Invitation to all first-year students via portal + two reminders; voluntary response sample.",
    sampleSize:
      "Target n≈400 for prevalence precision ~±5% around 25% expected prevalence (planning estimate).",
    recruitment: "Email/portal notice; no course credit coercion.",
  });
  fill("variables", {
    primaryOutcome: "Elevated anxiety: GAD-7 total ≥10",
    exposures: "Average sleep hours/night (self-report, last 2 weeks)",
    confounders: "Sex, faculty, part-time work, prior mental health diagnosis (self-report)",
    definitions: "GAD-7 standard scoring; sleep as continuous hours",
  });
  fill("measurement", {
    instruments: "GAD-7; sleep item; demographics",
    validation: "GAD-7 widely validated; sleep single-item limitation acknowledged",
    biasControl: "Anonymous survey; neutral wording; optional skip for sensitive items",
    pilot: "Piloted with 10 students for clarity (example)",
  });
  fill("analysis", {
    software: "R",
    descriptive: "Frequencies; mean GAD-7; prevalence with 95% CI",
    inferential:
      "Logistic regression: elevated GAD-7 ~ sleep hours + covariates; report OR and CI; no causal language",
    missing: "Complete-case primary; report missingness by item",
  });
  fill("ethics", {
    ethicsStatus: "planned",
    consent: "Online information sheet + consent checkbox before survey",
    privacy: "No names/student IDs; aggregated reporting only",
  });
  fill("reporting", {
    title:
      "Anxiety symptoms and sleep among first-year students: a cross-sectional survey (example)",
    abstract:
      "Background: … Methods: cross-sectional online survey… Results: (to collect)… Conclusions: prevalence estimate; association not causal.",
    limitations:
      "Voluntary sample; self-report; cross-sectional temporality; single campus.",
    gaps: "Example only — not real data collection.",
    _strobeChecks: STROBE_XS_ITEMS.map((i) => i.id),
  });

  return {
    id: "example-cross-sectional",
    title: "Example: Student anxiety & sleep (cross-sectional)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: "reporting",
    stages,
  };
}
