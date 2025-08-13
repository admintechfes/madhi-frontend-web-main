import { toast } from 'react-toastify';
import axiosInstance from '../../../config/Axios';
import { fillWorkshopContentList, setQuizCreateLoading, setQuizDetails, setWorkshopContentDetailsLoading, setWorkshopContentListLoading, setWorkshopUploadMediaLoading } from './workshopContentSlice';
import { hideLoader, showLoader } from '../../../components/Loader/duck/loaderSlice';

export const getWorkshopContentList = (params) => async (dispatch) => {
	let url = `v1/workshops/${params.workshopId}`;

	try {
		dispatch(setWorkshopContentListLoading(true));
		const response = await axiosInstance.post(url, { ...params, withoutPagination: 1 });
		dispatch(setWorkshopContentListLoading(false));
		dispatch(fillWorkshopContentList(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setWorkshopContentListLoading(false));
		return err.response?.data;
	}
};

export const createQuiz = (params) => async (dispatch) => {
	let url = `/v1/workshop-user-quizzes/create/user-quiz`;
	try {
		dispatch(setQuizCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setQuizCreateLoading(false));
		toast.success(response?.data?.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setQuizCreateLoading(false));
		return err.response?.data;
	}
};

export const updateQuiz = (id, params) => async (dispatch) => {
	let url = `/v1/workshop-user-quizzes/update/${id}`;
	try {
		dispatch(setQuizCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setQuizCreateLoading(false));
		toast.success(response?.data?.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setQuizCreateLoading(false));
		return err.response?.data;
	}
};

export const getWorkshopContentQuizDetail = (id) => async (dispatch) => {
	let url = `/v1/workshop-user-quizzes/${id}`;

	try {
		dispatch(setWorkshopContentDetailsLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setWorkshopContentDetailsLoading(false));
		dispatch(setQuizDetails(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setWorkshopContentDetailsLoading(false));
		return err.response?.data;
	}
};

export const createObservationForm = (params) => async (dispatch) => {
	let url = `/v1/workshop-observation-forms/create/observation-form`;
	try {
		dispatch(setQuizCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setQuizCreateLoading(false));
		toast.success(response?.data?.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setQuizCreateLoading(false));
		return err.response?.data;
	}
};

export const updateObservationForm = (id, params) => async (dispatch) => {
	let url = `/v1/workshop-observation-forms/update/${id}`;
	try {
		dispatch(setQuizCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setQuizCreateLoading(false));
		toast.success(response?.data?.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setQuizCreateLoading(false));
		return err.response?.data;
	}
};

export const getWorkshopContentObservationFormsDetail = (id) => async (dispatch) => {
	let url = `/v1/workshop-observation-forms/${id}`;

	try {
		dispatch(setWorkshopContentDetailsLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setWorkshopContentDetailsLoading(false));
		dispatch(setQuizDetails(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setWorkshopContentDetailsLoading(false));
		return err.response?.data;
	}
};

export const workshopUploadMedia = (files) => async (dispatch) => {
	let url = `/v1/workshops/upload/media`;
	try {
		//dispatch(setWorkshopUploadMediaLoading(true));
		const response = await axiosInstance.post(url, files);

		//dispatch(setWorkshopUploadMediaLoading(false));
		return response?.data;
	} catch (err) {
		//dispatch(setWorkshopUploadMediaLoading(false));
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};

export const deleteContent = (id, type) => async (dispatch) => {
	let url = `/v1/${type}/delete/${id}`;

	try {
		dispatch(setWorkshopContentDetailsLoading(true))
		const response = await axiosInstance.post(url);
		dispatch(setWorkshopContentDetailsLoading(false))
		toast.success(response?.data.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setWorkshopContentDetailsLoading(false))
		return err.response?.data;
	}
};
