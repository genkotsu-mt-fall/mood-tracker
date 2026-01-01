import { useEffect, useMemo, useRef } from 'react';
import { useActionState } from 'react';
import { toast } from 'sonner';

import type { PrivacySetting } from '@/lib/privacy/types';
import {
  createPostAction,
  type CreatePostActionResult,
} from '@/app/(app)/compose/actions';

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
};

type FieldErrors = Record<string, string> | undefined;

export function useComposeSubmit({ privacyJson, postBody }: Args) {
  // privacyJson を Server Action に bind で渡す（参照の安定化）
  const bound = useMemo(() => ({ privacyJson }), [privacyJson]);

  const [state, formAction, pending] = useActionState<
    CreatePostActionResult,
    FormData
  >(createPostAction.bind(null, bound), { ok: true, phase: 'idle' } as const);

  const isSuccess = state.ok && state.phase === 'success';
  const successData = state.ok ? state.data : undefined;

  const hasError = !state.ok;
  const errorMsg = !state.ok ? state.error : undefined;
  const errorFields: FieldErrors = !state.ok ? state.fields : undefined;

  const formError = !state.ok ? state.error : undefined;

  // setter を分解して依存を安定化（postBody オブジェクト自体を依存に入れない）
  const { setText, setEmoji, setIntensity, setCrisisFlag, setPrivacyJson } =
    postBody;

  // 同じ成功に対して toast/reset を二重に実行しないガード
  // PostResource に id がある想定。なければ key を差し替えてください。
  const handledSuccessKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isSuccess || !successData) return;

    const successId = successData.id as string | undefined;
    const key = successId ?? '__success__';

    if (handledSuccessKeyRef.current === key) return;
    handledSuccessKeyRef.current = key;

    toast.success('投稿しました', {
      description: '反映に数秒かかる場合があります。',
    });

    // フォームリセット
    setText('');
    setEmoji('');
    setIntensity(undefined);
    setCrisisFlag(false);
    setPrivacyJson(undefined);
  }, [
    isSuccess,
    successData,
    setText,
    setEmoji,
    setIntensity,
    setCrisisFlag,
    setPrivacyJson,
  ]);

  // 失敗 toast
  useEffect(() => {
    if (!hasError) return;
    if (!errorMsg && !errorFields) return;

    toast.error('投稿に失敗しました', {
      description: errorMsg ?? '入力内容をご確認ください。',
    });
  }, [hasError, errorMsg, errorFields]);

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
