import { Prisma, User } from "@prisma/client";
import { GraphQLContext, createUsernameResponse } from "../../util/types";
import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import { getServerSession } from "next-auth";

const resolvers = {
	Query: {
		__: async (
			_parent: any,
			args: { username: string },
			context: GraphQLContext
		) => {},
	},
	Mutation: {
		createConversation: async (
			_parent: any,
			args: { participantIds: Array<string> },
			context: GraphQLContext
		): Promise<{ conversationId: string }> => {
			const { session, prisma } = context;
			const { participantIds } = args;

			if (!session?.user) {
				throw new GraphQLError("Not Authorized");
			}

			const {
				user: { id: userId },
			} = session;

			try {
				const conversation = await prisma.conversation.create({
					data: {
						participants: {
							createMany: {
								data: participantIds.map((id) => ({
									userId: id,
									hasSeenLatestMassage: id === userId,
								})),
							},
						},
					},
					include: conversationPopulated,
				});
				return { conversationId: conversation.id };
			} catch (error) {
				console.log(error);
				throw new GraphQLError(
					"Create conversation has encountered an error: ",
					error
				);
			}
		},
	},
	// Subscription: {},
};

export const participantPopulated =
	Prisma.validator<Prisma.ConversationParticipantInclude>()({
		user: {
			select: {
				id: true,
				username: true,
			},
		},
	});

export const conversationPopulated =
	Prisma.validator<Prisma.ConversationInclude>()({
		participants: {
			include: participantPopulated,
		},
		latestMessage: {
			include: {
				sender: {
					select: {
						id: true,
						username: true,
					},
				},
			},
		},
	});

export default resolvers;
