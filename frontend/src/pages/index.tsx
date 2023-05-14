"use client";
import { Inter } from "next/font/google";
import { NextPage } from "next";
import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { Chat, Auth } from "@/components";
import { useCallback, useEffect, useState } from "react";
import ConversationModal from "@/components/Chat/Modal/ConversationModal/ConversationModal";
import { getAccessToken, setAccessToken } from "@/libs/AccessToken";

import { store } from "@/redux/Store";
import authSlice from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { useLazyQuery } from "@apollo/client";
import userOperations from "@/graphql/operations/user";
import { getCurrentUserData } from "@/util/types";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const [getCurrentUser, { data }] = useLazyQuery<getCurrentUserData, {}>(
		userOperations.Queries.getCurrentUser
	);

	const dispatch = useDispatch();
	const savedUserId = useSelector((state: any) => state.auth.userId);
	const token = useSelector((state: any) => state.auth.token);

	const dispatchAuthentication = (
		id: string | null,
		token: string | null,
		name: string | null = null,
		image: string | null = null,
		email: string | null = null,
		username: string | null = null
	) =>
		dispatch(
			authSlice.actions.setAuthenticationInfo({
				userId: id,
				accessToken: token,
			})
		);

	useEffect(() => {
		fetch("http://localhost:4000/refresh_token", {
			method: "POST",
			credentials: "include",
		}).then(async (data) => {
			const { accessToken, userId } = await data.json();
			if (accessToken) {
				dispatchAuthentication(userId, accessToken);
			} else {
				dispatchAuthentication(null, null);
			}
			setLoading(false);
		});
	}, []);

	const reloadSession = useCallback(() => router.refresh(), [router]);

	const Loading = (
		<div className="w-screen h-screen grid justify-center items-center">
			<BeatLoader color="#9badbc" loading />
		</div>
	);

	return loading ? (
		Loading
	) : (
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
