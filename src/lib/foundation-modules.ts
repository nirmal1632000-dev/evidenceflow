import { resolveRefs, type Ref } from "./references";
import type { LearnSection } from "./learn-modules";

export type FoundationModuleId = "history" | "philosophy";

export type FoundationModule = {
  id: FoundationModuleId;
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  timeEstimate: string;
  overview: string;
  learningObjectives: string[];
  sections: LearnSection[];
  practiceTasks: string[];
  keyTakeaways: string[];
  selfCheck: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  refIds: string[];
  furtherReading?: { title: string; url: string }[];
};

export const FOUNDATION_ORDER: FoundationModuleId[] = ["history", "philosophy"];

export const FOUNDATION_MODULES: Record<FoundationModuleId, FoundationModule> = {
  history: {
    id: "history",
    number: "F1",
    title: "History of systematic reviews and meta-analysis",
    shortTitle: "History",
    summary:
      "From early statistical pooling and expert narrative reviews to Cochrane, PRISMA, and modern living evidence — why systematic methods emerged.",
    timeEstimate: "45–75 minutes",
    overview:
      "Systematic reviews and meta-analyses did not appear overnight. They grew from failures of unstructured expert reviews, advances in statistics, and a political–scientific movement to use evidence more fairly in health care. Understanding this history explains why today’s rules (protocols, comprehensive search, dual review, RoB, GRADE, PRISMA) exist — and what goes wrong when we skip them.",
    learningObjectives: [
      "Locate early milestones in research synthesis and meta-analysis (pre- and post-1970s)",
      "Explain why narrative expert reviews were criticised and what ‘systematic’ added",
      "Connect Cochrane, EBM, and reporting guidelines (QUOROM/PRISMA) to current practice",
      "Recognise that methods keep evolving (RoB 2, living reviews, automation) — history is unfinished",
    ],
    sections: [
      {
        heading: "Before ‘meta-analysis’ had a name",
        paragraphs: [
          "Combining results across studies is older than the word meta-analysis. In the early 20th century, statisticians explored how to pool findings: Karl Pearson (1904) discussed combining observations from different typhoid inoculation studies; later, Ronald Fisher and others developed methods related to combining significance tests; William Cochran and colleagues advanced methods for combining estimates across experiments.",
          "These early efforts were mostly statistical and agricultural/medical-statistical. They did not yet form a full social technology of ‘systematic review’ with protocolised search, eligibility, and bias assessment as we know it in health care today.",
        ],
        bullets: [
          "Pooling numbers ≠ a systematic review of all relevant evidence.",
          "Early combination methods foreshadowed modern meta-analysis but lacked today’s process standards.",
        ],
      },
      {
        heading: "Glass and the naming of meta-analysis (1970s)",
        paragraphs: [
          "In education and psychology, Gene V. Glass popularised the term meta-analysis in the 1970s for the statistical integration of findings from many studies (famously including work on psychotherapy outcomes). The goal was to move beyond single studies and subjective literature summaries toward a more disciplined synthesis of effect sizes.",
          "This period established meta-analysis as a research genre: code studies, compute effects, pool them, examine moderators. Debates soon followed about apples-and-oranges mixing, quality weighting, and publication bias — debates that still shape methods guidance.",
        ],
      },
      {
        heading: "The problem with traditional medical reviews",
        paragraphs: [
          "By the 1980s, leaders in clinical epidemiology argued that many textbook and journal ‘reviews’ were unsystematic: selective citation, implicit eligibility, and expert opinion dressed as evidence. Cynthia Mulrow’s work (e.g. 1987) highlighted how traditional review articles often failed basic scientific standards.",
          "A famous demonstration of the cost of non-systematic synthesis is the story of cumulative meta-analysis of treatments (e.g. thrombolysis for myocardial infarction): Antman and colleagues (1992) showed that if evidence had been systematically accumulated, effective treatments could have been recognised earlier — while expert recommendations sometimes lagged or conflicted with the pooled data.",
        ],
      },
      {
        heading: "Archie Cochrane, effective care, and the Cochrane Collaboration",
        paragraphs: [
          "Archie Cochrane’s emphasis on randomised evidence and organised evaluation of care (including ideas in Effectiveness and Efficiency) helped inspire a culture of critical appraisal. Iain Chalmers and colleagues built infrastructures for systematically assembling controlled trials (notably in perinatal care) that seeded the Cochrane Collaboration (founded 1993).",
          "Cochrane made systematic reviews a global production system: handbooks, methods groups, centralised trials registers, and a philosophy that reviews should be kept up to date. Even if you never publish a Cochrane review, today’s non-Cochrane SR methods borrow heavily from that infrastructure and culture.",
        ],
      },
      {
        heading: "Evidence-based medicine and the review as a decision tool",
        paragraphs: [
          "Evidence-based medicine (EBM) in the 1990s framed clinical decisions as integrating best research evidence with clinical expertise and patient values (Sackett and colleagues). Systematic reviews and meta-analyses became central ‘best evidence’ products for guidelines and bedside decisions — raising the stakes for transparency and bias control.",
          "Philosophically, this shifted authority: a single famous trial or senior expert narrative was no longer enough when a careful synthesis existed. Practically, it created demand for better search, appraisal, and certainty frameworks (later GRADE).",
        ],
      },
      {
        heading: "Reporting standards: from QUOROM to PRISMA",
        paragraphs: [
          "As meta-analyses multiplied, so did incomplete reporting. The QUOROM statement addressed meta-analysis reporting; it evolved into PRISMA (2009) and PRISMA 2020, which set expectations for how systematic reviews are reported — flow diagrams, full searches, risk of bias, synthesis methods, and more.",
          "Reporting guidelines do not guarantee good methods, but they make methods inspectable. That inspectability is a historical response to opaque reviews that could not be trusted or replicated.",
        ],
      },
      {
        heading: "Bias tools, GRADE, and the modern stack",
        paragraphs: [
          "Risk-of-bias assessment moved from simple quality scales toward domain-based tools (e.g. Cochrane RoB, then RoB 2 for randomised trials; ROBINS-I for non-randomised interventions). GRADE offered a structured way to rate certainty of evidence for decisions, separating ‘statistical significance’ from confidence in the effect.",
          "Together with trial registration norms and open science practices, these tools reflect a historical lesson: synthesis inherits every bias in the primary literature unless methods actively mitigate selection, reporting, and internal-validity problems.",
        ],
      },
      {
        heading: "Where history is heading",
        paragraphs: [
          "Current frontiers include living systematic reviews, rapid reviews, network meta-analysis, automation and machine-learning prioritised screening, and stronger integration with guidelines. Each innovation reopens old philosophical questions: What counts as comprehensive? How much human dual review is enough? When is speed worth a risk to sensitivity?",
          "For learners, the practical moral of history is simple: SR/MA methods are social technologies invented to correct specific failures. If you skip protocol, search, dual review, or RoB, you often reintroduce the failure mode that motivated the method.",
        ],
      },
    ],
    practiceTasks: [
      "Write a half-page timeline: three milestones before 1990 and three after 1990 that affect how you will run your review.",
      "Find one traditional narrative review and one PRISMA-style SR on a similar topic; list three process differences.",
      "In your own words, explain the Antman-style lesson: what goes wrong when experts do not update with cumulative evidence?",
    ],
    keyTakeaways: [
      "Meta-analysis began as statistical combination; systematic review added process to find and appraise studies fairly.",
      "Cochrane and EBM industrialised and legitimised SRs as decision tools.",
      "PRISMA, RoB tools, and GRADE are historical responses to opacity and overconfidence.",
      "Knowing history helps you defend methods choices — not just follow templates.",
    ],
    selfCheck: [
      {
        id: "h1",
        question:
          "Gene V. Glass is most closely associated with which development?",
        options: [
          "Inventing the randomised controlled trial",
          "Popularising the term meta-analysis for quantitative research synthesis",
          "Writing PRISMA 2020",
          "Creating PROSPERO",
        ],
        correctIndex: 1,
        explanation:
          "Glass popularised meta-analysis as quantitative integration of study findings (1970s education/psychology context).",
      },
      {
        id: "h2",
        question:
          "A major criticism of many traditional expert narrative reviews was that they…",
        options: [
          "Used too many databases",
          "Lacked transparent, reproducible methods for selecting and weighing evidence",
          "Always included meta-analysis",
          "Were registered on PROSPERO",
        ],
        correctIndex: 1,
        explanation:
          "Unsystematic reviews often used implicit selection and authority rather than transparent methods.",
      },
      {
        id: "h3",
        question: "PRISMA primarily addresses…",
        options: [
          "How to randomise participants in a trial",
          "Reporting standards for systematic reviews",
          "How to calculate Hedges’ g by hand",
          "Ethics approval for primary data collection",
        ],
        correctIndex: 1,
        explanation:
          "PRISMA is a reporting guideline for systematic reviews (methods transparency in publications).",
      },
    ],
    refIds: [
      "histGlass",
      "histMulrow",
      "histAntman",
      "histChalmers",
      "histCochraneBook",
      "histEbm",
      "histGurevitch",
      "histORourke",
      "prisma2020",
      "cochrane",
      "grade",
    ],
    furtherReading: [
      {
        title: "Cochrane: about Cochrane / our history",
        url: "https://www.cochrane.org/about-us",
      },
      {
        title: "PRISMA statement history & resources",
        url: "https://www.prisma-statement.org/",
      },
    ],
  },

  philosophy: {
    id: "philosophy",
    number: "F2",
    title: "Philosophy of evidence synthesis (why SR & MA claim authority)",
    shortTitle: "Philosophy",
    summary:
      "Epistemology for reviewers: what ‘evidence’ means, why protocols fight bias, limits of hierarchies and pooling, and ethical duties of synthesis.",
    timeEstimate: "45–75 minutes",
    overview:
      "Systematic reviews make a bold claim: that a structured process can produce a more trustworthy answer than a single study or an expert’s memory. That claim is philosophical as much as technical. This module introduces the ideas behind evidence hierarchies, bias as a threat to knowledge, the logic (and limits) of meta-analysis, and the ethics of speaking for a body of evidence.",
    learningObjectives: [
      "Distinguish data, evidence, and recommendations — and where SR/MA sit",
      "Explain protocolisation and pre-specification as epistemic (not just bureaucratic) tools",
      "State limits of evidence hierarchies and of statistical pooling",
      "Articulate ethical responsibilities: transparency, humility, and avoiding spin",
    ],
    sections: [
      {
        heading: "What problem is a systematic review trying to solve?",
        paragraphs: [
          "Science produces many studies that disagree, are biased, or are hard to find. Humans are bad at fairly sampling literature from memory: we favour vivid trials, famous journals, and results that fit our priors (confirmation bias).",
          "A systematic review tries to replace ad hoc sampling with a public procedure: define the question, search comprehensively, select with rules, appraise validity, and synthesise. The philosophical wager is that procedure-plus-transparency beats unaided expertise for population-level claims — while still leaving room for expertise in interpretation and application.",
        ],
      },
      {
        heading: "Evidence is not the same as a study report",
        paragraphs: [
          "A published paper is a claim with methods and data traces — not pure truth. Philosophers and methodologists of medicine emphasise that evidence for clinical effectiveness depends on design, bias, relevance (indirectness), and how results travel to new patients (transportability).",
          "Meta-analysis pools estimates; it does not automatically create high-quality evidence. If every study is confounded or selectively reported, a precise diamond on a forest plot can be a precise summary of biased inputs (garbage-in, garbage-out).",
        ],
        bullets: [
          "Internal validity: do results support a causal claim in the study population?",
          "External validity / applicability: do results matter for your decision context?",
          "Completeness: did we miss studies that would change the picture?",
        ],
      },
      {
        heading: "Why pre-specification is epistemic",
        paragraphs: [
          "Protocols and registration are sometimes mocked as paperwork. Philosophically, they reduce researcher degrees of freedom: the chance to redefine eligibility, outcomes, or analysis after seeing results in a way that favours a preferred story (a review-level analogue of p-hacking and HARKing).",
          "Pre-specification does not forbid learning or amendments; it demands that changes be visible. Transparency converts private analytical flexibility into public, criticisable decisions — closer to an ideal of scientific objectivity as accountability, not as ‘view from nowhere’.",
        ],
      },
      {
        heading: "Hierarchies of evidence — useful maps, dangerous myths",
        paragraphs: [
          "Evidence pyramids that place meta-analyses of RCTs at the top are teaching tools: on average, well-conducted syntheses of low-bias trials support stronger causal inference for intervention effects than anecdote. But hierarchies can mislead.",
          "A poorly conducted meta-analysis of biased trials can be worse than one excellent multicentre RCT. Observational evidence can be crucial for harms, long-term outcomes, or questions that cannot be randomised. GRADE’s approach — rating certainty by domains rather than by study design label alone — is partly a philosophical correction to naive pyramid worship.",
        ],
      },
      {
        heading: "The logic and limits of pooling",
        paragraphs: [
          "Meta-analysis assumes that study-specific estimates inform a common question — a single effect or a distribution of related effects (random-effects thinking). If interventions or populations differ too much, a pooled number may answer no real-world question (the ‘apples and oranges’ problem).",
          "Statistical heterogeneity quantifies variation; it does not by itself decide clinical meaningfulness. Choosing to pool is a judgement about similarity of causal questions, not only about I². Narrative synthesis is not a lesser philosophy — it is sometimes the more honest epistemic product.",
        ],
      },
      {
        heading: "Objectivity, pluralism, and values",
        paragraphs: [
          "Systematic methods aim to constrain bias, but values still enter: which outcomes are ‘critical’, what difference is clinically important, whose perspectives count, and how trade-offs between benefits and harms are framed. Good reviews make those value-laden choices explicit rather than hiding them as pure technique.",
          "Patient involvement, equity considerations, and stakeholder engagement in review questions reflect a philosophical shift: evidence synthesis serves decisions in social contexts, not only academic curiosity.",
        ],
      },
      {
        heading: "Ethics of synthesis",
        paragraphs: [
          "Review authors influence guidelines, funding, and patient care. Ethical duties include: fair searching (not stacking the deck), honest appraisal, proportionate conclusions, declaring conflicts of interest, and avoiding spin — rhetorical inflation of weak findings.",
          "There is also an ethics of omission: failing to update or to include unpublished trials can systematically mislead. Humility in GRADE language (‘may’, ‘low certainty’) is not hedging for its own sake; it is accurate speech under uncertainty.",
        ],
      },
      {
        heading: "How philosophy should change your hands-on work",
        paragraphs: [
          "In EvidenceFlow’s Watch · Do · Teach loop, philosophy is practical: Watch models disciplined process; Do forces you to write rules you can defend; Teach asks you to explain why those rules produce better knowledge claims.",
          "When stuck between ‘pool’ and ‘don’t pool’, or ‘include this borderline trial’, ask: What claim am I entitled to make if I choose this way? Would a sceptical peer see selection or analytical flexibility? That is epistemology at the keyboard.",
        ],
      },
    ],
    practiceTasks: [
      "Write a 150-word defence: why a protocolled SR is more trustworthy than an expert narrative for your question — and one situation where a single RCT might still dominate decision-making.",
      "List two value judgements already embedded in your PICO (e.g. outcome choice). Who might disagree?",
      "Take a forest plot (real or teaching) and write two conclusions: one spun, one GRADE-honest. Compare.",
    ],
    keyTakeaways: [
      "SR/MA are technologies for fair sampling and disciplined inference under bias.",
      "Pre-specification and transparency are knowledge tools, not mere bureaucracy.",
      "Hierarchies and pooled estimates are fallible; certainty rating and applicability matter.",
      "Ethical synthesis means proportionate claims and visible methods.",
    ],
    selfCheck: [
      {
        id: "p1",
        question:
          "Pre-specifying outcomes in a review protocol primarily helps to…",
        options: [
          "Guarantee statistical significance",
          "Reduce undisclosed flexibility that can bias conclusions after seeing results",
          "Replace the need for risk-of-bias assessment",
          "Make narrative synthesis unnecessary",
        ],
        correctIndex: 1,
        explanation:
          "Pre-specification limits post-hoc outcome switching and selective emphasis — an epistemic safeguard.",
      },
      {
        id: "p2",
        question:
          "A meta-analysis of many high-risk-of-bias studies with a narrow confidence interval most likely yields…",
        options: [
          "Automatically high-certainty evidence",
          "A precise estimate that may still be misleading (certainty can remain low)",
          "Proof that random-effects models are unnecessary",
          "Evidence equivalent to a single large low-bias RCT always",
        ],
        correctIndex: 1,
        explanation:
          "Precision is not validity; GRADE may still downgrade heavily for risk of bias.",
      },
      {
        id: "p3",
        question:
          "Choosing not to meta-analyse because studies answer meaningfully different questions is best described as…",
        options: [
          "A failure of the review",
          "An epistemic judgement about comparability, which can be appropriate",
          "Proof that systematic reviews do not work",
          "Only allowed if I² is exactly 0%",
        ],
        correctIndex: 1,
        explanation:
          "Pooling requires a defensible common question; declining to pool can be the rigorous choice.",
      },
    ],
    refIds: [
      "philEbm",
      "philHowick",
      "philCartwright",
      "philIoannidis",
      "grade",
      "gradeHandbook",
      "cochrane",
      "prisma2020",
      "histAntman",
      "amstar",
    ],
    furtherReading: [
      {
        title: "Stanford Encyclopedia / EBM discussions (contextual reading)",
        url: "https://plato.stanford.edu/entries/medicine/",
      },
      {
        title: "GRADE Handbook — philosophy of certainty ratings",
        url: "https://gdt.gradepro.org/app/handbook/handbook.html",
      },
    ],
  },
};

export function getFoundationModule(
  id: string
): FoundationModule | undefined {
  if (id === "history" || id === "philosophy") {
    return FOUNDATION_MODULES[id];
  }
  return undefined;
}

export function getFoundationReferences(id: FoundationModuleId): Ref[] {
  return resolveRefs(FOUNDATION_MODULES[id].refIds);
}

export function allFoundationReferences(): Ref[] {
  const seen = new Set<string>();
  const out: Ref[] = [];
  for (const id of FOUNDATION_ORDER) {
    for (const r of getFoundationReferences(id)) {
      if (!seen.has(r.id)) {
        seen.add(r.id);
        out.push(r);
      }
    }
  }
  return out;
}
