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
import UserSearchList from "./UserSearchList";
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

	const onSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		searchUsers({ variables: { username } });
	};

	return (
		<>
			<Modal motionPreset="slideInBottom" isOpen={isOpen} onClose={onClose}>
				<ModalOverlay
					bg="blackAlpha.300"
					backdropFilter="blur(10px) hue-rotate(90deg)"
				/>
				<ModalContent bg="#2d2d2d" pb={4}>
					<ModalHeader>Create a conversation</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<form onSubmit={onSearchSubmit}>
							<Stack spacing={4}>
								<Input
									placeholder="Enter username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
								<Button
									leftIcon={<RiUserSearchLine size={25} />}
									type="submit"
									isDisabled={!username || loading}
								>
									Search
								</Button>
							</Stack>
						</form>
						<UserSearchList users={data?.searchUsers} />
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ConversationModal;
