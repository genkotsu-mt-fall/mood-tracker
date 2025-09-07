"use client"

import { useEffect, useState } from "react";
import { makeSamplePosts } from "@/components/post/sample/samplePosts";
import type { Post } from "@/components/post/types";
import { useInsightsData } from "./insights/useInsightsData";
import InsightsChart from "./insights/InsightsChart";

const SAMPLE_POSTS: Post[] = makeSamplePosts("insights");

export default function InsightsCard() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const { data, postsByDay, postPoints } = useInsightsData(SAMPLE_POSTS);

	return (
		<article className="h-full min-h-0 flex flex-col rounded-xl border bg-white p-4">
			<header className="mb-2 flex items-center gap-2 shrink-0">
				<div className="text-sm font-semibold text-gray-900">ムード（30日・帯色）</div>
				<div className="text-[11px] text-gray-500">0–100%</div>
			</header>

			<div className="flex-1 min-h-0">
						{mounted ? (
							<InsightsChart data={data} postsByDay={postsByDay} />
						) : (
							<div className="h-full rounded-lg bg-gray-100 animate-pulse" />
						)}
			</div>
		</article>
	);
}