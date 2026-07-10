import type { ExtractedStudy } from "./studies";
import { EMPTY_STUDY } from "./studies";

/** Parse a simple CSV (handles quoted commas). Returns rows as string[][]. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell.trim());
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && next === "\n") i++;
      row.push(cell.trim());
      cell = "";
      if (row.some((c) => c.length > 0)) rows.push(row);
      row = [];
    } else {
      cell += ch;
    }
  }
  row.push(cell.trim());
  if (row.some((c) => c.length > 0)) rows.push(row);
  return rows;
}

const HEADER_MAP: Record<string, keyof ExtractedStudy> = {
  authoryear: "authorYear",
  "author year": "authorYear",
  author: "authorYear",
  country: "country",
  design: "design",
  ntotal: "nTotal",
  n: "nTotal",
  nint: "nInt",
  "n int": "nInt",
  nctrl: "nCtrl",
  "n ctrl": "nCtrl",
  population: "population",
  intervention: "intervention",
  comparator: "comparator",
  outcome: "outcome",
  "primary outcome": "outcome",
  effect: "effect",
  "effect / es": "effect",
  intstats: "intStats",
  "int mean/sd or events": "intStats",
  ctrlstats: "ctrlStats",
  "ctrl mean/sd or events": "ctrlStats",
  timepoint: "timepoint",
  time: "timepoint",
  roboverall: "robOverall",
  rob: "robOverall",
  funding: "funding",
  notes: "notes",
};

/** Paste from Excel/Sheets (tab or comma separated) */
export function studiesFromClipboard(text: string): ExtractedStudy[] {
  const t = text.trim();
  if (!t) return [];
  // Prefer TSV if tabs present
  if (t.includes("\t")) {
    const lines = t.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 1) return [];
    const hasHeader = /author|year|country|intervention|n\b/i.test(lines[0]);
    const start = hasHeader ? 1 : 0;
    const studies: ExtractedStudy[] = [];
    for (let i = start; i < lines.length; i++) {
      const cols = lines[i].split("\t").map((c) => c.trim());
      if (!cols.some(Boolean)) continue;
      const s = EMPTY_STUDY();
      s.authorYear = cols[0] || "";
      s.country = cols[1] || "";
      s.nTotal = cols[2] || "";
      s.intervention = cols[3] || "";
      s.comparator = cols[4] || "";
      s.outcome = cols[5] || "";
      s.effect = cols[6] || "";
      s.intStats = cols[7] || "";
      s.ctrlStats = cols[8] || "";
      s.nInt = cols[9] || "";
      s.nCtrl = cols[10] || "";
      if (s.authorYear || s.intervention) studies.push(s);
    }
    return studies;
  }
  return studiesFromCsv(t);
}

export function studiesFromCsv(text: string): ExtractedStudy[] {
  const rows = parseCsv(text.replace(/^\uFEFF/, ""));
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.toLowerCase().trim());
  const keys = headers.map((h) => HEADER_MAP[h] || null);

  const studies: ExtractedStudy[] = [];
  for (let r = 1; r < rows.length; r++) {
    const line = rows[r];
    if (!line.some((c) => c)) continue;
    const study = EMPTY_STUDY();
    keys.forEach((key, i) => {
      if (key && key !== "id" && line[i] != null) {
        study[key] = line[i];
      }
    });
    // If no mapped headers, treat first columns positionally
    if (keys.every((k) => !k) && line[0]) {
      study.authorYear = line[0] || "";
      study.country = line[1] || "";
      study.nTotal = line[2] || "";
      study.intervention = line[3] || "";
      study.comparator = line[4] || "";
      study.outcome = line[5] || "";
      study.effect = line[6] || "";
    }
    if (study.authorYear || study.intervention || study.outcome) {
      studies.push(study);
    }
  }
  return studies;
}
