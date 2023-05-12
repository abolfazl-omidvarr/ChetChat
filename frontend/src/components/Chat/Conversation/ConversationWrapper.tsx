import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";

interface ConversationWrapperProps {
	at: string;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({ at }) => {
	return (
		<Box className="w-full md:w-[400px] bg-white/5 py-6 px-3">
			<ConversationList at={at} />
		</Box>
	);
};

export default ConversationWrapper;
