import { Session } from "next-auth";
import { Box, Text } from "@chakra-ui/react";
import ConversationModal from "../Modal/ConversationModal/ConversationModal";
import useConversationModal from "@/Hooks/useConversationModal";
interface ConversationListProps {
	session: Session;
}

const ConversationList: React.FC<ConversationListProps> = ({ session }) => {
	const { onOpen } = useConversationModal();
	return (
		<Box className="w-full" onClick={onOpen}>
			<Box
				onClick={() => {}}
				className="py-2 px-5 mb-4 bg-black/20 rounded-md cursor-pointer"
			>
				<Text className="font-semibold text-center">
					Find or Start a Conversation
				</Text>
			</Box>
			<ConversationModal />
		</Box>
	);
};

export default ConversationList;
