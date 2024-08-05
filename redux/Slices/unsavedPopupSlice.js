// unsavedPopupSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unsaved: false,
};

const unsavedPopupSlice = createSlice({
  name: "unsavedPopup",
  initialState,
  reducers: {
    setUnsavedChanges: (state, action) => {
      state.unsaved = action.payload;
    },
  },
});

export const { setUnsavedChanges } = unsavedPopupSlice.actions;

export default unsavedPopupSlice.reducer;
