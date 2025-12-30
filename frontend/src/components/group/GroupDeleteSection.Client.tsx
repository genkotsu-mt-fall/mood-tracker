'use client';

import GroupDeleteSection from '@/components/group/GroupDeleteSection';
import GroupDeleteCard from '@/components/group/GroupDeleteCard';
import { deleteGroupAndRedirectAction } from '@/components/group/deleteGroup.action';

export default function GroupDeleteSectionClient({ id }: { id: string }) {
  return (
    <GroupDeleteSection action={deleteGroupAndRedirectAction.bind(null, id)}>
      {(ux) => <GroupDeleteCard ux={ux} />}
    </GroupDeleteSection>
  );
}
