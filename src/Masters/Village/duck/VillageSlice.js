import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	loading: false,
	villageList: [],
	paginateInfo: {},
	villageDetails: {},
	assignedSeniorSupervisorId: null,
	assignedSupervisorId: null,
	assignedCEWId: null,
	minParentCount: null,
	maxParentCount: null,
	applyFilter: false,
	pageNum: 1,
	perPageNum: 10,
	whatsappgroupStatusList: [],
	whatsAppGroupInfo: {},
	statuspaginateInfo: {},
	statusLoading: false,
	bulkloading: false,
	villageMasterListData: [],
	villageMasterListDataPaginateInfo: {},
	villageSuccessAddedData: [],
	villageSuccessAddedPaginateInfo: {},
	villageErrorData: [],
	villageErrorPaginateInfo: {}
};

export const villageSlice = createSlice({
	name: 'village',
	initialState,
	reducers: {
		fillVillageList: (state, action) => {
			state.villageList = action.payload.data;
			state.paginateInfo.to = action.payload.meta.to;
			state.paginateInfo.perPage = action.payload.meta.per_page;
			state.paginateInfo.totalPages = action.payload.meta.last_page;
			state.paginateInfo.page = action.payload.meta.current_page;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		fillVillageDetails: (state, action) => {
			state.villageDetails = action.payload;
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
		fillAssignedSeniorSupervisorId: (state, action) => {
			state.assignedSeniorSupervisorId = action.payload;
		},
		fillassignedCEWId: (state, action) => {
			state.assignedCEWId = action.payload;
		},
		fillApplyFilter: (state, action) => {
			state.applyFilter = action.payload
		},
		fillPageNum: (state, action) => {
			state.pageNum = action.payload
		},
		fillPerPageNum: (state, action) => {
			state.perPageNum = action.payload
		},
		fillWhatsAppGroupStatusList: (state, action) => {
			state.whatsappgroupStatusList = action.payload;
			state.statuspaginateInfo.to = action.payload.to;
			state.statuspaginateInfo.perPage = action.payload.per_page;
			state.statuspaginateInfo.totalPages = action.payload.last_page;
			state.statuspaginateInfo.page = action.payload.current_page;
		},
		fillWhatsAppGroupInfo: (state, action) => {
			state.whatsAppGroupInfo = action.payload
		},
		setStatusLoading: (state, action) => {
			state.statusLoading = action.payload
		},
		setBulkLoading: (state, action) => {
			state.bulkloading = action.payload
		},
		fillVillageMasterListData: (state, action) => {
			state.villageMasterListData = action.payload;
			state.villageMasterListDataPaginateInfo.total = action.payload.original.total;
			state.villageMasterListDataPaginateInfo.perPage = action.payload.original.per_page;
			state.villageMasterListDataPaginateInfo.totalPages = action.payload.original.last_page;
			state.villageMasterListDataPaginateInfo.page = action.payload.original.current_page;
		},
		fillVillageSuccessListAddedData: (state, action) => {
			state.villageSuccessAddedData = action.payload;
			state.villageSuccessAddedPaginateInfo.total = action.payload.total;
			state.villageSuccessAddedPaginateInfo.perPage = action.payload.per_page;
			state.villageSuccessAddedPaginateInfo.totalPages = action.payload.last_page;
			state.villageSuccessAddedPaginateInfo.page = action.payload.current_page;
		},
		fillVillageErrorData: (state, action) => {
			state.villageErrorData = action.payload;
			state.villageErrorPaginateInfo.total = action.payload.total;
			state.villageErrorPaginateInfo.perPage = action.payload.per_page;
			state.villageErrorPaginateInfo.totalPages = action.payload.last_page;
			state.villageErrorPaginateInfo.page = action.payload.current_page;
		},
	},
});

export const { fillPerPageNum,
	fillPageNum, fillVillageList, setLoading, fillVillageDetails, fillMinParentCount,
	fillMaxParentCount,
	fillAssignedSupervisorId,
	fillAssignedSeniorSupervisorId,
	fillassignedCEWId,
	fillApplyFilter,
	fillWhatsAppGroupStatusList,
	fillWhatsAppGroupInfo,
	setStatusLoading,
	setBulkLoading,
	fillVillageMasterListData,
	fillVillageSuccessListAddedData,
	fillVillageErrorData
} = villageSlice.actions;
export default villageSlice.reducer;
