import { toast } from "react-toastify";
import { fillPageNum, fillPerPageNum, fillVillageDetails, fillVillageErrorData, fillVillageList, fillVillageMasterListData, fillVillageSuccessListAddedData, fillWhatsAppGroupInfo, fillWhatsAppGroupStatusList, setBulkLoading, setLoading, setStatusLoading } from "./VillageSlice";
import axiosInstance from "../../../config/Axios";


export const getVillageList = (params) => async (dispatch) => {
  const url = `/v1/master/village-areas/list?page=${params.page}&per_page=${params.per_page}`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url,params);
		dispatch(setLoading(false));
		dispatch(fillPageNum(params.page));
		dispatch(fillPerPageNum(params.per_page))
		dispatch(fillVillageList(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response;
	}
};


export const getVillageDetails = (params) => async (dispatch) => {
  const url = `/v1/master/village-area/detail-page/${params.id}`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setLoading(false));
		dispatch(fillVillageDetails(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		dispatch(setLoading(false));
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};



export const createVillage = (params) => async (dispatch) => {
	const url = `/v1/master/village-area/create`;
	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url,params);
		toast.success("The village area is created successfully");
		dispatch(setLoading(false));
		return response;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response;
	}
};



export const updateVillage = (params) => async (dispatch) => {
	const url = `/v1/master/village-area/update`;
	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url,params);
		toast.success("The info is saved successfully");
		dispatch(setLoading(false));
		return response;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response;
	}
};


export const deleteVillage=(params) => async (dispatch) => {
	const url = `/v1/masters/village-area/delete`;
	try {
		const response = await axiosInstance.post(url,params);
    toast.success(response?.data?.userMessageTitle)
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};


export const checkDependanceVillage=(params) => async (dispatch) =>{

  const url = `/v1/masters/village-areas/check-for-dependency`;
	try {
		const response = await axiosInstance.post(url,params);
		return response?.data;
	} catch (err) {
		// toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
}


export const getGroupWhatsAppStatusList = (params) => async (dispatch) => {
  const url = `/v1/master/village-areas/check-whatsapp-group-status?page=${params.page}&per_page=${params.per_page}`;

	try {
		dispatch(setStatusLoading(true));
		const response = await axiosInstance.post(url,params);
		dispatch(setStatusLoading(false));
		dispatch(fillWhatsAppGroupStatusList(response?.data?.data?.original?.usersStatus))
		dispatch(fillWhatsAppGroupInfo(response?.data?.data?.original?.groupInfo))
		return response?.data?.data?.original?.usersStatus;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setStatusLoading(false));
		return err.response;
	}
};


export const VillageGroupWhatsAppStatusAction = (params) => async (dispatch) => {
	const url = `/v1/master/village-areas/assign-group-admin-role`;
	try {
		const response = await axiosInstance.post(url,params);
    toast.success(response?.data?.data?.original?.original?.message)
		return response;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};


export const BulkUploadVillageMaster = (files) => async (dispatch) => {
	let url = `/v1/masters/bulk_upload_location/import`;
	try {
		dispatch(setBulkLoading(true));
		const response = await axiosInstance.post(url, files);
		dispatch(setBulkLoading(false));
		toast.success(response?.data?.userMessageTitle)
		return response
	} catch (err) {
		if (err.response?.data.statusCode === 401 || err.response?.data.statusCode >= 500) toast.error(err?.response?.data?.statusCode);
		dispatch(setBulkLoading(false));
		return err.response?.data;
	}
};

export const BulkUploadVillageMasterList = (params) => async (dispatch) => {
	let url = `/v1/masters/bulk_upload_location/list?page=${params.page}&per_page=${params.per_page}`;
	try {
		dispatch(setStatusLoading(true))
		const response = await axiosInstance.post(url, params);
		dispatch(setStatusLoading(false))
		dispatch(fillVillageMasterListData(response?.data?.data))
		return response?.data?.data?.original
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setStatusLoading(false))
		return err.response?.data;
	}
};


export const BulkUploadVillageSuccessList = (params) => async (dispatch) => {
	let url = `/v1/masters/bulk_upload_location/success-list?page=${params.page}&per_page=${params.per_page}`;
	try {
		dispatch(setStatusLoading(true))
		const response = await axiosInstance.post(url, params);
		dispatch(setStatusLoading(false))
		dispatch(fillVillageSuccessListAddedData(response?.data?.data))
		return response?.data?.data
	} catch (err) {
		dispatch(setStatusLoading(false))
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};

export const BulkUploadVillageErrorList = (params) => async (dispatch) => {
	let url = `/v1/masters/bulk_upload_location/failed-list?page=${params.page}&per_page=${params.per_page}`;
	try {
		dispatch(setStatusLoading(true))
		const response = await axiosInstance.post(url, params);
		dispatch(setStatusLoading(false))
		dispatch(fillVillageErrorData(response?.data?.data))
		return response?.data?.data
	} catch (err) {
		dispatch(setStatusLoading(false))
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};


export const exportVillageArea = (params) => async (dispatch) => {
	const url = '/v1/masters/village-areas/export';
	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setLoading(false));
		if (response?.data?.statusCode == 200) {
			toast.success(response?.data?.userMessageTitle);
		}
		return response;
	} catch (error) {
		toast.error(error?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return error?.response;
	}
};