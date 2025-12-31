import { jsonFail, jsonOk } from '@/lib/bff/next-response';
import { parseUuidParamOrBadRequest } from '@/lib/bff/params';
import {
  fetchUserProfileFromApi,
  fetchUserFollowersFromApi,
  fetchUserFollowingUsersFromApi,
  fetchMyProfileFromApi,
} from '@/lib/user/api';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id: rawId } = await params;

  const parsed = parseUuidParamOrBadRequest(rawId, 'user id');
  if (!parsed.ok) return parsed.res;

  const userId = parsed.value;

  const meRes = await fetchMyProfileFromApi();
  const meId = meRes.ok ? meRes.data.id : undefined;

  const [profileRes, followersRes, followingRes] = await Promise.all([
    fetchUserProfileFromApi(userId),
    fetchUserFollowersFromApi(userId),
    fetchUserFollowingUsersFromApi(userId),
  ]);

  if (!profileRes.ok) return jsonFail(profileRes);
  if (!followersRes.ok) return jsonFail(followersRes);
  if (!followingRes.ok) return jsonFail(followingRes);

  const isMe = !!meId && meId === userId;
  const isFollowing =
    !!meId && !isMe && followersRes.data.some((u) => u.id === meId);

  return jsonOk(
    {
      profile: profileRes.data,
      followersCount: followersRes.data.length,
      followingCount: followingRes.data.length,
      isMe,
      isFollowing,
    },
    200,
  );
}
