import { toast } from "react-toastify";
import { fillBlockDetails, fillBlockList, fillDistrictName, fillPageNum, fillPerPageNum, setLoading } from "./blockSlice";
import axiosInstance from "../../../config/Axios";
import { setDistrictloading } from "../../Districts/duck/DistrictsSlice";


export const getBlockList = (params) => async (dispatch) => {

  const url = `/v1/master/block-zones/list?page=${params.page}&per_page=${params.per_page}`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url,params);
		dispatch(fillBlockList(response?.data?.data));
		dispatch(fillPageNum(params.page));
		dispatch(fillPerPageNum(params.per_page))
		dispatch(setLoading(false));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response;
	}
};


export const getBlockDetails = (params) => async (dispatch) => {
  const url = `/v1/master/block-zone/detail-page/${params.id}`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setLoading(false));

		dispatch(fillBlockDetails(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response;
	}
};
export const getDistrictName = (params) => async (dispatch) => {
  const url = `/v1/master/districts/list-dropdown-master`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url,{"search":params});
		dispatch(setLoading(false));
	
		dispatch(fillDistrictName(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response;
	}
};

export const createBlock = (params) => async (dispatch) => {
	const url = `/v1/master/block-zone/create`;
	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url,params);
		dispatch(setLoading(false));
		toast.success("The block zone is created successfully");
		return response;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response;
	}
};

export const updateBlock = (params) => async (dispatch) => {
	const url = `/v1/master/block-zone/update`;
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


export const deleteBlock=(params) => async (dispatch) => {
	const url = `/v1/masters/block-zone/delete`;
	try {
	
		const response = await axiosInstance.post(url,params);
    toast.success(response?.data?.userMessageTitle)
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};

export const checkDependanceBlock=(params) => async (dispatch) =>{

  const url = `/v1/masters/block-zones/check-for-dependency`;
	try {
		const response = await axiosInstance.post(url,params);
		return response?.data;
	} catch (err) {
		// toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
}


export const exportBlockZone = (params) => async (dispatch) => {
	const url = '/v1/masters/block-zones/export';
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