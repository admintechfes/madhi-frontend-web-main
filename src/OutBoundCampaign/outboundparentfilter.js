import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Filtercheckbox from '../contentlibrary/filtercheckbox';
import { getBlockNameList, getDistrictNameList, getPanchayatNameList, getVillageNameList } from '../../Masters/Districts/duck/network';
import { getOutBoundCampaignParentsList, getOutBoundParentProgramNameMaster, getOutBoundParentStatusMaster, getOutBoundParentUnitNumberMaster } from '../../OutBoundCampaign/duck/network';
import { Dropdown } from '../Select';
import { fillProgramNameValue, fillSTatusValue, fillUnitNumberValue } from '../../OutBoundCampaign/duck/OutboundCampaignSlice';
import ParentSelectSearch from '../parents/ParentSelectSearch';

export default function OutboundCampaignParentsFilter({ handleClose, storeIds, setStoreIds, setPage, anchorEl, page, applyfilter, setApplyFilter, setAnchorEl, limitPerPage, formatForDisplay }) {
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const { control, handleSubmit, reset, setValue } = useForm();
  const OutboundParentsStatusMaster = useSelector((state) => state.outboundCampaign.OutboundParentsStatusMaster)
  const districtNameList = useSelector((state) => state.district.districtNameList)
  const blockNameList = useSelector((state) => state.district.blockNameList);
  const panchayatNameList = useSelector((state) => state.district.panchayatNameList);
  const villageNameList = useSelector((state) => state.district.villageNameList);
  const status = useSelector((state) => state.outboundCampaign.status)
  const OutboundParentsProgramNameMaster = useSelector((state) => state.outboundCampaign.OutboundParentsProgramNameMaster)
  const OutboundParentsUnitNumberMaster = useSelector((state) => state.outboundCampaign.OutboundParentsUnitNumberMaster)
  const programName = useSelector((state) => state.outboundCampaign.programName)
  const unitNumber = useSelector((state) => state.outboundCampaign.unitNumber)
  const params = useParams();


  useEffect(() => {
    dispatch(getOutBoundParentProgramNameMaster())
    dispatch(getOutBoundParentStatusMaster())
    dispatch(getDistrictNameList())
    if (programName || unitNumber || status || storeIds.district_id.length || storeIds.block_zone_id.length || storeIds.panchayat_ward_id.length || storeIds.village_area_id.length) {
      setApplyFilter(true);
    }
  }, [])

  const applyFilter = (data) => {
    setApplyFilter(true);
    setPage(1)
    dispatch(getOutBoundCampaignParentsList({
      campaignId: params?.id,
      ...data,
      ...(storeIds?.district_id.length > 0 && { districtIds: storeIds?.district_id }),
      ...(storeIds?.block_zone_id.length > 0 && { blockZoneIds: storeIds?.block_zone_id }),
      ...(storeIds?.panchayat_ward_id.length > 0 && { panchayatWardIds: storeIds?.panchayat_ward_id }),
      ...(storeIds?.village_area_id.length > 0 && { villageAreaIds: storeIds?.village_area_id }),
      page: 1, perPage: limitPerPage
    })).then(res => {
      formatForDisplay(res?.data)
    })
    setAnchorEl(null);
  };

  const resetFilter = () => {
    setApplyFilter(false);
    reset();
    dispatch(fillProgramNameValue(""))
    dispatch(fillUnitNumberValue(""))
    dispatch(fillSTatusValue(""))
    setStoreIds({
      district_id: [],
      block_zone_id: [],
      panchayat_ward_id: [],
      village_area_id: []
    })
    dispatch(getOutBoundCampaignParentsList({
      campaignId: params?.id,
      page: page, perPage: limitPerPage
    })).then(res => {
      formatForDisplay(res?.data)
    })
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    handleClose();
    if (!applyfilter) {
      reset();
      dispatch(fillProgramNameValue(""))
      dispatch(fillUnitNumberValue(""))
      dispatch(fillSTatusValue(""))
      setStoreIds({
        district_id: [],
        block_zone_id: [],
        panchayat_ward_id: [],
        village_area_id: []
      })
    }
  };

  const handleDistrictChange = (selectedValue, getIds, field) => {
    const passIds = getIds.map(el => el.district_id);
    field.onChange(selectedValue);
    setStoreIds((prev) => ({
      ...prev,
      district_id: passIds,
      block_zone_id: [],
      panchayat_ward_id: [],
      village_area_id: []
    }));
    setValue("blockZoneIds", "");
    setValue("panchayatWardIds", "");
    setValue("villageAreaIds", "");

    if (selectedValue.length > 0) {
      dispatch(getBlockNameList({ programId: params.id, districtIds: passIds }));
    }
  };

  const handleBlockChange = (selectedValue, getIds, field) => {
    const passIds = getIds.map(el => el.block_zone_id);
    field.onChange(selectedValue);
    setStoreIds((prev) => ({
      ...prev,
      block_zone_id: passIds,
      panchayat_ward_id: [],
      village_area_id: []
    }));
    setValue("panchayatWardIds", "");
    setValue("villageAreaIds", "");

    if (selectedValue.length > 0) {
      dispatch(getPanchayatNameList({ programId: params.id, blockZoneIds: passIds }));
    }
  };

  const handlePanchayatChange = (selectedValue, getIds, field) => {
    const passIds = getIds.map(el => el.panchayat_ward_id);
    field.onChange(selectedValue);
    setStoreIds((prev) => ({
      ...prev,
      panchayat_ward_id: passIds,
      village_area_id: []
    }));
    setValue("villageAreaIds", "");

    if (selectedValue.length > 0) {
      dispatch(getVillageNameList({ programId: params.id, panchayatWardIds: passIds }));
    }
  };


  const handleVillageAreaChange = (selectedValue, getIds, field) => {
    const passIds = getIds.map(el => el.village_area_id);
    field.onChange(selectedValue);
    setStoreIds((prev) => ({
      ...prev,
      village_area_id: passIds
    }));
  }


  return (
    <>
      <form className={`tw-flex tw-flex-col tw-max-w-[calc(100% - 32px)] !-tw-translate-y-0 !-tw-translate-x-[50%] tw-w-[630px] tw-fixed tw-top-[10%] tw-rounded-lg ${open ? 'openpop tw-z-[1203]' : 'tw-opacity-0 -tw-z-[1203]'}  tw-right-[50%] tw-left-[50%] shadow-css tw-p-4 tw-bg-white`} onSubmit={handleSubmit(applyFilter)}>
        <div className="tw-flex tw-justify-between tw-mb-8 tw-items-center">
          <span className="tw-text-xl tw-font-semibold">Filters</span>
          <CloseIcon className="tw-text-secondaryText tw-cursor-pointer" onClick={handleCloseModal} />
        </div>
        <div className='tw-flex tw-flex-col tw-gap-x-5 tw-mb-7'>
          <span className='tw-text-base tw-font-semibold tw-mb-4 tw-block'>Program</span>
          <div className='tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-6'>
            <div className='tw-flex tw-w-fit tw-gap-4 tw-justify-between tw-items-center'>
              <span className='tw-text-sm tw-text-grey'>Program name</span>
              <div className='tw-w-[180px]'>
                <Controller name="programIds" control={control}
                  render={({ field: { onChange } }) => {
                    const mergedOnChange = (selectedValue) => {
                      onChange(selectedValue.toString())
                      dispatch(fillProgramNameValue(selectedValue.toString()))
                      dispatch(getOutBoundParentUnitNumberMaster({ programId: selectedValue }))
                    };
                    return (
                      <ParentSelectSearch options={OutboundParentsProgramNameMaster} value={programName} onChange={mergedOnChange} valuekey="id" labelkey="title" label="Select Program name" />
                    )
                  }}
                />
              </div>
            </div>
            <div className='tw-flex tw-w-fit tw-gap-4 tw-justify-between tw-items-center'>
              <span className='tw-text-sm tw-text-grey'>Unit number</span>
              <div className='tw-w-[180px]'>
                <Controller name="programUnitIds" control={control}
                  render={({ field: { onChange } }) => {
                    const mergedOnChange = (selectedValue) => {
                      onChange(selectedValue.toString())
                      dispatch(fillUnitNumberValue(selectedValue.toString()))
                    };
                    return (
                      <ParentSelectSearch options={OutboundParentsUnitNumberMaster} disabled={programName ? false : true} value={unitNumber} onChange={mergedOnChange} valuekey="id" labelkey="unitNumber" label="Select Unit number" />
                    )
                  }}
                />
              </div>
            </div>
          </div>
          <span className='tw-text-base tw-font-semibold tw-mb-4 tw-block'>Activity Type</span>
          <div className='tw-flex tw-w-fit tw-gap-16 tw-justify-between tw-items-center tw-mb-6'>
            <span className='tw-text-sm tw-text-grey'>Status</span>
            <div className='tw-w-[180px]'>
              <Controller name="status" control={control}
                render={({ field: { onChange } }) => {
                  const mergedOnChange = (selectedValue) => {
                    onChange(selectedValue.toString())
                    dispatch(fillSTatusValue(selectedValue.toString()))
                  };
                  return (
                    <Dropdown options={OutboundParentsStatusMaster} value={status} onChange={mergedOnChange} valuekey="contentType" labelkey="label" label="Select Status" />
                  )
                }}
              />
            </div>
          </div>
          <span className='tw-text-base tw-font-semibold tw-mb-4 tw-block'>Location</span>
          <div className='tw-grid tw-grid-cols-2 tw-gap-4'>
            <div className='tw-flex tw-gap-3 tw-justify-between tw-items-center'>
              <span className='tw-text-sm tw-text-grey'>District</span>
              <div className="tw-w-[180px]">
                <Controller
                  name="districtIds"
                  control={control}
                  render={({ field }) => (
                    <Filtercheckbox
                      villageactive={true}
                      setStoreIds={setStoreIds}
                      options={districtNameList}
                      {...field}
                      onChange={(selectedValue, getIds) => handleDistrictChange(selectedValue, getIds, field)}
                      value={field.value || []}
                      valuekey="district_id"
                      labelkey="name"
                      label="Select District"
                    />
                  )}
                />
              </div>
            </div>
            <div className='tw-flex tw-gap-3 tw-justify-between tw-items-center'>
              <span className='tw-text-sm tw-text-grey'>Block/Zone</span>
              <div className="tw-w-[180px]">
                <Controller
                  name="blockZoneIds"
                  control={control}
                  render={({ field }) => (
                    <Filtercheckbox
                      villageactive={true}
                      disabled={!storeIds.district_id.length}
                      setStoreIds={setStoreIds}
                      options={blockNameList}
                      {...field}
                      onChange={(selectedValue, getIds) => handleBlockChange(selectedValue, getIds, field)}
                      value={field.value || []}
                      valuekey="block_zone_id"
                      labelkey="name"
                      label="Select Block/Zone"
                    />
                  )}
                />
              </div>
            </div>
            <div className='tw-flex tw-gap-3 tw-justify-between tw-items-center'>
              <span className='tw-text-sm tw-text-grey'>Panchayat/Ward</span>
              <div className="tw-w-[180px]">
                <Controller
                  name="panchayatWardIds"
                  control={control}
                  render={({ field }) => (
                    <Filtercheckbox
                      villageactive={true}
                      disabled={!storeIds.block_zone_id.length}
                      setStoreIds={setStoreIds}
                      options={panchayatNameList}
                      {...field}
                      onChange={(selectedValue, getIds) => handlePanchayatChange(selectedValue, getIds, field)}
                      value={field.value || []}
                      valuekey="panchayat_ward_id"
                      labelkey="name"
                      label="Select Panchayat/Ward"
                    />
                  )}
                />
              </div>
            </div>
            <div className='tw-flex tw-gap-3 tw-justify-between tw-items-center'>
              <span className='tw-text-sm tw-text-grey'>Village/Area</span>
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
                      value={field.value || []}
                      valuekey="village_area_id"
                      labelkey="name"
                      label="Select Village/Area"
                      disabled={!storeIds.panchayat_ward_id.length}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="tw-flex tw-gap-4 tw-justify-end tw-items-end">
          <Button variant="outlined" disabled={!programName && !unitNumber && !status &&
            (applyfilter ? !storeIds.district_id?.length < 0 : !storeIds.district_id.length) &&
            (applyfilter ? !storeIds.block_zone_id?.length < 0 : !storeIds.block_zone_id.length) &&
            (applyfilter ? !storeIds.panchayat_ward_id?.length < 0 : !storeIds.panchayat_ward_id.length) &&
            (applyfilter ? !storeIds.village_area_id?.length < 0 : !storeIds.village_area_id.length)
          } onClick={resetFilter} className="uppercase">
            Reset Filters
          </Button>
          <Button type="submit" disabled={!programName && !unitNumber && !status && !storeIds.district_id.length && !storeIds.block_zone_id.length && !storeIds.panchayat_ward_id.length && !storeIds.village_area_id.length} variant="contained" className="uppercase">
            Apply
          </Button>
        </div>
      </form>
      <div onClick={handleCloseModal} className={`tw-fixed tw-bg-[#00000018] tw-right-0 ${open ? 'transition-op tw-z-[1202]' : 'tw-opacity-0 -tw-z-10'} tw-h-full tw-top-0 tw-w-full`}></div>
      <style>{`
        body {
          overflow: ${open ? 'hidden' : 'scroll'};
        }
      `}</style>
    </>
  );
}
