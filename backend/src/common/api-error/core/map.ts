import {
  ApiErrorMapperFn,
  ApiErrorMapperOptions,
  ApiErrorMapResult,
  MapperContext,
} from './types';
import { defaultOptions, resolveProdFlag } from './options';
import { fallbackMapper } from './fallback.mapper';

/**
 * 例外をマッピングする（フォールバックはチェーンに含めない素直な書き方）
 */
export function mapApiErrorWith(
  exception: unknown,
  mappers: ApiErrorMapperFn[],
  options?: ApiErrorMapperOptions,
): ApiErrorMapResult {
  const opts = { ...defaultOptions, ...(options ?? {}) };
  const ctx: MapperContext = {
    prod: resolveProdFlag(opts.isProd),
    opts,
  };

  for (const mapper of mappers) {
    const res = mapper(exception, ctx);
    if (res) return res;
  }

  // ← フォールバックはチェーンに含めず、最後に明示的に呼ぶ
  const fallback = fallbackMapper(exception, ctx);
  if (!fallback) {
    throw new Error('Fallback mapper must not return null');
  }
  return fallback;
}
