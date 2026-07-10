"use client";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { STAGE_ORDER, createEmptyStages } from "@/lib/stages";
import type {
  MemberRole,
  Project,
  ProjectActivity,
  ProjectMember,
  ProjectMeta,
  StageId,
  StageProgress,
} from "@/lib/types";

export { isSupabaseConfigured };

function inviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function mapStageRow(row: {
  stage_id: string;
  status: string;
  lesson_read: boolean;
  quiz_passed: boolean;
  data: Record<string, unknown>;
  updated_by?: string | null;
  updated_at?: string;
}): StageProgress {
  return {
    status: (row.status as StageProgress["status"]) || "not_started",
    lessonRead: !!row.lesson_read,
    quizPassed: !!row.quiz_passed,
    data: (row.data || {}) as StageProgress["data"],
    updatedBy: row.updated_by || undefined,
    updatedAt: row.updated_at,
  };
}

export async function getSessionUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function cloudListProjects(): Promise<ProjectMeta[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: memberships, error } = await supabase
    .from("project_members")
    .select("role, project_id, projects(*)")
    .eq("user_id", user.id);

  if (error) throw error;

  type Row = {
    role: MemberRole;
    project_id: string;
    projects: {
      id: string;
      title: string;
      track: string;
      current_stage: string;
      invite_code: string;
      created_at: string;
      updated_at: string;
    } | null;
  };

  const rows = (memberships || []) as unknown as Row[];

  const metas: ProjectMeta[] = [];
  for (const row of rows) {
    const p = row.projects;
    if (!p) continue;

    const { count } = await supabase
      .from("project_members")
      .select("*", { count: "exact", head: true })
      .eq("project_id", p.id);

    metas.push({
      id: p.id,
      title: p.title,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      track: "rct-intervention",
      currentStage: p.current_stage as StageId,
      inviteCode: p.invite_code,
      mode: "cloud",
      memberCount: count ?? 1,
      myRole: row.role,
    });
  }

  return metas.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function cloudGetProject(id: string): Promise<Project | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!project) return null;

  const { data: memberRow } = await supabase
    .from("project_members")
    .select("role")
    .eq("project_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!memberRow) return null;

  const { data: stages } = await supabase
    .from("stage_data")
    .select("*")
    .eq("project_id", id);

  const stageMap = createEmptyStages();
  for (const row of stages || []) {
    const sid = row.stage_id as StageId;
    if (STAGE_ORDER.includes(sid)) {
      stageMap[sid] = mapStageRow(row);
    }
  }

  const members = await cloudListMembers(id);
  const { count } = await supabase
    .from("project_members")
    .select("*", { count: "exact", head: true })
    .eq("project_id", id);

  return {
    id: project.id,
    title: project.title,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    track: "rct-intervention",
    currentStage: project.current_stage as StageId,
    inviteCode: project.invite_code,
    mode: "cloud",
    myRole: memberRow.role as MemberRole,
    memberCount: count ?? members.length,
    stages: stageMap,
    members,
  };
}

export async function cloudCreateProject(
  title: string,
  options?: {
    stagePrefill?: Partial<
      Record<StageId, Record<string, string | number | boolean | string[]>>
    >;
  }
): Promise<Project> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in required");

  const code = inviteCode();
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      title: title.trim() || "Untitled review",
      created_by: user.id,
      invite_code: code,
      current_stage: "question",
      track: "rct-intervention",
    })
    .select("*")
    .single();

  if (error) throw error;

  const { error: memErr } = await supabase.from("project_members").insert({
    project_id: project.id,
    user_id: user.id,
    role: "owner",
  });
  if (memErr) throw memErr;

  const stageRows = STAGE_ORDER.map((stage_id) => {
    const data = options?.stagePrefill?.[stage_id] || {};
    const hasData = Object.keys(data).length > 0;
    return {
      project_id: project.id,
      stage_id,
      status: hasData ? "in_progress" : "not_started",
      lesson_read: false,
      quiz_passed: false,
      data,
    };
  });
  const { error: stErr } = await supabase.from("stage_data").insert(stageRows);
  if (stErr) throw stErr;

  await supabase.from("project_activity").insert({
    project_id: project.id,
    user_id: user.id,
    message: "created the project",
  });

  const full = await cloudGetProject(project.id);
  if (!full) throw new Error("Failed to load new project");
  return full;
}

export async function cloudDeleteProject(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function cloudSaveStageData(
  projectId: string,
  stageId: StageId,
  data: StageProgress["data"],
  extras?: Partial<Pick<StageProgress, "status" | "lessonRead" | "quizPassed">>
): Promise<Project> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in required");

  const existing = await cloudGetProject(projectId);
  if (!existing) throw new Error("Project not found");
  if (existing.myRole === "viewer") throw new Error("View-only access");

  const prev = existing.stages[stageId];
  const mergedData = { ...prev.data, ...data };

  let status = extras?.status ?? prev.status;
  if (!extras?.status) {
    const hasContent = Object.values(mergedData).some((v) => {
      if (typeof v === "string") return v.trim().length > 0;
      if (typeof v === "number") return true;
      if (typeof v === "boolean") return v;
      if (Array.isArray(v)) return v.length > 0;
      return false;
    });
    if (status !== "complete" && hasContent) status = "in_progress";
  }

  const payload = {
    project_id: projectId,
    stage_id: stageId,
    status,
    lesson_read: extras?.lessonRead ?? prev.lessonRead,
    quiz_passed: extras?.quizPassed ?? prev.quizPassed ?? false,
    data: mergedData,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("stage_data").upsert(payload);
  if (error) throw error;

  const { error: pErr } = await supabase
    .from("projects")
    .update({
      current_stage: stageId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId);
  if (pErr) throw pErr;

  const full = await cloudGetProject(projectId);
  if (!full) throw new Error("Failed to reload project");
  return full;
}

export async function cloudMarkStageComplete(
  projectId: string,
  stageId: StageId
): Promise<Project> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in required");

  await cloudSaveStageData(projectId, stageId, {}, { status: "complete" });

  const idx = STAGE_ORDER.indexOf(stageId);
  const nextStage =
    idx >= 0 && idx < STAGE_ORDER.length - 1
      ? STAGE_ORDER[idx + 1]
      : stageId;

  await supabase
    .from("projects")
    .update({
      current_stage: nextStage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId);

  await supabase.from("project_activity").insert({
    project_id: projectId,
    user_id: user.id,
    message: `marked stage “${stageId}” complete`,
  });

  const full = await cloudGetProject(projectId);
  if (!full) throw new Error("Failed to reload project");
  return full;
}

export async function cloudJoinByCode(code: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("join_project_by_code", {
    code: code.trim(),
  });
  if (error) throw error;
  return data as string;
}

export async function cloudListMembers(
  projectId: string
): Promise<ProjectMember[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project_members")
    .select("user_id, role, joined_at, profiles(email, display_name)")
    .eq("project_id", projectId);

  if (error) throw error;

  type Row = {
    user_id: string;
    role: MemberRole;
    joined_at: string;
    profiles: { email: string | null; display_name: string | null } | null;
  };

  return ((data || []) as unknown as Row[]).map((r) => ({
    userId: r.user_id,
    role: r.role,
    joinedAt: r.joined_at,
    email: r.profiles?.email || undefined,
    displayName: r.profiles?.display_name || undefined,
  }));
}

export async function cloudListActivity(
  projectId: string,
  limit = 20
): Promise<ProjectActivity[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project_activity")
    .select("id, message, user_id, created_at, profiles(display_name)")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  type Row = {
    id: string;
    message: string;
    user_id: string | null;
    created_at: string;
    profiles: { display_name: string | null } | null;
  };

  return ((data || []) as unknown as Row[]).map((r) => ({
    id: r.id,
    message: r.message,
    userId: r.user_id || undefined,
    displayName: r.profiles?.display_name || undefined,
    createdAt: r.created_at,
  }));
}

export async function cloudRegenerateInvite(projectId: string): Promise<string> {
  const supabase = createClient();
  const code = inviteCode();
  const { error } = await supabase
    .from("projects")
    .update({ invite_code: code, updated_at: new Date().toISOString() })
    .eq("id", projectId);
  if (error) throw error;
  return code;
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, displayName: string) {
  const supabase = createClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined,
    },
  });
}

export async function signInWithMagicLink(email: string) {
  const supabase = createClient();
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined,
    },
  });
}

export async function signInWithGoogle() {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined,
    },
  });
}

export async function resetPassword(email: string) {
  const supabase = createClient();
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo:
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=/auth/reset`
        : undefined,
  });
}

export async function updatePassword(newPassword: string) {
  const supabase = createClient();
  return supabase.auth.updateUser({ password: newPassword });
}

export async function updateDisplayName(displayName: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in required");

  const { error: authErr } = await supabase.auth.updateUser({
    data: { display_name: displayName },
  });
  if (authErr) throw authErr;

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);
  if (error) throw error;
  return user;
}

/** Cloud view-only share (requires share-and-presence.sql migration). */
export async function cloudEnableShare(projectId: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("set_project_share", {
    p_id: projectId,
    enable: true,
  });
  if (error) throw error;
  return data as string;
}

export async function cloudDisableShare(projectId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("set_project_share", {
    p_id: projectId,
    enable: false,
  });
  if (error) throw error;
}

export async function cloudGetSharedProject(
  token: string
): Promise<Project | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_shared_project", {
    token: token.trim(),
  });
  if (error) throw error;
  if (!data) return null;

  type Shared = {
    id: string;
    title: string;
    track: string;
    current_stage: string;
    created_at: string;
    updated_at: string;
    stages: {
      stage_id: string;
      status: string;
      lesson_read: boolean;
      quiz_passed: boolean;
      data: Record<string, unknown>;
      updated_at?: string;
    }[];
  };

  const row = data as Shared;
  const stageMap = createEmptyStages();
  for (const s of row.stages || []) {
    const sid = s.stage_id as StageId;
    if (STAGE_ORDER.includes(sid)) {
      stageMap[sid] = mapStageRow({
        stage_id: s.stage_id,
        status: s.status,
        lesson_read: s.lesson_read,
        quiz_passed: s.quiz_passed,
        data: s.data || {},
        updated_at: s.updated_at,
      });
    }
  }

  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    track: "rct-intervention",
    currentStage: row.current_stage as StageId,
    mode: "local",
    stages: stageMap,
  };
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}

/** Subscribe to stage_data + activity changes for a project (realtime). */
export function subscribeProject(
  projectId: string,
  onChange: () => void
): () => void {
  if (!isSupabaseConfigured()) return () => {};
  const supabase = createClient();
  const channel = supabase
    .channel(`project-${projectId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "stage_data",
        filter: `project_id=eq.${projectId}`,
      },
      () => onChange()
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "project_activity",
        filter: `project_id=eq.${projectId}`,
      },
      () => onChange()
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "projects",
        filter: `id=eq.${projectId}`,
      },
      () => onChange()
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
