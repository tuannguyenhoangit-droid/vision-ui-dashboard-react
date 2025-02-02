import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../futures/userSlice";
import symbolConfigSlice from "../futures/symbolConfigSlice";
import messageSlice from "../futures/messageSlice";
import transactionSlice from "../futures/transaction";
import subscriptionSlice from "../futures/subscription";
import positionsSlice from "../futures/positions";
import notificationSlice from "../futures/notificationSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    symbolConfig: symbolConfigSlice,
    message: messageSlice,
    transaction: transactionSlice,
    subscription: subscriptionSlice,
    positions: positionsSlice,
    notification: notificationSlice,
  },
});
