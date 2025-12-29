import { fetchMyFollowersFromApi } from '@/lib/user/api';
import { jsonFail, jsonOk } from '@/lib/bff/next-response';

export async function GET() {
  const res = await fetchMyFollowersFromApi();
  if (!res.ok) return jsonFail(res);
  return jsonOk(res.data, 200);
}
