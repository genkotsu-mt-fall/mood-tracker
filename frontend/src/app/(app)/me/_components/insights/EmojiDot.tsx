"use client";
import type { StackedPoint } from "./types";

export default function EmojiDot({
  cx = 0,
  cy = 0,
  payload,
}: {
  cx?: number;
  cy?: number;
  payload?: StackedPoint;
}) {
  const em = payload?.emoji ?? "🙂";
  return (
    <text x={cx} y={cy} fontSize={20} textAnchor="middle" dy="0.35em">
      {em}
    </text>
  );
}
