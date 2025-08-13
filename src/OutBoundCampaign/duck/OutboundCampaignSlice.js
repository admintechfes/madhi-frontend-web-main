import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  OutboundCampaignListLoading: true,
  OutboundCampaignList: [],
  paginateInfo: {},
  OutboundCampaignDetails: {},
  fromValue: null,
  toValue: null,
  formDataCampaign: {},
  addedParents: [],
  ivrList: [],
  ivrValue: "",
  tagsValue: [],
  OutboundCampaignParentsList: [],
  OutboundParentspaginateInfo: {},
  OutboundParentsStatusMaster: [],
  OutboundParentsProgramNameMaster: [],
  OutboundParentsUnitNumberMaster: [],
  status: "",
  programName: "",
  unitNumber: ""
};

export const OutboundCampaignSlice = createSlice({
  name: 'outboundCampaign',
  initialState,
  reducers: {
    fillOutBoundCampaignList: (state, action) => {
      state.OutboundCampaignList = action.payload;
      state.paginateInfo.total = action.payload.meta.total;
      state.paginateInfo.perPage = action.payload.meta.per_page;
      state.paginateInfo.totalPages = action.payload.meta.last_page;
      state.paginateInfo.page = action.payload.meta.current_page;
    },
    setOutboundCampaignListingLoading: (state, action) => {
      state.OutboundCampaignListLoading = action.payload;
    },
    fillOutboundCampaignDetails: (state, action) => {
      state.OutboundCampaignDetails = action.payload
    },
    fillOutboundFromValue: (state, action) => {
      state.fromValue = action.payload;
    },
    fillOutboundToValue: (state, action) => {
      state.toValue = action.payload;
    },
    fillFormDataOutboundCampaign: (state, action) => {
      state.formDataCampaign = action.payload;
    },
    fillOutboundCampaignAddedParents: (state, action) => {
      state.addedParents = action.payload;
    },
    fillIVRIDList: (state, action) => {
      state.ivrList = action.payload;
    },
    fillIVRIDValue: (state, action) => {
      state.ivrValue = action.payload;
    },
    fillTagsOutboundValue: (state, action) => {
      state.tagsValue = action.payload;
    },
    fillOutBoundCampaignParentsList: (state, action) => {
      state.OutboundCampaignParentsList = action.payload;
      state.OutboundParentspaginateInfo.total = action.payload.meta.total;
      state.OutboundParentspaginateInfo.perPage = action.payload.meta.per_page;
      state.OutboundParentspaginateInfo.totalPages = action.payload.meta.last_page;
      state.OutboundParentspaginateInfo.page = action.payload.meta.current_page;
    },
    fillOutboundParentSTatusData: (state, action) => {
      state.OutboundParentsStatusMaster = action.payload
    },
    fillOutboundProgramNameData: (state, action) => {
      state.OutboundParentsProgramNameMaster = action.payload
    },
    fillOutboundUnitNumberData: (state, action) => {
      state.OutboundParentsUnitNumberMaster = action.payload
    },
    fillSTatusValue: (state, action) => {
      state.status = action.payload
    },
    fillProgramNameValue: (state, action) => {
      state.programName = action.payload
    },
    fillUnitNumberValue: (state, action) => {
      state.unitNumber = action.payload
    }
  },
});

export const { setOutboundCampaignListingLoading, fillOutBoundCampaignList, fillOutboundCampaignDetails, fillOutboundFromValue, fillOutboundToValue, fillFormDataOutboundCampaign, fillOutboundCampaignAddedParents, fillIVRIDList, fillIVRIDValue, fillTagsOutboundValue, fillOutBoundCampaignParentsList, fillOutboundParentSTatusData, fillSTatusValue, fillOutboundProgramNameData, fillOutboundUnitNumberData, fillProgramNameValue, fillUnitNumberValue } = OutboundCampaignSlice.actions;
export default OutboundCampaignSlice.reducer;
