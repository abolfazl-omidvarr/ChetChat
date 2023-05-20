import gql from 'graphql-tag';

const typeDefs = gql`
  scalar Date

  type Mutation {
    createConversation(participantIds: [String]!): createConversationResponse
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
`;

export default typeDefs;
