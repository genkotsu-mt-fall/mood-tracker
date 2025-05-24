import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create_post.dto';
import { PostEntity } from '../entity/post.entity';
import { PostRepository } from '../repository/post.repository';
import { validatePrivacySetting } from '../validator/privacy-setting.schema';

@Injectable()
export class CreatePostUseCase {
  constructor(private readonly postRepo: PostRepository) {}

  async execute(userId: string, dto: CreatePostDto): Promise<PostEntity> {
    const validatedPrivacyJson = validatePrivacySetting(dto.privacyJson);
    return await this.postRepo.create(userId, {
      ...dto,
      privacyJson: validatedPrivacyJson,
    });
  }
}
