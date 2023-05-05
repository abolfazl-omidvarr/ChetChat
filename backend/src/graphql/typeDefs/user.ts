import gql from "graphql-tag";

const typeDefs = gql`
	type User {
		id: String
		username: String
	}
	type Query {
		searchUser(username: String): [User]
	}

	type Mutation {
		createUsername(username: String): CreateUsernameResponse
	}
	type CreateUsernameResponse {
		success: Boolean
		error: String
	}
	# type Subscription{}
`;

export default typeDefs;