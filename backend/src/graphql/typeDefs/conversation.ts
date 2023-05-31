import gql from 'graphql-tag';

const typeDefs = gql`
  scalar Date

  type Mutation {
    createConversation(participantIds: [String]!): createConversationResponse
  }
  type Mutation {
    markConversationAsRead(userId: String!, conversationId: String!): Boolean
  }
  type Query {
    conversations: [Conversation]
  }

  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createAt: Date
    updatedAt: Date
  }

  # type ConversationUpdatedSubscriptionPayload {
  #   conversation: Conversation
  # }

  type Participant {
    id: String
    user: User
    hasSeenLatestMassage: Boolean
  }
  type createConversationResponse {
    conversationId: String
  }

  type Subscription {
    conversationCreated: Conversation
  }
  type Subscription {
    conversationUpdated: Conversation
  }
`;

export default typeDefs;
