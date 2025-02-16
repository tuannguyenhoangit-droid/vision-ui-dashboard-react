import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: "",
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMessage } = messageSlice.actions;

export default messageSlice.reducer;
