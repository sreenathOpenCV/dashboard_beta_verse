import { createSlice } from '@reduxjs/toolkit';

const bootcampSelectivesSlice = createSlice({
  name: 'bootcampSource',
  initialState: {
    selected: {},
    optionsData: {}, 
  },
  reducers: {
    setSelectedParams(state, action) {
      state.selected = action.payload;
    },
    setOptionsData(state, action) {
      state.optionsData = [...state.optionsData, ...action.payload]; 
    },
  },
});

export const { setSelectedParams, setOptionsData } = bootcampSelectivesSlice.actions;
export default bootcampSelectivesSlice.reducer;