import { fetchPostsFromApi } from '@/lib/post/api';
import { jsonFail, jsonOk } from '@/lib/bff/next-response';
import { fetchMyProfileFromApi } from '@/lib/user/api';

export async function GET() {
  const postsRes = await fetchPostsFromApi();
  if (!postsRes.ok) return jsonFail(postsRes);

  // viewer（自分）をサーバ側で確定（httpOnlyクッキー前提）
  const meRes = await fetchMyProfileFromApi();
  const meId = meRes.ok ? meRes.data.id : undefined;

  const data = postsRes.data.map((p) => ({
    ...p,
    isMe: !!meId && p.userId === meId,
  }));

  return jsonOk(data, 200);
}
