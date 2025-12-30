'use client';

import React from 'react';
import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useUserOptions } from '@/lib/user/useUserOptions';
import CreateGroupDialog from './CreateGroupDialog';

type BaseProps = React.ComponentProps<typeof CreateGroupDialog>;
type Props = Omit<BaseProps, 'users'>;

export default function CreateGroupDialogRemote(props: Props) {
  const { options, error, isLoading } = useUserOptions();

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      className="rounded-md p-3"
      loading={<>ユーザー一覧を読み込み中…</>}
      errorView={(e) => <>ユーザー一覧の取得に失敗しました：{e.message}</>}
    >
      <CreateGroupDialog {...props} users={options} />
    </RemoteBoundary>
  );
}
