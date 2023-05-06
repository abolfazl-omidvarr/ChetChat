import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: "credentials",
			credentials: {
				userMail: { label: "email or username", type: "text" },
				passwordForLogin: { label: "password", type: "password" },
			},
			//@ts-ignore
			async authorize(credentials) {
				if (!credentials?.userMail || !credentials?.passwordForLogin)
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
					credentials.passwordForLogin,
					existedUser.hashedPassword
				);
				if (!isCorrectPassword) throw new Error("Invalid Credentials");
				return existedUser;
			},
		}),
	],

	callbacks: {
		async session({ session, token, user }) {
			return { ...session, user: { ...session.user, ...user } };
		},
	},
	pages: {
		signIn: "/",
	},
	debug: process.env.NODE_ENV === "development",
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
