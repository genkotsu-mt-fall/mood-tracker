'use client';

import GroupTitleCardRemote from '@/app/(app)/groups/_components/GroupTitleCard.Remote';

export default function GroupTitleSection({ id }: { id: string }) {
  return <GroupTitleCardRemote id={id} />;
}
