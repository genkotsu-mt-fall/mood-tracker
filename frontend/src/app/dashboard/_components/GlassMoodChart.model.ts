// export type UserSummary = {
//   id: string;
//   name: string;
//   handle: string;
//   avatar: string; // 1-2文字 or 絵文字
// };

// export type ChartPoint = {
//   time: string; // yyyy/MM/dd HH:mm もしくはセンチネル
//   value: number | null; // ダミーは null
//   emoji?: string;
//   tags?: string[];
//   user?: UserSummary;
//   isPad?: boolean;

//   // 追加：仮データ識別
//   isDraft?: boolean;
// };

// export const PAD_START = '__pad_start__' as const;
// export const PAD_END = '__pad_end__' as const;

// export const FILTER_TAGS = [
//   'All',
//   'Work',
//   'Health',
//   'Study',
//   'Family',
//   'Social',
// ] as const;
// export type FilterTag = (typeof FILTER_TAGS)[number];
