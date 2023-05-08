import gql from "graphql-tag";

const typeDefs = gql`
	# type Query {

	# }

	type Mutation {
		createConversation(participantIds: [String]!): createConversationResponse
	}

	type createConversationResponse {
		conversationId: String
	}

	# type Subscription{}
`;

export default typeDefs;
