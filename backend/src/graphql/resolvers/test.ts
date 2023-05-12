import { Prisma, User } from "@prisma/client";
import { GraphQLContext, createUsernameResponse } from "../../util/types";
import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import { getServerSession } from "next-auth";

const resolvers = {
	Query: {
		test: async (
			_parent: any,
			args: { a: string },
			context: GraphQLContext
		) => {
			const { a } = args;
			console.log(a);
			console.log(context.res.locals);
			return { success: true };
		},
	},
};
// Subscription: {},

export default resolvers;
