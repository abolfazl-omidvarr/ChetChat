import gql from 'graphql-tag';

const typeDefs = gql`
  type Query {
    test(a: String!): testResponse
  }

  type testResponse {
    success: Boolean
    error: String
  }

  # type Subscription{}
`;

export default typeDefs;
