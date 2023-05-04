import { Button } from "@chakra-ui/react";
import { signOut } from "next-auth/react";

interface IChatProps {}

const Chat: React.FC<IChatProps> = ({}) => {
	return (
		<div>
			<Button onClick={() => signOut()}>Log Out</Button>
		</div>
	);
};

export default Chat;
