import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../futures/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});
