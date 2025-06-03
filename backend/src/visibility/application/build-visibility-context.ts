import { PostEntity } from 'src/post/entity/post.entity';
import { VisibilityContext } from '../context/visibility-context';
import { validatePrivacySetting } from 'src/post/validator/privacy-setting.schema';

export function buildVisibilityContext(
  post: PostEntity,
  viewerId: string,
): VisibilityContext {
  return {
    viewerId,
    postOwnerId: post.userId,
    setting: validatePrivacySetting(post.privacyJson) ?? {},
  };
}
