import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLFieldResolver } from 'graphql';
import { schema } from './schema.js';
import { createResolvers } from './resolvers.js';
import {
  MemberTypeFieldResolvers,
  PostFieldResolvers,
  ProfileFieldResolvers,
  UserFieldResolvers,
} from './field-resolvers.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  const rootValue = createResolvers(prisma);

  // Маппинг: тип → его field resolvers
  const typeFieldResolvers: Record<string, any> = {
    User: UserFieldResolvers, // <-- для типа User используем UserFieldResolvers
    Post: PostFieldResolvers,
    Profile: ProfileFieldResolvers,
    MemberType: MemberTypeFieldResolvers,
  };

  const fieldResolver: GraphQLFieldResolver<any, any> = (source, args, context, info) => {
    const typeName = info.parentType.name;
    const fieldName = info.fieldName;

    // ⭐ ВАЖНО: Для Query и Mutation вызываем функции из rootValue
    if (typeName === 'Query' || typeName === 'Mutation') {
      const resolver = rootValue[fieldName];
      if (typeof resolver === 'function') {
        return resolver(args, context, info);
      }
      return resolver;
    }

    // Для остальных типов - кастомные резолверы
    if (typeFieldResolvers[typeName]?.[fieldName]) {
      return typeFieldResolvers[typeName][fieldName](source, args, context, info);
    }

    // По умолчанию
    return source?.[fieldName];
  };

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      return graphql({
        schema,
        source: query,
        rootValue,
        contextValue: { prisma }, // Добавили context
        variableValues: variables,
        fieldResolver,
      });
    },
  });
};

export default plugin;
