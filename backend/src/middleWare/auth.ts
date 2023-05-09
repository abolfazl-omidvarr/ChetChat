import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

const auth = async () => {
	const token2 = jwt.sign({ foo: "bar" }, process.env.JWT_PRIVATE);

	console.log(token2);
	// if (!token) return null;
	const user = jwt.verify(token2, process.env.JWT_PRIVATE);

	console.log(user);
};

export default auth;
