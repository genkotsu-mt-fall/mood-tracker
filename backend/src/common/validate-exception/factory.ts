import { BadRequestException, ValidationError } from '@nestjs/common';
import { ErrorCode } from '../errors/error-code';

export function validationExceptionFactory(errors: ValidationError[] = []) {
  const fields: Record<string, string[]> = {};

  const walk = (errs: ValidationError[], path?: string) => {
    for (const e of errs) {
      const key = path ? `${path}.${e.property}` : e.property;

      if (e.constraints) {
        fields[key] = Object.values(e.constraints);
      }
      if (e.children?.length) {
        walk(e.children, key);
      }
    }
  };

  walk(errors);

  return new BadRequestException({
    code: ErrorCode.VALIDATION_FAILED,
    message: 'Validation failed',
    fields: Object.keys(fields).length ? fields : null,
  });
}
