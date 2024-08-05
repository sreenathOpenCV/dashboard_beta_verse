import { createSlice } from '@reduxjs/toolkit';

export const sheetSelectionSlice = createSlice({
  name: 'sheetSelection',
  initialState: {
    selectedSheet: 'Black Friday SignUp',
    selectedSheetPath: 'Black%20Friday%20Signup',
  },
  reducers: {
    setSheetSelection: (state, action) => {
      state.selectedSheet = action.payload.selectedSheet;
      state.selectedSheetPath = action.payload.selectedSheetPath;
    },
  },
});

export const { setSheetSelection } = sheetSelectionSlice.actions;

export default sheetSelectionSlice.reducer;