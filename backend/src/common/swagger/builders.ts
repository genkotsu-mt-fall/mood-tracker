import {
  mapAuth,
  mapBody,
  mapErrors,
  mapExtraModels,
  mapIdParam,
  mapOperation,
  mapSuccessResponse,
} from './mappers';
import { ApiDecorators, ApiEndpointOptions } from './types';

export function validateOptions(options: ApiEndpointOptions) {
  if (!options?.summary)
    throw new Error('[ApiEndpoint] "summary" is required.');
  if (!options?.response)
    throw new Error('[ApiEndpoint] "response" is required.');
  if (!options.response.type)
    throw new Error('[ApiEndpoint] "response.type" is required.');
}

export function buildDecorators(options: ApiEndpointOptions): ApiDecorators {
  validateOptions(options);
  return [
    ...mapOperation(options),
    ...mapBody(options.body),
    ...mapSuccessResponse(options.response),
    ...mapAuth(options.auth),
    ...mapIdParam(options.idParam),
    ...mapErrors(options.errors),
    ...mapExtraModels(options.extraModels),
  ];
}
