'use client';

import { use } from 'react';
import GroupTitleCardRemote from '../_components/GroupTitleCard.Remote';
import GroupMembersListRemote from '../_components/GroupMembersList.Remote';
import GroupMemberAddForm from '@/components/group/GroupMemberAddForm';

type Props = { params: Promise<{ id: string }> };

export default function GroupDetailPage({ params }: Props) {
  // Next.js 15.5: unwrap params
  const { id } = use(params);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-3 text-lg font-semibold text-gray-900">グループ</h1>

        {/* タイトル編集（データ取得はRemote側） */}
        <GroupTitleCardRemote id={id} />

        <section className="rounded-xl border border-gray-200 bg-white p-3">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">メンバー</h2>

          {/* メンバー一覧（データ取得はRemote側） */}
          <GroupMembersListRemote id={id} />

          {/* 追加フォーム（見た目のみ） */}
          <GroupMemberAddForm disabled />
        </section>
      </div>
    </main>
  );
}
