import { fetchPostFromApi } from '@/lib/post/api';
import { jsonFail, jsonOk } from '@/lib/bff/next-response';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const res = await fetchPostFromApi(id);
  if (!res.ok) return jsonFail(res);
  return jsonOk(res.data, 200);
}
