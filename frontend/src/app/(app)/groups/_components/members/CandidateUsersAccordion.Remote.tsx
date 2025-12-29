'use client';

import type { UserResource } from '@genkotsu-mt-fall/shared/schemas';
import { useUser } from '@/lib/user/useUser';
import CandidateUsersAccordionView from './CandidateUsersAccordion.View';

const EMPTY: UserResource[] = [];

export default function CandidateUsersAccordionRemote({
  baseIds,
}: {
  baseIds: Set<string>;
}) {
  const { data, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="mt-3 animate-pulse rounded-xl border bg-white p-4 text-sm text-muted-foreground">
        候補ユーザーを読み込み中…
      </div>
    );
  }
  if (error) {
    return (
      <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        候補ユーザーの取得に失敗しました：{error.message}
      </div>
    );
  }

  return (
    <CandidateUsersAccordionView candidates={data ?? EMPTY} baseIds={baseIds} />
  );
}
