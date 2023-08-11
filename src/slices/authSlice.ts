import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../models/User";
import { Follower } from "../models/Follower";

export interface AuthSlice {
  setToken: string;
  isLoggedIn: boolean;
  setUser: User;
  allLikes: Follower[];
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
  allLikes: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initAuthState as AuthSlice,
  reducers: {
    setToken(state, { payload }) {
      state.setToken = payload;
    },

    setUser(state, { payload }) {
      state.setUser = payload;
    },

    allLikes(state, { payload }) {
      state.allLikes = payload;
    },
    isLoggedIn(state, { payload }) {
      state.isLoggedIn = payload;
    },
    resetState(state) {
      return { ...initAuthState };
    },
  },
});

export const authActions = authSlice.actions;
