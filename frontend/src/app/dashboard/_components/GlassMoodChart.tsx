'use client';

import React from 'react';

import { fetchDummyLatest, fetchDummyOlder } from './GlassMoodChart.dummy';
import { PAD_START, PAD_END, FILTER_TAGS } from './GlassMoodChart.model';

import { useGlassMoodChartController } from '@/lib/dashboard/features/glassMoodChart/controller/useGlassMoodChartController';
import GlassMoodChartView from '@/lib/dashboard/features/glassMoodChart/ui/GlassMoodChartView';

export default function GlassMoodChart() {
  const vm = useGlassMoodChartController({
    padStartTime: PAD_START,
    padEndTime: PAD_END,
    filterTags: FILTER_TAGS,
    fetchLatest: fetchDummyLatest,
    fetchOlder: fetchDummyOlder,
  });

  return <GlassMoodChartView {...vm} />;
}
