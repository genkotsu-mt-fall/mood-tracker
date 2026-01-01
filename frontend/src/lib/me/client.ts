import {
  MyProfileResponse,
  MyProfileResponseSchema,
  MyProfileUpdateBody,
} from '@genkotsu-mt-fall/shared/schemas';
import { bffPut, unwrapOrThrow } from '@/lib/bff/request';

export async function updateMyProfileClient(
  payload: MyProfileUpdateBody,
): Promise<MyProfileResponse> {
  const r = await bffPut<MyProfileResponse>(
    '/api/me/profile',
    payload,
    MyProfileResponseSchema,
  );
  return unwrapOrThrow(r);
}
