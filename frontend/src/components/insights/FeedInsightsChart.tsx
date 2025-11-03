'use client';
import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  YAxis,
  XAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
  type TooltipContentProps,
} from 'recharts';
import { useCallback, useMemo } from 'react';

import type { Post } from '@/components/post/types';
import type { StackedPoint } from '@/components/insights/types';

import EmojiDot from '@/components/insights/EmojiDot';
import MiniPostTooltip from '@/components/insights/MiniPostTooltip';
import DayPosts from '@/components/insights/DayPosts';

// ★ InsightsChart から持ってくるユーティリティ／定数
import { BANDS, Y_TICKS, CHART_MARGIN } from '@/components/insights/bands';
import {
  resolveTickLabel,
  resolveTooltipLabel,
} from '@/components/insights/formatters';
import { normalizeStackedPoints } from '@/components/insights/data';
import { useRightPanel } from '@/components/app/RightPanelContext';

// Scatter の shape に渡る最小限の型
type ScatterShapeProps = {
  cx?: number;
  cy?: number;
  payload?: StackedPoint;
  index?: number;
};

// BANDS の key (e.g. 'b0_15') を数値レンジに変換
function bandRange(key: string): { from: number; to: number } {
  const m = key.match(/b(\d+)_?(\d+)/);
  if (!m) return { from: 0, to: 100 };
  const a = Number(m[1]);
  const b = Number(m[2]);
  return { from: a, to: b };
}

export default function FeedInsightsChart({
  data,
  postsByDay,
}: {
  data: StackedPoint[];
  postsByDay: Record<string, Post[]>;
}) {
  const { show } = useRightPanel();

  // ★ undefined や NaN を弾いて安全な配列にする（Area の stack が安定）
  const safeData = useMemo(() => normalizeStackedPoints(data), [data]);

  const handleSelectDot = useCallback(
    (p?: StackedPoint) => {
      if (!p) return;
      const posts = postsByDay[p.day] ?? [];
      show(<DayPosts day={p.day} posts={posts} />, {
        title: `${p.day} の投稿 (${posts.length})`,
      });
    },
    [postsByDay, show],
  );

  // (以前の renderDot は Scatter の shape に置き換え)

  const renderTooltip = useCallback(
    (props: TooltipContentProps<number, string>) => (
      <MiniPostTooltip
        active={props?.active}
        payload={props?.payload}
        label={resolveTooltipLabel(props)}
        coordinate={props?.coordinate}
        accessibilityLayer={props?.accessibilityLayer}
        postsByDay={postsByDay}
      />
    ),
    [postsByDay],
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={safeData} margin={CHART_MARGIN}>
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis
          domain={[0, 100]}
          ticks={[...Y_TICKS]}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
          width={36}
        />
        <XAxis
          // ★ ユニークな id を軸キーにする（同日の複数投稿でも重複しない）
          dataKey="id"
          tick={{ fontSize: 11 }}
          // ★ 目盛り表示だけ日付に変換（InsightsChart と同じ流儀）
          tickFormatter={(value: string, _i?: number, tick?: unknown) =>
            resolveTickLabel(value, tick)
          }
          minTickGap={18}
          tickMargin={6}
          allowDuplicatedCategory={false}
          interval="preserveStartEnd"
        />

        {/* 背景帯（ReferenceArea）を先に描画：データに依存せず領域全体を塗る */}
        {(() => {
          const firstId = safeData[0]?.id;
          const lastId = safeData[safeData.length - 1]?.id;
          return (
            firstId &&
            lastId &&
            BANDS.map(({ key, fill }, i) => {
              const { from, to } = bandRange(key);
              return (
                <ReferenceArea
                  key={i}
                  x1={firstId}
                  x2={lastId}
                  y1={from}
                  y2={to}
                  ifOverflow="extendDomain"
                  fill={fill}
                  fillOpacity={0.22}
                  stroke="none"
                  style={{ pointerEvents: 'none' }}
                />
              );
            })
          );
        })()}

        {/* 散布図（絵文字ドット） */}
        <Scatter
          name="Posts"
          data={safeData}
          // y は value、x は XAxis(dataKey="id") が使われる
          dataKey="value"
          isAnimationActive={false}
          shape={(props: ScatterShapeProps) => {
            const { cx, cy, payload, index } = props;
            const k = payload?.id ?? index;
            return (
              <EmojiDot
                key={k as React.Key}
                cx={cx}
                cy={cy}
                payload={payload}
                onPointSelect={handleSelectDot}
              />
            );
          }}
        />

        <Tooltip
          content={renderTooltip}
          wrapperStyle={{ pointerEvents: 'auto' }}
          allowEscapeViewBox={{ x: true, y: true }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
