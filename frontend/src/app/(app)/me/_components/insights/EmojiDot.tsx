"use client";
import type { StackedPoint } from "./types";

export default function EmojiDot({
  cx = 0,
  cy = 0,
  payload,
  onSelect,
}: {
  cx?: number;
  cy?: number;
  payload?: StackedPoint;
  onSelect?: (payload?: StackedPoint) => void;
}) {
  const em = payload?.emoji ?? "🙂";
  return (
    <text
      x={cx}
      y={cy}
      fontSize={20}
      textAnchor="middle"
      dy="0.35em"
      style={{ cursor: "pointer", userSelect: "none" }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(payload);
      }}
      role="button"
      aria-label={`Open details for ${payload?.day ?? "this point"}`}
    >
      {em}
    </text>
  );
}
