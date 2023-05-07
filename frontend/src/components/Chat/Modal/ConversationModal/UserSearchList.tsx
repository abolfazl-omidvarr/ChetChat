import { SearchedUsers } from "@/util/types";
import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Flex, Stack, Text } from "@chakra-ui/layout";

interface UserSearchListProps {
	users?: Array<SearchedUsers>;
}

const UserSearchList: React.FC<UserSearchListProps> = ({ users = [] }) => {
	console.log(users);
	return (
		<>
			{users?.length === 0 ? (
				<Text className="w-full text-center mt-5 font-semibold">
					No User Found
				</Text>
			) : (
				<Stack className="mt-5">
					<hr />
					{users.map((user) => (
						<Stack
							key={user.id}
							direction="row"
							className="items-center gap-4 py-2 px-4 rounded-lg hover:bg-white/5 transition"
						>
							<Avatar />
							<Flex className="w-full justify-between items-center">
								<Text>{user.username}</Text>
								<Button>Select</Button>
							</Flex>
						</Stack>
					))}
				</Stack>
			)}
		</>
	);
};

export default UserSearchList;
