'use client';

import { useMemo } from 'react';
import type { UserResource } from '@genkotsu-mt-fall/shared/schemas';
import GroupMembersList, {
  type GroupMemberItem,
} from '@/components/group/GroupMembersList';
import { useMembersDraft } from '@/components/group-edit/GroupEditProvider';
import CandidateUsersAccordionRemote from './CandidateUsersAccordion.Remote';
import MembersInlineNotice from '@/components/group/MembersInlineNotice';

function toLabel(u: UserResource): string {
  return u.name ?? u.email ?? u.id;
}
function toSubtitle(u: UserResource): string | undefined {
  return u.email;
}

export default function GroupMembersView({
  baseMembers,
}: {
  baseMembers: UserResource[];
}) {
  const editor = useMembersDraft();

  // baseIds（確定メンバーの集合）は View 内で作る（Providerには入れない）
  const baseIds = useMemo(
    () => new Set(baseMembers.map((m) => m.id)),
    [baseMembers],
  );

  // 追加予定（added）をbaseと重複しないように整形
  const addedList = useMemo(() => {
    return Array.from(editor.addedMembers.values()).filter(
      (u) => !baseIds.has(u.id),
    );
  }, [editor.addedMembers, baseIds]);

  // 表示するメンバー（base + added）
  const viewMembers = useMemo(
    () => [...baseMembers, ...addedList],
    [baseMembers, addedList],
  );

  // id -> user を作って、List の onRemove/onUndo（idだけ）から user/label を引けるようにする
  const byId = useMemo(() => {
    const m = new Map<string, UserResource>();
    for (const u of baseMembers) m.set(u.id, u);
    for (const u of addedList) m.set(u.id, u);
    return m;
  }, [baseMembers, addedList]);

  const items: GroupMemberItem[] = viewMembers.map((u) => ({
    id: u.id,
    name: toLabel(u),
    src: undefined,
    subtitle: toSubtitle(u),
    status: editor.statusOf(u.id, baseIds),
  }));

  return (
    <>
      <details className="rounded-lg border border-gray-200">
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium">
          現在のメンバー（{items.length}）
        </summary>
        <div className="px-3 pb-3">
          <GroupMembersList
            items={items}
            onRemove={
              editor.editable
                ? (id) => {
                    const u = byId.get(id);
                    if (!u) return;
                    editor.removeById(id, toLabel(u), baseIds.has(id));
                  }
                : undefined
            }
            onUndo={
              editor.editable
                ? (id) => {
                    const u = byId.get(id);
                    if (!u) return;
                    editor.undoById(id, toLabel(u));
                  }
                : undefined
            }
          />
        </div>
      </details>

      {/* 編集中だけ候補ユーザー Remote を呼ぶ（ツリー要件どおり） */}
      {editor.editable ? (
        <CandidateUsersAccordionRemote baseIds={baseIds} />
      ) : null}

      {/* UX（lastAction）を見る通知 */}
      <MembersInlineNotice />
    </>
  );
}
