'use server';

import {
  FollowCreateBody,
  FollowResource,
  FollowResponseSchema,
  MessageResource,
  MessageResourceSchema,
} from '@genkotsu-mt-fall/shared/schemas';
import { Ok, Fail } from '../http/result';
import { postRequest, delRequest } from '../api/authed';

export async function createFollowFromApi(
  payload: FollowCreateBody,
): Promise<Ok<FollowResource> | Fail> {
  return postRequest<FollowResource>('follow', payload, FollowResponseSchema);
}

export async function deleteFollowByFolloweeFromApi(
  followeeId: string,
): Promise<Ok<MessageResource> | Fail> {
  return delRequest<MessageResource>(
    `follow/followee/${followeeId}`,
    MessageResourceSchema,
  );
}
