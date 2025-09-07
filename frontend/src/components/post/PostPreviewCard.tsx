'use client'

import { Card, CardContent } from '@/components/ui/card'
import type { Post } from './types'
import { PostHeader } from './PostHeader'

export default function PostPreviewCard({ post }: { post: Post }) {
  return (
    <Card className="rounded-xl border border-gray-100 bg-white shadow-xs">
      <CardContent className="px-3 py-2">
        <PostHeader
          name={post.author.name}
          avatarUrl={post.author.avatarUrl}
          createdAt={post.createdAt}
          emoji={post.emoji}
          intensity={post.intensity}
        />
        <p className="mt-1 text-xs text-gray-700 line-clamp-2">{post.body}</p>
        <div className="mt-2 flex gap-3 text-[11px] text-gray-500">
          <span>❤ {post.likes}</span>
          <span>💬 {post.comments}</span>
          <span>🔁 {post.reposts}</span>
        </div>
      </CardContent>
    </Card>
  )
}
