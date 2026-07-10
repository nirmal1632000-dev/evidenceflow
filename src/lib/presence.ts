import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { StageId } from "./types";

export type PresenceUser = {
  key: string;
  userId: string;
  name: string;
  stageId?: StageId | string;
  onlineAt: string;
};

/**
 * Track who is viewing a cloud project stage via Supabase Realtime Presence.
 * Returns an unsubscribe function.
 */
export function trackProjectPresence(
  projectId: string,
  self: { userId: string; name: string; stageId?: string },
  onSync: (others: PresenceUser[]) => void
): () => void {
  if (!isSupabaseConfigured()) return () => {};

  const supabase = createClient();
  const channel = supabase.channel(`presence-project-${projectId}`, {
    config: { presence: { key: self.userId } },
  });

  const emit = () => {
    const state = channel.presenceState() as Record<
      string,
      { userId: string; name: string; stageId?: string; onlineAt: string }[]
    >;
    const others: PresenceUser[] = [];
    for (const [key, metas] of Object.entries(state)) {
      const meta = metas[0];
      if (!meta) continue;
      if (meta.userId === self.userId) continue;
      others.push({
        key,
        userId: meta.userId,
        name: meta.name || "Teammate",
        stageId: meta.stageId,
        onlineAt: meta.onlineAt,
      });
    }
    onSync(others);
  };

  channel
    .on("presence", { event: "sync" }, emit)
    .on("presence", { event: "join" }, emit)
    .on("presence", { event: "leave" }, emit)
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          userId: self.userId,
          name: self.name,
          stageId: self.stageId,
          onlineAt: new Date().toISOString(),
        });
      }
    });

  return () => {
    void supabase.removeChannel(channel);
  };
}

export async function updatePresenceStage(
  projectId: string,
  self: { userId: string; name: string; stageId?: string }
) {
  if (!isSupabaseConfigured()) return;
  const supabase = createClient();
  const channel = supabase.channel(`presence-project-${projectId}`);
  // Best-effort: track on existing channel name; StageWorkspace owns subscription.
  await channel.track({
    userId: self.userId,
    name: self.name,
    stageId: self.stageId,
    onlineAt: new Date().toISOString(),
  });
}
