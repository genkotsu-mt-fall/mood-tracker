import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostEntity } from '../entity/post.entity';
import { PrivacySetting } from '../type/privacy-setting.type';

export class PostResponseDto {
  constructor(entity: PostEntity) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.author = entity.author
      ? { id: entity.author.id, name: entity.author.name ?? undefined }
      : undefined;
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

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique identifier of the post',
  })
  id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'The ID of the user who created the post',
  })
  userId: string;

  @ApiPropertyOptional({
    example: { id: '550e8400-e29b-41d4-a716-446655440001', name: 'John Doe' },
    description: 'The author of the post',
  })
  author?: { id: string; name?: string };

  @ApiProperty({
    example: 'This is a sample post body.',
    description: 'The content of the post',
  })
  body: string;

  @ApiProperty({
    example: '2023-03-15T12:00:00Z',
    description: 'The date and time when the post was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-03-15T12:00:00Z',
    description: 'The date and time when the post was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    example: true,
    description:
      'Indicates whether the post is urgent (e.g., potential self-harm)',
  })
  crisisFlag: boolean;

  @ApiPropertyOptional({
    example: 'happy',
    description: 'The mood of the post',
  })
  mood?: string;

  @ApiPropertyOptional({
    example: 75,
    description: 'The intensity of the post',
  })
  intensity?: number;

  @ApiPropertyOptional({
    example: '😊',
    description: 'An optional emoji representing the post',
  })
  emoji?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The ID of the template to be used for the post',
  })
  templateId?: string;

  @ApiPropertyOptional({
    description: 'The privacy settings for the post',
  })
  privacyJson?: PrivacySetting;
}
