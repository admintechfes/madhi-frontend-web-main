import { toast } from "react-toastify";
import { fillAttendanceData, fillConductedByData, fillMeetingData, fillStatusData, fillVisitData, fillVisitDetails, fillVisitPreview, fillVisitsParents, fillinviteeVisitTypeData, setVisitsLoading } from "./visitsSlice";
import axiosInstance from "../../../../config/Axios";
import { hideTableLoader, showTableLoader } from "../../../../components/Loader/duck/loaderSlice";


export const getVisitsData = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/visit-progress?page=${params.page}&perPage=${params.per_page}`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(fillVisitData(response?.data.data))
    dispatch(hideTableLoader(false));
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const getVisitsDetails = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/visit-progress/visit`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(hideTableLoader(false));
    dispatch(fillVisitDetails(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}



export const getVisitsConductedBy = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/visit-progress/conducted-by`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(hideTableLoader(false));
    dispatch(fillConductedByData(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const getVisitStatusData = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/visit-progress/visit-status`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(hideTableLoader(false));
    dispatch(fillStatusData(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const getVisitMeetingData = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/visit-progress/visit-type`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(hideTableLoader(false));
    dispatch(fillMeetingData(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const getVisitinviteeVisitTypeData = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/visit-progress/invitee-visit-type`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(hideTableLoader(false));
    dispatch(fillinviteeVisitTypeData(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const getVisitParentList = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/visit-progress/parents?page=${params.page}&perPage=${params.per_page}`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(fillVisitsParents(response?.data.data))
    dispatch(hideTableLoader(false));
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}


export const getVisitParentAttendees = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/visit-progress/attendance-status`
  }
  try {
    dispatch(setVisitsLoading(true));
    const response = await axiosInstance.post(url, params);
    dispatch(setVisitsLoading(false));
    dispatch(fillAttendanceData(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(setVisitsLoading(false));
    return err?.response
  }
}


export const getVisitPreview = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/visit-progress/get-submitted-visit`
  }
  try {
    dispatch(setVisitsLoading(true));
    const response = await axiosInstance.post(url, params);
    dispatch(setVisitsLoading(false));
    dispatch(fillVisitPreview(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(setVisitsLoading(false));
    dispatch(fillVisitPreview({}))
    return err?.response
  }
}