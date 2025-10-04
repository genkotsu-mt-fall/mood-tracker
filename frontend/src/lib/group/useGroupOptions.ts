import useSWR from 'swr';
import { fetchDataFromApi } from '../http/fetcher';
import { GroupData } from './api';

export function useGroupOptions() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/me/groups',
    fetchDataFromApi<GroupData[]>,
  );

  const options = (data ?? []).map((group: GroupData) => ({
    id: group.id,
    label: group.name,
  }));

  return {
    options,
    error: error as Error | undefined,
    isLoading,
    mutate,
  };
}
