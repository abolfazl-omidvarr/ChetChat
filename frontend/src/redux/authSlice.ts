import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: null,
    username: null,
    name: null,
    image: null,
    email: null,
    token: null,
  },
  reducers: {
    setTokenAndId: (state, action) => {
      const { userId, accessToken } = action.payload;
      console.log(action.payload);
      state.userId = userId;
      state.token = accessToken;
    },
    setUserInfo: (state, action) => {
      const { name, image, email, username } = action.payload;

      state.username = username || null;
      state.email = email;
      state.image = image || null;
      state.name = name || null;
    },
    logOut: (state) => {
      state.userId = null;
      state.token = null;
      state.username = null;
      state.email = null;
      state.image = null;
      state.name = null;
    },
  },
});

export default authSlice;
