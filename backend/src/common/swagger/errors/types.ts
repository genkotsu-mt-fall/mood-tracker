import { ApiErrorResponse } from 'src/common/response/api-response';

export type ApiErrorExample = Partial<ApiErrorResponse> & {
  error?: Partial<ApiErrorResponse['error']>;
};
