'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IntensityDial } from './IntensityDial';

export default function PostHeaderUI({
  name,
  avatarUrl,
  createdAtLabel,
  emoji,
  intensity,
  authorHref,
  ariaLabel,
}: {
  name: string;
  avatarUrl?: string;
  createdAtLabel: string;
  emoji?: string;
  intensity?: number;
  authorHref?: string;
  ariaLabel?: string;
}) {
  const avatar = (
    <Avatar className="h-9 w-9">
      <AvatarImage src={avatarUrl} alt="" />
      <AvatarFallback className="bg-gray-200 text-gray-600">
        {name?.[0]?.toUpperCase() ?? 'U'}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div className="mb-2 flex items-start gap-3">
      {authorHref ? (
        <Link
          href={authorHref}
          className="shrink-0"
          aria-label={ariaLabel ?? `${name}のユーザーページへ`}
        >
          {avatar}
        </Link>
      ) : (
        <div className="shrink-0">{avatar}</div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-gray-900">
              {name}
            </div>
            <div className="text-xs text-gray-500">{createdAtLabel}</div>
          </div>
          <div className="flex items-center gap-2">
            <IntensityDial pct={intensity} emoji={emoji} />
          </div>
        </div>
      </div>
    </div>
  );
}
