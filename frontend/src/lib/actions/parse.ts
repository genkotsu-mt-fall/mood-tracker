import z, { ZodObject } from 'zod';
import { zodToFieldErrors } from './state';

function objectSchemaKeys<TSchema extends ZodObject>(
  schema: TSchema,
): string[] {
  // ZodObject の shape からキー一覧を取る
  // ※ Zod の内部構造に依存せず、public に近い参照で取得
  const shape = schema.shape;
  return Object.keys(shape);
}

function pickFormDataByKeys(
  formData: FormData,
  keys: string[],
): Record<string, FormDataEntryValue> {
  const raw: Record<string, FormDataEntryValue> = {};

  for (const key of keys) {
    const v = formData.get(key);
    if (v === null) continue;
    raw[key] = v;
  }

  return raw;
}

export function parseForm<TSchema extends ZodObject>(
  formData: FormData,
  schema: TSchema,
):
  | { ok: true; data: z.infer<TSchema> }
  | { ok: false; fields: Record<string, string> } {
  const keys = objectSchemaKeys(schema);
  const raw = pickFormDataByKeys(formData, keys);

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fields: zodToFieldErrors(parsed.error.issues) };
  }
  return { ok: true, data: parsed.data };
}

export function parseObject<TSchema extends ZodObject>(
  input: unknown,
  schema: TSchema,
):
  | { ok: true; data: z.infer<TSchema> }
  | { ok: false; fields: Record<string, string> } {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fields: zodToFieldErrors(parsed.error.issues) };
  }
  return { ok: true, data: parsed.data };
}
