'use client';

import useSWR from 'swr';
import { fetchDataFromApi } from '../http/fetcher';
import type { PostResource } from '@genkotsu-mt-fall/shared/schemas';

export function usePost(id?: string) {
  const key = id ? `/api/post/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR(
    key,
    fetchDataFromApi<PostResource>,
  );

  return {
    post: data,
    error: error as Error | undefined,
    isLoading,
    mutate,
  };
}
