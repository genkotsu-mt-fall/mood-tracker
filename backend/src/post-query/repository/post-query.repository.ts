import { PostEntity } from 'src/post/entity/post.entity';

export abstract class PostQueryRepository {
  abstract findAllWithCount(pagination: {
    skip: number;
    take: number;
  }): Promise<{ data: PostEntity[] /*total: number*/ }>;

  abstract findById(id: string): Promise<PostEntity | null>;

  abstract findUserPosts(
    userId: string,
    pagination: { skip: number; take: number },
  ): Promise<{ data: PostEntity[] }>;

  abstract findFollowingUsersPosts(
    viewerId: string,
    pagination: { skip: number; take: number },
  ): Promise<{ data: PostEntity[] }>;
}
