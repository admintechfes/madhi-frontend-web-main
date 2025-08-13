import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	programListLoading: false,
	programDetailLoading: true,
	programUpdateDetailLoading: true,
	programCreateLoading: false,
	programList: [],
	programDetails: {},
	programUnitProgressList: [],
	paginateInfo: {},
	progressPaginateInfo: {},
	programToggleLoading: false,
	programUnitToggleLoading: false,
	selectedProgramStatus: "all",
	paginationPage: 1,
	programfilterDistrict: "",
	programfilterBlock: "",
	programfilterPanchayat: "",
	programfilterVillage: "",
	programfilterStatus: "",
	applyFilter: false,
	programUnitProgressVillageList: [],
	programUnitProgressVillagePaginate: {}

};

export const programSlice = createSlice({
	name: 'program',
	initialState,
	reducers: {
		fillProgramList: (state, action) => {
			state.programList = action.payload;
			state.paginateInfo.total = action.payload.meta.total;
			state.paginateInfo.perPage = action.payload.meta.per_page;
			state.paginateInfo.totalPages = action.payload.meta.last_page;
			state.paginateInfo.page = action.payload.meta.current_page;
		},
		setProgramListingLoading: (state, action) => {
			state.programListLoading = action.payload;
		},
		fillProgramDetail: (state, action) => {
			state.programDetails = action.payload;
			window.localStorage.setItem('currentProgram', JSON.stringify(action.payload));
		},
		setProgramDetailLoading: (state, action) => {
			state.programDetailLoading = action.payload;
		},
		setProgramUpdateDetailLoading: (state, action) => {
			state.programUpdateDetailLoading = action.payload;
		},
		setProgramCreateLoading: (state, action) => {
			state.programCreateLoading = action.payload;
		},
		fillProgramUnitProgressList: (state, action) => {
			state.programUnitProgressList = action.payload.data;
			state.progressPaginateInfo.total = action.payload.meta.total;
			state.progressPaginateInfo.perPage = action.payload.meta.per_page;
			state.progressPaginateInfo.totalPages = action.payload.meta.last_page;
			state.progressPaginateInfo.page = action.payload.meta.current_page;
		},
		setProgramToggleLoading: (state, action) => {
			state.programToggleLoading = action.payload;
		},
		setProgramUnitToggleLoading: (state, action) => {
			state.programUnitToggleLoading = action.payload;
		},
		setSelectedProgramStatus: (state, action) => {
			state.selectedProgramStatus = action.payload
		},
		setPaginationPage: (state, action) => {
			state.paginationPage = action.payload
		},
		fillProgramFilterDistrict: (state, action) => {
			state.programfilterDistrict = action.payload
		},
		fillProgramFilterBlock: (state, action) => {
			state.programfilterBlock = action.payload
		},
		fillProgramFilterPanchayat: (state, action) => {
			state.programfilterPanchayat = action.payload
		},
		fillProgramFilterVillage: (state, action) => {
			state.programfilterVillage = action.payload
		},
		fillProgramFilterStatus: (state, action) => {
			state.programfilterStatus = action.payload
		},
		fillProgramApplyFilter: (state, action) => {
			state.applyFilter = action.payload
		},
		fillProgramUnitProgressVillageList: (state, action) => {
			state.programUnitProgressVillageList = action.payload.data;
			state.programUnitProgressVillagePaginate.total = action.payload.meta.total;
			state.programUnitProgressVillagePaginate.perPage = action.payload.meta.per_page;
			state.programUnitProgressVillagePaginate.totalPages = action.payload.meta.last_page;
			state.programUnitProgressVillagePaginate.page = action.payload.meta.current_page;
		},
	},
});

export const { fillProgramList,fillProgramFilterPanchayat,fillProgramFilterBlock, setProgramListingLoading, fillProgramApplyFilter, fillProgramDetail, fillProgramFilterDistrict, fillProgramFilterVillage, fillProgramFilterStatus, setProgramDetailLoading, setProgramCreateLoading, fillProgramUnitProgressList, setProgramToggleLoading, setProgramUnitToggleLoading, setSelectedProgramStatus, setPaginationPage, setProgramUpdateDetailLoading,fillProgramUnitProgressVillageList } = programSlice.actions;
export default programSlice.reducer;
