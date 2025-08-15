// core
export { httpErrorsLikeMapper } from './core/http-errors-like.mapper';
export { mapApiErrorWith } from './core/map';
export type {
  ApiErrorMapperFn,
  ApiErrorMapperOptions,
  ApiErrorMapResult,
  MessageExtractor,
  FieldsExtractor,
  CodeResolver,
  DevDetailsBuilder,
} from './core/types';

// nest
export { AllExceptionFilter, nestHttpExceptionMapper } from './nest';
