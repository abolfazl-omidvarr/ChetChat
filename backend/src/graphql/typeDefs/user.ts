import gql from "graphql-tag";

const typeDefs = gql`
	type searchedUser {
		id: String
		username: String
	}
	type Query {
		searchUsers(username: String): [searchedUser]
	}

	type Mutation {
		createUsername(username: String): CreateUser
	}
	type Mutation {
		createUser(username: String, password: String, email: String): CreateUser
	}
	type Mutation {
		loginUser(userMail: String, password: String): LoginUser
	}
	type CreateUser {
		success: Boolean
		error: String
	}
	type LoginUser {
		success: Boolean
		error: String
		accessToken: String
	}
	# type Subscription{}
`;

export default typeDefs;
