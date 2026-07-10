import { resolveRefs, type Ref } from "./references";

export interface SoftwareItem {
  /** URL slug for /tools/software/[slug] */
  slug: string;
  name: string;
  category: string;
  free: boolean;
  /** One-line summary */
  bestFor: string;
  url?: string;
  stageIds: string[];
  /** Who should pick this */
  audience: string;
  pros: string[];
  cons: string[];
  /** When to choose it in an SR pipeline */
  whenToUse: string[];
  /** Step-by-step how to use in a review */
  howToUse: string[];
  /** Common mistakes / pitfalls */
  pitfalls: string[];
  /** What EvidenceFlow still holds vs this tool */
  withEvidenceFlow: string;
  /** Reference ids from REFS */
  refIds: string[];
  furtherReading?: { title: string; url: string }[];
}

export const SOFTWARE_CATALOG: SoftwareItem[] = [
  {
    slug: "zotero",
    name: "Zotero",
    category: "Reference management",
    free: true,
    bestFor:
      "Collecting records and PDFs, organising libraries, citations, and basic de-duplication for student and small-team reviews.",
    url: "https://www.zotero.org/",
    stageIds: ["search", "screening", "extraction", "reporting"],
    audience: "Students, solo reviewers, small teams wanting a free, open workflow.",
    pros: [
      "Free and open-source with generous free cloud storage tier; ZoteroBib for quick cites",
      "Browser connector captures records from PubMed, Google Scholar, publisher sites",
      "Groups allow shared libraries for dual review teams",
      "Word / LibreOffice / Google Docs plugins for citations and bibliographies",
      "Stores PDFs and notes attached to items; tags and collections map well to SR stages",
    ],
    cons: [
      "De-duplication is less automated than EndNote or dedicated SR platforms at very large scale",
      "Not a dual-screening decision tool — you still need Rayyan/Covidence (or similar) for bulk screening",
      "Cloud storage beyond free tier needs payment or self-hosted WebDAV",
      "Collaboration is weaker than Covidence for conflict workflows and audit trails",
    ],
    whenToUse: [
      "After database searches: import RIS/NBIB/CSV exports into a dedicated collection per source",
      "Before screening: de-duplicate and export a clean set to Rayyan/Covidence",
      "During extraction/reporting: attach PDFs, cite included studies, build reference lists",
    ],
    howToUse: [
      "Create a group library (or personal library with clear collections): Search runs, Duplicates, Screen, Included, Excluded full text.",
      "Install the Zotero Connector; for each database, export or capture results and store source name + date in a note or collection title.",
      "Run Duplicate Items; merge carefully (prefer complete metadata + PDF).",
      "Export the de-duplicated set (RIS) for screening software; keep Zotero as the master bibliographic store.",
      "For the manuscript, use the word-processor plugin and a journal CSL style; export final bibliography from the Included collection.",
    ],
    pitfalls: [
      "Importing without recording database + date breaks PRISMA reproducibility.",
      "Auto-merge duplicates can merge distinct records (e.g. protocol vs results paper) — check manually.",
      "Relying on Zotero alone for dual abstract screening is inefficient and hard to audit.",
    ],
    withEvidenceFlow:
      "Log search strings, hit counts, and PRISMA numbers in EvidenceFlow; keep Zotero as the citation/PDF library. Link study IDs between extraction table and Zotero keys if helpful.",
    refIds: ["prisma2020", "cochrane", "press"],
    furtherReading: [
      {
        title: "Zotero documentation",
        url: "https://www.zotero.org/support/",
      },
    ],
  },
  {
    slug: "endnote",
    name: "EndNote",
    category: "Reference management",
    free: false,
    bestFor:
      "Institutional citation management, large libraries, and power-user de-duplication common in university hospitals.",
    url: "https://endnote.com/",
    stageIds: ["search", "screening"],
    audience: "Teams with institutional licences; reviewers already trained on EndNote.",
    pros: [
      "Mature de-duplication and large-library performance",
      "Deep integration with many institutional subscriptions and Word",
      "Familiar to many medical librarians and SR service teams",
      "Strong import filters for major databases",
    ],
    cons: [
      "Paid licence (costly for individuals without access)",
      "Still not a full dual-screening product (use with Covidence/Rayyan)",
      "Vendor lock-in and steeper learning curve for new students",
      "Cloud/sync and version differences can confuse multi-device teams",
    ],
    whenToUse: [
      "When your library or methods unit standardises on EndNote for SR support",
      "Large multi-database imports where librarian-built workflows already exist",
    ],
    howToUse: [
      "Create a library dedicated to the review; import each database export into a group with date stamped.",
      "Use Find Duplicates with agreed field rules; document the de-duplication method for PRISMA.",
      "Export the clean set to your screening tool; keep EndNote for PDFs and citing.",
      "Align citation style with target journal early to avoid end-stage reformatting.",
    ],
    pitfalls: [
      "Different EndNote versions on co-authors’ machines cause style/field conflicts.",
      "Not documenting de-duplication rules undermines reproducibility.",
    ],
    withEvidenceFlow:
      "EvidenceFlow does not replace EndNote. Use EndNote for library management; put eligibility, PRISMA counts, and decisions in EvidenceFlow.",
    refIds: ["prisma2020", "cochrane"],
  },
  {
    slug: "rayyan",
    name: "Rayyan",
    category: "Screening",
    free: true,
    bestFor:
      "Collaborative title/abstract (and full-text) screening with blinding — popular free option for students and small teams.",
    url: "https://www.rayyan.ai/",
    stageIds: ["screening"],
    audience: "Students and small teams needing dual screening without Covidence cost.",
    pros: [
      "Free tier widely used in teaching and thesis SRs",
      "Blinded dual screening reduces influence between reviewers",
      "Mobile-friendly; keyboard shortcuts speed large sets",
      "Labels, exclusions reasons, and filters help organise decisions",
      "Easy invite of collaborators via email",
    ],
    cons: [
      "Free tier limits and feature changes over time — check current plan limits",
      "Less structured extraction than Covidence; weaker enterprise audit features",
      "AI suggestions (if used) must not replace human eligibility judgement",
      "PRISMA counting still needs careful export/reconciliation in your log",
    ],
    whenToUse: [
      "After de-duplication in Zotero/EndNote when you have hundreds–thousands of records",
      "When you need dual independent title/abstract screening on a budget",
    ],
    howToUse: [
      "Create a review; invite Reviewer 2; agree on labels (e.g. maybe, wrong P, wrong I).",
      "Upload RIS/CSV from your reference manager; confirm total matches your de-duplicated count.",
      "Enable blinding; both reviewers screen independently; then unblind and resolve conflicts.",
      "Export decisions; update EvidenceFlow PRISMA fields (screened, conflicts, full-text counts).",
      "Move included abstracts to full-text screening (in Rayyan or another tool) with exclusion reasons.",
    ],
    pitfalls: [
      "Screening without a written eligibility sheet causes high conflict rates.",
      "Not piloting 50–100 records before full dual screening wastes time.",
      "Counting Rayyan totals that don’t match the PRISMA ‘after duplicates’ number.",
    ],
    withEvidenceFlow:
      "Rayyan = bulk decisions. EvidenceFlow = eligibility text, dual-review process notes, conflict log highlights, and PRISMA numbers for the manuscript.",
    refIds: ["prisma2020", "cochrane", "kappa", "mep"],
    furtherReading: [
      {
        title: "Rayyan help center",
        url: "https://www.rayyan.ai/",
      },
    ],
  },
  {
    slug: "asreview",
    name: "ASReview",
    category: "Screening",
    free: true,
    bestFor:
      "Open-source AI-aided prioritisation of records so humans see likely includes sooner — decisions remain human.",
    url: "https://asreview.nl/",
    stageIds: ["screening"],
    audience: "Tech-comfortable reviewers facing very large result sets who can document AI-assisted methods.",
    pros: [
      "Free, open-source, active research community",
      "Can reduce time to find the bulk of relevant studies in large corpora",
      "Transparent research literature on stopping rules and simulation",
      "Keeps human-in-the-loop classification",
    ],
    cons: [
      "Learning curve; installation and data prep required",
      "AI prioritisation can miss studies if stopping rules are aggressive — risk of bias in selection",
      "Not a full dual-review conflict UI like Covidence",
      "Methods must be carefully reported (PRISMA / handbook expectations for new tech)",
    ],
    whenToUse: [
      "Very large searches where exhaustive dual screening of all records is infeasible",
      "When protocol pre-specifies AI-assisted screening and stopping rules",
    ],
    howToUse: [
      "Export a clean, de-duplicated dataset with titles/abstracts.",
      "Label a seed set of includes/excludes; train the model; screen in priority order.",
      "Pre-specify and document a stopping rule (e.g. long run of excludes); do not stop ad hoc after seeing results.",
      "Still dual-review critical decisions where possible; report software version and parameters.",
      "Reconcile final included set and counts in EvidenceFlow PRISMA fields.",
    ],
    pitfalls: [
      "Treating AI rank as an inclusion decision.",
      "Not reporting that AI prioritisation was used (transparency issue).",
      "Stopping too early and missing relevant studies.",
    ],
    withEvidenceFlow:
      "Document in protocol + screening process notes that ASReview was used, with version and stopping rule. Keep final PRISMA arithmetic in EvidenceFlow.",
    refIds: ["prisma2020", "cochrane", "mep"],
    furtherReading: [
      {
        title: "ASReview documentation",
        url: "https://asreview.nl/",
      },
    ],
  },
  {
    slug: "covidence",
    name: "Covidence",
    category: "Screening & extraction",
    free: false,
    bestFor:
      "Institutional gold-standard workflow for dual screening, conflict resolution, and structured extraction with audit trails.",
    url: "https://www.covidence.org/",
    stageIds: ["screening", "extraction"],
    audience: "Funded teams, Cochrane-adjacent groups, institutions with licences.",
    pros: [
      "Purpose-built dual screening and extraction with clear reviewer roles",
      "Conflict queues and consensus workflows reduce process chaos",
      "PRISMA-oriented counts and exports help reporting",
      "Strong for multi-reviewer, multi-stage projects",
    ],
    cons: [
      "Paid — barrier for independent students without institutional access",
      "Less flexible than custom spreadsheets for unusual extraction designs",
      "Still need separate tools for RoB visualisations, GRADE, and advanced MA",
      "Import/export quirks require librarian or experienced user support sometimes",
    ],
    whenToUse: [
      "Team reviews with budget/licence and need for defensible dual processes",
      "When auditability for supervisors or funders matters",
    ],
    howToUse: [
      "Create a review; set inclusion criteria text (mirror EvidenceFlow eligibility).",
      "Import references; assign dual screeners; resolve conflicts via discussion/third reviewer.",
      "Build extraction forms matching your protocol; dual-extract critical outcomes.",
      "Export study data for RevMan/R and update EvidenceFlow readiness fields / study table.",
    ],
    pitfalls: [
      "Starting extraction forms before piloting on 2–3 studies.",
      "Letting Covidence criteria drift from the registered protocol.",
    ],
    withEvidenceFlow:
      "Use Covidence for bulk process; use EvidenceFlow for learning, protocol narrative, readiness, teach-back, and manuscript-oriented exports.",
    refIds: ["prisma2020", "cochrane", "mep"],
  },
  {
    slug: "sr-accelerator",
    name: "SR-Accelerator",
    category: "Search tools",
    free: true,
    bestFor:
      "Helpers around systematic review searching (e.g. Polyglot search translation) — always human-validate output.",
    url: "https://sr-accelerator.com/",
    stageIds: ["search"],
    audience: "Reviewers building multi-database strategies who want translation aids.",
    pros: [
      "Speeds translation of search concepts across database syntaxes",
      "Free web tools accessible without local installs",
      "Useful teaching demos of how syntax differs by platform",
    ],
    cons: [
      "Automated translation can introduce errors — never paste blindly into final search",
      "Does not replace librarian expertise or PRESS peer review",
      "Tool interfaces change; document versions/dates of use",
    ],
    whenToUse: [
      "After a validated MEDLINE/PubMed strategy, when translating to Embase/other interfaces",
      "Teaching sessions on search syntax differences",
    ],
    howToUse: [
      "Finalise a peer-reviewed strategy in one primary database first.",
      "Use translation helpers as a draft only; line-by-line check controlled vocabulary and field codes.",
      "Run PRESS or librarian review on each major database string.",
      "Log final strings + hits in EvidenceFlow search stage.",
    ],
    pitfalls: [
      "Publishing auto-translated strings without validation.",
      "Forgetting database-specific subject headings (MeSH vs Emtree).",
    ],
    withEvidenceFlow:
      "Paste validated concept blocks and final strings into EvidenceFlow Search fields; record who peer-reviewed the strategy.",
    refIds: ["press", "cochrane", "prisma2020"],
  },
  {
    slug: "pubmed",
    name: "PubMed",
    category: "Database",
    free: true,
    bestFor:
      "Free public interface to MEDLINE and related citations — necessary for many health SRs but rarely sufficient alone.",
    url: "https://pubmed.ncbi.nlm.nih.gov/",
    stageIds: ["search"],
    audience: "All health SR beginners; anyone without paid database access.",
    pros: [
      "Free worldwide access",
      "Excellent for teaching MeSH + free-text combination",
      "Clinical Queries and filters available (use carefully)",
      "Easy export to reference managers",
    ],
    cons: [
      "Coverage is not the entire biomedical literature — missing Embase-only and other unique content",
      "Relying on PubMed alone undercuts claims of comprehensive search",
      "Interface filters can hide studies if misapplied",
      "Not a trials register substitute",
    ],
    whenToUse: [
      "As one core bibliographic source in a multi-database plan",
      "To develop and test concept blocks before translating elsewhere",
    ],
    howToUse: [
      "Build PICO concept blocks; map to MeSH + text words.",
      "Prefer Advanced Search; save History; export full strategy for the appendix.",
      "Record date searched, interface (PubMed), and hit count in EvidenceFlow.",
      "Export results to Zotero/EndNote; never screen only inside PubMed for a full SR.",
    ],
    pitfalls: [
      "Calling a PubMed-only search a systematic review without justification.",
      "Using overly aggressive filters (e.g. free full text) that bias the set.",
    ],
    withEvidenceFlow:
      "Store the PubMed string, date, and hits in the Search stage; plan additional databases in the same form.",
    refIds: ["press", "cochrane", "prisma2020", "mep"],
  },
  {
    slug: "cochrane-library",
    name: "Cochrane Library / CENTRAL",
    category: "Database",
    free: true,
    bestFor:
      "CENTRAL for controlled trials; Cochrane Database of Systematic Reviews for existing reviews and methods examples.",
    url: "https://www.cochranelibrary.com/",
    stageIds: ["search", "question"],
    audience: "Intervention SRs of trials; teams checking existing Cochrane reviews before starting.",
    pros: [
      "CENTRAL is a key source for RCTs/controlled trials",
      "Cochrane reviews model high methodological standards",
      "Helpful for scoping whether a question is already answered",
      "Training materials align with the Handbook",
    ],
    cons: [
      "Access to some full content may depend on national/institutional licences",
      "Not a substitute for MEDLINE/Embase/topic databases",
      "Search syntax differs from PubMed — strategies must be adapted",
    ],
    whenToUse: [
      "Nearly always for health intervention SR/MA of trials",
      "Early: search existing Cochrane reviews to refine PICO",
    ],
    howToUse: [
      "Search CDSR for overlapping reviews; cite and justify your incremental contribution.",
      "Search CENTRAL with trial-focused strategy; export and de-duplicate with other sources.",
      "Document platform access (who has licence) and search dates.",
    ],
    pitfalls: [
      "Skipping CENTRAL in an RCT-only review without strong justification.",
      "Treating an old Cochrane review as current without checking updates.",
    ],
    withEvidenceFlow:
      "Note CENTRAL hits in the search log; use example Cochrane methods when writing protocol fields.",
    refIds: ["cochrane", "mep", "prisma2020"],
  },
  {
    slug: "prospero",
    name: "PROSPERO",
    category: "Registration",
    free: true,
    bestFor:
      "Prospective registration of eligible health-related systematic reviews to timestamp methods.",
    url: "https://www.crd.york.ac.uk/prospero/",
    stageIds: ["protocol"],
    audience: "Health SR teams whose review type is eligible for PROSPERO.",
    pros: [
      "Free and widely recognised by journals and funders",
      "Improves transparency and reduces undeclared protocol changes",
      "Public record supports trust in the review process",
      "Structured fields force methods thinking early",
    ],
    cons: [
      "Not all review types are eligible — check scope before relying on it",
      "Registration is not peer-reviewed methods approval",
      "Updates/amendments need discipline; stale records exist",
      "Filling fields is time-consuming for first-time users",
    ],
    whenToUse: [
      "After draft protocol methods exist, before screening is finished (ideally earlier)",
      "When journal or thesis rules expect registration",
    ],
    howToUse: [
      "Confirm eligibility on the PROSPERO site.",
      "Draft full methods offline (EvidenceFlow protocol stage helps).",
      "Submit; store CRD number in EvidenceFlow; update if methods change with justification.",
      "Cite registration in the manuscript methods/PRISMA items.",
    ],
    pitfalls: [
      "Registering after results are known (undermines purpose).",
      "Copy-pasting vague methods that omit synthesis/RoB plans.",
    ],
    withEvidenceFlow:
      "Write protocol fields here first, then transfer to PROSPERO; paste CRD ID back into the Protocol stage.",
    refIds: ["prospero", "prismaP", "amstar"],
  },
  {
    slug: "osf",
    name: "OSF (Open Science Framework)",
    category: "Registration & sharing",
    free: true,
    bestFor:
      "Open protocol registration, preregistration, and sharing data/code/materials when PROSPERO is unsuitable or as a complement.",
    url: "https://osf.io/",
    stageIds: ["protocol", "reporting"],
    audience: "Any discipline needing open materials; reviews outside PROSPERO scope.",
    pros: [
      "Free, flexible project structure for files, wikis, registrations",
      "Supports open data, code, and appendices linked to the paper",
      "Works across disciplines beyond health",
      "Versioning and DOIs for components",
    ],
    cons: [
      "Less SR-specific structure than PROSPERO forms",
      "Organisation quality depends on the team — easy to become a junk drawer",
      "Does not replace database searching or analysis software",
    ],
    whenToUse: [
      "Protocol registration alternative or supplement",
      "End-stage: share search strings, extraction sheets, analysis code",
    ],
    howToUse: [
      "Create a project; set privacy; add contributors with clear roles.",
      "Register a protocol snapshot before analysis where appropriate.",
      "Upload PRISMA materials, data, and code at publication time; link from the paper.",
    ],
    pitfalls: [
      "Uploading identifiable patient-level data without ethics clearance.",
      "Registering empty projects with no actual methods content.",
    ],
    withEvidenceFlow:
      "Export Markdown/CSV packages from EvidenceFlow to OSF; put the OSF link in Reporting stage data-sharing field.",
    refIds: ["prisma2020", "icmje", "prismaP"],
  },
  {
    slug: "revman",
    name: "RevMan Web",
    category: "Meta-analysis",
    free: true,
    bestFor:
      "Cochrane-style comparisons, forest plots, and first pairwise meta-analyses with a guided interface.",
    url: "https://revman.cochrane.org/",
    stageIds: ["extraction", "metaanalysis"],
    audience: "Beginners doing pairwise MA; Cochrane-oriented teams.",
    pros: [
      "Free RevMan Web access for many users; forest plots are publication-familiar",
      "Structures comparisons/outcomes like Cochrane reviews",
      "Lower coding barrier than R for first analyses",
      "Good teaching bridge from extraction tables to pooled effects",
    ],
    cons: [
      "Less flexible than R for complex models, meta-regression, advanced diagnostics",
      "Some workflows still feel “Cochrane-shaped” if your review is not",
      "Reproducibility is weaker than script-based analyses unless you export carefully",
      "Not ideal for network meta-analysis or highly custom models",
    ],
    whenToUse: [
      "First pairwise MA of MD/SMD or dichotomous outcomes",
      "When supervisors expect classic forest plots quickly",
    ],
    howToUse: [
      "Define comparisons and outcomes matching your protocol.",
      "Enter arm-level or contrast-level data carefully (watch scale direction).",
      "Choose fixed/random models per protocol; inspect heterogeneity.",
      "Export plots/data; paste plain-language results into EvidenceFlow Meta-analysis stage.",
      "For advanced needs, migrate data to R metafor with the same study set.",
    ],
    pitfalls: [
      "Entering SMD data with inconsistent scale directions.",
      "Running many unplanned subgroups until one is significant.",
    ],
    withEvidenceFlow:
      "Use EvidenceFlow extraction table + MA calculators to learn; use RevMan for “official” teaching/production forest plots; store interpretation text here.",
    refIds: ["cochrane", "dersimonian", "i2", "hedges"],
    furtherReading: [
      {
        title: "RevMan Web",
        url: "https://revman.cochrane.org/",
      },
    ],
  },
  {
    slug: "r-metafor",
    name: "R + metafor / meta",
    category: "Meta-analysis",
    free: true,
    bestFor:
      "Reproducible, flexible meta-analysis: REML, influence diagnostics, meta-regression, custom plots.",
    url: "https://cran.r-project.org/package=metafor",
    stageIds: ["metaanalysis"],
    audience: "Reviewers comfortable with scripts or collaborating with a statistician.",
    pros: [
      "Fully reproducible scripts (version-controllable)",
      "State-of-the-art estimators and diagnostics beyond basic DL teaching tools",
      "Publication-quality plots and extensions (e.g. meta-regression)",
      "Free and extensible ecosystem",
    ],
    cons: [
      "Steep learning curve if you have never coded",
      "Easy to run invalid models without understanding assumptions",
      "Environment setup (R, packages, versions) needs documentation",
      "Overkill for a two-study simple MD if RevMan would suffice",
    ],
    whenToUse: [
      "Thesis/publication analyses needing transparency and sensitivity analyses",
      "Heterogeneous evidence requiring careful modelling and diagnostics",
    ],
    howToUse: [
      "Export a clean study-level dataset (CSV) from extraction.",
      "Compute yi/vi or use escalc(); fit rma() models pre-specified in the protocol.",
      "Run influence/leave-one-out, report τ² and prediction intervals where appropriate.",
      "Archive script + sessionInfo() on OSF; summarise results in EvidenceFlow.",
    ],
    pitfalls: [
      "Copy-pasting code without checking effect direction and variance.",
      "Data dredging with many meta-regressors on sparse studies.",
    ],
    withEvidenceFlow:
      "Learn concepts with in-app calculators; perform definitive analysis in R; paste pooled results and heterogeneity notes into the Meta-analysis stage.",
    refIds: ["cochrane", "dersimonian", "i2", "hedges", "egger"],
    furtherReading: [
      {
        title: "metafor package site",
        url: "https://www.metafor-project.org/",
      },
    ],
  },
  {
    slug: "stata",
    name: "Stata",
    category: "Meta-analysis",
    free: false,
    bestFor:
      "meta suite for users already working in Stata environments (many epidemiology units).",
    stageIds: ["metaanalysis"],
    audience: "Labs/courses standardised on Stata licences.",
    pros: [
      "Integrated meta commands with familiar Stata workflow",
      "Good for teams that already analyse primary studies in Stata",
      "Reproducible do-files when well written",
    ],
    cons: [
      "Licence cost",
      "Less universal than R for open sharing of code among mixed teams",
      "Still requires solid methods knowledge — GUI/do-file does not prevent misuse",
    ],
    whenToUse: [
      "When your supervisor/statistician works in Stata",
      "When institutional support and teaching materials are Stata-based",
    ],
    howToUse: [
      "Prepare a study-level dataset; label effects consistently.",
      "Use meta suite per protocol (model, measure).",
      "Export forest plots; archive do-files with the project.",
      "Transfer numerical results into EvidenceFlow for narrative and GRADE.",
    ],
    pitfalls: [
      "Undocumented do-files that nobody can rerun later.",
      "Mixing effect measures without transformation.",
    ],
    withEvidenceFlow:
      "Stata remains the analysis engine; EvidenceFlow stores interpretation, GRADE, and reporting checklists.",
    refIds: ["cochrane", "i2"],
  },
  {
    slug: "cma",
    name: "Comprehensive Meta-Analysis (CMA)",
    category: "Meta-analysis",
    free: false,
    bestFor:
      "Point-and-click meta-analysis for teams that prefer a commercial GUI over code.",
    url: "https://www.meta-analysis.com/",
    stageIds: ["metaanalysis"],
    audience: "Groups with CMA licences and limited programming support.",
    pros: [
      "Approachable GUI for many effect-size conversions",
      "Quick forest plots and common moderator analyses",
      "Used in some teaching programs",
    ],
    cons: [
      "Paid licence",
      "Reproducibility and transparency weaker than open scripts unless exports are archived carefully",
      "Risk of “button clicking” without understanding models",
      "Less flexible than R for custom methods",
    ],
    whenToUse: [
      "When CMA is the lab standard and peer support exists",
    ],
    howToUse: [
      "Enter study data with a codebook; lock analysis choices to the protocol.",
      "Run primary model + pre-specified sensitivity analyses only.",
      "Export results/plots; store files with the review package.",
    ],
    pitfalls: [
      "Trying every moderator until something is significant.",
      "Not exporting the underlying data table for audit.",
    ],
    withEvidenceFlow:
      "Use CMA for computation if required; keep decision rules and GRADE in EvidenceFlow.",
    refIds: ["cochrane", "i2", "dersimonian"],
  },
  {
    slug: "rob2",
    name: "riskofbias.info / RoB 2",
    category: "Risk of bias",
    free: true,
    bestFor:
      "Official RoB 2 guidance, Excel tools, and training resources for randomised trials.",
    url: "https://www.riskofbias.info/",
    stageIds: ["rob"],
    audience: "Anyone assessing RCTs in an intervention SR.",
    pros: [
      "Authoritative RoB 2 methods (Sterne et al.)",
      "Free guidance, templates, and examples",
      "Domain-based judgements beat crude quality scores",
      "Aligns with Cochrane expectations",
    ],
    cons: [
      "Time-consuming if done properly (especially dual assessment)",
      "Requires training — novices underrate bias or overrate it inconsistently",
      "Outcome-specific assessments multiply workload",
    ],
    whenToUse: [
      "For every included RCT on critical outcomes",
      "Before GRADE and sensitivity analyses",
    ],
    howToUse: [
      "Read the RoB 2 guidance for your trial design variant.",
      "Assess domains with quotes/page notes; dual-assess and consensus.",
      "Record overall judgement per outcome as required.",
      "Feed high-risk studies into pre-specified sensitivity analyses and GRADE.",
      "Visualise with robvis; summarise narrative in EvidenceFlow RoB stage.",
    ],
    pitfalls: [
      "Using a 0–10 quality score instead of RoB 2.",
      "Judging by journal prestige or writing quality.",
    ],
    withEvidenceFlow:
      "Use RoB 2 templates externally; store tool choice, process, summary, and grid notes in EvidenceFlow.",
    refIds: ["rob2", "cochrane", "grade"],
    furtherReading: [
      {
        title: "RoB 2 resources",
        url: "https://www.riskofbias.info/",
      },
    ],
  },
  {
    slug: "robvis",
    name: "robvis",
    category: "Risk of bias",
    free: true,
    bestFor:
      "Traffic-light and summary weighted bar plots of risk-of-bias judgements for manuscripts.",
    url: "https://www.riskofbias.info/welcome/robvis-visualization-tool",
    stageIds: ["rob", "reporting"],
    audience: "Anyone who has completed RoB judgements and needs figures.",
    pros: [
      "Free and designed for RoB 2 / ROBINS-I style outputs",
      "Publication-ready figure types editors recognise",
      "Encourages complete domain data entry",
    ],
    cons: [
      "Garbage-in, garbage-out — pretty plots of poor judgements still mislead",
      "Does not perform the RoB assessment itself",
      "Formatting tweaks may still be needed for some journals",
    ],
    whenToUse: [
      "After dual RoB consensus, before finalising results/figures",
    ],
    howToUse: [
      "Export or type domain judgements into the robvis template format.",
      "Generate traffic-light and summary plots.",
      "Interpret in text: which domains drive high risk.",
      "File figures with the manuscript package; mention tool in methods.",
    ],
    pitfalls: [
      "Publishing plots without narrative interpretation.",
      "Inconsistent study labels vs forest plots.",
    ],
    withEvidenceFlow:
      "Keep RoB narrative and sensitivity plan in EvidenceFlow; attach or cite robvis figures in Reporting.",
    refIds: ["rob2", "prisma2020"],
  },
  {
    slug: "gradepro",
    name: "GRADEpro GDT",
    category: "Certainty of evidence",
    free: true,
    bestFor:
      "Structured GRADE judgements and Summary of Findings (SoF) tables for critical outcomes.",
    url: "https://www.gradepro.org/",
    stageIds: ["grade", "reporting"],
    audience: "Reviewers moving from pooled results to decision-oriented certainty ratings.",
    pros: [
      "Free GRADEpro GDT access for creating SoF tables",
      "Structures the five downgrade domains systematically",
      "Exports useful for Word/RevMan workflows",
      "Aligns with GRADE guidance used by guidelines panels",
    ],
    cons: [
      "Judgements remain subjective — software does not “know” the truth",
      "Learning the interface takes a session",
      "Needs solid RoB and results inputs first",
    ],
    whenToUse: [
      "After primary synthesis/MA (or narrative) for critical outcomes",
      "When drafting SoF for the paper or guidelines handoff",
    ],
    howToUse: [
      "List critical and important outcomes from the protocol.",
      "Enter relative/absolute effects and study limitations.",
      "Apply downgrades with explicit reasons; avoid one global grade for the whole review.",
      "Export SoF; paste certainty rationale into EvidenceFlow GRADE stage.",
    ],
    pitfalls: [
      "Equating p<0.05 with high certainty.",
      "Skipping imprecision when CIs cross decision thresholds.",
    ],
    withEvidenceFlow:
      "Use GradeHelper + teach prompts here for learning; produce formal SoF in GRADEpro for the manuscript.",
    refIds: ["grade", "gradeHandbook", "sof", "rob2"],
    furtherReading: [
      {
        title: "GRADEpro / GRADE handbook",
        url: "https://www.gradepro.org/",
      },
    ],
  },
  {
    slug: "prisma",
    name: "PRISMA Statement site",
    category: "Reporting",
    free: true,
    bestFor:
      "PRISMA 2020 checklist, flow diagram templates, extensions (e.g. protocols, searches).",
    url: "https://www.prisma-statement.org/",
    stageIds: ["reporting", "protocol"],
    audience: "Every systematic review author at writing stage (and protocol stage for PRISMA-P).",
    pros: [
      "Authoritative reporting standard expected by many journals",
      "Free checklists and flow diagram templates",
      "Explanation & elaboration papers teach what each item means",
      "Extensions cover protocols, searching, and more",
    ],
    cons: [
      "PRISMA is reporting guidance — it does not make methods valid by itself",
      "Checkbox compliance without substance is empty",
      "Multiple extensions can confuse first-time users about which apply",
    ],
    whenToUse: [
      "Protocol writing (PRISMA-P) and final manuscript (PRISMA 2020)",
      "When building the flow diagram from real screening counts",
    ],
    howToUse: [
      "Download the relevant checklist; map each item to manuscript sections.",
      "Build the flow diagram from logged counts (not estimates).",
      "Use E&E examples when stuck on an item.",
      "Tick EvidenceFlow reporting checklist in parallel; export learning/reporting packs.",
    ],
    pitfalls: [
      "Claiming “PRISMA-compliant” without addressing items.",
      "Hiding empty database yields or full-text exclusion reasons.",
    ],
    withEvidenceFlow:
      "EvidenceFlow PRISMA checklist + flow counts feed the official PRISMA figure/checklist for submission.",
    refIds: ["prisma2020", "prismaExplain", "prismaP"],
  },
  {
    slug: "spreadsheets",
    name: "Excel / Google Sheets",
    category: "Data management",
    free: true,
    bestFor:
      "Transparent extraction tables, PRISMA counts, simple trackers — universal and auditable for small reviews.",
    stageIds: ["extraction", "screening", "synthesis"],
    audience: "Everyone; default when specialised tools are unavailable.",
    pros: [
      "Universal; easy to share and open years later",
      "Full control over columns for custom extraction",
      "Good for teaching data structure before specialised platforms",
      "Google Sheets enables simultaneous small-team editing",
    ],
    cons: [
      "Easy to create conflicting copies (version hell)",
      "Weak audit trail vs Covidence for dual extraction",
      "Formulas can silently break; no built-in RoB/GRADE logic",
      "Not ideal as sole tool for thousands of screening records",
    ],
    whenToUse: [
      "Small reviews, pilots, teaching, and as export target from other tools",
      "Maintaining a master study characteristics table",
    ],
    howToUse: [
      "Lock a codebook (column definitions) before dual extraction.",
      "One row per study (or per comparison); separate raw and analysis sheets.",
      "Protect header rows; use data validation for RoB categories.",
      "Import/export CSV to EvidenceFlow study table and MA tools.",
      "Archive dated versions (or use version history) with the protocol.",
    ],
    pitfalls: [
      "Multiple “final_v7_REAL.xlsx” files with no single source of truth.",
      "Calculating effects in sheets without documenting formulas.",
    ],
    withEvidenceFlow:
      "Paste or import study rows into the extraction table; keep the spreadsheet as backup and analysis staging area.",
    refIds: ["cochrane", "prisma2020"],
  },

  // —— Core databases & discovery (truly important for comprehensive SRs) ——
  {
    slug: "embase",
    name: "Embase",
    category: "Database",
    free: false,
    bestFor:
      "Major biomedical database with strong European/pharma coverage and Emtree indexing — usually paired with MEDLINE/PubMed for intervention SRs.",
    url: "https://www.elsevier.com/products/embase",
    stageIds: ["search"],
    audience:
      "Health intervention SRs with institutional Embase access (Ovid, Embase.com, etc.).",
    pros: [
      "Complements MEDLINE: unique journals and conference material often found here",
      "Emtree controlled vocabulary is powerful for drug/device/clinical topics",
      "Widely expected in comprehensive biomedical search methods",
      "Good coverage of European literature relative to some other sources",
    ],
    cons: [
      "Usually paid / institutional only — access is a real barrier for independent students",
      "Interface and field codes differ from PubMed — strategies must be translated carefully",
      "Still not enough alone: add CENTRAL, topic databases, and registries as relevant",
      "Large yields increase screening burden if strategies are too broad",
    ],
    whenToUse: [
      "Nearly always for clinical intervention SRs when access exists (with MEDLINE + CENTRAL as a common core)",
      "Drug, device, and disease-focused questions where Emtree terms improve sensitivity",
    ],
    howToUse: [
      "Map your PubMed/MEDLINE concept blocks to Emtree + free text; do not auto-translate blindly.",
      "Peer-review (PRESS) the Embase string; run and export full strategy + hit count + date/platform.",
      "Import to Zotero/EndNote; de-duplicate across databases; update EvidenceFlow search log.",
      "If you lack Embase access, document the limitation and maximise free sources + registries + citation chasing.",
    ],
    pitfalls: [
      "Claiming a comprehensive SR while searching only PubMed when Embase was available.",
      "Copying MeSH terms into Embase without Emtree mapping.",
    ],
    withEvidenceFlow:
      "Record Embase platform (e.g. Ovid), date, string, and hits in the Search stage alongside MEDLINE/CENTRAL.",
    refIds: ["cochrane", "press", "bramer", "prisma2020", "mep"],
  },
  {
    slug: "clinicaltrials-gov",
    name: "ClinicalTrials.gov (+ WHO ICTRP)",
    category: "Database",
    free: true,
    bestFor:
      "Trial registries to find ongoing, unpublished, or incompletely reported trials — essential for reducing publication bias in intervention reviews.",
    url: "https://clinicaltrials.gov/",
    stageIds: ["search", "screening"],
    audience: "Any health SR/MA of interventions or controlled trials.",
    pros: [
      "Free and public",
      "Surfaces unpublished or incomplete trials that journals miss",
      "Supports fairness of the evidence base (publication bias mitigation)",
      "WHO ICTRP portal searches multiple national registries in one place",
    ],
    cons: [
      "Records are not peer-reviewed journal articles — outcomes may be missing or change",
      "Matching registry records to publications takes detective work",
      "Search interfaces are not bibliographic databases; export/workflows differ",
      "ICTRP and ClinicalTrials.gov overlap — de-duplicate carefully",
    ],
    whenToUse: [
      "Protocol-mandated registry search for intervention/RCT questions (Cochrane/PRISMA expectations)",
      "When assessing selective non-reporting of studies or results",
    ],
    howToUse: [
      "Search ClinicalTrials.gov with condition + intervention terms aligned to PICO.",
      "Search WHO ICTRP (https://trialsearch.who.int/) for broader registry coverage.",
      "Export or save records; track NCT/IDs; link to publications when found.",
      "Count registry hits in PRISMA ‘other sources’; document date searched.",
      "Note unpublished trials in results/limitations even if not meta-analysable.",
    ],
    pitfalls: [
      "Skipping registries entirely in an RCT review.",
      "Treating a registry record as equivalent to a peer-reviewed full trial report without care.",
    ],
    withEvidenceFlow:
      "Add registries to ‘databases & sources’ and the search log; mention unpublished trials in synthesis/limitations fields.",
    refIds: ["cochrane", "prisma2020", "mep", "egger"],
    furtherReading: [
      {
        title: "ClinicalTrials.gov",
        url: "https://clinicaltrials.gov/",
      },
      {
        title: "WHO ICTRP search portal",
        url: "https://trialsearch.who.int/",
      },
    ],
  },
  {
    slug: "web-of-science",
    name: "Web of Science",
    category: "Database",
    free: false,
    bestFor:
      "Multidisciplinary citation index — strong for forward/backward citation searching and topics spanning medicine and social/behavioural sciences.",
    url: "https://clarivate.com/web-of-science/",
    stageIds: ["search"],
    audience: "Teams with institutional access needing citation tracking and broad coverage.",
    pros: [
      "Excellent citation network tools (times cited, cited references)",
      "Multidisciplinary coverage beyond pure MEDLINE content",
      "Useful for identifying seminal papers and citing articles after seed studies are known",
      "Common in university library portfolios",
    ],
    cons: [
      "Institutional subscription required",
      "Not a substitute for subject databases (MEDLINE/Embase/PsycINFO) on their own",
      "Interface and export limits vary by licence",
      "Can produce large, noisy sets if search is undisciplined",
    ],
    whenToUse: [
      "As part of a multi-database plan for interdisciplinary questions",
      "For citation chasing around key included studies (supplement to CitationChaser/Scopus)",
    ],
    howToUse: [
      "Run a structured topic search OR use known key papers for cited-reference / citing-article searches.",
      "Export to reference manager; de-duplicate against MEDLINE/Embase sets.",
      "Document editions/collections searched (e.g. SCI-EXPANDED) and date.",
      "Log hits in EvidenceFlow; keep seed paper list for reproducibility of citation searches.",
    ],
    pitfalls: [
      "Using WOS alone for a clinical drug review without MEDLINE/Embase/CENTRAL.",
      "Undocumented citation-search seeds (not reproducible).",
    ],
    withEvidenceFlow:
      "Describe citation-search methods in Search process notes; store seed PMIDs/DOIs in the search log.",
    refIds: ["cochrane", "press", "bramer", "prisma2020"],
  },
  {
    slug: "scopus",
    name: "Scopus",
    category: "Database",
    free: false,
    bestFor:
      "Large abstract and citation database — alternative/complement to Web of Science for multidisciplinary discovery and citation links.",
    url: "https://www.scopus.com/",
    stageIds: ["search"],
    audience: "Institutions with Elsevier Scopus access; interdisciplinary SR teams.",
    pros: [
      "Broad multidisciplinary coverage and citation counts",
      "Author and affiliation tools help identify clusters of trialists",
      "Often available where WOS is not (or vice versa) — check your library",
      "Useful complement in multi-database strategies studied for SR recall",
    ],
    cons: [
      "Paid institutional access",
      "Overlap with other databases is high — de-duplication essential",
      "Not a replacement for subject-specific thesauri (MeSH/Emtree)",
      "Coverage and policies change; always record platform + date",
    ],
    whenToUse: [
      "When building a multi-database search beyond MEDLINE-only",
      "Citation linking and author tracking for hard-to-find trials",
    ],
    howToUse: [
      "Translate concept blocks to Scopus field codes; validate a sample of hits.",
      "Export RIS/CSV; de-duplicate in Zotero/EndNote with other sources.",
      "Optional: use cited-by features for key included studies.",
      "Log strategy and hits in EvidenceFlow Search stage.",
    ],
    pitfalls: [
      "Double-counting the same records across Scopus + WOS + MEDLINE without de-duplication.",
      "Assuming citation counts equal study quality.",
    ],
    withEvidenceFlow:
      "Treat Scopus as one numbered source in your PRISMA identification total after de-duplication rules are applied.",
    refIds: ["cochrane", "bramer", "press", "prisma2020"],
  },
  {
    slug: "psycinfo",
    name: "PsycINFO / PsycArticles",
    category: "Database",
    free: false,
    bestFor:
      "Essential subject database for psychology, behavioural interventions, mental health, and education-related outcomes.",
    url: "https://www.apa.org/pubs/databases/psycinfo",
    stageIds: ["search"],
    audience:
      "SRs of psychological therapies, mindfulness, behavioural medicine, education psychology — institutional access via Ovid/EBSCO/APA.",
    pros: [
      "Deep indexing of psychological constructs and therapies",
      "Often retrieves behavioural trials under-indexed in purely medical databases",
      "Thesaurus (APA) improves concept searching for mental health PICO",
      "Critical for questions like student anxiety, CBT, mindfulness (EvidenceFlow example domain)",
    ],
    cons: [
      "Institutional access usually required",
      "Must still combine with MEDLINE/Embase/CENTRAL for health intervention claims",
      "Platform (Ovid vs EBSCO) changes syntax — document which you used",
    ],
    whenToUse: [
      "Any SR where psychology/behaviour is core to the intervention or outcome",
      "Complementary source for mixed medical–behavioural questions",
    ],
    howToUse: [
      "Build concept blocks for population, intervention, and psychological outcomes using the APA thesaurus + free text.",
      "Combine with RCT filters only if validated for that platform; pilot sensitivity.",
      "Export, de-duplicate, log string/date/hits in EvidenceFlow.",
    ],
    pitfalls: [
      "Skipping PsycINFO for a mindfulness/CBT review and only searching PubMed.",
      "Using psychology jargon inconsistently across blocks.",
    ],
    withEvidenceFlow:
      "List PsycINFO under planned databases; paste the final string into sample/search log fields.",
    refIds: ["cochrane", "press", "bramer", "prisma2020"],
  },
  {
    slug: "cinahl",
    name: "CINAHL",
    category: "Database",
    free: false,
    bestFor:
      "Core nursing and allied health literature — crucial when interventions are nurse-led, rehabilitative, or care-delivery focused.",
    url: "https://www.ebsco.com/products/research-databases/cinahl-database",
    stageIds: ["search"],
    audience: "Nursing, midwifery, allied health, and health services SRs with library access (usually EBSCO).",
    pros: [
      "Strong coverage of nursing and allied health journals",
      "Subject headings tailored to nursing/care concepts",
      "Often finds practice-relevant trials and quasi-experiments missed elsewhere",
      "Standard expectation in many nursing graduate SR methods courses",
    ],
    cons: [
      "Subscription database",
      "Not sufficient alone for medical/drug questions",
      "Overlaps with MEDLINE — de-duplicate carefully",
    ],
    whenToUse: [
      "Nurse-led education, self-management, ward interventions, rehab, midwifery topics",
      "When eligibility includes nursing/allied health settings",
    ],
    howToUse: [
      "Map PICO to CINAHL headings + free text; run on your library’s EBSCO platform.",
      "Export to reference manager; de-duplicate; log hits and date.",
      "If access is missing, note as a limitation and strengthen other sources + citation chasing.",
    ],
    pitfalls: [
      "Omitting CINAHL in a nursing thesis SR without justification.",
      "Over-filtering to ‘nursing journals only’ and missing multidisciplinary trials.",
    ],
    withEvidenceFlow:
      "Add CINAHL to Search sources and record platform-specific string in the draft search field.",
    refIds: ["cochrane", "press", "prisma2020"],
  },
  {
    slug: "citationchaser",
    name: "CitationChaser",
    category: "Search tools",
    free: true,
    bestFor:
      "Transparent forward and backward citation chasing from seed studies — a free, important complement to database searching.",
    url: "https://www.eshackathon.org/software/citationchaser.html",
    stageIds: ["search", "screening"],
    audience: "All SR teams after a set of key/included studies exists.",
    pros: [
      "Free web tool designed for systematic citation chasing",
      "Supports reproducibility by working from seed article lists",
      "Finds studies missed by keyword searches (different terminology)",
      "Aligns with Cochrane emphasis on supplementary search techniques",
    ],
    cons: [
      "Depends on citation index coverage underlying the tool — not complete",
      "Can generate large candidate sets requiring screening capacity",
      "Seed selection bias: bad seeds → biased chase",
      "Does not replace primary multi-database searching",
    ],
    whenToUse: [
      "After identifying key reviews/trials, and again after full-text inclusion for final chasing",
      "When terminology is diverse or the field is fragmented",
    ],
    howToUse: [
      "Compile seed DOIs/PMIDs (key papers + included studies).",
      "Run backward (references) and forward (citing articles) chases; export results.",
      "De-duplicate against the main database set; screen uniquely retrieved records.",
      "Document seeds, date, and tool version/method in EvidenceFlow search notes.",
    ],
    pitfalls: [
      "Citation chasing without recording seed list (not reproducible).",
      "Using only citation chasing without bibliographic databases.",
    ],
    withEvidenceFlow:
      "Describe citation-chasing methods under Search; add any extra includes to PRISMA ‘other sources’ counts.",
    refIds: ["citationChaser", "cochrane", "prisma2020", "press"],
    furtherReading: [
      {
        title: "CitationChaser tool",
        url: "https://www.eshackathon.org/software/citationchaser.html",
      },
    ],
  },
  {
    slug: "google-scholar",
    name: "Google Scholar",
    category: "Database",
    free: true,
    bestFor:
      "Supplementary discovery and grey/citation leads — not a primary, reproducible database for a standalone systematic search.",
    url: "https://scholar.google.com/",
    stageIds: ["search"],
    audience: "Everyone — but must be used with strict limits and honest reporting.",
    pros: [
      "Free and finds theses, preprints, and odd citations databases miss",
      "Useful for quick scoping and locating free full text",
      "Can surface highly cited papers early in topic exploration",
    ],
    cons: [
      "Search algorithm is opaque and not stably reproducible like bibliographic databases",
      "Exporting complete result sets is limited; ranking is not a methods sample",
      "Coverage and ordering change; poor foundation as the only source",
      "Easy to accidentally build a biased ‘first page only’ review",
    ],
    whenToUse: [
      "Scoping a topic before formal PICO lock",
      "Supplementary check for grey literature or known article titles",
      "Never as the sole source for a thesis/journal systematic review without strong justification",
    ],
    howToUse: [
      "Do formal multi-database searching first (MEDLINE, Embase/CENTRAL, topic DBs).",
      "If using Scholar supplementarily, pre-specify how many results you will screen (e.g. first N) and why.",
      "Record exact query strings, date, and account/browser notes — reproducibility is limited.",
      "Prefer dedicated grey-literature and registry methods over Scholar-only grey search.",
    ],
    pitfalls: [
      "Calling a Google Scholar search a systematic review.",
      "Screening only the first page of hits without a protocol rule.",
    ],
    withEvidenceFlow:
      "If used, document it under grey/supplementary sources with explicit limits; do not hide it as a ‘database’ equal to MEDLINE.",
    refIds: ["gscholarLimits", "cochrane", "prisma2020", "bramer"],
  },
  {
    slug: "robins-i",
    name: "ROBINS-I",
    category: "Risk of bias",
    free: true,
    bestFor:
      "Risk-of-bias assessment for non-randomised studies of interventions — critical when your SR includes NRSIs (not a substitute for RoB 2 on RCTs).",
    url: "https://www.riskofbias.info/welcome/home/current-version-of-robins-i",
    stageIds: ["rob", "eligibility"],
    audience:
      "Reviews that include cohort/quasi-experimental intervention studies; advanced learners beyond RCT-only scope.",
    pros: [
      "Domain-based framework aligned with modern evidence synthesis",
      "Free guidance from the Risk of Bias team",
      "Makes confounding and selection issues explicit",
      "Pairs with GRADE for non-randomised evidence (usually starts lower certainty)",
    ],
    cons: [
      "Harder and more time-consuming than RoB 2 for beginners",
      "Requires content expertise about confounding for the question",
      "Not appropriate as the primary tool for pure RCT reviews",
      "Dual assessment training is essential — judgements vary widely without calibration",
    ],
    whenToUse: [
      "When eligibility includes non-randomised intervention studies",
      "When comparing RCTs and NRSIs — use RoB 2 and ROBINS-I respectively, by design",
    ],
    howToUse: [
      "Confirm study design; do not apply ROBINS-I to RCTs.",
      "Assess domains with notes on confounding control; dual review + consensus.",
      "Visualise with robvis templates supporting ROBINS-I where available.",
      "Feed serious bias into GRADE and sensitivity/narrative synthesis plans.",
    ],
    pitfalls: [
      "Using a numeric quality scale instead of ROBINS-I for NRSIs.",
      "Applying RoB 2 signalling questions to non-randomised designs.",
    ],
    withEvidenceFlow:
      "Select ROBINS-I in the RoB tool field when relevant; summarise domain issues in the RoB stage narrative.",
    refIds: ["robinsI", "rob2", "grade", "cochrane"],
    furtherReading: [
      {
        title: "ROBINS-I resources",
        url: "https://www.riskofbias.info/",
      },
    ],
  },
];

export function getSoftwareBySlug(slug: string): SoftwareItem | undefined {
  return SOFTWARE_CATALOG.find((s) => s.slug === slug);
}

export function getSoftwareReferences(item: SoftwareItem): Ref[] {
  return resolveRefs(item.refIds);
}

export function softwareCategories(): string[] {
  return Array.from(new Set(SOFTWARE_CATALOG.map((s) => s.category)));
}
