import { PrismaService } from 'src/prisma/prisma.service';
import { FollowRepository } from './follow.repository';
import { FollowEntity } from '../entity/follow.entity';
import { CreateFollowDto } from '../dto/create_follow.dto';
import { Injectable } from '@nestjs/common';
import { toFollowEntity } from '../mapper/follow.mapper';

@Injectable()
export class PrismaFollowRepository implements FollowRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateFollowDto): Promise<FollowEntity> {
    const data = {
      follower_id: userId,
      followee_id: dto.followeeId,
    };
    const item = await this.prisma.follow.create({ data });
    return toFollowEntity(item);
  }

  async findAllWithCount(pagination: {
    skip: number;
    take: number;
  }): Promise<{ data: FollowEntity[]; total: number }> {
    const { skip, take } = pagination;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.follow.findMany({ skip, take }),
      this.prisma.follow.count(),
    ]);
    return {
      data: items.map(toFollowEntity),
      total,
    };
  }

  async findById(id: string): Promise<FollowEntity | null> {
    const item = await this.prisma.follow.findUnique({ where: { id } });
    return item ? toFollowEntity(item) : null;
  }

  async findFollowRelation(
    userId: string,
    followeeId: string,
  ): Promise<FollowEntity | null> {
    const item = await this.prisma.follow.findUnique({
      where: {
        follower_id_followee_id: {
          follower_id: userId,
          followee_id: followeeId,
        },
      },
    });
    return item ? toFollowEntity(item) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.follow.delete({ where: { id } });
  }
}
