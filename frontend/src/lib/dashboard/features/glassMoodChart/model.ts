// lib/dashboard/features/glassMoodChart/model.ts

export type UserSummary = {
  id: string;
  name: string;
  handle: string;
  avatar: string; // 1-2文字 or 絵文字
};

export const PAD_START = '__pad_start__' as const;
export const PAD_END = '__pad_end__' as const;

export const FILTER_TAGS = [
  'All',
  'Work',
  'Health',
  'Study',
  'Family',
  'Social',
] as const;

export type FilterTag = (typeof FILTER_TAGS)[number];

/**
 * チャート描画の最小契約（Recharts の dataKey が参照するもの）
 */
export type ChartPointBase = {
  time: string;
  value: number | null;
};

/**
 * UI/UX が必要とする拡張（現行 ChartPoint の後継）
 * NOTE: isPad / isDraft は UI 専用フラグとしてここに閉じ込める
 */
export type ChartPointUI = ChartPointBase & {
  emoji?: string;
  tags?: string[];
  user?: UserSummary;
  isPad?: boolean;
  isDraft?: boolean;
};

/**
 * 移行期間の互換エイリアス（いったん既存名を維持したいなら）
 * 段階移行後に ChartPoint = ChartPointUI をやめてもよい。
 */
export type ChartPoint = ChartPointUI;
