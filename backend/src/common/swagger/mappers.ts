import {
  // ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  // ApiConflictResponse,
  ApiExtraModels,
  // ApiForbiddenResponse,
  // ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  // ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ApiEndpointOptions,
  ApiDecorators,
  ResponseKind,
  defaultResponseDescription,
  ErrorStatusConfig,
  ErrorOptions,
} from './types';
import { Type } from '@nestjs/common';
import {
  ApiCreatedArrayWrapped,
  ApiCreatedWrapped,
  ApiOkArrayWrapped,
  ApiOkPaginatedWrapped,
  ApiOkWrapped,
} from './response.decorators';
import { ApiErrorWrapped } from './errors/error.decorators';

export function mapOperation(opts: ApiEndpointOptions): ApiDecorators {
  return [
    ApiOperation({
      summary: opts.summary,
      description: opts.description,
    }),
  ];
}

export function mapBody(body?: Type<unknown>): ApiDecorators {
  if (!body) return [];
  return [ApiBody({ type: body }), ApiExtraModels(body)];
}

export function mapSuccessResponse(
  res: ApiEndpointOptions['response'],
): ApiDecorators {
  const kind = res.kind ?? ResponseKind.Ok;
  const desc = res.description ?? defaultResponseDescription(kind);

  const wrapped =
    kind === ResponseKind.Created
      ? res.isArray
        ? ApiCreatedArrayWrapped(res.type, desc)
        : ApiCreatedWrapped(res.type, desc)
      : kind === ResponseKind.Paginated
        ? ApiOkPaginatedWrapped(res.type, desc)
        : res.isArray
          ? ApiOkArrayWrapped(res.type, desc)
          : ApiOkWrapped(res.type, desc);

  return [wrapped, ApiExtraModels(res.type)];
}

/** 認証が必要なら Bearer */
export function mapAuth(auth?: boolean): ApiDecorators {
  return auth ? [ApiBearerAuth()] : [];
}

export function mapIdParam(
  idParam?: ApiEndpointOptions['idParam'],
): ApiDecorators {
  if (!idParam?.id) return [];
  return [
    ApiParam({
      name: 'id',
      type: 'string',
      format: 'uuid',
      description: `${idParam.idParamDescription ?? 'Resource'} ID (UUID v4)`,
    }),
  ];
}

// export function mapErrors(
//   errors?: ApiEndpointOptions['errors'],
// ): ApiDecorators {
//   if (!errors) return [];
//   return [
//     errors.badRequest
//       ? ApiBadRequestResponse({ description: 'Bad request' })
//       : null,
//     errors.unauthorized
//       ? ApiUnauthorizedResponse({ description: 'Unauthorized' })
//       : null,
//     errors.forbidden
//       ? ApiForbiddenResponse({ description: 'Forbidden' })
//       : null,
//     errors.notFound ? ApiNotFoundResponse({ description: 'Not found' }) : null,
//     errors.conflict ? ApiConflictResponse({ description: 'Conflict' }) : null,
//   ].filter(Boolean) as ApiDecorators;
// }

export function mapErrors(errors?: ErrorOptions): ApiDecorators {
  if (!errors) return [];

  const out: ApiDecorators = [];

  const norm = (
    cfg?: ErrorStatusConfig,
  ): { description?: string; example?: any } | null => {
    if (cfg === undefined || cfg === false) return null;
    if (cfg === true) return {};
    return cfg;
  };

  const push = (status: number, cfg?: ErrorStatusConfig) => {
    const n = norm(cfg);
    if (!n) return;
    out.push(ApiErrorWrapped(status, n.description, n.example));
  };

  // よく使う HTTP エラー
  push(400, errors.badRequest);
  push(401, errors.unauthorized);
  push(403, errors.forbidden);
  push(404, errors.notFound);
  push(409, errors.conflict);
  push(422, errors.unprocessableEntity);
  push(429, errors.tooManyRequests);
  push(503, errors.serviceUnavailable);
  push(500, errors.internal);

  // 任意ステータス
  if (errors.extra?.length) {
    for (const e of errors.extra) {
      out.push(ApiErrorWrapped(e.status, e.description, e.example));
    }
  }

  return out;
}

export function mapExtraModels(extra?: Type<any>[]): ApiDecorators {
  if (!extra?.length) return [];
  return [ApiExtraModels(...extra)];
}
