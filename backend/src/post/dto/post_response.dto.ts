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
    this.crisisFlag = entity.crisisFlag;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  id: string;
  userId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  crisisFlag: boolean;
  mood?: string;
  intensity?: number;
  emoji?: string;
  templateId?: string;
  privacyJson?: PrivacySetting;
}
