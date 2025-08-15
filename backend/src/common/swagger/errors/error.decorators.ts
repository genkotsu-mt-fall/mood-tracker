import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiErrorBodyDto, ApiErrorResponseDto } from './error.dto';
import { ApiErrorResponse } from 'src/common/response/api-response';
import { defaultCodeForStatus } from 'src/common/errors/error.util';
import { ApiErrorExample } from './types';

// type ErrorExampleOverride = Partial<ApiErrorResponse> & {
//   error?: Partial<ApiErrorResponse['error']>;
// };

export function ApiErrorWrapped(
  status: number,
  description?: string,
  exampleOverride?: ApiErrorExample,
) {
  const example = mergeErrorExample(exampleForStatus(status), exampleOverride);
  const desc = description ?? defaultMessageForStatus(status);

  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto, ApiErrorBodyDto),
    ApiResponse({
      status,
      description: desc,
      content: {
        'application/json': {
          schema: wrapErrorSchema(),
          example,
        },
      },
    }),
  );
}

export function ApiErrorDocs(...statuses: number[]) {
  return applyDecorators(...statuses.map((s) => ApiErrorWrapped(s)));
}

function wrapErrorSchema() {
  return {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      error: { $ref: getSchemaPath(ApiErrorBodyDto) },
    },
    required: ['success', 'error'],
  };
}

function exampleForStatus(status: number): ApiErrorResponse {
  return {
    success: false,
    error: {
      code: defaultCodeForStatus(status),
      message: defaultMessageForStatus(status),
      fields: null,
    },
  };
}

function defaultMessageForStatus(status: number): string {
  switch (status) {
    case 400:
      return 'Bad request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not found';
    case 409:
      return 'Conflict';
    case 422:
      return 'Unprocessable entity';
    case 429:
      return 'Too many requests';
    case 503:
      return 'Service unavailable';
    default:
      return status >= 500 ? 'Internal server error' : `Error ${status}`;
  }
}

function mergeErrorExample(
  base: ApiErrorResponse,
  override?: ApiErrorExample,
): ApiErrorResponse {
  if (!override) return base;
  return {
    success: false,
    error: { ...base.error, ...(override.error ?? {}) },
  };
}
