import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GroupEntity } from 'src/group/entity/group.entity';
import { toGroupEntity } from 'src/group/mapper/group.mapper';
import { UserGroupRepository } from './user-group.repository';

@Injectable()
export class PrismaUserGroupRepository implements UserGroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOwnedGroups(userId: string): Promise<GroupEntity[]> {
    const groups = await this.prisma.group.findMany({
      where: { user_id: userId },
    });
    return groups.map((g) => toGroupEntity(g));
  }
}
