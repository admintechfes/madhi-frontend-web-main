import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  loading: true,
  EngagementDetails: {},
  ChangeLogData: [],
  paginateInfo: {}
}

export const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    fillEngagementScoreData: (state, action) => {
      state.EngagementDetails = action.payload
    },
    fillEngagementScoreChangeLogData: (state, action) => {
      state.ChangeLogData = action.payload,
      state.paginateInfo.total = action.payload.meta.total;
			state.paginateInfo.perPage = action.payload.meta.per_page;
			state.paginateInfo.totalPages = action.payload.meta.last_page;
			state.paginateInfo.page = action.payload.meta.current_page;
    }
  }
})
export const { setLoading, fillEngagementScoreData,fillEngagementScoreChangeLogData } = scoreSlice.actions;
export default scoreSlice.reducer;