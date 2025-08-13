import { toast } from 'react-toastify';
import axiosInstance from '../../../../config/Axios';
import { hideTableLoader, showTableLoader } from '../../../../components/Loader/duck/loaderSlice';
import { fillSurveyData, fillSurveyDetails, fillSurveyParents, fillSurveyPreview, fillSurveyProgressStatus, setSurveyParentLoading, setSurveyProgressLoading } from './surveySlice';

export const getSurveyList = (params) => async (dispatch) => {
	let url;
	if (params) {
		url = `v1/survey-progress`;
	}
	try {
		dispatch(showTableLoader(true));
		const response = await axiosInstance.post(url, params);
		dispatch(hideTableLoader(false));
		dispatch(fillSurveyData(response?.data));
		return response?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		dispatch(hideTableLoader(false));
		return err?.response;
	}
};
export const getSurveyProgressStatus = () => async (dispatch) => {
	let url = `v1/survey-progress/status`;

	try {
		dispatch(setSurveyProgressLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setSurveyProgressLoading(false));
		dispatch(fillSurveyProgressStatus(response?.data?.data));
		return response?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		dispatch(setSurveyProgressLoading(false));

		return err?.response;
	}
};

export const getSurveyDetails = (params) => async (dispatch) => {
	let url;
	if (params) {
		url = `v1/survey-progress/survey`;
	}
	try {
		dispatch(showTableLoader(true));
		const response = await axiosInstance.post(url, params);
		dispatch(hideTableLoader(false));
		dispatch(fillSurveyDetails(response?.data.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		dispatch(hideTableLoader(false));
		return err?.response;
	}
};

export const getSurveyParentList = (params) => async (dispatch) => {
	let url = 'v1/survey-progress/parents';
	if (params) {
		url = `v1/survey-progress/parents?page=${params.page}&perPage=${params.perPage}`;
	}
	try {
		dispatch(setSurveyParentLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(fillSurveyParents(response?.data?.data));
		dispatch(setSurveyParentLoading(false));
		return response?.data?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		// dispatch(fillSurveyParents({}));
		dispatch(setSurveyParentLoading(false));
		return err?.response?.data;
	}
};
export const getSurveyChildrenList = (params) => async (dispatch) => {
	let url = 'v1/survey-progress/children';
	if (params) {
		url = `v1/survey-progress/children?page=${params.page}&perPage=${params.perPage}`;
	}
	try {
		dispatch(setSurveyParentLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(fillSurveyParents(response?.data?.data));
		dispatch(setSurveyParentLoading(false));
		return response?.data?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		// dispatch(fillSurveyParents({}));
		dispatch(setSurveyParentLoading(false));
		return err?.response?.data;
	}
};
export const getSurveyPreview = (params) => async (dispatch) => {
	let url = '/v1/app/program-progress/surveys/get-submitted-survey';

	try {
		// dispatch(setSurveyParentLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(fillSurveyPreview(response?.data?.data));
		// dispatch(setSurveyParentLoading(false));
		return response?.data?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		
		dispatch(setSurveyParentLoading(false));
		return err?.response;
	}
};

export const submitSurveyQuestionnaire = (params) => async (dispatch) => {
	let url = '/v1/survey-progress/submit';

	try {
		// dispatch(setSurveyParentLoading(true));
		const response = await axiosInstance.post(url, params);
		toast.success(response?.data?.userMessageTitle)
		return response?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		dispatch(setSurveyParentLoading(false));
		return err?.response;
	}
};
