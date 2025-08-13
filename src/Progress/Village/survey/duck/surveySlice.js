import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	surveyloading: false,
	surveyParentLoader: false,
	surveyData: [],
	surveyDetails: [],
	surveyParent: [],
	paginateInfo: {},
	surveyPreview: {},
	surveyStatusDataFilter: [],
	statusValue: null,
	surveyProgressStatus: [],
	surveyProgressLoading: false,
	surveyProgressStatusValue: null,
	startDateValue: null,
	endDateValue: null,
	applySurveyFilter: false,
	surveyProgressStatusValueChildren: null,
	startDateValueChildren: null,
	endDateValueChildren: null,
	applySurveyFilterChildren: false,
};

export const SurveySlice = createSlice({
	name: 'survey',
	initialState,
	reducers: {
		setSurveyLoading: (state, action) => {
			state.surveyloading = action.payload;
		},
		setSurveyParentLoading: (state, action) => {
			state.surveyParentLoader = action.payload;
		},
		setSurveyProgressLoading: (state, action) => {
			state.surveyProgressLoading = action.payload;
		},
		fillSurveyData: (state, action) => {
			state.surveyData = action.payload;
		},
		fillSurveyDetails: (state, action) => {
			state.surveyDetails = action.payload;
		},
		fillSurveyStatusValue: (state, action) => {
			state.statusValue = action.payload;
		},
		
		fillSurveyStatusData: (state, action) => {
			state.surveyStatusDataFilter = action.payload;
		},
		fillSurveyParents: (state, action) => {
			state.surveyParent = action.payload;
			state.paginateInfo.total = action.payload.meta.last_page;
			state.paginateInfo.perPage = action.payload.meta.per_page;
			state.paginateInfo.totalPages = action.payload.meta.last_page;
			state.paginateInfo.page = action.payload.meta.current_page;
		},
		fillSurveyPreview: (state, action) => {
			state.surveyPreview = action.payload;
		},
		fillSurveyProgressStatus: (state, action) => {
			state.surveyProgressStatus = action.payload;
		},
		fillSurveyProgressStatusValue: (state, action) => {
			state.surveyProgressStatusValue = action.payload;
		},
		fillStartDateValue: (state, action) => {
			state.startDateValue = action.payload;
		},
		fillEndDateValue: (state, action) => {
			state.endDateValue = action.payload;
		},
		fillApplySurveyFilter: (state, action) => {
			state.applySurveyFilter = action.payload;
		},
		fillSurveyProgressStatusValueChildren: (state, action) => {
			state.surveyProgressStatusValueChildren = action.payload;
		},
		fillStartDateValueChildren: (state, action) => {
			state.startDateValueChildren = action.payload;
		},
		fillEndDateValueChildren: (state, action) => {
			state.endDateValueChildren= action.payload;
		},
		fillApplySurveyFilterChildren: (state, action) => {
			state.applySurveyFilterChildren = action.payload;
		},
	},
});

export const {
	setSurveyLoading,
	setSurveyParentLoading,
	fillSurveyData,
	fillSurveyDetails,
	fillSurveyParents,
	fillSurveyPreview,
	fillSurveyProgressStatusValue,
	fillSurveyStatusValue,
	fillSurveyStatusData,
	fillSurveyProgressStatus,
	setSurveyProgressLoading,
	fillStartDateValue,
	fillEndDateValue,
	fillApplySurveyFilter,
	fillSurveyProgressStatusValueChildren,
	fillStartDateValueChildren,
	fillEndDateValueChildren,
	fillApplySurveyFilterChildren
} = SurveySlice.actions;
export default SurveySlice.reducer;
