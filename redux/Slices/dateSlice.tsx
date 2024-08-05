import { createSlice } from '@reduxjs/toolkit';

const dateSlice = createSlice({
  name: 'DateSlice',
  initialState: {
    selected: [],
  },
  reducers: {
    setDate(state, action) {
      state.selected = action.payload;
    },
  },
});

export const { setDate } = dateSlice.actions;
export default dateSlice.reducer;
