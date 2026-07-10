import type { StageId } from "./types";

export interface SpecialtyTemplate {
  id: string;
  specialty: string;
  title: string;
  blurb: string;
  /** Stage field prefill */
  stages: Partial<Record<StageId, Record<string, string>>>;
}

export const SPECIALTY_TEMPLATES: SpecialtyTemplate[] = [
  {
    id: "psych-anxiety",
    specialty: "Psychology / mental health",
    title: "Psychological intervention for anxiety (RCTs)",
    blurb:
      "Mindfulness, CBT, or similar vs control on validated anxiety scales in adults.",
    stages: {
      question: {
        topic: "Psychological intervention for anxiety symptoms in adults",
        population: "Adults (≥18) with elevated anxiety or anxiety disorder",
        intervention: "Structured psychological intervention (e.g. CBT, mindfulness-based)",
        comparator: "Wait-list, usual care, or attention control",
        outcomes: "Primary: anxiety symptom severity (validated scale). Secondary: response, dropout, quality of life",
        studyDesign: "rct",
        reviewQuestion:
          "In adults with anxiety, what is the effect of structured psychological interventions compared with control on anxiety symptom severity?",
      },
      eligibility: {
        inclusion:
          "• Adults ≥18 with clinical or subclinical anxiety\n• RCT of psychological intervention vs control\n• Validated anxiety outcome reported",
        exclusion:
          "• Pharmacotherapy-only arms\n• Single-arm / non-randomized\n• Animal studies\n• No usable continuous or dichotomous anxiety outcome",
        languages: "No language restriction (or English only — justify)",
        dateLimits: "No date limit",
        publicationStatus: "include_grey",
        edgeCases:
          "Cluster RCTs: adjust if needed. Multi-arm: select most intensive psychological arm vs control.",
      },
      protocol: {
        objectives:
          "Primary: estimate effect of psychological interventions vs control on anxiety severity. Secondary: response rates, acceptability (dropout).",
        methodsSummary:
          "Multi-database search; dual title/abstract and full-text screening; dual extraction of critical outcomes; RoB 2; random-effects MA of MD/SMD where appropriate; GRADE per critical outcome.",
        effectMeasure: "SMD (or MD if same scale)",
        maPlan:
          "Random-effects (REML preferred in R). Investigate I²; pre-specify subgroup by intervention type. Sensitivity: exclude high RoB.",
        prosperoId: "drafting",
        team: "Reviewer 1 / Reviewer 2: screening & extraction; third: conflicts; stats: lead reviewer",
      },
    },
  },
  {
    id: "nursing-education",
    specialty: "Nursing / health education",
    title: "Patient education intervention (RCTs)",
    blurb:
      "Structured education vs usual care on knowledge, self-management, or clinical endpoints.",
    stages: {
      question: {
        topic: "Structured patient education for chronic condition self-management",
        population: "Adults with a defined chronic condition (e.g. diabetes, heart failure)",
        intervention: "Structured patient education programme (individual or group)",
        comparator: "Usual care or unstructured information",
        outcomes:
          "Primary: disease-specific knowledge or self-management score. Secondary: HbA1c / admissions / QoL / adverse events",
        studyDesign: "rct",
        reviewQuestion:
          "In adults with [condition], what is the effect of structured patient education compared with usual care on [primary outcome]?",
      },
      eligibility: {
        inclusion:
          "• Adults with specified chronic condition\n• RCT of structured education vs control\n• At least one pre-specified outcome reported",
        exclusion:
          "• Provider-only training without patient education\n• Non-randomized designs\n• Conference abstracts without data",
        languages: "English only (justify) or no restriction",
        dateLimits: "2000–present (or justify)",
        publicationStatus: "peer_reviewed",
        edgeCases: "Cluster RCTs in clinics: include with unit of analysis noted.",
      },
      protocol: {
        objectives:
          "Estimate effects of structured education on knowledge/self-management and key clinical outcomes.",
        methodsSummary:
          "CINAHL + MEDLINE + Embase + CENTRAL; dual screening; RoB 2; narrative synthesis if heterogeneous interventions; MA only for comparable outcomes.",
        effectMeasure: "MD / SMD / RR as appropriate",
        maPlan: "Pool only when education content and outcomes are comparable; otherwise structured narrative by outcome.",
        prosperoId: "drafting",
        team: "Dual nurse-researchers for screening/extraction",
      },
    },
  },
  {
    id: "medicine-cardio",
    specialty: "Medicine / cardiology",
    title: "Pharmacologic therapy vs control (RCTs)",
    blurb:
      "Drug or device intervention on clinical or surrogate cardiovascular outcomes.",
    stages: {
      question: {
        topic: "Pharmacologic intervention for [cardiovascular indication]",
        population: "Adults with [e.g. HFrEF / hypertension / post-MI]",
        intervention: "[Drug class / named agent] at therapeutic dose",
        comparator: "Placebo or active standard of care",
        outcomes:
          "Primary: [e.g. all-cause mortality / MACE / BP]. Secondary: hospitalizations, adverse events",
        studyDesign: "rct",
        reviewQuestion:
          "In adults with [condition], what is the effect of [intervention] compared with [comparator] on [primary outcome]?",
      },
      eligibility: {
        inclusion:
          "• Adults with defined clinical condition\n• RCT of specified intervention vs comparator\n• Clinical or validated surrogate outcome",
        exclusion:
          "• Observational studies\n• Wrong comparator\n• Healthy volunteers only\n• Duplicate publications (keep largest/longest)",
        languages: "No language restriction",
        dateLimits: "No limit",
        publicationStatus: "include_grey",
        edgeCases: "Crossover: first period only if washout inadequate. Multi-arm: protocol-defined arm selection.",
      },
      protocol: {
        objectives:
          "Estimate relative effects on primary clinical endpoint; summarize harms.",
        methodsSummary:
          "MEDLINE, Embase, CENTRAL, ClinicalTrials.gov; dual screening; dual extraction of critical outcomes; RoB 2; random-effects RR/HR; GRADE SoF.",
        effectMeasure: "RR or HR (time-to-event)",
        maPlan:
          "Random-effects. Pre-specify subgroups by dose/setting. Sensitivity: exclude high RoB and industry-only funded if applicable.",
        prosperoId: "drafting",
        team: "Clinician + methodologist dual review",
      },
    },
  },
  {
    id: "primary-care-lifestyle",
    specialty: "Primary care / public health",
    title: "Lifestyle or behavioural intervention (RCTs)",
    blurb:
      "Diet, exercise, or multi-component lifestyle programmes vs control.",
    stages: {
      question: {
        topic: "Lifestyle intervention for [risk factor / condition] in community settings",
        population: "Adults in primary care or community settings with [risk factor]",
        intervention: "Structured lifestyle programme (diet and/or physical activity)",
        comparator: "Usual care or minimal advice",
        outcomes:
          "Primary: [weight / BP / activity minutes]. Secondary: adherence, QoL, adverse events",
        studyDesign: "rct",
        reviewQuestion:
          "In adults with [risk factor], what is the effect of structured lifestyle programmes compared with usual care on [primary outcome]?",
      },
      eligibility: {
        inclusion:
          "• Community/primary-care adults\n• RCT of lifestyle programme ≥4 weeks\n• Pre-specified anthropometric or behavioural outcome",
        exclusion:
          "• Inpatient-only programmes\n• Pharmacologic co-intervention only arms without lifestyle component of interest\n• Non-RCT",
        languages: "English only (or no restriction)",
        dateLimits: "1990–present",
        publicationStatus: "include_grey",
        edgeCases: "Cluster RCTs by practice: include with ICC note if available.",
      },
      protocol: {
        objectives:
          "Quantify short- and medium-term effects of lifestyle programmes on primary outcome.",
        methodsSummary:
          "Multi-database + trial registries; dual screen; RoB 2; random-effects MD; explore intensity/duration subgroups.",
        effectMeasure: "MD or SMD",
        maPlan: "Random-effects; narrative if programmes too diverse to pool.",
        prosperoId: "drafting",
        team: "Dual review throughout critical stages",
      },
    },
  },
  {
    id: "education-intervention",
    specialty: "Education / social science",
    title: "Educational intervention (RCTs / quasi)",
    blurb:
      "Teaching method or programme vs standard instruction on learning outcomes.",
    stages: {
      question: {
        topic: "Educational intervention effect on student learning outcomes",
        population: "Students in [level: secondary / undergraduate] in [subject]",
        intervention: "[e.g. flipped classroom / peer instruction / tutoring]",
        comparator: "Standard lecture / usual instruction",
        outcomes:
          "Primary: achievement test score. Secondary: engagement, retention, equity gaps",
        studyDesign: "rct_quasi",
        reviewQuestion:
          "In [students], what is the effect of [intervention] compared with usual instruction on academic achievement?",
      },
      eligibility: {
        inclusion:
          "• Defined learner population\n• Comparative study (RCT preferred; quasi if justified)\n• Quantitative learning outcome",
        exclusion:
          "• No comparison group\n• Opinion pieces / qualitative-only\n• Wrong educational level",
        languages: "English only (justify)",
        dateLimits: "2000–present",
        publicationStatus: "include_grey",
        edgeCases: "Cluster by class/school: note unit of analysis.",
      },
      protocol: {
        objectives:
          "Estimate average effect on achievement; describe implementation context.",
        methodsSummary:
          "ERIC + PsycINFO + education databases; dual screen; appropriate RoB tool; SMD meta-analysis if comparable tests.",
        effectMeasure: "SMD (Hedges g)",
        maPlan: "Random-effects; high clinical diversity → structured narrative by intervention type.",
        prosperoId: "not eligible / OSF",
        team: "Dual education researchers",
      },
    },
  },
];

export function getTemplate(id: string): SpecialtyTemplate | undefined {
  return SPECIALTY_TEMPLATES.find((t) => t.id === id);
}
