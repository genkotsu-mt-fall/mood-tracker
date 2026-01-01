'use client';

import { Button } from '@/components/ui/button';
import CharCounterCircle from '@/components/compose/CharCounterCircle';
import type { ComposeMetrics } from '@/lib/compose/useComposeMetrics';

type Props = {
  privacySummary: string;
  emoji: string;
  metrics: ComposeMetrics;
  canSubmit: boolean;
  pending: boolean;
  formId: string;
};

export default function ComposeStickyBar({
  privacySummary,
  emoji,
  metrics,
  canSubmit,
  pending,
  formId,
}: Props) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-20">
      <div className="pointer-events-auto mx-auto w-full max-w-3xl px-4">
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white/80 p-2 shadow-lg backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
              可視性: {privacySummary}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
              気分: {emoji || '未選択'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CharCounterCircle
              used={metrics.used}
              left={metrics.left}
              circleR={metrics.circleR}
              circleC={metrics.circleC}
              dash={metrics.dash}
              isOverLimit={metrics.isOverLimit}
              className="relative h-7 w-7"
            />

            <Button
              type="submit"
              disabled={!canSubmit || pending}
              className="rounded-full"
              form={formId}
            >
              {pending ? '送信中…' : '投稿する'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
