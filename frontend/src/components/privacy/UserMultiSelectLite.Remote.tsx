'use client';

import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useUserOptions } from '@/lib/user/useUserOptions';
import UserMultiSelectLite from './UserMultiSelectLite';

type Props = Omit<React.ComponentProps<typeof UserMultiSelectLite>, 'options'>;

export default function UserMultiSelectLiteRemote(props: Props) {
  const { options, error, isLoading } = useUserOptions();

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      className="rounded-md p-3"
      loading={<>ユーザー一覧を読み込み中…</>}
      errorView={(e) => <>ユーザー一覧の取得に失敗しました：{e.message}</>}
    >
      <UserMultiSelectLite options={options} {...props} />
    </RemoteBoundary>
  );
}
