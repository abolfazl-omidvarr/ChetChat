import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	gql,
	HttpLink,
	ApolloLink,
	concat,
} from "@apollo/client";

import { getAccessToken } from "@/libs/AccessToken";

const httpLink = new HttpLink({
	uri: "http://localhost:4000/graphql",
	credentials: "include",
});

const authMiddleware = new ApolloLink((operation, forward) => {
	const accessToken = getAccessToken();
	// add the authorization to the headers
	operation.setContext(({ headers = {} }) => ({
		headers: {
			...headers,
			authorization: accessToken ? `bearer ${accessToken}` : "UNAUTHORIZED",
		},
	}));

	return forward(operation);
});

export const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: concat(authMiddleware, httpLink),
});
