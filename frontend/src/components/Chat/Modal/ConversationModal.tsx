import { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Text,
	Stack,
	Input,
} from "@chakra-ui/react";
import { RiUserSearchLine } from "react-icons/ri";
import useConversationModal from "@/Hooks/useConversationModal";
import userOperations from "@/graphql/operations/user";
import { SearchUserData, SearchUserInput } from "@/util/types";
interface ConversationModalProps {
	// session: Session;
}

const ConversationModal: React.FC<ConversationModalProps> = ({}) => {
	const { isOpen, onClose } = useConversationModal();
	const [username, setUsername] = useState("");

	const [searchUsers, { data, loading, error }] = useLazyQuery<
		SearchUserData,
		SearchUserInput
	>(userOperations.Queries.searchUsers);

	const onSearchSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		///search user
	};

	return (
		<>
			<Modal motionPreset="slideInBottom" isOpen={isOpen} onClose={onClose}>
				<ModalOverlay
					bg="blackAlpha.300"
					backdropFilter="blur(10px) hue-rotate(90deg)"
				/>
				<ModalContent bg="#2d2d2d" pb={4}>
					<ModalHeader>Modal Title</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<form>
							<Stack spacing={4}>
								<Input
									placeholder="Enter username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
								<Button
									onClick={onSearchSubmit}
									leftIcon={<RiUserSearchLine size={25} />}
									type="submit"
									isDisabled={!username}
								>
									Search
								</Button>
							</Stack>
						</form>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ConversationModal;
