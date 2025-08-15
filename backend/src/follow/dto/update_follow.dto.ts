import { PartialType } from '@nestjs/mapped-types';
import { CreateFollowDto } from './create_follow.dto';
import { ApiExtraModels } from '@nestjs/swagger';

/**
 * 通常の運用では使用しない（フォローは作成・削除のみ想定）。
 *
 * ただし今後、ブロック機能などにより、
 * フォロー関係を「削除」ではなく「無効化（status変更）」で扱いたい場合に備えて定義。
 *
 * 例：status: 'active' | 'blocked'
 */
@ApiExtraModels(CreateFollowDto)
export class UpdateFollowDto extends PartialType(CreateFollowDto) {}
