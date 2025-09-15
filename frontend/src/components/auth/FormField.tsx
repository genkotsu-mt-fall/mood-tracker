'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

type Props = {
  id: string;
  label: string;
  error?: string;
  after?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>;

const FormField = forwardRef<HTMLInputElement, Props>(function FormField(
  { id, label, error, after, className = '', ...inputProps },
  ref,
) {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`block w-full rounded-lg border ${error ? 'border-red-400' : 'border-gray-300'} bg-white px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${className}`}
          ref={ref}
          {...inputProps}
          aria-invalid={!!error}
          aria-describedby={describedBy}
        />
        {after && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {after}
          </div>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default FormField;
