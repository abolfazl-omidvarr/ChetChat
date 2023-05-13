"use client";
import { Button, Flex } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import ConversationWrapper from "./Conversation/ConversationWrapper";
import FeedWrapper from "./Feed/FeedWrapper";
import { Session } from "next-auth";
import useAuthenticated from "@/Hooks/useAuthenticated";
import { useRouter } from "next/navigation";
import { useLazyQuery } from "@apollo/client";

import testOperations from "@/graphql/operations/test";
import { testData, testInput } from "@/util/types";

import { store } from "@/redux/Store";
import authSlice from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

interface ChatProps {
	at: string;
}

const Chat: React.FC<ChatProps> = ({ at }) => {
	const [test, { data, loading }] = useLazyQuery<testData, testInput>(
		testOperations.Queries.test,
		{ fetchPolicy: "no-cache" }
	);

	// const dispatch = useDispatch();
	// const auth = useSelector((state: any) => state.auth,);
	// // console.log(auth);

	const { onLogOut } = useAuthenticated();
	const router = useRouter();
	return (
		<Flex className="h-screen">
			<ConversationWrapper at={at} />
			<FeedWrapper at={at} />
			<Button
				onClick={async () => {
					const resp = await test({ variables: { a: "abolfazl" } });
					console.log(resp);
				}}
			>
				test
			</Button>
			<Button
				onClick={() => {
					onLogOut();
					router.refresh();
				}}
			>
				Log Out
			</Button>
		</Flex>
	);
};

export default Chat;
