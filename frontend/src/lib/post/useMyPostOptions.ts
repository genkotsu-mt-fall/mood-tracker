'use client';

import useSWR from 'swr';
import { fetchDataFromApi } from '../http/fetcher';
import { PostListResponse } from '@genkotsu-mt-fall/shared/schemas';

export function useMyPostOptions() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/me/posts',
    fetchDataFromApi<PostListResponse>,
  );

  return {
    options: data ?? [],
    error: error as Error | undefined,
    isLoading,
    mutate,
  };
}
