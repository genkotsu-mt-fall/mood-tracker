'use client';

import useSWR from 'swr';
import { fetchDataFromApi } from '../http/fetcher';
import type { UserResource } from '@genkotsu-mt-fall/shared/schemas';

export function useGroupMembers(id?: string) {
  const key = id ? `/api/group/${id}/members` : null;
  const { data, error, isLoading, mutate } = useSWR(
    key,
    fetchDataFromApi<UserResource[]>,
  );

  return {
    members: data ?? [],
    error: error as Error | undefined,
    isLoading,
    mutate,
  };
}
