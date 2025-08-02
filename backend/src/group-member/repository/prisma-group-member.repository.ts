import { PrismaService } from 'src/prisma/prisma.service';
import { GroupMemberRepository } from './group-member.repository';
import { GroupMemberEntity } from '../entity/group-member.entity';
import { CreateGroupMemberDto } from '../dto/create_group-member.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  toGroupMemberEntity,
  toGroupMemberWithGroupOwner,
} from '../mapper/group-member.mapper';
import { GroupMemberWithGroupOwnerEntity } from '../entity/group-member-with-group-owner.entity';
import { ErrorMessage } from 'src/common/errors/error.messages';
import { GroupMembershipCollection } from '../entity/group-membership.collection';
import { Prisma } from '@prisma/client';
import { UserEntity } from 'src/user/entity/user.entity';
import { toUserEntity } from 'src/user/mapper/user.mapper';

@Injectable()
export class PrismaGroupMemberRepository implements GroupMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateGroupMemberDto,
  ): Promise<GroupMemberEntity> {
    const data = {
      group_id: dto.groupId,
      member_id: dto.memberId,
    };
    try {
      const item = await this.prisma.groupMember.create({ data });
      return toGroupMemberEntity(item);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          'このユーザーはすでにグループに参加しています',
        );
      }
      throw error;
    }
  }

  async findAllWithCount(pagination: {
    skip: number;
    take: number;
  }): Promise<{ data: GroupMemberEntity[]; total: number }> {
    const { skip, take } = pagination;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.groupMember.findMany({ skip, take }),
      this.prisma.groupMember.count(),
    ]);
    return {
      data: items.map(toGroupMemberEntity),
      total,
    };
  }

  async findById(id: string): Promise<GroupMemberEntity | null> {
    const item = await this.prisma.groupMember.findUnique({ where: { id } });
    return item ? toGroupMemberEntity(item) : null;
  }

  async findGroupIdsByMemberId(
    userId: string,
  ): Promise<GroupMembershipCollection | null> {
    const items = await this.prisma.groupMember.findMany({
      where: { member_id: userId },
      select: { group_id: true, member_id: true },
    });
    return items ? GroupMembershipCollection.fromPrimitives(items) : null;
  }

  /**
   * GroupMember と、その所属グループの所有者（user_id）を取得します。
   *
   * ## 動作仕様
   * - 対象の GroupMember が存在しない、または関連する Group が存在しない場合は `NotFoundException` を投げます。
   * - `findById()` よりも厳格な取得であり、Guard など「取得できなければロジックが成立しない」用途向けです。
   *
   * ## 命名について
   * - `load` という動詞は、「取得失敗が許容されないこと」を明示的に表現しています。
   * - `find` は optional（null許容）な取得を指すのに対し、`load` は必須取得を意図します。
   *
   * @param id - GroupMember の ID
   * @throws NotFoundException - 対象が存在しない場合
   */
  async loadWithGroupOwnerById(
    id: string,
  ): Promise<GroupMemberWithGroupOwnerEntity> {
    const item = await this.prisma.groupMember.findUnique({
      where: { id },
      include: {
        group: {
          select: {
            user_id: true,
          },
        },
      },
    });
    if (!item || !item.group) {
      throw new NotFoundException(ErrorMessage.GroupMemberNotFound(id));
    }
    return toGroupMemberWithGroupOwner(item);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.groupMember.delete({ where: { id } });
  }

  async findMembersByGroupId(groupId: string): Promise<UserEntity[]> {
    const members = await this.prisma.groupMember.findMany({
      where: { group_id: groupId },
      include: { member: true },
    });
    return members
      .filter((m) => m.member !== null)
      .map((m) => toUserEntity(m.member));
  }
}
