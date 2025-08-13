import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	loading: false,
	blockList: [],
	paginateInfo: {},
	blockDetails: {},
	districtName: [],
	minPanchayatWardsCount: null,
	maxPanchayatWardsCount: null,
	minVillageAreasCount: null,
	maxVillageAreasCount: null,
	minParentCount: null,
	maxParentCount: null,
	assignedSupervisorId: null,
	district_id: null,
	applyFilter: false,
	pageNum:1,
  perPageNum:10,
};

export const blockSlice = createSlice({
	name: 'block',
	initialState,
	reducers: {
		fillBlockList: (state, action) => {
			state.blockList = action.payload.data;
			state.paginateInfo.to = action.payload.meta.to;
			state.paginateInfo.perPage = action.payload.meta.per_page;
			state.paginateInfo.totalPages = action.payload.meta.last_page;
			state.paginateInfo.page = action.payload.meta.current_page;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		fillBlockDetails: (state, action) => {
			state.blockDetails = action.payload;
		},
		fillDistrictName: (state, action) => {
			state.districtName = action.payload;
		},
		fillMinPanchayatWardsCount: (state, action) => {
			state.minPanchayatWardsCount = action.payload;
		},
		fillMaxPanchayatWardsCount: (state, action) => {
			state.maxPanchayatWardsCount = action.payload;
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
		fillAssignedDistrict: (state, action) => {
			state.district_id = action.payload;
		},
		fillApplyFilter: (state, action) => {
			state.applyFilter = action.payload;
		},
		fillPageNum:(state,action)=>{
      state.pageNum=action.payload
    },
    fillPerPageNum:(state,action)=>{
      state.perPageNum=action.payload
    }
	},
});

export const {
	fillBlockList,
	fillPerPageNum,
  fillPageNum,
	setLoading,
	fillAssignedDistrict,
	fillBlockDetails,
	fillDistrictName,
	fillMinPanchayatWardsCount,
	fillMaxPanchayatWardsCount,
	fillMinVillageAreasCount,
	fillMaxVillageAreasCount,
	fillMinParentCount,
	fillMaxParentCount,
	fillApplyFilter,
	fillAssignedSupervisorId,
} = blockSlice.actions;
export default blockSlice.reducer;
