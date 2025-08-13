import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parentsListLoading: true,
  parentsList: [],
  paginateInfo: {},
  parentdetails: [],
  cewListData: [],
  genderData: [],
  gradeData: [],
  ageData: [],
  errorData: [],
  villageValue: "",
  supervisorValue: "",
  cewValue: "",
  startDateValue: null,
  endDateValue: null,
  schoolListData: [],
  relationshipListData: [],
  bulkloading: false,
  bulkimportLoading: false,
  createparentloading: false,
  pageNum: 1,
  perPageNum: 10,
  selectedQuestion: [],
  district_id: [],
  block_zone_id: [],
  panchayat_ward_id: [],
  village_area_id: [],
  parentsListAddedData: [],
  parentsListAddedPaginateInfo: {},
  parentsAddedData: [],
  parentsAddedPaginateInfo: {},
  parentsErrorData: [],
  parentsErrorPaginateInfo: {},
  sharedQuizList: [],
  sharedquizpaginateInfo: {},
  pageSharedQuizNum: 1,
  perPageSharedQuizNum: 10,
  selectedSharedQuizQuestion: [],
  workshopSharedList: [],
  workshopSharedpaginateInfo: {},
  pageSharedWorkshopNum: 1,
  perPageSharedWorkshopNum: 10,
  selectedSharedWorkshopQuestion: [],

};

export const ParentsSlice = createSlice({
  name: 'parents',
  initialState,
  reducers: {
    fillParentsList: (state, action) => {
      state.parentsList = action.payload;
      state.paginateInfo.total = action.payload.meta.total;
      state.paginateInfo.perPage = action.payload.meta.per_page;
      state.paginateInfo.totalPages = action.payload.meta.last_page;
      state.paginateInfo.page = action.payload.meta.current_page;
    },
    fillSharedQuizList: (state, action) => {
      state.sharedQuizList = action.payload;
      state.sharedquizpaginateInfo.total = action.payload.meta.total;
      state.sharedquizpaginateInfo.perPage = action.payload.meta.per_page;
      state.sharedquizpaginateInfo.totalPages = action.payload.meta.last_page;
      state.sharedquizpaginateInfo.page = action.payload.meta.current_page;
    },
    fillSharedWorkshopList: (state, action) => {
      state.workshopSharedList = action.payload;
      state.workshopSharedpaginateInfo.total = action.payload.meta.total;
      state.workshopSharedpaginateInfo.perPage = action.payload.meta.per_page;
      state.workshopSharedpaginateInfo.totalPages = action.payload.meta.last_page;
      state.workshopSharedpaginateInfo.page = action.payload.meta.current_page;
    },
    setParentsListingLoading: (state, action) => {
      state.parentsListLoading = action.payload;
    },
    fillParentsDetails: (state, action) => {
      state.parentdetails = action.payload
    },
    fillCewListData: (state, action) => {
      state.cewListData = action.payload
    },
    fillGenderData: (state, action) => {
      state.genderData = action.payload
    },
    fillGradeData: (state, action) => {
      state.gradeData = action.payload
    },
    fillAgeData: (state, action) => {
      state.ageData = action.payload
    },
    fillErrorData: (state, action) => {
      state.errorData = action.payload
    },
    fillVillageValue: (state, action) => {
      state.villageValue = action.payload
    },
    fillSupervisorValue: (state, action) => {
      state.supervisorValue = action.payload
    },
    fillCewValue: (state, action) => {
      state.cewValue = action.payload
    },
    fillStartDateValue: (state, action) => {
      state.startDateValue = action.payload
    },
    fillEndDateValue: (state, action) => {
      state.endDateValue = action.payload
    },
    fillSchoolList: (state, action) => {
      state.schoolListData = action.payload
    },
    fillRelationshipList: (state, action) => {
      state.relationshipListData = action.payload
    },
    setBulkImportLoading: (state, action) => {
      state.bulkimportLoading = action.payload
    },
    setBulkLoading: (state, action) => {
      state.bulkloading = action.payload
    },
    setparentLoader: (state, action) => {
      state.createparentloading = action.payload
    },
    fillPageNumParents: (state, action) => {
      state.pageNum = action.payload
    },
    fillPerPageNumParents: (state, action) => {
      state.perPageNum = action.payload
    },
    setSelectedQuestion: (state, action) => {
      // Assuming each object has a unique 'uuid' property
      // action.payload?.selectedData?.forEach(newItem => {
      // 	if (!state.selectedQuestion.some(existingItem => existingItem.id === newItem.id)) {
      // 		state.selectedQuestion.push(newItem);
      // 	}
      // });
      // action.payload?.selectedData

      state.selectedQuestion = action.payload
    },


    clearSelectedQuestion: (state, action) => {
      state.selectedQuestion = [];
    },
    fillDistrictIds: (state, action) => {
      state.district_id = action.payload
    },
    fillBlockZoneIds: (state, action) => {
      state.block_zone_id = action.payload
    },
    fillPanchayatWardIds: (state, action) => {
      state.panchayat_ward_id = action.payload
    },
    fillVillageAreaIds: (state, action) => {
      state.village_area_id = action.payload
    },
    fillParentsListAddedData: (state, action) => {
      state.parentsListAddedData = action.payload;
      state.parentsListAddedPaginateInfo.total = action.payload.original.total;
      state.parentsListAddedPaginateInfo.perPage = action.payload.original.per_page;
      state.parentsListAddedPaginateInfo.totalPages = action.payload.original.last_page;
      state.parentsListAddedPaginateInfo.page = action.payload.original.current_page;
    },
    fillParentsAddedData: (state, action) => {
      state.parentsAddedData = action.payload;
      state.parentsAddedPaginateInfo.total = action.payload.total;
      state.parentsAddedPaginateInfo.perPage = action.payload.per_page;
      state.parentsAddedPaginateInfo.totalPages = action.payload.last_page;
      state.parentsAddedPaginateInfo.page = action.payload.current_page;
    },
    fillParentsErrorData: (state, action) => {
      state.parentsErrorData = action.payload;
      state.parentsErrorPaginateInfo.total = action.payload.total;
      state.parentsErrorPaginateInfo.perPage = action.payload.per_page;
      state.parentsErrorPaginateInfo.totalPages = action.payload.last_page;
      state.parentsErrorPaginateInfo.page = action.payload.current_page;
    },
    fillPageNumSharedQuizParents: (state, action) => {
      state.pageSharedQuizNum = action.payload
    },
    fillPerPageNumSharedQuizParents: (state, action) => {
      state.perPageSharedQuizNum = action.payload
    },
    setSelectedSharedQuizQuestion: (state, action) => {
      state.selectedSharedQuizQuestion = action.payload
    },
    clearSelectedSharedQuizQuestion: (state, action) => {
      state.selectedSharedQuizQuestion = [];
    },
    setSelectedSharedWorkshopQuestion: (state, action) => {
      state.selectedSharedWorkshopQuestion = action.payload
    },
    clearSelectedSharedWorkshopQuestion: (state, action) => {
      state.selectedSharedWorkshopQuestion = [];
    },
  },
});

export const { setParentsListingLoading, setSelectedQuestion, clearSelectedQuestion, fillParentsList, fillParentsDetails, fillCewListData, fillGenderData, fillGradeData, fillAgeData, fillErrorData, fillVillageValue, fillSupervisorValue, fillCewValue, fillStartDateValue, fillEndDateValue, fillSchoolList, fillRelationshipList, setBulkImportLoading, setBulkLoading, setparentLoader, fillPageNumParents, fillPerPageNumParents, fillDistrictIds, fillBlockZoneIds, fillPanchayatWardIds, fillVillageAreaIds, fillParentsListAddedData, fillParentsAddedData, fillParentsErrorData, fillSharedQuizList,
  fillPageNumSharedQuizParents, fillPerPageNumSharedQuizParents, setSelectedSharedQuizQuestion, clearSelectedSharedQuizQuestion, fillSharedWorkshopList,
  setSelectedSharedWorkshopQuestion, clearSelectedSharedWorkshopQuestion

} = ParentsSlice.actions;
export default ParentsSlice.reducer;
