import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  learningloading: false,
  learningData: [],
  learningDetails: [],
  statusValue: null,
  learningContentData: [],
  learningContentTypeData: [],
  learningContentValue: "",
  learningParentsData: [],
  learningContentParentsStatusData: [],
  learningContentParentsStatusValue: "",
  learningContentParentsPlatformData: [],
  learningContentParentsPlatformValue: "",
  startDateValue: null,
  endDateValue: null,
  contentPaginateInfo: {},
  paginateInfo: {}
};

export const LearningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    setLearnnigLoading: (state, action) => {
      state.learningloading = action.payload;
    },
    fillLearningData: (state, action) => {
      state.learningData = action.payload;
    },
    fillLearningStatusValue: (state, action) => {
      state.statusValue = action.payload
    },
    fillLearningDetails: (state, action) => {
      state.learningDetails = action.payload
    },
    fillLearningContentList: (state, action) => {
      state.learningContentData = action.payload;
      state.contentPaginateInfo.total = action.payload.meta.total;
      state.contentPaginateInfo.perPage = action.payload.meta.per_page;
      state.contentPaginateInfo.totalPages = action.payload.meta.last_page;
      state.contentPaginateInfo.page = action.payload.meta.current_page;
    },
    fillLearningContentTypeData: (state, action) => {
      state.learningContentTypeData = action.payload
    },
    fillLearningContentTypeValue: (state, action) => {
      state.learningContentValue = action.payload
    },
    fillLearningParents: (state, action) => {
      state.learningParentsData = action.payload;
      state.paginateInfo.total = action.payload.meta.total;
      state.paginateInfo.perPage = action.payload.meta.per_page;
      state.paginateInfo.totalPages = action.payload.meta.last_page;
      state.paginateInfo.page = action.payload.meta.current_page;
    },
    fillLearningContentParentsStatusData: (state, action) => {
      state.learningContentParentsStatusData = action.payload
    },
    fillLearningContentParentsStatusValue: (state, action) => {
      state.learningContentParentsStatusValue = action.payload
    },
    fillLearningContentParentsPlatformData: (state, action) => {
      state.learningContentParentsPlatformData = action.payload
    },
    fillLearningContentParentsPlatformValue: (state, action) => {
      state.learningContentParentsPlatformValue = action.payload
    },
    fillLearningContentStartDateValue: (state, action) => {
      state.startDateValue = action.payload
    },
    fillLearningContentEndDateValue: (state, action) => {
      state.endDateValue = action.payload
    }
  },
});

export const { setLearnnigLoading, fillLearningData, fillLearningStatusValue, fillLearningDetails, fillLearningContentList, fillLearningContentTypeData, fillLearningContentTypeValue, fillLearningParents,
  fillLearningContentParentsStatusData, fillLearningContentParentsStatusValue, fillLearningContentParentsPlatformData, fillLearningContentParentsPlatformValue, fillLearningContentStartDateValue, fillLearningContentEndDateValue } = LearningSlice.actions;
export default LearningSlice.reducer;
