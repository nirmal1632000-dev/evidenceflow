import type { Project, StageDefinition, StageId, StageProgress } from "./types";
import { PROCESS_STEPS } from "./process-steps";
import { parseStudies, studiesToMarkdownTable } from "./studies";

export const STAGE_ORDER: StageId[] = [
  "question",
  "eligibility",
  "protocol",
  "search",
  "screening",
  "extraction",
  "rob",
  "synthesis",
  "metaanalysis",
  "grade",
  "reporting",
];

export function createEmptyStages(): Record<StageId, StageProgress> {
  const stages = {} as Record<StageId, StageProgress>;
  for (const id of STAGE_ORDER) {
    stages[id] = {
      status: "not_started",
      lessonRead: false,
      data: {},
    };
  }
  return stages;
}

export const STAGES: StageDefinition[] = [
  {
    id: "question",
    number: 1,
    title: "Research question (PICO)",
    shortTitle: "Question",
    summary: "Turn a vague topic into a focused, answerable review question.",
    learn: {
      why: "A vague question produces an unfocused search, inconsistent inclusion decisions, and results you cannot interpret. PICO forces precision before you invest weeks of work.",
      concepts: [
        "PICO: Population, Intervention, Comparator, Outcomes (add Study design when useful → PICOS).",
        "Primary vs secondary outcomes: pre-specify what matters most; avoid fishing for significance later.",
        "Scope: one clear question beats three half-answered questions for a first review.",
        "Feasibility: if thousands of trials exist, narrow population, setting, or intervention.",
      ],
      commonMistakes: [
        "Starting the search before writing PICO and eligibility criteria.",
        "Outcomes that are not measurable or not reported in primary studies.",
        "Mixing too many interventions without a clear comparison structure.",
      ],
      timeEstimate: "30–90 minutes",
    },
    fields: [
      {
        key: "topic",
        label: "Working topic (plain language)",
        type: "textarea",
        placeholder: "e.g. Does mindfulness reduce anxiety in university students?",
        required: true,
      },
      {
        key: "population",
        label: "P — Population",
        type: "textarea",
        placeholder: "Who? Age, condition, setting, geography…",
        required: true,
        help: "Be specific enough that two reviewers would agree who belongs.",
      },
      {
        key: "intervention",
        label: "I — Intervention / Exposure",
        type: "textarea",
        placeholder: "What is being tested or delivered?",
        required: true,
      },
      {
        key: "comparator",
        label: "C — Comparator",
        type: "textarea",
        placeholder: "Usual care, placebo, another active treatment, no treatment…",
        required: true,
      },
      {
        key: "outcomes",
        label: "O — Outcomes (primary first)",
        type: "textarea",
        placeholder: "Primary: … Secondary: … Time points if known.",
        required: true,
      },
      {
        key: "studyDesign",
        label: "S — Preferred study designs",
        type: "select",
        options: [
          { value: "rct", label: "RCTs only (recommended for first intervention SR)" },
          { value: "rct_quasi", label: "RCTs + quasi-experimental" },
          { value: "any_comparative", label: "Any comparative studies" },
          { value: "mixed", label: "Mixed / not sure yet" },
        ],
        required: true,
      },
      {
        key: "reviewQuestion",
        label: "Full review question (one sentence)",
        type: "textarea",
        placeholder:
          "In [P], what is the effect of [I] compared with [C] on [O]?",
        required: true,
      },
    ],
    software: [
      {
        name: "Plain notes / this workspace",
        free: true,
        when: "Draft PICO here first — no special software needed.",
      },
      {
        name: "Cochrane PICO search (browser)",
        free: true,
        when: "Explore how others framed similar questions.",
        url: "https://www.cochranelibrary.com/",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "What does the O in PICO stand for?",
        options: ["Organization", "Outcomes", "Observation period", "Odds ratio"],
        correctIndex: 1,
        explanation: "Outcomes are the endpoints you care about measuring.",
      },
      {
        id: "q2",
        question: "Why pre-specify a primary outcome?",
        options: [
          "Journals require exactly one outcome",
          "To reduce selective reporting and focus the synthesis",
          "Meta-analysis only works with one outcome",
          "It replaces the need for a protocol",
        ],
        correctIndex: 1,
        explanation:
          "Pre-specification reduces bias from choosing outcomes after seeing results.",
      },
    ],
    nextHint: "Next: turn PICO into inclusion/exclusion rules two reviewers can apply.",
  },
  {
    id: "eligibility",
    number: 2,
    title: "Eligibility criteria",
    shortTitle: "Eligibility",
    summary: "Write inclusion and exclusion rules that make screening reproducible.",
    learn: {
      why: "Eligibility criteria operationalize your question. Without them, screening becomes subjective and your review cannot be replicated.",
      concepts: [
        "Inclusion vs exclusion: state who is in; exclusions clarify edge cases.",
        "Study design, language, publication status, and date limits are eligibility decisions — document them.",
        "Outcomes: require that studies report (or allow calculation of) your primary outcomes if you plan meta-analysis.",
        "Grey literature: decide upfront whether theses, conference abstracts, and registries are eligible.",
      ],
      commonMistakes: [
        "Criteria that only exist in your head, not on paper.",
        "Excluding non-English without justification (possible language bias).",
        "Changing criteria after seeing which papers help your preferred conclusion.",
      ],
      timeEstimate: "45–120 minutes",
    },
    fields: [
      {
        key: "inclusion",
        label: "Inclusion criteria",
        type: "textarea",
        placeholder: "List bullets: population, intervention, comparator, outcomes, design…",
        required: true,
      },
      {
        key: "exclusion",
        label: "Exclusion criteria",
        type: "textarea",
        placeholder: "e.g. animal studies, single-arm, wrong intervention, no usable data…",
        required: true,
      },
      {
        key: "languages",
        label: "Language limits",
        type: "text",
        placeholder: "e.g. English only / no language restriction",
        required: true,
      },
      {
        key: "dateLimits",
        label: "Date limits",
        type: "text",
        placeholder: "e.g. no limit / 2010–present",
      },
      {
        key: "publicationStatus",
        label: "Publication status",
        type: "select",
        options: [
          { value: "peer_reviewed", label: "Peer-reviewed only" },
          { value: "include_grey", label: "Include grey literature" },
          { value: "undecided", label: "Undecided — need advice" },
        ],
      },
      {
        key: "edgeCases",
        label: "Edge cases & decision rules",
        type: "textarea",
        placeholder: "How will you handle multi-arm trials, crossover, cluster RCTs, mixed populations?",
      },
    ],
    software: [
      {
        name: "Shared doc (Google Docs / Word)",
        free: true,
        when: "Keep a living eligibility sheet both reviewers use during screening.",
      },
    ],
    quiz: [
      {
        id: "e1",
        question: "Eligibility criteria should be defined…",
        options: [
          "After full-text screening",
          "Before screening, in the protocol",
          "Only if doing meta-analysis",
          "By the journal after acceptance",
        ],
        correctIndex: 1,
        explanation: "Pre-specify criteria in the protocol to reduce bias.",
      },
    ],
    nextHint: "Next: lock methods into a protocol before you search at scale.",
  },
  {
    id: "protocol",
    number: 3,
    title: "Protocol & registration",
    shortTitle: "Protocol",
    summary: "Pre-specify methods and plan registration (e.g. PROSPERO).",
    learn: {
      why: "A protocol is your contract with future-you and readers. It documents planned methods so post-hoc changes are visible and justified.",
      concepts: [
        "PRISMA-P: guidance for writing systematic review protocols.",
        "PROSPERO: free registry for ongoing health-related SRs (check eligibility).",
        "Pre-specify: search approach, screening process, RoB tool, effect measures, MA model, subgroups, sensitivity analyses.",
        "Amendments: if you change methods later, document what changed and why.",
      ],
      commonMistakes: [
        "Registering after screening is finished (undermines the point).",
        "Protocol that only restates the question with no methods detail.",
        "Never looking at the protocol again once written.",
      ],
      timeEstimate: "1–3 days (first protocol)",
    },
    fields: [
      {
        key: "objectives",
        label: "Objectives",
        type: "textarea",
        required: true,
        placeholder: "Primary objective… Secondary objectives…",
      },
      {
        key: "methodsSummary",
        label: "Methods summary",
        type: "textarea",
        required: true,
        placeholder: "Search sources, screening (dual?), extraction, RoB, synthesis plan…",
      },
      {
        key: "effectMeasure",
        label: "Planned effect measure(s)",
        type: "text",
        placeholder: "e.g. mean difference / SMD / risk ratio",
      },
      {
        key: "maPlan",
        label: "Meta-analysis plan (if applicable)",
        type: "textarea",
        placeholder: "Random-effects? Heterogeneity stats? Subgroups? When NOT to pool?",
      },
      {
        key: "prosperoId",
        label: "PROSPERO / registry ID (or status)",
        type: "text",
        placeholder: "e.g. CRD420… or 'drafting' / 'not eligible'",
      },
      {
        key: "team",
        label: "Team roles",
        type: "textarea",
        placeholder: "Who searches, screens, extracts, resolves conflicts, stats?",
      },
    ],
    software: [
      {
        name: "PROSPERO",
        free: true,
        when: "Register eligible health SRs before screening completion.",
        url: "https://www.crd.york.ac.uk/prospero/",
      },
      {
        name: "OSF",
        free: true,
        when: "Open protocol + materials if PROSPERO is not suitable.",
        url: "https://osf.io/",
      },
    ],
    quiz: [
      {
        id: "p1",
        question: "Main purpose of registering a protocol is to…",
        options: [
          "Guarantee journal acceptance",
          "Increase transparency and reduce reporting bias",
          "Replace peer review",
          "Automate the literature search",
        ],
        correctIndex: 1,
        explanation: "Registration timestamps planned methods and reduces undisclosed changes.",
      },
    ],
    nextHint: "Next: design a comprehensive, reproducible search strategy.",
  },
  {
    id: "search",
    number: 4,
    title: "Search strategy",
    shortTitle: "Search",
    summary: "Plan databases, search strings, and documentation for reproducibility.",
    learn: {
      why: "Your conclusions are only as good as the evidence you find. A weak search misses studies and can bias the review.",
      concepts: [
        "Multiple databases: e.g. MEDLINE/PubMed, Embase, CENTRAL, topic-specific (PsycINFO, CINAHL).",
        "Structure: concept blocks from PICO + controlled vocabulary (MeSH/Emtree) + free-text synonyms + Boolean logic.",
        "Grey literature & trials registries (ClinicalTrials.gov, WHO ICTRP) when relevant.",
        "PRESS: peer review of electronic search strategies improves quality.",
        "Document: date run, platform, full string per database, results counts.",
      ],
      commonMistakes: [
        "Searching only PubMed and calling it comprehensive.",
        "No synonyms / no controlled vocabulary.",
        "Not saving the exact string and hit counts.",
      ],
      timeEstimate: "Several days with librarian help ideal",
    },
    fields: [
      {
        key: "databases",
        label: "Databases & sources planned",
        type: "textarea",
        required: true,
        placeholder: "MEDLINE, Embase, CENTRAL, PsycINFO, registries, grey lit…",
      },
      {
        key: "conceptBlocks",
        label: "Search concept blocks",
        type: "textarea",
        required: true,
        placeholder: "Block 1 (P): …\nBlock 2 (I): …\nBlock 3 (optional study filter): …",
      },
      {
        key: "sampleString",
        label: "Draft search string (main database)",
        type: "textarea",
        placeholder: "Paste a draft PubMed/MEDLINE string here",
      },
      {
        key: "filters",
        label: "Filters & limits applied",
        type: "textarea",
        placeholder: "Humans, date, language, RCT filters — justify each",
      },
      {
        key: "peerReview",
        label: "Search peer review plan",
        type: "text",
        placeholder: "Who will PRESS-review the strategy?",
      },
      {
        key: "searchLog",
        label: "Search run log",
        type: "textarea",
        placeholder: "Date | Database | Hits | Notes",
      },
    ],
    software: [
      {
        name: "Zotero",
        free: true,
        when: "Collect records, attach PDFs, manage citations.",
        url: "https://www.zotero.org/",
      },
      {
        name: "PubMed / Ovid / Embase platforms",
        free: true,
        when: "Run and refine database searches (access varies by institution).",
      },
      {
        name: "Polyglot / SR-Accelerator tools",
        free: true,
        when: "Translate search strings across databases (validate carefully).",
        url: "https://sr-accelerator.com/",
      },
    ],
    quiz: [
      {
        id: "s1",
        question: "Why use more than one bibliographic database?",
        options: [
          "Journals require exactly three",
          "Coverage differs; single-database searches miss studies",
          "It automatically removes duplicates",
          "It replaces full-text screening",
        ],
        correctIndex: 1,
        explanation: "Databases index different journals and records; multi-source search is standard.",
      },
    ],
    nextHint: "Next: de-duplicate and screen records systematically.",
  },
  {
    id: "screening",
    number: 5,
    title: "Screening & study selection",
    shortTitle: "Screening",
    summary: "Title/abstract and full-text screening with dual review and PRISMA counts.",
    learn: {
      why: "Selection bias sneaks in when one person decides inclusion ad hoc. Structured dual screening and documented reasons protect validity.",
      concepts: [
        "Two stages: title/abstract then full text.",
        "Dual independent screening ideal; resolve conflicts by discussion or third reviewer.",
        "Pilot on 50–100 records to calibrate criteria.",
        "PRISMA flow: identified → duplicates removed → screened → full text assessed → included, with exclusion reasons at full text.",
        "Inter-rater agreement (e.g. kappa) is optional but useful in training.",
      ],
      commonMistakes: [
        "Excluding studies only because the abstract is unclear — get full text.",
        "Not recording why full texts were excluded.",
        "Single reviewer with no calibration for a high-stakes review.",
      ],
      timeEstimate: "Days to weeks depending on volume",
    },
    fields: [
      {
        key: "identified",
        label: "Records identified (all sources)",
        type: "number",
        placeholder: "0",
      },
      {
        key: "duplicates",
        label: "Duplicates removed",
        type: "number",
        placeholder: "0",
      },
      {
        key: "titleAbstractScreened",
        label: "Title/abstract screened",
        type: "number",
        placeholder: "0",
      },
      {
        key: "fullTextAssessed",
        label: "Full texts assessed",
        type: "number",
        placeholder: "0",
      },
      {
        key: "included",
        label: "Studies included",
        type: "number",
        placeholder: "0",
      },
      {
        key: "reviewer1",
        label: "Reviewer 1 (screening)",
        type: "text",
        placeholder: "Name / initials",
      },
      {
        key: "reviewer2",
        label: "Reviewer 2 (screening)",
        type: "text",
        placeholder: "Name / initials",
      },
      {
        key: "conflictsCount",
        label: "Title/abstract conflicts (count)",
        type: "number",
        placeholder: "How many dual-screen disagreements?",
      },
      {
        key: "conflictLog",
        label: "Conflict log (key disagreements)",
        type: "textarea",
        placeholder:
          "Record ID / reason R1 include R2 exclude → resolution (include FT / exclude / third reviewer)…",
        help: "You do not need every trivial conflict — document patterns and hard cases.",
      },
      {
        key: "exclusionReasons",
        label: "Full-text exclusion reasons (counts)",
        type: "textarea",
        placeholder: "Wrong population: n=\nWrong intervention: n=\nNot RCT: n=\nNo usable outcome: n=",
      },
      {
        key: "processNotes",
        label: "Process notes",
        type: "textarea",
        placeholder: "Dual review? Pilot size? Software used? How conflicts resolved?",
      },
    ],
    software: [
      {
        name: "Rayyan",
        free: true,
        when: "Collaborative title/abstract screening (free tier popular with students).",
        url: "https://www.rayyan.ai/",
      },
      {
        name: "ASReview",
        free: true,
        when: "AI-aided prioritization of screening (human decides; validate carefully).",
        url: "https://asreview.nl/",
      },
      {
        name: "Covidence",
        free: false,
        when: "Institutional gold standard for screening + extraction workflows.",
        url: "https://www.covidence.org/",
      },
    ],
    quiz: [
      {
        id: "sc1",
        question: "At which stage should you record detailed exclusion reasons for PRISMA?",
        options: [
          "Database identification only",
          "Full-text assessment",
          "After meta-analysis",
          "Never — only total counts matter",
        ],
        correctIndex: 1,
        explanation: "PRISMA expects reasons for excluding full-text reports.",
      },
    ],
    nextHint: "Next: extract study characteristics and outcome data into structured tables.",
  },
  {
    id: "extraction",
    number: 6,
    title: "Data extraction",
    shortTitle: "Extraction",
    summary: "Collect study methods, participants, interventions, and outcome data reliably.",
    learn: {
      why: "Garbage-in, garbage-out: meta-analysis quality depends on accurate extraction. Dual extraction reduces errors.",
      concepts: [
        "Pilot your extraction form on 2–3 studies.",
        "Capture: citation, design, N, population, intervention details, comparator, outcomes, time points, funding, conflicts.",
        "For MA: effect estimates, SEs/CIs, or raw data (means/SD/n or events/n).",
        "Unit conversion and direction of scales (higher = better or worse?).",
        "Contact authors for missing critical data when feasible.",
      ],
      commonMistakes: [
        "Extracting only p-values without effect sizes.",
        "Mixing intention-to-treat and per-protocol without noting it.",
        "Not tracking which arm is intervention vs control.",
      ],
      timeEstimate: "1–3 hours per study (first reviews slower)",
    },
    fields: [
      {
        key: "formFields",
        label: "Extraction form fields (your template)",
        type: "textarea",
        required: true,
        placeholder: "List columns you will extract…",
      },
      {
        key: "studiesList",
        label: "Included studies log",
        type: "textarea",
        placeholder: "Author year | N | Design | Country | Notes",
      },
      {
        key: "outcomeDataNotes",
        label: "Outcome data notes",
        type: "textarea",
        placeholder: "Which outcomes extractable? Missing data plan?",
      },
      {
        key: "dualExtraction",
        label: "Dual extraction process",
        type: "textarea",
        placeholder: "Independent dual extract? Spot-check %? Conflict resolution?",
      },
    ],
    software: [
      {
        name: "Spreadsheet (Excel / Google Sheets)",
        free: true,
        when: "Simple, transparent extraction tables for small reviews.",
      },
      {
        name: "Covidence / DistillerSR",
        free: false,
        when: "Structured forms and audit trails for larger teams.",
      },
      {
        name: "RevMan Web",
        free: true,
        when: "Enter comparison data for Cochrane-style analyses.",
        url: "https://revman.cochrane.org/",
      },
    ],
    quiz: [
      {
        id: "x1",
        question: "For a continuous outcome meta-analysis you typically need…",
        options: [
          "Only the p-value",
          "Mean, SD (or SE), and n per group (or MD/SMD with SE)",
          "Only the study abstract",
          "Only the risk of bias rating",
        ],
        correctIndex: 1,
        explanation: "Pooling continuous outcomes needs effect size information, not p alone.",
      },
    ],
    nextHint: "Next: assess risk of bias in included studies with an appropriate tool.",
  },
  {
    id: "rob",
    number: 7,
    title: "Risk of bias assessment",
    shortTitle: "Risk of bias",
    summary: "Judge internal validity using a design-appropriate RoB tool.",
    learn: {
      why: "Even a perfect search cannot fix biased primary studies. RoB assessment informs interpretation, GRADE, and sensitivity analyses.",
      concepts: [
        "RoB 2 for randomized trials (domains: randomization, deviations, missing data, measurement, selection of reported result).",
        "ROBINS-I for non-randomized interventions.",
        "Judge by outcome where required — bias can differ by endpoint.",
        "Two reviewers recommended; justify ratings with quotes/page notes.",
        "Visualization: traffic-light / summary plots (e.g. robvis).",
      ],
      commonMistakes: [
        "Using a quality 'score' that hides critical flaws.",
        "Rating based on writing quality, not bias risk.",
        "Skipping RoB because all studies are 'published in good journals'.",
      ],
      timeEstimate: "30–90 min per study after practice",
    },
    fields: [
      {
        key: "tool",
        label: "RoB tool selected",
        type: "select",
        options: [
          { value: "rob2", label: "RoB 2 (RCTs)" },
          { value: "robins_i", label: "ROBINS-I (non-randomized)" },
          { value: "quadas2", label: "QUADAS-2 (diagnostic)" },
          { value: "other", label: "Other / mixed" },
        ],
        required: true,
      },
      {
        key: "process",
        label: "Assessment process",
        type: "textarea",
        placeholder: "Dual assessors? Training? How disagreements resolved?",
      },
      {
        key: "summary",
        label: "Summary of RoB findings",
        type: "textarea",
        placeholder: "Which domains most problematic? Which studies high risk?",
      },
      {
        key: "sensitivityPlan",
        label: "How RoB will affect analysis",
        type: "textarea",
        placeholder: "e.g. sensitivity analysis excluding high-risk studies",
      },
    ],
    software: [
      {
        name: "RoB 2 tool / Excel templates",
        free: true,
        when: "Official guidance and worksheets for domain judgments.",
        url: "https://www.riskofbias.info/",
      },
      {
        name: "robvis",
        free: true,
        when: "Create risk-of-bias traffic-light plots.",
        url: "https://www.riskofbias.info/welcome/robvis-visualization-tool",
      },
    ],
    quiz: [
      {
        id: "r1",
        question: "RoB 2 is primarily designed for…",
        options: [
          "Diagnostic accuracy studies",
          "Randomized trials",
          "Animal studies only",
          "Qualitative interviews",
        ],
        correctIndex: 1,
        explanation: "RoB 2 assesses risk of bias in randomized trials.",
      },
    ],
    nextHint: "Next: decide whether narrative synthesis, meta-analysis, or both fit your data.",
  },
  {
    id: "synthesis",
    number: 8,
    title: "Synthesis decision",
    shortTitle: "Synthesis",
    summary: "Choose narrative synthesis and/or quantitative meta-analysis thoughtfully.",
    learn: {
      why: "Not every dataset should be pooled. Inappropriate meta-analysis can mislead more than a careful narrative synthesis.",
      concepts: [
        "Can you pool? Similar PICO, comparable outcomes, extractable effects.",
        "Clinical heterogeneity vs statistical heterogeneity.",
        "Structured narrative synthesis: organize by outcome, population, or intervention features — not study-by-study storytelling only.",
        "Pre-specified decision rules beat post-hoc convenience.",
      ],
      commonMistakes: [
        "Pooling obviously different interventions just because software allows it.",
        "Ignoring direction of effect scales.",
        "Narrative review that merely lists abstracts without synthesis.",
      ],
      timeEstimate: "Half day of careful decision + table building",
    },
    fields: [
      {
        key: "approach",
        label: "Primary synthesis approach",
        type: "select",
        options: [
          { value: "narrative", label: "Narrative synthesis only" },
          { value: "ma", label: "Meta-analysis (pairwise)" },
          { value: "both", label: "Both (MA where possible + narrative)" },
          { value: "insufficient", label: "Insufficient data — descriptive only" },
        ],
        required: true,
      },
      {
        key: "comparability",
        label: "Why studies are / are not comparable",
        type: "textarea",
        required: true,
      },
      {
        key: "outcomesForMA",
        label: "Outcomes eligible for MA",
        type: "textarea",
        placeholder: "List outcomes with ≥2 studies and extractable data",
      },
      {
        key: "narrativeStructure",
        label: "Narrative structure plan",
        type: "textarea",
        placeholder: "By outcome? Population subgroup? Intervention intensity?",
      },
    ],
    software: [
      {
        name: "Evidence tables (Sheets/Word)",
        free: true,
        when: "Build summary tables before any pooling.",
      },
    ],
    quiz: [
      {
        id: "sy1",
        question: "You should avoid meta-analysis when…",
        options: [
          "You have more than 10 studies",
          "Studies are too clinically diverse to answer one question meaningfully",
          "Heterogeneity I² is exactly 0%",
          "You used Rayyan for screening",
        ],
        correctIndex: 1,
        explanation: "Clinical diversity can make a pooled estimate uninterpretable.",
      },
    ],
    nextHint: "Next: if pooling, run and interpret the meta-analysis carefully.",
  },
  {
    id: "metaanalysis",
    number: 9,
    title: "Meta-analysis",
    shortTitle: "Meta-analysis",
    summary: "Choose effect measures, models, and interpret heterogeneity and bias.",
    learn: {
      why: "Meta-analysis can increase precision and summarize effects — or produce a precise wrong answer if misused.",
      concepts: [
        "Effect measures: RR/OR/RD (binary); MD/SMD (continuous); HR (time-to-event).",
        "Fixed-effect vs random-effects: random-effects often preferred when studies differ.",
        "Heterogeneity: Cochran’s Q, I², tau² — investigate, don’t only report a number.",
        "Forest plots: study effects + pooled estimate + CIs.",
        "Small-study / publication bias: funnel plots, careful interpretation with few studies.",
        "Subgroup and sensitivity analyses: pre-specify; treat as exploratory if not.",
      ],
      commonMistakes: [
        "Using SMD without understanding scale direction.",
        "Over-interpreting funnel plots with <10 studies.",
        "Running many subgroups until one is significant.",
      ],
      timeEstimate: "1–several days including learning software",
    },
    fields: [
      {
        key: "effectMeasure",
        label: "Effect measure used",
        type: "select",
        options: [
          { value: "md", label: "Mean difference (MD)" },
          { value: "smd", label: "Standardized mean difference (SMD)" },
          { value: "rr", label: "Risk ratio (RR)" },
          { value: "or", label: "Odds ratio (OR)" },
          { value: "rd", label: "Risk difference (RD)" },
          { value: "hr", label: "Hazard ratio (HR)" },
          { value: "na", label: "N/A — no MA" },
        ],
      },
      {
        key: "model",
        label: "Statistical model",
        type: "select",
        options: [
          { value: "random", label: "Random-effects" },
          { value: "fixed", label: "Fixed-effect / common-effect" },
          { value: "both", label: "Both (sensitivity)" },
          { value: "na", label: "N/A" },
        ],
      },
      {
        key: "softwareUsed",
        label: "Analysis software",
        type: "text",
        placeholder: "RevMan / R metafor / Stata / other",
      },
      {
        key: "results",
        label: "Pooled results (plain language + numbers)",
        type: "textarea",
        placeholder: "e.g. MD −3.2 (95% CI −5.1 to −1.3); I²=40%; k=6",
      },
      {
        key: "heterogeneityNotes",
        label: "Heterogeneity investigation",
        type: "textarea",
        placeholder: "Possible causes? Subgroups? Decision to pool?",
      },
      {
        key: "sensitivity",
        label: "Sensitivity analyses",
        type: "textarea",
        placeholder: "Exclude high RoB; alternate model; leave-one-out…",
      },
    ],
    software: [
      {
        name: "RevMan Web",
        free: true,
        when: "Friendly forest plots; great for first MAs.",
        url: "https://revman.cochrane.org/",
      },
      {
        name: "R packages meta / metafor",
        free: true,
        when: "Flexible, reproducible scripts for serious analysis.",
        url: "https://cran.r-project.org/package=metafor",
      },
      {
        name: "Stata / CMA",
        free: false,
        when: "Common in institutions with licenses.",
      },
    ],
    quiz: [
      {
        id: "m1",
        question: "I² approximately describes…",
        options: [
          "The risk of bias percentage",
          "The percentage of variability across studies due to heterogeneity rather than chance",
          "The pooled effect size",
          "Publication bias probability",
        ],
        correctIndex: 1,
        explanation: "I² quantifies inconsistency across study results (with caveats).",
      },
    ],
    nextHint: "Next: rate certainty of evidence (GRADE) and build Summary of Findings.",
  },
  {
    id: "grade",
    number: 10,
    title: "Certainty of evidence (GRADE)",
    shortTitle: "GRADE",
    summary: "Rate confidence in effect estimates and draft Summary of Findings.",
    learn: {
      why: "A pooled estimate without certainty rating leaves readers unsure whether to trust it. GRADE structures that judgment.",
      concepts: [
        "Start high for RCTs (typically), then downgrade for: risk of bias, inconsistency, indirectness, imprecision, publication bias.",
        "Upgrade rarely (large effect, dose-response) — mostly for non-randomized evidence contexts.",
        "Summary of Findings (SoF) table: outcomes, relative/absolute effects, certainty, comments.",
        "Certainty levels: high, moderate, low, very low — speak in plain language.",
      ],
      commonMistakes: [
        "Equating 'statistically significant' with high-certainty evidence.",
        "Not downgrading for serious imprecision (wide CIs crossing decision thresholds).",
        "One global grade for the whole review instead of per outcome.",
      ],
      timeEstimate: "Half day to learn + per-outcome judgments",
    },
    fields: [
      {
        key: "outcomesGraded",
        label: "Outcomes graded",
        type: "textarea",
        required: true,
        placeholder: "List critical and important outcomes",
      },
      {
        key: "certaintyRatings",
        label: "Certainty ratings & reasons",
        type: "textarea",
        placeholder: "Outcome A: LOW — downgraded for RoB and imprecision because…",
      },
      {
        key: "sofDraft",
        label: "Summary of Findings draft notes",
        type: "textarea",
        placeholder: "Absolute effects, baseline risks, key messages…",
      },
    ],
    software: [
      {
        name: "GRADEpro GDT",
        free: true,
        when: "Build SoF tables and export to Word/RevMan.",
        url: "https://www.gradepro.org/",
      },
    ],
    quiz: [
      {
        id: "g1",
        question: "Which is a standard GRADE domain for downgrading RCT evidence?",
        options: [
          "Journal impact factor",
          "Imprecision",
          "Author nationality",
          "Number of databases searched",
        ],
        correctIndex: 1,
        explanation: "Imprecision is one of the five main downgrade domains.",
      },
    ],
    nextHint: "Next: report transparently with PRISMA 2020 and export your package.",
  },
  {
    id: "reporting",
    number: 11,
    title: "Reporting (PRISMA) & export",
    shortTitle: "Reporting",
    summary: "Map your work to PRISMA 2020 and package outputs for writing.",
    learn: {
      why: "Transparent reporting lets readers judge trustworthiness and reproduce methods. PRISMA 2020 is the standard checklist for SRs.",
      concepts: [
        "PRISMA 2020 checklist + flow diagram.",
        "Report search fully (or provide appendix strings).",
        "Describe amendments to protocol.",
        "Share data/code when possible (OSF, GitHub).",
        "Write abstract structured; avoid spin in conclusions.",
      ],
      commonMistakes: [
        "Claiming PRISMA compliance without addressing checklist items.",
        "Hiding empty searches or excluded full texts.",
        "Overstating causal language when evidence is weak.",
      ],
      timeEstimate: "Parallel with manuscript writing",
    },
    fields: [
      {
        key: "title",
        label: "Working manuscript title",
        type: "text",
        placeholder: "…: a systematic review and meta-analysis",
      },
      {
        key: "prismaNotes",
        label: "PRISMA items still incomplete",
        type: "textarea",
        placeholder: "List gaps you still need to fill before submission",
      },
      {
        key: "limitations",
        label: "Key limitations",
        type: "textarea",
        required: true,
      },
      {
        key: "conclusions",
        label: "Balanced conclusions draft",
        type: "textarea",
        placeholder: "What can/cannot be concluded given certainty and RoB?",
      },
      {
        key: "dataSharing",
        label: "Data / materials sharing plan",
        type: "text",
        placeholder: "OSF link, appendix, upon request…",
      },
    ],
    software: [
      {
        name: "PRISMA 2020 checklist",
        free: true,
        when: "Map every item before submission.",
        url: "https://www.prisma-statement.org/",
      },
      {
        name: "Overleaf / Word",
        free: true,
        when: "Write the manuscript; keep this workspace as methods source of truth.",
      },
    ],
    quiz: [
      {
        id: "rep1",
        question: "PRISMA is primarily a…",
        options: [
          "Statistical test for heterogeneity",
          "Reporting guideline for systematic reviews",
          "Risk of bias tool for RCTs",
          "Database of registered protocols",
        ],
        correctIndex: 1,
        explanation: "PRISMA guides transparent reporting of systematic reviews.",
      },
    ],
    nextHint: "Export your project package and keep updating stages as the review evolves.",
  },
];

export function getStage(id: StageId): StageDefinition {
  const stage = STAGES.find((s) => s.id === id);
  if (!stage) throw new Error(`Unknown stage: ${id}`);
  return {
    ...stage,
    processSteps: stage.processSteps ?? PROCESS_STEPS[id] ?? [],
  };
}

export function getNextStage(id: StageId): StageDefinition | null {
  const idx = STAGE_ORDER.indexOf(id);
  if (idx < 0 || idx >= STAGE_ORDER.length - 1) return null;
  return getStage(STAGE_ORDER[idx + 1]);
}

export function getPrevStage(id: StageId): StageDefinition | null {
  const idx = STAGE_ORDER.indexOf(id);
  if (idx <= 0) return null;
  return getStage(STAGE_ORDER[idx - 1]);
}

export function buildProtocolMarkdown(project: Project): string {
  const q = project.stages.question.data;
  const e = project.stages.eligibility.data;
  const p = project.stages.protocol.data;
  const s = project.stages.search.data;
  const lines = [
    `# Protocol draft: ${project.title}`,
    ``,
    `> Generated by EvidenceFlow — educational draft, not a substitute for peer-reviewed methods advice.`,
    ``,
    `## Review question`,
    ``,
    String(q.reviewQuestion || q.topic || "_Not yet written_"),
    ``,
    `### PICO`,
    ``,
    `- **Population:** ${q.population || "—"}`,
    `- **Intervention:** ${q.intervention || "—"}`,
    `- **Comparator:** ${q.comparator || "—"}`,
    `- **Outcomes:** ${q.outcomes || "—"}`,
    `- **Study designs:** ${q.studyDesign || "—"}`,
    ``,
    `## Eligibility criteria`,
    ``,
    `### Inclusion`,
    ``,
    String(e.inclusion || "—"),
    ``,
    `### Exclusion`,
    ``,
    String(e.exclusion || "—"),
    ``,
    `- **Languages:** ${e.languages || "—"}`,
    `- **Date limits:** ${e.dateLimits || "—"}`,
    `- **Publication status:** ${e.publicationStatus || "—"}`,
    ``,
    `## Objectives & methods`,
    ``,
    String(p.objectives || "—"),
    ``,
    String(p.methodsSummary || "—"),
    ``,
    `- **Effect measure(s):** ${p.effectMeasure || "—"}`,
    `- **Registry:** ${p.prosperoId || "—"}`,
    ``,
    `### Meta-analysis plan`,
    ``,
    String(p.maPlan || "—"),
    ``,
    `### Team`,
    ``,
    String(p.team || "—"),
    ``,
    `## Search plan`,
    ``,
    `### Sources`,
    ``,
    String(s.databases || "—"),
    ``,
    `### Concept blocks`,
    ``,
    String(s.conceptBlocks || "—"),
    ``,
    `### Draft string`,
    ``,
    "```",
    String(s.sampleString || "—"),
    "```",
    ``,
    `---`,
    `*Update this draft as your EvidenceFlow project progresses.*`,
  ];
  return lines.join("\n");
}

export function buildFullExportMarkdown(project: Project): string {
  const sc = project.stages.screening?.data || {};
  const parts = [
    buildProtocolMarkdown(project),
    "",
    "## PRISMA flow numbers",
    "",
    `- Identified: ${sc.identified ?? "—"}`,
    `- Duplicates removed: ${sc.duplicates ?? "—"}`,
    `- Title/abstract screened: ${sc.titleAbstractScreened ?? "—"}`,
    `- Full texts assessed: ${sc.fullTextAssessed ?? "—"}`,
    `- Included: ${sc.included ?? "—"}`,
    "",
    "### Full-text exclusion reasons",
    "",
    String(sc.exclusionReasons || "—"),
    "",
    "### Screening conflict log",
    "",
    String(sc.conflictLog || "—"),
    "",
    "## Included studies table",
    "",
    studiesToMarkdownTable(parseStudies(project.stages.extraction?.data?._studies)),
    "",
    "## Stage snapshots",
    "",
  ];
  for (const id of STAGE_ORDER) {
    const def = getStage(id);
    const data = project.stages[id]?.data || {};
    parts.push(`### ${def.number}. ${def.title}`, "");
    parts.push(`Status: ${project.stages[id]?.status || "not_started"}`, "");
    if (data._teamNotes) {
      parts.push("**Team notes**", "", String(data._teamNotes), "");
    }
    for (const field of def.fields) {
      const val = data[field.key];
      parts.push(`**${field.label}**`, "", String(val ?? "—"), "");
    }
    // Teach / reflect answers
    if (
      data._reflectDecision ||
      data._reflectUncertain ||
      data._teachExplain ||
      data._teachPeer
    ) {
      parts.push("**Watch · Do · Teach reflections**", "");
      if (data._reflectDecision)
        parts.push("*Decision:*", String(data._reflectDecision), "");
      if (data._reflectUncertain)
        parts.push("*Uncertainty:*", String(data._reflectUncertain), "");
      if (data._teachExplain)
        parts.push("*Teach-back:*", String(data._teachExplain), "");
      if (data._teachPeer)
        parts.push("*Peer questions:*", String(data._teachPeer), "");
    }
  }
  return parts.join("\n");
}
