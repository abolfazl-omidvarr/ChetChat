import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	gql,
	HttpLink,
	ApolloLink,
	concat,
} from "@apollo/client";

const httpLink = new HttpLink({
	uri: "http://localhost:4000/graphql",
	credentials: "include",
});

const authMiddleware = new ApolloLink((operation, forward) => {
	// add the authorization to the headers
	operation.setContext(({ headers = {} }) => ({
		headers: {
			...headers,
			authorization: "token" || null,
		},
	}));

	return forward(operation);
});

export const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: concat(authMiddleware, httpLink),
});
