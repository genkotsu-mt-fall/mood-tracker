import { jsonFail, jsonOk } from '@/lib/bff/next-response';
import { parseUuidParamOrBadRequest } from '@/lib/bff/params';
import { fetchUserPostsFromApi } from '@/lib/post/api';
import { fetchMyProfileFromApi } from '@/lib/user/api';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id: rawId } = await params;

  const parsed = parseUuidParamOrBadRequest(rawId, 'user id');
  if (!parsed.ok) return parsed.res;

  const userId = parsed.value;

  const postsRes = await fetchUserPostsFromApi(userId);
  if (!postsRes.ok) return jsonFail(postsRes);

  const meRes = await fetchMyProfileFromApi();
  const meId = meRes.ok ? meRes.data.id : undefined;

  const data = postsRes.data.map((p) => ({
    ...p,
    isMe: !!meId && p.userId === meId,
  }));

  return jsonOk(data, 200);
}
