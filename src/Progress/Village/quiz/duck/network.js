import { toast } from "react-toastify";
import axiosInstance from "../../../../config/Axios";
import { fillQuizChildren, fillQuizData, fillQuizDetails, fillQuizParents, fillQuizPreview, fillQuizProgresSMSStatusData, fillQuizProgresStatusData, fillQuizProgresWhatsAppStatusData, fillQuizStatusData, setQuizLoading } from "./quizSlice";
import { hideTableLoader, showTableLoader } from "../../../../components/Loader/duck/loaderSlice";

export const getQuizList = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/quiz-progress`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(hideTableLoader(false));
    dispatch(fillQuizData(response?.data))
    return response?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const getQuizDetails = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/quiz-progress/quiz`
  }
  try {
    const response = await axiosInstance.post(url, params);
    dispatch(fillQuizDetails(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    return err?.response
  }
}

export const getQuizParentList = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/quiz-progress/parents?page=${params.page}&perPage=${params.per_page}`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(fillQuizParents(response?.data.data))
    dispatch(hideTableLoader(false));
    return response?.data?.data
  } catch (err) {
    dispatch(hideTableLoader(false));
    toast.error(err.response?.data?.userMessageTitle)
    return err?.response
  }
}

export const getQuizChildrenList = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/quiz-progress/children?page=${params.page}&perPage=${params.per_page}`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(fillQuizChildren(response?.data.data))
    dispatch(hideTableLoader(false));
    return response?.data?.data
  } catch (err) {
    dispatch(hideTableLoader(false));
    toast.error(err.response?.data?.userMessageTitle)
    return err?.response
  }
}

export const getQuizProgresStatus = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/quiz-progress/status`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(hideTableLoader(false));
    dispatch(fillQuizProgresStatusData(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}


export const getQuizProgresWhatsAppStatus = () => async (dispatch) => {
  let url = `v1/program-progress/whatsapp-status-filter`

  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url);
    dispatch(hideTableLoader(false));
    dispatch(fillQuizProgresWhatsAppStatusData(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const getQuizProgresSMSStatus = () => async (dispatch) => {
  let url = `v1/program-progress/sms-status-filter`

  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url);
    dispatch(hideTableLoader(false));
    dispatch(fillQuizProgresSMSStatusData(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}



export const getQuizPreview = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/app/program-progress/quizzes/get-submitted-quiz`
  }
  try {
    dispatch(setQuizLoading(true));
    const response = await axiosInstance.post(url, params);
    dispatch(setQuizLoading(false));
    dispatch(fillQuizPreview(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(setQuizLoading(false));
    return err?.response
  }
}
