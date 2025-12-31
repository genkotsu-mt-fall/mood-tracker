import 'server-only';

import {
  createFollowFromApi,
  deleteFollowByFolloweeFromApi,
} from '@/lib/follow/api';

import type { FollowCreateBody } from '@genkotsu-mt-fall/shared/schemas';

export async function toggleFollowUsecase(
  intent: 'follow' | 'unfollow',
  payload: { followeeId: string },
) {
  if (intent === 'follow') {
    const body: FollowCreateBody = { followeeId: payload.followeeId };
    return createFollowFromApi(body);
  }

  return deleteFollowByFolloweeFromApi(payload.followeeId);
}
