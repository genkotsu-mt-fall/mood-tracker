import { PostResponseDto } from 'src/post/dto/post_response.dto';
import { PostEntity } from 'src/post/entity/post.entity';

export const postId = 'f47ac10b-58cc-4372-a567-0e02b2c3d478';
export const postOwnerId = 'f47ac10b-58cc-4372-a567-0e02b2c3d481';

export const createPost = (
  privacyJson: PostEntity['privacyJson'],
): PostResponseDto => {
  return new PostResponseDto({
    // new PostEntity({
    id: postId,
    userId: postOwnerId,
    author: undefined,
    body: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
    crisisFlag: false,
    privacyJson,
  });
};
