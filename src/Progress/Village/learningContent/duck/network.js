import { toast } from "react-toastify";
import { hideTableLoader, showTableLoader } from "../../../../components/Loader/duck/loaderSlice";
import axiosInstance from "../../../../config/Axios";
import { fillLearningContentList, fillLearningContentParentsPlatformData, fillLearningContentParentsStatusData, fillLearningContentTypeData, fillLearningData, fillLearningDetails, fillLearningParents, setLearnnigLoading } from "./learningSlice";

export const getLearningList = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/learning-content-progress`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(fillLearningData(response?.data))
    dispatch(hideTableLoader(false));
    return response?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}
export const getLearningDetails = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/learning-content-progress/learning-content`
  }
  try {
    dispatch(setLearnnigLoading(true));
    const response = await axiosInstance.post(url, params);
    dispatch(setLearnnigLoading(false));
    dispatch(fillLearningDetails(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(setLearnnigLoading(false));
    return err?.response
  }
}

export const getLearningContentist = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/learning-content-progress/contents?page=${params.page}&perPage=${params.per_page}`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(hideTableLoader(false));
    dispatch(fillLearningContentList(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const getlearningContentType = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/learning-content-progress/learning-content-type`
  }
  try {
    dispatch(setLearnnigLoading(true));
    const response = await axiosInstance.post(url, params);
    dispatch(setLearnnigLoading(false));
    dispatch(fillLearningContentTypeData(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(setLearnnigLoading(false));
    return err?.response
  }
}

export const getLearningContentParents = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/learning-content-progress/parents?page=${params.page}&perPage=${params.per_page}`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(hideTableLoader(false));
    dispatch(fillLearningParents(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const getlearningContentParentsStatus = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/learning-content-progress/status`
  }
  try {
    dispatch(setLearnnigLoading(true));
    const response = await axiosInstance.post(url, params);
    dispatch(setLearnnigLoading(false));
    dispatch(fillLearningContentParentsStatusData(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(setLearnnigLoading(false));
    return err?.response
  }
}

export const getlearningContentWhatsAppStatus = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/program-progress/whatsapp-status-filter`
  }
  try {
    dispatch(setLearnnigLoading(true));
    const response = await axiosInstance.post(url, params);
    dispatch(setLearnnigLoading(false));
    dispatch(fillLearningContentParentsStatusData(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(setLearnnigLoading(false));
    return err?.response
  }
}


export const getlearningContentParentsPlatform = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/learning-content-progress/platforms`
  }
  try {
    dispatch(setLearnnigLoading(true));
    const response = await axiosInstance.post(url, params);
    dispatch(setLearnnigLoading(false));
    dispatch(fillLearningContentParentsPlatformData(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(setLearnnigLoading(false));
    return err?.response
  }
}


export const getlearningContentSMSStatus = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/program-progress/sms-status-filter`
  }
  try {
    dispatch(setLearnnigLoading(true));
    const response = await axiosInstance.post(url, params);
    dispatch(setLearnnigLoading(false));
    dispatch(fillLearningContentParentsPlatformData(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(setLearnnigLoading(false));
    return err?.response
  }
}