import type { Project } from "./types";
import { createEmptyStages } from "./stages";

/** Read-only worked example users can study. */
export function getExampleProject(): Project {
  const stages = createEmptyStages();

  stages.question = {
    status: "complete",
    lessonRead: true,
    quizPassed: true,
    data: {
      topic: "Mindfulness-based interventions for anxiety in university students",
      population: "University / college students (undergraduate or graduate), any country",
      intervention: "Mindfulness-based programs (MBSR, MBCT, or structured mindfulness courses ≥4 sessions)",
      comparator: "Waitlist, no treatment, or usual student support (not another active psychotherapy as primary comparison)",
      outcomes:
        "Primary: validated anxiety symptom scores (e.g. GAD-7, STAI, BAI) post-intervention. Secondary: depression scores, retention, adverse events.",
      studyDesign: "rct",
      reviewQuestion:
        "In university students, what is the effect of structured mindfulness-based interventions compared with waitlist or usual support on anxiety symptom severity?",
    },
  };

  stages.eligibility = {
    status: "complete",
    lessonRead: true,
    quizPassed: true,
    data: {
      inclusion:
        "- RCTs\n- University students\n- Structured mindfulness intervention (≥4 sessions)\n- Comparator: waitlist / no treatment / usual support\n- Reports anxiety outcome with usable data or narrative result",
      exclusion:
        "- Non-randomized designs\n- Single-session interventions only\n- Purely app-based unguided tools without structured program (for this example scope)\n- Populations that are not students",
      languages: "English full text (limitation noted)",
      dateLimits: "No date limit",
      publicationStatus: "include_grey",
      edgeCases: "Cluster RCTs eligible if student-level outcomes reported; multi-arm: use mindfulness vs waitlist arm.",
    },
  };

  stages.protocol = {
    status: "complete",
    lessonRead: true,
    data: {
      objectives:
        "Primary: estimate effect of mindfulness vs waitlist/usual support on anxiety. Secondary: depression, completion rates, harms.",
      methodsSummary:
        "Multi-database search; dual title/abstract and full-text screening; dual extraction for outcomes; RoB 2; random-effects MA of MDs or SMDs; GRADE for primary outcome.",
      effectMeasure: "SMD (Hedges g) if scales differ; MD if same scale",
      maPlan:
        "Random-effects (REML). Report I² and tau². Subgroup: program type (MBSR vs other) exploratory. Sensitivity: exclude high RoB.",
      prosperoId: "Example only — not a real registration (CRD420EXAMPL)",
      team: "Reviewer A (search+screen), Reviewer B (screen+extract), Statistician consult for MA",
    },
  };

  stages.search = {
    status: "complete",
    lessonRead: true,
    data: {
      databases: "MEDLINE, Embase, PsycINFO, CENTRAL, ClinicalTrials.gov; forward citation of key reviews",
      conceptBlocks:
        "1 Students/university\n2 Mindfulness/MBSR/MBCT\n3 Anxiety\n4 RCT filters (validated where available)",
      sampleString:
        '(mindfulness OR MBSR OR MBCT) AND (student* OR university OR college) AND (anxiety OR GAD-7 OR STAI) AND (randomized OR randomised OR RCT)',
      filters: "Humans when available; no language limit in search (screening limited English full text)",
      peerReview: "Librarian PRESS review planned before final run",
      searchLog: "2026-01-15 | MEDLINE | 842 hits\n2026-01-15 | PsycINFO | 611 hits\n(Example numbers)",
    },
  };

  stages.screening = {
    status: "complete",
    lessonRead: true,
    data: {
      identified: 2104,
      duplicates: 690,
      titleAbstractScreened: 1414,
      fullTextAssessed: 86,
      included: 12,
      exclusionReasons:
        "Wrong population: 28\nWrong intervention: 19\nNot RCT: 14\nNo anxiety outcome: 9\nDuplicate cohort: 4",
      processNotes: "Dual independent screening; conflicts resolved by discussion. Piloted on 100 records.",
    },
  };

  stages.extraction = {
    status: "complete",
    lessonRead: true,
    data: {
      formFields:
        "Author year; country; n; % female; intervention type/sessions; comparator; scale; mean/SD/n post; follow-up; funding; conflicts",
      studiesList:
        "Smith 2019 | n=120 | USA | MBSR 8wk vs waitlist\nLee 2021 | n=64 | Korea | MBCT vs usual support\n… (10 more in real review)",
      outcomeDataNotes: "Primary extraction at post-intervention; 4 studies also 3-month follow-up.",
      dualExtraction: "Dual for all outcome data; single for descriptive fields with 20% check.",
      _studies: [
        {
          id: "ex1",
          authorYear: "Smith 2019",
          country: "USA",
          design: "RCT",
          nTotal: "120",
          nInt: "60",
          nCtrl: "60",
          population: "Undergraduates with elevated anxiety",
          intervention: "MBSR 8 weeks",
          comparator: "Waitlist",
          outcome: "STAI trait",
          effect: "SMD −0.45",
          intStats: "42.1 (8.2)",
          ctrlStats: "48.0 (9.1)",
          timepoint: "Post",
          robOverall: "Some concerns",
          notes: "Cluster randomization no",
          funding: "University grant",
        },
        {
          id: "ex2",
          authorYear: "Lee 2021",
          country: "Korea",
          design: "RCT",
          nTotal: "64",
          nInt: "32",
          nCtrl: "32",
          population: "College students",
          intervention: "MBCT 8 weeks",
          comparator: "Usual support",
          outcome: "BAI",
          effect: "MD −4.2",
          intStats: "14.0 (5.1)",
          ctrlStats: "18.2 (6.0)",
          timepoint: "Post",
          robOverall: "Low",
          notes: "",
          funding: "None reported",
        },
      ],
    },
  };

  stages.rob = {
    status: "complete",
    lessonRead: true,
    data: {
      tool: "rob2",
      process: "Two reviewers independently; consensus meetings weekly.",
      summary:
        "5/12 some concerns for deviations from intended interventions; 3/12 high risk for missing outcome data; randomization generally low risk.",
      sensitivityPlan: "Repeat MA excluding high-risk studies for primary outcome.",
    },
  };

  stages.synthesis = {
    status: "complete",
    lessonRead: true,
    data: {
      approach: "both",
      comparability:
        "All RCTs in students with structured mindfulness vs passive controls; scales differ → SMD justified. Programs vary in length → explore heterogeneity.",
      outcomesForMA: "Anxiety post-intervention (k=11); depression (k=8)",
      narrativeStructure: "By comparator type and program intensity; table of study characteristics first.",
    },
  };

  stages.metaanalysis = {
    status: "complete",
    lessonRead: true,
    data: {
      effectMeasure: "smd",
      model: "random",
      softwareUsed: "R metafor + RevMan for figures",
      results:
        "Anxiety SMD −0.42 (95% CI −0.61 to −0.23); k=11; I²≈45%. Direction favors mindfulness.",
      heterogeneityNotes:
        "Moderate inconsistency; shorter programs somewhat smaller effects (exploratory).",
      sensitivity: "Excluding 3 high-RoB studies: SMD −0.38 (−0.58 to −0.18); conclusion stable.",
    },
  };

  stages.grade = {
    status: "complete",
    lessonRead: true,
    data: {
      outcomesGraded: "1) Anxiety post-intervention 2) Depression 3) Discontinuation",
      certaintyRatings:
        "Anxiety: MODERATE — downgraded for risk of bias (missing data in several trials).\nDepression: LOW — RoB + inconsistency.\nDiscontinuation: LOW — imprecision.",
      sofDraft:
        "Mindfulness may reduce anxiety symptoms versus waitlist/usual support (moderate certainty). Absolute effects depend on baseline severity.",
    },
  };

  stages.reporting = {
    status: "in_progress",
    lessonRead: true,
    data: {
      title:
        "Mindfulness-based interventions for anxiety in university students: a systematic review and meta-analysis",
      prismaNotes: "Need full search appendix strings for Embase; add funding statement.",
      limitations:
        "English full-text limit; passive comparators only; short follow-up in most trials; possible unpublished negative studies.",
      conclusions:
        "Structured mindfulness programs probably reduce short-term anxiety symptoms in university students compared with waitlist or usual support, with moderate certainty. Longer-term effects and active comparisons remain uncertain.",
      dataSharing: "Extraction sheet and R script to be posted on OSF upon submission",
    },
  };

  return {
    id: "example-mindfulness-anxiety",
    title: "Example: Mindfulness for student anxiety (worked demo)",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-20T00:00:00.000Z",
    track: "rct-intervention",
    currentStage: "reporting",
    stages,
  };
}
