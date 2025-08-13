import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  studentquizreportData: [],
  paginateInfo: {},
  totalParent: null,
  totalChild: null
}

export const studentquizreportSlice = createSlice({
  name: "studentquizreport",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    fillStudentQuizReport: (state, action) => {
      state.studentquizreportData = action.payload;
      state.paginateInfo.total = action.payload.meta.total;
      state.paginateInfo.perPage = action.payload.meta.per_page;
      state.paginateInfo.totalPages = action.payload.meta.last_page;
      state.paginateInfo.page = action.payload.meta.current_page;
    },
    fillTotalParent: (state, action) => {
      state.totalParent = action.payload
    },
    fillTotalChild: (state, action) => {
      state.totalChild = action.payload
    }

  }
})

export const { setLoading, fillStudentQuizReport, fillTotalParent, fillTotalChild } = studentquizreportSlice.actions;
export default studentquizreportSlice.reducer;