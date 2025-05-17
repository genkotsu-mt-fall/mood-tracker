// import { Test, TestingModule } from '@nestjs/testing';
// import { UserService } from './user.service';
// import { Prisma } from '@prisma/client';
// import { PrismaService } from 'src/prisma/prisma.service';

// describe('UserService', () => {
//   let service: UserService;
//   // let prisma: PrismaService;

//   const mockPrismaService = {
//     user: {
//       create: jest.fn(),
//       findMany: jest.fn(),
//       findUnique: jest.fn(),
//       update: jest.fn(),
//       delete: jest.fn(),
//     },
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         { provide: PrismaService, useValue: mockPrismaService },
//       ],
//     }).compile();

//     service = module.get<UserService>(UserService);
//     // prisma = module.get<PrismaService>(PrismaService);
//   });

//   it('should create a user', async () => {
//     const input: Prisma.UserCreateInput = {
//       email: 'john@example.com',
//       name: 'John',
//     };
//     const result = { id: 'uuid', ...input };

//     mockPrismaService.user.create.mockResolvedValue(result);

//     // ブラックボックステスト
//     expect(await service.create(input)).toEqual(result);
//   });
// });
