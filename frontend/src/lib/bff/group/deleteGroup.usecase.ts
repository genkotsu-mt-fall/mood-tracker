import 'server-only';
import { deleteGroupFromApi, fetchGroupMembersFromApi } from '@/lib/group/api';
import { deleteGroupMemberFromApi } from '@/lib/group-member/api';

/**
 * グループ削除ユースケース（BFFロジック）。
 * - 1) メンバー取得
 * - 2) 全メンバー削除
 * - 3) グループ削除
 *
 * 戻り値は lib/group/api / lib/group-member/api と同じ Result 形式を返す想定。
 */
export async function deleteGroupUsecase(groupId: string) {
  // 1) メンバー取得（失敗なら中断）
  const membersRes = await fetchGroupMembersFromApi(groupId);
  if (!membersRes.ok) return membersRes;

  // 2) メンバー削除（失敗があれば中断）
  const deletionResults = await Promise.all(
    membersRes.data.map((member) =>
      deleteGroupMemberFromApi(groupId, member.id),
    ),
  );

  const firstFail = deletionResults.find((r) => !r.ok);
  if (firstFail && !firstFail.ok) return firstFail;

  // 3) グループ削除
  return deleteGroupFromApi(groupId);
}
