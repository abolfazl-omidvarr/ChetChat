import { User } from "@prisma/client";
import { GraphQLContext, createUsernameResponse } from "../../util/types";
import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";

const resolvers = {
	Query: {
		searchUsers: async (
			_parent: any,
			args: { username: string },
			context: GraphQLContext
		): Promise<Array<User>> => {
			const { username: searchedUsername } = args;
			const { session, prisma } = context;

			if (!session?.user) {
				throw new GraphQLError(
					"You are not authorized to perform this action.",
					{
						extensions: {
							code: "UNAUTHENTICATED",
						},
					}
				);
			}

			const {
				//@ts-ignore
				user: { username: myUsername },
			} = session;

			try {
				const foundUsersByUsername = await prisma.user.findMany({
					where: {
						username: {
							contains: searchedUsername,
							not: myUsername,
							mode: "insensitive",
						},
					},
				});
				const foundUsersByEmail = [
					await prisma.user.findUnique({
						where: {
							email: searchedUsername,
						},
					}),
				];

				console.log(foundUsersByEmail);

				const foundUser =
					foundUsersByUsername.length === 0
						? foundUsersByEmail
						: foundUsersByUsername;

				// console.log(foundUser)

				return foundUser;
			} catch (error) {
				throw new GraphQLError("something went wrong: " + error);
			}
		},
	},
	Mutation: {
		createUsername: async (
			_parent: any,
			args: { username: string },
			context: GraphQLContext
		): Promise<createUsernameResponse> => {
			const { username } = args;
			console.log(args);
			const { prisma, session } = context;

			if (!session?.user) {
				return {
					error: "not authorized",
				};
			}

			const { id } = session.user;
			console.log(session);

			try {
				//check uniqueness of username in database
				const existingUSer = await prisma.user.findUnique({
					where: {
						username,
					},
				});

				if (existingUSer) {
					return {
						error: "This username is already taken",
					};
				}
				//update user

				const updatedUser = await prisma.user.update({
					where: {
						id,
					},
					data: {
						username,
					},
				});

				return { success: true };
			} catch (error: any) {
				console.log("create username failed: ", error);
				return {
					error: error?.message,
				};
			}
		},
		createUser: async (
			_parent: any,
			args: { username: string; password: string; email: string },
			context: GraphQLContext
		): Promise<createUsernameResponse> => {
			const { username, password, email } = args;
			const { prisma, session } = context;

			const hashedPassword = await bcrypt.hash(password, 12);

			try {
				//check uniqueness of username in database
				const existingUsername = await prisma.user.findUnique({
					where: {
						username,
					},
				});
				const existingEmail = await prisma.user.findUnique({
					where: {
						email,
					},
				});

				if (existingUsername) {
					return {
						error: "This username is already taken",
					};
				}
				if (existingEmail) {
					return {
						error: "This email is already taken",
					};
				}
				//update user

				await prisma.user.create({
					data: {
						email,
						username,
						hashedPassword,
					},
				});

				return { success: true };
			} catch (error: any) {
				return {
					error: "Account creation failed, maybe try different inputs",
				};
			}
		},
	},
	// Subscription: {},
};

export default resolvers;
