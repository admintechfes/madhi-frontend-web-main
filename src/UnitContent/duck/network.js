import { toast } from 'react-toastify';
import axiosInstance from '../../config/Axios';
import { fillUnitContentList, setQuizCreateLoading, setQuizDetails, setUnitContentDetailsLoading, setWorkshopCreateLoading, setunitContentListLoading, setSurveyCreateLoading, setSurveyDetails, setLearningActivityDetails, setUnitContentFormDataLoading, setUnitContentFormData, setVisitInviteType } from './unitContentSlice';
import { duplicateLoader, hideTableLoader, showTableLoader } from '../../components/Loader/duck/loaderSlice';

export const getUnitContentList = (params) => async (dispatch) => {
	let url = `/v1/program-units/${params.programUnitId}`;

	try {
		dispatch(setunitContentListLoading(true));
		const response = await axiosInstance.post(url, { ...params, withoutPagination: 1 });
		dispatch(setunitContentListLoading(false));
		dispatch(fillUnitContentList(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setunitContentListLoading(false));
		return err.response?.data;
	}
};

export const createWorkshop = (params) => async (dispatch) => {
	let url = `/v1/workshops/create/workshop`;
	try {
		dispatch(setWorkshopCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setWorkshopCreateLoading(false));
		toast.success(response?.data?.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setWorkshopCreateLoading(false));
		return err.response?.data;
	}
};

export const updateWorkshop = (id, params) => async (dispatch) => {
	let url = `/v1/workshops/update/${id}`;
	try {
		dispatch(setWorkshopCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setWorkshopCreateLoading(false));
		toast.success(response?.data?.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setWorkshopCreateLoading(false));
		return err.response?.data;
	}
};

export const createQuiz = (params) => async (dispatch) => {
	let url = `/v1/quizzes/create/quiz`;
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
	let url = `/v1/quizzes/update/${id}`;
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

export const getUnitContentQuizDetail = (id) => async (dispatch) => {
	let url = `/v1/quizzes/${id}`;

	try {
		dispatch(setUnitContentDetailsLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setUnitContentDetailsLoading(false));
		dispatch(setQuizDetails(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setUnitContentDetailsLoading(false));
		return err.response?.data;
	}
};

export const createSurvey = (params) => async (dispatch) => {
	let url = `/v1/meeting-surveys/create/survey`;
	try {
		dispatch(setSurveyCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setSurveyCreateLoading(false));
		toast.success(response?.data?.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setSurveyCreateLoading(false));
		return err.response?.data;
	}
};

export const updateSurvey = (id, params) => async (dispatch) => {
	let url = `/v1/meeting-surveys/update/${id}`;
	try {
		dispatch(setSurveyCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setSurveyCreateLoading(false));
		toast.success(response?.data?.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setSurveyCreateLoading(false));
		return err.response?.data;
	}
};

export const getUnitContentSurveyDetail = (id) => async (dispatch) => {
	let url = `/v1/meeting-surveys/${id}`;

	try {
		dispatch(setUnitContentDetailsLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setUnitContentDetailsLoading(false));
		dispatch(setSurveyDetails(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setUnitContentDetailsLoading(false));
		return err.response?.data;
	}
};

export const toggleContentVisibility = (id) => async (dispatch) => {
	let url = `/v1/program-units/contents/${id}/toggle-visibility`;

	try {
		// dispatch(showTableLoader())
		const response = await axiosInstance.post(url);
		// dispatch(hideTableLoader())
		toast.success(response?.data?.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		// dispatch(hideTableLoader())
		return err.response?.data;
	}
};

export const learningActivityUploadMedia = (files) => async (dispatch) => {
	let url = `/v1/learning-activity-contents/upload/media`;
	try {
		const response = await axiosInstance.post(url, files);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};

export const createLearningActivity = (params) => async (dispatch) => {
	let url = `/v1/learning-activity-contents/create/content`;
	try {
		dispatch(setSurveyCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setSurveyCreateLoading(false));
		toast.success(response?.data?.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setSurveyCreateLoading(false));
		return err.response?.data;
	}
};

export const getUnitContentLearningActivityDetail = (id) => async (dispatch) => {
	let url = `/v1/learning-activity-contents/${id}`;

	try {
		dispatch(setUnitContentDetailsLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setUnitContentDetailsLoading(false));
		dispatch(setLearningActivityDetails(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setUnitContentDetailsLoading(false));
		return err.response?.data;
	}
};

export const updateLearningActivity = (id, params) => async (dispatch) => {
	let url = `/v1/learning-activity-contents/update/${id}`;
	try {
		dispatch(setSurveyCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setSurveyCreateLoading(false));
		toast.success(response?.data?.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setSurveyCreateLoading(false));
		return err.response?.data;
	}
};

export const deleteContent = (id, type) => async (dispatch) => {
	let url = `/v1/${type}/delete/${id}`;

	try {
		dispatch(setUnitContentDetailsLoading(true))
		const response = await axiosInstance.post(url);
		dispatch(setUnitContentDetailsLoading(false))
		toast.success(response?.data.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setUnitContentDetailsLoading(false))
		return err.response?.data;
	}
};

export const duplicateContent = (id, params) => async (dispatch) => {
	let url = `/v1/program-unit-contents/replicate/${id}`;

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

export const getUnitContentFormData = (params) => async (dispatch) => {
	let url = `/v1/program-unit-contents/get-submitted`;

	try {
		dispatch(setUnitContentFormDataLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setUnitContentFormDataLoading(false));
		dispatch(setUnitContentFormData(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setUnitContentFormDataLoading(false))
		return err.response?.data;
	}
};

export const submitUnitContentFormData = (params) => async (dispatch) => {
	let url = `/v1/program-unit-contents/submit`;

	try {
		dispatch(duplicateLoader(false))
		const response = await axiosInstance.post(url, params);
		dispatch(duplicateLoader(false))
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(duplicateLoader(false))
		return err.response?.data;
	}
};

export const createVisit = (params) => async (dispatch) => {
	let url = `/v1/visits/create/visit`;
	try {
		dispatch(setSurveyCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setSurveyCreateLoading(false));
		toast.success(response?.data?.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setSurveyCreateLoading(false));
		return err.response?.data;
	}
};

export const updateVisit = (id, params) => async (dispatch) => {
	let url = `/v1/visits/update/${id}`;
	try {
		dispatch(setSurveyCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setSurveyCreateLoading(false));
		toast.success(response?.data?.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setSurveyCreateLoading(false));
		return err.response?.data;
	}
};

export const getUnitContentVisitDetail = (id) => async (dispatch) => {
	let url = `/v1/visits/${id}`;

	try {
		dispatch(setUnitContentDetailsLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setUnitContentDetailsLoading(false));
		dispatch(setSurveyDetails(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setUnitContentDetailsLoading(false));
		return err.response?.data;
	}
};

export const getVisitInviteType = () => async (dispatch) => {
	let url = `/v1/visit-progress/visit-type`;

	try {
		//dispatch(setUnitContentDetailsLoading(true));
		const response = await axiosInstance.post(url);
		// dispatch(setUnitContentDetailsLoading(false));
		dispatch(setVisitInviteType(response?.data?.data))
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		// dispatch(setUnitContentDetailsLoading(false));
		return err.response?.data;
	}
};