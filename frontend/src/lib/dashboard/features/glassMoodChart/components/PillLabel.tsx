type RechartsLabelProps<TPayload = unknown> = {
  x?: number;
  y?: number;
  value?: number | null;
  payload?: TPayload;
};

type PillLabelExtraProps = {
  filterId: string;
};

// PillLabel が実際に必要とする payload はこれだけ
type PillLabelPayload = {
  isPad?: boolean;
  emoji?: string | null;
};

export function PillLabel(
  props: RechartsLabelProps<PillLabelPayload> & PillLabelExtraProps,
) {
  const { x, y, value, payload, filterId } = props;
  if (typeof x !== 'number' || typeof y !== 'number') return null;
  if (typeof value !== 'number') return null;
  if (payload?.isPad) return null;

  const v = Math.round(value);
  const emoji = typeof payload?.emoji === 'string' ? payload.emoji : '🙂';
  const text = `${v}%`;

  const w = v >= 100 ? 90 : v >= 10 ? 82 : 76;
  const h = 36;

  const tx = x - w / 2;
  const ty = y - h - 14;

  return (
    <g transform={`translate(${tx},${ty})`} pointerEvents="none">
      <rect
        width={w}
        height={h}
        rx={18}
        fill="rgba(255,255,255,0.18)"
        stroke="rgba(255,255,255,0.22)"
        filter={`url(#${filterId})`}
      />
      <circle
        cx={18}
        cy={h / 2}
        r={12}
        fill="rgba(255,255,255,0.22)"
        stroke="rgba(255,255,255,0.22)"
      />
      <text x={18} y={h / 2 + 5} textAnchor="middle" fontSize={14}>
        {emoji}
      </text>

      <text
        x={w - 14}
        y={h / 2 + 5}
        textAnchor="end"
        fontSize={14}
        fontWeight={800}
        fill="rgba(255,255,255,0.92)"
        paintOrder="stroke"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth={3}
      >
        {text}
      </text>
    </g>
  );
}
