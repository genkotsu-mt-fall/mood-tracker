'use client';

import type { UserResource } from '@genkotsu-mt-fall/shared/schemas';
import { useUser } from '@/lib/user/useUser';
import CandidateUsersAccordionView from './CandidateUsersAccordion.View';
import { RemoteBoundary } from '@/components/remote/RemoteBoundary';

const EMPTY: UserResource[] = [];

export default function CandidateUsersAccordionRemote({
  baseIds,
}: {
  baseIds: Set<string>;
}) {
  const { data, error, isLoading } = useUser();

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      className="mt-3"
      loading={<>候補ユーザーを読み込み中…</>}
      errorView={(e) => <>候補ユーザーの取得に失敗しました：{e.message}</>}
    >
      <CandidateUsersAccordionView
        candidates={data ?? EMPTY}
        baseIds={baseIds}
      />
    </RemoteBoundary>
  );
}
