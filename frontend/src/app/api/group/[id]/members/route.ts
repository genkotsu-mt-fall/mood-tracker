import { zodToFieldErrors } from '@/lib/actions/state';
import { fetchGroupMembersFromApi } from '@/lib/group/api';
import { NextRequest } from 'next/server';
import { jsonBadRequest, jsonFail, jsonOk } from '@/lib/bff/next-response';
import { GroupMembersDiffBodySchema } from '@genkotsu-mt-fall/shared/schemas';
import { parseUuidParamOrBadRequest } from '@/lib/bff/params';
import {
  createGroupMemberFromApi,
  deleteGroupMemberFromApi,
} from '@/lib/group-member/api';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const res = await fetchGroupMembersFromApi(id);
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

  const parsed = GroupMembersDiffBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonBadRequest(
      '入力内容をご確認ください。',
      zodToFieldErrors(parsed.error.issues),
    );
  }

  const { addedIds, removedIds } = parsed.data;
  if (addedIds.length === 0 && removedIds.length === 0) {
    return jsonBadRequest('変更がありません。');
  }

  // 追加と削除を並列実行（小規模想定）
  const results = await Promise.all([
    ...addedIds.map((memberId) =>
      createGroupMemberFromApi({ groupId, memberId }),
    ),
    ...removedIds.map((memberId) =>
      deleteGroupMemberFromApi(groupId, memberId),
    ),
  ]);

  const fail = results.find((r) => !r.ok);
  if (fail && !fail.ok) return jsonFail(fail);

  // 最新の members を返す（SaveBar が mutate(nextMembers,false) できる）
  const membersRes = await fetchGroupMembersFromApi(groupId);
  if (!membersRes.ok) return jsonFail(membersRes);

  return jsonOk(membersRes.data, 200);
}
