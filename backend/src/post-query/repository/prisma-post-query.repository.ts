import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PostEntity } from 'src/post/entity/post.entity';
import { toPostEntity } from 'src/post/mapper/post.mapper';
import { PostQueryRepository } from './post-query.repository';

@Injectable()
export class PrismaPostQueryRepository implements PostQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllWithCount(pagination: {
    skip: number;
    take: number;
  }): Promise<{ data: PostEntity[] /*total: number*/ }> {
    const { skip, take } = pagination;
    // const [items, total] = await this.prisma.$transaction([
    //   this.prisma.post.findMany({ skip, take }),
    //   this.prisma.post.count(),
    // ]);
    const items = await this.prisma.post.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip,
      take,
      include: { user: { select: { id: true, name: true } } },
    });
    return {
      data: items.map(toPostEntity),
      // total,
    };
  }

  async findById(id: string): Promise<PostEntity | null> {
    const item = await this.prisma.post.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
    });
    return item ? toPostEntity(item) : null;
  }

  async findUserPosts(
    userId: string,
    pagination: { skip: number; take: number },
  ): Promise<{ data: PostEntity[] }> {
    const { skip, take } = pagination;
    const items = await this.prisma.post.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip,
      take,
      include: { user: { select: { id: true, name: true } } },
    });
    return { data: items.map(toPostEntity) };
  }

  async findFollowingUsersPosts(
    viewerId: string,
    pagination: { skip: number; take: number },
  ): Promise<{ data: PostEntity[] }> {
    const { skip, take } = pagination;
    const items = await this.prisma.post.findMany({
      where: {
        user: {
          followers: { some: { follower_id: viewerId } },
        },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip,
      take,
      include: { user: { select: { id: true, name: true } } },
    });
    return { data: items.map(toPostEntity) };
  }
}
