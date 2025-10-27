'use client';
import useSWR from 'swr';
import { fetchDataFromApi } from '../http/fetcher';
import { UserResource } from '@genkotsu-mt-fall/shared/schemas';

export function useUserOptions() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/user',
    fetchDataFromApi<UserResource[]>,
  );

  const options = (data ?? []).map((user: UserResource) => ({
    id: user.id,
    label: user.name || user.email,
  }));

  return { options, error: error as Error | undefined, isLoading, mutate };
}
