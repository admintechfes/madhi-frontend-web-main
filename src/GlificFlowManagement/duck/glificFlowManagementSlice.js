import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	loadingUser: false,
	loading: false,
	filterDistrict: '',
	filterVillage: '',
	filterRole: '',
	applyFilter: false,
	pageNum: 1,
	perPageNum: 10,
	campaignParentsList: [],
	formDataCampaign: {},
	loadingCamping: false,
	campingList: [],
	paginateInfo: {},
	tagsNameList: [],
	glificFlowNameList: [],
	campaingDetails: {},
	campaingParentList: [],
	paginateInfoParent: {},
  tagsFilter:[],
  filterData:{},
  startDateValue: null,
  endDateValue: null,
	paginationPage: 1,
	programfilterDistrict: "",
	programfilterBlock: "",
	programfilterPanchayat: "",
	programfilterVillage: "",
	programfilterStatus: "",
	programApplyFilter: false,
	whatsAppStatus:[],
	tagsNameVal:[],
	addedParents:[]
};

export const glificFlowManagementSlice = createSlice({
	name: 'glificFlowManagement',
	initialState,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setLoadingUser: (state, action) => {
			state.loadingUser = action.payload;
		},

		fillFilterVillage: (state, action) => {
			state.filterVillage = action.payload;
		},
		fillFilterRole: (state, action) => {
			state.filterRole = action.payload;
		},
		fillApplyFilter: (state, action) => {
			state.applyFilter = action.payload;
		},
		fillPageNum: (state, action) => {
			state.pageNum = action.payload;
		},
		fillPerPageNum: (state, action) => {
			state.perPageNum = action.payload;
		},
		fillCampaignParentsList: (state, action) => {
			state.campaignParentsList = action.payload;
		},
		fillFormDataCampaign: (state, action) => {
			state.formDataCampaign = action.payload;
		},
		setLoadingCamping: (state, action) => {
			state.loadingCamping = action.payload;
		},
		fillCampingList: (state, action) => {
			state.campingList = action.payload.data;
			state.paginateInfo.to = action.payload.meta.to;
			state.paginateInfo.perPage = action.payload.meta.per_page;
			state.paginateInfo.totalPages = action.payload.meta.last_page;
			state.paginateInfo.page = action.payload.meta.current_page;
		},
		fillTagsNameList: (state, action) => {
			state.tagsNameList = action.payload.data;
		},
		fillGlificFlowNameList: (state, action) => {
			state.glificFlowNameList = action.payload.data;
		},
		fillCampaingDetails: (state, action) => {
			state.campaingDetails = action.payload;
		},
		fillCampaingParentList: (state, action) => {
			state.campaingParentList = action.payload;
			state.paginateInfoParent.to = action.payload.meta.to;
			state.paginateInfoParent.perPage = action.payload.meta.per_page;
			state.paginateInfoParent.totalPages = action.payload.meta.last_page;
			state.paginateInfoParent.page = action.payload.meta.current_page;
			state.paginateInfoParent.total=action.payload.meta.total
		},
    fillTagsFilter:(state,action)=>{
      state.tagsFilter=action.payload
    },
    fillFilterData:(state,action)=>{
      state.filterData=action.payload
    },
    fillStartDateValue: (state, action) => {
      state.startDateValue = action.payload
    },
    fillEndDateValue: (state, action) => {
      state.endDateValue = action.payload
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
			state.programApplyFilter = action.payload
		},
		fillWhatsAppStatus:(state,action)=>{
			state.whatsAppStatus=action.payload
		},
		fillTagsNameVal:(state,action)=>{
			state.tagsNameVal=action.payload
		},
		fillAddedParents:(state,action)=>{
			state.addedParents=action.payload
		}
	},
});

export const {
	fillAddedParents,
	fillTagsNameVal,
	fillWhatsAppStatus,
	fillProgramFilterDistrict,
	fillProgramFilterBlock,
	fillProgramFilterPanchayat,
	fillProgramFilterVillage,
	fillProgramApplyFilter,
	fillProgramFilterStatus,
	setPaginationPage,
  fillEndDateValue,
  fillFilterData,
  fillStartDateValue,
  fillTagsFilter,
	fillCampaingParentList,
	fillCampaingDetails,
	fillGlificFlowNameList,
	fillTagsNameList,
	setLoadingCamping,
	fillCampingList,
	fillCampaignParentsList,
	fillFormDataCampaign,
	fillPageNum,
	fillPerPageNum,
	setLoading,
	fillFilterRole,
	fillFilterVillage,
	fillFilterDistrict,
	fillApplyFilter,
	setLoadingUser,
} = glificFlowManagementSlice.actions;

export default glificFlowManagementSlice.reducer;
