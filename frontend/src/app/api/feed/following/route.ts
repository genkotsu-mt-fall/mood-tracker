import { fetchFollowingPostsFromApi } from '@/lib/post/api';
import { jsonFail, jsonOk } from '@/lib/bff/next-response';
import { fetchMyProfileFromApi } from '@/lib/user/api';

export async function GET() {
  const postsRes = await fetchFollowingPostsFromApi();
  if (!postsRes.ok) return jsonFail(postsRes);

  const meRes = await fetchMyProfileFromApi();
  const meId = meRes.ok ? meRes.data.id : undefined;

  const data = postsRes.data.map((p) => ({
    ...p,
    isMe: !!meId && p.userId === meId,
  }));

  return jsonOk(data, 200);
}
