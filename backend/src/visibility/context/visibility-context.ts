import { PrivacySetting } from 'src/post/type/privacy-setting.type';

export type VisibilityContext = {
  viewerId: string;
  postOwnerId: string;
  setting: PrivacySetting;
};
