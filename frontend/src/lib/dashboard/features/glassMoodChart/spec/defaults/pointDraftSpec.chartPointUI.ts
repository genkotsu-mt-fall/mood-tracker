// frontend/src/lib/dashboard/features/glassMoodChart/spec/defaults/pointDraftSpec.chartPointUI.ts
import type { ChartPointUI, UserSummary } from '../../model';
import type { PointDraftSpec } from '../pointDraftSpec';

/**
 * 互換デフォルト：ChartPointUI を「time に x を入れる」形で draft 化する
 * - 将来 PostResource 等に寄せたい場合、ここを差し替える
 */
export function createChartPointUITimeDraftSpec(args: {
  fallbackUser: UserSummary;
  emoji?: string;
}): PointDraftSpec<ChartPointUI, string> {
  const emoji = args.emoji ?? '✍️';

  return {
    createDraft: ({ x, value, tags, left, right }) => {
      return {
        time: x,
        value,
        emoji,
        tags,
        user: left.user ?? right.user ?? args.fallbackUser,
        isDraft: true,
      } as ChartPointUI;
    },
  };
}
