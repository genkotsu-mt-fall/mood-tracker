'use client';

import type { ReactNode } from 'react';
import { RemoteNotice } from './RemoteNotice';

type Props = {
  isLoading: boolean;
  error?: Error | null;
  loading: ReactNode;
  errorView?: (e: Error) => ReactNode;
  className?: string;
  children: ReactNode;
};

export function RemoteBoundary({
  isLoading,
  error,
  loading,
  errorView,
  className,
  children,
}: Props) {
  if (isLoading)
    return (
      <RemoteNotice kind="loading" className={className}>
        {loading}
      </RemoteNotice>
    );
  if (error) {
    return (
      <RemoteNotice kind="error" className={className}>
        {errorView ? (
          errorView(error)
        ) : (
          <>取得に失敗しました：{error.message}</>
        )}
      </RemoteNotice>
    );
  }
  return <>{children}</>;
}
