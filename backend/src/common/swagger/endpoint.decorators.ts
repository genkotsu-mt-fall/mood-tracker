import { applyDecorators } from '@nestjs/common';
import { ApiDecorators, ApiEndpointOptions } from './types';
import { buildDecorators } from './builders';

export function ApiEndpoint(options: ApiEndpointOptions) {
  const decos: ApiDecorators = buildDecorators(options);
  return applyDecorators(...decos);
}
