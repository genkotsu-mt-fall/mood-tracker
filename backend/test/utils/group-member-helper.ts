import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setToken } from './auth-helper';
import { createGroup, GroupResult } from './group-helper';

interface CreateGroupAndAddMemgerResult {
  groupRes: GroupResult['groupRes'];
  groupMemberRes: GroupMemberRelationResult;
  groupOwnerToken: string;
}

interface GroupMemberRelationResult {
  id: string;
  groupId: string;
  memberId: string;
  addedAt: Date;
}

export const createGroupAndAddMember = async (
  prefix: string,
  app: INestApplication,
  groupName: string,
  memberId: string,
): Promise<CreateGroupAndAddMemgerResult> => {
  const { groupRes, groupOwnerToken } = await createGroup(
    prefix,
    app,
    groupName,
  );

  const groupMemberRes = await createGroupMemberRelation(
    prefix,
    app,
    groupRes.id,
    groupOwnerToken,
    memberId,
  );

  return { groupRes, groupMemberRes, groupOwnerToken };
};

export const createGroupMemberRelation = async (
  prefix: string,
  app: INestApplication,
  groupId: string,
  groupOwnerToken: string,
  memberId: string,
): Promise<GroupMemberRelationResult> => {
  const groupMemberCreateRes = await request(app.getHttpServer())
    .post('/group-member')
    .set(setToken(groupOwnerToken))
    .send({ groupId, memberId })
    .expect(201);

  const body = groupMemberCreateRes.body as GroupMemberRelationResult;
  return body;
};
