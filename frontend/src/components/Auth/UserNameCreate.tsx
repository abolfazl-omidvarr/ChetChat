import React from "react";
import { Box, Button, Center, Input, Stack, Text } from "@chakra-ui/react";
import { signOut } from "next-auth/react";

type UserNameCreateProps = {
	username: string;
	setUsername: (e: string) => void;
	onSubmit: () => void;
	isLoading: boolean;
};

const UserNameCreate: React.FC<UserNameCreateProps> = ({
	username,
	setUsername,
	onSubmit,
	isLoading,
}) => {
	return (
		<>
			<Text className="text-3xl">Create a Username</Text>
			<Input
				placeholder="Enter the username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<div className="flex flex-row gap-2 w-full">
				<Button isLoading={isLoading} className="w-1/2" onClick={onSubmit}>
					Save
				</Button>
				<Button
					isDisabled={isLoading}
					className="w-1/2"
					onClick={() => signOut()}
				>
					Cancel
				</Button>
			</div>
		</>
	);
};

export default UserNameCreate;
