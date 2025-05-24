import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repository/post.repository';
import { UpdatePostDto } from '../dto/update_post.dto';
import { PostEntity } from '../entity/post.entity';
import { ErrorMessage } from 'src/common/errors/error.messages';
import { validatePrivacySetting } from '../validator/privacy-setting.schema';

@Injectable()
export class UpdatePostUseCase {
  constructor(private readonly postRepo: PostRepository) {}

  async execute(id: string, dto: UpdatePostDto): Promise<PostEntity> {
    const item = await this.postRepo.findById(id);
    if (!item) {
      throw new NotFoundException(ErrorMessage.PostNotFound(id));
    }
    const validatedPrivacyJson = validatePrivacySetting(dto.privacyJson);
    return await this.postRepo.update(id, {
      ...dto,
      privacyJson: validatedPrivacyJson,
    });
  }
}
