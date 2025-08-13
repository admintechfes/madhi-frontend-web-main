import { toast } from "react-toastify";
import axiosInstance from "../../config/Axios";
import { fillPermissionList, setLoading, setloaderSubmit } from "./permissionSlice";

export const getPermissionList = (params) => async (dispatch) => {

  const url = `/v1/permission-management/module-permissions`;

	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url,params);
		dispatch(fillPermissionList({roleType:params.roleType, response:response?.data?.data}));
		dispatch(setLoading(false));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return err.response;
	}
};
export const updateRolePermissions = (params) => async (dispatch) => {

  const url = `/v1/permission-management/update-role-permissions`;

	try {
		dispatch(setloaderSubmit(true));
		const response = await axiosInstance.post(url,params);

		dispatch(setloaderSubmit(false));
		if (response?.data?.statusCode == 200) {
      toast.success(response?.data?.userMessageTitle)
      }
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setloaderSubmit(false));
		return err.response;
	}
};