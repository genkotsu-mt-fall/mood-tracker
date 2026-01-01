'use client';

type Props = {
  privacySummary: string;
  left: number;
  title?: string;
  subtitle?: string;
};

export default function ComposeHeader({
  privacySummary,
  left,
  title = '投稿作成',
  subtitle = 'いまの気持ちをシェアしましょう',
}: Props) {
  return (
    <section className="sticky top-0 z-10 mx-auto w-full max-w-3xl px-4 pt-4">
      <div className="rounded-3xl bg-gradient-to-r from-sky-50 to-fuchsia-50 p-4 ring-1 ring-inset ring-sky-100/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-gray-900">
              {title}
            </h1>
            <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-gray-600 ring-1 ring-gray-200">
              可視性: {privacySummary}
            </span>
            <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-gray-600 ring-1 ring-gray-200">
              残り {left}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
