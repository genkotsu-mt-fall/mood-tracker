import { z } from "zod";
import { PrivacySettingSchema } from "../../schemas/privacy-setting.schema";
import emojiRegex from "emoji-regex";

function firstGraphemeIntl(input: string, locale = "ja", seg?: Intl.Segmenter) {
  const s = input.trim();
  if (!s) return "";

  const segmenter =
    seg ??
    (typeof Intl !== "undefined" && "Segmenter" in Intl
      ? new Intl.Segmenter(locale, { granularity: "grapheme" })
      : undefined);
  if (!segmenter) return "";

  const itr = segmenter.segment(s)[Symbol.iterator]();
  const first = itr.next();
  if (first.done) return "";

  const { index, segment } = first.value;
  return s.slice(index, index + segment.length);
}

function isSingleGraphemeIntl(input: string, locale = "ja") {
  const s = input.trim();
  if (!s) return false;
  if (typeof Intl === "undefined" || !("Segmenter" in Intl)) return false;
  const segmenter = new Intl.Segmenter(locale, { granularity: "grapheme" });
  const itr = segmenter.segment(s)[Symbol.iterator]();
  const first = itr.next();
  if (first.done) return false;
  const second = itr.next();
  return !!first.value && second.done;
}

function isSingleEmojiIntl(input: string) {
  const s = input.trim();
  if (!s) return false;
  if (!isSingleGraphemeIntl(s)) return false;
  const regex = emojiRegex();
  const matches = [...s.matchAll(regex)];
  if (matches.length !== 1) return false;
  if (!matches[0]) return false;
  const only = matches[0][0];
  return only === s;
}

export const PostCreateBodySchema = z
  .object({
    body: z
      .string()
      .trim()
      .min(1, "本文を入力してください。")
      .max(280, "本文は280文字以内です。"),
    emoji: z.preprocess((val) => {
      if (typeof val === "string") {
        const s = val.trim();
        if (!s) return undefined;
        return s;
      }
      return val ?? undefined;
    }, z.string().refine(isSingleEmojiIntl, "絵文字は1文字だけにしてください。").optional()),
    intensity: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? undefined : val,
      z.coerce
        .number()
        .int()
        .min(0, "intensityは0以上です。")
        .max(100, "intensityは100以下です。")
        .optional()
    ),
    crisisFlag: z.preprocess((val) => {
      if (val === "on" || val === "1" || val === "true" || val === true)
        return true;
      if (val === "off" || val === "0" || val === "false" || val === false)
        return false;
      return undefined;
    }, z.boolean().default(false)),
    privacyJson: PrivacySettingSchema.optional(),
  })
  .strict();

export type PostCreateBody = z.infer<typeof PostCreateBodySchema>;
