import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  studentquizruleData: [],
  paginateInfo: {},
  studentquizrulegradeData: [],
  studentquizrulelanguageData: [],
  studentquizruletagsData: [],
  studentquizruleDetails: {},
  studentquizreportdata: [],
}

export const studentquizruleSlice = createSlice({
  name: "studentquizrule",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    fillStudentQuizRule: (state, action) => {
      state.studentquizruleData = action.payload;
      state.paginateInfo.total = action.payload.meta.total;
      state.paginateInfo.perPage = action.payload.meta.per_page;
      state.paginateInfo.totalPages = action.payload.meta.last_page;
      state.paginateInfo.page = action.payload.meta.current_page;
    },
    fillStudentQuizRuleGrade: (state, action) => {
      state.studentquizrulegradeData = action.payload
    },
    fillStudentQuizRuleLanguage: (state, action) => {
      state.studentquizrulelanguageData = action.payload
    },
    fillStudentQuizRuleTags: (state, action) => {
      state.studentquizruletagsData = action.payload
    },
    fillGetByIdStudentQuizRule: (state, action) => {
      state.studentquizruleDetails = action.payload
    },
    fillCertificateReportStatusData: (state, action) => {
      state.studentquizreportdata = action.payload
    },

  }
})

export const { setLoading, fillStudentQuizRule, fillStudentQuizRuleGrade, fillStudentQuizRuleLanguage, fillStudentQuizRuleTags, fillGetByIdStudentQuizRule, fillCertificateReportStatusData } = studentquizruleSlice.actions;
export default studentquizruleSlice.reducer;