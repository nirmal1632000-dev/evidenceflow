import type { Project } from "./types";
import { createEmptyStages, STAGE_ORDER } from "./stages";

const SHARE_STORE_KEY = "evidenceflow_shares_v1";

export interface ShareSnapshot {
  token: string;
  createdAt: string;
  title: string;
  /** Full project snapshot for view-only */
  project: Project;
  /** Optional cloud project id this came from */
  sourceProjectId?: string;
  mode: "local" | "cloud" | "portable";
}

type ShareStore = Record<string, ShareSnapshot>;

function readStore(): ShareStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SHARE_STORE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ShareStore;
  } catch {
    return {};
  }
}

function writeStore(store: ShareStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SHARE_STORE_KEY, JSON.stringify(store));
}

function token() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let t = "";
  for (let i = 0; i < 12; i++) {
    t += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return t;
}

/** Sanitize project for public share (strip private-ish fields). */
export function toShareProject(project: Project): Project {
  const stages = createEmptyStages();
  for (const id of STAGE_ORDER) {
    const s = project.stages[id];
    if (s) {
      stages[id] = {
        status: s.status,
        lessonRead: s.lessonRead,
        quizPassed: s.quizPassed,
        data: { ...s.data },
        updatedAt: s.updatedAt,
      };
    }
  }
  return {
    id: project.id,
    title: project.title,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    track: project.track,
    currentStage: project.currentStage,
    mode: "local",
    stages,
  };
}

/** Create a view-only snapshot link (works on this browser; portable blob if small). */
export function createLocalShare(project: Project): {
  token: string;
  url: string;
  portableUrl: string | null;
} {
  const t = token();
  const snapshot: ShareSnapshot = {
    token: t,
    createdAt: new Date().toISOString(),
    title: project.title,
    project: toShareProject(project),
    sourceProjectId: project.id,
    mode: project.mode === "cloud" ? "cloud" : "local",
  };
  const store = readStore();
  store[t] = snapshot;
  writeStore(store);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}/share/${t}`;

  let portableUrl: string | null = null;
  try {
    const json = JSON.stringify(snapshot.project);
    const b64 =
      typeof btoa !== "undefined"
        ? btoa(unescape(encodeURIComponent(json)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "")
        : "";
    // Keep portable links reasonable for chat apps (~12k chars safe-ish)
    if (b64.length > 0 && b64.length < 12000) {
      portableUrl = `${origin}/share/p#${b64}`;
    }
  } catch {
    portableUrl = null;
  }

  return { token: t, url, portableUrl };
}

export function getLocalShare(token: string): ShareSnapshot | null {
  const store = readStore();
  return store[token] || null;
}

export function decodePortableProject(b64url: string): Project | null {
  try {
    let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const json = decodeURIComponent(escape(atob(b64)));
    const project = JSON.parse(json) as Project;
    if (!project?.id || !project?.stages) return null;
    return project;
  } catch {
    return null;
  }
}

export function listLocalShares(): ShareSnapshot[] {
  return Object.values(readStore()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function revokeLocalShare(token: string) {
  const store = readStore();
  delete store[token];
  writeStore(store);
}
