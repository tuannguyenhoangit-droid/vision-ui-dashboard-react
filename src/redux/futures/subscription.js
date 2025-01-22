import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    current: "",
    data: [],
    checkout: {
        subscription: null,
        priceType: null
    }
};

export const subscriptionSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setSubscription: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.data = action.payload.data;
            state.current = action.payload.current;
        },
        checkoutSubscription: (state, action) => {
            state.checkout.subscription = action.payload;
            state.checkout.priceType = action.payload.prices[0];
        },
        checkoutPriceType: (state, action) => {
            state.checkout.priceType = action.payload;
        }
    },
});

// Action creators are generated for each case reducer function
export const { setSubscription, checkoutSubscription, checkoutPriceType } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
