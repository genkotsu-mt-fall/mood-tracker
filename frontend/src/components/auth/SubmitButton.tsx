'use client';

import { useFormStatus } from 'react-dom';

type Props = {
  label: string;
  pendingLabel: string;
};

export default function SubmitButton({ label, pendingLabel }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-gray-900"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
