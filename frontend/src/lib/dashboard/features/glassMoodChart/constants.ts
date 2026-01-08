/**
 * 無限パン設計パラメータ
 * - VISIBLE: チャートに表示する点数（常に10件）
 * - STOCK_TARGET: 初回/追加取得で「だいたいこのくらい先読みを確保したい」目安（50件）
 * - THRESHOLD: 古い側の残り（左側の残り）がこの数以下になったら追加取得（20件）
 */
export const VISIBLE = 10;
export const STOCK_TARGET = 50;
export const THRESHOLD = 20;

/**
 * ドラッグ→インデックス変換の “感度”
 * 1点分を何pxとして扱うか（大きいほど、同じドラッグ量でも動きが遅くなる）
 */
export const POINT_PX = 28;

/**
 * 「クリック」か「ドラッグ」かを判定する閾値（px）
 * - これより動いたら “パン” とみなしてクリック処理（点の追加）をしない
 */
export const DRAG_THRESHOLD_PX = 6;
