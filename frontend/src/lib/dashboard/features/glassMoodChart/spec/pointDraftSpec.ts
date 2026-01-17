// frontend/src/lib/dashboard/features/glassMoodChart/spec/pointDraftSpec.ts
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
