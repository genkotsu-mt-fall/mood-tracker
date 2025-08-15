import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { PrivacySetting } from '../type/privacy-setting.type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiPropertyOptional({
    example: 'happy',
    description: 'The mood of the post',
  })
  @IsOptional()
  @IsString()
  mood?: string;

  @ApiPropertyOptional({
    example: 75,
    description: 'The intensity of the post',
  })
  @IsOptional()
  @Min(0)
  @Max(100)
  intensity?: number;

  @ApiPropertyOptional({
    example: 'This is a sample post body.',
    description: 'The content of the post',
  })
  @IsString()
  @IsNotEmpty()
  body!: string;

  @ApiPropertyOptional({
    example: '😊',
    description: 'An optional emoji representing the post',
  })
  @IsOptional()
  @IsString()
  emoji?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The ID of the template to be used for the post',
  })
  @IsOptional()
  @IsUUID()
  templateId?: string;

  /**
   * 公開設定情報（フォロワー限定・ブロックリストなど）を
   * JSON形式で保持 ※省略可
   */
  @ApiPropertyOptional({
    description:
      '公開設定（フォロワー限定・許可/除外ユーザー・グループ条件など）',
    examples: {
      minimal: {
        value: { followers_only: true },
      },
      rich: {
        value: {
          allow_users: ['7a4c9a8e-6d7e-4a47-9a3c-2e2f3b8a1c9d'],
          group_visibility_mode: 'any',
          viewable_time_range: { start: '08:00', end: '22:00' },
          visible_after: '2025-08-11T00:00:00.000Z',
          device_types: ['mobile'],
        },
      },
    },
  })
  @IsOptional()
  // @IsJSON() /**zodで検証のため */
  privacyJson?: PrivacySetting;

  /**
   * 緊急性あり（例: 自傷の可能性など）なら true
   */
  @ApiProperty({
    example: true,
    description:
      'Indicates whether the post is urgent (e.g., potential self-harm)',
  })
  @IsBoolean()
  crisisFlag!: boolean;
}
