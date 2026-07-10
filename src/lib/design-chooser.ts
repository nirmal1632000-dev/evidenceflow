import type { DesignId } from "./designs";

export type ChooserAnswer = "yes" | "no" | "unsure";

export interface ChooserQuestion {
  id: string;
  text: string;
  help?: string;
}

/** Ordered questions for the interactive design chooser */
export const CHOOSER_QUESTIONS: ChooserQuestion[] = [
  {
    id: "synthesize",
    text: "Are you combining or summarising multiple existing studies (not recruiting new patients yourself)?",
    help: "Systematic reviews synthesise published (and sometimes unpublished) research.",
  },
  {
    id: "intervention",
    text: "Is the main aim to evaluate an intervention / treatment / program?",
    help: "Includes drugs, procedures, education, policies. Not pure description of a disease snapshot.",
  },
  {
    id: "randomised",
    text: "Will (or did) participants get allocated by randomisation to intervention vs control?",
  },
  {
    id: "comparison",
    text: "Is there a comparison group (control, usual care, unexposed, historical control)?",
  },
  {
    id: "followup",
    text: "Do you follow the same people over time (baseline → later outcomes)?",
  },
  {
    id: "oneTime",
    text: "Is everything measured at roughly one time point (a snapshot / survey)?",
  },
  {
    id: "singleCase",
    text: "Is this essentially one patient (or one clinical event) told in depth?",
  },
  {
    id: "fewCases",
    text: "Is this a small set of patients with the same condition, without a formal control group?",
  },
];

export interface ChooserResult {
  primary: DesignId;
  alternatives: DesignId[];
  rationale: string[];
  confidence: "high" | "moderate" | "low";
}

/**
 * Rule-based classifier — educational, not a substitute for methods advice.
 */
export function classifyDesign(
  answers: Record<string, ChooserAnswer>
): ChooserResult {
  const a = (id: string) => answers[id] || "unsure";

  if (a("synthesize") === "yes") {
    return {
      primary: "sr-ma",
      alternatives: ["cohort", "rct"],
      rationale: [
        "You are synthesising existing studies rather than generating primary patient data.",
        "Use the EvidenceFlow SR/MA workspace (protocol → search → appraisal → synthesis).",
      ],
      confidence: a("synthesize") === "yes" ? "high" : "moderate",
    };
  }

  if (a("singleCase") === "yes" && a("fewCases") !== "yes") {
    return {
      primary: "case-report",
      alternatives: ["case-series", "cross-sectional"],
      rationale: [
        "A single detailed clinical narrative fits a case report structure (CARE-style).",
        "Do not claim comparative effectiveness from n = 1.",
      ],
      confidence: "high",
    };
  }

  if (a("fewCases") === "yes" || (a("singleCase") === "yes" && a("fewCases") === "yes")) {
    return {
      primary: "case-series",
      alternatives: ["case-report", "cohort"],
      rationale: [
        "Multiple similar cases without a formal control arm usually form a case series.",
        "Define inclusion rules and avoid selecting only successes.",
      ],
      confidence: "moderate",
    };
  }

  if (a("intervention") === "yes" && a("randomised") === "yes") {
    return {
      primary: "rct",
      alternatives: ["quasi", "cohort"],
      rationale: [
        "Random allocation to intervention vs control is the hallmark of an RCT.",
        "Plan SPIRIT (protocol) and CONSORT (reporting).",
        "Open the RCT track to draft PICOT, randomisation, and sample size with Watch · Do.",
      ],
      confidence: "high",
    };
  }

  if (a("intervention") === "yes" && a("randomised") === "no" && a("comparison") === "yes") {
    return {
      primary: "quasi",
      alternatives: ["cohort", "rct"],
      rationale: [
        "An intervention with comparison but without randomisation is typically quasi-experimental.",
        "Explicitly list threats to validity (selection, trends, regression to the mean).",
        "Open the Quasi-experimental track to plan ITS/DiD/CBA with Watch · Do.",
      ],
      confidence: a("randomised") === "unsure" ? "low" : "moderate",
    };
  }

  if (a("followup") === "yes" && a("oneTime") !== "yes") {
    return {
      primary: "cohort",
      alternatives: ["cross-sectional", "quasi"],
      rationale: [
        "Following people over time by exposure/risk status points to a cohort design.",
        "Address confounding and loss to follow-up in the protocol.",
        "Open the Cohort track to plan with Watch · Do.",
      ],
      confidence: "moderate",
    };
  }

  if (a("oneTime") === "yes") {
    return {
      primary: "cross-sectional",
      alternatives: ["case-series", "cohort"],
      rationale: [
        "A single-time snapshot (prevalence, survey) is cross-sectional.",
        "Avoid causal language; report sampling and response clearly (STROBE).",
        "Open the Cross-sectional track to plan your study with Watch · Do.",
      ],
      confidence: "moderate",
    };
  }

  return {
    primary: "case-report",
    alternatives: ["cross-sectional", "cohort", "sr-ma"],
    rationale: [
      "Answers were mixed or incomplete — start by clarifying whether you are producing primary data or synthesising studies.",
      "Try the chooser again, or browse design cards on the Designs hub.",
    ],
    confidence: "low",
  };
}
