'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  LabelList,
  Tooltip,
  CartesianGrid,
} from 'recharts';

type LineDot = React.ComponentProps<typeof Line>['dot'];
type LineActiveDot = React.ComponentProps<typeof Line>['activeDot'];
type LabelListContent = React.ComponentProps<typeof LabelList>['content'];
type OnMouseDown = React.ComponentProps<typeof ComposedChart>['onMouseDown'];
type XAxisTickFormatter = React.ComponentProps<typeof XAxis>['tickFormatter'];

// Recharts の dataKey は string | number 前提で扱うのが一番安全（関数 accessor は後回し）
type DataKey = string | number;

export type GlassComposedChartProps<
  T extends Record<string, unknown>,
  XKey extends Extract<keyof T, DataKey>,
  YKey extends Extract<keyof T, DataKey>,
> = {
  data: T[];

  /** X軸のキー（例: "time" / "createdAt"） */
  xKey: XKey;

  /** Y軸のキー（例: "value" / "intensity"） */
  yKey: YKey;

  /** defs 用 */
  strokeGradId: string;
  pillShadowId: string;

  /** Recharts イベント */
  onMouseDown?: OnMouseDown;

  /** Line */
  connectNulls?: boolean;
  dot?: LineDot;
  activeDot?: LineActiveDot;

  /** XAxis */
  tickFormatter?: XAxisTickFormatter;

  /** LabelList */
  labelContent?: LabelListContent;
};

export default function GlassComposedChart<
  T extends Record<string, unknown>,
  XKey extends Extract<keyof T, DataKey>,
  YKey extends Extract<keyof T, DataKey>,
>(props: GlassComposedChartProps<T, XKey, YKey>) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={props.data}
        margin={{ top: 32, right: 18, left: 18, bottom: 8 }}
        onMouseDown={props.onMouseDown}
      >
        <defs>
          <linearGradient id={props.strokeGradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(99,102,241,0.95)" />
            <stop offset="55%" stopColor="rgba(56,189,248,0.95)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0.95)" />
          </linearGradient>

          <filter
            id={props.pillShadowId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="6"
              floodColor="rgba(0,0,0,0.28)"
            />
          </filter>
        </defs>

        <Tooltip
          cursor={false}
          wrapperStyle={{ display: 'none' }}
          content={() => null}
        />

        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />

        <XAxis
          dataKey={props.xKey}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          tick={{ fill: 'rgba(226,232,240,0.78)', fontSize: 12 }}
          tickFormatter={props.tickFormatter}
        />

        <YAxis hide domain={[0, 100]} />

        <Line
          connectNulls={props.connectNulls}
          type="monotone"
          dataKey={props.yKey}
          stroke={`url(#${props.strokeGradId})`}
          strokeWidth={4}
          dot={props.dot}
          activeDot={props.activeDot}
          isAnimationActive={false}
        >
          {props.labelContent ? (
            <LabelList dataKey={props.yKey} content={props.labelContent} />
          ) : null}
        </Line>
      </ComposedChart>
    </ResponsiveContainer>
  );
}
