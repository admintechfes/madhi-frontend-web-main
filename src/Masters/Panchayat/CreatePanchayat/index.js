import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, TextField, Tooltip, Typography } from '@mui/material';
import { ErrorBox } from '../../../components/Errorbox';
import SelectComponent, { Dropdown } from '../../../components/Select';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createPanchayat, getStateList, updatePanchayat } from '../duck/network';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DropDownWithSearch from '../../../components/Masters/DropDownWithSearch';
import { getBlockNameList, getDistrictNameList } from '../../Districts/duck/network';



export default function CreatePanchayat({ formType, panchayatDetails }) {
  const [filterData, setFilterData] = useState({
    district_id: panchayatDetails?.district_id || "",
    block_zone_id: panchayatDetails?.block_zone_id || "",

  });
  const [blockList, setBlockList] = useState([])
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: panchayatDetails,
    mode: "onChange"
  });
  const districtName = useSelector((state) => state.district.districtNameList);
  const blockName = useSelector((state) => state.district.blockNameList);
  const [disableDropDown, setDisableDropDown] = useState({
    blockZoneDisable: true,
    panchayatDisable:true
  })



  useEffect(() => {
    dispatch(getDistrictNameList())
    dispatch(getBlockNameList({ ...filterData, source: "masters" })).then((resp) => {
      setBlockList(resp)
    })


    if(formType==="edit"){
      setDisableDropDown((prev)=>({...prev,panchayatDisable:false}))
    }
    if (panchayatDetails) {
      setValue("district_id", panchayatDetails.district_id);
      setValue("block_zone_id", panchayatDetails.block_zone_id);


    }
  }, [filterData])


  const handleCancel = () => {
    navigate(`/masters/panchayat_ward`)
  }

  const renderTextFieldWithError = (field, label, error, onKeyPress, type, params) => (
    <div className="!tw-w-[328px]">
      <TextField variant="outlined" size="small" disabled={disableDropDown.panchayatDisable} label={label} type={type ? type : "text"} onKeyPress={onKeyPress} value={field.value || ''} {...field} className='!tw-w-[328px]' />
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
      dispatch(createPanchayat(values)).then((resp) => {
        if (resp?.data?.statusCode === 200) navigate(`/masters/panchayat_ward`)
      })
    } else {
      dispatch(updatePanchayat(values)).then((resp) => {
        if (resp?.data?.statusCode === 200) navigate(`/masters/panchayat_ward`)
      })
    }
  }

  const onChangeDropDownFilter = (e, type) => {
    if (type === "district_id") {
      setFilterData({ ...filterData, district_id: e,block_zone_id: "",source: "masters" });

      dispatch(getBlockNameList({ district_id: e, source: "masters" }))
      setDisableDropDown((res)=>({...res,blockZoneDisable:false, panchayatDisable: true}))
      setValue('name', '');
      setValue(`block_zone_id`, "")

    }

    if (type === "block_zone_id") {
      setFilterData({ ...filterData, block_zone_id: e,source: "masters" });
      setDisableDropDown((res) => ({ ...res, panchayatDisable: false }))

    }




  }

  const handleSearch=(txt,type)=>{
    if(type=="district"){
      dispatch(getDistrictNameList(txt))
       // Clear the value of the TextField


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
            <Link to="/masters/panchayat_ward"  >
              <ArrowBackIcon className="tw-text-grey" />
              <span className="tw-text-grey tw-ml-2 tw-mt-2 tw-text-sm tw-leading-normal">panchayat/ward</span>
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
          <h2 className='tw-text-secondaryText tw-font-bold tw-text-2xl '>Create New Panchayat/Ward</h2>
        </div>
        <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
          <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">Panchayat/Ward Info
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
                    value={filterData.district_id}
                    labelkey="name"
                    label="Select District"
                    listSearch={getDistrictNameList}
                    searchText={(txt)=>handleSearch(txt,"district")}
                    disabled={formType === "edit"}
                    onChange={(e) => {
                      onChangeDropDownFilter(e, 'district_id')
                      field.onChange(e);
                      setValue(`district_id`, e)
                    }}
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
                    options={blockName}
                    valuekey="block_zone_id"
                    value={filterData.block_zone_id}
                    labelkey="name"
                    label="Select Block/Zone"
                    listSearch={getDistrictNameList}
                    searchText={(txt)=>handleSearch(txt,"block")}
                    disabled={formType === "edit" ||disableDropDown.blockZoneDisable }
                    onChange={(e) => {
                      onChangeDropDownFilter(e, 'block_zone_id')
                      field.onChange(e);
                      setValue(`block_zone_id`, e)
                    }
                    }
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
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Please enter Panchayat/Ward name to create.',
                validate: value => value.length > 1 || 'Please enter Panchayat/Ward name to create.',
              }}
              render={({ field }) => renderTextFieldWithError(field, 'Panchayat/Ward Name', errors.name)}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
