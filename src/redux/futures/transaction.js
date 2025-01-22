import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pendingTransaction: null,

};

export const transactionSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setPendingTransaction: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.pendingTransaction = action.payload;
        },

        cancelPendingTransaction: () => {
            state.pendingTransaction = null;
        }
    },
});

// Action creators are generated for each case reducer function
export const { setPendingTransaction, cancelPendingTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;
