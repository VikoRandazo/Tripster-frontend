import { configureStore } from "@reduxjs/toolkit";
import { AuthSlice, authSlice } from "../slices/authSlice";

export interface StoreRootTypes {
    auth:AuthSlice
  }
  
  export const store = configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
    },
  });