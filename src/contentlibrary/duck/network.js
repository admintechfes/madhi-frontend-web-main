import { toast } from 'react-toastify';
import axiosInstance from '../../config/Axios';
import { fillContentLibraryDetails, fillContentList, fillCreatedUser, fillTags, setContentListingLoading } from './contentlibrarySlice';



export const getContentLibraryList = (params) => async (dispatch) => {
	let url = ""
	if (params.per_page) {
		url = `/v1/content-libraries?page=${params.page}&perPage=${params.per_page}`;
	}
	else {
		url = `/v1/content-libraries?page=${params.page}`;
	}

	try {
		dispatch(setContentListingLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setContentListingLoading(false));
		dispatch(fillContentList(response?.data?.data));
		return response?.data.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setContentListingLoading(false));
		return err.response?.data;
	}
};

export const createQuestion = (params) => async () => {
	let url = `/v1/content-libraries/create/content-library`;
	try {
		const response = await axiosInstance.post(url, { ...params });
		toast.success(response?.data?.userMessageTitle)
		return response
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};


export const UpdateQuestion = (params) => async () => {
	let url = `/v1/content-libraries/update/${params.id}`;
	try {
		const response = await axiosInstance.post(url, { ...params });
		toast.success(response?.data?.userMessageTitle)
		return response
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};

export const deleteQuestion = (params) => async () => {
	let url = `/v1/content-libraries/delete/contents`;
	try {
		const response = await axiosInstance.post(url, params);
		toast.success(response?.data?.userMessageTitle)
		return response
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};


export const getContentLibraryDetails = (params) => async (dispatch) => {
	let url
	if (params) {
		url = `/v1/content-libraries/${params.id}`
	}
	try {
		dispatch(setContentListingLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setContentListingLoading(false));
		dispatch(fillContentLibraryDetails(response?.data.data))
		return response?.data?.data
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle)
		dispatch(setContentListingLoading(false));
		return err?.response
	}
}


export const getAllTags = (params) => async (dispatch) => {
	let url = `/v1/tags`;

	try {
		const response = await axiosInstance.post(url, { ...params });
		dispatch(fillTags(response?.data?.data));
		return response?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};

export const getCreatedByList = (params) => async (dispatch) => {
	const url = `/v1/users/list-dropdown`;
	try {
		const response = await axiosInstance.post(url);
		dispatch(fillCreatedUser(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};

export const createTag = (params) => async () => {
	let url = `/v1/tags/create/tag`;
	try {
		const response = await axiosInstance.post(url, { ...params });
		toast.success("Successfully added the Tag")
		return response
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};

export const ContentLibraryUploadMedia = (files) => async (dispatch) => {
	let url = `/v1/content-libraries/upload/media`;
	try {
		const response = await axiosInstance.post(url, files);
		return response?.data;
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};
