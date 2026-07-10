/** Shared bibliographic anchors for EvidenceFlow learning content. */

export type Ref = {
  id: string;
  /** Short in-text label e.g. "PRISMA 2020" */
  label: string;
  /** Full citation */
  citation: string;
  url?: string;
};

export const REFS: Record<string, Ref> = {
  prisma2020: {
    id: "prisma2020",
    label: "PRISMA 2020",
    citation:
      "Page MJ, McKenzie JE, Bossuyt PM, et al. The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. BMJ. 2021;372:n71.",
    url: "https://www.bmj.com/content/372/bmj.n71",
  },
  prismaExplain: {
    id: "prismaExplain",
    label: "PRISMA 2020 explanation",
    citation:
      "Page MJ, Moher D, Bossuyt PM, et al. PRISMA 2020 explanation and elaboration. BMJ. 2021;372:n160.",
    url: "https://www.bmj.com/content/372/bmj.n160",
  },
  prismaP: {
    id: "prismaP",
    label: "PRISMA-P",
    citation:
      "Moher D, Shamseer L, Clarke M, et al. Preferred reporting items for systematic review and meta-analysis protocols (PRISMA-P) 2015 statement. Syst Rev. 2015;4:1.",
    url: "https://systematicreviewsjournal.biomedcentral.com/articles/10.1186/2046-4053-4-1",
  },
  cochrane: {
    id: "cochrane",
    label: "Cochrane Handbook",
    citation:
      "Higgins JPT, Thomas J, Chandler J, et al. (editors). Cochrane Handbook for Systematic Reviews of Interventions. Version 6.x. Cochrane.",
    url: "https://training.cochrane.org/handbook",
  },
  grade: {
    id: "grade",
    label: "GRADE",
    citation:
      "Guyatt GH, Oxman AD, Vist GE, et al. GRADE: an emerging consensus on rating quality of evidence and strength of recommendations. BMJ. 2008;336(7650):924-926.",
    url: "https://www.bmj.com/content/336/7650/924",
  },
  gradeHandbook: {
    id: "gradeHandbook",
    label: "GRADE Handbook",
    citation:
      "Schünemann H, Brożek J, Guyatt G, Oxman A (editors). GRADE Handbook. GRADEpro GDT.",
    url: "https://gdt.gradepro.org/app/handbook/handbook.html",
  },
  rob2: {
    id: "rob2",
    label: "RoB 2",
    citation:
      "Sterne JAC, Savović J, Page MJ, et al. RoB 2: a revised tool for assessing risk of bias in randomised trials. BMJ. 2019;366:l4898.",
    url: "https://www.bmj.com/content/366/bmj.l4898",
  },
  robinsI: {
    id: "robinsI",
    label: "ROBINS-I",
    citation:
      "Sterne JA, Hernán MA, Reeves BC, et al. ROBINS-I: a tool for assessing risk of bias in non-randomised studies of interventions. BMJ. 2016;355:i4919.",
    url: "https://www.bmj.com/content/355/bmj.i4919",
  },
  press: {
    id: "press",
    label: "PRESS",
    citation:
      "McGowan J, Sampson M, Salzwedel DM, et al. PRESS Peer Review of Electronic Search Strategies: 2015 Guideline Statement. J Clin Epidemiol. 2016;75:40-46.",
    url: "https://www.jclinepi.com/article/S0895-4356(16)00058-5/fulltext",
  },
  prospero: {
    id: "prospero",
    label: "PROSPERO",
    citation:
      "Booth A, Clarke M, Dooley G, et al. The nuts and bolts of PROSPERO: an international prospective register of systematic reviews. Syst Rev. 2012;1:2.",
    url: "https://www.crd.york.ac.uk/prospero/",
  },
  pico: {
    id: "pico",
    label: "PICO framing",
    citation:
      "Richardson WS, Wilson MC, Nishikawa J, Hayward RS. The well-built clinical question: a key to evidence-based decisions. ACP J Club. 1995;123(3):A12-13.",
  },
  hedges: {
    id: "hedges",
    label: "Hedges g",
    citation:
      "Hedges LV. Distribution theory for Glass’s estimator of effect size and related estimators. J Educ Stat. 1981;6(2):107-128.",
  },
  dersimonian: {
    id: "dersimonian",
    label: "DerSimonian–Laird",
    citation:
      "DerSimonian R, Laird N. Meta-analysis in clinical trials. Control Clin Trials. 1986;7(3):177-188.",
  },
  i2: {
    id: "i2",
    label: "I² statistic",
    citation:
      "Higgins JPT, Thompson SG, Deeks JJ, Altman DG. Measuring inconsistency in meta-analyses. BMJ. 2003;327(7414):557-560.",
    url: "https://www.bmj.com/content/327/7414/557",
  },
  meade: {
    id: "meade",
    label: "Narrative synthesis",
    citation:
      "Popay J, Roberts H, Sowden A, et al. Guidance on the conduct of narrative synthesis in systematic reviews. ESRC Methods Programme. 2006.",
  },
  amstar: {
    id: "amstar",
    label: "AMSTAR 2",
    citation:
      "Shea BJ, Reeves BC, Wells G, et al. AMSTAR 2: a critical appraisal tool for systematic reviews. BMJ. 2017;358:j4008.",
    url: "https://www.bmj.com/content/358/bmj.j4008",
  },
  mep: {
    id: "mep",
    label: "MECIR",
    citation:
      "Higgins JPT, Lasserson T, Chandler J, et al. Methodological Expectations of Cochrane Intervention Reviews (MECIR). Cochrane.",
    url: "https://community.cochrane.org/mecir-manual",
  },
  egger: {
    id: "egger",
    label: "Funnel plots / small-study",
    citation:
      "Egger M, Davey Smith G, Schneider M, Minder C. Bias in meta-analysis detected by a simple, graphical test. BMJ. 1997;315(7109):629-634.",
    url: "https://www.bmj.com/content/315/7109/629",
  },
  sof: {
    id: "sof",
    label: "Summary of Findings",
    citation:
      "Guyatt G, Oxman AD, Akl EA, et al. GRADE guidelines: 1. Introduction—GRADE evidence profiles and summary of findings tables. J Clin Epidemiol. 2011;64(4):383-394.",
  },
  kappa: {
    id: "kappa",
    label: "Kappa / agreement",
    citation:
      "Landis JR, Koch GG. The measurement of observer agreement for categorical data. Biometrics. 1977;33(1):159-174.",
  },
  quadas2: {
    id: "quadas2",
    label: "QUADAS-2",
    citation:
      "Whiting PF, Rutjes AWS, Westwood ME, et al. QUADAS-2: a revised tool for the quality assessment of diagnostic accuracy studies. Ann Intern Med. 2011;155(8):529-536.",
  },
  jbi: {
    id: "jbi",
    label: "JBI manuals",
    citation:
      "Aromataris E, Munn Z (editors). JBI Manual for Evidence Synthesis. JBI. 2020.",
    url: "https://jbi-global-wiki.refined.site/space/MANUAL",
  },
  icmje: {
    id: "icmje",
    label: "ICMJE",
    citation:
      "International Committee of Medical Journal Editors. Recommendations for the Conduct, Reporting, Editing, and Publication of Scholarly Work in Medical Journals.",
    url: "https://www.icmje.org/recommendations/",
  },
  bramer: {
    id: "bramer",
    label: "Bramer multi-database search",
    citation:
      "Bramer WM, Rethlefsen ML, Kleijnen J, Franco OH. Optimal database combinations for literature searches in systematic reviews: a prospective exploratory study. Syst Rev. 2017;6:245.",
    url: "https://systematicreviewsjournal.biomedcentral.com/articles/10.1186/s13643-017-0644-y",
  },
  citationChaser: {
    id: "citationChaser",
    label: "CitationChaser",
    citation:
      "Haddaway NR, Grainger MJ, Gray CT. Citationchaser: A tool for transparent and efficient forward and backward citation chasing in systematic searching. Res Synth Methods. 2022;13(4):533-545.",
    url: "https://www.eshackathon.org/software/citationchaser.html",
  },
  gscholarLimits: {
    id: "gscholarLimits",
    label: "Google Scholar limitations",
    citation:
      "Bramer WM, Giustini D, Kramer BMR. Comparing the coverage, recall, and precision of searches for 120 systematic reviews in Embase, MEDLINE, and Google Scholar: a prospective study. Syst Rev. 2016;5:39. (Also: general methods guidance cautions against Scholar-only SRs.)",
    url: "https://systematicreviewsjournal.biomedcentral.com/articles/10.1186/s13643-016-0215-7",
  },

  // —— History & philosophy of SR / MA ——
  histGlass: {
    id: "histGlass",
    label: "Glass meta-analysis",
    citation:
      "Glass GV. Primary, secondary, and meta-analysis of research. Educ Res. 1976;5(10):3-8.",
  },
  histMulrow: {
    id: "histMulrow",
    label: "Mulrow on medical reviews",
    citation:
      "Mulrow CD. The medical review article: state of the science. Ann Intern Med. 1987;106(3):485-488.",
  },
  histAntman: {
    id: "histAntman",
    label: "Antman cumulative meta-analysis",
    citation:
      "Antman EM, Lau J, Kupelnick B, Mosteller F, Chalmers TC. A comparison of results of meta-analyses of randomized control trials and recommendations of clinical experts: treatments for myocardial infarction. JAMA. 1992;268(2):240-248.",
  },
  histChalmers: {
    id: "histChalmers",
    label: "Chalmers research synthesis",
    citation:
      "Chalmers I, Hedges LV, Cooper H. A brief history of research synthesis. Eval Health Prof. 2002;25(1):12-37.",
  },
  histCochraneBook: {
    id: "histCochraneBook",
    label: "Cochrane Effectiveness and Efficiency",
    citation:
      "Cochrane AL. Effectiveness and Efficiency: Random Reflections on Health Services. Nuffield Provincial Hospitals Trust; 1972. (Influential for evaluation culture later linked to Cochrane Collaboration.)",
  },
  histEbm: {
    id: "histEbm",
    label: "Evidence-based medicine",
    citation:
      "Sackett DL, Rosenberg WMC, Gray JAM, Haynes RB, Richardson WS. Evidence based medicine: what it is and what it isn’t. BMJ. 1996;312(7023):71-72.",
    url: "https://www.bmj.com/content/312/7023/71",
  },
  histGurevitch: {
    id: "histGurevitch",
    label: "Gurevitch meta-analysis across sciences",
    citation:
      "Gurevitch J, Koricheva J, Nakagawa S, Stewart G. Meta-analysis and the science of research synthesis. Nature. 2018;555(7695):175-182.",
  },
  histORourke: {
    id: "histORourke",
    label: "O’Rourke meta-analysis history",
    citation:
      "O’Rourke K. An historical perspective on meta-analysis: dealing quantitatively with varying study results. J R Soc Med. 2007;100(12):579-582.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2121629/",
  },
  philEbm: {
    id: "philEbm",
    label: "EBM definition (Sackett)",
    citation:
      "Sackett DL, Rosenberg WMC, Gray JAM, Haynes RB, Richardson WS. Evidence based medicine: what it is and what it isn’t. BMJ. 1996;312(7023):71-72.",
    url: "https://www.bmj.com/content/312/7023/71",
  },
  philHowick: {
    id: "philHowick",
    label: "Howick philosophy of EBM",
    citation:
      "Howick J. The Philosophy of Evidence-Based Medicine. Wiley-Blackwell; 2011.",
  },
  philCartwright: {
    id: "philCartwright",
    label: "Cartwright evidence for use",
    citation:
      "Cartwright N, Hardie J. Evidence-Based Policy: A Practical Guide to Doing It Better. Oxford University Press; 2012. (On what it takes for evidence to support effectiveness claims in context.)",
  },
  philIoannidis: {
    id: "philIoannidis",
    label: "Ioannidis research reliability",
    citation:
      "Ioannidis JPA. Why most published research findings are false. PLoS Med. 2005;2(8):e124. (Motivates synthesis, bias awareness, and humility — not nihilism.)",
    url: "https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.0020124",
  },
  care: {
    id: "care",
    label: "CARE case reports",
    citation:
      "Gagnier JJ, Kienle G, Altman DG, et al. The CARE guidelines: consensus-based clinical case reporting guideline development. J Med Case Rep. 2013;7:223.",
    url: "https://www.care-statement.org/",
  },
  strobe: {
    id: "strobe",
    label: "STROBE",
    citation:
      "von Elm E, Altman DG, Egger M, et al. The Strengthening the Reporting of Observational Studies in Epidemiology (STROBE) statement. Lancet. 2007;370(9596):1453-1457.",
    url: "https://www.strobe-statement.org/",
  },
  consort: {
    id: "consort",
    label: "CONSORT",
    citation:
      "Schulz KF, Altman DG, Moher D. CONSORT 2010 statement: updated guidelines for reporting parallel group randomised trials. BMJ. 2010;340:c332.",
    url: "https://www.consort-spirit.org/",
  },
};

export function resolveRefs(ids: string[]): Ref[] {
  return ids.map((id) => REFS[id]).filter(Boolean);
}
