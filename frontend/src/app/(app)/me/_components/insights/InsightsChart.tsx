"use client";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  YAxis,
  XAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import type { Post } from "@/components/post/types";
import type { StackedPoint } from "./types";
import EmojiDot from "./EmojiDot";
import MiniPostTooltip from "./MiniPostTooltip";

export default function InsightsChart({ data, postsByDay }: {
  data: StackedPoint[];
  postsByDay: Record<string, Post[]>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 15, 30, 50, 75, 100]}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
          width={36}
        />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11 }}
          tickFormatter={(s: string) => s.slice(5)} // YYYY-MM-DD → MM-DD
          minTickGap={18}
          tickMargin={6}
          allowDuplicatedCategory={false}
          interval="preserveStartEnd"
        />

        {/* 帯塗り分け */}
        <Area type="monotone" dataKey="b0_15"   stackId="v" stroke="none" fill="#2563EB" />
        <Area type="monotone" dataKey="b15_30"  stackId="v" stroke="none" fill="#93C5FD" />
        <Area type="monotone" dataKey="b30_50"  stackId="v" stroke="none" fill="#FACC15" />
        <Area type="monotone" dataKey="b50_75"  stackId="v" stroke="none" fill="#FB923C" />
        <Area type="monotone" dataKey="b75_100" stackId="v" stroke="none" fill="#F87171" />

        {/* 合計ライン（ドットは消す） */}
        <Line
          type="monotone"
          dataKey="value"
          stroke="#111827"
          strokeWidth={2}
          isAnimationActive={false}
          dot={false}
          activeDot={false}
        />

        {/* ✅ 合計ラインのドットだけを絵文字にする */}
        <Line
          type="monotone"
          dataKey="value"
          stroke="#111827"
          strokeWidth={2}
          isAnimationActive={false}
          dot={<EmojiDot />}
          activeDot={false}
        />

        {/* ツールチップ（Scatter の点をホバーした時だけ、その投稿を表示） */}
        <Tooltip
          content={(props) => (
            <MiniPostTooltip
              active={props.active}
              payload={props.payload}
              label={props.label}
              coordinate={props.coordinate}
              accessibilityLayer={props.accessibilityLayer}
              postsByDay={postsByDay}
            />
          )}
          wrapperStyle={{ pointerEvents: "auto" }}
          allowEscapeViewBox={{ x: true, y: true }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
