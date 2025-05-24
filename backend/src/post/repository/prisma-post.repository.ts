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
      visibleUntil: dto.visibleUntil ? new Date(dto.visibleUntil) : null,
      visibleAfter: dto.visibleAfter ? new Date(dto.visibleAfter) : null,
    };
    const item = await this.prisma.post.create({ data });
    return toPostEntity(item);
  }

  async findAllWithCount(pagination: {
    skip: number;
    take: number;
  }): Promise<{ data: PostEntity[]; total: number }> {
    const { skip, take } = pagination;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({ skip, take }),
      this.prisma.post.count(),
    ]);
    return {
      data: items.map(toPostEntity),
      total,
    };
  }

  async findById(id: string): Promise<PostEntity | null> {
    const item = await this.prisma.post.findUnique({ where: { id } });
    return item ? toPostEntity(item) : null;
  }

  async update(id: string, data: UpdatePostDto): Promise<PostEntity> {
    const item = await this.prisma.post.update({ where: { id }, data });
    return toPostEntity(item);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }
}
