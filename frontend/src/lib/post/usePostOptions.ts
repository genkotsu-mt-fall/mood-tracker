'use client';

import useSWR from 'swr';
import { fetchDataFromApi } from '../http/fetcher';
import { PostListResponse } from '@genkotsu-mt-fall/shared/schemas';

export function usePostOptions() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/feed',
    fetchDataFromApi<PostListResponse>,
  );

  return {
    options: data ?? [],
    error: error as Error | undefined,
    isLoading,
    mutate,
  };
}
