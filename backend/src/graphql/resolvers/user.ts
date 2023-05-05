const resolvers = {
	Query: {
		searchUser: () => {},
	},
	Mutation: {
		createUsername: (
			_parent: any,
			args: { username: string },
			context: any
		) => {
			const { username } = args;
			console.log(context);
		},
	},
	// Subscription: {},
};

export default resolvers;
