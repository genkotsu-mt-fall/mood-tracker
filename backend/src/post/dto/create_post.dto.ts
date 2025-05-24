import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { PrivacySetting } from '../type/privacy-setting.type';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  mood?: string;

  @IsOptional()
  @Min(0)
  @Max(100)
  intensity?: number;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  @IsString()
  emoji?: string;

  @IsOptional()
  @IsUUID()
  templateId?: string;

  /**
   * 公開設定情報（フォロワー限定・ブロックリストなど）を
   * JSON形式で保持 ※省略可
   */
  @IsOptional()
  // @IsJSON() /**zodで検証のため */
  privacyJson?: PrivacySetting;

  /**
   * true の場合は「フォロワーのみ閲覧可」
   */
  @IsBoolean()
  followersOnly: boolean;

  /**
   * true の場合は「相互フォローのみ閲覧可」
   */
  @IsBoolean()
  followBackOnly: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  minFollowDays?: number;

  @IsOptional()
  @IsDateString()
  visibleUntil?: string;

  @IsOptional()
  @IsDateString()
  visibleAfter?: string;

  /**
   * 緊急性あり（例: 自傷の可能性など）なら true
   */
  @IsBoolean()
  crisisFlag: boolean;
}
