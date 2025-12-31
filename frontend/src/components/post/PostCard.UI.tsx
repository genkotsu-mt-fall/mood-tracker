'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { Emoji, Post } from './types';
import { PostHeader } from './PostHeader';
import { PostBody } from './PostBody';
import { TagList } from './TagList';
import { ReactionCluster } from './ReactionCluster';
import { ActionsBar } from './ActionsBar';

type Props = {
  post: Post;
  compact?: boolean;

  expanded: boolean;
  onToggleExpand: () => void;

  liked: boolean;
  likeCount: number;
  onToggleLike: () => void;

  reactions: Record<Emoji, number>;
  myReactions: Set<Emoji>;
  total: number;
  onToggleEmoji: (emoji: Emoji) => void;
};

export default function PostCardUI({
  post,
  compact = false,
  expanded,
  onToggleExpand,
  liked,
  likeCount,
  onToggleLike,
  reactions,
  myReactions,
  total,
  onToggleEmoji,
}: Props) {
  const cardClass = `rounded-2xl border border-gray-100 bg-white ${
    compact ? 'shadow-xs' : 'shadow-sm'
  }`;
  const contentClass = compact ? 'px-3 py-2' : 'px-4';

  return (
    <Card className={cardClass}>
      <CardContent className={contentClass}>
        <PostHeader
          authorId={post.author.id}
          isMe={!!post.author.isMe}
          name={post.author.name}
          avatarUrl={post.author.avatarUrl}
          createdAt={post.createdAt}
          emoji={post.emoji}
          intensity={post.intensity}
        />

        <PostBody
          body={post.body}
          expanded={compact ? true : expanded}
          onToggle={compact ? () => {} : onToggleExpand}
          isEditable={compact ? false : !!post.author.isMe}
          onSaveEdit={(newBody) => alert('保存（未実装）: ' + newBody)}
        />

        {!compact && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            <TagList tags={post.tags} />
            <ReactionCluster
              reactions={reactions}
              myReactions={myReactions}
              total={total}
            />
          </div>
        )}

        {!compact && (
          <ActionsBar
            comments={post.comments}
            reposts={post.reposts}
            likeCount={likeCount}
            liked={liked}
            onToggleLike={onToggleLike}
            onComment={() => alert('コメントへ（未実装）')}
            onRepost={() => alert('リポスト（未実装）')}
            myReactions={myReactions}
            onToggleEmoji={onToggleEmoji}
            onOpen={() => window.open(`/posts/${post.id}`, '_self')}
            onCopyLink={() =>
              navigator.clipboard?.writeText(
                `${location.origin}/posts/${post.id}`,
              )
            }
            onReport={() => alert('報告（未実装）')}
            isEditable={!!post.author.isMe}
            onDelete={() => alert('削除（未実装）: ' + post.id)}
          />
        )}
      </CardContent>
    </Card>
  );
}
