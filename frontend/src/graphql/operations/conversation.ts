import { gql } from '@apollo/client';
import { messageFields } from './message';

const ConversationFields = `
      id
      updatedAt
      participants {
        user {
          id
          username
        }
        hasSeenLatestMassage
      }
      latestMessage {
        ${messageFields}
      }
`;

const conversationOperations = {
  Queries: {
    conversations: gql`
      query Conversations {
        conversations {
          ${ConversationFields}
        }
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantIds: [String]!) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
    subscription ConversationCreated {
      conversationCreated {
        ${ConversationFields}
      }
    }
  `,
  },
};

export default conversationOperations;
