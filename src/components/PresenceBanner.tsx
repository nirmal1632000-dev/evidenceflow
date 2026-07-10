"use client";

import { useEffect, useState } from "react";
import { getSessionUser } from "@/lib/cloud";
import { trackProjectPresence, type PresenceUser } from "@/lib/presence";
import { getStage } from "@/lib/stages";
import type { StageId } from "@/lib/types";

export function PresenceBanner({
  projectId,
  stageId,
  enabled,
}: {
  projectId: string;
  stageId?: StageId;
  enabled: boolean;
}) {
  const [others, setOthers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!enabled) return;
    let unsub = () => {};
    let cancelled = false;

    void (async () => {
      const user = await getSessionUser();
      if (!user || cancelled) return;
      const name =
        (user.user_metadata?.display_name as string) ||
        user.email?.split("@")[0] ||
        "You";
      unsub = trackProjectPresence(
        projectId,
        { userId: user.id, name, stageId },
        (list) => {
          if (!cancelled) setOthers(list);
        }
      );
    })();

    return () => {
      cancelled = true;
      unsub();
    };
  }, [enabled, projectId, stageId]);

  if (!enabled || others.length === 0) return null;

  return (
    <div className="mb-4 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm text-violet-950">
      <span className="font-semibold">Online now: </span>
      {others.map((u, i) => {
        const stageLabel = u.stageId
          ? getStage(u.stageId as StageId)?.shortTitle || u.stageId
          : "project home";
        return (
          <span key={u.key}>
            {i > 0 && " · "}
            <strong>{u.name}</strong>
            <span className="text-violet-800/80"> ({stageLabel})</span>
          </span>
        );
      })}
    </div>
  );
}
