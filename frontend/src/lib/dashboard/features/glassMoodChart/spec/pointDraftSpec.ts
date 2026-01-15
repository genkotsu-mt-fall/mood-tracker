// frontend/src/lib/dashboard/features/glassMoodChart/spec/pointDraftSpec.ts
import type { ChartPointUI, UserSummary } from '../model';

/**
 * 「中間点(draft)をどう作るか」の契約
 * - tryInsertByClick から `time:` などの “データ形状依存” を追い出すための spec
 */
export type CreateDraftArgs<TPoint, X> = {
  x: X;
  value: number;
  tags: string[];
  left: TPoint;
  right: TPoint;
};

export type PointDraftSpec<TPoint, X> = {
  createDraft: (args: CreateDraftArgs<TPoint, X>) => TPoint;
};

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
