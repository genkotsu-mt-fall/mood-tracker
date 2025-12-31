import useSWR from 'swr';
import { fetchDataFromApi } from '../http/fetcher';
import { UserResource } from '@genkotsu-mt-fall/shared/schemas';

export type UserProfileResponse = {
  profile: UserResource;
  followersCount: number;
  followingCount: number;
  isMe: boolean;
  isFollowing: boolean;
};

export function useUserProfileOptions(userId?: string) {
  const key = userId ? `/api/user/${userId}/profile` : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    fetchDataFromApi<UserProfileResponse>,
  );

  return {
    data,
    error: error as Error | undefined,
    isLoading,
    mutate,
  };
}
