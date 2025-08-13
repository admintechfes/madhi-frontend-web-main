import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	progressLoading: false,
	paginateInfo: {},
	progressdetails: [],
	villageUsers: [],
	activeProgamRunning: [],
	unitvillage: [],
	unitValue: "",
	statusObj: {},
	districtValue: "",
	progressStatusData: [],
	storetabValue: 0,
	activepaginateInfo: {},
	activeProgramDistrictList: [],
	unitListName: [],
	activityListName: [],
	exportLoading: false,
	villagewiseprogreslist: [],
	villagewiseprogresspaginate: {},
	villagewiseheader: [],
	parentwiseprogreslist: [],
	parentwiseprogresspaginate: {},
	district_id: [],
	block_zone_id: [],
	panchayat_ward_id: [],
	village_area_id: [],
	activityListData: [],
};

export const ProgressSlice = createSlice({
	name: 'progress',
	initialState,
	reducers: {
		setProgressLoading: (state, action) => {
			state.progressLoading = action.payload;
		},
		fillProgressDetails: (state, action) => {
			state.progressdetails = action.payload
		},
		fillVillageUsers: (state, action) => {
			state.villageUsers = action.payload.data
			state.paginateInfo.total = action.payload.meta.total;
			state.paginateInfo.perPage = action.payload.meta.per_page;
			state.paginateInfo.totalPages = action.payload.meta.last_page;
			state.paginateInfo.page = action.payload.meta.current_page;
		},
		fillActiveProgramRunning: (state, action) => {
			state.activeProgamRunning = action.payload
			state.activepaginateInfo.total = action.payload.meta.total;
			state.activepaginateInfo.perPage = action.payload.meta.per_page;
			state.activepaginateInfo.totalPages = action.payload.meta.last_page;
			state.activepaginateInfo.page = action.payload.meta.current_page;

		},
		fillUnitVillage: (state, action) => {
			state.unitvillage = action.payload
		},
		fillUnitValue: (state, action) => {
			state.unitValue = action.payload
		},
		fillStatusObj: (state, action) => {
			state.statusObj = action.payload
		},
		fillDistrictValue: (state, action) => {
			state.districtValue = action.payload
		},
		fillProgressStatusData: (state, action) => {
			state.progressStatusData = action.payload
		},
		fillStoreTabValue: (state, action) => {
			state.storetabValue = action.payload
		},
		fillActiveProgramDistrictList: (state, action) => {
			state.activeProgramDistrictList = action.payload
		},
		fillUnitListName: (state, action) => {
			state.unitListName = action.payload
		},
		fillActivityListName: (state, action) => {
			state.activityListName = action.payload
		},
		setExportLoading: (state, action) => {
			state.exportLoading = action.payload
		},
		fillVillageWiseProgressList: (state, action) => {
			state.villagewiseprogreslist = action.payload;
			state.villagewiseheader = action.payload.headers;
			state.villagewiseprogresspaginate.total = action.payload.pagination.total;
			state.villagewiseprogresspaginate.perPage = action.payload.pagination.per_page;
			state.villagewiseprogresspaginate.totalPages = action.payload.pagination.last_page;
			state.villagewiseprogresspaginate.page = action.payload.pagination.current_page;
		},
		fillParentWiseProgressList: (state, action) => {
			state.parentwiseprogreslist = action.payload;
			state.parentwiseprogresspaginate.total = action.payload.meta.total;
			state.parentwiseprogresspaginate.perPage = action.payload.meta.per_page;
			state.parentwiseprogresspaginate.totalPages = action.payload.meta.last_page;
			state.parentwiseprogresspaginate.page = action.payload.meta.current_page;
		},
		fillProgressDistrictIds: (state, action) => {
			state.district_id = action.payload
		},
		fillProgressBlockZoneIds: (state, action) => {
			state.block_zone_id = action.payload
		},
		fillProgressPanchayatWardIds: (state, action) => {
			state.panchayat_ward_id = action.payload
		},
		fillProgressVillageAreaIds: (state, action) => {
			state.village_area_id = action.payload
		},
		fillWorkshopActivityList: (state, action) => {
			state.activityListData = action.payload
		}
	},
});
export const { setExportLoading, fillActivityListName, setProgressLoading, fillUnitListName, fillProgressDetails, fillActiveProgramRunning, fillUnitVillage, fillUnitValue, fillStatusObj, fillDistrictValue, fillVillageUsers, fillProgressStatusData, fillStoreTabValue, fillActiveProgramDistrictList, fillVillageWiseProgressList, fillParentWiseProgressList, fillProgressDistrictIds, fillProgressBlockZoneIds, fillProgressPanchayatWardIds, fillProgressVillageAreaIds, fillWorkshopActivityList } = ProgressSlice.actions;

export default ProgressSlice.reducer;
