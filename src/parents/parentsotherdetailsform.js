import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ParentSelectSearch from './ParentSelectSearch';
import { Controller } from 'react-hook-form';
import { ErrorBox } from '../Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { getBlockNameList, getDistrictNameList, getPanchayatNameList, getSupervisorNameList, getVillageNameList } from '../../Masters/Districts/duck/network';
import { getCEWData } from '../../parents/duck/network';

export default function ParentsOtherDetailsForm({ control, errors, DistrictData, setValue, formType, defaultValues }) {
  const dispatch = useDispatch();
  const [district, setDistrict] = useState("");
  const [blockzone, setBlockZone] = useState("");
  const [ward, setWard] = useState("");
  const [village, setVillage] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const blockZoneData = useSelector((state) => state.district.blockNameList)
  const wardData = useSelector((state) => state.district.panchayatNameList);
  const villageData = useSelector((state) => state.district.villageNameList);
  const SupervisorData = useSelector((state) => state.district.supervisorNameList)
  const cewData = useSelector((state) => state.parents.cewListData);

  useEffect(() => {
    dispatch(getDistrictNameList())
    if (formType === "edit") {
      dispatch(getBlockNameList({ district_id: defaultValues.assigned_district_id }))
      dispatch(getPanchayatNameList({ block_zone_id: defaultValues.assigned_block_zone_id }))
      dispatch(getVillageNameList({ panchayat_ward_id: defaultValues.panchayat_ward_id }))
      dispatch(getSupervisorNameList({ district_id: defaultValues.assigned_district_id, rol_type: "supervisor" }))
      dispatch(getCEWData({ village_Area_id: defaultValues.assigned_village_area_id, supervisor_id: defaultValues.assigned_supervisor_id, role_type: "cew" }))
    }
  }, [])

  return (
    <div className='tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white'>
      <Typography variant="h3" className='!tw-font-semibold tw-mb-1'>Other Details</Typography>
      <div className='tw-flex tw-flex-wrap tw-gap-6'>
        <div className='tw-w-[220px]'>
          <Controller name="assigned_district_id" rules={formType !== "edit" ? { required: 'This field is mandatory' } : formType === "edit" && (defaultValues?.assigned_district_id || district) ? { required: 'This field is mandatory' } : null} control={control}
            render={({ field: { onChange, value } }) => {
              const mergedOnChange = (selectedValue) => {
                onChange(selectedValue)
                setDistrict(selectedValue);
                dispatch(getBlockNameList({ district_id: selectedValue }))
                setValue("assigned_block_zone_id", "")
                setValue("assigned_panchayat_ward_id", "")
                setValue("assigned_village_area_id", "")
                setValue("assigned_supervisor_id", "")
                setValue("assigned_village_worker_id", "")
                setBlockZone("")
                setWard("")
                setVillage("");
                setSupervisor("");
              };
              return (
                <div className='tw-w-full tw-flex tw-flex-col'>
                  <ParentSelectSearch options={DistrictData} height={20} disabled={(defaultValues?.assigned_village_worker_id && defaultValues?.assigned_village_area_id || defaultValues?.assigned_supervisor_id && defaultValues?.assigned_supervisor_id) ? true : false} onChange={mergedOnChange} value={value || ""} valuekey="district_id" labelkey="name" label="Assigned District" />
                  {errors.assigned_district_id && (
                    <ErrorBox>
                      <ErrorOutlineIcon fontSize="small" />
                      <span>{errors.assigned_district_id.message}</span>
                    </ErrorBox>
                  )}
                </div>
              )
            }
            } />
        </div>
        <div className='tw-w-[220px]'>
          <Controller name="assigned_block_zone_id" rules={formType !== "edit" ? { required: 'This field is mandatory' } : formType === "edit" && (defaultValues?.assigned_district_id || district) ? { required: 'This field is mandatory' } : null} control={control}
            render={({ field: { onChange, value } }) => {
              const mergedOnChange = (selectedValue) => {
                onChange(selectedValue)
                setBlockZone(selectedValue);
                dispatch(getPanchayatNameList({ block_zone_id: selectedValue }))
                setValue("assigned_panchayat_ward_id", "")
                setValue("assigned_village_area_id", "")
                setValue("assigned_supervisor_id", "")
                setValue("assigned_village_worker_id", "")
                setWard("")
                setVillage("");
                setSupervisor("");
              };
              return (
                <div className='tw-w-full tw-flex tw-flex-col'>
                  <ParentSelectSearch options={blockZoneData} height={20} onChange={mergedOnChange} value={value || ""} disabled={district ? false : true} valuekey="block_zone_id" labelkey="name" label="Assign Block/Zone" />
                  {errors.assigned_block_zone_id && (
                    <ErrorBox>
                      <ErrorOutlineIcon fontSize="small" />
                      <span>{errors.assigned_block_zone_id.message}</span>
                    </ErrorBox>
                  )}
                </div>
              )
            }
            } />
        </div>
        <div className='tw-w-[220px]'>
          <Controller name="assigned_panchayat_ward_id" rules={formType !== "edit" ? { required: 'This field is mandatory' } : formType === "edit" && (defaultValues?.assigned_district_id || district) ? { required: 'This field is mandatory' } : null} control={control}
            render={({ field: { onChange, value } }) => {
              const mergedOnChange = (selectedValue) => {
                onChange(selectedValue)
                setWard(selectedValue);
                dispatch(getVillageNameList({ panchayat_ward_id: selectedValue }))
                setValue("assigned_village_area_id", "")
                setValue("assigned_supervisor_id", "")
                setValue("assigned_village_worker_id", "")
                setVillage("");
                setSupervisor("");
              };
              return (
                <div className='tw-w-full tw-flex tw-flex-col'>
                  <ParentSelectSearch options={wardData} height={20} onChange={mergedOnChange} value={value || ""} disabled={blockzone ? false : true} valuekey="panchayat_ward_id" labelkey="name" label="Assign Panchayat/Ward" />
                  {errors.assigned_panchayat_ward_id && (
                    <ErrorBox>
                      <ErrorOutlineIcon fontSize="small" />
                      <span>{errors.assigned_panchayat_ward_id.message}</span>
                    </ErrorBox>
                  )}
                </div>

              )
            }} />
        </div>
        <div className='tw-w-[220px]'>
          <Controller name="assigned_village_area_id" rules={formType !== "edit" ? { required: 'This field is mandatory' } : formType === "edit" && (defaultValues?.assigned_district_id || district) ? { required: 'This field is mandatory' } : null} control={control}
            render={({ field: { onChange, value } }) => {
              const mergedOnChange = (selectedValue) => {
                onChange(selectedValue)
                setVillage(selectedValue);
                dispatch(getSupervisorNameList({ district_id: district, role_type: "supervisor" }))
                setValue("assigned_supervisor_id", "")
                setValue("assigned_village_worker_id", "")
                setSupervisor("");
              };
              return (
                <div className='tw-w-full tw-flex tw-flex-col'>
                  <ParentSelectSearch options={villageData} height={20} onChange={mergedOnChange} value={value || ""} disabled={ward ? false : true} valuekey="village_area_id" labelkey="name" label="Assigned Village/Area " />
                  {errors.assigned_village_area_id && (
                    <ErrorBox>
                      <ErrorOutlineIcon fontSize="small" />
                      <span>{errors.assigned_village_area_id.message}</span>
                    </ErrorBox>
                  )}
                </div>
              )
            }} />
        </div>
      </div>
      <div className='tw-flex tw-gap-4'>
        <div className='tw-w-[220px]'>
          <Controller name="assigned_supervisor_id" rules={formType !== "edit" ? { required: 'This field is mandatory' } : formType === "edit" && (defaultValues?.assigned_supervisor_id || district) ? { required: 'This field is mandatory' } : null} control={control}
            render={({ field: { onChange, value } }) => {
              const mergedOnChange = (selectedValue) => {
                onChange(selectedValue)
                setSupervisor(selectedValue);
                dispatch(getCEWData({ village_area_id: village, supervisor_id: selectedValue, role_type: "cew" }))
                setValue("assigned_village_worker_id", "")
              };
              return (
                <div className='tw-w-full tw-flex tw-flex-col'>
                  <ParentSelectSearch options={SupervisorData} height={20} onChange={mergedOnChange} value={value || ""} disabled={village ? false : true} valuekey="id" labelkey="full_name" label="Assigned Supervisor" />
                  {errors.assigned_supervisor_id && (
                    <ErrorBox>
                      <ErrorOutlineIcon fontSize="small" />
                      <span>{errors.assigned_supervisor_id.message}</span>
                    </ErrorBox>
                  )}
                </div>
              )
            }} />
        </div>
        <div className='tw-w-[220px]'>
          <Controller name="assigned_village_worker_id" control={control}
            render={({ field }) => (
              <div className='tw-w-full tw-flex tw-flex-col'>
                <ParentSelectSearch options={cewData} height={20} {...field} value={field.value || ""} valuekey="id" disabled={supervisor ? false : true} labelkey="full_name" label="Assigned CEW (Optional)" />
                {errors.assigned_village_worker_id && (
                  <ErrorBox>
                    <ErrorOutlineIcon fontSize="small" />
                    <span>{errors.assigned_village_worker_id.message}</span>
                  </ErrorBox>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  )
}

