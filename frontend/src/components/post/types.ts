export type Post = {
  id: string;
  author: { name: string; avatarUrl?: string };
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
  "😊",
  "😵‍💫",
  "😭",
  "😡",
  "🤔",
  "✨",
  "🫶",
  "👍",
  "👎",
] as const;
export type Emoji = (typeof EMOJIS)[number];
