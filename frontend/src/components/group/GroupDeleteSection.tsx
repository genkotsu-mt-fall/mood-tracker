'use client';

import { ReactNode } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { DeleteGroupState } from './deleteGroup.action';

export type GroupDeleteUx = {
  error: string | null;
  isDeleting: boolean;
  formAction: (formData: FormData) => void;
};

export default function GroupDeleteSection({
  action,
  children,
}: {
  action: (
    prev: DeleteGroupState,
    formData: FormData,
  ) => Promise<DeleteGroupState>;
  children: (ux: GroupDeleteUx) => ReactNode;
}) {
  const [state, formAction] = useActionState<DeleteGroupState, FormData>(
    action,
    { ok: true },
  );
  const { pending } = useFormStatus();

  return (
    <>
      {children({
        error: state.ok ? null : state.message,
        isDeleting: pending,
        formAction,
      })}
    </>
  );
}
