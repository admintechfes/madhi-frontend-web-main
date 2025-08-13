import { toast } from "react-toastify";
import axiosInstance from "../../config/Axios";
import { fillGetByIdStudentQuizRule, fillStudentQuizRule, fillStudentQuizRuleGrade, fillCertificateReportStatusData, fillStudentQuizRuleLanguage, fillStudentQuizRuleTags, setLoading } from "./studentquizruleSlice";

export const getStudentQuizRuleList = (params) => async (dispatch) => {
  let url = `/v1/program-units/student-quiz-certificate-rules/listing?page=${params.page}&perPage=${params.perPage}`;

  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url, { ...params });
    dispatch(setLoading(false));
    dispatch(fillStudentQuizRule(response?.data?.data));
    return response?.data?.data
  } catch (err) {
    if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false));
    return err.response?.data;
  }
};


export const getStudentQuizRuleGrade = (params) => async (dispatch) => {
  let url = `/v1/program-units/student-quiz-certificate-rules/masters/grades`;

  try {
    const response = await axiosInstance.post(url, params);
    dispatch(fillStudentQuizRuleGrade(response?.data?.data));
    return response?.data?.data
  } catch (err) {
    if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
    return err.response?.data;
  }
};

export const getStudentQuizRuleLanguage = (params) => async (dispatch) => {
  let url = `/v1/program-units/student-quiz-certificate-rules/masters/languages`;

  try {
    const response = await axiosInstance.post(url, params);
    dispatch(fillStudentQuizRuleLanguage(response?.data?.data));
    return response?.data?.data
  } catch (err) {
    if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
    return err.response?.data;
  }
};

export const getStudentQuizRuleTags = (params) => async (dispatch) => {
  let url = `/v1/program-units/student-quiz-certificate-rules/masters/tags`;

  try {
    const response = await axiosInstance.post(url, params);
    dispatch(fillStudentQuizRuleTags(response?.data?.data));
    return response?.data?.data
  } catch (err) {
    if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
    return err.response?.data;
  }
};


export const createStudentQuizRule = (params) => async () => {
  let url = `/v1/program-units/student-quiz-certificate-rules/create`;
  try {
    const response = await axiosInstance.post(url, { ...params });
    toast.success(response?.data?.userMessageTitle)
    return response
  } catch (err) {
    if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
    return err.response?.data;
  }
};

export const updateStudentQuizRule = (params) => async () => {
  let url = `/v1/program-units/student-quiz-certificate-rules/update`;
  try {
    const response = await axiosInstance.post(url, { ...params });
    toast.success(response?.data?.userMessageTitle)
    return response
  } catch (err) {
    if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
    return err.response?.data;
  }
};

export const getStudentQuizRuleDetails = (params) => async (dispatch) => {
  let url
  if (params) {
    url = `v1/program-units/student-quiz-certificate-rules/${params}`
  }
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url);
    dispatch(setLoading(false));
    dispatch(fillGetByIdStudentQuizRule(response?.data.data))
    return response?.data?.data
  } catch (err) {
    toast.error(err.response?.data?.userMessageTitle)
    dispatch(setLoading(false));
    return err?.response
  }
}


export const getStudentQuizCertificateProgressReportStatus = (params) => async (dispatch) => {
  let url = `/v1/student-quiz-certificate-progress/get/report/status`;

  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url);
    dispatch(setLoading(false));
    dispatch(fillCertificateReportStatusData(response?.data?.data));
    return response?.data?.data
  } catch (err) {
    if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false));
    return err.response?.data;
  }
};