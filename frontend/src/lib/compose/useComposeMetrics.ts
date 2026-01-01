import { useMemo } from 'react';
import type { PrivacySetting } from '@/lib/privacy/types';

export type ComposeMetrics = {
  limit: number;
  used: number;
  left: number;
  pct: number;

  circleR: number;
  circleC: number;
  dash: number;

  isOverLimit: boolean;
  isBodyOk: boolean;
  canSubmit: boolean;

  privacySummary: string;
};

type Args = {
  text: string;
  privacyJson?: PrivacySetting;
  limit?: number;
  circleR?: number;
};

export function useComposeMetrics({
  text,
  privacyJson,
  limit = 280,
  circleR = 12,
}: Args): ComposeMetrics {
  const used = text.length;

  const left = Math.max(0, limit - used);
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;

  const circleC = useMemo(() => 2 * Math.PI * circleR, [circleR]);
  const dash = Math.round(circleC * (pct / 100));

  const isOverLimit = used > limit;

  const trimmedLen = text.trim().length;
  const isBodyOk = trimmedLen > 0 && trimmedLen <= limit;
  const canSubmit = isBodyOk;

  const privacySummary = privacyJson ? '設定中' : '未設定';

  return {
    limit,
    used,
    left,
    pct,
    circleR,
    circleC,
    dash,
    isOverLimit,
    isBodyOk,
    canSubmit,
    privacySummary,
  };
}
