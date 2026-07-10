import type { ProcessStep, StageId } from "./types";

/** Ordered process checklist for dual-mode learn + do guidance */
export const PROCESS_STEPS: Record<StageId, ProcessStep[]> = {
  question: [
    {
      id: "q-scope",
      label: "Confirm review type & feasibility",
      detail:
        "Intervention SR of RCTs is the default track. Check that the question is answerable and not impossibly broad.",
    },
    {
      id: "q-pico",
      label: "Write full PICO (and study design)",
      detail:
        "Two reviewers should agree who is in the population and what counts as the intervention.",
    },
    {
      id: "q-outcomes",
      label: "Rank primary vs secondary outcomes",
      detail: "Pre-specify what will drive conclusions and GRADE ratings.",
    },
    {
      id: "q-sentence",
      label: "Lock a one-sentence review question",
      detail: "Use: In [P], what is the effect of [I] vs [C] on [O]?",
    },
    {
      id: "q-team",
      label: "Name who will screen and extract",
      detail: "Plan dual review early — invite collaborators with the project code.",
    },
  ],
  eligibility: [
    {
      id: "e-include",
      label: "List inclusion criteria matching PICO",
      detail: "Population, intervention, comparator, outcomes, designs, setting.",
    },
    {
      id: "e-exclude",
      label: "List exclusion criteria & edge cases",
      detail: "Multi-arm trials, cluster RCTs, mixed populations, abstracts only.",
    },
    {
      id: "e-limits",
      label: "Decide language, date, and grey literature rules",
      detail: "Document justification to avoid selection bias concerns.",
    },
    {
      id: "e-pilot",
      label: "Pilot criteria on 10–20 titles with a second reviewer",
      detail: "Calibrate before full screening; refine wording if disagreement is high.",
    },
  ],
  protocol: [
    {
      id: "p-write",
      label: "Write protocol methods in full",
      detail: "Search, screening, extraction, RoB tool, effect measures, MA rules, subgroups.",
    },
    {
      id: "p-register",
      label: "Register (PROSPERO/OSF) before finishing screening",
      detail: "Paste registry ID into the workspace once available.",
    },
    {
      id: "p-roles",
      label: "Assign roles for dual processes",
      detail: "Who is Reviewer 1 / 2, who resolves conflicts, who runs stats.",
    },
    {
      id: "p-share",
      label: "Share invite code with the team",
      detail: "Everyone works in the same cloud project from their own device.",
    },
  ],
  search: [
    {
      id: "s-sources",
      label: "List databases + grey sources",
      detail: "Do not rely on PubMed alone for a comprehensive SR.",
    },
    {
      id: "s-blocks",
      label: "Build PICO concept blocks + synonyms + controlled vocabulary",
      detail: "MeSH/Emtree + free text; Boolean structure.",
    },
    {
      id: "s-peer",
      label: "Peer-review the search (PRESS) if possible",
      detail: "Librarian or second information specialist preferred.",
    },
    {
      id: "s-run",
      label: "Run searches and log date, platform, hits",
      detail: "Export to Zotero/EndNote; keep exact strings for PRISMA appendix.",
    },
    {
      id: "s-dedupe",
      label: "De-duplicate and record counts",
      detail: "PRISMA flow starts with identification + duplicates removed.",
    },
  ],
  screening: [
    {
      id: "sc-import",
      label: "Import records into Rayyan/Covidence/ASReview",
      detail: "EvidenceFlow stores decisions & counts; specialized tools do bulk screening.",
    },
    {
      id: "sc-pilot",
      label: "Pilot dual screen on a sample",
      detail: "Resolve disagreements and update eligibility notes.",
    },
    {
      id: "sc-tiab",
      label: "Complete title/abstract dual screening",
      detail: "Track conflicts; default to full text when unsure.",
    },
    {
      id: "sc-ft",
      label: "Full-text dual screening with exclusion reasons",
      detail: "Record PRISMA exclusion categories with counts.",
    },
    {
      id: "sc-prisma",
      label: "Update PRISMA numbers in the workspace",
      detail: "Keep both reviewers’ progress visible via cloud sync.",
    },
  ],
  extraction: [
    {
      id: "x-form",
      label: "Finalize extraction form and pilot on 2 studies",
      detail: "Characteristics + outcome data needed for MA.",
    },
    {
      id: "x-dual",
      label: "Dual-extract critical outcome data",
      detail: "Resolve discrepancies; note units and scale direction.",
    },
    {
      id: "x-missing",
      label: "Flag missing data / author contact plan",
      detail: "Document attempts in the workspace.",
    },
    {
      id: "x-table",
      label: "Build characteristics table of included studies",
      detail: "This feeds narrative synthesis and manuscript Table 1.",
    },
  ],
  rob: [
    {
      id: "r-tool",
      label: "Select RoB tool (RoB 2 for RCTs)",
      detail: "Use outcome-level judgments when required.",
    },
    {
      id: "r-dual",
      label: "Dual independent RoB assessment",
      detail: "Support ratings with quotes/page numbers.",
    },
    {
      id: "r-plot",
      label: "Create traffic-light / summary plot (robvis)",
      detail: "Store summary interpretation in the workspace.",
    },
    {
      id: "r-link",
      label: "Link RoB to sensitivity analysis plan",
      detail: "Pre-specify excluding high-risk studies.",
    },
  ],
  synthesis: [
    {
      id: "sy-compare",
      label: "Judge clinical comparability of studies",
      detail: "If too diverse, prefer structured narrative over forced pooling.",
    },
    {
      id: "sy-decide",
      label: "Decide narrative / MA / both per outcome",
      detail: "Write the decision and rationale in the form.",
    },
    {
      id: "sy-structure",
      label: "Plan narrative structure (by outcome or population)",
      detail: "Avoid study-by-study listing without synthesis.",
    },
  ],
  metaanalysis: [
    {
      id: "m-measure",
      label: "Choose effect measure and model",
      detail: "MD/SMD or RR/OR; usually random-effects when studies differ.",
    },
    {
      id: "m-software",
      label: "Run analysis in RevMan or R (or practice calculator)",
      detail: "Paste pooled results, CIs, I², k into the workspace.",
    },
    {
      id: "m-het",
      label: "Investigate heterogeneity",
      detail: "Clinical reasons, subgroups (pre-specified), sensitivity analyses.",
    },
    {
      id: "m-bias",
      label: "Consider small-study / publication bias carefully",
      detail: "Funnel plots unreliable with few studies.",
    },
  ],
  grade: [
    {
      id: "g-outcomes",
      label: "List critical outcomes for SoF",
      detail: "GRADE is per outcome, not one score for the whole review.",
    },
    {
      id: "g-domains",
      label: "Rate domains (RoB, inconsistency, indirectness, imprecision, publication bias)",
      detail: "Use GRADEpro; paste certainty + reasons here.",
    },
    {
      id: "g-sof",
      label: "Draft Summary of Findings messages",
      detail: "Plain language: may / probably / reduces… with certainty.",
    },
  ],
  reporting: [
    {
      id: "rep-prisma",
      label: "Complete PRISMA 2020 checklist mapping",
      detail: "Note remaining gaps in the workspace.",
    },
    {
      id: "rep-flow",
      label: "Finalize PRISMA flow diagram numbers",
      detail: "Must match screening stage counts.",
    },
    {
      id: "rep-limits",
      label: "Write balanced limitations and conclusions",
      detail: "Match certainty of evidence; avoid spin.",
    },
    {
      id: "rep-export",
      label: "Export protocol/full package for manuscript",
      detail: "Share OSF/materials if planned; keep team project as source of truth.",
    },
  ],
};
