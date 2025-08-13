import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	unitListLoading: false,
  unitDetailLoading: false,
	unitCreateLoading:false,
	unitList: [],
  unitDetails:{},
	paginateInfo: {},
};

export const unitSlice = createSlice({
	name: 'unit',
	initialState,
	reducers: {
		fillUnitList: (state, action) => {
			state.unitList = action.payload.data;
			state.paginateInfo.total = action.payload.meta.total;
			state.paginateInfo.perPage = action.payload.meta.per_page;
			state.paginateInfo.totalPages = action.payload.meta.last_page;
			state.paginateInfo.page = action.payload.meta.current_page;
		},
		resetUnitList : (state, action) => {
			state.unitList = []
			state.paginateInfo = {}
		},
		setUnitListingLoading: (state, action) => {
			state.unitListLoading = action.payload;
		},
    fillUnitDetail:(state, action) => {
			state.unitDetails = action.payload;
		},
    setUnitDetailLoading: (state, action) => {
			state.unitDetailLoading = action.payload;
		},
		setUnitCreateLoading: (state, action) => {
			state.unitCreateLoading = action.payload;
		},
	},
});

export const { fillUnitList, setUnitListingLoading, fillUnitDetail, setUnitDetailLoading, setUnitCreateLoading, resetUnitList } = unitSlice.actions;
export default unitSlice.reducer;
