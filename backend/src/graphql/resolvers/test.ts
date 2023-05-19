import { Prisma, User } from '@prisma/client';
import { GraphQLContext, createUsernameResponse } from '../../util/types';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { getServerSession } from 'next-auth';

const resolvers = {
  Query: {
    test: async (
      _parent: any,
      args: { a: string },
      context: GraphQLContext
    ) => {
      // const { a } = args;
      // // console.log(a)
      // const { tokenPayload } = context.res.locals;
      // if (tokenPayload.code !== 200) {
      //   console.log(tokenPayload.code);
      //   return { error: 'unauth' };
      // }
      // return { success: true };
    },
  },
};
// Subscription: {},

export default resolvers;
