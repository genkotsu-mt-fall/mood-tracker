import { fetchGroupsFromApi } from '@/lib/group/api';
import { jsonFail, jsonOk } from '@/lib/bff/next-response';

export async function GET() {
  const res = await fetchGroupsFromApi();
  if (!res.ok) return jsonFail(res);
  return jsonOk(res.data, 200);
}
