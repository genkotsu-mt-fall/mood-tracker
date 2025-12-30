import { jsonFail, jsonOk } from '@/lib/bff/next-response';
import { fetchMyProfileFromApi } from '@/lib/user/api';

export async function GET() {
  const res = await fetchMyProfileFromApi();
  if (!res.ok) return jsonFail(res);
  return jsonOk(res.data, 200);
}
