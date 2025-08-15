import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedApiResponse } from 'src/common/response/api-response';
// import { PaginatedResponseDto } from 'src/common/response/paginated-response.dto';
import { PostResponseDto } from 'src/post/dto/post_response.dto';

// viewer == currentUser
export type ViewerFixedUseCase = (
  userId: string,
  query: PaginationQueryDto,
) => Promise<PaginatedApiResponse<PostResponseDto>>;

// viewer != currentUser
export type ViewerFlexibleUseCase = (
  viewerId: string,
  userId: string,
  query: PaginationQueryDto,
) => Promise<PaginatedApiResponse<PostResponseDto>>;

export async function executePaginatedPostQueryViewerFixed(
  userId: string,
  query: PaginationQueryDto,
  usecase: ViewerFixedUseCase,
) {
  const { page, limit } = query;
  // const result = await usecase(userId, { page, limit });
  // return new PaginatedResponseDto<PostResponseDto>({
  //   data: result.data.map((item) => new PostResponseDto(item)),
  //   page: result.page,
  //   limit: result.limit,
  //   hasNextPage: result.hasNextPage,
  // });
  return await usecase(userId, { page, limit });
}

export async function executePaginatedPostQueryViewerFlexible(
  viewerId: string,
  userId: string,
  query: PaginationQueryDto,
  usecase: ViewerFlexibleUseCase,
): Promise<PaginatedApiResponse<PostResponseDto>> {
  const { page, limit } = query;
  // const result = await usecase(viewerId, userId, { page, limit });
  // return new PaginatedResponseDto<PostResponseDto>({
  //   data: result.data.map((item) => new PostResponseDto(item)),
  //   page: result.page,
  //   limit: result.limit,
  //   hasNextPage: result.hasNextPage,
  // });
  return await usecase(viewerId, userId, { page, limit });
}
