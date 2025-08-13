import { toast } from 'react-toastify';
import axiosInstance from '../../config/Axios';

import { fillInboundCallerName, fillInboundList, fillinboundStatus, setInboundListingLoading} from './inboundSlice';

export const getInboundList = (params) => async (dispatch) => {
	let url = `/v1/communications/campaigns/inbound-ivrs/get/call-logs?page=${params.page}&perPage=${params.perPage}`;

	try {
		dispatch(setInboundListingLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setInboundListingLoading(false));
		dispatch(fillInboundList(response?.data?.data));
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setInboundListingLoading(false));
		return err.response?.data;
	}
};

export const syncInboundList = () => async (dispatch) => {
	let url = `/v1/communications/campaigns/inbound-ivrs/sync/call-logs`;
	try {
		const response = await axiosInstance.post(url);
		return response
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response
	}
};


export const getInboundStatus = () => async (dispatch) => {
	let url = `/v1/communications/campaigns/inbound-ivrs/get/master/status`;
	try {
		const response = await axiosInstance.post(url);
		dispatch(fillinboundStatus(response.data.data))
		return response
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response
	}
};

export const getUserList = (params) => async (dispatch) => {
	const url = `/v1/users/list?withoutPaginate=${true}`;
	try {
		const response = await axiosInstance.post(url, params);
		dispatch(fillInboundCallerName(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err?.response;
	}
};



