export const ErrorMessage = {
  UserNotFound: (id: string) => `User with id ${id} not found`,
  PostNotFound: (id: string) => `Post with id ${id} not found`,
  FollowNotFound: (id: string) => `Follow with id ${id} not found`,
  GroupNotFound: (id: string) => `Group with id ${id} not found`,
  GroupMemberNotFound: (id: string) => `GroupMember with id ${id} not found`,
};
