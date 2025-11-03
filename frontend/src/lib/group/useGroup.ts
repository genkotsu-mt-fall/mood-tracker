import useSWR from 'swr';
import { fetchDataFromApi } from '../http/fetcher';
import { GroupResource } from '@genkotsu-mt-fall/shared/schemas';

export function useGroupOptions(id?: string) {
  const key = id ? `/api/group/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR(
    key,
    fetchDataFromApi<GroupResource>,
  );

  return {
    data,
    error: error as Error | undefined,
    isLoading,
    mutate,
  };
}
