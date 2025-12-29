'use client';

import { ReactNode } from 'react';
import type {
  EditableElement,
  EditableFieldApi,
  UseEditableFieldOptions,
} from './useEditableField';
import { useEditableField } from './useEditableField';

export type EditableFieldProps<T extends EditableElement = HTMLInputElement> =
  UseEditableFieldOptions & {
    children: (api: EditableFieldApi<T>) => ReactNode;
  };

export function EditableField<T extends EditableElement = HTMLInputElement>(
  props: EditableFieldProps<T>,
) {
  const { children, ...options } = props;
  const api = useEditableField<T>(options);
  return <>{children(api)}</>;
}
