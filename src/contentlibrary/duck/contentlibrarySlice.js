import { createSlice } from '@reduxjs/toolkit';
import { setSelectedQuestionnaire } from '../../UnitContent/duck/unitContentSlice';

const initialState = {
	contentListLoading: true,
	contentList: [],
	tagsData: [],
	paginateInfo: {},
	contentdetails: [],
	createdData: [],
	tagsValue: [],
	createdbyValue: '',
	fromValue: null,
	toValue: null,
	answerFormatValue: '',
	answerTypeValue: '',
	pageNum: 1,
	perPageNum: 10,
	tabData: '',
	storeTabs: 0,
	selectedQuestion: [],
};

export const ContentLibrarySlice = createSlice({
	name: 'contentlibrary',
	initialState,
	reducers: {
		fillContentList: (state, action) => {
			state.contentList = action.payload;
			state.paginateInfo.total = action.payload.meta.total;
			state.paginateInfo.perPage = action.payload.meta.per_page;
			state.paginateInfo.totalPages = action.payload.meta.last_page;
			state.paginateInfo.page = action.payload.meta.current_page;
		},
		setContentListingLoading: (state, action) => {
			state.contentListLoading = action.payload;
		},
		fillContentLibraryDetails: (state, action) => {
			state.contentdetails = action.payload;
		},
		fillTags: (state, action) => {
			state.tagsData = action.payload;
		},
		fillCreatedUser: (state, action) => {
			state.createdData = action.payload;
		},
		fillTagsValue: (state, action) => {
			state.tagsValue = action.payload;
		},
		fillCreatedByValue: (state, action) => {
			state.createdbyValue = action.payload;
		},
		fillFromValue: (state, action) => {
			state.fromValue = action.payload;
		},
		fillToValue: (state, action) => {
			state.toValue = action.payload;
		},
		fillAnswerFormatValue: (state, action) => {
			state.answerFormatValue = action.payload;
		},
		fillAnswerTypeValue: (state, action) => {
			state.answerTypeValue = action.payload;
		},
		fillPageNumContentLibrary: (state, action) => {
			state.pageNum = action.payload;
		},
		fillPerPageNumContent: (state, action) => {
			state.perPageNum = action.payload;
		},
		fillTabSucess: (state, action) => {
			state.tabData = action.payload;
		},
		fillStoreTabs: (state, action) => {
			state.storeTabs = action.payload;
		},
		setSelectedQuestion: (state, action) => {
			state.selectedQuestion = action.payload.selectedData
			if (action.payload.uuid) {
				state.selectedQuestion = state.selectedQuestion.filter((item) => item.uuid !== action.payload.uuid)
			}
		},
		clearSelectedQuestion: (state, action) => {
			state.selectedQuestion = [];
		},
	},
});

export const {
	setContentListingLoading,
	fillContentList,
	fillCreatedUser,
	fillContentLibraryDetails,
	fillTags,
	fillTagsValue,
	fillCreatedByValue,
	fillFromValue,
	fillToValue,
	fillAnswerFormatValue,
	fillAnswerTypeValue,
	fillPageNumContentLibrary,
	fillPerPageNumContent,
	fillTabSucess,
	fillStoreTabs,
	setSelectedQuestion,
	clearSelectedQuestion,
} = ContentLibrarySlice.actions;
export default ContentLibrarySlice.reducer;
