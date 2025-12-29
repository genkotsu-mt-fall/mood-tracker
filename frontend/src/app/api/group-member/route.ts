import { zodToFieldErrors } from '@/lib/actions/state';
import { createGroupMemberFromApi } from '@/lib/group-member/api';
import { GroupMemberCreateBodySchema } from '@genkotsu-mt-fall/shared/schemas';
import { NextRequest } from 'next/server';
import { jsonBadRequest, jsonFail, jsonOk } from '@/lib/bff/next-response';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonBadRequest('Invalid JSON');
  }

  const parsed = GroupMemberCreateBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonBadRequest(
      '送信されたデータが壊れているか、悪意のある値が含まれています。',
      zodToFieldErrors(parsed.error.issues),
    );
  }

  const res = await createGroupMemberFromApi({
    groupId: parsed.data.groupId,
    memberId: parsed.data.memberId,
  });
  if (!res.ok) return jsonFail(res);

  return jsonOk(res.data, 201);
}
