import { zodToFieldErrors } from '@/lib/actions/state';
import { fetchGroupFromApi, updateGroupFromApi } from '@/lib/group/api';
import { GroupUpdateBodySchema } from '@genkotsu-mt-fall/shared/schemas';
import { NextRequest } from 'next/server';
import { jsonBadRequest, jsonFail, jsonOk } from '@/lib/bff/next-response';
import { parseUuidParamOrBadRequest } from '@/lib/bff/params';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const res = await fetchGroupFromApi(id);
  if (!res.ok) return jsonFail(res);
  return jsonOk(res.data, 200);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const v = parseUuidParamOrBadRequest(id, 'id');
  if (!v.ok) return v.res;
  const groupId = v.value;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonBadRequest('Invalid JSON');
  }

  const parsed = GroupUpdateBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonBadRequest(
      '入力内容をご確認ください。',
      zodToFieldErrors(parsed.error.issues),
    );
  }

  const res = await updateGroupFromApi(groupId, { name: parsed.data.name });
  if (!res.ok) return jsonFail(res);

  return jsonOk(res.data, 200);
}
