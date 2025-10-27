import useSWR from 'swr';
import { fetchDataFromApi } from '../http/fetcher';
import { GroupResource } from '@genkotsu-mt-fall/shared/schemas';

export function useGroupOptions() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/me/groups',
    fetchDataFromApi<GroupResource[]>,
  );

  const options = (data ?? []).map((group: GroupResource) => ({
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
