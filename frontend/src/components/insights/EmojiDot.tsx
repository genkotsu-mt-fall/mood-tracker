'use client';

import { memo, useCallback } from 'react';
import type { DotProps } from 'recharts';
import type { StackedPoint } from './types';

type Props = DotProps & {
  /** Recharts から渡されるデータ行 */
  payload?: StackedPoint;
  /** クリック/Enter/Space で通知 */
  onPointSelect?: (payload?: StackedPoint) => void;
  /** 絵文字サイズ(px)・任意 */
  emojiSize?: number;
};

function EmojiDot({
  cx = 0,
  cy = 0,
  payload,
  onPointSelect,
  emojiSize = 20,
}: Props) {
  const em = payload?.emoji ?? '🙂';

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGTextElement>) => {
      e.stopPropagation();
      onPointSelect?.(payload);
    },
    [onPointSelect, payload],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<SVGTextElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPointSelect?.(payload);
      }
    },
    [onPointSelect, payload],
  );

  const isFiniteNumber = (n: unknown): n is number =>
    typeof n === 'number' && Number.isFinite(n);
  if (!isFiniteNumber(cx) || !isFiniteNumber(cy)) return null;

  const label = payload?.day
    ? `${payload.day} の詳細を開く`
    : 'このポイントの詳細を開く';

  return (
    <text
      x={cx}
      y={cy}
      fontSize={emojiSize}
      textAnchor="middle"
      dy="0.35em"
      style={{ cursor: 'pointer', userSelect: 'none' }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={label}
    >
      {em}
    </text>
  );
}

export default memo(EmojiDot);
