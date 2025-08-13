import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { ErrorBox } from '../../../components/Errorbox';
import SelectComponent from '../../../components/Select';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {  createBlock, getDistrictName, updateBlock } from '../duck/network';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DropDownWithSearch from '../../../components/Masters/DropDownWithSearch';
import { getDistrictNameList, getStateList } from '../../Districts/duck/network';

// import { getStateList } from '../../Districts/duck/network';



export default function CreateBlock({ formType, blockDetails }) {


  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors }, setValue} = useForm({
    defaultValues: blockDetails,
    mode: "onChange"
  });
  const list = useSelector((state) => state.district.districtNameList);
  const [disableDropDown, setDisableDropDown] = useState({
    blockZoneDisable: true,
  })

  useEffect(() => {
    // dispatch(getDistrictName())
    dispatch(getDistrictNameList())
    if(formType==="edit"){
      setDisableDropDown((prev)=>({...prev,blockZoneDisable:false}))
    }
  }, [])


  const handleCancel = () => {
    navigate(`/masters/block_zone`)
  }


  const renderTextFieldWithError = (field, label, error, onKeyPress, type, params) => (
    <div className="!tw-w-[328px]">
      <TextField variant="outlined" size="small" disabled={disableDropDown.blockZoneDisable} label={label} type={type ? type : "text"} onKeyPress={onKeyPress} value={field.value || ''} {...field} className='!tw-w-[328px]' />
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
      dispatch(createBlock(values)).then((resp) => {
        if (resp?.data?.statusCode === 200) navigate(`/masters/block_zone`)
      })
    } else {
      dispatch(updateBlock(values)).then((resp) => {
        if (resp?.data?.statusCode === 200) navigate(`/masters/block_zone`)
      })
    }
  }



  const handleSearch=(txt,type)=>{
    if(type=="district"){
      dispatch(getDistrictNameList(txt))
    }
    
    if(type==="block"){
      dispatch(getBlockNameList({ ...filterData,search:txt, source: "masters" })).then((resp)=>setBlockList(resp))
    }
    
    if(type==="panchayat"){
      dispatch(getPanchayatNameList({ ...filterData,search:txt, source: "masters" })).then((resp) => {
        setPanchayatList(resp);
      });
    }
    }
  return (
    <form onSubmit={handleSubmit(onSubmitDistrict)}>
      <div className='!tw-bg-[#FAFCFE]'>
        <div className="tw-flex tw-items-center tw-w-full tw-justify-between ">
          <div className='tw-flex tw-justify-center '>
            <Link to="/masters/block_zone"  >
              <ArrowBackIcon className="tw-text-grey" />
              <span className="tw-text-grey tw-ml-2 tw-mt-2 tw-text-sm tw-leading-normal">Block/Zone</span>
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
          <h2 className='tw-text-secondaryText tw-font-bold tw-text-2xl '>Create New Block/Zone</h2>
        </div>
        <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
          <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">Block/Zone Info
          </Typography>
          <div className='tw-flex tw-gap-8  tw-flex-wrap'>
            <Controller
              name="district_id"
              control={control}
              rules={{
                required: "Please select District to create."
              }}
              render={({ field }) => (
                <div className="!tw-w-[328px]">
                {}
                  <DropDownWithSearch {...field}
                    options={list}
                    valuekey="district_id"
                    labelkey="name"
                    label="Select District"
                    disabled={formType==="edit"}
                    onChange={(e) => {
                      setDisableDropDown((res)=>({...res,blockZoneDisable:false}))
                          setValue(`district_id`, e)
                          field.onChange(e);
                        }}
                    listSearch={getDistrictNameList}
                    searchText={(txt)=>handleSearch(txt,"district")}
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
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Please enter Block/Zone name to create.',
                validate: value => value.length > 1 || 'Please enter Block/Zone name to create.',
              }}
              render={({ field }) => renderTextFieldWithError(field, 'Block/Zone Name', errors.name)}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
