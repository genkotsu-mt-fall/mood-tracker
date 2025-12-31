'use server';

import { parseObject } from '@/lib/actions/parse';
import { toggleFollowUsecase } from '@/lib/bff/follow/toggleFollow.usecase';
import { FollowCreateBodySchema } from '@genkotsu-mt-fall/shared/schemas';

export type ToggleFollowState = { ok: true } | { ok: false; message: string };

function isIntent(x: unknown): x is 'follow' | 'unfollow' {
  return x === 'follow' || x === 'unfollow';
}

export async function toggleFollowAction(
  followeeId: string,
  intent: unknown,
): Promise<ToggleFollowState> {
  // intent はクライアント由来なのでランタイムで検証
  if (!isIntent(intent)) {
    return { ok: false, message: '入力が不正です。' };
  }

  // followeeId 検証（UUID）
  const v = parseObject({ followeeId }, FollowCreateBodySchema);
  if (!v.ok) {
    return { ok: false, message: '入力が不正です。' };
  }

  const res = await toggleFollowUsecase(intent, v.data);
  if (!res.ok) {
    return {
      ok: false,
      message: res.message ?? 'フォロー更新に失敗しました。',
    };
  }

  return { ok: true };
}
