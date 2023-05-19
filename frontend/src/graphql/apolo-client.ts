import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  HttpLink,
  ApolloLink,
  concat,
  split,
} from '@apollo/client';

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

import { createClient } from 'graphql-ws';

import { store } from '@/redux/Store';
import authSlice from '@/redux/authSlice';

export function getUserId(): string | null {
  const state = store.getState();
  return state.auth.userId;
}

export function getToken(): string | null {
  const state = store.getState();
  return state.auth.token;
}

export function dispatchTokenAndId(id: string | null, token: string | null) {
  store.dispatch(
    authSlice.actions.setTokenAndId({ userId: id, accessToken: token })
  );
}

import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

const refreshLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  isTokenValidOrUndefined: () => {
    const token = getToken();

    if (!token) {
      return true;
    }

    try {
      const jwtPayload = jwtDecode<any>(token);
      const { exp } = jwtPayload;

      if (Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return false;
    }
  },
  fetchAccessToken: async () => {
    return fetch('http://localhost:4000/refresh_token', {
      method: 'POST',
      credentials: 'include',
    });
  },
  handleFetch: (accessToken) => {
    dispatchTokenAndId(getUserId(), accessToken);
  },
  handleError: (error) => {
    console.error('Cannot refresh access token:', error);
  },
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = getToken();
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,

      authorization: accessToken ? `bearer ${accessToken}` : 'UNAUTHORIZED',
    },
  }));

  return forward(operation);
});

const wsLink =
  typeof window !== undefined
    ? new GraphQLWsLink(
        createClient({
          url: 'ws://localhost:4000/graphql/subscriptions',
          connectionParams: async () => ({
            accessToken: getToken(),
          }),
        })
      )
    : null;

const splitWsLink =
  typeof window !== undefined && wsLink !== null
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === 'OperationDefinition' &&
            def.operation === 'subscription'
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authMiddleware.concat(refreshLink).concat(splitWsLink),
});
