import type {
  EmojiMartModule,
  EmojiMartPickerCtor,
  EmojiMartData,
} from "./types";

export async function loadEmojiMartPickerCtor(): Promise<EmojiMartPickerCtor> {
  const mod = (await import("emoji-mart")) as unknown as EmojiMartModule;
  const Ctor = mod.Picker ?? mod.default;
  if (!Ctor) throw new Error("emoji-mart::Picker not found");
  return Ctor;
}

export async function fetchEmojiData(): Promise<EmojiMartData> {
  const r = await fetch("https://cdn.jsdelivr.net/npm/@emoji-mart/data");
  return r.json() as Promise<EmojiMartData>;
}
