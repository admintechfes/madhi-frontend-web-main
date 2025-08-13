import { toast } from 'react-toastify';
import axiosInstance from '../../config/Axios';

import { fillUnitDetail, fillUnitList, setUnitCreateLoading, setUnitDetailLoading, setUnitListingLoading} from './unitSlice';
import { duplicateLoader } from '../../components/Loader/duck/loaderSlice';

export const getUnitList = (params) => async (dispatch) => {
	let url = `/v1/program-units?page=${params.page}`;

	try {
		dispatch(setUnitListingLoading(true));
		const response = await axiosInstance.post(url, {...params});
		dispatch(setUnitListingLoading(false));
		dispatch(fillUnitList(response?.data?.data));
		return response?.data
	} catch (err) {
    if(err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle); 
		dispatch(setUnitListingLoading(false));
		return err.response?.data;
	}
};

export const getUnitDetails = (id) => async (dispatch) => {
	let url = `/v1/program-units/${id}`;

	try {
		dispatch(setUnitDetailLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setUnitDetailLoading(false));
		dispatch(fillUnitDetail(response?.data?.data));
		return response?.data
	} catch (err) {
    if(err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle); 
		dispatch(setUnitDetailLoading(false));
		return err.response?.data;
	}
};

export const createUnit = (params) => async (dispatch) => {
	let url = `/v1/program-units/create/program-unit`;
	try {
		dispatch(setUnitCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setUnitCreateLoading(false));
		toast.success(response?.data?.userMessageTitle)
		return response?.data
	} catch (err) {
    if(err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle); 
		dispatch(setUnitCreateLoading(false));
		return err.response?.data;
	}
};

export const updateUnit = (id,params) => async (dispatch) => {
	let url = `/v1/program-units/update/${id}`;
	try {
		dispatch(setUnitCreateLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setUnitCreateLoading(false));
		toast.success(response?.data?.userMessageTitle)
		return response?.data
	} catch (err) {
    if(err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle); 
		dispatch(setUnitCreateLoading(false));
		return err.response?.data;
	}
};

export const deleteUnit = (id, params) => async (dispatch) => {
	let url = `/v1/program-units/delete/${id}`;

	try {
		dispatch(setUnitCreateLoading(true))
		const response = await axiosInstance.post(url, params);
		dispatch(setUnitCreateLoading(false))
		toast.success(response?.data.userMessageTitle);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setUnitCreateLoading(false))
		return err.response?.data;
	}
};

export const duplicateUnit= (id, params) => async (dispatch) => {
	let url = `/v1/program-units/replicate/${id}`;

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
