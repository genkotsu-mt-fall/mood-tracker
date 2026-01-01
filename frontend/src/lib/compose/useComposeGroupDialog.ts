import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { Option } from '@/lib/common/types';
import { createGroupClient } from '@/lib/group/client';
import { createGroupMemberClient } from '@/lib/group-member/client';
import { useCreateGroupDialog } from '@/hooks/useCreateGroupDialog';

export type ComposeGroupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (v: string) => void;
  error: string;
  submitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
};

export function useComposeGroupDialog() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const createGroup = useCallback(
    async (name: string, userIds: string[]): Promise<Option> => {
      const created = await createGroupClient(name);
      await createGroupMemberClient(created.id, userIds);

      try {
        toast.success('グループを作成しました');
      } catch {}

      return created;
    },
    [],
  );

  const {
    open,
    setOpen,
    name,
    setName,
    error,
    setError,
    submitting,
    requestCreateGroup,
    handleSubmit,
    handleClose,
  } = useCreateGroupDialog({
    onCreate: createGroup,
    getSelectedUserIds: () => selectedIds,
  });

  const onOpenChange = useCallback(
    (o: boolean) => {
      if (o) setOpen(true);
      else handleClose();
    },
    [setOpen, handleClose],
  );

  const onNameChange = useCallback(
    (v: string) => {
      setName(v);
      if (error) setError('');
    },
    [setName, setError, error],
  );

  const dialogProps: ComposeGroupDialogProps = useMemo(
    () => ({
      open,
      onOpenChange,
      name,
      onNameChange,
      error,
      submitting,
      onSubmit: handleSubmit,
      onCancel: handleClose,
      selectedIds,
      onSelectedIdsChange: setSelectedIds,
    }),
    [
      open,
      onOpenChange,
      name,
      onNameChange,
      error,
      submitting,
      handleSubmit,
      handleClose,
      selectedIds,
    ],
  );

  return {
    requestCreateGroup,
    dialogProps,
  };
}
