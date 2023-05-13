import gql from "graphql-tag";

const typeDefs = gql`
	type searchedUser {
		id: String
		username: String
	}
	type Query {
		searchUsers(username: String): [searchedUser]
	}
	type Query {
		getCurrentUser(userId: String): GetCurrentUser
	}
	type Query {
		loginUser(userMail: String, password: String): LoginUser
	}
	type Mutation {
		createUsername(username: String): CreateUser
	}
	type Mutation {
		createUser(username: String, password: String, email: String): CreateUser
	}
	type Mutation {
		revokeRefreshToken(userId: String): RevokeRefreshToken
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
	type RevokeRefreshToken {
		success: Boolean
		error: String
		tokenVersion: Int
	}
	type GetCurrentUser {
		name: String
		email: String
		username: String
		image: String
	}
	# type Subscription{}
`;

export default typeDefs;
