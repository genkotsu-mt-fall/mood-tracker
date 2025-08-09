import { PrismaService } from 'src/prisma/prisma.service';
import { PostRepository } from './post.repository';
import { PostEntity } from '../entity/post.entity';
import { CreatePostDto } from '../dto/create_post.dto';
import { Injectable } from '@nestjs/common';
import { toPostEntity } from '../mapper/post.mapper';
import { UpdatePostDto } from '../dto/update_post.dto';

@Injectable()
export class PrismaPostRepository implements PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreatePostDto): Promise<PostEntity> {
    const data = {
      ...dto,
      userId,
      privacyJson: dto.privacyJson ?? undefined,
    };
    const item = await this.prisma.post.create({ data });
    return toPostEntity(item);
  }

  async update(id: string, data: UpdatePostDto): Promise<PostEntity> {
    const item = await this.prisma.post.update({ where: { id }, data });
    return toPostEntity(item);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }
}
