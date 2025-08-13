import { toast } from "react-toastify";
import axiosInstance from "../../config/Axios";
import { fillNotificationClickStatus, fillNotificationData, fillNotificationDetails, fillNotificationMembersList, setLoading } from "./notificationSlice";

export const getNotificationList = (params) => async (dispatch) => {
	let url = `/v1/communications/campaigns/manual-notification/notifications?page=${params.page}&perPage=${params.perPage}`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setLoading(false));
		dispatch(fillNotificationData(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response?.data;
	}
};

export const CreateNotficationCampaign = (params) => async (dispatch) => {
	const url = '/v1/communications/campaigns/manual-notification/create-notification';
	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setLoading(false));
		if (response?.data?.statusCode == 200) {
			toast.success(response?.data?.userMessageTitle);
		}
		return response;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err?.response;
	}
};


export const getNotificationDetails = (params) => async (dispatch) => {
	let url
	if (params) {
		url = `/v1/communications/campaigns/manual-notification/notification-detail`
	}
	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setLoading(false))
		dispatch(fillNotificationDetails(response?.data?.data))
		return response?.data?.data
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle)
		dispatch(setLoading(false));
		return err?.response
	}
}

export const getNotificationMembersList = (params) => async (dispatch) => {
	let url = `/v1/communications/campaigns/manual-notification/members?page=${params.page}perPage=${params.perPage}`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setLoading(false));
		dispatch(fillNotificationMembersList(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response?.data;
	}
};


export const getNotificationClickStatus = (params) => async (dispatch) => {
	let url = `/v1/communications/campaigns/manual-notification/click-status`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setLoading(false));
		dispatch(fillNotificationClickStatus(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response?.data;
	}
};