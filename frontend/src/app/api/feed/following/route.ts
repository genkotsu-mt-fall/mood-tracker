import { fetchFollowingPostsFromApi } from '@/lib/post/api';
import { jsonFail, jsonOk } from '@/lib/bff/next-response';

export async function GET() {
  const res = await fetchFollowingPostsFromApi();
  if (!res.ok) return jsonFail(res);
  return jsonOk(res.data, 200);
}
