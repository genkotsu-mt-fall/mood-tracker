'use client';

import type { ReactNode } from 'react';

type Props = {
  kind: 'loading' | 'error' | 'info';
  className?: string;
  children: ReactNode;
};

export function RemoteNotice({ kind, className = '', children }: Props) {
  if (kind === 'loading') {
    return (
      <div
        className={`animate-pulse rounded-xl border bg-white p-4 text-sm text-muted-foreground ${className}`}
      >
        {children}
      </div>
    );
  }

  if (kind === 'error') {
    return (
      <div
        className={`rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border bg-white p-4 text-sm text-muted-foreground ${className}`}
    >
      {children}
    </div>
  );
}
