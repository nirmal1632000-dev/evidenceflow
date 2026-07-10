import type { StageId } from "./types";
import { resolveRefs, type Ref } from "./references";

export type LearnSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LearnModuleExtended = {
  stageId: StageId;
  /** Longer overview beyond the one-liner summary */
  overview: string;
  learningObjectives: string[];
  sections: LearnSection[];
  practiceTasks: string[];
  keyTakeaways: string[];
  /** Reference ids from REFS */
  refIds: string[];
  furtherReading?: { title: string; url: string }[];
};

export const LEARN_MODULES: Record<StageId, LearnModuleExtended> = {
  question: {
    stageId: "question",
    overview:
      "A systematic review stands or falls on its question. Vague topics produce unfocused searches, inconsistent inclusion decisions, and results nobody can apply. This module trains you to turn a clinical or research interest into a focused, answerable question using PICO/PICOS — the foundation for protocol, search, and synthesis.",
    learningObjectives: [
      "Distinguish a topic from a reviewable question",
      "Write complete PICO (and study design) elements that two reviewers would interpret the same way",
      "Pre-specify primary vs secondary outcomes and justify feasibility",
      "State a one-sentence review question suitable for protocol and paper title",
    ],
    sections: [
      {
        heading: "From topic to question",
        paragraphs: [
          "A topic is broad (“mindfulness and anxiety”). A systematic review question specifies who, what compared with what, and which outcomes matter. Richardson and colleagues framed the “well-built clinical question” idea that underpins PICO in evidence-based practice.",
          "Cochrane guidance emphasises that the question determines eligibility, search concepts, and which comparisons are legitimate to synthesise. If the question is multifocal (many interventions, many populations, many outcomes with equal weight), the review becomes a collection of mini-reviews that is hard to interpret.",
        ],
      },
      {
        heading: "PICO / PICOS in depth",
        paragraphs: [
          "Population: who is eligible (condition, age, setting, geography)? Avoid vague labels (“patients”) without clinical anchors.",
          "Intervention / exposure: what is delivered, at what intensity or dose, over what duration? Educational and behavioural interventions need structure definitions (e.g. number of sessions).",
          "Comparator: usual care, placebo, waitlist, or active control? Active-vs-active answers a different question than intervention-vs-control.",
          "Outcomes: name constructs and, when possible, measurement tools and time points. Separate critical outcomes (drive conclusions and GRADE) from important but secondary ones.",
          "Study design (PICOS): for a first intervention review, RCTs only is often the most defensible scope.",
        ],
        bullets: [
          "Write each element so a second person can include/exclude studies without asking you.",
          "Prefer one primary outcome for decision-making; list secondaries explicitly.",
          "Check feasibility: if the literature is enormous, narrow population, setting, or intervention class.",
        ],
      },
      {
        heading: "Link to later stages",
        paragraphs: [
          "Your PICO becomes eligibility criteria, search concept blocks, extraction fields, and GRADE outcomes. Changing the question after seeing results risks selective inference — document amendments in the protocol sense (PRISMA-P / PROSPERO).",
        ],
      },
    ],
    practiceTasks: [
      "Rewrite a vague topic you care about into full PICO + one-sentence question.",
      "Ask a peer to interpret your population sentence and list two people who would be edge cases.",
      "Name one broader and one narrower alternative question and why you rejected each.",
    ],
    keyTakeaways: [
      "Precision early saves weeks later.",
      "Primary outcomes must be measurable in primary studies.",
      "The written question is the contract for dual review.",
    ],
    refIds: ["pico", "cochrane", "prismaP", "prospero", "mep"],
    furtherReading: [
      {
        title: "Cochrane Handbook — defining the review question",
        url: "https://training.cochrane.org/handbook/current/chapter-02",
      },
    ],
  },

  eligibility: {
    stageId: "eligibility",
    overview:
      "Eligibility criteria operationalise the question so screening is reproducible. This module covers inclusion/exclusion structure, language and grey literature decisions, and edge-case rules that prevent ad-hoc decisions mid-review.",
    learningObjectives: [
      "Translate PICO into explicit inclusion and exclusion criteria",
      "Document language, date, and publication-status limits with justification",
      "Pre-specify handling of multi-arm, cluster, and mixed-population studies",
      "Pilot criteria with a second reviewer before full screening",
    ],
    sections: [
      {
        heading: "Why criteria must be written",
        paragraphs: [
          "PRISMA and Cochrane methods expect eligibility to be defined a priori and reported transparently. Criteria that live only in the lead author’s head produce selection drift and irreproducible reviews.",
          "AMSTAR 2 critically appraises whether reviews had appropriate eligibility and selection methods — poor documentation lowers confidence in the review itself.",
        ],
      },
      {
        heading: "Building inclusion and exclusion lists",
        paragraphs: [
          "Inclusion should positively state who/what is in (population, intervention, comparator, outcomes, design, setting).",
          "Exclusion clarifies near-misses (wrong design, single-arm, wrong intervention intensity, animal studies). Avoid exclusions that silently redefine the question after results are known.",
          "Outcome eligibility: if meta-analysis is planned, studies must report (or allow calculation of) effect data for critical outcomes — or you pre-specify narrative inclusion when only direction of effect is available.",
        ],
      },
      {
        heading: "Limits that affect bias",
        paragraphs: [
          "Language restrictions can introduce language bias. If you limit to English full text, say so and treat it as a limitation.",
          "Grey literature (theses, registries, conference abstracts) can reduce publication bias but increases workload and missing-data problems. Decide deliberately.",
          "Date limits need justification (e.g. after a practice-changing intervention appeared).",
        ],
      },
    ],
    practiceTasks: [
      "Convert your PICO into bullet inclusion/exclusion lists.",
      "Write one decision rule for multi-arm trials.",
      "Pilot criteria on 10–20 titles with a second person; note disagreements.",
    ],
    keyTakeaways: [
      "Eligibility is dual-review infrastructure, not paperwork.",
      "Justify language and grey-literature choices.",
      "Edge cases decided late become post-hoc bias risks.",
    ],
    refIds: ["cochrane", "prisma2020", "amstar", "mep"],
    furtherReading: [
      {
        title: "Cochrane Handbook — determining eligibility",
        url: "https://training.cochrane.org/handbook/current/chapter-03",
      },
    ],
  },

  protocol: {
    stageId: "protocol",
    overview:
      "A protocol is a methods contract written before results are known. This module covers PRISMA-P content, registration (PROSPERO/OSF), pre-specification of synthesis and RoB methods, and team roles for dual processes.",
    learningObjectives: [
      "List core protocol elements required for transparency",
      "Explain why registration reduces reporting bias",
      "Pre-specify effect measures, model choices, and when not to pool",
      "Assign dual-review roles before conflicts appear",
    ],
    sections: [
      {
        heading: "What belongs in a protocol",
        paragraphs: [
          "PRISMA-P itemises protocol content: rationale, objectives, eligibility, information sources, search strategy outline, study selection, data items, RoB methods, synthesis plans, and amendments process.",
          "Cochrane MECIR standards set methodological expectations for intervention reviews (e.g. dual selection for certain steps, comprehensive search).",
        ],
      },
      {
        heading: "Registration",
        paragraphs: [
          "PROSPERO is a common register for health-related systematic reviews. Registration timestamps planned methods. Register before screening is complete when eligible.",
          "If PROSPERO is unsuitable, OSF or institutional registries can host protocols. Empty or late registration undermines the purpose.",
        ],
      },
      {
        heading: "Pre-specification vs flexibility",
        paragraphs: [
          "You may need amendments (new synonyms, clarified eligibility). Document what changed and why. Undocumented changes after seeing effects are a credibility problem (selective reporting at review level).",
        ],
      },
    ],
    practiceTasks: [
      "Draft a one-page methods summary covering search, dual screen, RoB tool, and synthesis rule.",
      "Write your registry status sentence (ID or ‘drafting / not eligible’).",
      "Name Reviewer 1, Reviewer 2, and conflict resolver.",
    ],
    keyTakeaways: [
      "Protocol detail beats restating the question.",
      "Registration is transparency infrastructure.",
      "Team roles are methods, not afterthoughts.",
    ],
    refIds: ["prismaP", "prospero", "cochrane", "mep", "amstar"],
    furtherReading: [
      {
        title: "PROSPERO register",
        url: "https://www.crd.york.ac.uk/prospero/",
      },
      {
        title: "PRISMA-P checklist",
        url: "http://www.prisma-statement.org/Protocols",
      },
    ],
  },

  search: {
    stageId: "search",
    overview:
      "Search quality bounds what a review can conclude. This module covers multi-database strategy, concept blocks, controlled vocabulary, grey sources, PRESS peer review, and reproducible logging for PRISMA.",
    learningObjectives: [
      "Design PICO-based concept blocks with synonyms and controlled terms",
      "Justify multi-database and trials-registry searching",
      "Describe PRESS peer review of search strategies",
      "Log date, platform, string, and hits for each source",
    ],
    sections: [
      {
        heading: "Why one database is not enough",
        paragraphs: [
          "Bibliographic databases differ in journal coverage, indexing, and updates. Cochrane and PRISMA expect a comprehensive approach appropriate to the question — typically multiple major databases plus trials registers when relevant.",
          "Publication and indexing lags mean unpublished or recently completed trials may only appear in registries (ClinicalTrials.gov, WHO ICTRP).",
        ],
      },
      {
        heading: "Building the strategy",
        paragraphs: [
          "Structure searches as concept blocks combined with AND; within blocks use OR for synonyms and controlled vocabulary (MeSH, Emtree).",
          "Study design filters (e.g. RCT filters) can reduce noise but may miss studies — validate filters for your context.",
          "PRESS (Peer Review of Electronic Search Strategies) provides a structured checklist for another information specialist or librarian to critique the strategy before final runs.",
        ],
      },
      {
        heading: "Documentation",
        paragraphs: [
          "PRISMA requires reporting full search strategies (often as appendices) and results counts. Keep a search log: date, database, platform/interface, string version, hits, and notes.",
          "Export to a reference manager (e.g. Zotero, EndNote) and de-duplicate before screening; record duplicates removed for the PRISMA flow.",
        ],
      },
    ],
    practiceTasks: [
      "Write three concept blocks for your question with ≥5 synonyms each.",
      "List databases and grey sources you will search and why.",
      "Draft a PRESS request email to a librarian (or peer).",
    ],
    keyTakeaways: [
      "Search is a methods result, not a black box.",
      "Reproducibility requires strings + counts + dates.",
      "Peer review of searches improves sensitivity/specificity balance.",
    ],
    refIds: ["press", "prisma2020", "cochrane", "mep"],
    furtherReading: [
      {
        title: "Cochrane Handbook — searching",
        url: "https://training.cochrane.org/handbook/current/chapter-04",
      },
    ],
  },

  screening: {
    stageId: "screening",
    overview:
      "Study selection translates eligibility into a included set with an audit trail. This module covers dual independent screening, calibration, conflict resolution, PRISMA flow accounting, and optional agreement statistics.",
    learningObjectives: [
      "Run title/abstract then full-text screening with dual review principles",
      "Record full-text exclusion reasons with counts for PRISMA",
      "Pilot and calibrate criteria before high-volume screening",
      "Interpret simple agreement (e.g. kappa) cautiously",
    ],
    sections: [
      {
        heading: "Process standards",
        paragraphs: [
          "Cochrane methods recommend independent dual screening for study selection in many contexts, with discussion or a third reviewer for disagreements. Single-reviewer screening increases error risk, especially for novices.",
          "PRISMA 2020 requires a flow diagram of identification, screening, eligibility, and inclusion, plus reasons for excluding full-text reports.",
        ],
      },
      {
        heading: "Practical workflow",
        paragraphs: [
          "De-duplicate first. Pilot on a sample (e.g. 50–100 records) to refine wording. Prefer full text when abstracts are unclear.",
          "Tools such as Rayyan, Covidence, or ASReview support collaborative or prioritised screening; EvidenceFlow stores decisions, counts, and conflict notes as your methods record.",
        ],
      },
      {
        heading: "Agreement metrics",
        paragraphs: [
          "Cohen’s kappa and related measures quantify chance-corrected agreement. Landis & Koch offered rough benchmarks, but high agreement does not prove correct decisions — both reviewers can share the same bias. Use kappa as training feedback, not as proof of validity.",
        ],
      },
    ],
    practiceTasks: [
      "Fill a PRISMA-style count table from a practice set (even with made-up numbers once, then with real data).",
      "Write exclusion reason categories you will use at full text.",
      "Document how conflicts will be resolved before screening starts.",
    ],
    keyTakeaways: [
      "Unclear abstract ≠ exclude.",
      "Full-text reasons are PRISMA-critical.",
      "Dual review protects validity more than speed hacks.",
    ],
    refIds: ["prisma2020", "prismaExplain", "cochrane", "kappa", "mep"],
    furtherReading: [
      {
        title: "PRISMA 2020 flow diagram templates",
        url: "https://www.prisma-statement.org/prisma-2020-flow-diagram",
      },
    ],
  },

  extraction: {
    stageId: "extraction",
    overview:
      "Data extraction builds the analytic dataset. Errors here propagate to every forest plot. This module covers form design, dual extraction, effect data requirements, and missing data strategies.",
    learningObjectives: [
      "Design an extraction form aligned to PICO and planned analyses",
      "Identify data needed for MD/SMD or binary effect measures",
      "Plan dual extraction or verification for critical fields",
      "Document missing data and author-contact attempts",
    ],
    sections: [
      {
        heading: "What to extract",
        paragraphs: [
          "Typical items: citation, design, setting, sample sizes, population descriptors, intervention details, comparator, outcomes, time points, funding, conflicts of interest, and effect data.",
          "For continuous outcomes: means, SDs (or SEs/CIs), n per arm — or reported MD/SMD with SE. For binary: events and totals per arm (or OR/RR with CI).",
        ],
      },
      {
        heading: "Process quality",
        paragraphs: [
          "Cochrane guidance supports dual data extraction or single extraction with verification for critical outcomes. Pilot the form on 2–3 studies.",
          "Record scale direction (higher = better or worse), units, and whether analyses were ITT or per-protocol.",
        ],
      },
      {
        heading: "Missing statistics",
        paragraphs: [
          "When SDs are missing, methods exist to impute from SEs, CIs, p-values, or other statistics — with assumptions documented (see Cochrane Handbook quantitative chapters). Author contact is preferred when feasible.",
        ],
      },
    ],
    practiceTasks: [
      "List extraction columns for your primary outcome.",
      "Extract one published RCT table into mean/SD/n (or events/n).",
      "Write a missing-data rule for your protocol.",
    ],
    keyTakeaways: [
      "p-values alone are not meta-analysable effect sizes.",
      "Dual process on critical outcomes reduces silent error.",
      "Units and direction errors reverse conclusions.",
    ],
    refIds: ["cochrane", "mep", "prisma2020"],
    furtherReading: [
      {
        title: "Cochrane Handbook — collecting data",
        url: "https://training.cochrane.org/handbook/current/chapter-05",
      },
    ],
  },

  rob: {
    stageId: "rob",
    overview:
      "Risk of bias assessment judges internal validity of included studies. This module focuses on RoB 2 for randomised trials, process standards, visualisation, and linking RoB to synthesis and GRADE.",
    learningObjectives: [
      "Name RoB 2 domains and overall judgement logic",
      "Distinguish risk of bias from “study quality” scores",
      "Plan dual independent RoB assessment with consensus",
      "Connect RoB findings to sensitivity analysis and GRADE",
    ],
    sections: [
      {
        heading: "RoB 2 framework",
        paragraphs: [
          "RoB 2 (Sterne et al., 2019) assesses randomised trials across domains including randomisation process, deviations from intended interventions, missing outcome data, measurement of the outcome, and selection of the reported result. Judgements are often outcome-specific.",
          "Overall risk (low / some concerns / high) follows domain algorithms — not an average quality score. Numerical scales that hide critical flaws are discouraged in modern guidance.",
        ],
      },
      {
        heading: "Other tools (awareness)",
        paragraphs: [
          "ROBINS-I is for non-randomised interventions. QUADAS-2 is for diagnostic accuracy studies. Using the wrong tool misrepresents validity.",
        ],
      },
      {
        heading: "Using RoB in the review",
        paragraphs: [
          "Report RoB in text and figures (e.g. robvis). Pre-specify sensitivity analyses excluding high-risk studies. In GRADE, serious risk of bias can downgrade certainty for an outcome.",
        ],
      },
    ],
    practiceTasks: [
      "Complete RoB 2 signalling questions for one RCT on your primary outcome.",
      "Write a sensitivity analysis plan tied to overall high risk.",
      "Pair-assess one study with a peer and resolve one disagreement in writing.",
    ],
    keyTakeaways: [
      "Bias risk ≠ journal impact factor.",
      "Domain-based judgements beat global scores.",
      "RoB feeds GRADE and sensitivity — not a decorative table.",
    ],
    refIds: ["rob2", "robinsI", "quadas2", "cochrane", "grade"],
    furtherReading: [
      {
        title: "Riskofbias.info — RoB 2 resources",
        url: "https://www.riskofbias.info/",
      },
    ],
  },

  synthesis: {
    stageId: "synthesis",
    overview:
      "Synthesis decides how study findings will be combined narratively and/or statistically. Inappropriate meta-analysis can mislead more than a careful narrative synthesis.",
    learningObjectives: [
      "Apply decision rules for pooling vs narrative synthesis",
      "Distinguish clinical from statistical heterogeneity",
      "Structure narrative synthesis beyond study-by-study lists",
      "Pre-specify synthesis choices in the protocol",
    ],
    sections: [
      {
        heading: "When pooling is inappropriate",
        paragraphs: [
          "If interventions, populations, or outcomes differ so much that a single effect would not answer one question, do not pool. Clinical diversity is a conceptual judgement; statistical heterogeneity (I², τ²) is estimated after pooling and cannot alone decide clinical meaningfulness.",
          "Cochrane Handbook chapters on synthesis and meta-analysis discuss deciding what is comparable enough to combine.",
        ],
      },
      {
        heading: "Narrative synthesis",
        paragraphs: [
          "Narrative synthesis should be systematic: organise by outcome, population, or intervention features; describe patterns of direction and magnitude; integrate RoB. Guidance such as Popay et al. warns against unstructured storytelling.",
        ],
      },
      {
        heading: "Hybrid approaches",
        paragraphs: [
          "Many reviews meta-analyse some outcomes and narrate others. Report decision rules transparently (PRISMA synthesis items).",
        ],
      },
    ],
    practiceTasks: [
      "Write a one-paragraph comparability judgement for your primary outcome.",
      "List outcomes eligible for MA (≥2 studies with extractable effects) vs narrative-only.",
      "Outline a narrative structure (headings) for your results section.",
    ],
    keyTakeaways: [
      "Software can pool almost anything — methods judgement says whether it should.",
      "Narrative synthesis is a method, not a fallback apology.",
      "Pre-specify rules; document amendments.",
    ],
    refIds: ["cochrane", "meade", "prisma2020", "i2"],
    furtherReading: [
      {
        title: "Cochrane Handbook — systematic review syntheses",
        url: "https://training.cochrane.org/handbook/current/chapter-09",
      },
    ],
  },

  metaanalysis: {
    stageId: "metaanalysis",
    overview:
      "Meta-analysis pools effect estimates when studies answer a sufficiently similar question. This module covers effect measures, fixed vs random effects, heterogeneity, forest plots, small-study effects, and responsible interpretation.",
    learningObjectives: [
      "Choose MD vs SMD and RR/OR/RD appropriately",
      "Explain fixed-effect vs random-effects models at a conceptual level",
      "Report and interpret I², τ², and prediction intervals cautiously",
      "Avoid over-interpreting funnel plots with few studies",
    ],
    sections: [
      {
        heading: "Effect measures",
        paragraphs: [
          "Continuous: mean difference (same scale) or standardised mean difference (e.g. Hedges’ g) when scales differ. Binary: risk ratio, odds ratio, or risk difference — RR often preferred for interpretation in many clinical contexts; be consistent.",
          "Analyses of ratio measures are typically performed on the log scale and back-transformed for presentation.",
        ],
      },
      {
        heading: "Models and heterogeneity",
        paragraphs: [
          "Fixed/common-effect models assume one true effect; random-effects models allow study effects to vary (DerSimonian–Laird is a classic estimator; modern practice often prefers REML and careful variance estimation).",
          "I² describes the percentage of variability across studies due to heterogeneity rather than chance (Higgins et al.), with important caveats — it depends on study precision and is not a measure of absolute heterogeneity.",
          "Investigate heterogeneity (subgroups, study-level covariates) only with pre-specification and caution; data dredging produces spurious findings.",
        ],
      },
      {
        heading: "Small-study and reporting biases",
        paragraphs: [
          "Funnel plots and tests (e.g. Egger) explore small-study effects, which may reflect publication bias, true heterogeneity, or chance. With fewer than ~10 studies, tests are underpowered and easy to over-interpret.",
        ],
      },
      {
        heading: "Teaching tools vs publication analysis",
        paragraphs: [
          "EvidenceFlow calculators illustrate fixed IV and DerSimonian–Laird random effects for learning. For publishable analyses, use established software (RevMan, R meta/metafor, Stata) with reproducible scripts and sensitivity analyses.",
        ],
      },
    ],
    practiceTasks: [
      "Compute a simple two-study MD by hand or with the in-app calculator.",
      "Write a results sentence: pooled effect, CI, k, I², model.",
      "List two sensitivity analyses you will run.",
    ],
    keyTakeaways: [
      "Precision without validity is a precise wrong answer.",
      "Report model, k, CI, and heterogeneity — not p alone.",
      "Prefer pre-specified sensitivity over exploratory fishing.",
    ],
    refIds: ["dersimonian", "hedges", "i2", "egger", "cochrane"],
    furtherReading: [
      {
        title: "Cochrane Handbook — analysing data and meta-analysis",
        url: "https://training.cochrane.org/handbook/current/chapter-10",
      },
    ],
  },

  grade: {
    stageId: "grade",
    overview:
      "GRADE rates certainty (confidence) in effect estimates for decision-making. This module covers the five main downgrade domains, Summary of Findings tables, and plain-language interpretation.",
    learningObjectives: [
      "Apply the five GRADE downgrade domains to RCT evidence",
      "Rate certainty per critical outcome, not for the whole review as one grade",
      "Draft Summary of Findings content (relative/absolute effects + certainty)",
      "Avoid equating statistical significance with high certainty",
    ],
    sections: [
      {
        heading: "GRADE logic",
        paragraphs: [
          "For randomised trials, certainty often starts high and may be downgraded for risk of bias, inconsistency, indirectness, imprecision, and publication bias (Guyatt et al.). Non-randomised evidence typically starts lower, with possible upgrades in specific situations.",
          "Certainty levels: high, moderate, low, very low — communicate how likely the true effect differs materially from the estimate.",
        ],
      },
      {
        heading: "Domains in practice",
        paragraphs: [
          "Risk of bias: from RoB assessments of contributing studies.",
          "Inconsistency: unexplained heterogeneity in direction/magnitude.",
          "Indirectness: population, intervention, comparator, or outcome differs from the question of interest.",
          "Imprecision: wide confidence intervals crossing decision thresholds; small information size.",
          "Publication bias: suspected missing studies (often hard to prove).",
        ],
      },
      {
        heading: "Summary of Findings",
        paragraphs: [
          "SoF tables present critical outcomes, anticipated absolute effects, relative effects, certainty, and comments. GRADEpro GDT supports structured production. SoF content is central to trustworthy conclusions.",
        ],
      },
    ],
    practiceTasks: [
      "Grade your primary outcome with explicit domain reasons.",
      "Write one plain-language sentence for a clinician using the certainty rating.",
      "List critical vs important outcomes for SoF.",
    ],
    keyTakeaways: [
      "Certainty is outcome-specific.",
      "Significant ≠ high certainty.",
      "SoF translates statistics into decisions.",
    ],
    refIds: ["grade", "gradeHandbook", "sof", "rob2"],
    furtherReading: [
      {
        title: "GRADE Handbook (online)",
        url: "https://gdt.gradepro.org/app/handbook/handbook.html",
      },
    ],
  },

  reporting: {
    stageId: "reporting",
    overview:
      "Transparent reporting lets readers judge trustworthiness and reuse methods. This module covers PRISMA 2020, avoiding spin, data sharing norms, and packaging outputs for manuscripts.",
    learningObjectives: [
      "Map review work to major PRISMA 2020 items",
      "Write limitations and conclusions aligned with certainty",
      "Avoid spin and causal over-claim from weak evidence",
      "Prepare reproducible appendices (searches, data, code)",
    ],
    sections: [
      {
        heading: "PRISMA 2020 essentials",
        paragraphs: [
          "PRISMA 2020 (Page et al.) updates reporting items for systematic reviews, including protocol/registration, search strategies, selection processes, RoB, synthesis methods, certainty assessments, and competing interests.",
          "The explanation and elaboration paper provides examples and rationale for each item — use it while drafting.",
        ],
      },
      {
        heading: "Conclusions without spin",
        paragraphs: [
          "Match language to design and certainty. “Associated with” vs “causes”; “may” vs “will”. ICMJE recommendations address responsible reporting and authorship standards relevant to review teams.",
        ],
      },
      {
        heading: "Open materials",
        paragraphs: [
          "Share search strings, extraction sheets, analysis code, and amendments when possible (OSF, institutional repositories). Transparency is part of modern review quality (related to AMSTAR 2 domains on reporting).",
        ],
      },
    ],
    practiceTasks: [
      "Tick a PRISMA-inspired checklist against your draft manuscript outline.",
      "Rewrite a spun conclusion into a certainty-matched sentence.",
      "List appendix materials you will deposit openly.",
    ],
    keyTakeaways: [
      "PRISMA is a reporting standard, not a methods shortcut.",
      "Limitations should be specific and usable.",
      "Reproducibility packages increase trust.",
    ],
    refIds: ["prisma2020", "prismaExplain", "icmje", "amstar", "cochrane"],
    furtherReading: [
      {
        title: "PRISMA statement website",
        url: "https://www.prisma-statement.org/",
      },
    ],
  },
};

export function getLearnModule(id: StageId): LearnModuleExtended {
  return LEARN_MODULES[id];
}

export function getModuleReferences(id: StageId): Ref[] {
  return resolveRefs(LEARN_MODULES[id].refIds);
}

/** All unique references used across modules (for a global bibliography page section) */
export function allLearningReferences(): Ref[] {
  const seen = new Set<string>();
  const out: Ref[] = [];
  for (const mod of Object.values(LEARN_MODULES)) {
    for (const r of resolveRefs(mod.refIds)) {
      if (!seen.has(r.id)) {
        seen.add(r.id);
        out.push(r);
      }
    }
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}
