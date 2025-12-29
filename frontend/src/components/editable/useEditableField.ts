'use client';

import {
  RefCallback,
  FocusEventHandler,
  MouseEventHandler,
  ChangeEventHandler,
  KeyboardEventHandler,
  useState,
  useRef,
  useCallback,
} from 'react';

export type EditableElement = HTMLInputElement | HTMLTextAreaElement;

export type UseEditableFieldOptions = {
  editable: boolean; // 編集権限（trueなら編集可能）
  value: string; // 表示する値（controlled）
  onChange: (v: string) => void; // 編集中に値が変わったとき親へ通知

  // 方針: blurで編集終了（default true）
  commitOnBlur?: boolean;

  // パターンB用（default true）
  startOnEnter?: boolean;
  allowDoubleClick?: boolean;
};

export type EditableFieldBind<T extends EditableElement> = {
  ref: RefCallback<T>;
  value: string;
  readOnly: boolean;
  'aria-readonly': boolean;

  onFocus: FocusEventHandler<T>;
  onBlur: FocusEventHandler<T>;
  onDoubleClick?: MouseEventHandler<T>;
  onChange: ChangeEventHandler<T>;
  onKeyDown: KeyboardEventHandler<T>;
};

export type EditableButtonBind = {
  type: 'button';
  onMouseDown: MouseEventHandler<HTMLButtonElement>;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export type EditableFieldApi<T extends EditableElement> = {
  isArmed: boolean; // フォーカス中の“編集準備”
  isEditing: boolean; // 実際に編集可能な状態
  showEditAffordance: boolean; // “編集”ボタンを出すべきか

  startEdit: () => void;
  finishEdit: () => void;
  cancelEdit: () => void;

  fieldProps: EditableFieldBind<T>;
  editButtonProps: EditableButtonBind;

  hint: string;
};

export function useEditableField<T extends EditableElement = HTMLInputElement>(
  opts: UseEditableFieldOptions,
): EditableFieldApi<T> {
  const {
    editable,
    value,
    onChange,
    commitOnBlur = true,
    startOnEnter = true,
    allowDoubleClick = true,
  } = opts;

  const [isArmed, setIsArmed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const elRef = useRef<T | null>(null);
  const beforeEditRef = useRef<string>(value);

  const startEdit = useCallback(() => {
    if (!editable) return;
    if (isEditing) return;

    beforeEditRef.current = value;
    setIsEditing(true);

    // DOM更新後にフォーカス＆カーソル末尾
    requestAnimationFrame(() => {
      const el = elRef.current;
      if (!el) return;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    });
  }, [editable, isEditing, value]);

  const finishEdit = useCallback(() => {
    if (!isEditing) return;
    setIsEditing(false);
  }, [isEditing]);

  const cancelEdit = useCallback(() => {
    if (!isEditing) return;
    const prev = beforeEditRef.current;
    onChange(prev);
    setIsEditing(false);
  }, [isEditing, onChange]);

  const showEditAffordance = editable && isArmed && !isEditing;

  const fieldProps: EditableFieldBind<T> = {
    ref: (node) => {
      elRef.current = node;
    },
    value,
    readOnly: !isEditing,
    'aria-readonly': !isEditing,

    onFocus: () => setIsArmed(true),
    onBlur: () => {
      setIsArmed(false);
      if (isEditing && commitOnBlur) finishEdit();
    },

    onDoubleClick: allowDoubleClick ? () => startEdit() : undefined,

    onChange: (e) => {
      if (!isEditing) return;
      onChange(e.target.value);
    },

    onKeyDown: (e) => {
      // 編集準備中：Enterで編集開始（フォーム送信を抑止）
      if (!isEditing && editable && startOnEnter && e.key === 'Enter') {
        e.preventDefault();
        startEdit();
        return;
      }

      // 編集中：Enterで終了 / Escで取消
      if (!isEditing) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        finishEdit();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
    },
  };

  const editButtonProps: EditableButtonBind = {
    type: 'button',
    // blur→click の順で崩れるのを防ぐ（フォーカス移動を抑止）
    onMouseDown: (e) => e.preventDefault(),
    onClick: () => startEdit(),
  };

  const hint = !editable
    ? '閲覧のみ'
    : isEditing
      ? 'Enterで確定 / Escで取消'
      : isArmed
        ? 'Enter または ダブルクリックで編集'
        : 'クリックで選択（編集はEnter/ダブルクリック）';

  return {
    isArmed,
    isEditing,
    showEditAffordance,
    startEdit,
    finishEdit,
    cancelEdit,
    fieldProps,
    editButtonProps,
    hint,
  };
}
