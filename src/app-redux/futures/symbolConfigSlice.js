import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const symbolConfigSlice = createSlice({
  name: "symbolConfig",
  initialState,
  reducers: {
    setSymbolConfigData: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSymbolConfigData } = symbolConfigSlice.actions;

export default symbolConfigSlice.reducer;
