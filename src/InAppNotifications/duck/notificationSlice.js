import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  notificationListData: [],
  paginateInfo: {},
  addedMembers: [],
  formDataCampaign: {},
  notificationDetails: {},
  notificationMemberList: [],
  notificationMemberPaginateInfo: {},
  notificationClickStatus: [],
  tagsValue: [],
  fromValue: null,
  toValue: null,
}

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    fillNotificationData: (state, action) => {
      state.notificationListData = action.payload;
      state.paginateInfo.total = action.payload.meta.total;
      state.paginateInfo.perPage = action.payload.meta.per_page;
      state.paginateInfo.totalPages = action.payload.meta.last_page;
      state.paginateInfo.page = action.payload.meta.current_page;
    },
    setSelectedMember: (state, action) => {
      state.addedMembers = action.payload
    },
    fillNotificationCampaignAddedUsers: (state, action) => {
      state.formDataCampaign = action.payload
    },
    fillNotificationDetails: (state, action) => {
      state.notificationDetails = action.payload
    },
    fillNotificationMembersList: (state, action) => {
      state.notificationMemberList = action.payload;
      state.notificationMemberPaginateInfo.total = action.payload.meta.total;
      state.notificationMemberPaginateInfo.perPage = action.payload.meta.per_page;
      state.notificationMemberPaginateInfo.totalPages = action.payload.meta.last_page;
      state.notificationMemberPaginateInfo.page = action.payload.meta.current_page;
    },
    fillNotificationClickStatus: (state, action) => {
      state.notificationClickStatus = action.payload
    },
    fillTagsNotificationValue: (state, action) => {
      state.tagsValue = action.payload
    },
    fillNotificationFromValue: (state, action) => {
      state.fromValue = action.payload
    },
    fillNotificationToValue: (state, action) => {
      state.toValue = action.payload
    },
  }
})

export const { setLoading, fillNotificationData, setSelectedMember, fillNotificationCampaignAddedUsers, fillNotificationDetails, fillNotificationMembersList, fillNotificationClickStatus, fillTagsNotificationValue, fillNotificationFromValue, fillNotificationToValue } = notificationSlice.actions;
export default notificationSlice.reducer;