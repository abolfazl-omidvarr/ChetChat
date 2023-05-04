import { Button, Center, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import { FcGoogle } from "react-icons/fc";

interface IAuthProps {
	session: Session | null;
	reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
	const [userName, setUserName] = useState("");

	const onSubmit = useCallback(async () => {
		try {
			////// create the userName
		} catch (error) {
			console.log("auth onSubmit error", error);
		}
	}, [userName]);

	return (
		<Center className="h-screen">
			<Stack className="items-center gap-5">
				{session ? (
					<>
						<Text className="text-3xl">Create a Username</Text>
						<Input
							placeholder="Enter the username"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
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
