import { fetchPostFromApi } from '@/lib/post/api';
import { jsonFail, jsonOk } from '@/lib/bff/next-response';
import { parseUuidParamOrBadRequest } from '@/lib/bff/params';
import { fetchMyProfileFromApi } from '@/lib/user/api';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  const v = parseUuidParamOrBadRequest(id, 'id');
  if (!v.ok) return v.res;
  const postId = v.value;

  const postsRes = await fetchPostFromApi(postId);
  if (!postsRes.ok) return jsonFail(postsRes);

  const meRes = await fetchMyProfileFromApi();
  const meId = meRes.ok ? meRes.data.id : undefined;

  const data = {
    ...postsRes.data,
    isMe: !!meId && postsRes.data.userId === meId,
  };

  return jsonOk(data, 200);
}
