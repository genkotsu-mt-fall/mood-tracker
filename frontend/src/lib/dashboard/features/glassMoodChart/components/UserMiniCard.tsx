import { ChartPointUI } from '../model';

export function UserMiniCard<T extends ChartPointUI>({ p }: { p: T }) {
  const user = p.user;
  const v = typeof p.value === 'number' ? Math.round(p.value) : null;
  const emoji = typeof p.emoji === 'string' ? p.emoji : '🙂';
  if (!user || v === null) return null;

  return (
    <button
      type="button"
      className="
        snap-start shrink-0
        w-[260px] rounded-2xl
        border border-white/15
        bg-white/10
        backdrop-blur-md
        shadow-[0_12px_28px_rgba(0,0,0,0.28)]
        px-3 py-2
        text-left
        hover:bg-white/12
        focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            h-10 w-10 rounded-full
            border border-white/15
            bg-white/12
            backdrop-blur-md
            flex items-center justify-center
            text-white/90 font-semibold
          "
          aria-hidden="true"
        >
          {user.avatar}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white/92">
                {user.name}
              </div>
              <div className="truncate text-xs text-white/65">
                {user.handle}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <div className="text-lg">{emoji}</div>
              <div className="text-sm font-extrabold text-white/92">{v}%</div>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
            <span className="rounded-full border border-white/10 bg-white/8 px-2 py-0.5">
              {p.time.slice(11)}
            </span>
            {Array.isArray(p.tags) && p.tags.length > 0 ? (
              <span className="truncate rounded-full border border-white/10 bg-white/8 px-2 py-0.5">
                {p.tags.join(' · ')}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}
