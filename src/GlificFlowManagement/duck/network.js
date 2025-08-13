import { toast } from 'react-toastify';
import axiosInstance from '../../config/Axios';
import { fillCampaingDetails, fillCampaingParentList, fillCampingList, fillGlificFlowNameList, fillTagsNameList, setLoadingCamping, setLoadingUser,fillPageNum,fillPerPageNum, fillWhatsAppStatus } from './glificFlowManagementSlice';

export const postManualWhatsAppCreate = (params) => async (dispatch) => {
	const url = '/v1/communications/campaigns/manual-whatsapp/create/campaign';
	try {
		dispatch(setLoadingCamping(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setLoadingCamping(false));
		if (response?.data?.statusCode == 200) {
			toast.success(response?.data?.userMessageTitle);
		}
		return response;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoadingCamping(false));
		return err?.response;
	}
};

export const getWhatsAppManualList = (params) => async (dispatch) => {
	const url = `/v1/communications/campaigns/manual-whatsapp/get/campaigns?page=${params.page}&perPage=${params.perPage}`;
	try {
		dispatch(setLoadingCamping(true));
		const response = await axiosInstance.post(url,params);
		dispatch(fillPageNum(params.page));
		dispatch(fillPerPageNum(params.perPage));
		dispatch(fillCampingList(response?.data?.data));
		dispatch(setLoadingCamping(false));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoadingCamping(false));
		return err?.response;
	}
};

export const getTagNameList = () => async (dispatch) => {
	const url = `/v1/communications/tags`;
	try {
		dispatch(setLoadingCamping(true));
		const response = await axiosInstance.post(url);
		dispatch(fillTagsNameList(response?.data));
		dispatch(setLoadingCamping(false));
		return response?.data;
	} catch (error) {
		toast.error(error?.response?.data?.userMessageTitle);
		dispatch(setLoadingCamping(false));
		return error?.response;
	}
};


export const getGlificFlowNameList = () => async (dispatch) => {
	const url = `/v1/communications/glific/flows`;
	try {
		dispatch(setLoadingCamping(true));
		const response = await axiosInstance.post(url);
		dispatch(fillGlificFlowNameList(response?.data));
		dispatch(setLoadingCamping(false));
		return response?.data;
	} catch (error) {
		toast.error(error?.response?.data?.userMessageTitle);
		dispatch(setLoadingCamping(false));
		return error?.response;
	}
};

export const getCampingDetails = (params) => async (dispatch) => {
	const url = `/v1/communications/campaigns/manual-whatsapp/get/campaign-details`;
	try {
		dispatch(setLoadingCamping(true));
		const response = await axiosInstance.post(url,{id:params.id});
		dispatch(fillCampaingDetails(response?.data?.data));
		dispatch(setLoadingCamping(false));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoadingCamping(false));
		return err?.response;
	}
};


export const getWhatsAppManualParentList = (params) => async (dispatch) => {
	const url = `/v1/communications/campaigns/manual-whatsapp/get/parent-details-by-campaign-id?page=${params.page}&per_page=${params.per_page}`;
	try {
		dispatch(setLoadingUser(true));
		const response = await axiosInstance.post(url,params);
		dispatch(fillCampaingParentList(response?.data?.data));
		dispatch(setLoadingUser(false));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoadingUser(false));
		return err?.response;
	}
};



export const getManualWhatsAppStatus = (params) => async (dispatch) => {
  let url = `/v1/program-progress/whatsapp-status-filter`
  
  try {
    dispatch(setLoadingUser(true));
    const response = await axiosInstance.post(url);
    dispatch(fillWhatsAppStatus(response?.data.data))
    dispatch(setLoadingUser(false));
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(setLoadingUser(false));
    return err?.response
  }
}


export const createTagManualcampaign = (params) => async () => {
	let url = `/v1/communications/tags/create`;
	try {
		const response = await axiosInstance.post(url, { ...params });
		toast.success("Successfully added the Tag")
		return response
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};