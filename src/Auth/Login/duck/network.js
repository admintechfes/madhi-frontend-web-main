import { toast } from "react-toastify";
import { setUserData, resetUserData, setLoading, setForgetLoader } from './authSlice';
import axiosInstance from "../../../config/Axios";
import { utils } from "../../../utils";


export const login = (params) => async (dispatch) => {
  const url = "/package/auth/login";

  try {
    dispatch(setLoading(true))
    const response = await axiosInstance.post(url, params);
    dispatch(setLoading(false))
    utils.setLocalStorageValue("token", response?.data?.data?.accessToken);
    return response;
  } catch (error) {
    dispatch(setLoading(false));
    // toast.error(error.response.data.userMessageTitle)
    return error.response
  }
}

export const logout = (params) => async (dispatch) => {

  const url = "/package/auth/logout";

  try {
    dispatch(setLoading(true))
    const response = await axiosInstance.post(url, params);
    dispatch(setLoading(false))
    utils.removeLocalStorageValue('token');
    utils.removeLocalStorageValue('laravel_session');
    utils.removeLocalStorageValue('XSRF-TOKEN');
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('role');
    window.localStorage.removeItem('permissions');
    window.localStorage.removeItem('nav-permissions');
    dispatch(resetUserData());
    return response;
  } catch (error) {
    dispatch(setLoading(false));
    // toast.error(error.response?.data?.userMessageTitle)
    return error.response
  }

};

export const forgetPassword = (params) => async (dispatch) => {
  const url = '/package/auth/forgot-password';
  try {
    dispatch(setForgetLoader(true));
    const response = await axiosInstance.post(url, params);
    dispatch(setForgetLoader(false));
    return response;
  } catch (error) {
    dispatch(setForgetLoader(false));
    toast.error(error?.response?.data?.userMessageTitle)
    return error.response;
  }
};

export const verifyUser = (params) => async (dispatch) => {
  const url = '/v1/web-verify-api';
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url, params);
    dispatch(setLoading(false));

    window.localStorage.setItem('user', JSON.stringify(response.data.data.user));
    window.localStorage.setItem('role', JSON.stringify(response.data.data.role));
    window.localStorage.setItem('permissions', JSON.stringify(response.data.data.permissions));
    window.localStorage.setItem('nav-permissions', JSON.stringify(response.data.data.nav_permission));
    dispatch(setUserData(response.data.data));

    return response;
  } catch (err) {
    dispatch(setLoading(false));
    // toast.error(err?.response?.data?.userMessageTitle);
    return err.response;
  }
};
