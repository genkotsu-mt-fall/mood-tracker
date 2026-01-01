'use client';

type Props = {
  error?: string;
};

export default function ComposeFormError({ error }: Props) {
  if (!error) return null;
  return <p className="text-sm text-red-600">{error}</p>;
}
