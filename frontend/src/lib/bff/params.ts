import { UuidSchema } from '@genkotsu-mt-fall/shared/schemas';
import { jsonBadRequest } from '@/lib/bff/next-response';

export function parseUuidParamOrBadRequest(raw: string, label: string = 'id') {
  const parsed = UuidSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, res: jsonBadRequest(`Invalid ${label}`) };
  }
  return { ok: true as const, value: parsed.data };
}
