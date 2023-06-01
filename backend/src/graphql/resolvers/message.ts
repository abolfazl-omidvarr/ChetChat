import { Prisma, User } from '@prisma/client';
import {
  ConversationPopulated,
  GraphQLContext,
  MessagePopulated,
  MessageSentSubscriptionPayload,
  createUsernameResponse,
  sendMessageArgument,
} from '../../util/types';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { getServerSession } from 'next-auth';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { userIsConversationParticipant } from '../../util/functions';
import { conversationPopulated } from './conversation';

const resolvers = {
  Query: {
    messages: async (
      _parent: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<Array<MessagePopulated>> => {
      const { prisma, tokenPayload } = context;
      const { payload, status, code } = tokenPayload;
      const { conversationId } = args;
      const userId = payload?.userId;

      console.log(tokenPayload);
      /**
       * authentication check
       */
      if (code !== 200 && !payload)
        throw new GraphQLError('Not Authorized:' + status);
      /**
       * check if conversation is exists
       */
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: conversationPopulated,
      });

      if (!conversation) throw new GraphQLError('conversation not found');
      /**
       * check if current user is participant to current conversation
       */
      const allowedToView = userIsConversationParticipant(
        conversation.participants,
        userId!
      );
      if (!allowedToView)
        throw new GraphQLError('Not Authorized to do this action');

      try {
        const messages = await prisma.message.findMany({
          where: {
            conversationId,
          },
          include: messagePopulated,
          orderBy: {
            createdAt: 'desc',
          },
        });
        return messages;
      } catch (error: any) {
        console.log('messages error: ', error?.message);
        throw new GraphQLError('messages error: ' + error?.message);
      }
    },
  },
  Mutation: {
    sendMessage: async (
      _parent: any,
      args: sendMessageArgument,
      context: GraphQLContext
    ): Promise<boolean> => {
      const { pubSub, tokenPayload, prisma } = context;
      const { body, conversationId, id: messageId, senderId } = args;
      const { code, payload, status } = tokenPayload;
      const userId = payload?.userId;

      //authorization check & check if senderId is math with current user Id
      if (code !== 200 || userId !== senderId)
        throw new GraphQLError('Not Authorized:' + status);

      let newMessageObj: MessagePopulated;
      let conversationObj: ConversationPopulated;
      // async function performTransaction() {
      //   try {
      //     await prisma.$transaction(async (transaction) => {
      //       //create a message
      //       const newMessage = await transaction.message.create({
      //         data: {
      //           id: messageId,
      //           body,
      //           conversationId,
      //           senderId,
      //         },
      //         include: messagePopulated,
      //       });

      //       //find conversation participant

      //       const participant =
      //         await transaction.conversationParticipant.findFirst({
      //           where: {
      //             conversationId,
      //             userId,
      //           },
      //         });

      //       if (!participant)
      //         throw new GraphQLError(
      //           'sending message went wrong: find participant error'
      //         );

      //       //update conversation

      //       const conversation = await transaction.conversation.update({
      //         where: {
      //           id: conversationId,
      //         },
      //         data: {
      //           latestMessageId: newMessage.id,
      //           participants: {
      //             update: {
      //               where: {
      //                 id: participant.id,
      //               },
      //               data: {
      //                 hasSeenLatestMassage: true,
      //               },
      //             },
      //             updateMany: {
      //               where: {
      //                 NOT: {
      //                   userId: senderId,
      //                 },
      //               },
      //               data: {
      //                 hasSeenLatestMassage: false,
      //               },
      //             },
      //           },
      //         },
      //         include: conversationPopulated,
      //       });
      //       newMessageObj = newMessage;
      //       conversationObj = conversation;
      //     });

      //     pubSub.publish('MESSAGE_SENT', { messageSent: newMessageObj });

      //     pubSub.publish('CONVERSATION_UPDATED', {
      //       conversationUpdated: conversationObj,
      //     });

      //     console.log('Transaction completed successfully');
      //   } catch (error) {
      //     console.error('Transaction failed', error);
      //   } finally {
      //     // await prisma.$disconnect();
      //   }
      // }

      try {
        // await performTransaction();

        //create a message
        const newMessage = await prisma.message.create({
          data: {
            id: messageId,
            body,
            conversationId,
            senderId,
          },
          include: messagePopulated,
        });

        //find conversation participant

        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            conversationId,
            userId,
          },
        });

        if (!participant)
          throw new GraphQLError(
            'sending message went wrong: find participant error'
          );

        //update conversation

        const conversation = await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            latestMessageId: newMessage.id,
            participants: {
              update: {
                where: {
                  id: participant.id,
                },
                data: {
                  hasSeenLatestMassage: true,
                },
              },
              updateMany: {
                where: {
                  NOT: {
                    userId: senderId,
                  },
                },
                data: {
                  hasSeenLatestMassage: false,
                },
              },
            },
          },
          include: conversationPopulated,
        });

        pubSub.publish('MESSAGE_SENT', { messageSent: newMessage });

        pubSub.publish('CONVERSATION_UPDATED', {
          conversationUpdated: conversation,
        });
      } catch (error: any) {
        console.log('send message error: ', error?.message);
        throw new GraphQLError('send message error: ' + error?.message);
      }

      return true;
    },
  },
  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (parent: any, _args: any, context: GraphQLContext) => {
          const { pubSub } = context;
          return pubSub.asyncIterator(['MESSAGE_SENT']);
        },
        (
          payload: MessageSentSubscriptionPayload,
          args: { conversationId: string },
          context: GraphQLContext
        ) => {
          return payload.messageSent.conversationId === args.conversationId;
        }
      ),
    },
  },
};

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    },
  },
});

export default resolvers;
