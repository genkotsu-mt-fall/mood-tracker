'use client';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  YAxis,
  XAxis,
  Tooltip,
  CartesianGrid,
  type DotProps,
  type TooltipContentProps,
} from 'recharts';
import { useCallback, useMemo } from 'react';
import type { Post } from '@/components/post/types';
import type { StackedPoint } from './types';
import EmojiDot from './EmojiDot';
import MiniPostTooltip from './MiniPostTooltip';
import DayPosts from './DayPosts';
import { BANDS, Y_TICKS, CHART_MARGIN } from './bands';
import { resolveTickLabel, resolveTooltipLabel } from './formatters';
import { normalizeStackedPoints } from './data';
import { useRightPanel } from '../app/RightPanelContext';

export default function InsightsChart({
  data,
  postsByDay,
  className,
}: {
  data: StackedPoint[];
  postsByDay: Record<string, Post[]>;
  className?: string;
}) {
  const { show } = useRightPanel();
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

  const renderDot = useCallback(
    (
      props: DotProps & {
        payload: StackedPoint;
        key?: React.Key | null;
        index?: number;
      },
    ) => {
      // React の key は特別なプロップなのでスプレッド経由で渡さない
      const { key: dotKey, cx, cy, payload, index } = props;
      const k = dotKey ?? index ?? payload?.id;

      return (
        <EmojiDot
          key={k as React.Key}
          cx={cx}
          cy={cy}
          payload={payload}
          onPointSelect={handleSelectDot}
        />
      );
    },
    [handleSelectDot],
  );

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
    <div className={className}>
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
            dataKey="id"
            tick={{ fontSize: 11 }}
            tickFormatter={(value: string, _i?: number, tick?: unknown) =>
              resolveTickLabel(value, tick)
            }
            minTickGap={18}
            tickMargin={6}
            allowDuplicatedCategory={false}
            interval="preserveStartEnd"
          />
          {BANDS.map(({ key, fill }) => (
            <Area
              key={key}
              type="linear"
              dataKey={key}
              stackId="v"
              stroke="none"
              fill={fill}
              isAnimationActive={false}
            />
          ))}
          <Line
            type="linear"
            dataKey="value"
            stroke="#111827"
            strokeWidth={2}
            isAnimationActive={false}
            dot={renderDot}
            activeDot={false}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Tooltip
            content={renderTooltip}
            wrapperStyle={{ pointerEvents: 'auto' }}
            allowEscapeViewBox={{ x: true, y: true }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
