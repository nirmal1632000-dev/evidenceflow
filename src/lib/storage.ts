"use client";

import type { Project, ProjectMeta, StageId, StageProgress } from "./types";
import { STAGE_ORDER, createEmptyStages } from "./stages";

const STORAGE_KEY = "evidenceflow_projects_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function readAll(): Project[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

function writeAll(projects: Project[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function listProjects(): ProjectMeta[] {
  return readAll()
    .map(({ id, title, createdAt, updatedAt, track, currentStage }) => ({
      id,
      title,
      createdAt,
      updatedAt,
      track,
      currentStage,
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getProject(id: string): Project | null {
  return readAll().find((p) => p.id === id) ?? null;
}

export function createProject(
  title: string,
  options?: {
    /** Prefill stage field data (e.g. specialty templates) */
    stagePrefill?: Partial<
      Record<StageId, Record<string, string | number | boolean | string[]>>
    >;
  }
): Project {
  const now = new Date().toISOString();
  const stages = createEmptyStages();
  if (options?.stagePrefill) {
    for (const id of STAGE_ORDER) {
      const data = options.stagePrefill[id];
      if (data && Object.keys(data).length) {
        stages[id] = {
          ...stages[id],
          status: "in_progress",
          data: { ...data },
        };
      }
    }
  }
  const project: Project = {
    id: crypto.randomUUID(),
    title: title.trim() || "Untitled review",
    createdAt: now,
    updatedAt: now,
    track: "rct-intervention",
    currentStage: "question",
    stages,
  };
  const all = readAll();
  all.push(project);
  writeAll(all);
  return project;
}

export function updateProject(project: Project): Project {
  const all = readAll();
  const idx = all.findIndex((p) => p.id === project.id);
  const next = { ...project, updatedAt: new Date().toISOString() };
  if (idx === -1) {
    all.push(next);
  } else {
    all[idx] = next;
  }
  writeAll(all);
  return next;
}

export function deleteProject(id: string) {
  writeAll(readAll().filter((p) => p.id !== id));
}

export function saveStageData(
  projectId: string,
  stageId: StageId,
  data: StageProgress["data"],
  extras?: Partial<Pick<StageProgress, "status" | "lessonRead" | "quizPassed">>
): Project | null {
  const project = getProject(projectId);
  if (!project) return null;

  const prev = project.stages[stageId];
  const merged: StageProgress = {
    ...prev,
    data: { ...prev.data, ...data },
    ...extras,
  };

  // Auto status from required-ish fields filled
  if (!extras?.status) {
    const hasContent = Object.values(merged.data).some((v) => {
      if (typeof v === "string") return v.trim().length > 0;
      if (typeof v === "number") return true;
      if (typeof v === "boolean") return v;
      if (Array.isArray(v)) return v.length > 0;
      return false;
    });
    if (merged.status === "complete") {
      // keep complete unless explicitly changed
    } else if (hasContent) {
      merged.status = "in_progress";
    }
  }

  project.stages[stageId] = merged;
  project.currentStage = stageId;
  return updateProject(project);
}

export function markStageComplete(projectId: string, stageId: StageId): Project | null {
  const project = getProject(projectId);
  if (!project) return null;
  project.stages[stageId] = {
    ...project.stages[stageId],
    status: "complete",
  };
  const idx = STAGE_ORDER.indexOf(stageId);
  if (idx >= 0 && idx < STAGE_ORDER.length - 1) {
    project.currentStage = STAGE_ORDER[idx + 1];
  }
  return updateProject(project);
}

export function computeProgress(project: Project): {
  completed: number;
  total: number;
  percent: number;
} {
  const total = STAGE_ORDER.length;
  const completed = STAGE_ORDER.filter(
    (id) => project.stages[id]?.status === "complete"
  ).length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

export function exportProjectJson(project: Project): string {
  return JSON.stringify(project, null, 2);
}

export function importProjectJson(json: string): Project | null {
  try {
    const parsed = JSON.parse(json) as Project;
    if (!parsed.id || !parsed.stages) return null;
    parsed.updatedAt = new Date().toISOString();
    const all = readAll().filter((p) => p.id !== parsed.id);
    all.push(parsed);
    writeAll(all);
    return parsed;
  } catch {
    return null;
  }
}
