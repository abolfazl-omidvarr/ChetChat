import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { decode, encode } from "next-auth/jwt";
import bcrypt from "bcrypt";
import Cookies from "cookies";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";

import prisma from "@/libs/prismadb";

export const authOptionsWrapper = (req: any, res: any) => [
	req,
	res,
	{
		providers: [
			GoogleProvider({
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			}),
			CredentialsProvider({
				name: "credentials",
				credentials: {
					userMail: { label: "email or username", type: "text" },
					password: { label: "password", type: "password" },
				},
				authorize: async (credentials) => {
					try {
						if (!credentials?.userMail || !credentials?.password)
							throw new Error("Invalid Credentials");
						// find the user
						const userWithEmail = await prisma.user.findUnique({
							where: {
								email: credentials?.userMail,
							},
						});

						const userWithUsername = await prisma.user.findUnique({
							where: {
								username: credentials?.userMail,
							},
						});

						const existedUser = userWithEmail || userWithUsername;

						// check if user exists
						if (!existedUser || !existedUser?.hashedPassword)
							throw new Error("Invalid Credentials");
						const isCorrectPassword = await bcrypt.compare(
							credentials.password,
							existedUser.hashedPassword
						);
						if (!isCorrectPassword) throw new Error("Invalid Credentials");
						return existedUser as any;
					} catch (error) {
						console.error(error);

						if (
							error instanceof Prisma.PrismaClientInitializationError ||
							error instanceof Prisma.PrismaClientKnownRequestError
						) {
							throw new Error("System error. Please contact support@---.io");
						}

						throw error;
					}
				},
			}),
		],
		callbacks: {
			async signIn({ user }: any) {
				if (
					req.query.nextauth.includes("callback") &&
					req.query.nextauth.includes("credentials") &&
					req.method === "POST"
				) {
					if (user) {
						const sessionToken = randomUUID();
						const sessionExpiry = new Date(
							Date.now() + 60 * 60 * 24 * 30 * 1000
						); // 30 days

						await prisma.session.create({
							data: {
								sessionToken: sessionToken,
								userId: user.id,
								expires: sessionExpiry,
							},
						});

						const cookies = new Cookies(req, res);

						cookies.set("next-auth.session-token", sessionToken, {
							expires: sessionExpiry,
						});
					}
				}

				return true;
			},
			async session({ session, user }) {
				return { ...session, user: { ...session.user, ...user } };
			},
		},
		secret: process.env.AUTH_SECRET,
		jwt: {
			maxAge: 60 * 60 * 24 * 30,
			encode: async ({ token, secret, maxAge }: any) => {
				if (
					req.query.nextauth?.includes("callback") &&
					req.query.nextauth.includes("credentials") &&
					req.method === "POST"
				) {
					const cookies = new Cookies(req, res);
					const cookie = cookies.get("next-auth.session-token");

					if (cookie) return cookie;
					return "";
				}

				return encode({ token, secret, maxAge });
			},
			decode: async ({ token, secret }: any) => {
				if (
					req.query.nextauth.includes("callback") &&
					req.query.nextauth.includes("credentials") &&
					req.method === "POST"
				) {
					return null;
				}
				return decode({ token, secret });
			},
		},
		adapter: PrismaAdapter(prisma),
		debug: process.env.NODE_ENV === "development",
		events: {
			async signOut({ session }) {
				//@ts-ignore
				const { sessionToken } = session;

				const data = await prisma.session.findUnique({
					where: {
						sessionToken,
					},
				});

				if (data) {
					await prisma.session.delete({
						where: {
							sessionToken,
						},
					});
				}
			},
		},
		pages: {
			signIn: "/",
		},
	} as AuthOptions,
];

export default async function handler(req: any, res: any) {
	//@ts-ignore
	return await NextAuth(...authOptionsWrapper(req, res));
}
