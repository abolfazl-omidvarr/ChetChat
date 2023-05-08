import useConversationModal from "@/Hooks/useConversationModal";
import { SearchedUsers } from "@/util/types";
import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Flex, Stack, Text } from "@chakra-ui/layout";
import { RiUserAddLine, RiUserUnfollowLine } from "react-icons/ri";

interface UserSearchListProps {
	users?: Array<SearchedUsers>;
	empty: boolean;
}

const UserSearchList: React.FC<UserSearchListProps> = ({
	users = [],
	empty,
}) => {
	const { participants, addParticipant, removeParticipant } =
		useConversationModal();

	return (
		<>
			{users?.length === 0 ? (
				<Text className="w-full text-center mt-5 font-semibold">
					{empty ? "Search for users" : "No User Found"}
				</Text>
			) : (
				<Stack className="mt-5">
					{users.map((user) => {
						const exist = participants.some((elem) => elem.id === user.id);
						return (
							<Stack
								key={user.id}
								direction="row"
								className="items-center gap-4 py-2 px-4 rounded-lg hover:bg-white/5 transition"
							>
								<Avatar />
								<Flex className="w-full justify-between items-center">
									<Text>{user.username}</Text>

									<Button
										leftIcon={
											exist ? <RiUserUnfollowLine /> : <RiUserAddLine />
										}
										bg={exist ? "red.400" : "brand.100"}
										boxShadow={"base"}
										_hover={{
											bg: exist ? "red.400" : "brand.100",
											boxShadow: "lg",
										}}
										className="w-24"
										onClick={() => {
											if (exist) {
												removeParticipant(user);
											} else {
												addParticipant(user);
											}
										}}
									>
										{exist ? "Remove" : "Select"}
									</Button>
								</Flex>
							</Stack>
						);
					})}
				</Stack>
			)}
		</>
	);
};

export default UserSearchList;
