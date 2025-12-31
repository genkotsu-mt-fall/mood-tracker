'use client';

import type { PostResourceWithIsMe } from '@genkotsu-mt-fall/shared/schemas';
import { mapToUiPost } from './mapToUiPost';
import PostDetail from './PostDetail';

export default function PostDetailView({
  post,
}: {
  post: PostResourceWithIsMe;
}) {
  return <PostDetail post={mapToUiPost(post)} />;
}
