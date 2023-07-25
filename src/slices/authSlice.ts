import { createSlice } from "@reduxjs/toolkit";
import { User } from "../models/User";

export interface AuthSlice {
  setToken: string;
  isLoggedIn: boolean;
  setUser: User;
}

const initAuthState = {
  setToken: "",
  isLoggedIn: false,
  setUser: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initAuthState,
  reducers: {
    setToken(state, {payload}) {
      state.setToken = payload
    },

    setUser(state, { payload }) {
      state.setUser = payload
    },

    isLoggedIn (state, {payload}) {
      state.isLoggedIn = payload
    }
  },
});

export const authActions = authSlice.actions;
