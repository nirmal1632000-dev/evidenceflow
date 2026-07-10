/** Condensed PRISMA 2020-inspired checklist for learning (not a substitute for full PRISMA). */
export interface PrismaItem {
  id: string;
  section: string;
  label: string;
  tip: string;
}

export const PRISMA_ITEMS: PrismaItem[] = [
  {
    id: "title",
    section: "Title",
    label: "Identify the report as a systematic review (± meta-analysis)",
    tip: "Title should say “systematic review” and “meta-analysis” if applicable.",
  },
  {
    id: "abstract",
    section: "Abstract",
    label: "Structured abstract covering background, methods, results, limitations",
    tip: "Include eligibility, sources, risk of bias, synthesis, and certainty when possible.",
  },
  {
    id: "rationale",
    section: "Introduction",
    label: "Describe rationale and objectives",
    tip: "Link the review question clearly to PICO.",
  },
  {
    id: "eligibility",
    section: "Methods",
    label: "Specify inclusion/exclusion criteria",
    tip: "Study designs, participants, interventions, outcomes, language/date limits.",
  },
  {
    id: "sources",
    section: "Methods",
    label: "List all information sources and dates last searched",
    tip: "Databases + grey literature + registries; exact search dates.",
  },
  {
    id: "search",
    section: "Methods",
    label: "Present full search strategies for all databases (or appendix)",
    tip: "Reproducible strings, not only keywords.",
  },
  {
    id: "selection",
    section: "Methods",
    label: "Describe selection process (dual review, conflict resolution)",
    tip: "Who screened at each stage and how disagreements were resolved.",
  },
  {
    id: "extraction",
    section: "Methods",
    label: "Describe data collection process",
    tip: "Piloted forms, dual extraction for critical data, author contact.",
  },
  {
    id: "rob",
    section: "Methods",
    label: "Describe risk of bias assessment methods",
    tip: "Tool (e.g. RoB 2), domains, dual assessors.",
  },
  {
    id: "effect",
    section: "Methods",
    label: "Specify effect measures and synthesis methods",
    tip: "MD/SMD/RR; fixed vs random; software; when not to pool.",
  },
  {
    id: "heterogeneity",
    section: "Methods",
    label: "Describe methods to assess heterogeneity / sensitivity",
    tip: "I²/tau², subgroups, leave-one-out, exclude high RoB.",
  },
  {
    id: "certainty",
    section: "Methods",
    label: "Describe methods to assess certainty of evidence (GRADE)",
    tip: "Per outcome, with domains for downgrading.",
  },
  {
    id: "flow",
    section: "Results",
    label: "PRISMA flow diagram with counts",
    tip: "Identified, duplicates, screened, full text, included, exclusion reasons.",
  },
  {
    id: "characteristics",
    section: "Results",
    label: "Study characteristics table",
    tip: "Population, intervention, outcomes, funding for each study.",
  },
  {
    id: "rob-results",
    section: "Results",
    label: "Present risk of bias findings",
    tip: "Traffic-light/summary plot + narrative.",
  },
  {
    id: "synthesis-results",
    section: "Results",
    label: "Present results of syntheses (forest plots / narrative)",
    tip: "Effect estimates, CIs, heterogeneity stats.",
  },
  {
    id: "certainty-results",
    section: "Results",
    label: "Present certainty of evidence (SoF / GRADE)",
    tip: "Critical outcomes with plain-language certainty.",
  },
  {
    id: "limitations",
    section: "Discussion",
    label: "Discuss limitations of evidence and of the review process",
    tip: "Search limits, RoB, sparse data, language bias, etc.",
  },
  {
    id: "conclusions",
    section: "Discussion",
    label: "Provide balanced interpretation linked to certainty",
    tip: "Avoid spin; match wording to GRADE levels.",
  },
  {
    id: "funding",
    section: "Other",
    label: "Report funding and competing interests",
    tip: "Required by most journals.",
  },
  {
    id: "registration",
    section: "Other",
    label: "Provide registration / protocol information",
    tip: "PROSPERO/OSF ID and any amendments.",
  },
  {
    id: "availability",
    section: "Other",
    label: "Data, code, and other materials availability",
    tip: "Extraction sheet, analysis scripts when possible.",
  },
];
