'use client';

import { useUserOptions } from '@/lib/user/useUserOptions';
import UserMultiSelectLite from './UserMultiSelectLite';

type Props = Omit<React.ComponentProps<typeof UserMultiSelectLite>, 'options'>;

export default function UserMultiSelectLiteRemote(props: Props) {
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

  return <UserMultiSelectLite options={options} {...props} />;
}
