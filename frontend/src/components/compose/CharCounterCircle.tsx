'use client';

type Props = {
  used: number;
  left: number;
  circleR: number;
  circleC: number;
  dash: number;
  isOverLimit: boolean;
  className?: string;
};

export default function CharCounterCircle({
  used,
  left,
  circleR,
  circleC,
  dash,
  isOverLimit,
  className,
}: Props) {
  return (
    <div className={className ?? 'relative h-7 w-7'}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 -rotate-90">
        <circle
          cx="16"
          cy="16"
          r={circleR}
          className="stroke-gray-200"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="16"
          cy="16"
          r={circleR}
          strokeWidth="3"
          fill="none"
          className={isOverLimit ? 'stroke-red-500' : 'stroke-blue-500'}
          strokeDasharray={`${dash} ${circleC}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[10px] text-gray-500">
        {left}
      </span>
    </div>
  );
}
