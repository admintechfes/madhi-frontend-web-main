import { toast } from "react-toastify";
import axiosInstance from "../../../config/Axios";
import { fillStudentQuizReport, fillTotalChild, fillTotalParent, setLoading } from "./studentquizreportSlice";

export const getStudentQuizReportList = (params) => async (dispatch) => {
  let url = `/v1/student-quiz-certificate-progress/listing?page=${params.page}&perPage=${params.perPage}`;

  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url, { ...params });
    dispatch(setLoading(false));
    dispatch(fillStudentQuizReport(response?.data?.data));
    dispatch(fillTotalParent(response?.data?.data?.totalParent))
    dispatch(fillTotalChild(response?.data?.data?.totalChild))
    return response?.data?.data
  } catch (err) {
    if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false));
    return err.response?.data;
  }
};

export const resendQuizReport = (params) => async () => {
  let url = `/v1/student-quiz-certificate-progress/resend-report`;
  try {
    const response = await axiosInstance.post(url, {...params});
    toast.success(response?.data?.userMessageTitle)
    return response
  } catch (err) {
    if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
    return err.response?.data;
  }
};