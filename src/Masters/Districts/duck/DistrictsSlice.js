import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  districtLoading: false,
  loading: false,
  districtNameLoading: false,
  blockNameLoading: true,
  panchayatNameLoading: true,
  userNameLoading: true,
  villageNameLoading: true,
  districtLoading: false,
  loading: false,
  districtList: [],
  paginateInfo: {},
  districtDetails: {},
  stateList: [],
  districtNameList: [],
  blockNameList: [],
  panchayatNameList: [],
  userNameList: [],
  CEWNameList: [],
  CEWDelegateNameList: [],
  supervisorNameList: [],
  srSupervisorNameList: [],
  villageNameList: [],
  applyFilter: false,
  minBlockZonesCount: null,
  maxBlockZonesCount: null,
  minPanchayatWardsCount: null,
  maxPanchayatWardsCount: null,
  minVillageAreasCount: null,
  maxVillageAreasCount: null,
  minCEWCount: null,
  maxCEWCount: null,
  minSupervisorCount: null,
  maxSupervisorCount: null,
  minParentCount: null,
  maxParentCount: null,
  minProgramCount: null,
  maxProgramCount: null,
  pageNum:1,
  perPageNum:10,
};
export const districtsSlice = createSlice({
  name: 'district',
  initialState,
  reducers: {
    fillDistrictList: (state, action) => {
      state.districtList = action.payload.data;
      state.paginateInfo.to = action.payload.meta.to;
      state.paginateInfo.perPage = action.payload.meta.per_page;
      state.paginateInfo.totalPages = action.payload.meta.last_page;
      state.paginateInfo.page = action.payload.meta.current_page;
    },
    setAllLoading: (state, action, type) => {
      state.allLoading = { ...state.allLoading, [type]: action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDistrictloading: (state, action) => {
      state.districtLoading = action.payload;
    },
    setDistrictNameloading: (state, action) => {
      state.districtNameLoading = action.payload;
    },
    setBlockNameloading: (state, action) => {
      state.blockNameLoading = action.payload;
    },
    setPanchayatNameloading: (state, action) => {
      state.panchayatNameLoading = action.payload;
    },
    setVillageNameloading: (state, action) => {
      state.villageNameLoading = action.payload;
    },
    fillDistrictDetails: (state, action) => {
      state.districtDetails = action.payload;
    },
    fillStateList: (state, action) => {
      state.stateList = action.payload;
    },
    fillDistrictNameList: (state, action) => {
      state.districtNameList = action.payload;
    },
    fillBlockNameList: (state, action) => {
      state.blockNameList = action.payload;
    },
    fillPanchayatNameList: (state, action) => {
      state.panchayatNameList = action.payload;
    },
    fillUserNameList: (state, action) => {
      state.userNameList = action.payload;
    },
    fillCEWNameList: (state, action) => {
      state.CEWNameList = action.payload;
    },
    fillCEWDelegateNameList: (state, action) => {
      state.CEWDelegateNameList = action.payload;
    },
    fillSupervisorNameList: (state, action) => {
      state.supervisorNameList = action.payload;
    },
    fillSrSupervisorNameList: (state, action) => {
      state.srSupervisorNameList = action.payload;
    },
    fillVillageNameList: (state, action) => {
      state.villageNameList = action.payload;
    },
    fillMinBlockZonesCount: (state, action) => {
      state.minBlockZonesCount = action.payload;
    },
    fillMaxBlockZonesCount: (state, action) => {
      state.maxBlockZonesCount = action.payload;
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
    fillMinCEWCount: (state, action) => {
      state.minCEWCount = action.payload;
    },
    fillMaxCEWCount: (state, action) => {
      state.maxCEWCount = action.payload;
    },
    fillMinSupervisorCount: (state, action) => {
      state.minSupervisorCount = action.payload;
    },
    fillMaxSupervisorCount: (state, action) => {
      state.maxSupervisorCount = action.payload;
    },
    fillMinParentCount: (state, action) => {
      state.minParentCount = action.payload;
    },
    fillMaxParentCount: (state, action) => {
      state.maxParentCount = action.payload;
    },
    fillMinProgramCount: (state, action) => {
      state.minProgramCount = action.payload;
    },
    fillMaxProgramCount: (state, action) => {
      state.maxProgramCount = action.payload;
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

export const {
  fillPerPageNum,
  fillPageNum,
  fillDistrictList,
  setDistrictloading,
  setLoading,
  fillDistrictDetails,
  fillStateList,
  fillDistrictNameList,
  fillBlockNameList,
  fillPanchayatNameList,
  fillUserNameList,
  fillCEWNameList,
  fillSupervisorNameList,
  fillSrSupervisorNameList,
  fillCEWDelegateNameList,
  fillVillageNameList,
  setDistrictNameloading,
  setBlockNameloading,
  setPanchayatNameloading,
  setVillageNameloading,
  fillMinBlockZonesCount,
  fillMaxBlockZonesCount,
  fillMinPanchayatWardsCount,
  fillMaxPanchayatWardsCount,
  fillMinVillageAreasCount,
  fillMaxVillageAreasCount,
  fillMinCEWCount,
  fillMaxCEWCount,
  fillMinSupervisorCount,
  fillMaxSupervisorCount,
  fillMinParentCount,
  fillMaxParentCount,
  fillMinProgramCount,
  fillMaxProgramCount,
  fillApplyFilter
}

  = districtsSlice.actions;

export default districtsSlice.reducer;