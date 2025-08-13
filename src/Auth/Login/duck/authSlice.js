import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	loading: false,
	forgetLoader:false,
	user: {},
	role:{},
	permissions:{},
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUserData: (state, action) => {
			if(action.payload.user) state.user = action.payload.user;
			if(action.payload.role) state.role = action.payload.role;
			if(action.payload.permissions) state.permissions = action.payload.permissions;
		},
		resetUserData: (state) => {
			state.user = {};
			state.role = {};
			state.permissions = {}
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		
		setForgetLoader: (state, action) => {
			state.forgetLoader = action.payload;
		},
	},
});

export const { setUserData, resetUserData, setLoading,setForgetLoader } = authSlice.actions;

export default authSlice.reducer;