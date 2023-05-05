import { Button, Flex } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import ConversationWrapper from "./Conversation/ConversationWrapper";
import FeedWrapper from "./Feed/FeedWrapper";
import { Session } from "next-auth";

interface ChatProps {
	session: Session;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
	return (
		<Flex className="h-screen">
			<ConversationWrapper session={session} />
			<FeedWrapper session={session} />
			<Button onClick={() => signOut()}>Log Out</Button>
		</Flex>
	);
};

export default Chat;
