import { fetchMyPostsFromApi } from '@/lib/post/api';
import { jsonFail, jsonOk } from '@/lib/bff/next-response';

export async function GET() {
  const res = await fetchMyPostsFromApi();
  if (!res.ok) return jsonFail(res);

  const data = res.data.map((p) => ({
    ...p,
    isMe: true,
  }));

  return jsonOk(data, 200);
}
