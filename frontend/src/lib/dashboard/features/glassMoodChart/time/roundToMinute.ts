export function roundToMinute(ms: number) {
  const m = 60_000;
  return Math.round(ms / m) * m;
}
