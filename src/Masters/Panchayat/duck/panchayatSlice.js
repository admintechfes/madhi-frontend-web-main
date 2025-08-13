import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	loading: false,
	panchayatList: [],
	paginateInfo: {},
	panchayatDetails: {},
	minCEWCount: null,
	maxCEWCount: null,
	minVillageAreasCount: null,
	maxVillageAreasCount: null,
	minParentCount: null,
	maxParentCount: null,
	assignedSupervisorId:null,
	applyFilter: false,
	pageNum:1,
  perPageNum:10,
};

export const panchayatSlice = createSlice({
	name: 'panchayat',
	initialState,
	reducers: {
		fillPanchayatList: (state, action) => {
			state.panchayatList = action.payload.data;
			state.paginateInfo.to = action.payload.meta.to;
			state.paginateInfo.perPage = action.payload.meta.per_page;
			state.paginateInfo.totalPages = action.payload.meta.last_page;
			state.paginateInfo.page = action.payload.meta.current_page;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		fillPanchayatDetails: (state, action) => {
			state.panchayatDetails = action.payload;
		},
		fillMinCEWCount: (state, action) => {
      state.minCEWCount = action.payload;
    },
    fillMaxCEWCount: (state, action) => {
      state.maxCEWCount = action.payload;
    },
		fillMinVillageAreasCount: (state, action) => {
      state.minVillageAreasCount = action.payload;
    },
    fillMaxVillageAreasCount: (state, action) => {
      state.maxVillageAreasCount = action.payload;
    },
		fillMinParentCount: (state, action) => {
      state.minParentCount = action.payload;
    },
    fillMaxParentCount: (state, action) => {
      state.maxParentCount = action.payload;
    },
		fillAssignedSupervisorId: (state, action) => {
      state.assignedSupervisorId = action.payload;
    },
		fillApplyFilter: (state, action) => {
      state.applyFilter = action.payload
    },
		fillPageNum:(state,action)=>{
      state.pageNum=action.payload
    },
    fillPerPageNum:(state,action)=>{
      state.perPageNum=action.payload
    }
	},
});

export const {   fillPerPageNum,
  fillPageNum,fillPanchayatList, setLoading, fillPanchayatDetails,fillMinCEWCount,fillMaxCEWCount,fillMinVillageAreasCount,fillMaxVillageAreasCount,fillMinParentCount,fillMaxParentCount,fillAssignedSupervisorId,fillApplyFilter} = panchayatSlice.actions;
export default panchayatSlice.reducer;
