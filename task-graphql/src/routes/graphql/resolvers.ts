import { PrismaClient } from '@prisma/client';

export const createResolvers = (prisma: PrismaClient) => ({
  users: () => prisma.user.findMany(),

  posts: () => prisma.post.findMany(),
  post: ({ id }: { id: string }) => prisma.post.findUnique({ where: { id } }),

  profiles: () => prisma.profile.findMany(),
  profile: ({ id }: { id: string }) => prisma.profile.findUnique({ where: { id } }),

  memberTypes: () => prisma.memberType.findMany(),
  memberType: ({ id }: { id: string }) => prisma.memberType.findUnique({ where: { id } }),

  //
  // === MUTATIONS ===
  createUser: ({ dto }: { dto: { name: string; balance: number } }) =>
    prisma.user.create({ data: dto }),
  createPost: ({ dto }: { dto: { title: string; content: string; authorId: string } }) =>
    prisma.post.create({ data: dto }),
  createProfile: ({
    dto,
  }: {
    dto: { isMale: boolean; yearOfBirth: number; userId: string; memberTypeId: string };
  }) => prisma.profile.create({ data: dto }),

  //
  // UPDATE RESOLVERS
  changeUser: ({ id, dto }: { id: string; dto: { name: string; balance: number } }) =>
    prisma.user.update({ where: { id }, data: dto }),

  changePost: ({
    id,
    dto,
  }: {
    id: string;
    dto: { title: string; content: string; authorId: string };
  }) => prisma.post.update({ where: { id }, data: dto }),

  changeProfile: ({
    id,
    dto,
  }: {
    id: string;
    dto: { isMale: boolean; yearOfBirth: number; userId: string; memberTypeId: string };
  }) => prisma.profile.update({ where: { id }, data: dto }),

  // DELETE RESOLVERS
  deleteUser: async ({ id }: { id: string }) => {
    await prisma.user.delete({ where: { id } });
    return id;
  },

  deletePost: async ({ id }: { id: string }) => {
    await prisma.post.delete({ where: { id } });
    return id;
  },

  deleteProfile: async ({ id }: { id: string }) => {
    await prisma.profile.delete({ where: { id } });
    return id;
  },

  // SUBSCRIBE RESOLVERS
  subscribeTo: async ({ userId, authorId }: { userId: string; authorId: string }) => {
    await prisma.subscribersOnAuthors.create({
      data: { subscriberId: userId, authorId },
    });
    return `${userId} subscribed to ${authorId}`;
  },

  unsubscribeFrom: async ({ userId, authorId }: { userId: string; authorId: string }) => {
    await prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: { subscriberId: userId, authorId },
      },
    });
    return `${userId} unsubscribed from ${authorId}`;
  },
});
