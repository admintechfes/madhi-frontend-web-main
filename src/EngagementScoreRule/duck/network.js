import { toast } from "react-toastify";
import axiosInstance from "../../config/Axios";
import { fillEngagementScoreChangeLogData, fillEngagementScoreData, setLoading } from "./scoreSlice";

export const CreateEngagementScoreUpdate = (params) => async (dispatch) => {
  const url = '/v1/parents/parent-engagement-scoring-rules/update';
  try {
    const response = await axiosInstance.post(url, params);
    if (response?.data?.statusCode == 200) {
      toast.success(response?.data?.userMessageTitle);
    }
    return response.data;
  } catch (err) {
        toast.error(err?.response?.data?.userMessageTitle);
    return err?.response;
  }
};


export const GetEngagementScoreDetail = (params) => async (dispatch) => {
  const url = "/v1/parents/parent-engagement-scoring-rules";
  try {
    dispatch(setLoading(true))
    const response = await axiosInstance.post(url, params);
    dispatch(setLoading(false))
    dispatch(fillEngagementScoreData(response.data.data))
    return response.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false))
    return err?.response;
  }
};

export const GetEngagementScoreChangeLog = (params) => async (dispatch) => {
  const url = `v1/parents/parent-engagement-scoring-rules/get-log?page=${params.page}&perPage=${params.perPage}`;
  try {
    dispatch(setLoading(true))
    const response = await axiosInstance.post(url, params);
    dispatch(setLoading(false))
    dispatch(fillEngagementScoreChangeLogData(response.data.data))
    return response.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false))
    return err?.response;
  }
};
