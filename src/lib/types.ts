export type StageId =
  | "question"
  | "eligibility"
  | "protocol"
  | "search"
  | "screening"
  | "extraction"
  | "rob"
  | "synthesis"
  | "metaanalysis"
  | "grade"
  | "reporting";

export type StageStatus = "not_started" | "in_progress" | "complete";

export type MemberRole = "owner" | "collaborator" | "viewer";

export type StorageMode = "local" | "cloud";

export interface ProjectMeta {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  track: "rct-intervention";
  currentStage: StageId;
  /** Present for cloud projects */
  inviteCode?: string;
  mode?: StorageMode;
  memberCount?: number;
  myRole?: MemberRole;
}

export interface StageProgress {
  status: StageStatus;
  lessonRead: boolean;
  quizPassed?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  updatedBy?: string;
  updatedAt?: string;
}

export interface Project extends ProjectMeta {
  stages: Record<StageId, StageProgress>;
  members?: ProjectMember[];
}

export interface ProjectMember {
  userId: string;
  email?: string;
  displayName?: string;
  role: MemberRole;
  joinedAt: string;
}

export interface ProjectActivity {
  id: string;
  message: string;
  userId?: string;
  displayName?: string;
  createdAt: string;
}

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "checkbox";
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SoftwareTip {
  name: string;
  free: boolean;
  when: string;
  url?: string;
}

export interface ProcessStep {
  id: string;
  label: string;
  detail: string;
}

export interface StageDefinition {
  id: StageId;
  number: number;
  title: string;
  shortTitle: string;
  summary: string;
  learn: {
    why: string;
    concepts: string[];
    commonMistakes: string[];
    timeEstimate: string;
  };
  processSteps?: ProcessStep[];
  fields: FieldDef[];
  software: SoftwareTip[];
  quiz: QuizQuestion[];
  nextHint: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  related?: string[];
}
