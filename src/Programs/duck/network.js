import { toast } from 'react-toastify';
import axiosInstance from '../../config/Axios';

import { fillProgramDetail, fillProgramList, fillProgramUnitProgressList, fillProgramUnitProgressVillageList, setProgramCreateLoading, setProgramDetailLoading, setProgramListingLoading, setProgramToggleLoading, setProgramUnitToggleLoading, setProgramUpdateDetailLoading } from './programSlice';
import { duplicateLoader } from '../../components/Loader/duck/loaderSlice';

export const getProgramList = (params) => async (dispatch) => {
	let url = `/v1/programs?page=${params.page}&perPage=${params.perPage}`;

	try {
		dispatch(setProgramListingLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setProgramListingLoading(false));
		dispatch(fillProgramList(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setProgramListingLoading(false));
		return err.response?.data;
	}
};

export const getProgramDetails = (id) => async (dispatch) => {
	let url = `/v1/programs/${id}`;

	try {
		dispatch(setProgramDetailLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setProgramDetailLoading(false));
		dispatch(fillProgramDetail(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setProgramDetailLoading(false));
		return err.response?.data;
	}
};

export const getProgramUpdateDetails = (id) => async (dispatch) => {
	let url = `/v1/programs/${id}`;

	try {
		dispatch(setProgramUpdateDetailLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setProgramUpdateDetailLoading(false));
		dispatch(fillProgramDetail(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setProgramUpdateDetailLoading(false));
		return err.response?.data;
	}
};

export const createProgram = (params) => async (dispatch) => {
	let url = `/v1/programs/create/program`;

	try {
		dispatch(setProgramCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setProgramCreateLoading(false));
		toast.success(response?.data.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setProgramCreateLoading(false));
		return err.response?.data;
	}
};

export const updateProgram = (id, params) => async (dispatch) => {
	let url = `/v1/programs/update/${id}`;

	try {
		dispatch(setProgramCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setProgramCreateLoading(false));
		toast.success(response?.data.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setProgramCreateLoading(false));
		return err.response?.data;
	}
};

export const getProgramUnitProgressList= (id, params) => async (dispatch) => {
	let url = `/v1/programs/${id}/village-areas-with-active-unit?page=${params.page}&per_page=${params.perPage}`;

	try {
		dispatch(setProgramDetailLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setProgramDetailLoading(false));
		dispatch(fillProgramUnitProgressList(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setProgramDetailLoading(false));
		return err.response?.data;
	}
};

export const toggleProgramStatus= (id, params) => async (dispatch) => {
	let url = `/v1/programs/${id}/toggle-status`;

	try {
		dispatch(setProgramToggleLoading(true))
		const response = await axiosInstance.post(url, params);
		dispatch(setProgramToggleLoading(false))
		toast.success(response?.data.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setProgramToggleLoading(false))
		return err.response?.data;
	}
};

export const toggleeProgramUnitStatus= (id, params) => async (dispatch) => {
	let url = `/v1/programs/${id}/toggle-unit-status`;

	try {
		dispatch(setProgramUnitToggleLoading(true))
		const response = await axiosInstance.post(url, params);
		dispatch(setProgramUnitToggleLoading(false))
		toast.success(response?.data.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setProgramUnitToggleLoading(false))
		return err.response?.data;
	}
};

export const deleteProgram= (id, params) => async (dispatch) => {
	let url = `/v1/programs/delete/${id}`;

	try {
		dispatch(setProgramToggleLoading(true))
		const response = await axiosInstance.post(url, params);
		dispatch(setProgramToggleLoading(false))
		toast.success(response?.data.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setProgramToggleLoading(false))
		return err.response?.data;
	}
};

export const duplicateProgram= (id, params) => async (dispatch) => {
	let url = `/v1/programs/replicate/${id}`;

	try {
		dispatch(duplicateLoader(true))
		const response = await axiosInstance.post(url, params);
		dispatch(duplicateLoader(false))
		toast.success(response?.data.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(duplicateLoader(false))
		return err.response?.data;
	}
};


export const ReleaseReport = (id, params) => async (dispatch) => {
	let url = `/v1/student-quiz-certificate-progress/village-release-report`;

	try {
		dispatch(setProgramCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setProgramCreateLoading(false));
		toast.success(response?.data.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setProgramCreateLoading(false));
		return err.response?.data;
	}
};


export const getProgramUnitProgressVillageList= (params) => async (dispatch) => {
	let url = `/v1/programs/${params?.id}/village-areas-with-active-admin?page=${params?.page}&per_page=${params?.per_page}`;

	try {
		dispatch(setProgramDetailLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setProgramDetailLoading(false));
		dispatch(fillProgramUnitProgressVillageList(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setProgramDetailLoading(false));
		return err.response?.data;
	}
};