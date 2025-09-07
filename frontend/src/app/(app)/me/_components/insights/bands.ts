import type { Band } from "./types";

export const BANDS: Band[] = [
  { low: 0, high: 15, color: "#2563EB", label: "0–15%" }, // 青
  { low: 15, high: 30, color: "#93C5FD", label: "15–30%" }, // 水色
  { low: 30, high: 50, color: "#FACC15", label: "30–50%" }, // 黄
  { low: 50, high: 75, color: "#FB923C", label: "50–75%" }, // オレンジ
  { low: 75, high: 100, color: "#F87171", label: "75–100%" }, // 赤
];

export function clamp100(x: unknown) {
  const n = typeof x === "number" ? x : 0;
  return Math.max(0, Math.min(100, n));
}

/** 値 v が [low, high) の帯にどれだけ含まれるか（高さ） */
export function bandHeight(v: number, low: number, high: number) {
  const vv = clamp100(v);
  return Math.max(0, Math.min(vv, high) - low);
}

export function bandOf(v: number) {
  return BANDS.find((b) => v >= b.low && v < b.high) ?? BANDS[BANDS.length - 1];
}
