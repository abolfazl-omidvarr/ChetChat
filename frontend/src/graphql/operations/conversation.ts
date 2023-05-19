import { gql } from '@apollo/client';

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
        id
        sender {
          id
          username
        }
        body
        createdAt
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
  Subscriptions: {},
};

export default conversationOperations;
