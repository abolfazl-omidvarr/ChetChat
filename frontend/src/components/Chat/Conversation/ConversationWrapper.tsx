import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";

interface ConversationWrapperProps {
	session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
	session,
}) => {
	return (
		<Box className="w-full md:w-[400px] bg-white/5 py-6 px-3">
			<ConversationList session={session} />
		</Box>
	);
};

export default ConversationWrapper;
