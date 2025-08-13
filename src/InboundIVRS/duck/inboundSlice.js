import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	inboundListLoading: true,
	inboundList: [],
	paginateInfo: {},
	inboundStatus:[],
	inboundStatusVal:null,
	inboundCallerRoleValue:null,
	inboundCallerName:null,
	inboundCallerNameValue:null,
};

export const inboundSlice = createSlice({
	name: 'inbound',
	initialState,
	reducers: {
		fillInboundList: (state, action) => {
			state.inboundList = action.payload.data;
			state.paginateInfo.total = action.payload.meta.total;
			state.paginateInfo.perPage = action.payload.meta.per_page;
			state.paginateInfo.totalPages = action.payload.meta.last_page;
			state.paginateInfo.page = action.payload.meta.current_page;
		},
		setInboundListingLoading: (state, action) => {
			state.inboundListLoading = action.payload;
		},
		fillinboundStatus:(state,action)=>{
			state.inboundStatus=action.payload
		},
		fillinboundStatusVal:(state,action)=>{
			state.inboundStatusVal=action.payload
		},
		fillInboundCallerRole:(state,action)=>{
			state.inboundCallerRoleValue=action.payload
		},
		fillInboundCallerName:(state,action)=>{
			state.inboundCallerName=action.payload.data
		},
		fillInboundCallerNameValue:(state,action)=>{
			state.inboundCallerNameValue=action.payload
		}
	},
});

export const { fillInboundList, setInboundListingLoading,fillinboundStatus,fillinboundStatusVal, fillInboundCallerRole, fillInboundCallerName, fillInboundCallerNameValue } = inboundSlice.actions;
export default inboundSlice.reducer;
