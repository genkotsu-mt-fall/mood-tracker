'use client';

import { ReactNode } from 'react';
import { useGroupListDelete, GroupListDeleteApi } from './useGroupListDelete';

export type GroupListViewProps = {
  onDelete: (groupId: string) => Promise<void>;
  children: (api: GroupListDeleteApi) => ReactNode;
};

export default function GroupListView({
  onDelete,
  children,
}: GroupListViewProps) {
  const api = useGroupListDelete({ onDelete });
  return <>{children(api)}</>;
}
