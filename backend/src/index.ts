import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { createServer } from "http";
import { PubSub } from "graphql-subscriptions";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";

import express from "express";

import * as dotenv from "dotenv";

import { getSession } from "next-auth/react";
import Jwt, { JwtPayload } from "jsonwebtoken";
import fetch from "node-fetch";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import { GraphQLContext, Session, TokenPayload } from "./util/types";
import { PrismaClient } from "@prisma/client";
import { isAuthMiddleWare } from "./middleWare/isAuth";
import cookieParser from "cookie-parser";
import { createAccessToken } from "./util/functions";

export const getServerSession = async (cookie: string) => {
	const res = await fetch(`${process.env.CLIENT_ORIGIN}/api/auth/session`, {
		headers: { cookie: cookie },
	});
	const session = await res.json();
	return session;
};

const main = async () => {
	const pubSub = new PubSub();
	const app = express();
	const httpServer = createServer(app);

	dotenv.config();

	const schema = makeExecutableSchema({ typeDefs, resolvers });

	const corsOption = {
		origin: process.env.CLIENT_ORIGIN,
		credentials: true,
	};

	const prisma = new PrismaClient();

	const wsServer = new WebSocketServer({
		server: httpServer,
		path: "/graphql",
	});

	const serverCleanup = useServer({ schema }, wsServer);

	const server = new ApolloServer({
		schema,
		introspection: true,
		csrfPrevention: true,
		cache: "bounded",
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
			{
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose();
						},
					};
				},
			},
		],
	});

	await server.start();

	app.use("/", cookieParser());

	app.use(
		"/graphql",
		cookieParser(),
		cors<cors.CorsRequest>(corsOption),
		bodyParser.json(),
		isAuthMiddleWare,
		expressMiddleware(server, {
			context: async ({ req, res }): Promise<GraphQLContext> => {
				const { tokenPayload } = res.locals;
				return { req, res, session: null, prisma, tokenPayload };
			},
		})
	);

	app.post("/refresh_token", async (req, res) => {
		// Cookies that have not been signed
		const token = req.cookies.jid;
		if (!token) {
			return res.send({ ok: false, accessToken: "" });
		}

		try {
			const payload: any = Jwt.verify(token, process.env.REFRESH_SECRET);
			const user = await prisma.user.findUnique({
				where: {
					id: payload.userId,
				},
			});
			if (!user) {
				return res.send({ ok: false, accessToken: "" });
			}
			return res.send({ ok: true, accessToken: createAccessToken(user) });
		} catch (error) {
			console.log(error);
		}
	});

	httpServer.listen(4000, () => {
		console.log("`🚀 Server listening at port 4000");
	});
};

main().catch((err) => console.log(err));
