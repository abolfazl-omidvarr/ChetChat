import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	gql,
	HttpLink,
	ApolloLink,
	concat,
} from "@apollo/client";

import { getAccessToken, setAccessToken } from "@/libs/AccessToken";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";

const httpLink = new HttpLink({
	uri: "http://localhost:4000/graphql",
	credentials: "include",
});

const refreshLink = new TokenRefreshLink({
	accessTokenField: "accessToken",
	isTokenValidOrUndefined: () => {
		const token = getAccessToken();

		if (!token) {
			return true;
		}

		try {
			const { exp } = jwtDecode<any>(token);

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
		return fetch("http://localhost:4000/refresh_token", {
			method: "POST",
			credentials: "include",
		});
	},
	handleFetch: (accessToken) => {
		setAccessToken(accessToken);
	},
	handleError: (error) => {
		console.error("Cannot refresh access token:", error);
	},
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
	// link: concat(authMiddleware, httpLink),
	link: authMiddleware.concat(refreshLink).concat(httpLink),
});
