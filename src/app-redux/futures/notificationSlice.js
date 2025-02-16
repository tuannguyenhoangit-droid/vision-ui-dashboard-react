import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  page: 1,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.data = action.payload.data;
      state.page = action.payload.page;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
