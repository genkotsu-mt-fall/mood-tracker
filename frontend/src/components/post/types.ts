export type Post = {
  id: string;
  author: {
    id?: string; // 追加（リンクに使う）
    name: string;
    avatarUrl?: string;
    isMe: boolean;
  };
  createdAt: string;
  body: string;
  tags?: string[];
  emoji?: string;
  intensity?: number; // 0-100
  comments?: number;
  likes?: number;
  reposts?: number;
};

export const EMOJIS = [
  '😊',
  '😵‍💫',
  '😭',
  '😡',
  '🤔',
  '✨',
  '🫶',
  '👍',
  '👎',
] as const;
export type Emoji = (typeof EMOJIS)[number];
