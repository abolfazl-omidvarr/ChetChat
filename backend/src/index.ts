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
import fetch from "node-fetch";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import { GraphQLContext, Session } from "./util/types";
import { PrismaClient } from "@prisma/client";
import { isAuthMiddleWare } from "./middleWare/isAuth";
import cookieParser from "cookie-parser";

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
				return { req, res, session: null, prisma };
			},
		})
	);

	app.post("/refresh_token", (req, res) => {
		// Cookies that have not been signed
		const token = req.cookies.jid;
		if (!token) {
			return res.send({ ok: false, accessToken: "" });
		}

		try {
			
		} catch (error) {
			
		}

		// Cookies that have been signed
		console.log("Signed Cookies: ", req.signedCookies);
	});

	httpServer.listen(4000, () => {
		console.log("`🚀 Server listening at port 4000");
	});
};

main().catch((err) => console.log(err));
