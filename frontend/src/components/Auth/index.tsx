import { useMutation } from "@apollo/client";
import { Center, Stack } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

import userOperations from "@/graphql/operations/user";
import { CreateUsernameData, CreateUsernameVariable } from "@/util/types";

import UserNameCreate from "./UserNameCreate";
import AccountCreate from "./AccountCreate";

interface IAuthProps {
	session: Session | null;
	reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
	const [username, setUsername] = useState("");
	const [logIn, setLogIn] = useState(false);

	const [createUsername, { loading }] = useMutation<
		CreateUsernameData,
		CreateUsernameVariable
	>(userOperations.Mutations.createUsername);

	const onSubmitUsername = useCallback(async () => {
		if (!username) return;
		try {
			const { data } = await createUsername({ variables: { username } });
			if (!data?.createUsername) {
				throw new Error("something went wrong");
			}
			if (data.createUsername.error) {
				const {
					createUsername: { error },
				} = data;
				throw new Error(error);
			}

			toast.success("Username successfully set! 🔥");

			reloadSession();
		} catch (error: any) {
			toast.error("username set failed: " + error?.message);
			console.log("username set failed", error);
		}
	}, [username]);

	return (
		<Center className="h-screen">
			<Stack className="items-center">
				{session ? (
					<UserNameCreate
						isLoading={loading}
						username={username}
						setUsername={setUsername}
						onSubmit={onSubmitUsername}
					/>
				) : (
					<AccountCreate />
				)}
			</Stack>
		</Center>
	);
};

export default Auth;
