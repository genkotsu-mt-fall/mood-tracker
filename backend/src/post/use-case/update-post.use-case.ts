import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repository/post.repository';
import { UpdatePostDto } from '../dto/update_post.dto';
import { PostEntity } from '../entity/post.entity';
import { validatePrivacySetting } from '../validator/privacy-setting.schema';
import { FindPostByIdUseCase } from 'src/post-query/use-case/find-post-by-id.use-case';

@Injectable()
export class UpdatePostUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly findPostByIdUseCase: FindPostByIdUseCase,
  ) {}

  async execute(
    id: string,
    userId: string,
    dto: UpdatePostDto,
  ): Promise<PostEntity> {
    await this.findPostByIdUseCase.execute(userId, id);

    const validatedPrivacyJson = validatePrivacySetting(dto.privacyJson);
    return await this.postRepo.update(id, {
      ...dto,
      privacyJson: validatedPrivacyJson,
    });
  }
}
