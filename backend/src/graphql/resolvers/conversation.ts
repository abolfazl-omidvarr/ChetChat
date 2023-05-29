import { Prisma, User } from '@prisma/client';
import {
  ConversationPopulated,
  GraphQLContext,
  ParticipantPopulated,
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
      // console.log('in convo');
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
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubSub } = context;

          return pubSub.asyncIterator(['CONVERSATION_CREATED']);
        },
        (
          payload: ConversationCreatedSubscriptionPayload,
          _variables: any,
          context: GraphQLContext
        ) => {
          const { tokenPayload } = context;

          if (tokenPayload.code !== 200) {
            throw new GraphQLError('Not authorized: ' + tokenPayload.status);
          }

          const userId = tokenPayload.payload!.userId;      //   headers: {
            //     'Content-Type': 'application/x-www-form-urlencoded',
            //   },
            // });
            //@ts-ignore

          const {
            conversationCreated: { participants },
          } = payload;

          const userIsConversationParticipant = (
            participants: Array<ParticipantPopulated>,
            userId: string
          ) => {
            return participants.some((p) => p.userId === userId);
          };

          return userIsConversationParticipant(participants, userId);
        }
      ),
    },
  },
};

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

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
