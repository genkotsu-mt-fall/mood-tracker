import { fetchMyFollowingUsersFromApi } from '@/lib/user/api';
import { jsonFail, jsonOk } from '@/lib/bff/next-response';

export async function GET() {
  const res = await fetchMyFollowingUsersFromApi();
  if (!res.ok) return jsonFail(res);
  return jsonOk(res.data, 200);
}
