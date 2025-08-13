import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Filtercheckbox from '../contentlibrary/filtercheckbox';
import { getBlockNameList, getDistrictNameList, getPanchayatNameList, getVillageNameList } from '../../Masters/Districts/duck/network';
import { getOutBoundCampaignParentsList } from '../../OutBoundCampaign/duck/network';
import { Dropdown } from '../Select';
import { getUserRoleNameList } from '../../Users/duck/network';
import { getNotificationClickStatus, getNotificationMembersList } from '../../InAppNotifications/duck/network';

export default function InAppMemberFilter({ handleClose, storeIds, setStoreIds, setPage, anchorEl, page, applyfilter, setApplyFilter, setAnchorEl, limitPerPage, formatForDisplay }) {
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const { control, handleSubmit, reset, setValue, watch } = useForm();
  const userRoleNameList = useSelector((state) => state.user.userRoleNameList)
  const districtNameList = useSelector((state) => state.district.districtNameList)
  const blockNameList = useSelector((state) => state.district.blockNameList);
  const panchayatNameList = useSelector((state) => state.district.panchayatNameList);
  const villageNameList = useSelector((state) => state.district.villageNameList);
  const notificationClickStatus = useSelector((state) => state.notification.notificationClickStatus)
  const params = useParams();
  const watchFields = watch();

  useEffect(() => {
    dispatch(getUserRoleNameList())
    dispatch(getDistrictNameList())
    dispatch(getNotificationClickStatus())
    if (watchFields?.roleId || watchFields?.clickStatus || storeIds.district_id.length || storeIds.block_zone_id.length || storeIds.panchayat_ward_id.length || storeIds.village_area_id.length) {
      setApplyFilter(true);
    }
  }, [])

  const applyFilter = (data) => {
    setApplyFilter(true);
    setPage(1)
    dispatch(getNotificationMembersList({
      manualNotificationId: params?.id,
      ...data,
      ...(storeIds?.district_id.length > 0 && { districtIds: storeIds?.district_id }),
      ...(storeIds?.block_zone_id.length > 0 && { blockZoneIds: storeIds?.block_zone_id }),
      ...(storeIds?.panchayat_ward_id.length > 0 && { panchayatWardIds: storeIds?.panchayat_ward_id }),
      ...(storeIds?.village_area_id.length > 0 && { villageAreaIds: storeIds?.village_area_id }),
      page: page, perPage: limitPerPage,
    })).then(resp => {
      formatForDisplay(resp.data)
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
    dispatch(getNotificationMembersList({
      manualNotificationId: params?.id,
      page: page, perPage: limitPerPage,
    })).then(resp => {
      formatForDisplay(resp.data)
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

  const renderSelect = (name, options, valuekey, labelkey, label) => (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange: formOnChange, value } }) => {
        const mergedOnChange = (selectedValue) => {
          formOnChange(selectedValue);
        };
        return <Dropdown options={options} value={value} onChange={mergedOnChange} valuekey={valuekey} labelkey={labelkey} label={label} />;
      }}
    />
  );

  return (
    <>
      <form className={`tw-flex tw-flex-col tw-max-w-[calc(100% - 32px)] tw-min-w-4 tw-w-[400px] tw-absolute tw-top-0 tw-rounded ${anchorEl ? "openpop tw-z-[1202]" : "tw-opacity-0 -tw-z-30"}  tw-right-0 shadow-css tw-p-4 tw-bg-white`} onSubmit={handleSubmit(applyFilter)}>
        <div className="tw-flex tw-justify-between tw-mb-8 tw-items-center">
          <span className="tw-text-xl tw-font-semibold">Filters</span>
          <CloseIcon className="tw-text-secondaryText tw-cursor-pointer" onClick={handleCloseModal} />
        </div>
        <div className='tw-flex tw-flex-col tw-gap-4 tw-mb-5'>
          <div className="tw-flex tw-justify-between tw-items-center">
            <span className='tw-text-sm tw-text-grey'>Role</span>
            <div className="tw-w-[180px]">{renderSelect('roleId', userRoleNameList, 'role_id', 'name', 'Select Role')}</div>
          </div>
          <div className="tw-flex tw-justify-between tw-items-center">
            <span className='tw-text-sm tw-text-grey'>Click Status</span>
            <div className="tw-w-[180px]">{renderSelect('clickStatus', notificationClickStatus, 'clickStatus', 'label', 'Select Status')}</div>
          </div>
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
        <div className="tw-flex tw-gap-4 tw-justify-end tw-items-end">
          <Button variant="outlined" disabled={!watchFields?.roleId && !watchFields?.clickStatus &&
            (applyfilter ? !storeIds.district_id?.length < 0 : !storeIds.district_id.length) &&
            (applyfilter ? !storeIds.block_zone_id?.length < 0 : !storeIds.block_zone_id.length) &&
            (applyfilter ? !storeIds.panchayat_ward_id?.length < 0 : !storeIds.panchayat_ward_id.length) &&
            (applyfilter ? !storeIds.village_area_id?.length < 0 : !storeIds.village_area_id.length)
          } onClick={resetFilter} className="uppercase">
            Reset Filters
          </Button>
          <Button type="submit" disabled={!watchFields?.roleId && !watchFields?.clickStatus && !storeIds.district_id.length && !storeIds.block_zone_id.length && !storeIds.panchayat_ward_id.length && !storeIds.village_area_id.length} variant="contained" className="uppercase">
            Apply
          </Button>
        </div>
      </form>
      <div onClick={handleCloseModal} className={`tw-fixed tw-bg-transparent tw-right-0 ${anchorEl ? "transition-op tw-z-[1201]" : "tw-opacity-0 -tw-z-10"} tw-h-full tw-top-0 tw-w-full`}></div>
      <style>{`
        body {
          overflow: ${open ? 'hidden' : 'scroll'};
        }
      `}</style>
    </>
  );
}
