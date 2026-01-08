import { useState } from 'react';

/**
 * windowStart は「ロード済みデータ（PAD除外）の中で、今表示している窓の開始位置」
 * - 表示は常に 10件（VISIBLE）
 */
export function useViewRangeStartState() {
  const [windowStart, setWindowStart] = useState(0);
  return { windowStart, setWindowStart };
}
