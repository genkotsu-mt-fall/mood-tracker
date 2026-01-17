// frontend/src/lib/dashboard/features/glassMoodChart/spec/pointSpec.ts
/**
 * 「点データの意味（解釈）」の契約
 * - tryInsert / insert / findValidIndex など、点のフィールド名依存を剥がすための spec
 */
export type PointSpec<TPoint> = {
  /** PAD（描画の余白用ダミー）か？ */
  isPad: (p: TPoint) => boolean;

  /** draft（仮の中間点）か？ */
  isDraft: (p: TPoint) => boolean;

  /** draft を “確定” させる（draftフラグを外す） */
  clearDraft: (p: TPoint) => TPoint;

  /** Y値（座標）を取り出す */
  getValue: (p: TPoint) => number | null | undefined;

  /** tags を取り出す（無ければ undefined でよい） */
  getTags: (p: TPoint) => readonly string[] | undefined;
};
