import { BadRequestException } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';

// export const ensureValidUUID = (
//   value: unknown,
//   context: string = 'ID',
// ): asserts value is string => {
//   if (typeof value !== 'string' || !uuidValidate(value)) {
//     throw new BadRequestException(`${context} must be a valid UUID`);
//   }
// };

export function ensureValidUUID(
  value: unknown,
  context: string = 'ID',
): asserts value is string {
  if (typeof value !== 'string' || !uuidValidate(value)) {
    throw new BadRequestException(`${context} must be a valid UUID`);
  }
}
