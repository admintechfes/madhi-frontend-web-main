import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import { BasicDatePicker } from '../DatePicker';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { fillAnswerFormatValue, fillAnswerTypeValue, fillCreatedByValue, fillFromValue, fillTagsValue, fillToValue } from '../../contentlibrary/duck/contentlibrarySlice';
import Filtercheckbox from '../contentlibrary/filtercheckbox';
import { Dropdown } from '../Select';

export default function Filter({ handleClose, tab, anchorEl, page, setAnchorEl, setStoreTagValue, storeTagValue, limitPerPage, setApplyFilter, applyfilter, formatForDisplay, preAddedIds, type }) {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm();
  const tagsData = useSelector((state) => state.contentlibrary.tagsData);
  const tagsValue = useSelector((state) => state.contentlibrary.tagsValue);
  const fromValue = useSelector((state) => state.contentlibrary.fromValue);
  const toValue = useSelector((state) => state.contentlibrary.toValue);

  useEffect(() => {
    if (tagsValue.length > 0 || fromValue || toValue) {
      setStoreTagValue(tagsValue.map(item => item.name))
      setApplyFilter(true)
    }
  }, [dispatch]);


  const ApplyFilter = (data) => {
    setApplyFilter(true)
    setAnchorEl(null)
  };

  const ResetFilter = () => {
    setApplyFilter(false);
    reset();
  };

  const handleCloseModal = () => {
    handleClose();
    if (!applyfilter) {
      reset();
    }
  }

  return (
    <>
      <form className={`tw-flex tw-flex-col tw-max-w-[calc(100% - 32px)] tw-min-w-4 tw-w-[400px] tw-absolute -tw-top-10 2xl:tw-top-5 tw-rounded ${anchorEl ? "openpop tw-z-[1202]" : "tw-opacity-0 -tw-z-30"}  tw-right-0 shadow-css tw-p-4 tw-bg-white`} onSubmit={handleSubmit(ApplyFilter)}>
        <div className='tw-flex tw-justify-between tw-mb-8 tw-items-center'>
          <span className='tw-text-xl tw-font-semibold'>Filters</span>
          <CloseIcon className='tw-text-secondaryText tw-cursor-pointer' onClick={handleCloseModal} />
        </div>
        <div className='tw-flex tw-justify-between tw-items-center tw-mb-5'>
          <span>Tags</span>
          <div className="tw-w-[180px]">
            <Controller name="tagIds" control={control}
              render={({ field }) => {
                const mergeOnChange = (selectedValue) => {
                  field.onChange(selectedValue);
                  setStoreTagValue(selectedValue)
                }
                return (
                  <Filtercheckbox options={[]} {...field} onChange={mergeOnChange} value={storeTagValue} valuekey="id" labelkey="name" label="Select Tags" />
                )
              }}
            />
          </div>
        </div>
        <div className='tw-flex tw-justify-between tw-items-center tw-mb-5'>
          <span>Attachment</span>
          <div className="tw-w-[180px]">
            <Controller name="atttachment" control={control}
              render={({ field }) => {
                return (
                  <Dropdown options={[]} {...field} value={field.value || ""} valuekey="id" labelkey="name" label="Select Attachment" />
                )
              }}
            />
          </div>
        </div>
        <div className='tw-flex tw-flex-col'>
          <span className='tw-text-lg  tw-text-secondaryText tw-block tw-mb-5 tw-font-semibold'>Created On date range</span>
          <div className='tw-flex tw-justify-between tw-items-center tw-mb-5'>
            <span className='tw-text-grey'>Start Date</span>
            <Controller name="minCreatedOn" control={control}
              render={({ field }) => (
                <div className="tw-w-[180px]">
                  <BasicDatePicker {...field} inputFormat="DD-MM-YYYY" value={fromValue ? moment(fromValue, 'YYYY-MM-DD') : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        field.onChange((moment(newValue).format('YYYY-MM-DD')));
                        // dispatch(fillFromValue((moment(newValue).format('YYYY-MM-DD'))))
                      } else {
                        field.onChange(null);
                        // dispatch(fillFromValue(null));
                      }
                    }} label="Date" />
                </div>
              )}
            />
          </div>
          <div className='tw-flex tw-justify-between tw-items-center tw-mb-10'>
            <span className='tw-text-grey'>End Date</span>
            <Controller name="maxCreatedOn" control={control}
              render={({ field }) => (
                <div className="tw-w-[180px]">
                  <BasicDatePicker {...field} inputFormat="DD-MM-YYYY" value={toValue} minDate={fromValue}
                    onChange={(newValue) => {
                      if (newValue) {
                        field.onChange((moment(newValue).format('YYYY-MM-DD')));
                        // dispatch(fillToValue((moment(newValue).format('YYYY-MM-DD'))))
                      } else {
                        field.onChange(null);
                        // dispatch(fillToValue(null));
                      }
                    }} label="Date" />
                </div>
              )}
            />
          </div>
        </div>
        <div className='tw-flex tw-gap-4 tw-justify-end tw-items-end'>
          <Button variant="outlined" disabled={!tagsValue.length > 0 && !fromValue && !toValue} onClick={ResetFilter} className="uppercase tw-text-secondary">Reset Filters</Button>
          <Button type="submit" disabled={!tagsValue.length > 0 && !fromValue && !toValue} variant="contained" className="uppercase">Apply</Button>
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
