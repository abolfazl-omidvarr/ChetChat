import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		userId: null,
		token: null,
	},
	reducers: {
		setCredentials: (state, action) => {
			const { userId, accessToken } = action.payload;
			state.userId = userId;
			state.token = accessToken;
		},
		logOut: (state) => {
			state.userId = null;
			state.token = null;
		},
	},
});

export default authSlice;
