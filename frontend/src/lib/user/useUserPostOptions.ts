import useSWR from 'swr';
import { fetchDataFromApi } from '../http/fetcher';
import { PostListResponseWithIsMe } from '@genkotsu-mt-fall/shared/schemas';

export function useUserPostOptions(userId?: string) {
  const key = userId ? `/api/user/${userId}/posts` : null;

  const { data, error, isLoading } = useSWR(
    key,
    fetchDataFromApi<PostListResponseWithIsMe>,
  );

  return {
    data,
    error: error as Error | undefined,
    isLoading,
  };
}
