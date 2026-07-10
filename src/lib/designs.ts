/** Study-design hub: catalog, appraisal flags, future tracks. */

export type DesignId =
  | "case-report"
  | "case-series"
  | "cross-sectional"
  | "cohort"
  | "quasi"
  | "rct"
  | "sr-ma";

export type DesignStatus = "live" | "soon";

export interface DesignTrack {
  id: DesignId;
  title: string;
  shortTitle: string;
  family: "produce" | "synthesize";
  status: DesignStatus;
  summary: string;
  whenToUse: string;
  whenNot: string;
  reportingGuide: string;
  reportingUrl?: string;
  href?: string;
  /** Appraisal red flags (for hub / appraise page) */
  redFlags: string[];
  strengths: string[];
}

export const DESIGN_TRACKS: DesignTrack[] = [
  {
    id: "case-report",
    title: "Case report",
    shortTitle: "Case report",
    family: "produce",
    status: "live",
    summary:
      "Detailed report of one patient (or event) with educational or rare-disease value — guided by CARE-style structure.",
    whenToUse:
      "Rare presentation, unexpected adverse event, novel teaching point, or hypothesis generation from a single case.",
    whenNot:
      "When you need causal effect estimates, prevalence, or comparative effectiveness — one case cannot prove treatment works.",
    reportingGuide: "CARE guidelines (case reports)",
    reportingUrl: "https://www.care-statement.org/",
    href: "/designs/case-report",
    strengths: [
      "Fast to write and teach",
      "Useful for rare conditions and safety signals",
      "Builds clinical narrative skills",
    ],
    redFlags: [
      "Claims of causality or ‘this treatment works’ from n=1",
      "Identifiable patient details without consent",
      "No differential diagnosis or alternative explanations",
      "Missing timeline or follow-up",
      "Selective reporting of only the positive outcome",
    ],
  },
  {
    id: "case-series",
    title: "Case series",
    shortTitle: "Case series",
    family: "produce",
    status: "live",
    summary:
      "Descriptive report of several patients with a shared condition or exposure — still observational and usually uncontrolled.",
    whenToUse:
      "Describing a pattern across multiple similar cases; early safety or feasibility signals.",
    whenNot:
      "Inferring comparative effectiveness without a control group and proper design.",
    reportingGuide: "CARE (adapted) + STROBE where applicable",
    reportingUrl: "https://www.care-statement.org/",
    href: "/designs/case-report?mode=series",
    strengths: [
      "More cases than a single report",
      "Can describe spectrum of disease",
      "Still feasible for early learners",
    ],
    redFlags: [
      "Hidden selection of only ‘successful’ cases",
      "No clear inclusion rule for the series",
      "Overstated generalisability",
      "Missing systematic follow-up definition",
    ],
  },
  {
    id: "cross-sectional",
    title: "Cross-sectional study",
    shortTitle: "Cross-sectional",
    family: "produce",
    status: "live",
    summary:
      "Snapshot of a population at one time — prevalence, associations, surveys.",
    whenToUse: "Prevalence estimates; exploratory associations; needs assessment.",
    whenNot: "Strong claims about cause and effect over time (no temporality).",
    reportingGuide: "STROBE (cross-sectional)",
    reportingUrl: "https://www.strobe-statement.org/",
    href: "/designs/cross-sectional",
    strengths: ["Often faster than longitudinal work", "Good for surveys"],
    redFlags: [
      "Causal language from a single time point",
      "Convenience sample sold as population prevalence",
      "Non-response bias ignored",
      "Unvalidated survey instruments",
    ],
  },
  {
    id: "cohort",
    title: "Cohort study",
    shortTitle: "Cohort",
    family: "produce",
    status: "live",
    summary:
      "Follow people over time by exposure status to observe outcomes — prospective or retrospective.",
    whenToUse:
      "Incidence, prognosis, associations with temporal sequence; when RCT is unethical/impractical.",
    whenNot: "Ignoring confounding; reverse causation in poorly timed measurements.",
    reportingGuide: "STROBE (cohort)",
    reportingUrl: "https://www.strobe-statement.org/",
    href: "/designs/cohort",
    strengths: ["Temporality clearer than cross-sectional", "Multiple outcomes possible"],
    redFlags: [
      "Confounding not addressed",
      "Loss to follow-up poorly handled",
      "Exposure misclassification",
      "Immortal time bias in retrospective designs",
    ],
  },
  {
    id: "quasi",
    title: "Quasi-experimental",
    shortTitle: "Quasi",
    family: "produce",
    status: "live",
    summary:
      "Intervention evaluation without full randomisation (e.g. before–after, ITS, difference-in-differences).",
    whenToUse:
      "Policy/program evaluation when randomisation is not feasible; natural experiments.",
    whenNot: "Treating simple before–after as proof without threats-to-validity analysis.",
    reportingGuide: "TREND / ROBINS-I thinking + transparent assumptions",
    reportingUrl: "https://www.riskofbias.info/",
    href: "/designs/quasi",
    strengths: ["Real-world programs", "Can use routine data"],
    redFlags: [
      "No control for secular trends",
      "Selection into intervention",
      "Regression to the mean",
      "Switching designs after seeing results",
    ],
  },
  {
    id: "rct",
    title: "Randomised controlled trial",
    shortTitle: "RCT",
    family: "produce",
    status: "live",
    summary:
      "Participants randomised to intervention vs control — strongest design for many causal questions about interventions.",
    whenToUse:
      "Comparative effectiveness/safety of interventions when ethical and feasible.",
    whenNot: "When randomisation is unethical or outcome is extremely rare without huge N.",
    reportingGuide: "SPIRIT (protocol) · CONSORT (report)",
    reportingUrl: "https://www.consort-spirit.org/",
    href: "/designs/rct",
    strengths: ["Balances known/unknown confounders in expectation", "Clear causal framework"],
    redFlags: [
      "Unclear randomisation/concealment",
      "Blinding claims without feasibility",
      "Outcome switching",
      "Per-protocol only without ITT discussion",
      "Underpowered ‘negative’ trials over-interpreted",
    ],
  },
  {
    id: "sr-ma",
    title: "Systematic review & meta-analysis",
    shortTitle: "SR / MA",
    family: "synthesize",
    status: "live",
    summary:
      "Find, appraise, and synthesise existing studies — EvidenceFlow’s flagship 11-stage workspace.",
    whenToUse:
      "When primary studies exist and a focused question needs a transparent evidence summary.",
    whenNot: "As a substitute for primary data when no studies exist (empty reviews still possible).",
    reportingGuide: "PRISMA 2020 · Cochrane Handbook · GRADE",
    reportingUrl: "https://www.prisma-statement.org/",
    href: "/workspace",
    strengths: [
      "Comprehensive transparent methods",
      "Can pool effects when appropriate",
      "Supports guidelines and decisions",
    ],
    redFlags: [
      "PubMed-only ‘systematic’ claims",
      "No protocol/registration",
      "Single-reviewer screening for high-stakes reviews",
      "Pooling incomparable interventions",
      "Ignoring risk of bias and certainty",
    ],
  },
];

export function getDesign(id: DesignId): DesignTrack {
  const d = DESIGN_TRACKS.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown design ${id}`);
  return d;
}

export function produceDesigns() {
  return DESIGN_TRACKS.filter((d) => d.family === "produce");
}

export function synthesizeDesigns() {
  return DESIGN_TRACKS.filter((d) => d.family === "synthesize");
}
