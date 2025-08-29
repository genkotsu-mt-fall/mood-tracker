export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function conicBg(pct: number) {
  const deg = pct * 3.6;
  return `conic-gradient(#111827 ${deg}deg, #e5e7eb 0deg)`;
}

export function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  return `${days}d`;
}
