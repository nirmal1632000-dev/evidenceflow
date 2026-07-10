export const ROB2_DOMAINS = [
  {
    id: "d1",
    short: "D1 Randomization",
    label: "Bias arising from the randomization process",
  },
  {
    id: "d2",
    short: "D2 Deviations",
    label: "Bias due to deviations from intended interventions",
  },
  {
    id: "d3",
    short: "D3 Missing data",
    label: "Bias due to missing outcome data",
  },
  {
    id: "d4",
    short: "D4 Measurement",
    label: "Bias in measurement of the outcome",
  },
  {
    id: "d5",
    short: "D5 Selection",
    label: "Bias in selection of the reported result",
  },
] as const;

export type RobJudgment = "" | "low" | "some" | "high" | "ni";

export interface StudyRob {
  d1: RobJudgment;
  d2: RobJudgment;
  d3: RobJudgment;
  d4: RobJudgment;
  d5: RobJudgment;
  overall: RobJudgment;
  notes: string;
}

export type RobGridMap = Record<string, StudyRob>;

export function emptyRob(): StudyRob {
  return { d1: "", d2: "", d3: "", d4: "", d5: "", overall: "", notes: "" };
}

export function parseRobGrid(raw: unknown): RobGridMap {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as RobGridMap;
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") return raw as RobGridMap;
  return {};
}

/** Simple overall rule of thumb (educational, not official algorithm) */
export function suggestOverall(r: StudyRob): RobJudgment {
  const vals = [r.d1, r.d2, r.d3, r.d4, r.d5].filter(Boolean) as RobJudgment[];
  if (!vals.length) return "";
  if (vals.some((v) => v === "high")) return "high";
  if (vals.some((v) => v === "some" || v === "ni")) return "some";
  if (vals.every((v) => v === "low")) return "low";
  return "some";
}

export const JUDGMENT_LABEL: Record<RobJudgment, string> = {
  "": "—",
  low: "Low",
  some: "Some concerns",
  high: "High",
  ni: "No information",
};

export const JUDGMENT_COLOR: Record<RobJudgment, string> = {
  "": "bg-slate-50 text-slate-400",
  low: "bg-teal-100 text-teal-900",
  some: "bg-amber-100 text-amber-900",
  high: "bg-rose-100 text-rose-900",
  ni: "bg-slate-200 text-slate-700",
};
