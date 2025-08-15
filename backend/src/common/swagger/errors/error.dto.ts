import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorBodyDto {
  @ApiProperty({
    description: 'The error code',
  })
  code!: string;

  @ApiProperty({
    description: 'The error message',
  })
  message!: string;

  @ApiProperty({
    description: 'Validation errors, if any',
    required: false,
    nullable: true,
    additionalProperties: { type: 'array', items: { type: 'string' } },
  })
  fields?: Record<string, string[]> | null;

  @ApiProperty({
    description: 'Additional error details',
    required: false,
  })
  details?: unknown;
}

export class ApiErrorResponseDto {
  @ApiProperty({
    description: 'Indicates whether the request was successful',
    example: false,
  })
  success!: false;

  @ApiProperty({
    description: 'Error details',
    type: ApiErrorBodyDto,
  })
  error!: ApiErrorBodyDto;
}
