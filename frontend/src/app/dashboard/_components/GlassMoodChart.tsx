'use client';

import React, { useMemo } from 'react';

import { fetchDummyLatest, fetchDummyOlder } from './GlassMoodChart.dummy';

import { useGlassMoodChartController } from '@/lib/dashboard/features/glassMoodChart/controller/useGlassMoodChartController';
import GlassMoodChartView from '@/lib/dashboard/features/glassMoodChart/ui/GlassMoodChartView';
import GlassComposedChart from '@/lib/dashboard/features/glassMoodChart/ui/GlassComposedChart';
import {
  PAD_START,
  PAD_END,
  FILTER_TAGS,
  type ChartPointUI,
} from '@/lib/dashboard/features/glassMoodChart/model';

import { PillLabel } from '@/lib/dashboard/features/glassMoodChart/components/PillLabel';
import {
  GlowActiveDot,
  GlowDot,
} from '@/lib/dashboard/features/glassMoodChart/components/RechartsDots';

import { createTimeKeySpec } from '@/lib/dashboard/features/glassMoodChart/spec/pointKeySpec';
import { createTimeXSpec } from '@/lib/dashboard/features/glassMoodChart/spec/pointXSpec';

function formatTickLabel(s: string, padStart: string, padEnd: string) {
  if (s === padStart || s === padEnd) return '';
  return s.length >= 16 ? s.slice(11) : s;
}

function formatPopoverSubtitle(s: string, padStart: string, padEnd: string) {
  // Popover は従来 full 表示（例: "2026/01/02 09:00"）の想定
  if (s === padStart || s === padEnd) return '';
  return s;
}

export default function GlassMoodChart() {
  // ✅ controller と View/Slider の表示・key 生成で “同じ spec” を使うため、呼び出し側で生成して注入する
  const keySpec = useMemo(() => createTimeKeySpec<ChartPointUI>(), []);
  const xSpec = useMemo(() => createTimeXSpec<ChartPointUI>(), []);

  const vm = useGlassMoodChartController({
    padStartTime: PAD_START,
    padEndTime: PAD_END,
    filterTags: FILTER_TAGS,
    fetchLatest: fetchDummyLatest,
    fetchOlder: fetchDummyOlder,
    // ✅ STEP-1/2.5: spec 注入（controller 内のデフォルト生成に頼らず統一）
    keySpec,
    xSpec,
  });

  const getXString = (p: ChartPointUI) => String(xSpec.getX(p));

  return (
    <GlassMoodChartView
      // tag chips
      filterTags={vm.filterTags}
      selectedTag={vm.selectedTag}
      onSelectTag={vm.onSelectTag}
      // editor
      editPopover={vm.editPopover}
      editPoint={vm.editPoint}
      editPointSubtitle={
        vm.editPoint
          ? formatPopoverSubtitle(
              getXString(vm.editPoint),
              vm.padStartTime,
              vm.padEndTime,
            )
          : null
      }
      isEditingDraft={vm.isEditingDraft}
      onCancelEditor={vm.onCancelEditor}
      onSaveEditor={vm.onSaveEditor}
      onUpdatePoint={vm.onUpdatePoint}
      // slider
      sliderItems={vm.sliderItems}
      getSliderItemKey={(p) => keySpec.getKey(p)}
      getSliderItemSubtitle={(p) =>
        formatTickLabel(getXString(p), vm.padStartTime, vm.padEndTime)
      }
    >
      <GlassComposedChart
        data={vm.filteredData}
        xKey="time"
        yKey="value"
        strokeGradId={vm.strokeGradId}
        pillShadowId={vm.pillShadowId}
        onMouseDown={vm.onChartMouseDown}
        connectNulls={vm.selectedTag === 'All'}
        tickFormatter={(v) =>
          formatTickLabel(String(v), vm.padStartTime, vm.padEndTime)
        }
        dot={<GlowDot onPointClick={vm.onPointClick} />}
        activeDot={<GlowActiveDot onPointClick={vm.onPointClick} />}
        labelContent={<PillLabel filterId={vm.pillShadowId} />}
      />
    </GlassMoodChartView>
  );
}
