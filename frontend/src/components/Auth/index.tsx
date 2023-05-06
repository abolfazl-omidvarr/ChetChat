"use client";
import { useState } from "react";
import { Center, Stack } from "@chakra-ui/react";
import { Session } from "next-auth";
import UserNameCreate from "./UserNameCreate";
import AccountCreate from "./AccountCreate";
import LogIn from "./LogIn";

interface IAuthProps {
	session: Session | null;
	reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
	const [logIn, setLogIn] = useState(false);

	const authComponent = !session ? (
		!logIn ? (
			<AccountCreate login={logIn} setLogin={setLogIn} />
		) : (
			<LogIn login={logIn} setLogin={setLogIn} />
		)
	) : (
		<UserNameCreate />
	);

	return (
		<Center className="h-screen">
			<Stack className="items-center">{authComponent}</Stack>
		</Center>
	);
};

export default Auth;
