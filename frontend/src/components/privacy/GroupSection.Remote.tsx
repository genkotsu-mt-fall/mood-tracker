'use client';

import { RemoteBoundary } from '@/components/remote/RemoteBoundary';
import { useGroupOptions } from '@/lib/group/useGroupOptions';
import type { Option } from '@/lib/common/types';
import GroupSection from './GroupSection';

type BaseProps = React.ComponentProps<typeof GroupSection>;
type Props = Omit<BaseProps, 'groupOptions' | 'onRequestCreateGroup'> & {
  onRequestCreateGroup?: () => Promise<Option | void>;
};

export default function GroupSectionRemote(props: Props) {
  const { options, error, isLoading, mutate } = useGroupOptions();

  const handleRequestCreateGroup = props.onRequestCreateGroup
    ? async () => {
        const created = await props.onRequestCreateGroup!();
        if (created) await mutate();
        return created;
      }
    : undefined;

  return (
    <RemoteBoundary
      isLoading={isLoading}
      error={error}
      className="rounded-md p-3"
      loading={<>グループ一覧を読み込み中…</>}
      errorView={(e) => <>グループ一覧の取得に失敗しました：{e.message}</>}
    >
      <GroupSection
        {...props}
        groupOptions={options}
        onRequestCreateGroup={handleRequestCreateGroup}
      />
    </RemoteBoundary>
  );
}
