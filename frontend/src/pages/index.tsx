// "use client";
import Image from "next/image";
// import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import { NextPage, NextPageContext } from "next";
import { Box, useEditable } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

import { Chat, Auth } from "@/components";
import { useCallback, useEffect, useState } from "react";
import ConversationModal from "@/components/Chat/Modal/ConversationModal/ConversationModal";
import { getAccessToken, setAccessToken } from "@/libs/AccessToken";
import useAuthenticated from "@/Hooks/useAuthenticated";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
	const [auth, setAuth] = useState(false);
	const { onAuthentication, authenticated } = useAuthenticated();
	const router = useRouter();

	useEffect(() => {
		fetch("http://localhost:4000/refresh_token", {
			method: "POST",
			credentials: "include",
		}).then(async (data) => {
			const { accessToken, userId } = await data.json();
			if (accessToken) {
				setAccessToken(accessToken);
				onAuthentication(accessToken, userId);
			}
		});
	}, []);

	const reloadSession = useCallback(() => router.refresh(), [router]);

	return (
		<>
			<Box>
				{authenticated ? (
					<Chat at={getAccessToken()} />
				) : (
					<Auth at={getAccessToken()} reloadSession={reloadSession} />
				)}
			</Box>
			<ConversationModal at={getAccessToken()} />
		</>
	);
};

export default Home;
