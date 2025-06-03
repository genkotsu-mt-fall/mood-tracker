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

  data: T[];
  total?: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}
