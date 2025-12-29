'use client';
import useSWR from 'swr';
import { fetchDataFromApi } from '../http/fetcher';
import { UserResource } from '@genkotsu-mt-fall/shared/schemas';

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/user',
    fetchDataFromApi<UserResource[]>,
  );

  return { data, error: error as Error | undefined, isLoading, mutate };
}
