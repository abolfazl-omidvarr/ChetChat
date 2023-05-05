import { useMutation } from "@apollo/client";
import { Button, Center, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import { FcGoogle } from "react-icons/fc";

import userOperations from "@/graphql/operations/user";
import { CreateUsernameData, CreateUsernameVariable } from "@/util/types";

interface IAuthProps {
	session: Session | null;
	reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
	const [username, setUsername] = useState("");

	const [createUsername, { data, loading, error }] = useMutation<
		CreateUsernameData,
		CreateUsernameVariable
	>(userOperations.Mutations.createUsername);

	console.log(data, loading, error);

	const onSubmit = useCallback(async () => {
		if (!username) return;
		try {
			await createUsername({ variables: { username } });
		} catch (error) {
			console.log("auth onSubmit error", error);
		}
	}, [username]);

	console.log(session);

	return (
		<Center className="h-screen">
			<Stack className="items-center gap-5">
				{session ? (
					<>
						<Text className="text-3xl">Create a Username</Text>
						<Input
							placeholder="Enter the username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<Button onClick={onSubmit}>Save</Button>
					</>
				) : (
					<>
						<Text className="text-3xl">ChetChat Messenger</Text>
						<Button
							onClick={() => signIn("google")}
							leftIcon={<FcGoogle size={25} />}
						>
							Continue with Google
						</Button>
					</>
				)}
			</Stack>
		</Center>
	);
};

export default Auth;
