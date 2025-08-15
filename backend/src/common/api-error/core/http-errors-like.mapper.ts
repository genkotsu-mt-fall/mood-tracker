import { getProp } from './options';
import { ApiErrorMapperFn } from './types';

function getStatus(v: unknown): number | null {
  if (!v || typeof v !== 'object') return null;

  const candidates = [getProp(v, 'statusCode'), getProp(v, 'status')];
  for (const s of candidates) {
    const n =
      typeof s === 'number' ? s : typeof s === 'string' ? Number(s) : NaN;
    if (Number.isFinite(n) && n >= 400 && n <= 599) return n;
  }
  return null;
}

export const httpErrorsLikeMapper: ApiErrorMapperFn = (exception, ctx) => {
  if (!exception || typeof exception !== 'object') return null;

  const status = getStatus(exception);
  if (!status) return null;

  // 既存の抽出規約を再利用（payload=exceptionとして渡す）
  const message = ctx.opts.extractMessage(exception, exception);
  const code = ctx.opts.codeForStatus(status);

  return {
    status,
    error: {
      code,
      message,
      ...(ctx.prod ? {} : { details: ctx.opts.buildDevDetails(exception) }),
    },
  };
};
