// src/routes/graphql/field-resolvers.ts
import { PrismaClient } from '@prisma/client';

interface Context {
  prisma: PrismaClient;
}

// User field resolvers
export const UserFieldResolvers = {
  profile: (parent: any, _args: any, context: Context) =>
    context.prisma.profile.findUnique({ where: { userId: parent.id } }),

  posts: (parent: any, _args: any, context: Context) =>
    context.prisma.post.findMany({ where: { authorId: parent.id } }),

  subscribedToUser: async (parent: any, _args: any, context: Context) => {
    const subs = await context.prisma.subscribersOnAuthors.findMany({
      where: { subscriberId: parent.id },
      include: { author: true },
    });
    return subs.map((sub) => sub.author);
  },

  userSubscribedTo: async (parent: any, _args: any, context: Context) => {
    const subs = await context.prisma.subscribersOnAuthors.findMany({
      where: { authorId: parent.id },
      include: { subscriber: true },
    });
    return subs.map((sub) => sub.subscriber);
  },
};

// Post field resolvers
export const PostFieldResolvers = {
  author: (parent: any, _args: any, context: Context) =>
    context.prisma.user.findUnique({ where: { id: parent.authorId } }),
};

// Profile field resolvers
export const ProfileFieldResolvers = {
  user: (parent: any, _args: any, context: Context) =>
    context.prisma.user.findUnique({ where: { id: parent.userId } }),

  memberType: (parent: any, _args: any, context: Context) =>
    context.prisma.memberType.findUnique({ where: { id: parent.memberTypeId } }),
};

// MemberType field resolvers
export const MemberTypeFieldResolvers = {
  profiles: (parent: any, _args: any, context: Context) =>
    context.prisma.profile.findMany({ where: { memberTypeId: parent.id } }),
};
