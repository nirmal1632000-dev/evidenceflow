import type { Project, StageId } from "./types";
import { STAGE_ORDER, getStage } from "./stages";
import { getExampleProject } from "./example-project";
import { computeReadiness } from "./readiness";

export type WdtMode = "watch" | "do";

export interface WatchFieldHighlight {
  fieldKey: string;
  label: string;
  /** Insight about the example value */
  insight: string;
}

export interface StagePedagogy {
  /** One-line scene title for the tour */
  tourTitle: string;
  /** Narration for guided tour (~30–60s read) */
  tourNarration: string;
  /** Expert thinking aloud */
  expertThinking: string[];
  /** What to notice in the model (example) */
  watchFieldKeys: string[];
  fieldInsights: Record<string, string>;
  /** Teach-back prompts */
  teach: {
    /** 90-second explain-to-a-peer */
    explain: string;
    /** Reflection prompts (stored separately) */
    reflectDecision: string;
    reflectUncertain: string;
    /** Invent questions for a junior */
    peerTeach: string;
  };
}

export const STAGE_PEDAGOGY: Record<StageId, StagePedagogy> = {
  question: {
    tourTitle: "Scene 1 — Lock a precise PICO",
    tourNarration:
      "Watch how a vague interest (“mindfulness and anxiety”) becomes one testable question. Notice: population is students, not all adults; comparator excludes active psychotherapy as the main control; outcomes name real scales. That precision drives every later stage.",
    expertThinking: [
      "If two reviewers would disagree who is ‘in’ the population, the question is still too vague.",
      "Primary outcome first — secondary outcomes are optional extras, not a fishing net.",
      "Feasibility: if millions of trials exist, narrow setting or intervention before you search.",
    ],
    watchFieldKeys: [
      "population",
      "intervention",
      "comparator",
      "outcomes",
      "reviewQuestion",
    ],
    fieldInsights: {
      population:
        "Bound by setting (university students), not a vague ‘young people’.",
      intervention:
        "Defines program type and minimum dose (≥4 sessions) so junk apps don’t creep in later.",
      comparator:
        "Waitlist/usual support only — keeps the question answerable; active-vs-active is a different review.",
      outcomes:
        "Names validated scales and time point so extraction and GRADE have a target.",
      reviewQuestion:
        "One sentence in PICO order — this is what you’ll paste into protocol and paper.",
    },
    teach: {
      explain:
        "Out loud (or in writing): state your full review question, then point to P, I, C, and O and say why each boundary exists. Finish with: “If we loosen X, the review becomes unanswerable because…”",
      reflectDecision:
        "Write your one-sentence question. Then justify scope in 3 bullets: (1) who is in/out of P, (2) what counts as I vs not-I, (3) primary outcome + time point. Note one broader and one narrower alternative you rejected.",
      reflectUncertain:
        "Name the single fuzziest edge (population, dose/intensity of I, comparator, or outcome measure). What decision rule will you use when a study sits on that edge?",
      peerTeach:
        "Write 2 short questions for a junior, e.g. (a) “Give an abstract that matches topic but fails your P — why exclude?” (b) “Why is ‘anxiety’ alone not an adequate outcome statement?”",
    },
  },
  eligibility: {
    tourTitle: "Scene 2 — Rules two reviewers can apply",
    tourNarration:
      "Eligibility is PICO made operational. Watch inclusion/exclusion bullets, language/date/grey-literature rules, and edge cases (cluster RCTs, multi-arm). These lines are what dual screeners argue about — write them so strangers could apply them.",
    expertThinking: [
      "If a criterion only lives in your head, screening will drift.",
      "Exclusions clarify edge cases; they should not silently re-open the question.",
      "Language and grey-literature limits are bias-relevant — justify them.",
    ],
    watchFieldKeys: ["inclusion", "exclusion", "languages", "edgeCases"],
    fieldInsights: {
      inclusion: "Mirrors PICO as bullets a second reviewer can tick.",
      exclusion: "Names the near-misses (single session, non-students) explicitly.",
      languages: "States English full-text as a limitation — honest, not hidden.",
      edgeCases: "Pre-decides cluster RCTs and multi-arm selection before conflict happens.",
    },
    teach: {
      explain:
        "Role-play dual screening: read one borderline abstract (real or invented). Walk a peer through include / exclude / need full text using only your written criteria — not gut feel.",
      reflectDecision:
        "Paste your inclusion and exclusion bullets. Mark which line will cause the most R1–R2 conflict and how you will resolve ties (discussion vs third reviewer).",
      reflectUncertain:
        "Pick one edge case (cluster RCT, multi-arm, mixed population, abstract-only). Write the decision rule in one sentence you could put in the protocol.",
      peerTeach:
        "Create 2 abstract vignettes (3–4 lines each): one clear include, one clear exclude under your rules. Write the correct decision + which criterion decides it.",
    },
  },
  protocol: {
    tourTitle: "Scene 3 — Methods before the search",
    tourNarration:
      "The protocol is a contract with future-you. Watch objectives, methods summary, effect measure, MA plan, registry status, and team roles. Registration timestamps intent so post-hoc fishing is visible.",
    expertThinking: [
      "Methods detail beats restating the question.",
      "Register before screening is finished when eligible.",
      "Name who does dual processes now — don’t invent roles after conflicts appear.",
    ],
    watchFieldKeys: [
      "objectives",
      "methodsSummary",
      "effectMeasure",
      "maPlan",
      "prosperoId",
      "team",
    ],
    fieldInsights: {
      objectives: "Primary vs secondary objectives map to GRADE later.",
      methodsSummary: "Search → dual screen → extract → RoB → synthesis in one paragraph.",
      effectMeasure: "SMD when scales differ — decided before seeing results.",
      maPlan: "Random-effects + sensitivity for high RoB — pre-specified, not after I² shocks you.",
      prosperoId: "Example shows ‘drafting/example’ honesty; real reviews need a real ID or OSF.",
      team: "Named dual roles prevent ‘someone will check’ vagueness.",
    },
    teach: {
      explain:
        "Pitch to a supervisor in 90 seconds: (1) primary objective, (2) dual-review plan, (3) when you will pool vs narrate, (4) what change would require a protocol amendment.",
      reflectDecision:
        "List what is pre-specified: effect measure, model (or narrative rule), RoB tool, dual processes, and registry plan. Star the three items you must not change after seeing results without documenting an amendment.",
      reflectUncertain:
        "What is still too thin for PROSPERO/OSF (search detail, subgroups, missing-data rule)? Write the next action and owner for each gap.",
      peerTeach:
        "Write 3 examiner questions, e.g. “What would make you abandon meta-analysis?” “Who resolves extraction conflicts?” “What is your primary outcome for GRADE?”",
    },
  },

  search: {
    tourTitle: "Scene 4 — Find the evidence, document the trail",
    tourNarration:
      "A weak search biases everything downstream. Watch multi-database sources, concept blocks, a draft string, filters, PRESS plan, and a run log with dates and hits.",
    expertThinking: [
      "PubMed alone is not a comprehensive SR search.",
      "Concept blocks from PICO + synonyms + controlled vocabulary.",
      "If you can’t reproduce the string and hit counts, PRISMA will fail.",
    ],
    watchFieldKeys: ["databases", "conceptBlocks", "sampleString", "searchLog"],
    fieldInsights: {
      databases: "Bibliographic + trials registry — not one database.",
      conceptBlocks: "Separate blocks for population, intervention, outcome.",
      sampleString: "Transparent draft others can peer-review (PRESS).",
      searchLog: "Date | database | hits — the audit trail.",
    },
    teach: {
      explain:
        "Teach a librarian (or peer) your concept blocks and why each database is needed.",
      reflectDecision:
        "What sources and limits did you choose, and what bias risk remains?",
      reflectUncertain:
        "Which synonyms or grey sources are you least confident about?",
      peerTeach:
        "Write 2 questions that test whether a junior understands Boolean OR vs AND in your blocks.",
    },
  },
  screening: {
    tourTitle: "Scene 5 — Dual selection and PRISMA counts",
    tourNarration:
      "Selection bias thrives on ad-hoc decisions. Watch PRISMA numbers, dual-reviewer names, conflict notes, and full-text exclusion reasons with counts.",
    expertThinking: [
      "Unclear abstracts go to full text — don’t exclude on vibes.",
      "Record exclusion reasons at full text for PRISMA.",
      "Pilot dual screen to calibrate criteria before the full set.",
    ],
    watchFieldKeys: [
      "identified",
      "included",
      "exclusionReasons",
      "processNotes",
    ],
    fieldInsights: {
      identified: "All sources combined — starting PRISMA box.",
      included: "Final study count drives extraction workload.",
      exclusionReasons: "Categories with n= — not a vague paragraph.",
      processNotes: "Dual process and conflict resolution are methods, not trivia.",
    },
    teach: {
      explain:
        "Walk a peer through your PRISMA numbers and one difficult conflict resolution.",
      reflectDecision:
        "How did dual screening work, and what pattern of disagreements appeared?",
      reflectUncertain:
        "Are any PRISMA counts still estimates rather than logged facts?",
      peerTeach:
        "Create 1 abstract vignette where include vs exclude is debatable under your criteria.",
    },
  },
  extraction: {
    tourTitle: "Scene 6 — Structured data, not p-values only",
    tourNarration:
      "Meta-analysis quality is extraction quality. Watch the form fields, study rows with means/SDs or events, and dual-extraction plan.",
    expertThinking: [
      "Effect sizes need means/SD/n or events/n — not p alone.",
      "Pilot the form on 2 studies before dual full extraction.",
      "Note scale direction and units before pooling.",
    ],
    watchFieldKeys: ["formFields", "dualExtraction", "outcomeDataNotes"],
    fieldInsights: {
      formFields: "Template columns agreed before touching papers.",
      dualExtraction: "Dual on critical outcomes reduces silent errors.",
      outcomeDataNotes: "Time points and missing-data plan are explicit.",
    },
    teach: {
      explain:
        "Teach a peer how to extract one continuous outcome into mean, SD, and n per arm.",
      reflectDecision:
        "What extraction fields are mandatory for your primary outcome?",
      reflectUncertain:
        "Which studies have missing stats you may need to impute or author-query?",
      peerTeach:
        "Write 2 quiz items about unit conversion or scale direction mistakes.",
    },
  },
  rob: {
    tourTitle: "Scene 7 — Risk of bias is not journal prestige",
    tourNarration:
      "RoB 2 domains judge internal validity. Watch tool choice, process, domain summary, and how RoB feeds sensitivity analysis.",
    expertThinking: [
      "Don’t score ‘quality’ with a single magic number that hides fatal flaws.",
      "Bias can differ by outcome — judge where the tool requires it.",
      "High RoB studies still inform narrative; they change certainty and sensitivity.",
    ],
    watchFieldKeys: ["tool", "summary", "sensitivityPlan"],
    fieldInsights: {
      tool: "RoB 2 for RCTs — matched to design.",
      summary: "Names problematic domains and studies, not vague ‘mixed quality’.",
      sensitivityPlan: "Links appraisal to analysis (e.g. exclude high RoB).",
    },
    teach: {
      explain:
        "Explain RoB 2 in plain language to a clinician who only cares if the result is ‘true’.",
      reflectDecision:
        "Which domain worries you most across included studies, and why?",
      reflectUncertain:
        "Where did reviewers disagree on RoB, and how was it resolved?",
      peerTeach:
        "Draft 2 teaching cases: one low-risk randomization, one high-risk missing outcome data.",
    },
  },
  synthesis: {
    tourTitle: "Scene 8 — Pool only when the question stays one question",
    tourNarration:
      "Not every dataset should be meta-analyzed. Watch the approach decision, comparability rationale, outcomes eligible for MA, and narrative structure.",
    expertThinking: [
      "Clinical diversity can make a precise pooled number meaningless.",
      "Pre-specify decision rules; don’t pool because software allows it.",
      "Narrative synthesis is a method — not a list of abstracts.",
    ],
    watchFieldKeys: ["approach", "comparability", "outcomesForMA"],
    fieldInsights: {
      approach: "MA where possible + narrative elsewhere — honest hybrid.",
      comparability: "Justifies same PICO ‘question space’.",
      outcomesForMA: "Only outcomes with ≥2 extractable effects.",
    },
    teach: {
      explain:
        "Defend to a peer whether your primary outcome should be pooled or narrated — with one reason each way.",
      reflectDecision:
        "What was your synthesis decision rule, applied to the actual studies?",
      reflectUncertain:
        "Which comparison is on the borderline of ‘too diverse to pool’?",
      peerTeach:
        "Write a short teaching note: three red flags that mean ‘do not meta-analyze’.",
    },
  },
  metaanalysis: {
    tourTitle: "Scene 9 — Pool, probe heterogeneity, don’t overclaim",
    tourNarration:
      "MA increases precision only if the model matches the question. Watch effect measure, model, results sentence, heterogeneity notes, and sensitivity.",
    expertThinking: [
      "I² is a clue, not a verdict — investigate causes.",
      "Random-effects often fits multi-study clinical diversity; report τ² too.",
      "Teaching calculators help intuition; publication work belongs in RevMan/R.",
    ],
    watchFieldKeys: ["effectMeasure", "model", "results", "heterogeneityNotes"],
    fieldInsights: {
      effectMeasure: "SMD/MD/RR chosen to match outcome type.",
      model: "Random-effects pre-specified when studies differ.",
      results: "Plain language + numbers + k + I² in one block.",
      heterogeneityNotes: "Causes considered, not only a statistic dumped.",
    },
    teach: {
      explain:
        "Teach a peer how to read one forest plot line and the pooled diamond.",
      reflectDecision:
        "What pooled result (or N/A) did you report, and how did you handle heterogeneity?",
      reflectUncertain:
        "What would change your conclusion if one large study were removed?",
      peerTeach:
        "Write 2 misconceptions about p-values vs confidence intervals you would correct in a journal club.",
    },
  },
  grade: {
    tourTitle: "Scene 10 — Certainty is not ‘significant’",
    tourNarration:
      "GRADE rates confidence in the effect for each critical outcome. Watch outcomes graded, downgrade reasons, and SoF draft notes.",
    expertThinking: [
      "Start high for RCTs, then downgrade for RoB, inconsistency, indirectness, imprecision, publication bias.",
      "Wide CIs crossing decision thresholds → imprecision.",
      "One global grade for the whole review is wrong — grade per outcome.",
    ],
    watchFieldKeys: ["outcomesGraded", "certaintyRatings", "sofDraft"],
    fieldInsights: {
      outcomesGraded: "Critical outcomes listed first.",
      certaintyRatings: "Level + reason per outcome — teachable transparency.",
      sofDraft: "Absolute effects and plain-language messages sketched.",
    },
    teach: {
      explain:
        "Explain to a decision-maker what ‘low certainty’ means for acting on your primary outcome.",
      reflectDecision:
        "For your primary outcome, which GRADE domain(s) drove the rating?",
      reflectUncertain:
        "Where might a methods peer disagree with your downgrade?",
      peerTeach:
        "Write a 3-bullet ‘how to grade imprecision’ teaching card for juniors.",
    },
  },
  reporting: {
    tourTitle: "Scene 11 — Transparent report, no spin",
    tourNarration:
      "PRISMA and balanced conclusions let readers trust the work. Watch title, limitations, conclusions matched to certainty, and checklist progress.",
    expertThinking: [
      "PRISMA compliance is checklist work, not a slogan in the abstract.",
      "Limitations should name search, bias, and certainty issues you already found.",
      "Causal language must match design and certainty.",
    ],
    watchFieldKeys: ["title", "limitations", "conclusions"],
    fieldInsights: {
      title: "Signals SR/MA and population in one line.",
      limitations: "Honest about English full-text and other constraints.",
      conclusions: "Tied to certainty — no miracle claims.",
    },
    teach: {
      explain:
        "Give a 90-second oral summary of findings a journal club could critique.",
      reflectDecision:
        "How did you avoid spin in the conclusions relative to GRADE?",
      reflectUncertain:
        "Which PRISMA items are still incomplete before submission?",
      peerTeach:
        "List 3 questions a peer reviewer should ask about your reporting transparency.",
    },
  },
};

export function getStagePedagogy(id: StageId): StagePedagogy {
  return STAGE_PEDAGOGY[id];
}

/** Example project field value for watch mode */
export function getExampleFieldValue(
  stageId: StageId,
  fieldKey: string
): string {
  const ex = getExampleProject();
  const v = ex.stages[stageId]?.data?.[fieldKey];
  if (v === undefined || v === null) return "";
  return String(v);
}

export function getTourSteps(): {
  stageId: StageId;
  number: number;
  title: string;
  tourTitle: string;
  narration: string;
}[] {
  return STAGE_ORDER.map((id) => {
    const def = getStage(id);
    const ped = STAGE_PEDAGOGY[id];
    return {
      stageId: id,
      number: def.number,
      title: def.title,
      tourTitle: ped.tourTitle,
      narration: ped.tourNarration,
    };
  });
}

/** Keys stored on stage.data for teach/reflect */
export const TEACH_KEYS = {
  reflectDecision: "_reflectDecision",
  reflectUncertain: "_reflectUncertain",
  teachExplain: "_teachExplain",
  teachPeer: "_teachPeer",
} as const;

export function getTeachAnswers(data: Record<string, unknown> | undefined) {
  const d = data || {};
  return {
    reflectDecision: String(d[TEACH_KEYS.reflectDecision] || ""),
    reflectUncertain: String(d[TEACH_KEYS.reflectUncertain] || ""),
    teachExplain: String(d[TEACH_KEYS.teachExplain] || ""),
    teachPeer: String(d[TEACH_KEYS.teachPeer] || ""),
  };
}

export function countTeachProgress(data: Record<string, unknown> | undefined) {
  const a = getTeachAnswers(data);
  const filled = [
    a.reflectDecision,
    a.reflectUncertain,
    a.teachExplain,
    a.teachPeer,
  ].filter((s) => s.trim().length > 0).length;
  return { filled, total: 4 };
}

export function buildLearningExportMarkdown(project: Project): string {
  const readiness = computeReadiness(project);
  const lines: string[] = [
    `# Learning pack: ${project.title}`,
    ``,
    `> Watch · Do · Teach export from EvidenceFlow`,
    `> Readiness ${readiness.score}% · ${new Date().toISOString().slice(0, 10)}`,
    ``,
    `## Readiness`,
    ``,
  ];
  for (const item of readiness.items) {
    lines.push(`- [${item.done ? "x" : " "}] ${item.label}`);
  }
  lines.push("", "## Stage reflections & teach-back", "");

  for (const id of STAGE_ORDER) {
    const def = getStage(id);
    const ped = STAGE_PEDAGOGY[id];
    const answers = getTeachAnswers(project.stages[id]?.data);
    const any =
      answers.reflectDecision ||
      answers.reflectUncertain ||
      answers.teachExplain ||
      answers.teachPeer;
    if (!any && project.stages[id]?.status === "not_started") continue;

    lines.push(`### ${def.number}. ${def.title}`, "");
    lines.push(`*Status: ${project.stages[id]?.status || "not_started"}*`, "");
    lines.push(`**Prompt — decision:** ${ped.teach.reflectDecision}`, "");
    lines.push(answers.reflectDecision || "_Not yet written_", "");
    lines.push(`**Prompt — uncertainty:** ${ped.teach.reflectUncertain}`, "");
    lines.push(answers.reflectUncertain || "_Not yet written_", "");
    lines.push(`**Teach-back (90s):** ${ped.teach.explain}`, "");
    lines.push(answers.teachExplain || "_Not yet written_", "");
    lines.push(`**Peer-teaching questions:** ${ped.teach.peerTeach}`, "");
    lines.push(answers.teachPeer || "_Not yet written_", "");
    lines.push("");
  }

  lines.push(
    "---",
    "*Educational material — not a substitute for methods supervision or ethics review.*"
  );
  return lines.join("\n");
}

export function projectTeachScore(project: Project): {
  filled: number;
  total: number;
  percent: number;
} {
  let filled = 0;
  const total = STAGE_ORDER.length * 4;
  for (const id of STAGE_ORDER) {
    filled += countTeachProgress(project.stages[id]?.data).filled;
  }
  return {
    filled,
    total,
    percent: total ? Math.round((filled / total) * 100) : 0,
  };
}
