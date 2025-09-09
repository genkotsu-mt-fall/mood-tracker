"use client";

import { useEffect, useState } from "react";
import { makeSamplePosts } from "@/components/post/sample/samplePosts";
import type { Post } from "@/components/post/types";
import { useInsightsData } from "@/app/(app)/me/_components/insights/useInsightsData";
import FeedInsightsChart from "./insights/FeedInsightsChart";

const SAMPLE_POSTS: Post[] = makeSamplePosts("hp"); // フィード寄りのサンプル

export default function FeedInsightsCard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data, postsByDay } = useInsightsData(SAMPLE_POSTS);

  return (
    <article className="h-full min-h-0 flex flex-col rounded-xl border bg-white p-4">
      <header className="mb-2 flex items-center gap-2 shrink-0">
        <div className="text-sm font-semibold text-gray-900">フィードのムード（30日）</div>
        <div className="text-[11px] text-gray-500">0–100%</div>
      </header>

      <div className="flex-1 min-h-0">
        {mounted ? (
          <FeedInsightsChart data={data} postsByDay={postsByDay} />
        ) : (
          <div className="h-full rounded-lg bg-gray-100 animate-pulse" />
        )}
      </div>
    </article>
  );
}
