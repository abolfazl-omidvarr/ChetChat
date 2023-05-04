import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { createServer } from "http";
import { PubSub } from "graphql-subscriptions";
import gql from "graphql-tag";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";

import express from "express";

const pubSub = new PubSub();
const app = express();
const httpServer = createServer(app);

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

interface createNewEventInput {
	title: string;
	description: string;
}

// const typeDefs = gql`
// 	type NewsEvent {
// 		title: String
// 		description: String
// 	}
// 	type Query {
// 		placeholder: Boolean
// 	}
// 	type Mutation {
// 		createNewEvent(title: String, description: String): NewsEvent
// 	}
// 	type Subscription {
// 		newsFeed: NewsEvent
// 	}
// `;

// const resolvers = {
// 	Query: {
// 		placeholder: () => true,
// 	},
// 	Mutation: {
// 		createNewEvent: (_parent: any, args: createNewEventInput) => {
// 			console.log(args);

// 			pubSub.publish("EVENT_CREATED", { newsFeed: args });

// 			return args;
// 		},
// 	},
// 	Subscription: {
// 		newsFeed: {
// 			subscribe: () => pubSub.asyncIterator(["EVENT_CREATED"]),
// 		},
// 	},
// };

const main = async () => {
	const schema = makeExecutableSchema({ typeDefs, resolvers });

	const wsServer = new WebSocketServer({
		server: httpServer,
		path: "/graphql",
	});

	const serverCleanup = useServer({ schema }, wsServer);

	const server = new ApolloServer({
		schema,
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

	app.use(
		"/graphql",
		cors<cors.CorsRequest>(),
		bodyParser.json(),
		expressMiddleware(server)
	);

	httpServer.listen(4000, () => {
		console.log("server is running");
	});
};

main().catch((err) => console.log(err));
