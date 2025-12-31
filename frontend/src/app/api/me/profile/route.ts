import { jsonFail, jsonOk } from '@/lib/bff/next-response';
import {
  fetchMyFollowersFromApi,
  fetchMyFollowingUsersFromApi,
  fetchMyProfileFromApi,
} from '@/lib/user/api';

export async function GET() {
  const [profileRes, followersRes, followingRes] = await Promise.all([
    fetchMyProfileFromApi(),
    fetchMyFollowersFromApi(),
    fetchMyFollowingUsersFromApi(),
  ]);

  if (!profileRes.ok) return jsonFail(profileRes);
  if (!followersRes.ok) return jsonFail(followersRes);
  if (!followingRes.ok) return jsonFail(followingRes);

  return jsonOk(
    {
      profile: profileRes.data,
      followersCount: followersRes.data.length,
      followingCount: followingRes.data.length,
    },
    200,
  );
}
