import { GraphQLContext, createUsernameResponse } from "../../util/types";

const resolvers = {
	Query: {
		searchUser: () => {},
	},
	Mutation: {
		createUsername: async (
			_parent: any,
			args: { username: string },
			context: GraphQLContext
		): Promise<createUsernameResponse> => {
			const { username } = args;
			const { prisma, session } = context;

			if (!session?.user) {
				return {
					error: "not authorized",
				};
			}

			const { id } = session.user;

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
	},
	// Subscription: {},
};

export default resolvers;
