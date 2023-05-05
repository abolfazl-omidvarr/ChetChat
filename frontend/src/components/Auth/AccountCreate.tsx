import React from "react";
import { Button, Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

type AccountCreateProps = {};

const AccountCreate: React.FC<AccountCreateProps> = () => {
	return (
		<>
			<Text className="text-3xl">ChetChat Messenger</Text>
			<Button
				onClick={() => signIn("google")}
				leftIcon={<FcGoogle size={25} />}
			>
				Continue with Google
			</Button>
		</>
	);
};

export default AccountCreate;
