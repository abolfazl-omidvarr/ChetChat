import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/chakra/theme";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/graphql/apolo-client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "@/redux/Store";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<Provider store={store}>
			<ApolloProvider client={client}>
				{/* <SessionProvider session={session}> */}
				<ChakraProvider theme={theme}>
					<Component {...pageProps} />
					<Toaster toastOptions={{ className: "text-center" }} />
				</ChakraProvider>
				{/* </SessionProvider> */}
			</ApolloProvider>
		</Provider>
	);
}
