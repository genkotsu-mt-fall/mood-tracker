import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  constructor(params: {
    data: T[];
    total?: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
  }) {
    this.data = params.data;
    this.total = params.total ?? undefined;
    this.page = params.page;
    this.limit = params.limit;
    this.hasNextPage = params.hasNextPage;
  }

  @ApiPropertyOptional({
    isArray: true,
    description: 'The list of items on the current page',
  })
  data: T[];

  @ApiPropertyOptional({
    example: 100,
    description: 'The total number of items available',
  })
  total?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'The current page number',
  })
  page: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'The number of items per page',
  })
  limit: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether there is a next page',
  })
  hasNextPage: boolean;
}
