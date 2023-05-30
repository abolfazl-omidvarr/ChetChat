import { Prisma, PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { ISODateString } from 'next-auth';
import { Response, Request } from 'express';
import {
  conversationPopulated,
  participantPopulated,
} from '../graphql/resolvers/conversation';
import { messagePopulated } from '../graphql/resolvers/message';

import { Context } from 'graphql-ws/lib/server';

/**
 * server config interface
 */
export interface GraphQLContext {
  prisma: PrismaClient;
  req: Request | null;
  res: Response | null;
  tokenPayload: TokenPayload;
  pubSub: PubSub;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    accessToken?: string;
  };
  prisma: PrismaClient;
  req: Request;
  res: Response;
  tokenPayload: TokenPayload;
}
export interface TokenPayload {
  payload: Payload | null;
  status: string;
  code: number;
}

export interface Payload {
  userId: string;
  iat: number;
  exp: number;
}

//////////////////////////////////////////////////

export interface googleUser {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface User {
  id: string;
  email: string;
  image: string;
  userName?: string | null;
  name: string;
  emailVerified?: boolean | null;
  hashedPassword?: string | null;
}

export interface createUsernameResponse {
  success?: boolean;
  error?: string;
}

export interface loginUserResponse {
  success?: boolean;
  error?: string;
  accessToken?: string;
  userId?: string;
}

export interface getCurrentUserResponse {
  name: string | null;
  email: string | null;
  username: string | null;
  image: string | null;
}

/**
 * Conversations
 */
export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

export interface ConversationUpdatedSubscriptionPayload {
  conversationUpdated: {
    conversation: ConversationPopulated;
  };
}

/**
 * Messages
 */
export type MessagePopulated = Prisma.MessageGetPayload<{
  include: typeof messagePopulated;
}>;
export interface sendMessageArgument {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}

export interface MessageSentSubscriptionPayload {
  messageSent: MessagePopulated;
}
