'use client';
import useSWR from 'swr';
import { UserData } from './api';
import { fetchDataFromApi } from '../http/fetcher';

export function useUserOptions() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/user',
    fetchDataFromApi<UserData[]>,
  );

  const options = (data ?? []).map((user: UserData) => ({
    id: user.id,
    label: user.name || user.email,
  }));

  return { options, error: error as Error | undefined, isLoading, mutate };
}
