import { gql } from '@apollo/client';

const testOperations = {
  Queries: {
    test: gql`
      query Test($a: String!) {
        test(a: $a) {
          success
          error
        }
      }
    `,
  },
  Mutations: {},
  Subscriptions: {},
};

export default testOperations;
