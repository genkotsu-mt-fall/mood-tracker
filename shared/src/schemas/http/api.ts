import { z } from "zod";

export const FieldErrorsSchema = z.record(z.string(), z.array(z.string()));
export type FieldErrors = z.infer<typeof FieldErrorsSchema>;

// サーバの PaginationMeta に合わせる
export const PaginationMetaSchema = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    hasNext: z.boolean(),
    total: z.number().optional(), // backend は optional
  })
  .strict();
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

// ApiErrorPayload: fields は null 許容、details は unknown
export const ApiErrorPayloadSchema = z
  .object({
    code: z.string(),
    message: z.string(),
    fields: FieldErrorsSchema.nullable().optional(), // ← nullable 追加
    details: z.unknown().optional(), // ← string → unknown に
  })
  .strict();

export const ApiErrorSchema = z
  .object({
    success: z.literal(false),
    error: ApiErrorPayloadSchema,
  })
  .strict();
export type ApiError = z.infer<typeof ApiErrorSchema>;

// 成功レスポンス: data に加えて meta を任意で許可（ページネーション時に使われる）
export const makeApiSuccessSchema = <T extends z.ZodTypeAny>(item: T) =>
  z
    .object({
      success: z.literal(true),
      data: item,
      meta: PaginationMetaSchema.optional(), // ← 追加
    })
    .strict();

// 型も meta を任意で持てるように
export type ApiSuccess<T> = { success: true; data: T; meta?: PaginationMeta };

// 成功 or 失敗の union
export const makeApiResponseSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.union([makeApiSuccessSchema(item), ApiErrorSchema]);

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const MessageResourceSchema = z
  .object({
    message: z.string(),
  })
  .strict();
export type MessageResource = z.infer<typeof MessageResourceSchema>;
