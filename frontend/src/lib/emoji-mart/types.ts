// emoji-mart の最小限の型（any を使わない）
export type EmojiMartEmoji = {
  native: string;
  id?: string;
  unified?: string;
  skin?: number;
};

export type EmojiMartData = unknown;

export type EmojiMartPickerOptions = {
  data: () => Promise<EmojiMartData>;
  onEmojiSelect: (emoji: EmojiMartEmoji) => void;
  locale?: "ja" | "en" | string;
  previewPosition?: "top" | "bottom" | "none";
  navPosition?: "top" | "bottom" | "none";
  emojiSize?: number;
  skinTonePosition?: "preview" | "search" | "none";
};

export type EmojiMartPickerCtor = new (
  opts: EmojiMartPickerOptions
) => HTMLElement;
export type EmojiMartModule = {
  Picker?: EmojiMartPickerCtor;
  default?: EmojiMartPickerCtor;
};
