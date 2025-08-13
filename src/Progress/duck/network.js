import { toast } from "react-toastify";
import { fillActiveProgramRunning, fillProgressDetails, fillUnitVillage, setProgressLoading, fillVillageUsers, fillProgressStatusData, fillActiveProgramDistrictList, fillUnitListName, fillActivityListName, setExportLoading, fillVillageWiseProgressList, fillParentWiseProgressList, fillWorkshopActivityList } from "./progressSlice";
import axiosInstance from "../../config/Axios";
import { fillLearningStatusData } from "../Village/learningContent/duck/learningSlice";
import { hideTableLoader, showTableLoader } from "../../components/Loader/duck/loaderSlice";
import { setDistrictNameloading } from "../../Masters/Districts/duck/DistrictsSlice";
import dayjs from 'dayjs';

export const getProgressDetails = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/programs/${params.id}`
  }
  try {
    dispatch(setProgressLoading(true));
    const response = await axiosInstance.post(url);
    dispatch(setProgressLoading(false));
    dispatch(fillProgressDetails(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(setProgressLoading(false));
    return err?.response
  }
}

export const getVillageUsersList = (tab, params) => async (dispatch) => {
  let url = '';

  if (tab == 2) {
    url = `/v1/parents/list?page=${params.page}&per_page=${params.per_page}`
  } else {
    url = `/v1/users/list?page=${params.page}&per_page=${params.per_page}`
  }

  try {
    dispatch(setProgressLoading(true));
    const response = await axiosInstance.post(url, { ...params });
    dispatch(setProgressLoading(false));
    dispatch(fillVillageUsers(response?.data?.data));
    return response?.data;
  } catch (err) {
    if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setProgressLoading(false));
    return err.response?.data;
  }
};
export const getActiveVillageProgram = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `/v1/programs/${params.id}/village-areas-with-active-unit?page=${params.page}&per_page=${params.per_page}`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(fillActiveProgramRunning(response?.data.data))
    dispatch(hideTableLoader(false));
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const getVillageUnit = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `/v1/program-progress/program-units/village`
  }
  try {
    dispatch(setProgressLoading(true));
    const response = await axiosInstance.post(url, params);
    dispatch(setProgressLoading(false));
    dispatch(fillUnitVillage(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(setProgressLoading(false));
    return err?.response
  }
}

export const getProgressStatusData = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/users/list-dropdown`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(hideTableLoader(false));
    dispatch(fillProgressStatusData(response?.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const getActiveProgramDistrictNameList = (params) => async (dispatch) => {
  const url = `/v1/master/districts/list-dropdown-master`;
  try {
    dispatch(setDistrictNameloading(true));
    const response = await axiosInstance.post(url, params);
    dispatch(setDistrictNameloading(false));
    dispatch(fillActiveProgramDistrictList(response?.data?.data));
    return response?.data?.data;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setDistrictNameloading(false));
    return err.response;
  }
};


export const getUnitNameList = (params) => async (dispatch) => {

  const url = "/v1/program-units"
  try {
    const response = await axiosInstance.post(url, params);
    dispatch(fillUnitListName(response?.data?.data));
    return response?.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.userMessageTitle);
    return error?.response;
  }

}

export const getProgramUnitContentExport = (params) => async (dispatch) => {

  const url = "/v1/program-unit-contents"
  try {
    const response = await axiosInstance.post(url, params);
    dispatch(fillActivityListName(response?.data?.data));
    return response?.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.userMessageTitle);
    return error?.response;
  }
}




export const submitExportUnitQuizSurvey = (params) => async (dispatch) => {

  const url = "/v1/export/programs/unit/quiz-survey-by-mail"

  try {
    dispatch(setExportLoading(true));

    const response = await axiosInstance.post(url, params);
    dispatch(setExportLoading(false));
    if (response?.data?.statusCode == 200) {
      toast.success(response?.data?.userMessageTitle)
    }
    return response;

  } catch (error) {
    dispatch(setExportLoading(false));
    toast.error(error?.response?.data?.userMessageTitle || 'An unexpected error occurred');
    return error?.response;
  }
}


export const ExportUnitLevelProgramReport = (params) => async (dispatch) => {

  const url = "/v1/export/programs/unit/unit-level"

  try {
    dispatch(setExportLoading(true));

    const response = await axiosInstance.post(url, params);
    dispatch(setExportLoading(false));
    if (response?.data?.statusCode == 200) {
      toast.success(response?.data?.userMessageTitle)
    }
    return response;

  } catch (error) {
    dispatch(setExportLoading(false));
    toast.error(error?.response?.data?.userMessageTitle || 'An unexpected error occurred');
    return error?.response;
  }
}


export const getVillageWiseProgressList = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `/v1/programs/village-progress-data?page=${params.page}&per_page=${params.per_page}`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(fillVillageWiseProgressList(response?.data?.data))
    dispatch(hideTableLoader(false));
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const getParentWiseProgressList = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `/v1/parents/parent-engagement-scoring-progress?page=${params.page}&per_page=${params.per_page}`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(fillParentWiseProgressList(response?.data?.data))
    dispatch(hideTableLoader(false));
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const RefreshParentProgress = (params) => async () => {
  const url = `/v1/parents/parent-engagement-scoring-progress/refresh`;
  try {
    const response = await axiosInstance.post(url, params);
    toast.success(response?.data?.userMessageTitle);
    return response
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    return err.response;
  }
};

export const onExportParentWiseProgressList = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `/v1/parents/parent-engagement-scoring-progress?page=${params.page}&per_page=${params.per_page}`
  }
  try {
    dispatch(showTableLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(fillParentWiseProgressList(response?.data?.data))
    dispatch(hideTableLoader(false));
    toast.success(response?.data?.userMessageTitle);
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(hideTableLoader(false));
    return err?.response
  }
}

export const getProgramreportWorkshopActivityist = (params) => async (dispatch) => {
  let url = `v1/activity/list`
  try {
    const response = await axiosInstance.get(url);
    dispatch(fillWorkshopActivityList(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    return err?.response
  }
}