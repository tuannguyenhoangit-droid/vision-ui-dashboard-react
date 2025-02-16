import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const rsiStrategyConfigSlice = createSlice({
  name: "rsiStrategyConfig",
  initialState,
  reducers: {
    setRsiStrategyConfig: (state, action) => {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRsiStrategyConfig } = rsiStrategyConfigSlice.actions;

export default rsiStrategyConfigSlice.reducer;
