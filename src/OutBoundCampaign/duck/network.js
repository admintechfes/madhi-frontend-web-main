import { toast } from "react-toastify";
import axiosInstance from "../../config/Axios";
import { fillIVRIDList, fillOutBoundCampaignList, fillOutBoundCampaignParentsList, fillOutboundCampaignDetails, fillOutboundParentSTatusData, fillOutboundProgramNameData, fillOutboundUnitNumberData, setOutboundCampaignListingLoading } from "./OutboundCampaignSlice";

export const getOutBoundCampaignList = (params) => async (dispatch) => {
	let url = `/v1/communications/campaigns/outbound-ivrs/get/campaigns?perPage=${params.perPage}`;

	try {
		dispatch(setOutboundCampaignListingLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setOutboundCampaignListingLoading(false));
		dispatch(fillOutBoundCampaignList(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setOutboundCampaignListingLoading(false));
		return err.response?.data;
	}
};

export const CreateOutboundIVRSCampaign = (params) => async (dispatch) => {
	const url = '/v1/communications/campaigns/outbound-ivrs/create/campaign/v1';
	try {
		dispatch(setOutboundCampaignListingLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setOutboundCampaignListingLoading(false));
		if (response?.data?.statusCode == 200) {
			toast.success(response?.data?.userMessageTitle);
		}
		return response;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setOutboundCampaignListingLoading(false));
		return err?.response;
	}
};


export const getOutBoundIVRIDList = (params) => async (dispatch) => {
	let url = `/v1/communications/campaigns/outbound-ivrs/get/master/ivrs-ids`;

	try {
		dispatch(setOutboundCampaignListingLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setOutboundCampaignListingLoading(false));
		dispatch(fillIVRIDList(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setOutboundCampaignListingLoading(false));
		return err.response?.data;
	}
};

export const getOutboundCampaignDetails = (params) => async (dispatch) => {
	let url
	if (params) {
		url = `/v1/communications/campaigns/outbound-ivrs/get/campaign-details`
	}
	try {
		dispatch(setOutboundCampaignListingLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setOutboundCampaignListingLoading(false))
		dispatch(fillOutboundCampaignDetails(response?.data?.data))
		return response?.data?.data
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle)
		dispatch(setOutboundCampaignListingLoading(false));
		return err?.response
	}
}


export const getOutBoundCampaignParentsList = (params) => async (dispatch) => {
	let url = `/v1/communications/campaigns/outbound-ivrs/get/parent-details-by-campaign-id?perPage=${params.perPage}`;

	try {
		dispatch(setOutboundCampaignListingLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setOutboundCampaignListingLoading(false));
		dispatch(fillOutBoundCampaignParentsList(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setOutboundCampaignListingLoading(false));
		return err.response?.data;
	}
};

export const getOutBoundParentStatusMaster = (params) => async (dispatch) => {
	let url = `/v1/communications/campaigns/outbound-ivrs/get/master/status`;

	try {
		dispatch(setOutboundCampaignListingLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setOutboundCampaignListingLoading(false));
		dispatch(fillOutboundParentSTatusData(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setOutboundCampaignListingLoading(false));
		return err.response?.data;
	}
};

export const getOutBoundParentProgramNameMaster = (params) => async (dispatch) => {
	let url = `/v1/training-progress/get-programs`;

	try {
		dispatch(setOutboundCampaignListingLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setOutboundCampaignListingLoading(false));
		dispatch(fillOutboundProgramNameData(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setOutboundCampaignListingLoading(false));
		return err.response?.data;
	}
};

export const getOutBoundParentUnitNumberMaster = (params) => async (dispatch) => {
	let url = `/v1/training-progress/get-program-units`;

	try {
		const response = await axiosInstance.post(url, params);
		dispatch(fillOutboundUnitNumberData(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};