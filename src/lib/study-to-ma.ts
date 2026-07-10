import type { ExtractedStudy } from "./studies";

/** Continuous arm data for MA calculator */
export type ContinuousMaRow = {
  id: string;
  name: string;
  mean1: string;
  sd1: string;
  n1: string;
  mean2: string;
  sd2: string;
  n2: string;
};

/** Binary arm data for MA calculator */
export type BinaryMaRow = {
  id: string;
  name: string;
  e1: string;
  n1: string;
  e2: string;
  n2: string;
};

export type MaBridgePayload = {
  source: "extraction";
  projectId?: string;
  projectTitle?: string;
  kind: "continuous" | "binary";
  continuous?: ContinuousMaRow[];
  binary?: BinaryMaRow[];
  skipped: { label: string; reason: string }[];
  createdAt: string;
};

const MA_BRIDGE_KEY = "evidenceflow_ma_bridge_v1";

/** Parse "mean (sd)" or "mean±sd" */
export function parseMeanSd(s: string): { mean: number; sd: number } | null {
  if (!s) return null;
  const cleaned = s.replace(/,/g, "").trim();
  const m = cleaned.match(
    /(-?\d+\.?\d*)\s*[\(\[]\s*(-?\d+\.?\d*)\s*[\)\]]/
  );
  if (m) return { mean: Number(m[1]), sd: Number(m[2]) };
  const m2 = cleaned.match(/(-?\d+\.?\d*)\s*[±+]\s*(-?\d+\.?\d*)/);
  if (m2) return { mean: Number(m2[1]), sd: Number(m2[2]) };
  // two numbers separated by space or slash-as-sd rare: "12.3 4.1"
  const m3 = cleaned.match(/^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/);
  if (m3) return { mean: Number(m3[1]), sd: Number(m3[2]) };
  return null;
}

/** Parse events: "10", "10/100", "10 (100)" */
export function parseEvents(
  stats: string,
  nFallback: string
): { events: number; n: number } | null {
  const s = (stats || "").replace(/,/g, "").trim();
  const nFromCol = Number(String(nFallback).trim());

  // events/n
  const slash = s.match(/^(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)$/);
  if (slash) {
    const events = Number(slash[1]);
    const n = Number(slash[2]);
    if (Number.isFinite(events) && Number.isFinite(n) && n >= 1 && events <= n) {
      return { events, n };
    }
  }

  // events (n)
  const paren = s.match(/^(\d+\.?\d*)\s*[\(\[]\s*(\d+\.?\d*)\s*[\)\]]$/);
  if (paren) {
    const events = Number(paren[1]);
    const n = Number(paren[2]);
    if (Number.isFinite(events) && Number.isFinite(n) && n >= 1 && events <= n) {
      return { events, n };
    }
  }

  // bare events + n column
  const eventsOnly = Number(s);
  if (
    Number.isFinite(eventsOnly) &&
    Number.isFinite(nFromCol) &&
    nFromCol >= 1 &&
    eventsOnly >= 0 &&
    eventsOnly <= nFromCol
  ) {
    return { events: eventsOnly, n: nFromCol };
  }

  return null;
}

function parseN(s: string): number | null {
  const n = Number(String(s).trim());
  return Number.isFinite(n) && n >= 1 ? n : null;
}

export function studiesToContinuousRows(studies: ExtractedStudy[]): {
  rows: ContinuousMaRow[];
  skipped: { label: string; reason: string }[];
} {
  const rows: ContinuousMaRow[] = [];
  const skipped: { label: string; reason: string }[] = [];

  for (const st of studies) {
    const label = st.authorYear || "Untitled study";
    const a = parseMeanSd(st.intStats);
    const b = parseMeanSd(st.ctrlStats);
    const n1 = parseN(st.nInt);
    const n2 = parseN(st.nCtrl);

    if (!a || !b) {
      if (st.intStats || st.ctrlStats || st.nInt || st.nCtrl) {
        skipped.push({
          label,
          reason: "Need mean (SD) in Int and Ctrl stats columns",
        });
      }
      continue;
    }
    if (!n1 || !n2 || n1 < 2 || n2 < 2) {
      skipped.push({ label, reason: "Need arm N ≥ 2 (N int / N ctrl)" });
      continue;
    }
    if (a.sd <= 0 || b.sd <= 0) {
      skipped.push({ label, reason: "SD must be > 0" });
      continue;
    }

    rows.push({
      id: st.id || crypto.randomUUID(),
      name: label,
      mean1: String(a.mean),
      sd1: String(a.sd),
      n1: String(n1),
      mean2: String(b.mean),
      sd2: String(b.sd),
      n2: String(n2),
    });
  }

  return { rows, skipped };
}

export function studiesToBinaryRows(studies: ExtractedStudy[]): {
  rows: BinaryMaRow[];
  skipped: { label: string; reason: string }[];
} {
  const rows: BinaryMaRow[] = [];
  const skipped: { label: string; reason: string }[] = [];

  for (const st of studies) {
    const label = st.authorYear || "Untitled study";
    const a = parseEvents(st.intStats, st.nInt);
    const b = parseEvents(st.ctrlStats, st.nCtrl);

    if (!a || !b) {
      if (st.intStats || st.ctrlStats || st.nInt || st.nCtrl) {
        skipped.push({
          label,
          reason: "Need events + N (e.g. 10/100 or events with N int/ctrl)",
        });
      }
      continue;
    }

    rows.push({
      id: st.id || crypto.randomUUID(),
      name: label,
      e1: String(a.events),
      n1: String(a.n),
      e2: String(b.events),
      n2: String(b.n),
    });
  }

  return { rows, skipped };
}

/** Prefer continuous if both parseable; otherwise binary; else continuous empty. */
export function buildMaBridgeFromStudies(
  studies: ExtractedStudy[],
  meta?: { projectId?: string; projectTitle?: string }
): MaBridgePayload {
  const cont = studiesToContinuousRows(studies);
  const bin = studiesToBinaryRows(studies);

  if (cont.rows.length >= 1 && cont.rows.length >= bin.rows.length) {
    return {
      source: "extraction",
      projectId: meta?.projectId,
      projectTitle: meta?.projectTitle,
      kind: "continuous",
      continuous: cont.rows,
      skipped: cont.skipped,
      createdAt: new Date().toISOString(),
    };
  }

  if (bin.rows.length >= 1) {
    return {
      source: "extraction",
      projectId: meta?.projectId,
      projectTitle: meta?.projectTitle,
      kind: "binary",
      binary: bin.rows,
      skipped: bin.skipped,
      createdAt: new Date().toISOString(),
    };
  }

  return {
    source: "extraction",
    projectId: meta?.projectId,
    projectTitle: meta?.projectTitle,
    kind: "continuous",
    continuous: [],
    skipped: [
      ...cont.skipped,
      ...bin.skipped,
      ...(studies.length === 0
        ? [{ label: "—", reason: "No studies in extraction table" }]
        : cont.skipped.length === 0 && bin.skipped.length === 0
          ? [
              {
                label: "—",
                reason:
                  "Could not parse continuous (mean/SD) or binary (events/n) from stats columns",
              },
            ]
          : []),
    ],
    createdAt: new Date().toISOString(),
  };
}

export function saveMaBridge(payload: MaBridgePayload) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(MA_BRIDGE_KEY, JSON.stringify(payload));
}

export function loadMaBridge(): MaBridgePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(MA_BRIDGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MaBridgePayload;
  } catch {
    return null;
  }
}

export function clearMaBridge() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(MA_BRIDGE_KEY);
}

export function openMaCalculatorFromStudies(
  studies: ExtractedStudy[],
  meta?: { projectId?: string; projectTitle?: string; forceKind?: "continuous" | "binary" }
): { ok: boolean; message: string; href: string } {
  let payload = buildMaBridgeFromStudies(studies, meta);
  if (meta?.forceKind === "binary") {
    const bin = studiesToBinaryRows(studies);
    payload = {
      ...payload,
      kind: "binary",
      binary: bin.rows,
      continuous: undefined,
      skipped: bin.skipped,
    };
  } else if (meta?.forceKind === "continuous") {
    const cont = studiesToContinuousRows(studies);
    payload = {
      ...payload,
      kind: "continuous",
      continuous: cont.rows,
      binary: undefined,
      skipped: cont.skipped,
    };
  }

  const count =
    payload.kind === "continuous"
      ? payload.continuous?.length ?? 0
      : payload.binary?.length ?? 0;

  if (count === 0) {
    return {
      ok: false,
      message:
        payload.skipped.map((s) => `${s.label}: ${s.reason}`).join("\n") ||
        "No parseable studies for meta-analysis.",
      href: "/tools/calculator",
    };
  }

  saveMaBridge(payload);
  return {
    ok: true,
    message: `Loaded ${count} stud${count === 1 ? "y" : "ies"} as ${payload.kind}.`,
    href: `/tools/calculator?from=extraction&tab=${payload.kind === "binary" ? "binary" : "md"}`,
  };
}
