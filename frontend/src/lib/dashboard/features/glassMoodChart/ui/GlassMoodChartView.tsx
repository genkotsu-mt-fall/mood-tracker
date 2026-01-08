'use client';

import React, { useRef } from 'react';
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

import type {
  ChartPoint,
  FilterTag,
} from '@/app/dashboard/_components/GlassMoodChart.model';

import type { ComposedChartMouseDown } from '@/lib/dashboard/events/recharts/mouseDown.types';
import type { PointClickHandler } from '@/lib/dashboard/features/glassMoodChart/ux/useGlassMoodChartUX';

import FilterTagChips from '@/lib/dashboard/features/glassMoodChart/tags/FilterTagChips';
import EditPointPopover from '@/lib/dashboard/features/glassMoodChart/popover/EditPointPopover';
import UserMiniCardSlider from '@/lib/dashboard/features/glassMoodChart/components/UserMiniCardSlider';

import { PillLabel } from '@/lib/dashboard/features/glassMoodChart/components/PillLabel';
import {
  GlowActiveDot,
  GlowDot,
} from '@/lib/dashboard/features/glassMoodChart/components/RechartsDots';

export type GlassMoodChartViewProps = {
  // ids
  strokeGradId: string;
  pillShadowId: string;

  // padding labels
  padStartTime: string;
  padEndTime: string;

  // tag chips
  filterTags: readonly FilterTag[];
  selectedTag: FilterTag;
  onSelectTag: (t: FilterTag) => void;

  // chart
  filteredData: ChartPoint[];
  onChartMouseDown: ComposedChartMouseDown;
  onPointClick: PointClickHandler;

  // editor
  editPopover: { time: string; anchor: { x: number; y: number } } | null;
  editPoint: ChartPoint | undefined;
  isEditingDraft: boolean;
  onCancelEditor: () => void;
  onSaveEditor: () => void;
  onUpdatePoint: (time: string, patch: Partial<ChartPoint>) => void;

  // slider
  sliderItems: readonly ChartPoint[];
};

export default function GlassMoodChartView(props: GlassMoodChartViewProps) {
  const chartWrapRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="h-full w-full">
      <div
        className="
          h-full overflow-hidden rounded-3xl
          border border-white/15
          bg-white/10
          backdrop-blur-lg
          shadow-[0_18px_50px_rgba(0,0,0,0.35)]
        "
      >
        <div className="h-full min-h-0 min-w-0 px-3 pb-6 pt-4 flex flex-col gap-3">
          {/* Filter tags */}
          <FilterTagChips
            tags={props.filterTags}
            selected={props.selectedTag}
            onSelect={props.onSelectTag}
          />

          {/* Chart */}
          <div className="flex-1 min-h-0">
            <div
              ref={chartWrapRef}
              className="relative h-full cursor-grab active:cursor-grabbing"
            >
              {/* Editor popover */}
              <EditPointPopover
                editPopover={props.editPopover}
                editPoint={props.editPoint}
                isEditingDraft={props.isEditingDraft}
                onCancel={props.onCancelEditor}
                onSave={props.onSaveEditor}
                onUpdate={props.onUpdatePoint}
              />

              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={props.filteredData}
                  margin={{ top: 32, right: 18, left: 18, bottom: 8 }}
                  onMouseDown={props.onChartMouseDown}
                >
                  <defs>
                    <linearGradient
                      id={props.strokeGradId}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
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

                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(255,255,255,0.08)"
                  />

                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                    tick={{ fill: 'rgba(226,232,240,0.78)', fontSize: 12 }}
                    tickFormatter={(v) => {
                      const s = String(v);
                      if (s === props.padStartTime || s === props.padEndTime)
                        return '';
                      return s.length >= 16 ? s.slice(11) : s;
                    }}
                  />

                  <YAxis hide domain={[0, 100]} />

                  <Line
                    connectNulls={props.selectedTag === 'All'}
                    type="monotone"
                    dataKey="value"
                    stroke={`url(#${props.strokeGradId})`}
                    strokeWidth={4}
                    dot={<GlowDot onPointClick={props.onPointClick} />}
                    activeDot={
                      <GlowActiveDot onPointClick={props.onPointClick} />
                    }
                    isAnimationActive={false}
                  >
                    <LabelList
                      dataKey="value"
                      content={<PillLabel filterId={props.pillShadowId} />}
                    />
                  </Line>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User cards slider */}
          <UserMiniCardSlider items={props.sliderItems} />
        </div>
      </div>
    </div>
  );
}
