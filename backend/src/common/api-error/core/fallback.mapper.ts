import { ErrorCode } from 'src/common/errors/error-code';
import { ApiErrorMapperFn } from './types';
import { coerceMessage } from './options';

export const fallbackMapper: ApiErrorMapperFn = (exception, ctx) => {
  const status = ctx.opts.defaultStatus;

  const msg = ctx.prod
    ? 'Internal server error'
    : exception instanceof Error
      ? exception.message
      : (coerceMessage(exception) ?? 'Unknown error');

  return {
    status,
    error: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: msg,
      ...(ctx.prod ? {} : { details: ctx.opts.buildDevDetails(exception) }),
    },
  };
};
