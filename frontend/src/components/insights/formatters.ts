export function resolveTickLabel(value: unknown, tick: unknown): string {
  const labelFromPayload = (
    tick as { payload?: { xLabel?: unknown } } | undefined
  )?.payload?.xLabel;
  const raw = (
    typeof labelFromPayload === 'string' ? labelFromPayload : value
  ) as string | undefined;
  if (!raw) return '';
  return raw.length >= 7 ? raw.slice(5) : raw; // YYYY-MM-DD -> MM-DD
}

export function resolveTooltipLabel(props: unknown): string {
  const p = props as
    | { payload?: Array<{ payload?: { xLabel?: unknown } }>; label?: unknown }
    | undefined;
  const firstPayload = p?.payload?.[0]?.payload as
    | { xLabel?: unknown }
    | undefined;
  if (typeof firstPayload?.xLabel === 'string') return firstPayload.xLabel;
  const label = p?.label;
  return typeof label === 'string' ? label.split('#')[0] : '';
}
