import { createSlice } from '@reduxjs/toolkit';
import WorkshopPreview from '../workshopPreview';

const initialState = {
	workshopData: [],
	statusValue: null,
	workshopDetails: [],
	workshopSessionDetails:{},
	workshopSessionsList: [],
	paginateInfo: {},
	paginateInfoQuiz: {},
	sessionList: [],
	sessionStatus: null,
	quizStatus: [],
	quizAttendance: [],
	workshopSessionStatusList:[],
	workshopSessionQuizList:[],
	workshopPreviewForm:[],
	workshopPreviewQuiz:[],
	workshopSessionQuizStatusList: [],
	workshopSessionQuizStatusValue: null,
	workshopSessionQuizAttendanceList: [],
	workshopSessionQuizAttendanceValue: null,
	workshopSessionFilter:false,
	workshopChildList:[]

};

export const WorkshopSlice = createSlice({
	name: 'workshop',
	initialState,
	reducers: {
		fillWorkshopData: (state, action) => {
			state.workshopData = action.payload;
		},
		fillWorkshopStatusValue: (state, action) => {
			state.statusValue = action.payload;
		},
		fillWorkshopSessionQuizStatusValue: (state, action) => {
			state.workshopSessionQuizStatusValue = action.payload;
		},
		fillWorkshopSessionQuizAttendanceValue: (state, action) => {
			state.workshopSessionQuizAttendanceValue = action.payload;
		},
		fillWorkshopDetails: (state, action) => {
			state.workshopDetails = action.payload;
		},
		fillWorkshopSessionDetails: (state, action) => {
			state.workshopSessionDetails = action.payload;
		},
		fillWorkshopPreviewForm: (state, action) => {
			state.workshopPreviewForm = action.payload;
		},
		fillWorkshopPreviewQuiz: (state, action) => {
			state.workshopPreviewQuiz = action.payload;
		},
		fillWorkshopSessions: (state, action) => {
			state.workshopSessionsList = action.payload;
			state.paginateInfo.total = action.payload.meta.last_page;
			state.paginateInfo.perPage = action.payload.meta.per_page;
			state.paginateInfo.totalPages = action.payload.meta.last_page;
			state.paginateInfo.page = action.payload.meta.current_page;
		},
		fillSessionValue: (state, action) => {
			state.sessionStatus = action.payload;
		},
		fillWorkshopSessionFilter: (state, action) => {
			state.workshopSessionFilter = action.payload;
		},
		fillWorkshopSessionStatusList:(state, action) => {
			state.workshopSessionStatusList = action.payload;
		},
		fillWorkshopSessionQuizStatusList:(state, action) => {
			state.workshopSessionQuizStatusList = action.payload;
		},
		fillWorkshopSessionQuizAttendanceList:(state, action) => {
			state.workshopSessionQuizAttendanceList = action.payload;
		},
		fillWorkshopSessionQuizList:(state, action) => {
			state.workshopSessionQuizList = action.payload;
			state.paginateInfoQuiz.total = action.payload.meta.last_page;
			state.paginateInfoQuiz.perPage = action.payload.meta.per_page;
			state.paginateInfoQuiz.totalPages = action.payload.meta.last_page;
			state.paginateInfoQuiz.page = action.payload.meta.current_page;
		},
		fillWorkshopChildList:(state, action) => {
			state.workshopChildList = action.payload;
			state.paginateInfoQuiz.total = action.payload.meta.last_page;
			state.paginateInfoQuiz.perPage = action.payload.meta.per_page;
			state.paginateInfoQuiz.totalPages = action.payload.meta.last_page;
			state.paginateInfoQuiz.page = action.payload.meta.current_page;
		}
	},
});

export const { fillWorkshopChildList,fillWorkshopData, fillWorkshopSessionFilter,fillWorkshopStatusValue,fillWorkshopSessionQuizStatusList, fillWorkshopSessionDetails,fillWorkshopDetails, fillWorkshopSessions,fillSessionValue,fillWorkshopSessionStatusList,fillWorkshopSessionQuizList,fillWorkshopPreviewForm,fillWorkshopPreviewQuiz ,fillWorkshopSessionQuizAttendanceList,fillWorkshopSessionQuizAttendanceValue,fillWorkshopSessionQuizStatusValue} = WorkshopSlice.actions;
export default WorkshopSlice.reducer;
