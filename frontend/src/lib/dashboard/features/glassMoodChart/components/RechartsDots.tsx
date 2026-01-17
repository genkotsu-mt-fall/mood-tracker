import { clamp } from '@/lib/dashboard/utils/math/clamp';
import type { PointClickHandler } from '../ux/useGlassMoodChartUX';

type RechartsDotProps<TPayload = unknown> = {
  cx?: number;
  cy?: number;
  value?: number | null;
  payload?: TPayload;
};

// Dots が最低限必要とする payload 契約（pad 判定だけ）
type DotPayload = {
  isPad?: boolean;
};

export function GlowDot<TPayload extends DotPayload>({
  cx,
  cy,
  value,
  payload,
  onPointClick,
}: RechartsDotProps<TPayload> & {
  onPointClick?: PointClickHandler<TPayload>;
}) {
  if (typeof cx !== 'number' || typeof cy !== 'number') return null;
  if (typeof value !== 'number') return null;
  if (!payload || payload.isPad) return null;

  const rOuter = clamp(10 + value * 0.02, 10, 12);

  return (
    <g
      data-gmc-dot="1"
      style={{ cursor: 'pointer' }}
      onClick={(ev) => {
        ev.stopPropagation();
        onPointClick?.(payload, { x: cx, y: cy });
      }}
    >
      <circle cx={cx} cy={cy} r={rOuter} fill="rgba(56,189,248,0.18)" />
      <circle
        cx={cx}
        cy={cy}
        r={7}
        fill="rgba(255,255,255,0.92)"
        stroke="rgba(56,189,248,0.80)"
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={4} fill="rgba(255,255,255,1)" />
    </g>
  );
}

export function GlowActiveDot<TPayload extends DotPayload>({
  cx,
  cy,
  value,
  payload,
  onPointClick,
}: RechartsDotProps<TPayload> & {
  onPointClick?: PointClickHandler<TPayload>;
}) {
  if (typeof cx !== 'number' || typeof cy !== 'number') return null;
  if (typeof value !== 'number') return null;
  if (!payload || payload.isPad) return null;

  return (
    <g
      data-gmc-dot="1"
      style={{ cursor: 'pointer' }}
      onClick={(ev) => {
        ev.stopPropagation();
        onPointClick?.(payload, { x: cx, y: cy });
      }}
    >
      <circle cx={cx} cy={cy} r={16} fill="rgba(56,189,248,0.22)" />
      <circle
        cx={cx}
        cy={cy}
        r={9}
        fill="rgba(255,255,255,0.96)"
        stroke="rgba(34,211,238,0.92)"
        strokeWidth={3}
      />
      <circle cx={cx} cy={cy} r={5} fill="rgba(255,255,255,1)" />
    </g>
  );
}
