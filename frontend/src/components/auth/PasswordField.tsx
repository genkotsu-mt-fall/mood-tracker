'use client';

import { useState } from 'react';
import FormField from './FormField';

type Props = {
  id: string;
  name: string;
  label: string;
  autoComplete?: string;
  error?: string;
};

export default function PasswordField({
  id,
  name,
  label,
  autoComplete,
  error,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormField
      id={id}
      label={label}
      error={error}
      name={name}
      autoComplete={autoComplete}
      type={showPassword ? 'text' : 'password'}
      after={
        <button
          type="button"
          className="text-xs text-gray-600 underline underline-offset-2"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      }
    />
  );
}
