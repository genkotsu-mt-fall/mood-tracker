'use client';

import { Button } from '@/components/ui/button';

type Props = {
  isMe: boolean;
  isFollowing: boolean;
  isPending?: boolean;
  onToggle: () => void;
  className?: string;
};

export default function UserFollowButtonUI({
  isMe,
  isFollowing,
  isPending = false,
  onToggle,
  className,
}: Props) {
  if (isMe) return null;

  return (
    <Button
      type="button"
      size="sm"
      variant={isFollowing ? 'outline' : 'default'}
      disabled={isPending}
      onClick={onToggle}
      className={className ?? 'h-8'}
      aria-pressed={isFollowing}
      aria-busy={isPending}
    >
      {isFollowing ? 'フォロー解除' : 'フォロー'}
    </Button>
  );
}
