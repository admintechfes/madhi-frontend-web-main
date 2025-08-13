import { toast } from "react-toastify";
import { fillAgeData, fillCewListData, fillErrorData, fillGenderData, fillGradeData, fillParentsAddedData, fillParentsDetails, fillParentsErrorData, fillParentsList, fillParentsListAddedData, fillRelationshipList, fillSchoolList, fillSharedQuizList, fillSharedWorkshopList, setBulkImportLoading, setBulkLoading, setParentsListingLoading, setparentLoader } from "./parentsSlice";
import axiosInstance from "../../config/Axios";

export const getParentsList = (params) => async (dispatch) => {
	let url = ""
	if (params.per_page) {
		url = `v1/parents/list?page=${params.page}&per_page=${params.per_page}`;
	}
	else {
		url = `v1/parents/list?page=${params.page}`;
	}

	try {
		dispatch(setParentsListingLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setParentsListingLoading(false));
		dispatch(fillParentsList(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setParentsListingLoading(false));
		return err.response?.data;
	}
};

export const getParentsDetails = (params) => async (dispatch) => {
	let url
	if (params) {
		url = `/v1/parents/detail-page/${params.id}`
	}
	try {
		dispatch(setParentsListingLoading(true));
		const response = await axiosInstance.post(url);
		dispatch(setParentsListingLoading(false));
		dispatch(fillParentsDetails(response?.data?.data))
		return response?.data?.data
	} catch (err) {
		toast.error(err.response?.data?.userMessageTitle)
		dispatch(setParentsListingLoading(false));
		return err?.response
	}
}

export const getCEWData = (params) => async (dispatch) => {
	const url = `/v1/users/list-dropdown`;
	try {
		const response = await axiosInstance.post(url, { ...params });
		dispatch(fillCewListData(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};

export const getGenderList = () => async (dispatch) => {
	const url = `v1/masters/genders/list`;
	try {
		const response = await axiosInstance.post(url);
		dispatch(fillGenderData(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};

export const getGradeList = () => async (dispatch) => {
	const url = `v1/masters/grades/list`;
	try {
		const response = await axiosInstance.post(url);
		dispatch(fillGradeData(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};

export const getAgeList = () => async (dispatch) => {
	const url = `v1/masters/age/list`;
	try {
		const response = await axiosInstance.post(url);
		dispatch(fillAgeData(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};


export const createParent = (params) => async (dispatch) => {
	let url = `/v1/parents/create`;
	try {
		dispatch(setparentLoader(true)
		)
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setparentLoader(false))
		toast.success(response?.data?.userMessageTitle)
		return response
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setparentLoader(false))
		return err.response?.data;
	}
};

export const UpdateParent = (params) => async (dispatch) => {
	let url = `/v1/parents/update`;
	try {
		dispatch(setparentLoader(true))
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setparentLoader(false))
		toast.success(response?.data?.userMessageTitle)
		return response
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setparentLoader(false))
		return err.response?.data;
	}
};

export const deleteParent = (params) => async () => {
	let url = `/v1/parents/delete`;
	try {
		const response = await axiosInstance.post(url, { id: params });
		toast.success(response?.data?.userMessageTitle)
		return response
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};



export const BulkUpload = (files) => async (dispatch) => {
	let url = `/v1/parents/import`;
	try {
		dispatch(setBulkImportLoading(true))
		const response = await axiosInstance.post(url, files);
		dispatch(setBulkImportLoading(false))
		toast.success(response?.data?.userMessageTitle)
		return response
	} catch (err) {
		if (err.response?.data.statusCode === 401 || err.response?.data.statusCode >= 500) toast.error(err?.response?.data?.statusCode);
		dispatch(setBulkImportLoading(false))
		return err.response?.data;
	}
};

export const BulkUploadList = (params) => async (dispatch) => {
	let url = `/v1/parents/bulk_upload/list?page=${params.page}&per_page=${params.per_page}`;
	try {
		dispatch(setBulkLoading(true))
		const response = await axiosInstance.post(url, params);
		dispatch(setBulkLoading(false))
		dispatch(fillParentsListAddedData(response?.data?.data))
		return response?.data?.data?.original
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setBulkLoading(false))
		return err.response?.data;
	}
};

export const BulkUploadSuccessist = (params) => async (dispatch) => {
	let url = `/v1/parents/bulk_upload/success-list?page=${params.page}&per_page=${params.per_page}`;
	try {
		dispatch(setBulkLoading(true))
		const response = await axiosInstance.post(url, params);
		dispatch(setBulkLoading(false))
		dispatch(fillParentsAddedData(response?.data?.data))
		return response?.data?.data
	} catch (err) {
		dispatch(setBulkLoading(false))
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};

export const BulkUploadErrorList = (params) => async (dispatch) => {
	let url = `/v1/parents/bulk_upload/failed-list?page=${params.page}&per_page=${params.per_page}`;
	try {
		dispatch(setBulkLoading(true))
		const response = await axiosInstance.post(url, params);
		dispatch(setBulkLoading(false))
		dispatch(fillParentsErrorData(response?.data?.data))
		return response?.data?.data
	} catch (err) {
		dispatch(setBulkLoading(false))
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		return err.response?.data;
	}
};


export const getSchoolList = () => async (dispatch) => {
	const url = `v1/masters/school/list`;
	try {
		const response = await axiosInstance.post(url);
		dispatch(fillSchoolList(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};

export const getRelationshipList = () => async (dispatch) => {
	const url = `v1/masters/relationship/list`;
	try {
		const response = await axiosInstance.post(url);
		dispatch(fillRelationshipList(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};


export const getShareUnitList = (params) => async (dispatch) => {
	let url = ""
	if (params.perPage) {
		url = `/v1/quizzes/share/parent-list?page=${params.page}&perPage=${params.perPage}`;
	}
	else {
		url = `/v1/quizzes/share/parent-list?page=${params.page}`;
	}

	try {
		dispatch(setParentsListingLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setParentsListingLoading(false));
		dispatch(fillSharedQuizList(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setParentsListingLoading(false));
		return err.response?.data;
	}
};

export const getShareUnitWorkshopList = (params) => async (dispatch) => {
	let url = ""
	if (params.perPage) {
		url = `/v1/workshop-user-quizzes/share/parent-list?page=${params.page}&perPage=${params.perPage}`;
	}
	else {
		url = `/v1/workshop-user-quizzes/share/parent-list?page=${params.page}`;
	}

	try {
		dispatch(setParentsListingLoading(true));
		const response = await axiosInstance.post(url, { ...params });
		dispatch(setParentsListingLoading(false));
		dispatch(fillSharedWorkshopList(response?.data?.data));
		return response?.data?.data
	} catch (err) {
		if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setParentsListingLoading(false));
		return err.response?.data;
	}
};


export const postSharedQuizCreate = (params) => async (dispatch) => {
	const url = 'v1/quizzes/parent/whatsapp-release';
	try {
		dispatch(setParentsListingLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setParentsListingLoading(false));
		if (response?.data?.statusCode == 200) {
			toast.success(response?.data?.userMessageTitle);
		}
		return response;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setParentsListingLoading(false));
		return err?.response;
	}
};


export const postSharedWorkshopCreate = (params) => async (dispatch) => {
	const url = 'v1/workshop-user-quizzes/parent/whatsapp-release';
	try {
		dispatch(setParentsListingLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setParentsListingLoading(false));
		if (response?.data?.statusCode == 200) {
			toast.success(response?.data?.userMessageTitle);
		}
		return response;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setParentsListingLoading(false));
		return err?.response;
	}
};