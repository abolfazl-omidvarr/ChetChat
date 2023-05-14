import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { ISODateString } from "next-auth";
import { Response, Request } from "express";

export interface googleUser {
	email: string;
	email_verified: boolean;
	name: string;
	picture: string;
	given_name: string;
	family_name: string;
}

export interface GraphQLContext {
	session: Session | null;
	prisma: PrismaClient;
	req: Request;
	res: Response;
	tokenPayload: TokenPayload;
}

export interface TokenPayload {
	payload: {
		userId: string;
		iat: number;
		exp: number;
	};
	status: string;
}

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

export interface loginUserResponse {
	success?: boolean;
	error?: string;
	accessToken?: string;
	userId?: string;
}

export interface getCurrentUserResponse {
	name: string | null;
	email: string | null;
	username: string | null;
	image: string | null;
}
