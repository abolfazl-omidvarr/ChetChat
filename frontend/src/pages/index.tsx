"use client";
import Image from "next/image";
// import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import { NextPage, NextPageContext } from "next";
import { Box, Button, useEditable } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

import { Chat, Auth } from "@/components";
import { useCallback, useEffect, useState } from "react";
import ConversationModal from "@/components/Chat/Modal/ConversationModal/ConversationModal";
import { getAccessToken, setAccessToken } from "@/libs/AccessToken";
import useAuthenticated from "@/Hooks/useAuthenticated";

import { store } from "@/redux/Store";
import authSlice from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
	const router = useRouter();

	const dispatch = useDispatch();
	const userId = useSelector((state: any) => state.auth.userId);
	const token = useSelector((state: any) => state.auth.token);

	const dispatchCredentials = (id: string | null, token: string | null) =>
		dispatch(
			authSlice.actions.setCredentials({ userId: id, accessToken: token })
		);

	console.log(token);

	useEffect(() => {
		fetch("http://localhost:4000/refresh_token", {
			method: "POST",
			credentials: "include",
		}).then(async (data) => {
			const { accessToken, userId } = await data.json();
			if (accessToken) {
				dispatchCredentials(userId, accessToken);
			} else {
				dispatchCredentials(null, null);
			}
		});
	}, []);

	const reloadSession = useCallback(() => router.refresh(), [router]);

	return (
		<>
			<Box>
				{token ? (
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
