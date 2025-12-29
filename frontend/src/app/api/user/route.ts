import { fetchUsersFromApi } from '@/lib/user/api';
import { jsonFail, jsonOk } from '@/lib/bff/next-response';

export async function GET() {
  const res = await fetchUsersFromApi();
  if (!res.ok) return jsonFail(res);
  return jsonOk(res.data, 200);
}
