import { zodToFieldErrors } from '@/lib/actions/state';
import { createGroupFromApi } from '@/lib/group/api';
import { GroupCreateBodySchema } from '@genkotsu-mt-fall/shared/schemas';
import { NextRequest } from 'next/server';
import { jsonBadRequest, jsonFail, jsonOk } from '@/lib/bff/next-response';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonBadRequest('Invalid JSON');
  }

  const parsed = GroupCreateBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonBadRequest(
      '入力内容をご確認ください。',
      zodToFieldErrors(parsed.error.issues),
    );
  }

  const res = await createGroupFromApi({ name: parsed.data.name });
  if (!res.ok) return jsonFail(res);

  return jsonOk(res.data, 201);
}
