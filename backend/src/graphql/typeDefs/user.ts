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
		createUsername(username: String): CreateUser
	}
	type Mutation {
		createUser(username: String, password: String, email: String): CreateUser
	}
	type CreateUser {
		success: Boolean
		error: String
	}
	# type Subscription{}
`;

export default typeDefs;
