import { z } from "zod";

// ページネーション（必要に応じて使う）
export const PaginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  perPage: z.number().int().min(1),
});
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

// Envelope（素の配列/オブジェクトを返すなら不要。採用は自由）
export const makeListEnvelope = <T extends z.ZodTypeAny>(item: T) =>
  z
    .object({
      data: z.array(item),
      meta: PaginationMetaSchema.optional(),
    })
    .strict();

export const makeItemEnvelope = <T extends z.ZodTypeAny>(item: T) =>
  z
    .object({
      data: item,
    })
    .strict();

// RFC7807 風エラー
export const ProblemDetailsSchema = z
  .object({
    type: z.string().url().optional(),
    title: z.string(),
    status: z.number().int(),
    detail: z.string().optional(),
    instance: z.string().optional(),
  })
  .strict();
export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;
