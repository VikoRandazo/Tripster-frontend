import { configureStore } from "@reduxjs/toolkit";
import { AuthSlice, authSlice } from "../slices/authSlice";
import { VacationsSlice, vacationsSlice } from "../slices/vacationsSlice";

export interface StoreRootTypes {
  auth: AuthSlice;
  vacations: VacationsSlice;
}

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [vacationsSlice.name]: vacationsSlice.reducer,
  },
});
