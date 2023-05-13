import { gql } from "@apollo/client";

const userOperations = {
	Queries: {
		searchUsers: gql`
			query SearchUsers($username: String!) {
				searchUsers(username: $username) {
					id
					username
				}
			}
		`,
		loginUser: gql`
			query LoginUser($userMail: String!, $password: String!) {
				loginUser(userMail: $userMail, password: $password) {
					success
					error
					accessToken
				}
			}
		`,
		getCurrentUser: gql`
			query GetCurrentUser($userId: String) {
				loginUser(userId: $userId) {
					name
					email
					username
					image
				}
			}
		`,
	},
	Mutations: {
		createUsername: gql`
			mutation CreateUsername($username: String!) {
				createUsername(username: $username) {
					success
					error
				}
			}
		`,
		createUser: gql`
			mutation CreateUser(
				$username: String!
				$email: String!
				$password: String!
			) {
				createUser(username: $username, password: $password, email: $email) {
					success
					error
				}
			}
		`,
	},
	Subscriptions: {},
};

export default userOperations;
