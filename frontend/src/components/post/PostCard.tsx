'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Post } from './types'
import { PostHeader } from './PostHeader'
import { PostBody } from './PostBody'
import { TagList } from './TagList'
import { ReactionCluster } from './ReactionCluster'
import { ActionsBar } from './ActionsBar'
import { useExpand, useLike, useReactions } from './hooks'

export default function PostCard({ post }: { post: Post }) {
  const { expanded, toggle: toggleExpand } = useExpand(180)
  const { liked, count: likeCount, toggle: toggleLike } = useLike(post.likes ?? 0)
  const { reactions, myReactions, total, toggleEmoji } = useReactions()

  return (
    <Card className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <CardContent className="px-4">
        <PostHeader
          name={post.author.name}
          avatarUrl={post.author.avatarUrl}
          createdAt={post.createdAt}
          emoji={post.emoji}
          intensity={post.intensity}
        />

        <PostBody
          body={post.body}
          expanded={expanded}
          onToggle={toggleExpand}
          isEditable={!!post.author.isMe}
          onSaveEdit={(newBody) => alert('保存（未実装）: ' + newBody)}
        />

        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <TagList tags={post.tags} />
          <ReactionCluster reactions={reactions} myReactions={myReactions} total={total} />
        </div>

        <ActionsBar
          comments={post.comments}
          reposts={post.reposts}
          likeCount={likeCount}
          liked={liked}
          onToggleLike={toggleLike}
          onComment={() => alert('コメントへ（未実装）')}
          onRepost={() => alert('リポスト（未実装）')}
          myReactions={myReactions}
          onToggleEmoji={toggleEmoji}
          onOpen={() => window.open(`/posts/${post.id}`, '_self')}
          onCopyLink={() => navigator.clipboard?.writeText(`${location.origin}/posts/${post.id}`)}
          onReport={() => alert('報告（未実装）')}
          isEditable={!!post.author.isMe}
          onDelete={() => alert('削除（未実装）: ' + post.id)}
        />
      </CardContent>
    </Card>
  )
}
