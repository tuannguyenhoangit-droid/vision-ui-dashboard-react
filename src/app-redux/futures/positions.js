import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
};

export const positionsSlice = createSlice({
    name: "positions",
    initialState,
    reducers: {
        setPositions: (state, action) => {
            state.data = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setPositions } = positionsSlice.actions;

export default positionsSlice.reducer;
