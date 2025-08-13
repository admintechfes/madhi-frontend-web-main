import { toast } from "react-toastify";
import { fillPageNum, fillPanchayatDetails, fillPanchayatList, fillPerPageNum, setLoading } from "./panchayatSlice";
import axiosInstance from "../../../config/Axios";


export const getPanchayatList = (params) => async (dispatch) => {
  const url = `/v1/master/panchayat-wards/list?page=${params.page}&per_page=${params.per_page}`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url,params);
		dispatch(setLoading(false));   
		dispatch(fillPageNum(params.page));
		dispatch(fillPerPageNum(params.per_page))

		dispatch(fillPanchayatList(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response;
	}
};


export const getPanchayatDetails = (params) => async (dispatch) => {
  const url = `/v1/master/panchayat-ward/detail-page/${params.id}`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setLoading(false));

		dispatch(fillPanchayatDetails(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response;
	}
};


export const createPanchayat = (params) => async (dispatch) => {
	const url = `/v1/master/panchayat-ward/create`;
	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url,params);
		dispatch(setLoading(false));
		toast.success("The panchayat is created successfully");
		return response;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response;
	}
};



export const updatePanchayat = (params) => async (dispatch) => {
	const url = `/v1/master/panchayat-ward/update`;
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



export const deletePanchayat=(params) => async (dispatch) => {
	const url = `/v1/masters/panchayat-ward/delete`;
	try {
		const response = await axiosInstance.post(url,params);
    toast.success(response?.data?.userMessageTitle)
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};


export const checkDependancePanchayat=(params) => async (dispatch) =>{

  const url = `/v1/masters/panchayat-wards/check-for-dependency`;
	try {
		const response = await axiosInstance.post(url,params);
		return response?.data;
	} catch (err) {
		// toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
}


export const exportPanchayatWard = (params) => async (dispatch) => {
	const url = '/v1/masters/panchayat-wards/export';
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