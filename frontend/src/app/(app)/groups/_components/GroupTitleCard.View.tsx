'use client';

import GroupTitleCard from '@/components/group/GroupTitleCard';
import { useGroupNameDraft } from '@/components/group-edit/GroupEditProvider';

export default function GroupTitleCardView({ baseName }: { baseName: string }) {
  const nameDraft = useGroupNameDraft();

  const name = nameDraft.draftName ?? baseName;

  return (
    <GroupTitleCard
      name={name}
      editable={nameDraft.editable}
      onNameChange={(v) => {
        // base と同じなら draft を消して dirty を解消
        nameDraft.setDraftName(v === baseName ? null : v);
      }}
    />
  );
}
