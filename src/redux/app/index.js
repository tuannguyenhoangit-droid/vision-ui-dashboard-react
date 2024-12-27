import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../futures/userSlice";
import symbolConfigSlice from "../futures/symbolConfigSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    symbolConfig: symbolConfigSlice,
  },
});
