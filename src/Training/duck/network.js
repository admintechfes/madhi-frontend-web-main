import { toast } from 'react-toastify';
import axiosInstance from '../../config/Axios';

import { fillTainingAttendanceFilter, fillTrainingAttendeesList, filltrainingCreatedBy, fillTrainingDetails, fillTrainingList, filltrainingProgram, filltrainingProgramUnit, filltrainingStatus, setTrainingAttendeesListingLoading, setTrainingDetailsLoading, setTrainingListingLoading} from './trainingSlice';

export const getTrainingList = (params) => async (dispatch) => {
	let url = `/v1/training-progress?page=${params.page}&perPage=${params.perPage}`;

	try {
		dispatch(setTrainingListingLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setTrainingListingLoading(false));
		dispatch(fillTrainingList(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setTrainingListingLoading(false));
		return err.response?.data;
	}
};


export const getTrainingStatus = () => async (dispatch) => {
	let url = `/v1/training-progress/status`;
	try {
		const response = await axiosInstance.post(url);
		dispatch(filltrainingStatus(response.data.data))
		return response
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response
	}
};

export const getTrainingDetails = (id) => async (dispatch) => {
	let url = `/v1/training-progress/training`;

	try {
		dispatch(setTrainingDetailsLoading(true));
		const response = await axiosInstance.post(url, {trainingId:id});
		dispatch(setTrainingDetailsLoading(false));
		dispatch(fillTrainingDetails(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setTrainingDetailsLoading(false));
		return err.response?.data;
	}
};

export const getTrainingAttendeesList = (params) => async (dispatch) => {
	let url = `/v1/training-progress/attendees?page=${params.page}&perPage=${params.perPage}`;

	try {
		dispatch(setTrainingAttendeesListingLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setTrainingAttendeesListingLoading(false));
		dispatch(fillTrainingAttendeesList(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setTrainingAttendeesListingLoading(false));
		return err.response?.data;
	}
};

export const getProgramName = (params) => async (dispatch) => {
	let url = `/v1/training-progress/get-programs`;

	try {
		dispatch(setTrainingAttendeesListingLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setTrainingAttendeesListingLoading(false));
		dispatch(filltrainingProgram(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setTrainingAttendeesListingLoading(false));
		return err.response?.data;
	}
};


export const getProgramCreatedBy = (params) => async (dispatch) => {
	let url = `/v1/training-progress/created-by`;

	try {
		dispatch(setTrainingAttendeesListingLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setTrainingAttendeesListingLoading(false));
		dispatch(filltrainingCreatedBy(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setTrainingAttendeesListingLoading(false));
		return err.response?.data;
	}
};


export const getProgramUnit = (params) => async (dispatch) => {
	let url = `/v1/training-progress/get-program-units`;

	try {
		dispatch(setTrainingAttendeesListingLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setTrainingAttendeesListingLoading(false));
		dispatch(filltrainingProgramUnit(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setTrainingAttendeesListingLoading(false));
		return err.response?.data;
	}
};



export const getCEWAttendance = (params) => async (dispatch) => {
	let url = `/v1/training-progress/attendance-status`;

	try {
		dispatch(setTrainingAttendeesListingLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setTrainingAttendeesListingLoading(false));
		dispatch(fillTainingAttendanceFilter(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setTrainingAttendeesListingLoading(false));
		return err.response?.data;
	}
};




