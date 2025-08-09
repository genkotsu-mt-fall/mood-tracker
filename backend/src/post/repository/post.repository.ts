import { CreatePostDto } from '../dto/create_post.dto';
import { UpdatePostDto } from '../dto/update_post.dto';
import { PostEntity } from '../entity/post.entity';

export abstract class PostRepository {
  abstract create(userId: string, dto: CreatePostDto): Promise<PostEntity>;

  abstract update(id: string, data: UpdatePostDto): Promise<PostEntity>;

  abstract delete(id: string): Promise<void>;
}
