"use client";
import { useCallback, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import useConversationModal from "@/Hooks/useConversationModal";
import userOperations from "@/graphql/operations/user";
import {
	CreateConversationData,
	CreateConversationInput,
	SearchUserData,
	SearchUserInput,
} from "@/util/types";
import { toast } from "react-hot-toast";
import conversationOperations from "@/graphql/operations/coversation";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Stack,
	Button,
	ModalFooter,
	Input,
} from "@chakra-ui/react";
import { RiUserSearchLine } from "react-icons/ri";
import UserSearchList from "./UserSearchList";
import { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface ConversationModalProps {
	at: string;
}

const ConversationModal: React.FC<ConversationModalProps> = ({ at }) => {
	const router = useRouter();

	const { isOpen, onClose, participants, addParticipant, removeParticipant } =
		useConversationModal();

	const [username, setUsername] = useState("");

	const [searchUsers, { data: queryData, loading: queryLoading }] =
		useLazyQuery<SearchUserData, SearchUserInput>(
			userOperations.Queries.searchUsers
		);

	const [createConversation, { loading: mutationLoading }] = useMutation<
		CreateConversationData,
		CreateConversationInput
	>(conversationOperations.Mutations.createConversation);

	const onSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		searchUsers({ variables: { username } });
	};

	const onCreateFunction = useCallback(async () => {
		const participantIds = [...participants.map((elem) => elem.id), myId];
		try {
			const { data } = await createConversation({
				variables: { participantIds },
			});

			if (!data?.createConversation)
				throw new Error("failed to create conversation");

			const {
				createConversation: { conversationId },
			} = data;

			const url = qs.stringifyUrl({
				url: "/",
				query: { conversationId },
			});

			router.push(url);
		} catch (error) {
			toast.error("Create Conversation felid");
			console.log(error);
		}
	}, [participants]);

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
									isDisabled={!username || queryLoading}
									isLoading={queryLoading}
								>
									Search
								</Button>
							</Stack>
						</form>
						<UserSearchList empty={!queryData} users={queryData?.searchUsers} />
					</ModalBody>
					<ModalFooter>
						<Button
							onClick={onCreateFunction}
							isDisabled={participants.length === 0 || mutationLoading}
							isLoading={mutationLoading}
							className="w-full"
							bg={"brand.100"}
							boxShadow={"base"}
							_hover={{
								bg: "brand.100",
								boxShadow: "lg",
							}}
						>
							Create
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ConversationModal;
