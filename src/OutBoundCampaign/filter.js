import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import { BasicDatePicker } from '../DatePicker';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Filtercheckbox from '../contentlibrary/filtercheckbox';
import { getTagNameList } from '../../ManualWhatsApp/duck/network';
import { fillOutboundFromValue, fillIVRIDValue, fillTagsOutboundValue, fillOutboundToValue } from '../../OutBoundCampaign/duck/OutboundCampaignSlice';
import { Dropdown } from '../Select';
import { getOutBoundCampaignList, getOutBoundIVRIDList } from '../../OutBoundCampaign/duck/network';

export default function Filter({ handleClose, anchorEl, page, setAnchorEl, setPage, limitPerPage, storeTagValue, setStoreTagValue, setApplyFilter, applyfilter, formatForDisplay }) {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm();
  const fromValue = useSelector((state) => state.outboundCampaign.fromValue);
  const toValue = useSelector((state) => state.outboundCampaign.toValue);
  const tagsnameList = useSelector((state) => state.manualWhatsApp.tagsNameList);
  const tagsValue = useSelector((state) => state.outboundCampaign.tagsValue);
  const ivrList = useSelector((state) => state.outboundCampaign.ivrList);
  const ivrValue = useSelector((state) => state.outboundCampaign.ivrValue);

  useEffect(() => {
    dispatch(getTagNameList({ type: "outbound_ivrs" }));
    dispatch(getOutBoundIVRIDList())
    if (ivrValue || tagsValue?.length > 0 || fromValue || toValue) {
      setStoreTagValue(tagsValue)
      setApplyFilter(true)
    }
  }, [dispatch]);


  const ApplyFilter = (data) => {
    setApplyFilter(true)
    setPage(1)
    dispatch(getOutBoundCampaignList({
      ...data,
      tags: tagsValue,
      page: 1,
      perPage: limitPerPage,
    })).then(resp => {
      formatForDisplay(resp.data)
    })
    setAnchorEl(null)
  };

  const ResetFilter = () => {
    setApplyFilter(false);
    reset();
    setAnchorEl(null)
    dispatch(fillIVRIDValue(""))
    dispatch(fillTagsOutboundValue([]))
    dispatch(fillOutboundFromValue(null))
    dispatch(fillOutboundToValue(null))
    setStoreTagValue([])
    dispatch(getOutBoundCampaignList({
      page: page,
      perPage: limitPerPage,
    })).then(resp => {
      formatForDisplay(resp.data)
    })
  };

  const handleCloseModal = () => {
    handleClose();
    if (!applyfilter) {
      reset();
      dispatch(fillIVRIDValue(""))
      dispatch(fillTagsOutboundValue([]))
      dispatch(fillOutboundFromValue(null))
      dispatch(fillOutboundToValue(null))  
      setStoreTagValue([])
    }
  }

  return (
    <>
      <form className={`tw-flex tw-flex-col tw-max-w-[calc(100% - 32px)] tw-min-w-4 tw-w-[400px] tw-absolute -tw-top-10 2xl:tw-top-5 tw-rounded ${anchorEl ? "openpop tw-z-[1202]" : "tw-opacity-0 -tw-z-30"}  tw-right-0 shadow-css tw-p-4 tw-bg-white`} onSubmit={handleSubmit(ApplyFilter)}>
        <div className='tw-flex tw-justify-between tw-mb-8 tw-items-center'>
          <span className='tw-text-xl tw-font-semibold'>Filters</span>
          <CloseIcon className='tw-text-secondaryText tw-cursor-pointer' onClick={handleCloseModal} />
        </div>
        <div className='tw-flex tw-flex-col'>
          <div className='tw-flex tw-justify-between tw-items-center tw-mb-5'>
            <span>IVR ID</span>
            <div className='tw-w-[180px]'>
              <Controller name="ivrId" control={control}
                render={({ field: { onChange } }) => {
                  const mergedOnChange = (selectedValue) => {
                    onChange(selectedValue.toString())
                    dispatch(fillIVRIDValue(selectedValue.toString()))
                  };
                  return (
                    <Dropdown options={ivrList} value={ivrValue} onChange={mergedOnChange} valuekey="ivrId" labelkey="ivrId" label="Select IVR ID" />
                  )
                }}
              />
            </div>
          </div>
          <div className='tw-flex tw-justify-between tw-items-center tw-mb-5'>
            <span>Tags</span>
            <div className="tw-w-[180px]">
              <Controller name="tags" control={control}
                render={({ field }) => {
                  const mergeOnChange = (selectedValue) => {
                    field.onChange(selectedValue);
                    setStoreTagValue(selectedValue)
                  }
                  return (
                    <Filtercheckbox options={tagsnameList} outbound="outbound" {...field} onChange={mergeOnChange} value={storeTagValue} valuekey="id" labelkey="name" label="Select Tags" />
                  )
                }}
              />
            </div>
          </div>
          <div className='tw-flex tw-justify-between tw-items-center tw-mb-5'>
            <span className='tw-text-grey'>Start Date</span>
            <Controller name="startDate" control={control}
              render={({ field }) => (
                <div className="tw-w-[180px]">
                  <BasicDatePicker {...field} inputFormat="DD-MM-YYYY" value={fromValue ? moment(fromValue, 'YYYY-MM-DD') : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        field.onChange((moment(newValue).format('YYYY-MM-DD')));
                        dispatch(fillOutboundFromValue((moment(newValue).format('YYYY-MM-DD'))))
                      } else {
                        field.onChange(null);
                        dispatch(fillOutboundFromValue(null));
                      }
                    }} label="Date" />
                </div>
              )}
            />
          </div>
          <div className='tw-flex tw-justify-between tw-items-center tw-mb-10'>
            <span className='tw-text-grey'>End Date</span>
            <Controller name="endDate" control={control}
              render={({ field }) => (
                <div className="tw-w-[180px]">
                  <BasicDatePicker {...field} inputFormat="DD-MM-YYYY" value={toValue} minDate={fromValue}
                    onChange={(newValue) => {
                      if (newValue) {
                        field.onChange((moment(newValue).format('YYYY-MM-DD')));
                        dispatch(fillOutboundToValue((moment(newValue).format('YYYY-MM-DD'))))
                      } else {
                        field.onChange(null);
                        dispatch(fillOutboundToValue(null));
                      }
                    }} label="Date" />
                </div>
              )}
            />
          </div>
        </div>
        <div className='tw-flex tw-gap-4 tw-justify-end tw-items-end'>
          <Button variant="outlined" disabled={!ivrValue && !tagsValue?.length > 0 && !fromValue && !toValue} onClick={ResetFilter} className="uppercase tw-text-secondary">Reset Filters</Button>
          <Button type="submit" disabled={!ivrValue && !tagsValue?.length > 0 && !fromValue && !toValue} variant="contained" className="uppercase">Apply</Button>
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
