import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	loading: true,
	permissionList: {
		srsupervisor: {},
		supervisor: {},
		cew: {},
	},
	loaderSubmit: false,
	permissionData: {},
};

export const PermissionSlice = createSlice({
	name: 'permission',
	initialState,
	reducers: {
		fillPermissionList: (state, action) => {
			state.permissionList[action.payload.roleType] = action.payload.response;
		},
		updatePermissionList: (state, action) => {
			let key = 'rolePermissions';
			state.permissionList[action.payload.tabType][action.payload.listName][key] = action.payload.list;
		},
		resetPermissionList: (state) => {
			state.permissionList = {
				srsupervisor: {},
				supervisor: {},
				cew: {},
			};
		},
		setloaderSubmit: (state, action) => {
			state.loaderSubmit = action.payload;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
	},
});

export const { fillPermissionList, setLoading, setloaderSubmit,updatePermissionList, resetPermissionList } = PermissionSlice.actions;
export default PermissionSlice.reducer;
