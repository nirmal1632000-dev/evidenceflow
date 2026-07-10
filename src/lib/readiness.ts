import { STAGE_ORDER, getStage } from "./stages";
import type { Project, StageId } from "./types";
import { parseStudies } from "./studies";
import { PRISMA_ITEMS } from "./prisma-items";

export interface ReadinessItem {
  id: string;
  label: string;
  done: boolean;
  stageId?: StageId;
  hint: string;
}

function hasText(v: unknown) {
  return typeof v === "string" && v.trim().length > 0;
}

function hasNum(v: unknown) {
  return typeof v === "number" && !Number.isNaN(v);
}

/** Protocol / methods readiness — guides teams on what is still missing */
export function computeReadiness(project: Project): {
  items: ReadinessItem[];
  score: number;
  criticalMissing: number;
} {
  const q = project.stages.question?.data || {};
  const e = project.stages.eligibility?.data || {};
  const p = project.stages.protocol?.data || {};
  const s = project.stages.search?.data || {};
  const sc = project.stages.screening?.data || {};
  const x = project.stages.extraction?.data || {};
  const r = project.stages.rob?.data || {};
  const sy = project.stages.synthesis?.data || {};
  const m = project.stages.metaanalysis?.data || {};
  const g = project.stages.grade?.data || {};
  const rep = project.stages.reporting?.data || {};

  const items: ReadinessItem[] = [
    {
      id: "pico",
      label: "PICO / review question written",
      done:
        hasText(q.reviewQuestion) &&
        hasText(q.population) &&
        hasText(q.intervention) &&
        hasText(q.comparator) &&
        hasText(q.outcomes),
      stageId: "question",
      hint: "Complete Population, Intervention, Comparator, Outcomes, and the one-sentence question.",
    },
    {
      id: "eligibility",
      label: "Inclusion & exclusion criteria",
      done: hasText(e.inclusion) && hasText(e.exclusion),
      stageId: "eligibility",
      hint: "Both inclusion and exclusion lists should be explicit for dual screening.",
    },
    {
      id: "protocol",
      label: "Protocol methods drafted",
      done: hasText(p.objectives) && hasText(p.methodsSummary),
      stageId: "protocol",
      hint: "Objectives + methods summary should be ready before full screening.",
    },
    {
      id: "register",
      label: "Registry ID or status noted",
      done: hasText(p.prosperoId),
      stageId: "protocol",
      hint: "PROSPERO/OSF ID or ‘drafting / not eligible’.",
    },
    {
      id: "dual-roles",
      label: "Dual-review roles assigned",
      done: hasText(p.team) || hasText(sc.reviewer1),
      stageId: "protocol",
      hint: "Name Reviewer 1 / Reviewer 2 and who resolves conflicts.",
    },
    {
      id: "search",
      label: "Search sources & concept blocks",
      done: hasText(s.databases) && hasText(s.conceptBlocks),
      stageId: "search",
      hint: "Multi-database plan + structured concept blocks.",
    },
    {
      id: "prisma",
      label: "PRISMA flow numbers entered",
      done:
        hasNum(sc.identified) &&
        hasNum(sc.duplicates) &&
        hasNum(sc.titleAbstractScreened) &&
        hasNum(sc.included),
      stageId: "screening",
      hint: "Fill identification, duplicates, screening, and included counts.",
    },
    {
      id: "conflicts",
      label: "Screening conflict process documented",
      done: hasText(sc.processNotes) || hasText(sc.conflictLog),
      stageId: "screening",
      hint: "How dual disagreements were resolved (or log of key conflicts).",
    },
    {
      id: "extraction",
      label: "Extraction form defined",
      done: hasText(x.formFields),
      stageId: "extraction",
      hint: "Template fields before dual extraction.",
    },
    {
      id: "study-table",
      label: "At least one study in extraction table",
      done: parseStudies(x._studies).length > 0,
      stageId: "extraction",
      hint: "Add included studies as rows (characteristics + outcomes).",
    },
    {
      id: "rob",
      label: "Risk of bias tool chosen",
      done: hasText(r.tool),
      stageId: "rob",
      hint: "Usually RoB 2 for RCTs.",
    },
    {
      id: "synthesis",
      label: "Synthesis approach decided",
      done: hasText(sy.approach) && hasText(sy.comparability),
      stageId: "synthesis",
      hint: "Narrative vs MA decision with rationale.",
    },
    {
      id: "ma-or-skip",
      label: "Meta-analysis results or N/A noted",
      done:
        hasText(m.results) ||
        m.effectMeasure === "na" ||
        sy.approach === "narrative" ||
        sy.approach === "insufficient",
      stageId: "metaanalysis",
      hint: "Paste pooled results, or mark N/A if narrative only.",
    },
    {
      id: "grade",
      label: "GRADE / certainty drafted",
      done: hasText(g.outcomesGraded) && hasText(g.certaintyRatings),
      stageId: "grade",
      hint: "At least primary outcomes with certainty and reasons.",
    },
    {
      id: "reporting",
      label: "Limitations & balanced conclusions",
      done: hasText(rep.limitations) && hasText(rep.conclusions),
      stageId: "reporting",
      hint: "Avoid spin; match language to certainty.",
    },
    {
      id: "prisma-checklist",
      label: "Reporting checklist ≥50% complete",
      done: (() => {
        const raw = rep._prismaChecks;
        const list = Array.isArray(raw)
          ? raw
          : typeof raw === "string"
            ? (() => {
                try {
                  return JSON.parse(raw);
                } catch {
                  return [];
                }
              })()
            : [];
        return (
          Array.isArray(list) &&
          list.length >= Math.ceil(PRISMA_ITEMS.length * 0.5)
        );
      })(),
      stageId: "reporting",
      hint: "Use the PRISMA-inspired checklist on the Reporting stage.",
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const score = Math.round((doneCount / items.length) * 100);
  const criticalIds = ["pico", "eligibility", "protocol", "search", "prisma"];
  const criticalMissing = items.filter(
    (i) => criticalIds.includes(i.id) && !i.done
  ).length;

  return { items, score, criticalMissing };
}

export function stageCompletionMap(project: Project) {
  return STAGE_ORDER.map((id) => {
    const def = getStage(id);
    return {
      id,
      title: def.shortTitle,
      number: def.number,
      status: project.stages[id]?.status || "not_started",
    };
  });
}
