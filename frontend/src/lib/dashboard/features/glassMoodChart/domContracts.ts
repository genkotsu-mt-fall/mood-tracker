export const GMC_DOT_DATA_ATTR = 'data-gmc-dot' as const;
export const GMC_DOT_DATA_VALUE = '1' as const;

// closest 判定用（イベント側で使う）
export const GMC_DOT_SELECTOR =
  `[${GMC_DOT_DATA_ATTR}="${GMC_DOT_DATA_VALUE}"]` as const;

// JSX に付ける用（描画側で使う）
export const GMC_DOT_DATA_PROPS = {
  [GMC_DOT_DATA_ATTR]: GMC_DOT_DATA_VALUE,
} as const;
