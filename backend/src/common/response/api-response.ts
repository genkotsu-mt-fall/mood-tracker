export type PaginationMeta = {
  page: number;
  pageSize: number;
  hasNext: boolean;
  total?: number;
};

export type ApiResponse<T> = {
  success: true;
  data: T;
};

export type PaginatedApiResponse<T> = {
  success: true;
  data: T[];
  meta?: PaginationMeta;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]> | null;
    details?: unknown;
  };
};
