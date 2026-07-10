export interface ExtractedStudy {
  id: string;
  authorYear: string;
  country: string;
  design: string;
  nTotal: string;
  nInt: string;
  nCtrl: string;
  population: string;
  intervention: string;
  comparator: string;
  outcome: string;
  effect: string;
  /** e.g. mean/SD or events */
  intStats: string;
  ctrlStats: string;
  timepoint: string;
  robOverall: string;
  notes: string;
  funding: string;
}

export const EMPTY_STUDY = (): ExtractedStudy => ({
  id: crypto.randomUUID(),
  authorYear: "",
  country: "",
  design: "RCT",
  nTotal: "",
  nInt: "",
  nCtrl: "",
  population: "",
  intervention: "",
  comparator: "",
  outcome: "",
  effect: "",
  intStats: "",
  ctrlStats: "",
  timepoint: "",
  robOverall: "",
  notes: "",
  funding: "",
});

export function parseStudies(raw: unknown): ExtractedStudy[] {
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? (p as ExtractedStudy[]) : [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) return raw as ExtractedStudy[];
  return [];
}

export function studiesToCsv(studies: ExtractedStudy[]): string {
  const headers: (keyof ExtractedStudy)[] = [
    "authorYear",
    "country",
    "design",
    "nTotal",
    "nInt",
    "nCtrl",
    "population",
    "intervention",
    "comparator",
    "outcome",
    "effect",
    "intStats",
    "ctrlStats",
    "timepoint",
    "robOverall",
    "funding",
    "notes",
  ];
  const escape = (s: string) => {
    const v = s ?? "";
    if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
    return v;
  };
  const lines = [headers.join(",")];
  for (const st of studies) {
    lines.push(headers.map((h) => escape(String(st[h] ?? ""))).join(","));
  }
  return lines.join("\n");
}

export function studiesToMarkdownTable(studies: ExtractedStudy[]): string {
  if (!studies.length) return "_No studies extracted yet._";
  const lines = [
    "| Author year | Country | N | Intervention | Comparator | Outcome | Effect / stats | RoB |",
    "|---|---|---|---|---|---|---|---|",
  ];
  for (const s of studies) {
    lines.push(
      `| ${s.authorYear || "—"} | ${s.country || "—"} | ${s.nTotal || "—"} | ${s.intervention || "—"} | ${s.comparator || "—"} | ${s.outcome || "—"} | ${s.effect || s.intStats || "—"} | ${s.robOverall || "—"} |`
    );
  }
  return lines.join("\n");
}
