import { z } from "zod";
import emojiRegex from "emoji-regex";
import { PrivacySettingSchema } from "@schemas/privacy/privacy-setting.schema";

export function firstGraphemeIntl(
  input: string,
  locale = "ja",
  seg?: Intl.Segmenter
) {
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

const basePostCreateBodySchema = {
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
};

export const PostCreateBodySchema = z.object({
  ...basePostCreateBodySchema,
  privacyJson: PrivacySettingSchema.optional(),
});

export type PostCreateBody = z.infer<typeof PostCreateBodySchema>;

export const PostCreateBodyWithoutPrivacySchema = z
  .object(basePostCreateBodySchema)
  .strict();

export type PostCreateBodyWithoutPrivacy = z.infer<
  typeof PostCreateBodyWithoutPrivacySchema
>;

/**
 * Update: まずは Create と同じ要件で定義する（PUT想定）。
 * - body は必須
 * - emoji/intensity/privacyJson は任意（未入力→undefined）
 * - crisisFlag は checkbox を boolean 化、未指定でも default(false)
 */
export const PostUpdateBodySchema = PostCreateBodySchema;
export type PostUpdateBody = z.infer<typeof PostUpdateBodySchema>;

/**
 * FormData から parse する用（privacyJson は bind 等で別レーン）
 * strict のまま運用したいなら parseForm 側で $ACTION_* を落とす前提
 */
export const PostUpdateBodyWithoutPrivacySchema =
  PostCreateBodyWithoutPrivacySchema;
export type PostUpdateBodyWithoutPrivacy = z.infer<
  typeof PostUpdateBodyWithoutPrivacySchema
>;
