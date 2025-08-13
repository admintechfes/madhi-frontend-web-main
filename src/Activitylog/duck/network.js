import { toast } from "react-toastify";
import { fillActivityEvent, fillActivityParents, fillActivitySupervisorTeamMember, fillActivityTeamMember, fillActivityType, setLoading } from "./activitySlice";
import axiosInstance from "../../config/Axios";

export const getActivityTeamMemberList = (params) => async (dispatch) => {

	let url = `v1/activity-logs/team-member?page=${params.page}&perPage=${params.perPage}`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setLoading(false));
		dispatch(fillActivityTeamMember(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response?.data;
	}
};

export const getActivityTeamMemberSupervisorList = (params) => async (dispatch) => {

	let url = `/v1/activity-logs/senior-supervisor/${params.id}`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setLoading(false));
		dispatch(fillActivitySupervisorTeamMember(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response?.data;
	}
};

export const getActivityParentsList = (params) => async (dispatch) => {

	let url = `v1/activity-logs/parent/${params?.id}`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, { ...params })
		dispatch(fillActivityParents(response?.data?.data));
		dispatch(setLoading(false));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response?.data;
	}
};

export const getActivityTypeList = (params) => async (dispatch) => {
	let url = `/v1/activity-logs/activity-type`;

	try {
		const response = await axiosInstance.post(url, params);
		dispatch(fillActivityType(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};

export const getActivityEventList = (params) => async (dispatch) => {
	let url = `/v1/activity-logs/event-type`;

	try {
		const response = await axiosInstance.post(url, params);
		dispatch(fillActivityEvent(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};