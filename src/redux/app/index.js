import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../futures/userSlice";
import symbolConfigSlice from "../futures/symbolConfigSlice";
import messageSlice from "../futures/messageSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    symbolConfig: symbolConfigSlice,
    message: messageSlice,
  },
});
