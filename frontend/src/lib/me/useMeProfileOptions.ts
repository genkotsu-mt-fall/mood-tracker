import { MyProfileResponse } from '@genkotsu-mt-fall/shared/schemas';
import useSWR from 'swr';
import { fetchDataFromApi } from '../http/fetcher';

// export type MyProfileResponse = {
//   profile: UserResource;
//   followersCount: number;
//   followingCount: number;
// };

export function useMyProfileOptions() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/me/profile',
    fetchDataFromApi<MyProfileResponse>,
  );

  return {
    data,
    error: error as Error | undefined,
    isLoading,
    mutate,
  };
}
