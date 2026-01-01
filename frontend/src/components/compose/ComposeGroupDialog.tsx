'use client';

import CreateGroupDialogRemote from '@/components/privacy/CreateGroupDialog.Remote';
import type { ComposeGroupDialogProps } from '@/lib/compose/useComposeGroupDialog';

export default function ComposeGroupDialog(props: ComposeGroupDialogProps) {
  return (
    <CreateGroupDialogRemote
      open={props.open}
      onOpenChange={props.onOpenChange}
      name={props.name}
      onNameChange={props.onNameChange}
      error={props.error}
      submitting={props.submitting}
      onSubmit={props.onSubmit}
      onCancel={props.onCancel}
      selectedIds={props.selectedIds}
      onSelectedIdsChange={props.onSelectedIdsChange}
    />
  );
}
