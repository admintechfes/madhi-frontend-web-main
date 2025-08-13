import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  visitsloading: false,
  paginateInfo: {},
  visitsData: [],
  visitDetails: [],
  conductedByData: [],
  conductedValue: "",
  statusData: [],
  statusValue: null,
  visitsParentsData: [],
  attendanceData: [],
  attendanceValue: "",
  startDateValue: null,
  endDateValue: null,
  visitsparentspaginateInfo: {},
  meetingData: [],
  meetingValue: "",
  inviteeVisitTypeData: [],
  inviteeVisitTypeValue: "",
  visitpreview: {}
};

export const VisitsSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    setVisitsLoading: (state, action) => {
      state.visitsloading = action.payload;
    },
    fillVisitData: (state, action) => {
      state.visitsData = action.payload;
      state.paginateInfo.total = action.payload.meta.total;
      state.paginateInfo.perPage = action.payload.meta.per_page;
      state.paginateInfo.totalPages = action.payload.meta.last_page;
      state.paginateInfo.page = action.payload.meta.current_page;
    },
    fillVisitDetails: (state, action) => {
      state.visitDetails = action.payload
    },
    fillConductedByData: (state, action) => {
      state.conductedByData = action.payload
    },
    fillStatusData: (state, action) => {
      state.statusData = action.payload
    },
    fillVisitsParents: (state, action) => {
      state.visitsParentsData = action.payload,
        state.visitsparentspaginateInfo.total = action.payload.meta.total;
      state.visitsparentspaginateInfo.perPage = action.payload.meta.per_page;
      state.visitsparentspaginateInfo.totalPages = action.payload.meta.last_page;
      state.visitsparentspaginateInfo.page = action.payload.meta.current_page;
    },
    fillAttendanceData: (state, action) => {
      state.attendanceData = action.payload
    },
    fillConductedByValue: (state, action) => {
      state.conductedValue = action.payload
    },
    fillStatusValue: (state, action) => {
      state.statusValue = action.payload
    },
    fillVisitsStartDateValue: (state, action) => {
      state.startDateValue = action.payload
    },
    fillVisitsEndDateValue: (state, action) => {
      state.endDateValue = action.payload
    },
    fillAttendanceValue: (state, action) => {
      state.attendanceValue = action.payload
    },
    fillMeetingData: (state, action) => {
      state.meetingData = action.payload
    },
    fillMeetingValue: (state, action) => {
      state.meetingValue = action.payload
    },
    fillinviteeVisitTypeData: (state, action) => {
      state.inviteeVisitTypeData = action.payload
    },
    fillinviteeVisitTypeValue: (state, action) => {
      state.inviteeVisitTypeValue = action.payload
    },
    fillVisitPreview: (state, action) => {
      state.visitpreview = action.payload
    }
  },
});

export const { setVisitsLoading, fillVisitData, fillVisitDetails, fillConductedByData, fillStatusData, fillVisitsParents, fillAttendanceData, fillConductedByValue, fillStatusValue, fillVisitsStartDateValue, fillVisitsEndDateValue, fillAttendanceValue, fillMeetingData, fillMeetingValue, fillinviteeVisitTypeData, fillinviteeVisitTypeValue, fillVisitPreview } = VisitsSlice.actions;
export default VisitsSlice.reducer;
