import { Prisma, User } from '@prisma/client';
import {
  ConversationPopulated,
  GraphQLContext,
  createUsernameResponse,
} from '../../util/types';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { getServerSession } from 'next-auth';
import { withFilter } from 'graphql-subscriptions';

const resolvers = {
  Query: {
    conversations: async (
      _parent: any,
      _args: any,
      context: GraphQLContext
    ) => {
      // : Promise<Array<ConversationPopulated>>
      console.log('in convo');
      const { prisma, res } = context;
      const { code, payload } = res?.locals.tokenPayload;
      if (code !== 200) {
        throw new GraphQLError(
          'You are not authorized to perform this action.',
          {
            extensions: {
              code: code,
            },
          }
        );
      }

      try {
        const { userId } = payload;
        const conversations = await prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userId: {
                  equals: userId,
                },
              },
            },
          },
          include: conversationPopulated,
        });

        return conversations;
      } catch (error: any) {
        console.log('conversation error: ', error);
        throw new GraphQLError(error.message);
      }
    },
  },
  Mutation: {
    createConversation: async (
      _parent: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { prisma, res, pubSub } = context;
      const { participantIds } = args;

      const { code, payload } = res?.locals.tokenPayload;

      console.log('here is pubSub in createConversation', pubSub);

      if (code !== 200) {
        throw new GraphQLError(
          'You are not authorized to perform this action.',
          {
            extensions: {
              code: code,
            },
          }
        );
      }
      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => ({
                  userId: id,
                  hasSeenLatestMassage: id === payload.userId,
                })),
              },
            },
          },
          include: conversationPopulated,
        });

        pubSub?.publish('CONVERSATION_CREATED', {
          conversationCreated: conversation,
        });

        return { conversationId: conversation.id };
      } catch (error: any) {
        console.log(error);
        throw new GraphQLError(
          'Create conversation has encountered an error: ',
          error
        );
      }
    },
  },
  Subscription: {
    conversationCreated: {
      subscribe: /*withFilter(*/ (_: any, __: any, context: GraphQLContext) => {
        //@ts-ignore
        const { pubSub, kosher } = context;

        console.log(pubSub);
        console.log(kosher);

        return pubSub?.asyncIterator(['CONVERSATION_CREATED']);
      },
      // (
      //   payload: ConversationCreatedSubscriptionPayload,
      //   _,
      //   context: GraphQLContext
      // ) => {
      //   const { session } = context;

      //   if (!session?.user) {
      //     throw new GraphQLError('Not authorized');
      //   }

      //   const { id: userId } = session.user;
      //   const {
      //     conversationCreated: { participants },
      //   } = payload;

      //   return userIsConversationParticipant(participants, userId);
      // }
      // ),
    },
  },
};

export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });

export default resolvers;
