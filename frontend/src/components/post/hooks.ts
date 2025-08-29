"use client";

import { useMemo, useState } from "react";
import type { Emoji } from "./types";
import { EMOJIS } from "./types";

export function useLike(initialLikes = 0) {
  const [liked, setLiked] = useState(false);
  const count = initialLikes + (liked ? 1 : 0);
  return { liked, count, toggle: () => setLiked((v) => !v) };
}

export function useExpand(threshold = 180) {
  const [expanded, setExpanded] = useState(false);
  return { expanded, toggle: () => setExpanded((v) => !v), threshold };
}

export function useReactions() {
  const [reactions, setReactions] = useState<Record<Emoji, number>>(
    () => Object.fromEntries(EMOJIS.map((e) => [e, 0])) as Record<Emoji, number>
  );
  const [myReactions, setMyReactions] = useState<Set<Emoji>>(new Set());

  const total = useMemo(
    () => Object.values(reactions).reduce((a, b) => a + b, 0),
    [reactions]
  );

  const toggleEmoji = (emoji: Emoji) => {
    setMyReactions((curr) => {
      const next = new Set(curr);
      if (next.has(emoji)) next.delete(emoji);
      else next.add(emoji);
      return next;
    });
    setReactions((curr) => ({
      ...curr,
      [emoji]: Math.max(
        0,
        (curr[emoji] ?? 0) + (myReactions.has(emoji) ? -1 : 1)
      ),
    }));
  };

  return { reactions, myReactions, total, toggleEmoji };
}
