import { readAccessTokenFromServer } from '../auth/cookies';
import { HttpJsonResult, postJsonAuth } from '../http/json';
import { Fail, Ok, toOkFail } from '../http/result';

type CreateGroupMember = {
  groupId: string;
  memberId: string;
};

export type GroupMemberData = {
  id: string;
  groupId: string;
  memberId: string;
};

export async function createGroupMemberFromApi(
  payload: CreateGroupMember,
): Promise<Ok<GroupMemberData> | Fail> {
  const token = await readAccessTokenFromServer();
  if (!token) return { ok: false, message: 'Unauthorized' };

  const r: HttpJsonResult<GroupMemberData> = await postJsonAuth(
    'group-member',
    payload,
    token,
  );

  return toOkFail<GroupMemberData>(r);
}
