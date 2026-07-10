/** RCT track — local projects + SPIRIT/CONSORT-inspired stages. */

export type RctStageId =
  | "question"
  | "design"
  | "participants"
  | "intervention"
  | "randomisation"
  | "outcomes"
  | "statistics"
  | "ethics"
  | "reporting";

export type RctStageStatus = "not_started" | "in_progress" | "complete";

export interface RctField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface RctStageDef {
  id: RctStageId;
  number: number;
  title: string;
  shortTitle: string;
  summary: string;
  learn: {
    why: string;
    concepts: string[];
    commonMistakes: string[];
  };
  fields: RctField[];
  teach: {
    explain: string;
    reflectDecision: string;
    reflectUncertain: string;
  };
  nextHint: string;
}

export interface RctStageProgress {
  status: RctStageStatus;
  lessonRead: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export interface RctProject {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  currentStage: RctStageId;
  stages: Record<RctStageId, RctStageProgress>;
}

export const RCT_STAGE_ORDER: RctStageId[] = [
  "question",
  "design",
  "participants",
  "intervention",
  "randomisation",
  "outcomes",
  "statistics",
  "ethics",
  "reporting",
];

export function createEmptyRctStages(): Record<RctStageId, RctStageProgress> {
  const stages = {} as Record<RctStageId, RctStageProgress>;
  for (const id of RCT_STAGE_ORDER) {
    stages[id] = { status: "not_started", lessonRead: false, data: {} };
  }
  return stages;
}

export const RCT_STAGES: RctStageDef[] = [
  {
    id: "question",
    number: 1,
    title: "Research question & objectives (PICOT)",
    shortTitle: "Question",
    summary: "Population, intervention, comparator, outcomes, and time frame.",
    learn: {
      why: "RCTs answer comparative intervention questions. Vague aims produce underpowered trials and outcome switching. PICOT forces a protocol-ready question.",
      concepts: [
        "Superiority vs non-inferiority vs equivalence (pick one primary framework)",
        "Primary objective vs secondary objectives",
        "Patient-important outcomes",
      ],
      commonMistakes: [
        "Too many co-primary outcomes",
        "Comparator not specified",
        "No time horizon for the primary endpoint",
      ],
    },
    fields: [
      {
        key: "population",
        label: "P — Population",
        type: "textarea",
        required: true,
      },
      {
        key: "intervention",
        label: "I — Intervention",
        type: "textarea",
        required: true,
      },
      {
        key: "comparator",
        label: "C — Comparator",
        type: "textarea",
        required: true,
      },
      {
        key: "outcomes",
        label: "O — Primary outcome (+ key secondaries)",
        type: "textarea",
        required: true,
      },
      {
        key: "timeframe",
        label: "T — Time frame for primary outcome",
        type: "text",
        required: true,
        placeholder: "e.g. 12 weeks after randomisation",
      },
      {
        key: "objective",
        label: "Primary objective (one sentence)",
        type: "textarea",
        required: true,
      },
      {
        key: "framework",
        label: "Trial framework",
        type: "select",
        required: true,
        options: [
          { value: "superiority", label: "Superiority" },
          { value: "noninferiority", label: "Non-inferiority" },
          { value: "equivalence", label: "Equivalence" },
          { value: "exploratory", label: "Exploratory / pilot" },
        ],
      },
    ],
    teach: {
      explain: "State PICOT and which claim (superiority/NI) the trial will support.",
      reflectDecision: "Why this primary outcome for patients/decisions?",
      reflectUncertain: "Is the question still too broad for one trial?",
    },
    nextHint: "Next: overall design (parallel, cluster, blinding).",
  },
  {
    id: "design",
    number: 2,
    title: "Trial design overview",
    shortTitle: "Design",
    summary: "Parallel/group structure, allocation ratio, blinding level, setting.",
    learn: {
      why: "CONSORT and SPIRIT expect a clear design description. Parallel two-arm superiority trials are the teaching default; clusters and crossovers add complexity.",
      concepts: [
        "Parallel group vs crossover vs factorial",
        "Individual vs cluster randomisation",
        "Open-label vs single/double blind",
        "Phases (II/III) and pilot status",
      ],
      commonMistakes: [
        "Calling a non-randomised comparison an RCT",
        "Blinding claimed when impossible without detailing bias risk",
        "No allocation ratio stated",
      ],
    },
    fields: [
      {
        key: "structure",
        label: "Design structure",
        type: "select",
        required: true,
        options: [
          { value: "parallel2", label: "Parallel two-arm" },
          { value: "parallelMulti", label: "Parallel multi-arm" },
          { value: "cluster", label: "Cluster randomised" },
          { value: "crossover", label: "Crossover" },
          { value: "factorial", label: "Factorial" },
          { value: "other", label: "Other" },
        ],
      },
      {
        key: "ratio",
        label: "Allocation ratio",
        type: "text",
        required: true,
        placeholder: "e.g. 1:1",
      },
      {
        key: "blinding",
        label: "Blinding plan",
        type: "textarea",
        required: true,
        placeholder: "Who is blinded (participants, clinicians, assessors, analysts)?",
      },
      {
        key: "setting",
        label: "Setting & centres",
        type: "textarea",
        required: true,
      },
      {
        key: "phase",
        label: "Phase / pilot status",
        type: "select",
        options: [
          { value: "pilot", label: "Pilot / feasibility" },
          { value: "2", label: "Phase II" },
          { value: "3", label: "Phase III" },
          { value: "4", label: "Phase IV / pragmatic" },
          { value: "na", label: "Not applicable / educational" },
        ],
      },
    ],
    teach: {
      explain: "Describe design and blinding in one minute without buzzwords.",
      reflectDecision: "Why this structure over cluster/crossover?",
      reflectUncertain: "Where is blinding weakest?",
    },
    nextHint: "Next: who is eligible and how you recruit.",
  },
  {
    id: "participants",
    number: 3,
    title: "Participants & recruitment",
    shortTitle: "Participants",
    summary: "Eligibility criteria, recruitment path, and consent.",
    learn: {
      why: "Eligibility defines external validity. Recruitment feasibility kills more trials than statistics. SPIRIT requires detailed criteria and settings.",
      concepts: [
        "Inclusion/exclusion lists",
        "Recruitment sources and screening log",
        "Informed consent process",
        "Vulnerable populations",
      ],
      commonMistakes: [
        "Criteria so tight the trial never fills",
        "No screening log plan",
        "Consent language that overpromises benefit",
      ],
    },
    fields: [
      {
        key: "inclusion",
        label: "Inclusion criteria",
        type: "textarea",
        required: true,
      },
      {
        key: "exclusion",
        label: "Exclusion criteria",
        type: "textarea",
        required: true,
      },
      {
        key: "recruitment",
        label: "Recruitment strategy",
        type: "textarea",
        required: true,
      },
      {
        key: "consent",
        label: "Consent process",
        type: "textarea",
        required: true,
      },
    ],
    teach: {
      explain: "Walk through screening → consent → randomisation as a flowchart orally.",
      reflectDecision: "Which exclusion is most controversial?",
      reflectUncertain: "Recruitment risk: where will you find participants?",
    },
    nextHint: "Next: specify interventions in reproducible detail.",
  },
  {
    id: "intervention",
    number: 4,
    title: "Interventions (TIDieR-style)",
    shortTitle: "Intervention",
    summary: "What each arm receives: content, dose, delivery, adherence.",
    learn: {
      why: "Readers must reproduce the intervention. Vague ‘usual care’ or ‘counselling’ undermines the trial and future systematic reviews.",
      concepts: [
        "Experimental arm components",
        "Comparator standardisation",
        "Adherence and fidelity monitoring",
        "Concomitant care rules",
      ],
      commonMistakes: [
        "Comparator not described",
        "No adherence plan",
        "Contamination between arms ignored",
      ],
    },
    fields: [
      {
        key: "experimental",
        label: "Experimental intervention",
        type: "textarea",
        required: true,
      },
      {
        key: "controlArm",
        label: "Control / comparator arm",
        type: "textarea",
        required: true,
      },
      {
        key: "adherence",
        label: "Adherence / fidelity monitoring",
        type: "textarea",
        required: true,
      },
      {
        key: "concomitant",
        label: "Allowed concomitant care",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Describe both arms so a new site could implement them.",
      reflectDecision: "Is the control ethically and scientifically fair?",
      reflectUncertain: "How might contamination occur?",
    },
    nextHint: "Next: randomisation and allocation concealment — critical validity stage.",
  },
  {
    id: "randomisation",
    number: 5,
    title: "Randomisation & concealment",
    shortTitle: "Randomise",
    summary: "Sequence generation, concealment, implementation, stratification.",
    learn: {
      why: "Random sequence + allocation concealment are the RCT’s core protection against selection bias. Poor concealment can undo randomisation.",
      concepts: [
        "Computer-generated sequences, block sizes",
        "Stratification / minimisation",
        "Central randomisation / sealed opaque envelopes (with caveats)",
        "Who enrols vs who assigns",
      ],
      commonMistakes: [
        "Alternation or ‘random’ by day of week",
        "Open lists / predictable blocks",
        "Site staff generating the sequence they can see",
      ],
    },
    fields: [
      {
        key: "sequence",
        label: "Sequence generation",
        type: "textarea",
        required: true,
        placeholder: "e.g. Computer-generated permuted blocks of 4 and 6; 1:1",
      },
      {
        key: "concealment",
        label: "Allocation concealment",
        type: "textarea",
        required: true,
      },
      {
        key: "implementation",
        label: "Who generates, who enrols, who assigns",
        type: "textarea",
        required: true,
      },
      {
        key: "stratification",
        label: "Stratification / blocking factors",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Why concealment matters even if the sequence is random.",
      reflectDecision: "How will you prevent prediction of the next assignment?",
      reflectUncertain: "What operational risk threatens concealment at sites?",
    },
    nextHint: "Next: outcomes, endpoints, and bias in assessment.",
  },
  {
    id: "outcomes",
    number: 6,
    title: "Outcomes & assessment",
    shortTitle: "Outcomes",
    summary: "Primary/secondary endpoints, timing, assessor blinding, PROMs.",
    learn: {
      why: "Outcome switching and unblinded soft endpoints inflate false positives. Pre-specify definitions and assessment windows.",
      concepts: [
        "Primary endpoint definition and time point",
        "Secondary and safety outcomes",
        "Blinded outcome assessment when treatment can’t be blinded",
        "Patient-reported outcomes",
      ],
      commonMistakes: [
        "Multiple primaries without multiplicity plan",
        "Outcome measured differently by arm",
        "No safety monitoring plan",
      ],
    },
    fields: [
      {
        key: "primaryEndpoint",
        label: "Primary endpoint (definition + time)",
        type: "textarea",
        required: true,
      },
      {
        key: "secondaryEndpoints",
        label: "Secondary endpoints",
        type: "textarea",
        required: true,
      },
      {
        key: "assessment",
        label: "Assessment methods & blinding of assessors",
        type: "textarea",
        required: true,
      },
      {
        key: "safety",
        label: "Safety / adverse event monitoring",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Define the primary endpoint so two assessors would code the same way.",
      reflectDecision: "Why this endpoint over a surrogate?",
      reflectUncertain: "Where is detection bias still possible?",
    },
    nextHint: "Next: sample size and statistical analysis plan.",
  },
  {
    id: "statistics",
    number: 7,
    title: "Sample size & analysis plan",
    shortTitle: "Stats",
    summary: "Power, primary analysis set, missing data, interim looks.",
    learn: {
      why: "Underpowered trials waste participants; unplanned analyses mislead. SPIRIT expects a pre-specified SAP outline.",
      concepts: [
        "Effect size assumptions and power",
        "ITT vs modified ITT vs per-protocol",
        "Missing data strategy",
        "Multiplicity and interim analyses / DMC",
      ],
      commonMistakes: [
        "No sample size justification",
        "Primary analysis not ITT when superiority is claimed",
        "Post-hoc subgroups highlighted as main findings",
      ],
    },
    fields: [
      {
        key: "sampleSize",
        label: "Sample size calculation (assumptions)",
        type: "textarea",
        required: true,
      },
      {
        key: "primaryAnalysis",
        label: "Primary analysis (population + model)",
        type: "textarea",
        required: true,
        placeholder: "ITT; difference in means / risk ratio; 95% CI; two-sided α=0.05",
      },
      {
        key: "missing",
        label: "Missing data approach",
        type: "textarea",
        required: true,
      },
      {
        key: "secondaryAnalyses",
        label: "Secondary / sensitivity / subgroups",
        type: "textarea",
      },
      {
        key: "software",
        label: "Analysis software",
        type: "text",
      },
    ],
    teach: {
      explain: "What is ITT and why it matters for your primary claim?",
      reflectDecision: "Which effect size did you power on — is it realistic?",
      reflectUncertain: "Biggest analysis risk (missing data, non-adherence)?",
    },
    nextHint: "Next: ethics, registration, and oversight.",
  },
  {
    id: "ethics",
    number: 8,
    title: "Ethics, registration & oversight",
    shortTitle: "Ethics",
    summary: "IRB, trial registration, DMC, protocol amendments.",
    learn: {
      why: "Registration (e.g. ClinicalTrials.gov) timestamps outcomes and reduces selective reporting. Ethics review protects participants.",
      concepts: [
        "IRB/IEC approval",
        "Prospective registration before enrolment",
        "Data monitoring committee when appropriate",
        "Protocol amendments documented",
      ],
      commonMistakes: [
        "Registering after enrolment starts",
        "No plan for serious adverse events",
        "Silent protocol changes",
      ],
    },
    fields: [
      {
        key: "ethicsStatus",
        label: "Ethics status",
        type: "select",
        required: true,
        options: [
          { value: "approved", label: "Approved" },
          { value: "submitted", label: "Submitted / pending" },
          { value: "planned", label: "Planned" },
          { value: "educational", label: "Educational design only (not running)" },
        ],
      },
      {
        key: "registration",
        label: "Trial registration plan / ID",
        type: "textarea",
        required: true,
        placeholder: "ClinicalTrials.gov / CTRI / other…",
      },
      {
        key: "oversight",
        label: "Oversight (sponsor, DMC, steering)",
        type: "textarea",
      },
      {
        key: "harmsPlan",
        label: "Harms reporting plan",
        type: "textarea",
        required: true,
      },
    ],
    teach: {
      explain: "Why register outcomes before the first patient is enrolled?",
      reflectDecision: "Is a DMC needed for this risk level?",
      reflectUncertain: "Which ethics documents are still missing?",
    },
    nextHint: "Next: CONSORT/SPIRIT-inspired checklist and export.",
  },
  {
    id: "reporting",
    number: 9,
    title: "Reporting (SPIRIT/CONSORT) & export",
    shortTitle: "Reporting",
    summary: "Protocol/report checklist, flow diagram plan, limitations.",
    learn: {
      why: "SPIRIT structures protocols; CONSORT structures reports (including participant flow). Transparent reporting is part of trial quality.",
      concepts: [
        "Protocol vs results paper",
        "CONSORT flow diagram",
        "Pre-specified vs post-hoc analyses labelled clearly",
      ],
      commonMistakes: [
        "No flow diagram",
        "Selective outcome reporting",
        "Spin in abstract conclusions",
      ],
    },
    fields: [
      {
        key: "title",
        label: "Working title",
        type: "text",
        required: true,
        placeholder: "…: a randomised controlled trial",
      },
      {
        key: "abstract",
        label: "Abstract skeleton",
        type: "textarea",
      },
      {
        key: "flowPlan",
        label: "CONSORT flow categories you will track",
        type: "textarea",
        required: true,
        placeholder: "Screened, excluded (reasons), randomised, received intervention, analysed…",
      },
      {
        key: "limitations",
        label: "Anticipated limitations",
        type: "textarea",
        required: true,
      },
      {
        key: "gaps",
        label: "Gaps before protocol freeze / submission",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Pitch the trial in 90 seconds including one limitation.",
      reflectDecision: "Which SPIRIT/CONSORT items are still thin?",
      reflectUncertain: "What would a methods reviewer attack first?",
    },
    nextHint: "Export the protocol pack and get statistical + clinical review before enrolment.",
  },
];

export function getRctStage(id: RctStageId): RctStageDef {
  const s = RCT_STAGES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown RCT stage ${id}`);
  return s;
}

export function getNextRctStage(id: RctStageId): RctStageDef | null {
  const i = RCT_STAGE_ORDER.indexOf(id);
  if (i < 0 || i >= RCT_STAGE_ORDER.length - 1) return null;
  return getRctStage(RCT_STAGE_ORDER[i + 1]);
}

export function getPrevRctStage(id: RctStageId): RctStageDef | null {
  const i = RCT_STAGE_ORDER.indexOf(id);
  if (i <= 0) return null;
  return getRctStage(RCT_STAGE_ORDER[i - 1]);
}

/** Educational SPIRIT/CONSORT-inspired checklist */
export const CONSORT_SPIRIT_ITEMS: {
  id: string;
  label: string;
  section: string;
}[] = [
  { id: "r1", section: "Title", label: "Identified as randomised trial in title" },
  { id: "r2", section: "Abstract", label: "Structured summary of trial design, methods, results plan" },
  { id: "r3", section: "Objectives", label: "Specific objectives and hypotheses stated" },
  { id: "r4", section: "Design", label: "Trial design (e.g. parallel), allocation ratio, framework" },
  { id: "r5", section: "Participants", label: "Eligibility criteria and settings described" },
  { id: "r6", section: "Interventions", label: "Interventions for each group described in detail" },
  { id: "r7", section: "Outcomes", label: "Primary and secondary outcome measures pre-specified" },
  { id: "r8", section: "Sample size", label: "Sample size determination explained" },
  { id: "r9", section: "Randomisation", label: "Sequence generation method described" },
  { id: "r10", section: "Concealment", label: "Allocation concealment mechanism described" },
  { id: "r11", section: "Blinding", label: "Who was blinded (or why not) described" },
  { id: "r12", section: "Statistics", label: "Statistical methods for primary outcome pre-specified" },
  { id: "r13", section: "Registration", label: "Trial registration planned/completed" },
  { id: "r14", section: "Ethics", label: "Ethics approval and consent addressed" },
  { id: "r15", section: "Flow", label: "Plan for participant flow (CONSORT diagram categories)" },
];

const STORAGE_KEY = "evidenceflow_rct_projects_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function readAll(): RctProject[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RctProject[];
  } catch {
    return [];
  }
}

function writeAll(projects: RctProject[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function listRctProjects(): RctProject[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getRctProject(id: string): RctProject | null {
  return readAll().find((p) => p.id === id) ?? null;
}

export function createRctProject(title: string): RctProject {
  const now = new Date().toISOString();
  const project: RctProject = {
    id: crypto.randomUUID(),
    title: title.trim() || "Untitled randomised trial",
    createdAt: now,
    updatedAt: now,
    currentStage: "question",
    stages: createEmptyRctStages(),
  };
  const all = readAll();
  all.push(project);
  writeAll(all);
  return project;
}

export function updateRctProject(project: RctProject): RctProject {
  const all = readAll();
  const next = { ...project, updatedAt: new Date().toISOString() };
  const idx = all.findIndex((p) => p.id === project.id);
  if (idx === -1) all.push(next);
  else all[idx] = next;
  writeAll(all);
  return next;
}

export function deleteRctProject(id: string) {
  writeAll(readAll().filter((p) => p.id !== id));
}

export function saveRctStageData(
  projectId: string,
  stageId: RctStageId,
  data: Record<string, unknown>,
  extras?: Partial<Pick<RctStageProgress, "status" | "lessonRead">>
): RctProject | null {
  const project = getRctProject(projectId);
  if (!project) return null;
  const prev = project.stages[stageId];
  const merged: RctStageProgress = {
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
  return updateRctProject(project);
}

export function markRctStageComplete(
  projectId: string,
  stageId: RctStageId
): RctProject | null {
  const project = getRctProject(projectId);
  if (!project) return null;
  project.stages[stageId] = {
    ...project.stages[stageId],
    status: "complete",
    lessonRead: true,
  };
  const idx = RCT_STAGE_ORDER.indexOf(stageId);
  if (idx >= 0 && idx < RCT_STAGE_ORDER.length - 1) {
    project.currentStage = RCT_STAGE_ORDER[idx + 1];
  }
  return updateRctProject(project);
}

export function computeRctProgress(project: RctProject) {
  const total = RCT_STAGE_ORDER.length;
  const completed = RCT_STAGE_ORDER.filter(
    (id) => project.stages[id]?.status === "complete"
  ).length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

export function buildRctExportMarkdown(project: RctProject): string {
  const lines: string[] = [
    `# ${project.title}`,
    ``,
    `> Randomised trial protocol draft — EvidenceFlow educational export`,
    `> Generated ${new Date().toISOString().slice(0, 10)}`,
    ``,
  ];
  for (const id of RCT_STAGE_ORDER) {
    const def = getRctStage(id);
    const data = project.stages[id]?.data || {};
    lines.push(`## ${def.number}. ${def.title}`, "");
    for (const f of def.fields) {
      lines.push(`### ${f.label}`, "", String(data[f.key] ?? "—"), "");
    }
  }
  const checks = (() => {
    const raw = project.stages.reporting?.data?._consortChecks;
    return Array.isArray(raw) ? raw.map(String) : [];
  })();
  lines.push("## SPIRIT/CONSORT-inspired checklist (educational)", "");
  for (const item of CONSORT_SPIRIT_ITEMS) {
    lines.push(`- [${checks.includes(item.id) ? "x" : " "}] ${item.label}`);
  }
  lines.push(
    "",
    "---",
    "*Educational draft only. Follow SPIRIT/CONSORT, ethics, and registration requirements. https://www.consort-spirit.org/*"
  );
  return lines.join("\n");
}

export function getExampleRctProject(): RctProject {
  const stages = createEmptyRctStages();
  const fill = (id: RctStageId, data: Record<string, unknown>) => {
    stages[id] = { status: "complete", lessonRead: true, data };
  };
  fill("question", {
    population: "Adults 18–65 with moderate major depressive episode (PHQ-9 10–19)",
    intervention: "8-week guided digital CBT programme + usual care",
    comparator: "Usual care alone (wait-list access to digital CBT after 12 weeks)",
    outcomes: "Primary: PHQ-9 at 12 weeks. Secondary: remission, anxiety (GAD-7), adherence",
    timeframe: "12 weeks after randomisation",
    objective:
      "To test whether guided digital CBT plus usual care reduces PHQ-9 more than usual care alone at 12 weeks.",
    framework: "superiority",
  });
  fill("design", {
    structure: "parallel2",
    ratio: "1:1",
    blinding:
      "Participants not blinded to digital access; outcome assessors and statisticians blinded to allocation where feasible",
    setting: "Two outpatient psychiatry clinics + online recruitment (example)",
    phase: "3",
  });
  fill("participants", {
    inclusion: "Age 18–65; DSM-5 MDE; PHQ-9 10–19; internet access; consent",
    exclusion: "Bipolar, psychosis, high suicide risk, current structured psychotherapy",
    recruitment: "Clinic screening + portal ads; screening log of all approached",
    consent: "Written e-consent with capacity check; cooling-off period 24h optional",
  });
  fill("intervention", {
    experimental:
      "Guided digital CBT: 8 modules, weekly coach messages (15 min), homework",
    controlArm: "Usual care (GP/psychiatrist visits as scheduled); no digital CBT until 12 weeks",
    adherence: "Module completion %; coach contact log; app analytics",
    concomitant: "Antidepressants allowed if stable ≥4 weeks; no new psychotherapy",
  });
  fill("randomisation", {
    sequence: "Computer-generated permuted blocks (4/6), stratified by site and antidepressant use",
    concealment: "Central web randomisation; allocation revealed after consent and baseline",
    implementation: "Independent statistician generates list; research staff enrol; system assigns",
    stratification: "Site; current antidepressant (yes/no)",
  });
  fill("outcomes", {
    primaryEndpoint: "PHQ-9 total score at 12 weeks (continuous)",
    secondaryEndpoints: "PHQ-9 response/remission; GAD-7; EQ-5D; adverse events",
    assessment: "Online self-report + blinded telephone PHQ-9 by assessor unaware of arm when possible",
    safety: "Weekly safety item; escalation protocol for suicidality",
  });
  fill("statistics", {
    sampleSize:
      "n=240 (120/arm) for 3-point PHQ-9 difference, SD 8, 90% power, 20% attrition (illustrative)",
    primaryAnalysis:
      "ITT linear model: 12-week PHQ-9 ~ arm + baseline PHQ-9 + site; mean difference 95% CI",
    missing: "Multiple imputation primary; complete-case sensitivity",
    secondaryAnalyses: "Per-protocol (≥6 modules); subgroup by antidepressant (exploratory)",
    software: "R",
  });
  fill("ethics", {
    ethicsStatus: "planned",
    registration: "Register on ClinicalTrials.gov before first enrolment (example ID pending)",
    oversight: "Sponsor: university; independent DMC for safety reviews every 6 months",
    harmsPlan: "SAE reporting within 24h; annual safety report",
  });
  fill("reporting", {
    title:
      "Guided digital CBT for moderate depression: a randomised controlled trial (example)",
    abstract:
      "Background… Methods: parallel RCT 1:1… Outcomes: PHQ-9 at 12 weeks… Registration…",
    flowPlan:
      "Assessed → excluded (reasons) → randomised → allocated → received → lost → analysed (ITT)",
    limitations:
      "Partial blinding; self-report primary; two-centre generalisability; wait-list ethics trade-off",
    gaps: "Example educational protocol only — not a real trial.",
    _consortChecks: CONSORT_SPIRIT_ITEMS.map((i) => i.id),
  });

  return {
    id: "example-rct",
    title: "Example: Digital CBT for depression (RCT)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: "reporting",
    stages,
  };
}
