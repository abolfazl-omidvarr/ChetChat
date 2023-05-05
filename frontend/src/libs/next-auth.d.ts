import "next-auth";

declare module "next-auth" {
	interface Session {
		user: User;
	}
	interface User {
		id: string;
		userName: string;
		image: string;
	}
}