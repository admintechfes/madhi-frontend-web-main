import { toast } from 'react-toastify';
import { fillCEWDelegateList, fillPageNum, fillPerPageNum, fillUserDetails, fillUserList, fillUserRoleNameList, setLoading, setLoadingUser } from './userSlice';
import axiosInstance from '../../config/Axios';

export const getUserList = (params) => async (dispatch) => {
	const url = `/v1/users/list?page=${params.page}&per_page=${params.per_page}`;
	try {
		dispatch(setLoadingUser(true));
		const response = await axiosInstance.post(url, params);
		dispatch(fillPageNum(params.page));
		dispatch(fillPerPageNum(params.per_page))
		dispatch(fillUserList(response?.data?.data));
		dispatch(setLoadingUser(false));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false))
		return err?.response;
	}
};

export const getUserDetails = (params) => async (dispatch) => {
	const url = `/v1/users/detail-page/${params.id}`;
	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(fillUserDetails(response?.data?.data));
		dispatch(setLoading(false));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err?.response;
	}
};

export const getUserRoleNameList = () => async (dispatch) => {
	const url = `/v1/users/roles/list`;
	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(fillUserRoleNameList(response?.data?.data));
		dispatch(setLoading(false));
		return response?.data?.data;
	} catch (error) {
		toast.error(error?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return error?.response;
	}
};

export const createUser = (params) => async (dispatch) => {
	const url = '/v1/users/create';
	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, { ...params, country_code: '+91' });
		dispatch(setLoading(false));
		if (response?.data?.statusCode == 200) {
			toast.success(response?.data?.userMessageTitle);
		}
		return response;
	} catch (error) {
		toast.error(error?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return error?.response;
	}
};
export const updateUser = (params) => async (dispatch) => {
	const url = '/v1/users/update';

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setLoading(false));
		if (response?.data?.statusCode == 200) {
			toast.success(response?.data?.userMessageTitle);
		}

		return response;
	} catch (error) {
		toast.error(error?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return error?.response;
	}
};
export const partialUpdateUser = (params) => async (dispatch) => {
	const url = '/v1/users/partial-update';

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setLoading(false));
		if (response?.data?.statusCode == 200) {
			toast.success(response?.data?.userMessageTitle);
		}

		return response;
	} catch (error) {
		toast.error(error?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return error?.response;
	}
};


export const changeSrPassword = (params) => async (dispatch) => {
	const url = `/v1/users/detail-page/${params.id}/change-password`;
	try {
		const response = await axiosInstance.post(url, params);

		if (response?.data?.statusCode == 200) {
			toast.success('Password changes successfully');
		}
		return response;
	} catch (error) {
		toast.error(error?.response?.data?.userMessageTitle);
		return error?.response;
	}
};

export const dependenceUserDelete = (params) => async (dispatch) => {
	const url = '';

	try {
		const response = await axiosInstance.post(url, params);
		toast.success(response.data?.userMessageTitle);
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};

export const deleteUser = (params) => async (dispatch) => {
	const url = `v1/users/delete`;
	try {
		const response = await axiosInstance.post(url, params);
		toast.success(response?.data?.userMessageTitle);
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};

export const checkDependanceTeamMember = (params) => async (dispatch) => {
	const url = `/v1/users/check-for-dependency`;
	try {
		const response = await axiosInstance.post(url, params);
		return response?.data;
	} catch (err) {
		return err.response;
	}
};

export const addDelegateAcces = (params) => async (dispatch) => {
	const url = `/v1/delegate-accesses/add`;
	try {
		const response = await axiosInstance.post(url, params);
		toast.success(response?.data?.userMessageTitle);
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};
export const deleteDelegateAcces = (params) => async (dispatch) => {
	const url = `/v1/delegate-accesses/delete/${params}`;
	try {
		const response = await axiosInstance.post(url);
		toast.success(response?.data?.userMessageTitle);
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};

export const getAccessDelegateList = (params) => async (dispatch) => {
	const url = '/v1/delegate-accesses/get';

	try {
		const response = await axiosInstance.post(url,params);
    dispatch(fillCEWDelegateList(response?.data?.data))
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};


export const exportMemberActivity = (params) => async (dispatch) => {
	const url = '/v1/export/programs/team-member/activity';
	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setLoading(false));
		if (response?.data?.statusCode == 200) {
			toast.success(response?.data?.userMessageTitle);
		}
		return response;
	} catch (error) {
		toast.error(error?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return error?.response;
	}
};