import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	trainingListLoading: false,
	trainingDetailsLoading: false,
	trainingAttendeesListLoading: false,
	trainingList: [],
	trainingDetails: {},
	trainingAttendeesList: [],
	paginateInfo: {},
	attendeesPaginateInfo: {},
	trainingStatus: [],
	trainingStatusVal: null,
	trainingCreatedBy: [],
	trainingCreatedByVal: null,
	trainingProgram: [],
	trainingProgramVal: null,
	trainingProgramUnit: [],
	trainingProgramUnitVal: null,
	applyFilter: false,
	trainingStatusByVal:null,
	attendanceFilterByVal:null,
	attendanceFilter:[],
	applyFilterTrainingDetail:false,
	trainingDetailStatus:false

};

export const trainingSlice = createSlice({
	name: 'training',
	initialState,
	reducers: {
		fillTrainingList: (state, action) => {
			state.trainingList = action.payload.data;
			state.paginateInfo.total = action.payload.meta.total;
			state.paginateInfo.perPage = action.payload.meta.per_page;
			state.paginateInfo.totalPages = action.payload.meta.last_page;
			state.paginateInfo.page = action.payload.meta.current_page;
		},
		setTrainingListingLoading: (state, action) => {
			state.trainingListLoading = action.payload;
		},
		filltrainingStatus: (state, action) => {
			state.trainingStatus = action.payload;
		},
		filltrainingStatusVal: (state, action) => {
			state.trainingStatusVal = action.payload;
		},
		fillTrainingDetails: (state, action) => {
			state.trainingDetails = action.payload;
		},
		setTrainingDetailsLoading: (state, action) => {
			state.trainingDetailsLoading = action.payload;
		},
		fillTrainingAttendeesList: (state, action) => {
			state.trainingAttendeesList = action.payload.data;
			state.attendeesPaginateInfo.total = action.payload.meta.total;
			state.attendeesPaginateInfo.perPage = action.payload.meta.per_page;
			state.attendeesPaginateInfo.totalPages = action.payload.meta.last_page;
			state.attendeesPaginateInfo.page = action.payload.meta.current_page;
		},
		setTrainingAttendeesListingLoading: (state, action) => {
			state.trainingAttendeesListLoading = action.payload;
		},
		filltrainingProgram: (state, action) => {
			state.trainingProgram = action.payload;
		},
		filltrainingProgramVal: (state, action) => {
			state.trainingProgramVal = action.payload;
		},
		filltrainingProgramUnit: (state, action) => {
			state.trainingProgramUnit = action.payload;
		},
		filltrainingProgramUnitVal: (state, action) => {
			state.trainingProgramUnitVal = action.payload;
		},
		filltrainingCreatedBy: (state, action) => {
			state.trainingCreatedBy = action.payload;
		},
		fillTrainingProgramFilterStatus: (state, action) => {
			state.trainingStatusByVal = action.payload;
		},
		filltrainingCreatedByVal: (state, action) => {
			state.trainingCreatedByVal = action.payload;
		},
		fillTainingAttendanceFilter: (state, action) => {
			state.attendanceFilter = action.payload
		},
		filltrainingAttendanceByVal: (state, action) => {
			state.attendanceFilterByVal = action.payload;
		},

		fillTainingApplyFilter: (state, action) => {
			state.applyFilter = action.payload
		},
		fillTainingDetailsApplyFilter: (state, action) => {
			state.applyFilterTrainingDetail = action.payload
		},
		fillTainingDetailsStatusFilter: (state, action) => {
			state.trainingDetailStatus = action.payload
		},
	},
});

export const { fillTainingApplyFilter,fillTainingDetailsStatusFilter,fillTainingDetailsApplyFilter,filltrainingAttendanceByVal,fillTainingAttendanceFilter,fillTrainingProgramFilterStatus,filltrainingProgramUnit,filltrainingProgramUnitVal,fillTrainingList,filltrainingCreatedByVal,filltrainingCreatedBy,filltrainingProgramVal,filltrainingProgram, setTrainingListingLoading, filltrainingStatus, filltrainingStatusVal, fillTrainingDetails, setTrainingDetailsLoading, fillTrainingAttendeesList, setTrainingAttendeesListingLoading } =
	trainingSlice.actions;
export default trainingSlice.reducer;
