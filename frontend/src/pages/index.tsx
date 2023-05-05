import Image from "next/image";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import { NextPage, NextPageContext } from "next";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";

import { Chat, Auth } from "@/components";
import { useCallback } from "react";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
	const { data: session } = useSession();

	const reloadSession = useCallback(() => {}, []);

	return (
		<Box>
			{session?.user.userName ? (
				<Chat />
			) : (
				<Auth session={session} reloadSession={reloadSession} />
			)}
		</Box>
	);
};

export const getServerSideProps = async (context: NextPageContext) => {
	const session = await getSession(context);

	return {
		props: {
			session,
		},
	};
};

export default Home;