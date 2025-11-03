'use client';

import useSWR from 'swr';
import { fetchDataFromApi } from '../http/fetcher';
import { UserResource } from '@genkotsu-mt-fall/shared/schemas';

export function useMyFollowingOptions() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/me/following',
    fetchDataFromApi<UserResource[]>,
  );
  return {
    users: data ?? [],
    error: error as Error | undefined,
    isLoading,
    mutate,
  };
}
