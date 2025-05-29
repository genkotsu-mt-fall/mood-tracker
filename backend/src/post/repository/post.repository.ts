import { CreatePostDto } from '../dto/create_post.dto';
import { UpdatePostDto } from '../dto/update_post.dto';
import { PostEntity } from '../entity/post.entity';

export abstract class PostRepository {
  abstract create(userId: string, dto: CreatePostDto): Promise<PostEntity>;

  abstract findAllWithCount(pagination: {
    skip: number;
    take: number;
  }): Promise<{ data: PostEntity[]; total: number }>;

  abstract findById(id: string): Promise<PostEntity | null>;

  abstract update(id: string, data: UpdatePostDto): Promise<PostEntity>;

  abstract delete(id: string): Promise<void>;
}
