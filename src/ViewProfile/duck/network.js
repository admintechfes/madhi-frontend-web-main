import { toast } from "react-toastify"
import { fillProfileDetails, setLoading } from "./profileSlice";
import axiosInstance from "../../config/Axios";




export const getProfileDetails = (params) => async (dispatch) => {
  const url = `/v1/users/detail-page/${params.id}`
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url);
    dispatch(fillProfileDetails(response?.data?.data));
    dispatch(setLoading(false));
    return response?.data?.data;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle)
    dispatch(setLoading(false));
    return err?.response;
  }
}






export const updateUser = (params) => async (dispatch) => {
  const url = "/v1/users/update"

  try {
    dispatch(setLoading(true))
    const response = await axiosInstance.post(url, params);
    dispatch(setLoading(false));
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.userMessageTitle)
    dispatch(setLoading(false));
    return error?.response;
  }
}


export const changeProfilePassword = (params) => async (dispatch) => {
  const url = `/package/auth/update-password`;

  try {
    const response = await axiosInstance.post(url, params);
    if (response?.data?.statusCode == 200) {
    toast.success("Password changes successfully")
    }
    return response
  } catch (error) {

    const errors = error?.response?.data?.errors;

    let firstErrorMessage = null;

    if (errors) {
      Object.keys(errors).forEach(key => {
        if (Array.isArray(errors[key]) && errors[key].length > 0) {
          firstErrorMessage = errors[key][0];
          return;
        }
      });
    }
    toast.error(firstErrorMessage)
    return error?.response;
  }
}

export const updateProfile = (params) => async (dispatch) => {
  const url = `/v1/users/update-profile`

  try {
    const response = await axiosInstance.post(url, params);
    toast.success("The updated info is save successfully")
    return response
  } catch (error) {
    toast.error(error?.response?.data?.userMessageTitle)
    return error?.response;
  }
}