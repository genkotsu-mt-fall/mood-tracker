import { useEffect, useMemo, useRef } from 'react';
import { useActionState } from 'react';
import { toast } from 'sonner';

import type { PrivacySetting } from '@/lib/privacy/types';
import {
  createPostAction,
  type CreatePostActionResult,
} from '@/app/(app)/compose/actions';

import {
  updatePostAction,
  type UpdatePostActionResult,
} from '@/app/(app)/posts/actions';

type PostBodyController = {
  setText: (v: string) => void;
  setEmoji: (v: string) => void;
  setIntensity: (v: number | undefined) => void;
  setCrisisFlag: (v: boolean) => void;
  setPrivacyJson: (v: PrivacySetting | undefined) => void;
};

type Args = {
  privacyJson: PrivacySetting | undefined;
  postBody: PostBodyController;

  mode?: 'create' | 'update';
  postId?: string; // update のとき必須
};

type FieldErrors = Record<string, string> | undefined;

export function useComposeSubmit({
  privacyJson,
  postBody,
  mode = 'create',
  postId,
}: Args) {
  // bind で渡す値（update の場合は postId も含める）
  const bound = useMemo(() => {
    return mode === 'update'
      ? { postId: postId ?? '', privacyJson }
      : { privacyJson };
  }, [mode, postId, privacyJson]);

  const actionFn =
    mode === 'update'
      ? (updatePostAction as unknown as typeof createPostAction)
      : createPostAction;

  const initialState = { ok: true, phase: 'idle' } as const;

  const [state, formAction, pending] = useActionState<
    CreatePostActionResult | UpdatePostActionResult,
    FormData
  >(actionFn.bind(null, bound), initialState);

  const isSuccess = state.ok && state.phase === 'success';
  const successData = state.ok ? state.data : undefined;

  const hasError = !state.ok;
  const errorMsg = !state.ok ? state.error : undefined;
  const errorFields: FieldErrors = !state.ok ? state.fields : undefined;

  const formError = !state.ok ? state.error : undefined;

  const { setText, setEmoji, setIntensity, setCrisisFlag, setPrivacyJson } =
    postBody;

  // 二重 toast / 二重処理防止（成功データ id ベース）
  const handledSuccessKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isSuccess || !successData) return;

    const successId = successData.id as string | undefined;
    const key = `${mode}:${successId ?? '__success__'}`;

    if (handledSuccessKeyRef.current === key) return;
    handledSuccessKeyRef.current = key;

    if (mode === 'update') {
      toast.success('保存しました', {
        description: '反映に数秒かかる場合があります。',
      });
      // 更新後は詳細に戻す（確実に再取得させたいのでハード遷移）
      if (postId) window.location.assign(`/posts/${postId}`);
      return;
    }

    // create
    toast.success('投稿しました', {
      description: '反映に数秒かかる場合があります。',
    });

    // フォームリセット（create のみ）
    setText('');
    setEmoji('');
    setIntensity(undefined);
    setCrisisFlag(false);
    setPrivacyJson(undefined);
  }, [
    isSuccess,
    successData,
    mode,
    postId,
    setText,
    setEmoji,
    setIntensity,
    setCrisisFlag,
    setPrivacyJson,
  ]);

  useEffect(() => {
    if (!hasError) return;
    if (!errorMsg && !errorFields) return;

    toast.error(
      mode === 'update' ? '保存に失敗しました' : '投稿に失敗しました',
      {
        description: errorMsg ?? '入力内容をご確認ください。',
      },
    );
  }, [hasError, errorMsg, errorFields, mode]);

  return {
    state,
    formAction,
    pending: Boolean(pending),
    hasError,
    formError,
    errorMsg,
    fieldErrors: errorFields,
  };
}
