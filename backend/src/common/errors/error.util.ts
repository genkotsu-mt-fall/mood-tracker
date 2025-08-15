import { ErrorCode } from './error-code';

export const defaultCodeForStatus = (status: number): ErrorCode | string => {
  switch (status) {
    case 400:
      return ErrorCode.BAD_REQUEST;
    case 401:
      return ErrorCode.UNAUTHORIZED;
    case 403:
      return ErrorCode.FORBIDDEN;
    case 404:
      return ErrorCode.NOT_FOUND;
    case 409:
      return ErrorCode.CONFLICT;
    case 422:
      return ErrorCode.UNPROCESSABLE_ENTITY;
    case 429:
      return ErrorCode.TOO_MANY_REQUESTS;
    case 503:
      return ErrorCode.SERVICE_UNAVAILABLE;
    default:
      return status >= 500
        ? ErrorCode.INTERNAL_SERVER_ERROR
        : `ERROR_${status}`;
  }
};

export const isProduction = () => process.env.NODE_ENV === 'production';

export const buildDevDetails = (e: unknown) => {
  if (e instanceof Error)
    return { name: e.name, message: e.message, stack: e.stack };
  return { value: String(e) };
};
