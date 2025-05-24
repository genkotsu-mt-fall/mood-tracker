import { PostEntity } from '../entity/post.entity';
import { PrivacySetting } from '../type/privacy-setting.type';

export class PostResponseDto {
  constructor(entity: PostEntity) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.mood = entity.mood;
    this.intensity = entity.intensity;
    this.body = entity.body;
    this.emoji = entity.emoji;
    this.templateId = entity.templateId;
    this.privacyJson = entity.privacyJson;
    this.followersOnly = entity.followersOnly;
    this.followBackOnly = entity.followBackOnly;
    this.minFollowDays = entity.minFollowDays;
    this.visibleUntil = entity.visibleUntil;
    this.visibleAfter = entity.visibleAfter;
    this.crisisFlag = entity.crisisFlag;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  id: string;
  userId: string;
  mood: string | null;
  intensity: number | null;
  body: string;
  emoji: string | null;
  templateId: string | null;
  privacyJson: PrivacySetting | null;
  followersOnly: boolean;
  followBackOnly: boolean;
  minFollowDays: number | null;
  visibleUntil: Date | null;
  visibleAfter: Date | null;
  crisisFlag: boolean;
  createdAt: Date;
  updatedAt: Date;
}
