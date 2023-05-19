import gql from 'graphql-tag';

const typeDefs = gql`
  type Query {
    searchUsers(username: String): [searchedUser]
  }
  type Query {
    getCurrentUser: GetCurrentUser
  }
  type Query {
    loginUser(userMail: String, password: String): LoginUserResponse
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
  type Mutation {
    logOut: LogOutResponse
  }
  type searchedUser {
    id: String
    username: String
  }
  type User {
    id: String
    username: String
    email: String
    emailVerified: Boolean
    image: String
  }
  type CreateUser {
    success: Boolean
    error: String
  }
  type LoginUserResponse {
    success: Boolean
    error: String
    accessToken: String
    userId: String
  }
  type LogOutResponse {
    success: Boolean
    error: String
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
