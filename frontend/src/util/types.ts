export interface CreateUsernameData {
	createUsername: {
		success: boolean;
		error: string;
	};
}
export interface CreateUserData {
	createUser: {
		success: boolean;
		error: string;
	};
}

export interface LoginUserData {
	loginUser: {
		success: boolean;
		error: string;
		accessToken: string;
		userId: string;
	};
}

export interface CreateUsernameVariable {
	username: string;
}
export interface CreateUserVariable {
	username: string;
	email: string;
	password: string;
}
export interface LoginUserVariable {
	userMail: string;
	password: string;
}
export interface SearchUserInput {
	username: string;
}

export interface SearchUserData {
	searchUsers: Array<SearchedUsers>;
}

export interface SearchedUsers {
	id: string;
	username: string;
}
export interface LogOutData {
	success: boolean;
	error: string;
}
export interface getCurrentUserData {
	name?: string;
	email: string;
	username?: string;
	image?: string;
}

///////////////////////////////////conversations

export interface CreateConversationData {
	createConversation: {
		conversationId: string;
	};
}

export interface CreateConversationInput {
	participantIds: Array<string>;
}

//////////////////////////////////////test

export interface testData {
	test: {
		success: boolean;
		error: string;
	};
}

export interface testInput {
	a: string;
}
