'use client';

import { useGroupOptions } from '@/lib/group/useGroupOptions';
import GroupSection from './GroupSection';
import { Option } from '@/lib/common/types';

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

  if (isLoading)
    return (
      <div className="animate-pulse rounded-md border p-3 text-sm text-muted-foreground">
        グループ一覧を読み込み中…
      </div>
    );

  if (error)
    return (
      <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
        グループ一覧の取得に失敗しました：{error.message}
      </div>
    );

  return (
    <GroupSection
      {...props}
      groupOptions={options}
      onRequestCreateGroup={handleRequestCreateGroup}
    />
  );
}
