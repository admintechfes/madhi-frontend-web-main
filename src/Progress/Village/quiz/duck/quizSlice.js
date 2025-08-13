import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  quizloading: false,
  quizsData: [],
  quizDetails: [],
  statusData: [],
  statusValue: null,
  startDateValue: null,
  endDateValue: null,
  quizParentsData: [],
  quizChildrenData: [],
  quizstatusData: [],
  quizstatusValue: null,
  quizwhatsappstatusData: [],
  quizwhatsappstatusValue: null,
  quizsmsstatusData: [],
  quizsmsstatusValue: null,
  paginateInfo: {},
  childrenpaginateInfo: {},
  quizpreview: []
};

export const QuizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuizLoading: (state, action) => {
      state.quizloading = action.payload;
    },
    fillQuizData: (state, action) => {
      state.quizsData = action.payload;
    },
    fillQuizDetails: (state, action) => {
      state.quizDetails = action.payload
    },
    fillQuizStatusData: (state, action) => {
      state.statusData = action.payload
    },
    fillQuizStatusValue: (state, action) => {
      state.statusValue = action.payload
    },
    fillQuizParents: (state, action) => {
      state.quizParentsData = action.payload;
      state.paginateInfo.total = action.payload.meta.total;
      state.paginateInfo.perPage = action.payload.meta.per_page;
      state.paginateInfo.totalPages = action.payload.meta.last_page;
      state.paginateInfo.page = action.payload.meta.current_page;
    },
    fillQuizChildren: (state, action) => {
      state.quizChildrenData = action.payload;
      state.childrenpaginateInfo.total = action.payload.meta.total;
      state.childrenpaginateInfo.perPage = action.payload.meta.per_page;
      state.childrenpaginateInfo.totalPages = action.payload.meta.last_page;
      state.childrenpaginateInfo.page = action.payload.meta.current_page;
    },
    fillQuizProgresStatusData: (state, action) => {
      state.quizstatusData = action.payload
    },
    fillQuizProgresStatusValue: (state, action) => {
      state.quizstatusValue = action.payload
    },
    fillQuizProgresWhatsAppStatusData: (state, action) => {
      state.quizwhatsappstatusData = action.payload
    },
    fillQuizProgresWhatsAppStatusValue: (state, action) => {
      state.quizwhatsappstatusValue = action.payload
    },
    fillQuizProgresSMSStatusData: (state, action) => {
      state.quizsmsstatusData = action.payload
    },
    fillQuizProgresSMSStatusValue: (state, action) => {
      state.quizsmsstatusValue = action.payload
    },
    fillQuizStartDateValue: (state, action) => {
      state.startDateValue = action.payload
    },
    fillQuizEndDateValue: (state, action) => {
      state.endDateValue = action.payload
    },
    fillQuizPreview: (state, action) => {
      state.quizpreview = action.payload
    }
  },
});

export const { setQuizLoading, fillQuizData, fillQuizDetails, fillQuizStatusData, fillQuizStatusValue, fillQuizParents, fillQuizChildren, fillQuizProgresStatusData, fillQuizProgresStatusValue, fillQuizProgresWhatsAppStatusData, fillQuizProgresWhatsAppStatusValue, fillQuizProgresSMSStatusData, fillQuizProgresSMSStatusValue, fillQuizStartDateValue, fillQuizEndDateValue, fillQuizPreview } = QuizSlice.actions;
export default QuizSlice.reducer;
