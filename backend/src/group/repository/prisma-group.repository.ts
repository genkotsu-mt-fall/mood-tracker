import { PrismaService } from 'src/prisma/prisma.service';
import { GroupRepository } from './group.repository';
import { GroupEntity } from '../entity/group.entity';
import { CreateGroupDto } from '../dto/create_group.dto';
import { Injectable } from '@nestjs/common';
import { toGroupEntity } from '../mapper/group.mapper';
import { UpdateGroupDto } from '../dto/update_group.dto';

@Injectable()
export class PrismaGroupRepository implements GroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateGroupDto): Promise<GroupEntity> {
    const data = {
      ...dto,
      user_id: userId,
    };
    const item = await this.prisma.group.create({ data });
    return toGroupEntity(item);
  }

  async findAllWithCount(pagination: {
    skip: number;
    take: number;
  }): Promise<{ data: GroupEntity[]; total: number }> {
    const { skip, take } = pagination;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.group.findMany({ skip, take }),
      this.prisma.group.count(),
    ]);
    return {
      data: items.map(toGroupEntity),
      total,
    };
  }

  async findById(id: string): Promise<GroupEntity | null> {
    const item = await this.prisma.group.findUnique({ where: { id } });
    return item ? toGroupEntity(item) : null;
  }

  async update(id: string, data: UpdateGroupDto): Promise<GroupEntity> {
    const item = await this.prisma.group.update({ where: { id }, data });
    return toGroupEntity(item);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.group.delete({ where: { id } });
  }
}
