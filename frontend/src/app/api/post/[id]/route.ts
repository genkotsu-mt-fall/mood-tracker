import { fetchPostFromApi } from '@/lib/post/api';
import { jsonFail, jsonOk } from '@/lib/bff/next-response';
import { parseUuidParamOrBadRequest } from '@/lib/bff/params';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  const v = parseUuidParamOrBadRequest(id, 'id');
  if (!v.ok) return v.res;
  const postId = v.value;

  const res = await fetchPostFromApi(postId);
  if (!res.ok) return jsonFail(res);
  return jsonOk(res.data, 200);
}
