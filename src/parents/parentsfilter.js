import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import { BasicDatePicker } from '../DatePicker';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import ParentSelectSearch from './ParentSelectSearch';
import { getBlockNameList, getCEWNameList, getDistrictNameList, getPanchayatNameList, getSupervisorNameList, getVillageNameList } from '../../Masters/Districts/duck/network';
import { getParentsList, getShareUnitList, getShareUnitWorkshopList } from '../../parents/duck/network';
import { fillBlockZoneIds, fillCewValue, fillDistrictIds, fillEndDateValue, fillPageNumParents, fillPanchayatWardIds, fillStartDateValue, fillSupervisorValue, fillVillageAreaIds, fillVillageValue } from '../../parents/duck/parentsSlice';
import Filtercheckbox from '../contentlibrary/filtercheckbox';

export default function ParentsFilter({ handleClose, anchorEl, page, type, contentType, setAnchorEl, setIsSelectAll, setIsSelectedAll, limitPerPage, programId, programUnitId, programUnitContentId, applyfilter, setApplyFilter, formatForDisplay }) {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset, setValue } = useForm();
  const districtNameList = useSelector((state) => state.district.districtNameList)
  const blockNameList = useSelector((state) => state.district.blockNameList);
  const panchayatNameList = useSelector((state) => state.district.panchayatNameList);
  const villageNameList = useSelector((state) => state.district.villageNameList);
  const SupervisorData = useSelector((state) => state.district.supervisorNameList)
  const CEWData = useSelector((state) => state.district.CEWNameList)
  const supervisorValue = useSelector((state) => state.parents.supervisorValue);
  const cewValue = useSelector((state) => state.parents.cewValue);
  const startDateValue = useSelector((state) => state.parents.startDateValue);
  const endDateValue = useSelector((state) => state.parents.endDateValue);
  const districtIds = useSelector((state) => state.parents.district_id);
  const blockZoneIds = useSelector((state) => state.parents.block_zone_id);
  const panchayatWardIds = useSelector((state) => state.parents.panchayat_ward_id);
  const villageAreaIds = useSelector((state) => state.parents.village_area_id);

  useEffect(() => {
    dispatch(getDistrictNameList())
    dispatch(getSupervisorNameList())
    dispatch(getCEWNameList())
    if (supervisorValue || cewValue || startDateValue || endDateValue || districtIds?.length || blockZoneIds?.length || panchayatWardIds?.length || villageAreaIds?.length) {
      setApplyFilter(true)
    }
  }, [dispatch]);

  const ApplyFilter = (data) => {
    setApplyFilter(true)
    setAnchorEl(null)
    setIsSelectAll(false)
    setIsSelectedAll(false)
    dispatch(fillPageNumParents(1))
    if (type) {
      if(contentType){
        dispatch(getShareUnitWorkshopList({
          page: 1, ...data,
          ...(districtIds?.length > 0 && { districtIds: districtIds?.map(el => el?.district_id) }),
          ...(blockZoneIds.length > 0 && { blockZoneIds: blockZoneIds?.map(el => el?.block_zone_id) }),
          ...(panchayatWardIds?.length > 0 && { panchayatWardIds: panchayatWardIds?.map(el => el?.panchayat_ward_id) }),
          ...(villageAreaIds?.length > 0 && { villageAreaIds: villageAreaIds?.map(el => el?.village_area_id) }),
          per_page: limitPerPage,
          programId: programId,
          programUnitId: programUnitId,
          programUnitContentId: programUnitContentId
        })).then(resp => {
          formatForDisplay(resp?.data)
        })
      }
      else{
        dispatch(getShareUnitList({
          page: 1, ...data,
          ...(districtIds?.length > 0 && { districtIds: districtIds?.map(el => el?.district_id) }),
          ...(blockZoneIds.length > 0 && { blockZoneIds: blockZoneIds?.map(el => el?.block_zone_id) }),
          ...(panchayatWardIds?.length > 0 && { panchayatWardIds: panchayatWardIds?.map(el => el?.panchayat_ward_id) }),
          ...(villageAreaIds?.length > 0 && { villageAreaIds: villageAreaIds?.map(el => el?.village_area_id) }),
          per_page: limitPerPage,
          programId: programId,
          programUnitId: programUnitId,
          programUnitContentId: programUnitContentId
        })).then(resp => {
          formatForDisplay(resp?.data)
        })
      }
      
    }
    else {
      dispatch(getParentsList({
        page: 1, ...data,
        ...(districtIds?.length > 0 && { districtIds: districtIds?.map(el => el?.district_id) }),
        ...(blockZoneIds.length > 0 && { blockZoneIds: blockZoneIds?.map(el => el?.block_zone_id) }),
        ...(panchayatWardIds?.length > 0 && { panchayatWardIds: panchayatWardIds?.map(el => el?.panchayat_ward_id) }),
        ...(villageAreaIds?.length > 0 && { villageAreaIds: villageAreaIds?.map(el => el?.village_area_id) }),
        per_page: limitPerPage
      })).then(resp => {
        formatForDisplay(resp?.data)
      })
    }

  };

  const ResetFilter = () => {
    setApplyFilter(false);
    reset();
    dispatch(fillSupervisorValue(""))
    dispatch(fillCewValue(""))
    dispatch(fillStartDateValue(null))
    dispatch(fillEndDateValue(null))
    setAnchorEl(null)
    dispatch(getCEWNameList())
    dispatch(fillDistrictIds([]))
    dispatch(fillBlockZoneIds([]))
    dispatch(fillPanchayatWardIds([]))
    dispatch(fillVillageAreaIds([]))
    setIsSelectAll(false)
    setIsSelectedAll(false)
    if (type) {
      if(contentType){
        dispatch(getShareUnitWorkshopList({
          page: page,
          per_page: limitPerPage,
          programId: programId,
          programUnitId: programUnitId,
          programUnitContentId: programUnitContentId
        })).then(resp => {
          formatForDisplay(resp?.data)
        })
      }
      else{
        dispatch(getShareUnitList({
          page: page,
          per_page: limitPerPage,
          programId: programId,
          programUnitId: programUnitId,
          programUnitContentId: programUnitContentId
        })).then(resp => {
          formatForDisplay(resp?.data)
        })
      }
    }
    else {
      dispatch(getParentsList({
        page: page,
        per_page: limitPerPage,
      })).then(resp => {
        formatForDisplay(resp?.data)
      })
    }

  };

  const handleCloseModal = () => {
    handleClose();
    if (!applyfilter) {
      reset();
      dispatch(fillDistrictIds([]))
      dispatch(fillBlockZoneIds([]))
      dispatch(fillPanchayatWardIds([]))
      dispatch(fillVillageAreaIds([]))
      dispatch(fillSupervisorValue(""))
      dispatch(fillCewValue(""))
      dispatch(fillStartDateValue(null))
      dispatch(fillEndDateValue(null))
      dispatch(getCEWNameList())
    }
  }

  const handleDistrictChange = (selectedValue, getIds, field) => {
    const passIds = getIds.map(el => el.district_id);
    field.onChange(selectedValue);
    dispatch(fillDistrictIds(getIds))
    dispatch(fillBlockZoneIds([]))
    dispatch(fillPanchayatWardIds([]))
    dispatch(fillVillageAreaIds([]))
    setValue("blockZoneIds", "");
    setValue("panchayatWardIds", "");
    setValue("villageAreaIds", "");

    if (selectedValue.length > 0) {
      dispatch(getBlockNameList({ districtIds: passIds }));
    }
  };

  const handleBlockChange = (selectedValue, getIds, field) => {
    const passIds = getIds.map(el => el.block_zone_id);
    field.onChange(selectedValue);
    dispatch(fillBlockZoneIds(getIds))
    dispatch(fillPanchayatWardIds([]))
    dispatch(fillVillageAreaIds([]))
    setValue("panchayatWardIds", "");
    setValue("villageAreaIds", "");

    if (selectedValue.length > 0) {
      dispatch(getPanchayatNameList({ blockZoneIds: passIds }));
    }
  };

  const handlePanchayatChange = (selectedValue, getIds, field) => {
    const passIds = getIds.map(el => el.panchayat_ward_id);
    field.onChange(selectedValue);
    dispatch(fillPanchayatWardIds(getIds))

    dispatch(fillVillageAreaIds([]))
    setValue("villageAreaIds", "");

    if (selectedValue.length > 0) {
      dispatch(getVillageNameList({ panchayatWardIds: passIds }));
    }
  };


  const handleVillageAreaChange = (selectedValue, getIds, field) => {
    field.onChange(selectedValue);
    dispatch(fillVillageAreaIds(getIds))
  }

  return (
    <>
      <form className={`tw-flex tw-flex-col tw-max-w-[calc(100% - 32px)] tw-min-w-4 tw-w-[712px] tw-absolute tw-top-5 tw-rounded ${anchorEl ? "openpop tw-z-[1202]" : "tw-opacity-0 -tw-z-30"}  tw-right-0 shadow-css tw-p-4 tw-bg-white`} onSubmit={handleSubmit(ApplyFilter)}>
        <div className='tw-flex tw-justify-between tw-mb-8 tw-items-center'>
          <span className='tw-text-xl tw-font-semibold tw-text-secondaryText'>Filters</span>
          <CloseIcon className='tw-text-secondaryText tw-cursor-pointer' onClick={handleCloseModal} />
        </div>
        <div className='tw-flex tw-flex-wrap tw-gap-x-5 tw-gap-y-6 tw-mb-10'>
          <div className='tw-flex tw-gap-3 tw-w-[48.2%] tw-justify-between tw-items-center'>
            <span className='tw-text-sm'>Select District</span>
            <div className="tw-w-[180px]">
              <Controller
                name="districtIds"
                control={control}
                render={({ field }) => (
                  <Filtercheckbox
                    villageactive={true}
                    options={districtNameList}
                    {...field}
                    onChange={(selectedValue, getIds) => handleDistrictChange(selectedValue, getIds, field)}
                    value={field.value ? field.value : districtIds?.map(el => el.name)}
                    valuekey="district_id"
                    labelkey="name"
                    label="Select District"
                  />
                )
                }
              />
            </div>
          </div>
          <div className='tw-flex tw-gap-3 tw-w-[48.2%] tw-justify-between tw-items-center'>
            <span className='tw-text-sm'>Select Block/Zone</span>
            <div className="tw-w-[180px]">
              <Controller
                name="blockZoneIds"
                control={control}
                render={({ field }) => (
                  <Filtercheckbox
                    villageactive={true}
                    disabled={!districtIds?.length}
                    options={blockNameList}
                    {...field}
                    onChange={(selectedValue, getIds) => handleBlockChange(selectedValue, getIds, field)}
                    value={field.value ? field.value : blockZoneIds?.map(el => el.name)}
                    valuekey="block_zone_id"
                    labelkey="name"
                    label="Select Block/Zone"
                  />
                )
                }
              />
            </div>
          </div>
          <div className='tw-flex tw-gap-3 tw-w-[48.2%] tw-justify-between tw-items-center'>
            <span className='tw-text-sm'>Select Panchayat/Ward</span>
            <div className="tw-w-[180px]">
              <Controller
                name="panchayatWardIds"
                control={control}
                render={({ field }) => (
                  <Filtercheckbox
                    villageactive={true}
                    disabled={!blockZoneIds?.length}
                    options={panchayatNameList}
                    {...field}
                    onChange={(selectedValue, getIds) => handlePanchayatChange(selectedValue, getIds, field)}
                    value={field.value ? field.value : panchayatWardIds?.map(el => el.name)}
                    valuekey="panchayat_ward_id"
                    labelkey="name"
                    label="Select Panchayat/Ward"
                  />
                )}
              />
            </div>
          </div>
          <div className='tw-flex tw-gap-3 tw-w-[48.2%] tw-justify-between tw-items-center'>
            <span className='tw-text-sm'>Select Village/Area</span>
            <div className="tw-w-[180px]">
              <Controller
                name="villageAreaIds"
                control={control}
                render={({ field }) => (
                  <Filtercheckbox
                    villageactive={true}
                    options={villageNameList}
                    {...field}
                    onChange={(selectedValue, getIds) => handleVillageAreaChange(selectedValue, getIds, field)}
                    value={field.value ? field.value : villageAreaIds?.map(el => el.name)}
                    valuekey="village_area_id"
                    labelkey="name"
                    label="Select Village/Area"
                    disabled={!panchayatWardIds?.length}
                  />
                )}
              />
            </div>
          </div>
          <div className='tw-flex tw-gap-3 tw-w-[48.2%] tw-justify-between tw-items-center'>
            <span className='tw-text-sm'>Select Supervisor</span>
            <div className='tw-w-[180px]'>
              <Controller name="assignedSupervisorId" control={control}
                render={({ field: { onChange } }) => {
                  const mergedOnChange = (selectedValue) => {
                    onChange(selectedValue)
                    dispatch(fillSupervisorValue(selectedValue))
                    dispatch(getCEWNameList({ supervisor_id: selectedValue, role_type: "cew" }))
                    setValue('assignedCEWId', "")
                  };
                  return (
                    <ParentSelectSearch options={SupervisorData} value={supervisorValue} onChange={mergedOnChange} valuekey="id" labelkey="full_name" label="Select Supervisor" />
                  )
                }}
              />
            </div>
          </div>
          <div className='tw-flex tw-gap-3 tw-w-[48.2%] tw-justify-between tw-items-center'>
            <span className='tw-text-sm'>Select CEW</span>
            <div className='tw-w-[180px]'>
              <Controller name="assignedCEWId" control={control}
                render={({ field: { onChange } }) => {
                  const mergedOnChange = (selectedValue) => {
                    onChange(selectedValue)
                    dispatch(fillCewValue(selectedValue))
                  };
                  return (
                    <ParentSelectSearch options={CEWData} onChange={mergedOnChange} value={cewValue} valuekey="id" labelkey="full_name" label="Select CEW" />
                  )
                }
                }
              />
            </div>
          </div>
        </div>
        <div className='tw-flex tw-flex-col'>
          <span className='tw-text-lg  tw-text-secondaryText tw-block tw-mb-5 tw-font-semibold'>Date range</span>
          <div className='tw-flex tw-justify-between tw-items-start tw-gap-12 tw-mb-5'>
            <div className='tw-flex tw-justify-between tw-items-center tw-gap-2'>
              <span className='tw-text-grey tw-text-xs'>Start Date:</span>
              <Controller name="startDate" control={control}
                render={({ field }) => (
                  <div className="tw-w-[200px]">
                    <BasicDatePicker
                      maxDate={endDateValue} {...field} inputFormat="DD-MM-YYYY" value={startDateValue}
                      onChange={(newValue) => {
                        if (newValue) {
                          field.onChange((moment(newValue).format('YYYY-MM-DD')));
                          dispatch(fillStartDateValue((moment(newValue).format('YYYY-MM-DD'))))
                        } else {
                          field.onChange(null);
                          dispatch(fillStartDateValue(null));
                        }
                      }} label="Date" />
                  </div>
                )}
              />
            </div>
            <div className='tw-flex tw-justify-between tw-items-center tw-gap-2'>
              <span className='tw-text-grey tw-text-xs'>End Date:</span>
              <Controller name="endDate" control={control}
                render={({ field }) => (
                  <div className="tw-w-[200px]">
                    <BasicDatePicker {...field} inputFormat="DD-MM-YYYY" minDate={startDateValue} value={endDateValue}
                      onChange={(newValue) => {
                        if (newValue) {
                          field.onChange((moment(newValue).format('YYYY-MM-DD')));
                          dispatch(fillEndDateValue((moment(newValue).format('YYYY-MM-DD'))))
                        } else {
                          field.onChange(null);
                          dispatch(fillEndDateValue(null));
                        }
                      }} label="Date" />
                  </div>
                )}
              />
            </div>
          </div>
        </div>
        <div className='tw-flex tw-gap-4 tw-justify-end tw-items-end'>
          <Button variant="outlined" disabled={
            (applyfilter ? !districtIds?.length < 0 : !districtIds.length) &&
            (applyfilter ? !blockZoneIds?.length < 0 : !blockZoneIds.length) &&
            (applyfilter ? !panchayatWardIds?.length < 0 : !panchayatWardIds.length) &&
            (applyfilter ? !villageAreaIds?.length < 0 : !villageAreaIds.length) &&
            !supervisorValue && !cewValue && !startDateValue && !endDateValue} onClick={ResetFilter} className="uppercase tw-text-secondary">Reset Filters</Button>
          <Button type="submit" disabled={!districtIds?.length && !blockZoneIds?.length && !panchayatWardIds?.length && !villageAreaIds?.length && !supervisorValue && !cewValue && !startDateValue && !endDateValue} variant="contained" className="uppercase">Apply</Button>
        </div>
      </form>
      <div onClick={handleCloseModal} className={`tw-fixed tw-bg-transparent tw-right-0 ${anchorEl ? "transition-op tw-z-[1201]" : "tw-opacity-0 -tw-z-10"} tw-h-full tw-top-0 tw-w-full`}></div>
      <style>{`
      body {
         overflow: ${anchorEl ? "hidden" : 'scroll'};
      }
     `}</style>
    </>
  );
}
