// import { Post } from "@/components/post/types";

// const AUTHORS = [
//   "Alice",
//   "Bob",
//   "Carol",
//   "Dave",
//   "Eve",
//   "Frank",
//   "Grace",
//   "Heidi",
//   "Ivan",
//   "Judy",
//   "Ken",
//   "Liam",
//   "Mia",
//   "Noah",
//   "Olivia",
//   "Paul",
//   "Quinn",
//   "Ruth",
//   "Sara",
//   "Tom",
// ];
// const BODIES = [
//   "今日も充実した一日だった。朝のコーヒーが最高。午後は集中して作業が進んだ。",
//   "ちょっと疲れ気味。深呼吸してリセット。無理せずいこう。",
//   "新しいアイデアが降ってきた！少しずつ形にする。",
//   "散歩して気分転換。風が気持ちいい。頭がクリアになった。",
//   "締切前で焦るけど、タスクを刻んだら前に進めた。",
//   "仲間に助けられた。ありがとうの気持ちを忘れずに。",
//   "音楽のおかげで集中できた。今日はこの調子でいこう。",
//   "思ったより捗らない日。こういう日もある、休む勇気。",
// ];
// const TAGS = [
//   "#ねぎらってほしい",
//   "#励ましてほしい",
//   "#おめでとう",
//   "#がんばった",
//   "#休みが必要",
//   "#モヤモヤ",
// ];
// const EMOJIS = [
//   "😊",
//   "😵‍💫",
//   "😭",
//   "😡",
//   "🤔",
//   "✨",
//   "🫶",
//   "👍",
//   "👎",
//   "😌",
//   "🥲",
//   "🤗",
// ];

// export function makeSamplePosts(prefix: string, count = 100): Post[] {
//   const now = Date.now();
//   return Array.from({ length: count }, (_, i) => {
//     const authorName = AUTHORS[i % AUTHORS.length];
//     const emoji = EMOJIS[i % EMOJIS.length];
//     const body = BODIES[i % BODIES.length];
//     const createdAt = new Date(now - i * 3 * 60 * 60 * 1000).toISOString();
//     const intensity = (i * 13) % 101;
//     const tags =
//       i % 11 === 0
//         ? [TAGS[i % TAGS.length], TAGS[(i + 3) % TAGS.length]]
//         : i % 4 === 0
//         ? [TAGS[i % TAGS.length]]
//         : undefined;

//     const author =
//       prefix === "me" ? { name: authorName, isMe: true } : { name: authorName };

//     return {
//       id: `${prefix}${i + 1}`,
//       author,
//       createdAt,
//       body,
//       tags,
//       emoji,
//       intensity,
//       comments: (i * 3) % 7,
//       likes: 8 + ((i * 17) % 150),
//       reposts: i % 6,
//     };
//   });
// }
