import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, TextField, Tooltip, Typography } from '@mui/material';
import { ErrorBox } from '../../../components/Errorbox';
import SelectComponent, { Dropdown } from '../../../components/Select';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createVillage, updateVillage } from '../duck/network';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { getBlockNameList, getDistrictNameList, getPanchayatNameList } from '../../Districts/duck/network';
import { hideLoader, showLoader } from '../../../components/Loader/duck/loaderSlice';
import DropDownWithSearch from '../../../components/Masters/DropDownWithSearch';



export default function CreateVillage({ formType, villageDetails }) {
  const [filterData, setFilterData] = useState({
    district_id: villageDetails?.district_id || "",
    block_zone_id: villageDetails?.block_zone_id || "",
    panchayat_ward_id: villageDetails?.panchayat_ward_id || ""
  });
  const [blockList, setBlockList] = useState([])
  const [panchayatList, setPanchayatList] = useState([])
  const [searchTxt, setSearchTxt] = useState("")
  const [disableDropDown, setDisableDropDown] = useState({
    blockZoneDisable: true,
    panchayatDisable: true,
    villageDisable: true
  })


  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: villageDetails,
    mode: "onChange"
  });
  const stateList = useSelector((state) => state.block.stateList);
  const districtName = useSelector((state) => state.district.districtNameList);
  const blockName = useSelector((state) => state.district.blockNameList);

  useEffect(() => {
    // dispatch(showLoader)
    dispatch(getDistrictNameList());
    if (villageDetails) {
      dispatch(getBlockNameList({ ...filterData, source: "masters" })).then((resp) => {
        setBlockList(resp);
      });
      dispatch(getPanchayatNameList({ ...filterData, source: "masters" })).then((resp) => {
        // dispatch(hideLoader())
        setPanchayatList(resp);
      });

    }
    if (formType === "edit") {
      setDisableDropDown((prev) => ({ ...prev, villageDisable: false }))
    }
    if (villageDetails) {
      setValue("district_id", villageDetails.district_id);
      setValue("block_zone_id", villageDetails.block_zone_id);
      setValue("panchayat_ward_id", villageDetails.panchayat_ward_id);

    }
  }, [villageDetails, dispatch, setValue]);


  const handleCancel = () => {
    navigate(`/masters/village_area`)
  }


  const renderTextFieldWithError = (field, label, error, onKeyPress, type, params) => (
    <div className="!tw-w-[328px]">
      <TextField variant="outlined" size="small" disabled={disableDropDown.villageDisable} label={label} type={type ? type : "text"} onKeyPress={onKeyPress} value={field.value || ''} {...field} className='!tw-w-[328px]' />

      {error && (
        <ErrorBox>
          <ErrorOutlineIcon fontSize="small" />
          <span>{error.message}</span>
        </ErrorBox>
      )}
    </div>
  );



  const onSubmitDistrict = (values) => {

    if (formType !== "edit") {
      dispatch(createVillage(values)).then((resp) => {
        if (resp?.data?.statusCode === 200) navigate(`/masters/village_area`)

      })
    } else {

      dispatch(updateVillage(values)).then((resp) => {
        if (resp?.data?.statusCode === 200) navigate(`/masters/village_area`)

      })
    }
  }



  const onChangeDropDownFilter = (e, type) => {
    if (type === "district_id") {

      setFilterData({ ...filterData, district_id: e, panchayat_ward_id: "", block_zone_id: "", source: "masters" });

      dispatch(getBlockNameList({ district_id: e, source: "masters" })).then((resp) => setBlockList(resp))
      setDisableDropDown((res) => ({ ...res, blockZoneDisable: false, panchayatDisable: true, villageDisable: true }))
      setValue('name', '')
      setValue(`panchayat_ward_id`, "")
      setValue(`block_zone_id`,"")
    }

    if (type === "block_zone_id") {

      setFilterData({ ...filterData, block_zone_id: e, panchayat_ward_id: "", source: "masters" });
      dispatch(getPanchayatNameList({ ...filterData, block_zone_id: e, source: "masters" })).then((resp) => {
        setPanchayatList(resp);
      });
      setDisableDropDown((res) => ({ ...res, panchayatDisable: false, villageDisable: true }))
      setValue('name', '')
    }

    if (type === "panchayat_ward_id") {
      setDisableDropDown((res) => ({ ...res, villageDisable: false }))
    }

  }





  const handleSearch = (txt, type) => {

    if (type == "district") {
      dispatch(getDistrictNameList(txt))
    }

    if (type === "block") {
      dispatch(getBlockNameList({ ...filterData, search: txt, source: "masters" })).then((resp) => setBlockList(resp))
    }

    if (type === "panchayat") {
      dispatch(getPanchayatNameList({ ...filterData, search: txt, source: "masters" })).then((resp) => {
        setPanchayatList(resp);
      });
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmitDistrict)}>
      <div className='!tw-bg-[#FAFCFE]'>
        <div className="tw-flex tw-items-center tw-w-full tw-justify-between ">
          <div className='tw-flex tw-justify-center '>
            <Link to="/masters/village_area"  >
              <ArrowBackIcon className="tw-text-grey" />
              <span className="tw-text-grey tw-ml-2 tw-mt-2 tw-text-sm tw-leading-normal">Village/Area</span>
            </Link>
          </div>
          <div >
            <Button onClick={handleCancel} variant='outlined' className='!tw-bg-white !tw-text-primary !tw-mr-4 !tw-border-[#DDD] !tw-shadow-sm'>
              Cancel
            </Button>
            <Button type="submit" variant='outlined' className='!tw-bg-primary !tw-text-white !tw-shadow-sm'>
              {location.pathname.includes('update') && params.id ? "Save " : location.pathname.includes('profile') && params.id ? "Update Profile" : "Create"}
            </Button>
          </div>
        </div>
        <div className='tw-pt-2'>
          <h2 className='tw-text-secondaryText tw-font-bold tw-text-2xl '>Create New Village/Area</h2>
        </div>
        <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
          <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">Village/Area Info
          </Typography>
          <div className='tw-flex tw-gap-8 tw-flex-wrap'>
            <Controller
              name="district_id"
              control={control}
              rules={{
                required: "Please select District to create."
              }}
              render={({ field }) => (
                <div className="!tw-w-[328px]">
                  <DropDownWithSearch {...field}
                    options={districtName}
                    valuekey="district_id"
                    labelkey="name"
                    label="Select District"
                    listSearch={getDistrictNameList}
                    searchText={(txt) => handleSearch(txt, "district")}
                    value={filterData?.district_id}
                    onChange={(e) => {
                      onChangeDropDownFilter(e, 'district_id')
                      field.onChange(e);
                      setValue(`district_id`, e)
                    }}
                    disabled={formType === "edit"}
                  />
                  {errors.district_id && (
                    <ErrorBox>
                      <ErrorOutlineIcon fontSize="small" />
                      <span>{errors.district_id.message}</span>
                    </ErrorBox>
                  )}
                </div>
              )}
            />
            <div>
              <Tooltip arrow placement="top-start" title={disableDropDown.blockZoneDisable ? 'Please select District first' : ''}
              >
                <Controller
                  name="block_zone_id"
                  control={control}
                  rules={{
                    required: "Please select Block/Zone to create."
                  }}
                  render={({ field }) => (
                    <div className="!tw-w-[328px]">
                      <DropDownWithSearch {...field}
                        options={blockList}
                        valuekey="block_zone_id"
                        labelkey="name"
                        label="Select Block/Zone"
                        listSearch={getBlockNameList}
                        searchText={(txt) => handleSearch(txt, "block")}
                        value={filterData?.block_zone_id}
                        onChange={(e) => {
                          onChangeDropDownFilter(e, 'block_zone_id')
                          field.onChange(e);
                          setValue(`block_zone_id`, e)
                        }}
                        disabled={formType === "edit" || disableDropDown.blockZoneDisable}
                      />
                      {errors.block_zone_id && (
                        <ErrorBox>
                          <ErrorOutlineIcon fontSize="small" />
                          <span>{errors.block_zone_id.message}</span>
                        </ErrorBox>
                      )}
                    </div>
                  )}
                />
              </Tooltip>
            </div>
            <div>
              <Tooltip arrow placement="top-start" title={disableDropDown.panchayatDisable ? 'Please select Block/Zone first' : ''}
              >
                <Controller
                  name="panchayat_ward_id"
                  control={control}
                  rules={{
                    required: "Please select Panchayat/Ward to create."
                  }}
                  render={({ field }) => (
                    <div className="!tw-w-[328px]">
                      <DropDownWithSearch {...field}
                        options={panchayatList}
                        valuekey="panchayat_ward_id"
                        labelkey="name"
                        label="Select Panchayat/Ward"
                        listSearch={getPanchayatNameList}
                        onChange={(e) => {
                          onChangeDropDownFilter(e, 'panchayat_ward_id')
                          field.onChange(e);
                          setValue(`panchayat_ward_id`, e)
                        }}
                        searchText={(txt) => handleSearch(txt, "panchayat")}
                        disabled={formType === "edit" || disableDropDown.panchayatDisable}
                      />
                      {errors.panchayat_ward_id && (
                        <ErrorBox>
                          <ErrorOutlineIcon fontSize="small" />
                          <span>{errors.panchayat_ward_id.message}</span>
                        </ErrorBox>
                      )}
                    </div>
                  )}
                />

              </Tooltip>
            </div>

            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Please enter Village/Area name to create.',
                validate: value => value.length > 1 || 'Please enter Village/Area name to create.',
              }}
              render={({ field }) => renderTextFieldWithError(field, 'Village/Area Name', errors.name, (e) => {
                if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                  e.preventDefault();
                }
              })}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
