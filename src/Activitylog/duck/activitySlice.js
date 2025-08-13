import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  activityTeamMemberData: [],
  activityParentsData: [],
  paginateInfo: {},
  activityTypeData: [],
  activityEventData: [],
  startDateValue: null,
  endDateValue: null,
  paginateParentsInfo: {},
  paginateSupervisorInfo: {},
  activitySupervisorTeamMemberData: []
}

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    fillActivityTeamMember: (state, action) => {
      state.activityTeamMemberData = action.payload;
      state.paginateInfo.total = action.payload.meta.total;
      state.paginateInfo.perPage = action.payload.meta.per_page;
      state.paginateInfo.totalPages = action.payload.meta.last_page;
      state.paginateInfo.page = action.payload.meta.current_page;
    },
    fillActivitySupervisorTeamMember: (state, action) => {
      state.activitySupervisorTeamMemberData = action.payload;
      state.paginateSupervisorInfo.total = action.payload.pagination.total;
      state.paginateSupervisorInfo.perPage = action.payload.pagination.per_page;
      state.paginateSupervisorInfo.totalPages = action.payload.pagination.last_page;
      state.paginateSupervisorInfo.page = action.payload.pagination.current_page;
    },
    fillActivityParents: (state, action) => {
      state.activityParentsData = action.payload;
      state.paginateParentsInfo.total = action.payload.pagination.total;
      state.paginateParentsInfo.perPage = action.payload.pagination.per_page;
      state.paginateParentsInfo.totalPages = action.payload.pagination.last_page;
      state.paginateParentsInfo.page = action.payload.pagination.current_page;
    },
    fillActivityType: (state, action) => {
      state.activityTypeData = action.payload
    },
    fillActivityEvent: (state, action) => {
      state.activityEventData = action.payload
    },
    fillActivityTeamMemberStartDateValue: (state, action) => {
      state.startDateValue = action.payload
    },
    fillActivityTeamMemberEndDateValue: (state, action) => {
      state.endDateValue = action.payload
    },
  }
})

export const { setLoading, fillActivityTeamMember, fillActivityParents, fillActivityType, fillActivityEvent, fillActivityTeamMemberStartDateValue, fillActivityTeamMemberEndDateValue, fillActivitySupervisorTeamMember } = activitySlice.actions;
export default activitySlice.reducer;