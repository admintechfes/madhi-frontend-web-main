import { toast } from "react-toastify";
import { fillBlockNameList, fillCEWNameList, fillDistrictDetails, fillDistrictList, fillDistrictNameList, fillPanchayatNameList, fillSrSupervisorNameList, fillStateList, fillSupervisorNameList, fillUserNameList, fillVillageNameList, setAllLoading, setDistrictloading, setBlockNameloading, setDistrictNameloading, setLoading, setPanchayatNameloading, setVillageNameloading, fillCEWDelegateNameList, fillPageNum, fillPerPageNum } from "./DistrictsSlice";
import axiosInstance from "../../../config/Axios";
import { hideLoader, showLoader } from "../../../components/Loader/duck/loaderSlice";



export const getDistrictList = (params) => async (dispatch) => {
  const url = `/v1/master/districts/list?page=${params.page}&per_page=${params.per_page}`;
  try {
    dispatch(setDistrictloading(true));
    const response = await axiosInstance.post(url,params);
    dispatch(fillPageNum(params.page));
		dispatch(fillPerPageNum(params.per_page))
    dispatch(fillDistrictList(response?.data?.data));
    dispatch(setDistrictloading(false));
    return response?.data?.data;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setDistrictloading(false));
    return err.response;
  }
};
export const getDistrictDetails = (params) => async (dispatch) => {
  const url = `/v1/master/district/detail-page/${params.id}`;
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url);
    dispatch(setLoading(false));
    dispatch(fillDistrictDetails(response?.data?.data));
    return response?.data?.data;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false));
    return err.response;
  }
};
export const getStateList = (params) => async (dispatch) => {
  const url = `/v1/master/states/list`;
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url,{"search":params});
    dispatch(setLoading(false));
    dispatch(fillStateList(response?.data?.data));
    return response?.data?.data;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false));
    return err.response;
  }
};
export const getDistrictNameList = (params) => async (dispatch) => {
	const url = `/v1/master/districts/list-dropdown-master`;
	try {
		dispatch(setDistrictNameloading(true));
		const response = await axiosInstance.post(url,{"search":params});
		dispatch(setDistrictNameloading(false));
		dispatch(fillDistrictNameList(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setDistrictNameloading(false));
		return err.response;
	}
};
export const getBlockNameList = (params) => async (dispatch) => {
	const url = `/v1/master/block-zones/list-dropdown-master`;
	try {
		dispatch(setBlockNameloading(true));
		const response = await axiosInstance.post(url,{...params});
		dispatch(setBlockNameloading(false));
		dispatch(fillBlockNameList(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setBlockNameloading(false));
		return err.response;
	}
};
export const getPanchayatNameList = (params) => async (dispatch) => {
	const url = `/v1/master/panchayat-wards/list-dropdown-master`;
	try {
		dispatch(setPanchayatNameloading(true));
		const response = await axiosInstance.post(url,params);
		dispatch(setPanchayatNameloading(false));
		dispatch(fillPanchayatNameList(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setPanchayatNameloading(false));
		return err.response;
	}
};

export const getVillageNameList = (params) => async (dispatch) => {
	const url = `/v1/master/village-areas/list-dropdown-master`;
	try {
		dispatch(setVillageNameloading(true));
		const response = await axiosInstance.post(url,params);
		dispatch(setVillageNameloading(false));
		dispatch(fillVillageNameList(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setVillageNameloading(false));
		return err.response;
	}
};
export const createDistrict = (params) => async (dispatch) => {
  const url = `/v1/master/district/create`;
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url,params);
    dispatch(setLoading(false));
    toast.success("The district is created successfully");
    return response;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false));
    return err.response;
  }
};
export const updateDistrict = (params) => async (dispatch) => {
  const url = `/v1/master/district/update`;
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url,params);
    dispatch(setLoading(false));
    toast.success("The info is saved successfully");
    return response;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false));
    return err.response;
  }
};
export const getUserNameList = (params) => async (dispatch) => {
  const url = `/v1/users/list-dropdown`;
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url,{role_type:params.type});
    dispatch(setLoading(false));
    dispatch(fillUserNameList(response?.data?.data));
    return response?.data?.data;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false));
    return err.response;
  }
};
export const getCEWNameList = (params) => async (dispatch) => {
  const url = `/v1/users/list-dropdown`;
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url,{...params,role_type:"cew"});
    dispatch(setLoading(false));
    dispatch(fillCEWNameList(response?.data?.data));
    return response?.data?.data;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false));
    return err.response;
  }
};
export const getCEWDelegateNameList = (params) => async (dispatch) => {
  const url = `/v1/users/list-dropdown`;
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url,{...params,role_type:"cew"});
    dispatch(setLoading(false));
    dispatch(fillCEWDelegateNameList(response?.data?.data));
    return response?.data?.data;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false));
    return err.response;
  }
};
export const getSupervisorNameList = (params) => async (dispatch) => {
  const url = `/v1/users/list-dropdown`;
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url,{...params,role_type:"supervisor"});
    dispatch(setLoading(false));
    dispatch(fillSupervisorNameList(response?.data?.data));
    return response?.data?.data;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false));
    return err.response;
  }
};
export const getSrSupervisorNameList = (params) => async (dispatch) => {
  const url = `/v1/users/list-dropdown`;
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(url,{...params,role_type:"srsupervisor"});
    dispatch(setLoading(false));
    dispatch(fillSrSupervisorNameList(response?.data?.data));
    return response?.data?.data;
  } catch (err) {
    toast.error(err?.response?.data?.userMessageTitle);
    dispatch(setLoading(false));
    return err.response;
  }
};

export const getDistrictbyProgramList = (params) => async (dispatch) => {
	const url = `/v1/master/districts/list-dropdown-master`;
	try {
		dispatch(setDistrictNameloading(true));
		const response = await axiosInstance.post(url,params);
		dispatch(setDistrictNameloading(false));
		dispatch(fillDistrictNameList(response?.data?.data));
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		dispatch(setDistrictNameloading(false));
		return err.response;
	}
};



export const deleteDistrict=(params) => async (dispatch) => {
	const url = `/v1/masters/district/delete`;
	try {
	
		const response = await axiosInstance.post(url,params);
    toast.success(response?.data?.userMessageTitle)
		return response?.data?.data;
	} catch (err) {
		toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
};






export const checkDependanceDistrict=(params) => async (dispatch) =>{

  const url = `v1/masters/districts/check-for-dependency`;
	try {
		const response = await axiosInstance.post(url,params);
		return response?.data;
	} catch (err) {
		// toast.error(err?.response?.data?.userMessageTitle);
		return err.response;
	}
}

export const exportDistrict = (params) => async (dispatch) => {
	const url = '/v1/masters/districts/export';
	try {
		dispatch(setLoading(true));
		const response = await axiosInstance.post(url, params);
		dispatch(setLoading(false));
		if (response?.data?.statusCode == 200) {
			toast.success(response?.data?.userMessageTitle);
		}
		return response;
	} catch (error) {
		toast.error(error?.response?.data?.userMessageTitle);
		dispatch(setLoading(false));
		return error?.response;
	}
};