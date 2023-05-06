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

export interface CreateUsernameVariable {
	username: string;
}
export interface CreateUserVariable {
	username: string;
	email: string;
	password: string;
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
