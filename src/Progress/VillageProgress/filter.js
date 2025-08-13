import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getActiveProgramDistrictNameList, getVillageWiseProgressList } from '../../Progress/duck/network';
import { getBlockNameList, getPanchayatNameList, getVillageNameList } from '../../Masters/Districts/duck/network';
import Filtercheckbox from '../../components/contentlibrary/filtercheckbox';

export default function VillageProgressFilter({ handleClose, storeIds, setStoreIds, programId, unitId, setPage, anchorEl, page, applyfilter, setApplyFilter, setAnchorEl, limitPerPage, formatForDisplay }) {
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const { control, handleSubmit, reset, setValue } = useForm();
  const activeProgramDistrictList = useSelector((state) => state.progress.activeProgramDistrictList);
  const blockNameList = useSelector((state) => state.district.blockNameList);
  const panchayatNameList = useSelector((state) => state.district.panchayatNameList);
  const villageNameList = useSelector((state) => state.district.villageNameList);
  const params = useParams();

  useEffect(() => {
    if (storeIds.district_id.length || storeIds.block_zone_id.length || storeIds.panchayat_ward_id.length || storeIds.village_area_id.length) {
      setApplyFilter(true);
    }
  }, [])

  useEffect(() => {
    if (programId) {
      dispatch(getActiveProgramDistrictNameList({ programId: programId }));
    }
  }, [dispatch, programId]);

  const applyFilter = () => {
    setApplyFilter(true);
    setPage(1)
    dispatch(getVillageWiseProgressList({
      program_id: programId,
      program_unit_id: unitId,
      ...(storeIds?.district_id.length > 0 && { district_ids: storeIds?.district_id }),
      ...(storeIds?.block_zone_id.length > 0 && { blockZoneIds: storeIds?.block_zone_id }),
      ...(storeIds?.panchayat_ward_id.length > 0 && { panchayatWardIds: storeIds?.panchayat_ward_id }),
      ...(storeIds?.village_area_id.length > 0 && { village_area_ids: storeIds?.village_area_id }),
      page: 1, per_page: limitPerPage
    })).then(res => {
      formatForDisplay(res?.headers, res?.data)
    })
    setAnchorEl(null);
  };

  const resetFilter = () => {
    setApplyFilter(false);
    reset();
    setStoreIds({
      district_id: [],
      block_zone_id: [],
      panchayat_ward_id: [],
      village_area_id: []
    })
    dispatch(getVillageWiseProgressList({
      program_id: programId,
      program_unit_id: unitId,
      page: page, per_page: limitPerPage
    })).then(res => {
      formatForDisplay(res?.headers, res?.data)
    })
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    handleClose();
    if (!applyfilter) {
      reset();
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
    setValue("block_zone_ids", "");
    setValue("panchayat_ward_ids", "");
    setValue("village_area_ids", "");

    if (selectedValue.length > 0) {
      dispatch(getBlockNameList({ programId: params.id, district_ids: passIds }));
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
    setValue("panchayat_ward_ids", "");
    setValue("village_area_ids", "");

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
    setValue("village_area_ids", "");

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
      <form className={`tw-flex tw-flex-col tw-max-w-[calc(100% - 32px)] tw-min-w-4 tw-w-[420px] tw-absolute tw-top-5 tw-rounded ${open ? 'openpop tw-z-30' : 'tw-opacity-0 -tw-z-30'}  tw-right-0 shadow-css tw-p-4 tw-bg-white`} onSubmit={handleSubmit(applyFilter)}>
        <div className="tw-flex tw-justify-between tw-mb-8 tw-items-center">
          <span className="tw-text-xl tw-font-semibold">Filters</span>
          <CloseIcon className="tw-text-secondaryText tw-cursor-pointer" onClick={handleCloseModal} />
        </div>
        <div className='tw-flex tw-flex-col tw-gap-x-5 tw-gap-y-6 tw-mb-10'>
          <div className='tw-flex tw-gap-3 tw-justify-between tw-items-center'>
            <span className='tw-text-sm'>Select District</span>
            <div className="tw-w-[180px]">
              <Controller
                name="district_ids"
                control={control}
                render={({ field }) => (
                  <Filtercheckbox
                    villageactive={true}
                    setStoreIds={setStoreIds}
                    options={activeProgramDistrictList}
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
            <span className='tw-text-sm'>Select Block/Zone</span>
            <div className="tw-w-[180px]">
              <Controller
                name="block_zone_ids"
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
            <span className='tw-text-sm'>Select Panchayat/Ward</span>
            <div className="tw-w-[180px]">
              <Controller
                name="panchayat_ward_ids"
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
            <span className='tw-text-sm'>Select Village/Area</span>
            <div className="tw-w-[180px]">
              <Controller
                name="village_area_ids"
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
        <div className="tw-flex tw-gap-4 tw-justify-end tw-items-end">
          <Button variant="outlined" disabled={
            (applyfilter ? !storeIds.district_id?.length < 0 : !storeIds.district_id.length) &&
            (applyfilter ? !storeIds.block_zone_id?.length < 0 : !storeIds.block_zone_id.length) &&
            (applyfilter ? !storeIds.panchayat_ward_id?.length < 0 : !storeIds.panchayat_ward_id.length) &&
            (applyfilter ? !storeIds.village_area_id?.length < 0 : !storeIds.village_area_id.length)
          } onClick={resetFilter} className="uppercase">
            Reset Filters
          </Button>
          <Button type="submit" disabled={!storeIds.district_id.length && !storeIds.block_zone_id.length && !storeIds.panchayat_ward_id.length && !storeIds.village_area_id.length} variant="contained" className="uppercase">
            Apply
          </Button>
        </div>
      </form>
      <div onClick={handleCloseModal} className={`tw-fixed tw-bg-transparent tw-right-0 ${open ? 'transition-op tw-z-10' : 'tw-opacity-0 -tw-z-10'} tw-h-full tw-top-0 tw-w-full`}></div>
      <style>{`
        body {
          overflow: ${open ? 'hidden' : 'scroll'};
        }
      `}</style>
    </>
  );
}
