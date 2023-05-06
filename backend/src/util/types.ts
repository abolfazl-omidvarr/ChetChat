import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { ISODateString } from "next-auth";

export interface GraphQLContext {
	session: Session | null;
	prisma: PrismaClient;
	// pubsub: PubSub;
}

/**
 * Users
 */
export interface Session {
	user?: User;
	expires: ISODateString;
}
export interface User {
	id: string;
	email: string;
	image: string;
	userName?: string | null;
	name: string;
	emailVerified?: boolean | null;
	hashedPassword?: string | null;
}

export interface createUsernameResponse {
	success?: boolean;
	error?: string;
}
