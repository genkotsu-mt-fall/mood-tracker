"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import type {
  EmojiMartEmoji,
  EmojiMartPickerCtor,
  EmojiMartPickerOptions,
} from "@/lib/emoji-mart/types";
import {
  loadEmojiMartPickerCtor,
  fetchEmojiData,
} from "@/lib/emoji-mart/loaders";

type UseMountEmojiPickerArgs = {
  open: boolean;
  hostRef: RefObject<HTMLDivElement | null>;
  onSelect: (emoji: EmojiMartEmoji) => void;
  options?: Omit<EmojiMartPickerOptions, "data" | "onEmojiSelect">;
};

export function useMountEmojiPicker({
  open,
  hostRef,
  onSelect,
  options,
}: UseMountEmojiPickerArgs) {
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let pickerEl: HTMLElement | null = null;
    let Ctor: EmojiMartPickerCtor;

    const mount = async () => {
      try {
        Ctor = await loadEmojiMartPickerCtor();
        const picker = new Ctor({
          data: fetchEmojiData,
          onEmojiSelect: (emoji) => onSelect(emoji),
          locale: "ja",
          previewPosition: "none",
          navPosition: "bottom",
          emojiSize: 20,
          skinTonePosition: "preview",
          ...options,
        });
        if (cancelled || !hostRef.current) return;
        hostRef.current.replaceChildren(picker);
        pickerEl = picker;
      } catch (err) {
        console.error("[emoji-mart] init failed", err);
        if (hostRef.current) {
          hostRef.current.innerHTML =
            '<div style="padding:12px">😵 絵文字ピッカーの読み込みに失敗しました</div>';
        }
      }
    };

    void mount();
    return () => {
      cancelled = true;
      if (pickerEl?.remove) pickerEl.remove();
      if (hostRef.current) hostRef.current.innerHTML = "";
    };
  }, [open, hostRef, onSelect, options]);
}
