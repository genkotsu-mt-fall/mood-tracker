import { useUserOptions } from '@/lib/user/useUserOptions';
import CreateGroupDialog from './CreateGroupDialog';
import React from 'react';

type BaseProps = React.ComponentProps<typeof CreateGroupDialog>;
type Props = Omit<BaseProps, 'users'>;

export default function CreateGroupDialogRemote(props: Props) {
  const { options, error, isLoading } = useUserOptions();

  if (isLoading)
    return (
      <div className="animate-pulse rounded-md border p-3 text-sm text-muted-foreground">
        ユーザー一覧を読み込み中…
      </div>
    );

  if (error)
    return (
      <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
        ユーザー一覧の取得に失敗しました：{error.message}
      </div>
    );

  return <CreateGroupDialog {...props} users={options} />;
}
