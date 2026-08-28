import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  userInfoIsLoading: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfoLoading: (state, action) => {
      state.userInfoIsLoading = action.payload;
    },
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.userInfoIsLoading = false;
    },
    logout: (state) => {
      state.userInfo = null;
      state.userInfoIsLoading = false;
    }
  }
});

export const { setCredentials, logout, setUserInfoLoading } = authSlice.actions;

export default authSlice.reducer;
