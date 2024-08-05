import { createSlice } from '@reduxjs/toolkit';

const bootcampProgramSlice = createSlice({
  name: 'bootcampProgram',
  initialState: {
    seriesData: [], 
  },
  reducers: {
    setSeriesData(state, action) {
      state.seriesData = [...state.seriesData, ...action.payload]; 
    },
    setDeleteItem(state, action) {
      const deleteStrings = action.payload;
      state.seriesData = state.seriesData.filter(item => {
        const matched = item.name.some(name => deleteStrings.includes(name));
        return !matched;
      });
    },
    setDeleteBase(state){
      state.seriesData = []
    }
  },
});

export const { setSeriesData, setDeleteItem, setDeleteBase } = bootcampProgramSlice.actions;
export default bootcampProgramSlice.reducer;
