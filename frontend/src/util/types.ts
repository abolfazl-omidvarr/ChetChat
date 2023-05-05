export interface CreateUsernameData {
	createUsername: {
		success: boolean;
		error: string;
	};
}

export interface CreateUsernameVariable {
	username: string;
}

export interface SearchUserInput {
	username: string;
}

export interface SearchUserData {
	searchUser: Array<SearchedUser>;
}

export interface SearchedUser {
	id: string;
	username: string;
}
