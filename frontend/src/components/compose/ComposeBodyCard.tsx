'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  CalendarClock,
  Image as ImageIcon,
  Lock,
  Smile,
  Sparkles,
} from 'lucide-react';

import CharCounterCircle from '@/components/compose/CharCounterCircle';
import type { ComposeMetrics } from '@/lib/compose/useComposeMetrics';

type Props = {
  text: string;
  onTextChange: (v: string) => void;
  metrics: ComposeMetrics;
  bodyError?: string;
  canSubmit: boolean;
  pending: boolean;

  submitLabel?: string;
  pendingLabel?: string;
};

export default function ComposeBodyCard({
  text,
  onTextChange,
  metrics,
  bodyError,
  canSubmit,
  pending,
  submitLabel = '投稿する',
  pendingLabel = '送信中…',
}: Props) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-sky-200/50 via-fuchsia-200/50 to-amber-200/50 p-[1.5px]">
      <Card className="rounded-3xl shadow-sm border border-gray-200/80 bg-white/80 backdrop-blur">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-700">
              いまの気持ち…
            </CardTitle>

            <div className="flex items-center gap-2">
              <CharCounterCircle
                used={metrics.used}
                left={metrics.left}
                circleR={metrics.circleR}
                circleC={metrics.circleC}
                dash={metrics.dash}
                isOverLimit={metrics.isOverLimit}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>AI で下書きを提案（仮）</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="rounded-2xl border border-gray-200/80 bg-white/80 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:ring-offset-1 transition-shadow">
            <textarea
              name="body"
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="いまの気持ち…"
              rows={6}
              className="min-h-36 w-full resize-none rounded-2xl border-0 bg-transparent p-3 text-sm placeholder:text-gray-400 focus:outline-none focus-visible:ring-0"
            />

            {!!bodyError && (
              <p className="px-3 pb-2 text-xs text-red-600">{bodyError}</p>
            )}

            <div className="flex items-center justify-between border-t bg-white/60 px-2 py-1.5 rounded-b-2xl">
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>絵文字を挿入</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>画像を追加（予定）</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <CalendarClock className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>予約投稿（予定）</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>公開範囲を設定</TooltipContent>
                </Tooltip>
              </div>

              <Button
                type="submit"
                className="h-8 rounded-full px-4"
                disabled={!canSubmit || pending}
              >
                {pending ? pendingLabel : submitLabel}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
