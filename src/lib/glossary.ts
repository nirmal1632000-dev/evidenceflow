import type { GlossaryTerm } from "./types";

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Research synthesis",
    definition:
      "The broader family of methods for combining findings across studies (qualitative or quantitative). Systematic reviews and meta-analyses are formalised forms of research synthesis.",
    related: ["Systematic review (SR)", "Meta-analysis (MA)"],
  },
  {
    term: "Evidence-based medicine (EBM)",
    definition:
      "An approach to clinical practice that integrates the best available research evidence with clinical expertise and patient values/preferences. Systematic reviews are a core EBM product.",
    related: ["Systematic review (SR)", "GRADE"],
  },
  {
    term: "Systematic review (SR)",
    definition:
      "A review that uses explicit, pre-specified methods to identify, select, appraise, and synthesize all relevant studies addressing a focused question.",
    related: ["PRISMA", "Protocol", "Meta-analysis"],
  },
  {
    term: "Meta-analysis (MA)",
    definition:
      "A statistical technique that combines quantitative results from multiple studies to produce a pooled effect estimate, when studies are sufficiently similar.",
    related: ["Forest plot", "Heterogeneity", "Random-effects"],
  },
  {
    term: "PICO",
    definition:
      "Framework for framing questions: Population, Intervention, Comparator, Outcomes. PICOS adds Study design.",
  },
  {
    term: "Protocol",
    definition:
      "A pre-specified plan describing the review question, eligibility, search, methods for bias assessment, and synthesis before results are known.",
    related: ["PROSPERO", "PRISMA-P"],
  },
  {
    term: "PROSPERO",
    definition:
      "An international prospective register of systematic reviews (health-related). Registration improves transparency.",
  },
  {
    term: "PRISMA",
    definition:
      "Preferred Reporting Items for Systematic Reviews and Meta-Analyses — a reporting guideline and flow diagram standard (PRISMA 2020).",
  },
  {
    term: "PRISMA-P",
    definition: "PRISMA extension for writing systematic review protocols.",
  },
  {
    term: "Risk of bias (RoB)",
    definition:
      "The risk that study results systematically deviate from the truth due to limitations in design or conduct. Assessed with tools like RoB 2 or ROBINS-I.",
  },
  {
    term: "RoB 2",
    definition: "Cochrane risk-of-bias tool for randomized trials, organized by bias domains and algorithms.",
  },
  {
    term: "ROBINS-I",
    definition: "Risk Of Bias In Non-randomized Studies of Interventions.",
  },
  {
    term: "Heterogeneity",
    definition:
      "Variation among study results beyond chance. Explored clinically and statistically (e.g. I², tau²). High heterogeneity may argue against a single pooled estimate.",
  },
  {
    term: "I²",
    definition:
      "A statistic describing the percentage of total variation across studies that is due to heterogeneity rather than chance. Interpret with study size and context.",
  },
  {
    term: "Forest plot",
    definition:
      "A graph showing each study’s effect estimate and confidence interval, plus a pooled estimate when meta-analysis is performed.",
  },
  {
    term: "Funnel plot",
    definition:
      "A scatter plot used to explore small-study effects / possible publication bias. Unreliable with few studies.",
  },
  {
    term: "Fixed-effect model",
    definition:
      "Meta-analysis model assuming one true effect (or focusing on a common effect). Also called common-effect in some software.",
  },
  {
    term: "Random-effects model",
    definition:
      "Meta-analysis model allowing the true effect to vary across studies; often more appropriate when studies differ.",
  },
  {
    term: "Mean difference (MD)",
    definition:
      "Difference in means between groups when all studies use the same continuous scale.",
  },
  {
    term: "Standardized mean difference (SMD)",
    definition:
      "Effect size for continuous outcomes on different scales (e.g. Cohen’s d-type metrics). Watch scale direction.",
  },
  {
    term: "Risk ratio (RR)",
    definition: "Ratio of risk of an event in the intervention group to risk in the control group.",
  },
  {
    term: "Odds ratio (OR)",
    definition:
      "Ratio of odds of an event between groups. Often used in logistic models; interpret carefully vs RR.",
  },
  {
    term: "GRADE",
    definition:
      "Framework for rating certainty of evidence for outcomes, considering RoB, inconsistency, indirectness, imprecision, and publication bias.",
  },
  {
    term: "Summary of Findings (SoF)",
    definition:
      "A table presenting key outcomes, effect estimates, absolute effects, and GRADE certainty ratings for decision-makers.",
  },
  {
    term: "Grey literature",
    definition:
      "Evidence not published in traditional peer-reviewed journals (theses, reports, conference abstracts, registries).",
  },
  {
    term: "Publication bias",
    definition:
      "Bias from studies being published (or not) depending on results — often favoring significant/positive findings.",
  },
  {
    term: "Sensitivity analysis",
    definition:
      "Repeating analysis under alternative decisions (e.g. exclude high RoB studies) to test robustness of conclusions.",
  },
  {
    term: "Subgroup analysis",
    definition:
      "Comparing effects in subsets of studies or participants. High risk of false findings if not pre-specified.",
  },
  {
    term: "Narrative synthesis",
    definition:
      "Structured qualitative combination of findings when meta-analysis is inappropriate or data are incomplete.",
  },
  {
    term: "PRESS",
    definition:
      "Peer Review of Electronic Search Strategies — checklist for critiquing bibliographic search quality.",
  },
  {
    term: "MECIR",
    definition:
      "Methodological Expectations of Cochrane Intervention Reviews — standards for Cochrane reviews.",
  },
  {
    term: "Dual review",
    definition:
      "Two people independently screen or extract data, then resolve disagreements — reduces errors and bias.",
  },
];
