import { zodToFieldErrors } from '@/lib/actions/state';
import { jsonBadRequest, jsonFail, jsonOk } from '@/lib/bff/next-response';
import {
  fetchMyFollowersFromApi,
  fetchMyFollowingUsersFromApi,
  fetchMyProfileFromApi,
  updateMyProfileFromApi,
} from '@/lib/user/api';
import { MyProfileUpdateBodySchema } from '@genkotsu-mt-fall/shared/schemas';
import { NextRequest } from 'next/server';

export async function GET() {
  const [profileRes, followersRes, followingRes] = await Promise.all([
    fetchMyProfileFromApi(),
    fetchMyFollowersFromApi(),
    fetchMyFollowingUsersFromApi(),
  ]);

  if (!profileRes.ok) return jsonFail(profileRes);
  if (!followersRes.ok) return jsonFail(followersRes);
  if (!followingRes.ok) return jsonFail(followingRes);

  return jsonOk(
    {
      profile: profileRes.data,
      followersCount: followersRes.data.length,
      followingCount: followingRes.data.length,
    },
    200,
  );
}

export async function PUT(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonBadRequest('Invalid JSON');
  }

  const parsed = MyProfileUpdateBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonBadRequest(
      '入力内容をご確認ください。',
      zodToFieldErrors(parsed.error.issues),
    );
  }

  // 変更が無い場合は弾く
  const currentRes = await fetchMyProfileFromApi();
  if (!currentRes.ok) return jsonFail(currentRes);

  const currentName = (currentRes.data.name ?? '').trim();
  if (currentName === parsed.data.name) {
    return jsonBadRequest('変更がありません。');
  }

  const updateRes = await updateMyProfileFromApi(parsed.data);
  if (!updateRes.ok) return jsonFail(updateRes);

  // 最新の counts を返す（Settings 側で mutate(next,false) できる）
  const [followersRes, followingRes] = await Promise.all([
    fetchMyFollowersFromApi(),
    fetchMyFollowingUsersFromApi(),
  ]);

  if (!followersRes.ok) return jsonFail(followersRes);
  if (!followingRes.ok) return jsonFail(followingRes);

  return jsonOk(
    {
      profile: updateRes.data,
      followersCount: followersRes.data.length,
      followingCount: followingRes.data.length,
    },
    200,
  );
}
