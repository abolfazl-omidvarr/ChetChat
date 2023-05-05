import { PubSub } from "graphql-subscriptions";
import { Session } from "next-auth";

export interface GraphQLContext {
	session: Session | null;
	// pubsub: PubSub;
	// prisma
}
