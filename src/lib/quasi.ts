/** Quasi-experimental track — local projects + TREND/validity-inspired stages. */

export type QuasiStageId =
  | "question"
  | "design"
  | "intervention"
  | "comparison"
  | "outcomes"
  | "validity"
  | "analysis"
  | "ethics"
  | "reporting";

export type QuasiStageStatus = "not_started" | "in_progress" | "complete";

export interface QuasiField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface QuasiStageDef {
  id: QuasiStageId;
  number: number;
  title: string;
  shortTitle: string;
  summary: string;
  learn: {
    why: string;
    concepts: string[];
    commonMistakes: string[];
  };
  fields: QuasiField[];
  teach: {
    explain: string;
    reflectDecision: string;
    reflectUncertain: string;
  };
  nextHint: string;
}

export interface QuasiStageProgress {
  status: QuasiStageStatus;
  lessonRead: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export interface QuasiProject {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  currentStage: QuasiStageId;
  stages: Record<QuasiStageId, QuasiStageProgress>;
}

export const QUASI_STAGE_ORDER: QuasiStageId[] = [
  "question",
  "design",
  "intervention",
  "comparison",
  "outcomes",
  "validity",
  "analysis",
  "ethics",
  "reporting",
];

export function createEmptyQuasiStages(): Record<
  QuasiStageId,
  QuasiStageProgress
> {
  const stages = {} as Record<QuasiStageId, QuasiStageProgress>;
  for (const id of QUASI_STAGE_ORDER) {
    stages[id] = { status: "not_started", lessonRead: false, data: {} };
  }
  return stages;
}

export const QUASI_STAGES: QuasiStageDef[] = [
  {
    id: "question",
    number: 1,
    title: "Evaluation question",
    shortTitle: "Question",
    summary:
      "What program/policy/intervention effect are you trying to estimate without full randomisation?",
    learn: {
      why: "Quasi-experiments evaluate interventions when RCTs are not feasible. The question must still be causal in intent — and honest about design limits.",
      concepts: [
        "Intervention effect vs pure association",
        "Target population and decision context",
        "Why randomisation is not used (ethics, logistics, policy)",
      ],
      commonMistakes: [
        "Vague ‘did the program work?’ without outcome or population",
        "Pretending non-random allocation is as strong as an RCT",
        "No pre-specified primary outcome",
      ],
    },
    fields: [
      {
        key: "topic",
        label: "Program / policy / intervention topic",
        type: "textarea",
        required: true,
        placeholder: "e.g. Hospital hand-hygiene campaign and infection rates",
      },
      {
        key: "question",
        label: "Evaluation question (one sentence)",
        type: "textarea",
        required: true,
        placeholder:
          "Did introduction of … change … among … compared with …?",
      },
      {
        key: "whyNotRct",
        label: "Why not a fully randomised trial?",
        type: "textarea",
        required: true,
      },
      {
        key: "primaryOutcome",
        label: "Primary outcome for the evaluation",
        type: "textarea",
        required: true,
      },
    ],
    teach: {
      explain:
        "State the causal question and one reason randomisation was not used.",
      reflectDecision: "Who will use this evaluation result?",
      reflectUncertain: "What would an RCT have controlled that you cannot?",
    },
    nextHint: "Next: pick a quasi design structure.",
  },
  {
    id: "design",
    number: 2,
    title: "Quasi design type",
    shortTitle: "Design",
    summary: "Before–after, controlled before–after, ITS, DiD, etc.",
    learn: {
      why: "Different quasi designs make different assumptions. Naming the design forces you to list threats (history, selection, regression to the mean).",
      concepts: [
        "Uncontrolled before–after (weak alone)",
        "Controlled before–after / non-equivalent control group",
        "Interrupted time series (ITS)",
        "Difference-in-differences (DiD)",
        "Regression discontinuity (advanced)",
      ],
      commonMistakes: [
        "Simple before–after sold as strong causal proof",
        "No pre-period / post-period definition",
        "Switching design after seeing results",
      ],
    },
    fields: [
      {
        key: "designType",
        label: "Primary quasi design",
        type: "select",
        required: true,
        options: [
          { value: "ba", label: "Before–after (uncontrolled)" },
          { value: "cba", label: "Controlled before–after" },
          { value: "its", label: "Interrupted time series" },
          { value: "did", label: "Difference-in-differences" },
          { value: "rd", label: "Regression discontinuity" },
          { value: "other", label: "Other / hybrid" },
        ],
      },
      {
        key: "designRationale",
        label: "Why this design fits the setting",
        type: "textarea",
        required: true,
      },
      {
        key: "timePoints",
        label: "Pre/post periods or time series structure",
        type: "textarea",
        required: true,
        placeholder: "Pre: … months; intervention start: …; post: …",
      },
      {
        key: "unit",
        label: "Unit of analysis (patient, ward, school, region…)",
        type: "text",
        required: true,
      },
    ],
    teach: {
      explain: "Name your design and one assumption it requires.",
      reflectDecision: "Why not a stronger feasible alternative?",
      reflectUncertain: "Is your pre-period long enough?",
    },
    nextHint: "Next: define the intervention clearly.",
  },
  {
    id: "intervention",
    number: 3,
    title: "Intervention package",
    shortTitle: "Intervention",
    summary: "What was implemented, for whom, intensity, fidelity.",
    learn: {
      why: "Without a clear intervention definition, effects are uninterpretable. Document components, timing, and adherence.",
      concepts: [
        "Intervention components (TIDieR-style thinking)",
        "Start date / roll-out",
        "Fidelity and contamination",
        "Co-interventions",
      ],
      commonMistakes: [
        "Black-box ‘quality improvement’ with no components",
        "Unclear intervention start (for ITS/DiD)",
        "Ignoring concurrent programs",
      ],
    },
    fields: [
      {
        key: "components",
        label: "Intervention components",
        type: "textarea",
        required: true,
      },
      {
        key: "start",
        label: "Start / roll-out timing",
        type: "textarea",
        required: true,
      },
      {
        key: "fidelity",
        label: "Fidelity / dose / adherence plan",
        type: "textarea",
        required: true,
      },
      {
        key: "cointerventions",
        label: "Co-interventions or concurrent changes",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Describe the intervention so another site could try to copy it.",
      reflectDecision: "What is the ‘active ingredient’?",
      reflectUncertain: "Where might contamination occur?",
    },
    nextHint: "Next: comparison strategy / control group.",
  },
  {
    id: "comparison",
    number: 4,
    title: "Comparison / control strategy",
    shortTitle: "Comparison",
    summary: "Who or what is the counterfactual?",
    learn: {
      why: "Quasi designs stand or fall on the counterfactual. A poor control group reintroduces selection and history threats.",
      concepts: [
        "Historical controls vs concurrent controls",
        "Matching / synthetic controls (conceptually)",
        "Parallel trends (for DiD)",
        "No-control designs need extra caution",
      ],
      commonMistakes: [
        "Controls chosen because they ‘look good’ after the fact",
        "Ignoring different case-mix",
        "Assuming parallel trends without checking pre-trends",
      ],
    },
    fields: [
      {
        key: "control",
        label: "Control / comparison definition",
        type: "textarea",
        required: true,
      },
      {
        key: "assignment",
        label: "How units got intervention vs not",
        type: "textarea",
        required: true,
        placeholder: "Policy roll-out, clinician choice, geography…",
      },
      {
        key: "balance",
        label: "Baseline differences & balancing approach",
        type: "textarea",
        required: true,
      },
      {
        key: "assumptions",
        label: "Key identifying assumptions",
        type: "textarea",
        placeholder: "e.g. parallel trends; no simultaneous shock…",
      },
    ],
    teach: {
      explain: "What would have happened without the intervention (your story)?",
      reflectDecision: "Why this comparison group is defensible.",
      reflectUncertain: "Biggest selection threat?",
    },
    nextHint: "Next: outcomes and data sources.",
  },
  {
    id: "outcomes",
    number: 5,
    title: "Outcomes & measurement",
    shortTitle: "Outcomes",
    summary: "Primary/secondary outcomes, data quality, timing.",
    learn: {
      why: "Outcome measurement must be stable across pre/post periods. Changing definitions mid-stream creates fake effects.",
      concepts: [
        "Pre-specified primary outcome",
        "Same measurement protocol pre and post",
        "Process vs clinical outcomes",
        "Multiple testing risk",
      ],
      commonMistakes: [
        "Outcome shopping after seeing charts",
        "Definition drift over calendar time",
        "No secondary safety outcomes",
      ],
    },
    fields: [
      {
        key: "primary",
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
        key: "dataSource",
        label: "Data sources & quality",
        type: "textarea",
        required: true,
      },
      {
        key: "stability",
        label: "How measurement stays comparable over time",
        type: "textarea",
        required: true,
      },
    ],
    teach: {
      explain: "How could measurement change create a false ‘success’?",
      reflectDecision: "Why this primary endpoint for decision-makers?",
      reflectUncertain: "Data gaps in the pre-period?",
    },
    nextHint: "Next: threats to internal validity (critical stage).",
  },
  {
    id: "validity",
    number: 6,
    title: "Threats to validity",
    shortTitle: "Validity",
    summary: "History, selection, maturation, instrumentation, regression…",
    learn: {
      why: "This is the heart of quasi-experimental literacy. Listing threats and mitigations is more honest than a p-value from a weak design.",
      concepts: [
        "History (concurrent events)",
        "Selection",
        "Maturation / secular trends",
        "Instrumentation",
        "Regression to the mean",
        "Attrition",
        "Contamination / spillover",
      ],
      commonMistakes: [
        "No threats section",
        "Only listing strengths",
        "Assuming ITS automatically fixes selection",
      ],
    },
    fields: [
      {
        key: "threats",
        label: "Main threats in your study (ranked)",
        type: "textarea",
        required: true,
      },
      {
        key: "mitigations",
        label: "Design/analysis mitigations",
        type: "textarea",
        required: true,
      },
      {
        key: "uncontrolled",
        label: "Threats you cannot fully control",
        type: "textarea",
        required: true,
      },
      {
        key: "robinsNote",
        label: "Link to ROBINS-I style domains (optional notes)",
        type: "textarea",
        placeholder: "Confounding, selection, deviations, missing data…",
      },
    ],
    teach: {
      explain: "Teach a junior the top 3 threats and how you address each.",
      reflectDecision: "Which threat most endangers your causal claim?",
      reflectUncertain: "What additional data would reduce that threat?",
    },
    nextHint: "Next: analysis plan matched to the design.",
  },
  {
    id: "analysis",
    number: 7,
    title: "Analysis plan",
    shortTitle: "Analysis",
    summary: "Models for BA/CBA/ITS/DiD; sensitivity analyses.",
    learn: {
      why: "Analysis must match design assumptions. ITS needs enough time points; DiD needs pre-trends discussion; simple t-tests on before–after are often insufficient.",
      concepts: [
        "Segmented regression for ITS",
        "Interaction terms for DiD",
        "Clustered SEs if units are clusters",
        "Sensitivity and falsification tests",
      ],
      commonMistakes: [
        "Ignoring autocorrelation in time series",
        "No pre-trend check for DiD",
        "Overfitting many covariates post hoc",
      ],
    },
    fields: [
      {
        key: "primaryAnalysis",
        label: "Primary analysis",
        type: "textarea",
        required: true,
      },
      {
        key: "sensitivity",
        label: "Sensitivity / falsification tests",
        type: "textarea",
        required: true,
      },
      {
        key: "software",
        label: "Software",
        type: "text",
        placeholder: "R / Stata / Python…",
      },
      {
        key: "sampleSize",
        label: "Power / precision notes",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Which statistic answers the evaluation question in plain language?",
      reflectDecision: "Why this model fits your design type?",
      reflectUncertain: "What sensitivity result would worry you?",
    },
    nextHint: "Next: ethics and data access.",
  },
  {
    id: "ethics",
    number: 8,
    title: "Ethics & governance",
    shortTitle: "Ethics",
    summary: "Approvals, service evaluation vs research, data use.",
    learn: {
      why: "Quality-improvement and policy evaluations still need governance. Clarify research vs audit pathways in your institution.",
      concepts: [
        "IRB vs service evaluation",
        "Consent when using routine data",
        "Data sharing with policymakers",
      ],
      commonMistakes: [
        "Skipping approvals because ‘it’s QI’",
        "Identifiable dashboards shared widely",
        "No pre-registration when claiming confirmatory evaluation",
      ],
    },
    fields: [
      {
        key: "ethicsStatus",
        label: "Ethics / governance status",
        type: "select",
        required: true,
        options: [
          { value: "approved", label: "Approved / registered QI pathway" },
          { value: "submitted", label: "Submitted / pending" },
          { value: "planned", label: "Planned" },
          { value: "na", label: "Not required (justify carefully)" },
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
        label: "Privacy & data access controls",
        type: "textarea",
        required: true,
      },
    ],
    teach: {
      explain: "Is this research or service evaluation in your setting — and why?",
      reflectDecision: "What data will never leave the secure environment?",
      reflectUncertain: "Do you need public pre-registration?",
    },
    nextHint: "Next: reporting checklist and export.",
  },
  {
    id: "reporting",
    number: 9,
    title: "Reporting & export",
    shortTitle: "Reporting",
    summary: "Transparent report of design, assumptions, limitations.",
    learn: {
      why: "TREND and related guidance emphasise transparent non-randomised intervention reporting. State assumptions and limitations as loudly as results.",
      concepts: [
        "Design named in title/abstract",
        "Assumptions and threats",
        "Cautious causal language",
      ],
      commonMistakes: [
        "RCT-level certainty language",
        "Hiding concurrent system changes",
        "No limitations section",
      ],
    },
    fields: [
      {
        key: "title",
        label: "Working title",
        type: "text",
        required: true,
        placeholder: "…: a quasi-experimental evaluation",
      },
      {
        key: "abstract",
        label: "Abstract skeleton",
        type: "textarea",
      },
      {
        key: "limitations",
        label: "Key limitations",
        type: "textarea",
        required: true,
      },
      {
        key: "gaps",
        label: "Gaps before analysis / write-up",
        type: "textarea",
      },
    ],
    teach: {
      explain: "Pitch findings language that does not overclaim causality.",
      reflectDecision: "Which checklist items are still incomplete?",
      reflectUncertain: "What would a methods reviewer attack first?",
    },
    nextHint: "Export and review threats with a supervisor before claiming impact.",
  },
];

export function getQuasiStage(id: QuasiStageId): QuasiStageDef {
  const s = QUASI_STAGES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown quasi stage ${id}`);
  return s;
}

export function getNextQuasiStage(id: QuasiStageId): QuasiStageDef | null {
  const i = QUASI_STAGE_ORDER.indexOf(id);
  if (i < 0 || i >= QUASI_STAGE_ORDER.length - 1) return null;
  return getQuasiStage(QUASI_STAGE_ORDER[i + 1]);
}

export function getPrevQuasiStage(id: QuasiStageId): QuasiStageDef | null {
  const i = QUASI_STAGE_ORDER.indexOf(id);
  if (i <= 0) return null;
  return getQuasiStage(QUASI_STAGE_ORDER[i - 1]);
}

/** Educational TREND / quasi reporting checklist */
export const TREND_QUASI_ITEMS: {
  id: string;
  label: string;
  section: string;
}[] = [
  { id: "t1", section: "Title", label: "Non-randomised / quasi design indicated in title or abstract" },
  { id: "t2", section: "Background", label: "Rationale and why randomisation not used" },
  { id: "t3", section: "Design", label: "Specific quasi design named (BA, CBA, ITS, DiD…)" },
  { id: "t4", section: "Participants", label: "Eligibility and how units assigned to intervention" },
  { id: "t5", section: "Intervention", label: "Intervention components, timing, fidelity" },
  { id: "t6", section: "Outcomes", label: "Primary/secondary outcomes pre-specified and defined" },
  { id: "t7", section: "Sample size", label: "Sample size / power or precision considerations" },
  { id: "t8", section: "Assignment", label: "Method of assignment and comparison strategy" },
  { id: "t9", section: "Blinding", label: "Blinding (if any) or why not feasible" },
  { id: "t10", section: "Statistics", label: "Analysis matched to design; clustering handled if needed" },
  { id: "t11", section: "Threats", label: "Threats to validity and mitigations discussed" },
  { id: "t12", section: "Limitations", label: "Limitations and cautious interpretation of causality" },
];

const STORAGE_KEY = "evidenceflow_quasi_projects_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function readAll(): QuasiProject[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QuasiProject[];
  } catch {
    return [];
  }
}

function writeAll(projects: QuasiProject[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function listQuasiProjects(): QuasiProject[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getQuasiProject(id: string): QuasiProject | null {
  return readAll().find((p) => p.id === id) ?? null;
}

export function createQuasiProject(title: string): QuasiProject {
  const now = new Date().toISOString();
  const project: QuasiProject = {
    id: crypto.randomUUID(),
    title: title.trim() || "Untitled quasi-experimental evaluation",
    createdAt: now,
    updatedAt: now,
    currentStage: "question",
    stages: createEmptyQuasiStages(),
  };
  const all = readAll();
  all.push(project);
  writeAll(all);
  return project;
}

export function updateQuasiProject(project: QuasiProject): QuasiProject {
  const all = readAll();
  const next = { ...project, updatedAt: new Date().toISOString() };
  const idx = all.findIndex((p) => p.id === project.id);
  if (idx === -1) all.push(next);
  else all[idx] = next;
  writeAll(all);
  return next;
}

export function deleteQuasiProject(id: string) {
  writeAll(readAll().filter((p) => p.id !== id));
}

export function saveQuasiStageData(
  projectId: string,
  stageId: QuasiStageId,
  data: Record<string, unknown>,
  extras?: Partial<Pick<QuasiStageProgress, "status" | "lessonRead">>
): QuasiProject | null {
  const project = getQuasiProject(projectId);
  if (!project) return null;
  const prev = project.stages[stageId];
  const merged: QuasiStageProgress = {
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
  return updateQuasiProject(project);
}

export function markQuasiStageComplete(
  projectId: string,
  stageId: QuasiStageId
): QuasiProject | null {
  const project = getQuasiProject(projectId);
  if (!project) return null;
  project.stages[stageId] = {
    ...project.stages[stageId],
    status: "complete",
    lessonRead: true,
  };
  const idx = QUASI_STAGE_ORDER.indexOf(stageId);
  if (idx >= 0 && idx < QUASI_STAGE_ORDER.length - 1) {
    project.currentStage = QUASI_STAGE_ORDER[idx + 1];
  }
  return updateQuasiProject(project);
}

export function computeQuasiProgress(project: QuasiProject) {
  const total = QUASI_STAGE_ORDER.length;
  const completed = QUASI_STAGE_ORDER.filter(
    (id) => project.stages[id]?.status === "complete"
  ).length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

export function buildQuasiExportMarkdown(project: QuasiProject): string {
  const lines: string[] = [
    `# ${project.title}`,
    ``,
    `> Quasi-experimental evaluation draft — EvidenceFlow educational export`,
    `> Generated ${new Date().toISOString().slice(0, 10)}`,
    ``,
  ];
  for (const id of QUASI_STAGE_ORDER) {
    const def = getQuasiStage(id);
    const data = project.stages[id]?.data || {};
    lines.push(`## ${def.number}. ${def.title}`, "");
    for (const f of def.fields) {
      lines.push(`### ${f.label}`, "", String(data[f.key] ?? "—"), "");
    }
  }
  const checks = (() => {
    const raw = project.stages.reporting?.data?._trendChecks;
    return Array.isArray(raw) ? raw.map(String) : [];
  })();
  lines.push("## TREND / quasi reporting checklist (educational)", "");
  for (const item of TREND_QUASI_ITEMS) {
    lines.push(`- [${checks.includes(item.id) ? "x" : " "}] ${item.label}`);
  }
  lines.push(
    "",
    "---",
    "*Educational draft only. Causal claims from quasi designs require careful assumptions.*"
  );
  return lines.join("\n");
}

export function getExampleQuasiProject(): QuasiProject {
  const stages = createEmptyQuasiStages();
  const fill = (id: QuasiStageId, data: Record<string, unknown>) => {
    stages[id] = { status: "complete", lessonRead: true, data };
  };
  fill("question", {
    topic: "Hospital hand-hygiene campaign and healthcare-associated infections",
    question:
      "Did introducing a multimodal hand-hygiene campaign reduce monthly HAI rates on medical wards compared with the pre-campaign period, accounting for trends?",
    whyNotRct:
      "Hospital-wide safety policy; randomising wards delayed for operational reasons (example).",
    primaryOutcome: "Monthly HAI rate per 1,000 patient-days",
  });
  fill("design", {
    designType: "its",
    designRationale:
      "Monthly rates available for 18 pre and 12 post months; campaign start date known — ITS suitable.",
    timePoints: "Pre: months −18 to −1; intervention month 0; post: +1 to +12",
    unit: "Ward-month rates aggregated to hospital medical service",
  });
  fill("intervention", {
    components:
      "Education, alcohol gel access, audit-feedback, leadership walk-rounds",
    start: "Campaign launch date defined as month 0; 4-week roll-out",
    fidelity: "Monthly compliance audits; % opportunities met",
    cointerventions: "No other major infection-control policy that month (document)",
  });
  fill("comparison", {
    control: "Pre-intervention time series (same wards) as primary counterfactual",
    assignment: "Policy applied hospital-wide (no concurrent control wards in example)",
    balance: "Case-mix indices monitored; seasonal patterns modelled",
    assumptions: "No simultaneous shock at month 0; stable outcome coding",
  });
  fill("outcomes", {
    primary: "Lab-confirmed HAI rate per 1,000 patient-days (stable case definition)",
    secondary: "Hand-hygiene compliance %; MRSA bacteraemia",
    dataSource: "Infection control database + occupancy denominators",
    stability: "Same HAI definition across pre/post; coding audit sample",
  });
  fill("validity", {
    threats:
      "1) Concurrent IPC changes 2) Seasonal infection trends 3) Detection bias if surveillance intensified",
    mitigations:
      "Document co-interventions; include seasonality terms; compliance as process check",
    uncontrolled: "Unmeasured patient mix shifts; single-site generalisability",
    robinsNote: "Confounding by time; selection less central for ITS on whole service",
  });
  fill("analysis", {
    primaryAnalysis:
      "Segmented regression ITS: level and slope change at month 0; Newey–West SEs",
    sensitivity: "Exclude COVID months if any; alternate lag; ward-level GEE",
    software: "R",
    sampleSize: "18 pre / 12 post months — limited power for small effects (note)",
  });
  fill("ethics", {
    ethicsStatus: "planned",
    consent: "Aggregate QI data; waiver pathway per institution (example)",
    privacy: "No patient-level export; aggregate rates only",
  });
  fill("reporting", {
    title:
      "Impact of a hand-hygiene campaign on HAI rates: an interrupted time-series evaluation (example)",
    abstract:
      "Background… Design: ITS… Intervention… Outcomes… Limitations: non-randomised…",
    limitations:
      "Single centre; possible concurrent changes; ecological rates not patient-level causal proof.",
    gaps: "Example only.",
    _trendChecks: TREND_QUASI_ITEMS.map((i) => i.id),
  });

  return {
    id: "example-quasi",
    title: "Example: Hand-hygiene campaign (ITS quasi-experiment)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: "reporting",
    stages,
  };
}
