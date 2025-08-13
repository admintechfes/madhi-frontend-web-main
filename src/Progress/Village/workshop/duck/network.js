import { toast } from 'react-toastify';
import {
	fillWorkshopChildList,
	fillWorkshopData,
	fillWorkshopDetails,
	fillWorkshopPreviewForm,
	fillWorkshopPreviewQuiz,
	fillWorkshopSessionDetails,
	fillWorkshopSessionQuizAttendanceList,
	fillWorkshopSessionQuizList,
	fillWorkshopSessionQuizStatusList,
	fillWorkshopSessionStatusList,
	fillWorkshopSessions,
} from './workshopSlice';
import { hideTableLoader, showTableLoader } from '../../../../components/Loader/duck/loaderSlice';
import axiosInstance from '../../../../config/Axios';
import { setSurveyProgressLoading } from '../../survey/duck/surveySlice';

export const getWorkshopList = (params) => async (dispatch) => {
	let url = `/v1/workshop-progress`;
	if (params) {
		url = `/v1/workshop-progress`;
	}
	try {
		dispatch(showTableLoader(true));
		const response = await axiosInstance.post(url, params);
		dispatch(hideTableLoader(false));
		dispatch(fillWorkshopData(response?.data));
		return response?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		dispatch(hideTableLoader(false));
		return err?.response;
	}
};

export const getWorkshopSessionList = (params) => async (dispatch) => {
	let url = `/v1/workshop-progress/get-sessions?page=${params.page}&perPage=${params.perPage}`;

	try {
		dispatch(showTableLoader(true));
		const response = await axiosInstance.post(url, params);
		dispatch(hideTableLoader(false));
		dispatch(fillWorkshopSessions(response?.data?.data));
		return response?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		dispatch(hideTableLoader(false));
		return err?.response;
	}
};

export const getWorkshopDetails = (params) => async (dispatch) => {
	let url;
	if (params) {
		url = `v1/workshop-progress/get-details`;
	}
	try {
		dispatch(showTableLoader(true));
		const response = await axiosInstance.post(url, params);
		dispatch(hideTableLoader(false));
		dispatch(fillWorkshopDetails(response?.data.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		dispatch(hideTableLoader(false));
		return err?.response;
	}
};

export const getWorkshopSessionDetails = (params) => async (dispatch) => {
	let url;
	if (params) {
		url = `v1/workshop-progress/get-session-details`;
	}
	try {
		dispatch(showTableLoader(true));
		const response = await axiosInstance.post(url, params);
		dispatch(hideTableLoader(false));
		dispatch(fillWorkshopSessionDetails(response?.data.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		dispatch(hideTableLoader(false));
		return err?.response;
	}
};

export const getWorkshopSessionStatusList = () => async (dispatch) => {
	let url = `v1/workshop-progress/get-session-status-filter`;

	try {
		// dispatch(setSurveyProgressLoading(true));
		const response = await axiosInstance.post(url);
		// dispatch(setSurveyProgressLoading(false));
		dispatch(fillWorkshopSessionStatusList(response?.data?.data));
		return response?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		dispatch(setSurveyProgressLoading(false));

		return err?.response;
	}
};

export const getWorkshopAttendanceList = () => async (dispatch) => {
	let url = `v1/workshop-progress/get-attendance-filter`;

	try {
		// dispatch(setSurveyProgressLoading(true));
		const response = await axiosInstance.post(url);
		// dispatch(setSurveyProgressLoading(false));
		dispatch(fillWorkshopSessionQuizAttendanceList(response?.data?.data));
		return response?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		// dispatch(setSurveyProgressLoading(false));

		return err?.response;
	}
};

export const getWorkshopQuizStatusList = () => async (dispatch) => {
	let url = `v1/workshop-progress/get-user-quiz=status-filter`;

	try {
		// dispatch(setSurveyProgressLoading(true));
		const response = await axiosInstance.post(url);
		// dispatch(setSurveyProgressLoading(false));
		dispatch(fillWorkshopSessionQuizStatusList(response?.data?.data));
		return response?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		// dispatch(setSurveyProgressLoading(false));

		return err?.response;
	}
};
export const getWorkshopSessionQuizList = (params) => async (dispatch) => {
	let url = `v1/workshop-progress/get-session-attendees-with-submitted-quiz?page=${params.page}&perPage=${params.perPage}`;

	try {
		// dispatch(setSurveyProgressLoading(true));
		const response = await axiosInstance.post(url, params);
		// dispatch(setSurveyProgressLoading(false));
		dispatch(fillWorkshopSessionQuizList(response?.data?.data));
		return response?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		dispatch(setSurveyProgressLoading(false));

		return err?.response;
	}
};
export const getObservationForm = (params) => async (dispatch) => {
	let url = `v1/workshop-progress/get-submitted-observation-form`;

	try {
		// dispatch(setSurveyProgressLoading(true));
		const response = await axiosInstance.post(url, params);
		// dispatch(setSurveyProgressLoading(false));
		dispatch(fillWorkshopPreviewForm(response?.data?.data));
		return response?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		dispatch(setSurveyProgressLoading(false));

		return err?.response;
	}
};
export const getWorkshopQuiz = (params) => async (dispatch) => {
	let url = `v1/workshop-progress/get-submitted-user-quiz`;

	
	try {
		// dispatch(setSurveyProgressLoading(true));
		const response = await axiosInstance.post(url, params);
		// dispatch(setSurveyProgressLoading(false));
		dispatch(fillWorkshopPreviewQuiz(response?.data?.data));
		return response?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		dispatch(setSurveyProgressLoading(false));

		return err?.response;
	}
};


export const getSessionChildrenList = (params) => async (dispatch) => {
	// /workshop-progress/get-session-attendees-with-submitted-quiz
	let url = 'v1/workshop-progress/get-session-attendees-children-with-submitted-quiz';
	if (params) {
		url = `v1/workshop-progress/get-session-attendees-children-with-submitted-quiz?page=${params.page}&perPage=${params.perPage}`;
	}
	try {
		dispatch(showTableLoader(true));
		const response = await axiosInstance.post(url, params);
		dispatch(fillWorkshopChildList(response?.data?.data));
		dispatch(hideTableLoader(false));
		return response?.data?.data;
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle);
		// dispatch(fillSurveyParents({}));
		dispatch(hideTableLoader(false));
		return err?.response?.data;
	}
};