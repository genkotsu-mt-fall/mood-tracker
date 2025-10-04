import z, { ZodObject } from 'zod';
import { zodToFieldErrors } from './state';

export function parseForm<TSchema extends ZodObject>(
  formData: FormData,
  schema: TSchema,
):
  | { ok: true; data: z.infer<TSchema> }
  | { ok: false; fields: Record<string, string> } {
  const raw = Object.fromEntries(formData);
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
