import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import { BasicDatePicker } from '../DatePicker';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTags, getContentLibraryList, getCreatedByList } from '../../contentlibrary/duck/network';
import moment from 'moment';
import ParentSelectSearch from '../parents/ParentSelectSearch';
import { fillAnswerFormatValue, fillAnswerTypeValue, fillCreatedByValue, fillFromValue, fillTagsValue, fillToValue } from '../../contentlibrary/duck/contentlibrarySlice';
import FilterCheckBox from './filtercheckbox';
import { Dropdown } from '../Select';

export default function ContentFilter({ handleClose, tab, anchorEl, page, setAnchorEl, setStoreTagValue, storeTagValue, limitPerPage, setApplyFilter, applyfilter, formatForDisplay, preAddedIds, type }) {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm();
  const tagsData = useSelector((state) => state.contentlibrary.tagsData);
  const usersData = useSelector((state) => state.contentlibrary.createdData);
  const tagsValue = useSelector((state) => state.contentlibrary.tagsValue);
  const createdbyValue = useSelector((state) => state.contentlibrary.createdbyValue);
  const fromValue = useSelector((state) => state.contentlibrary.fromValue);
  const toValue = useSelector((state) => state.contentlibrary.toValue);
  const answerFormatValue = useSelector((state) => state.contentlibrary.answerFormatValue)
  const answerTypeValue = useSelector((state) => state.contentlibrary.answerTypeValue)

  const QuizAnswerFormatData = [
    { label: "Text", value: "1" },
    { label: "Image", value: "2" },
    { label: "Image with text", value: "4" },
    { label: "Audio", value: "3" },
    { label: "Audio with text", value: "5" }
  ]

  const AnswerTypeDataForSurvey = [
    { label: "Short Answer (200 character)", optionType: "1" },
    { label: "Long Answer (1000 character)", optionType: "2" },
    { label: "Multiple Choice (One answer)", optionType: "3" },
    { label: "Multiple Choice (Many answers)", optionType: "4" },
    { label: "Matrix Grid", optionType: "5" },
    { label: "Multiple textboxes", optionType: "6" },
    { label: "File upload", optionType: "7" }
  ]


  useEffect(() => {
    dispatch(getAllTags());
    dispatch(getCreatedByList())
    if (tagsValue.length > 0 || createdbyValue || fromValue || toValue || answerFormatValue || answerTypeValue) {
      setStoreTagValue(tagsValue.map(item => item.name))
      setApplyFilter(true)
    }
  }, [dispatch]);


  const ApplyFilter = (data) => {
    let contentType = tab == 0 ? 1 : 2;
			if (type && (type == 'w_survey' || type == 'survey')) {
				contentType = 2;
			}
    setApplyFilter(true)
    setAnchorEl(null)
    dispatch(getContentLibraryList({
      page: 1,
      type: contentType,
      tagIds: tagsValue.map(item => item.id),
      createdBy: createdbyValue,
      minCreatedOn: fromValue,
      maxCreatedOn: toValue,
      answerFormat: answerFormatValue,
      answerType: answerTypeValue,
      per_page: limitPerPage,
    })).then(resp => {
      /* Modified by nayan for accomplishing unit content feature */
      if (preAddedIds && preAddedIds.length > 0) {
        const filterData = resp?.data.filter((question) => !preAddedIds.includes(question.id));
        formatForDisplay(filterData);
      } else {
        formatForDisplay(resp?.data);
      }
    });
  };

  const ResetFilter = () => {
    let contentType = tab == 0 ? 1 : 2;
			if (type && (type == 'w_survey' || type == 'survey')) {
				contentType = 2;
			}
    setApplyFilter(false);
    reset();
    dispatch(fillTagsValue([]))
    dispatch(fillCreatedByValue(""))
    dispatch(fillFromValue(null))
    dispatch(fillToValue(null))
    setAnchorEl(null); ([])
    setStoreTagValue([])
    dispatch(fillAnswerFormatValue(""))
    dispatch(fillAnswerTypeValue(""))
    dispatch(getContentLibraryList({
      page: page,
      type: contentType,
      per_page: limitPerPage
    })).then(resp => {
      if (preAddedIds && preAddedIds.length > 0) {
        const filterData = resp?.data.filter(question => !preAddedIds.includes(question.id));
        formatForDisplay(filterData);
      } else {
        formatForDisplay(resp?.data);
      }
    });
  };

  const handleCloseModal = () => {
    handleClose();
    if (!applyfilter) {
      reset();
      dispatch(fillTagsValue([]))
      dispatch(fillCreatedByValue(""))
      dispatch(fillFromValue(null))
      dispatch(fillToValue(null))
      setStoreTagValue([])
      dispatch(fillAnswerFormatValue(""))
      dispatch(fillAnswerTypeValue(""))
    }
  }

  return (
    <>
      <form className={`tw-flex tw-flex-col tw-max-w-[calc(100% - 32px)] tw-min-w-4 tw-w-[450px] tw-absolute -tw-top-10 2xl:tw-top-5 tw-rounded ${anchorEl ? "openpop tw-z-[1202]" : "tw-opacity-0 -tw-z-30"}  tw-right-0 shadow-css tw-p-4 tw-bg-white`} onSubmit={handleSubmit(ApplyFilter)}>
        <div className='tw-flex tw-justify-between tw-mb-8 tw-items-center'>
          <span className='tw-text-xl tw-font-semibold'>Filters</span>
          <CloseIcon className='tw-text-secondaryText tw-cursor-pointer' onClick={handleCloseModal} />
        </div>
        <div className='tw-flex tw-justify-between tw-items-center tw-mb-5'>
          <span>Select Tags</span>
          <div className={`${tab == 0 ? "tw-w-[180px]" : "tw-w-[280px]"}`}>
            <Controller name="tagIds" control={control}
              render={({ field }) => {
                const mergeOnChange = (selectedValue) => {
                  field.onChange(selectedValue);
                  setStoreTagValue(selectedValue)
                }
                return (
                  <FilterCheckBox options={tagsData} {...field} onChange={mergeOnChange} value={storeTagValue} valuekey="id" labelkey="name" label="Select Tags" />
                )
              }}
            />
          </div>
        </div>
        <div className='tw-flex tw-justify-between tw-items-center tw-mb-5'>
          <span>Created By</span>
          <div className={`${tab == 0 ? "tw-w-[180px]" : "tw-w-[280px]"}`}>
            <Controller name="createdBy" control={control}
              render={({ field }) => {
                const mergeOnChange = (selectedValue) => {
                  field.onChange(selectedValue);
                  dispatch(fillCreatedByValue(selectedValue))
                }
                return (
                  <ParentSelectSearch options={usersData} {...field} onChange={mergeOnChange} value={createdbyValue} valuekey="id" labelkey="full_name" label="Created By" />
                )
              }}
            />
          </div>
        </div>

        {tab == 0 ? <div className='tw-flex tw-justify-between tw-items-center tw-mb-5'>
          <span>Answer Format</span>
          <div className='tw-w-[180px]'>
            <Controller name="answerFormat" control={control}
              render={({ field }) => {
                const mergeOnChange = (selectedValue) => {
                  field.onChange(selectedValue);
                  dispatch(fillAnswerFormatValue(selectedValue))
                }
                return (
                  <Dropdown options={QuizAnswerFormatData} {...field} onChange={mergeOnChange} value={answerFormatValue} valuekey="value" labelkey="label" label="Answer Format" />
                )
              }}
            />
          </div>
        </div>
          :
          <div className='tw-flex tw-justify-between tw-items-center tw-mb-5'>
            <span>Answer Type</span>
            <div className='tw-w-[280px]'>
              <Controller name="answerType" control={control}
                render={({ field }) => {
                  const mergeOnChange = (selectedValue) => {
                    field.onChange(selectedValue);
                    dispatch(fillAnswerTypeValue(selectedValue))
                  }
                  return (
                    <Dropdown options={AnswerTypeDataForSurvey} {...field} onChange={mergeOnChange} value={answerTypeValue} valuekey="optionType" labelkey="label" label="Answer Type" />
                  )
                }}
              />
            </div>
          </div>
        }

        <div className='tw-flex tw-flex-col'>
          <span className='tw-text-lg  tw-text-secondaryText tw-block tw-mb-5 tw-font-semibold'>Question created On</span>
          <div className='tw-flex tw-justify-between tw-items-center tw-mb-5'>
            <span className='tw-text-grey'>From</span>
            <Controller name="minCreatedOn" control={control}
              render={({ field }) => (
                <div className="tw-w-[180px]">
                  <BasicDatePicker {...field} inputFormat="DD-MM-YYYY" value={fromValue ? moment(fromValue, 'YYYY-MM-DD') : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        field.onChange((moment(newValue).format('YYYY-MM-DD')));
                        dispatch(fillFromValue((moment(newValue).format('YYYY-MM-DD'))))
                      } else {
                        field.onChange(null);
                        dispatch(fillFromValue(null));
                      }
                    }} label="Date" />
                </div>
              )}
            />
          </div>
          <div className='tw-flex tw-justify-between tw-items-center tw-mb-10'>
            <span className='tw-text-grey'>To</span>
            <Controller name="maxCreatedOn" control={control}
              render={({ field }) => (
                <div className="tw-w-[180px]">
                  <BasicDatePicker {...field} inputFormat="DD-MM-YYYY" value={toValue} minDate={fromValue}
                    onChange={(newValue) => {
                      if (newValue) {
                        field.onChange((moment(newValue).format('YYYY-MM-DD')));
                        dispatch(fillToValue((moment(newValue).format('YYYY-MM-DD'))))
                        } else {
                        field.onChange(null);
                        dispatch(fillToValue(null));
                      }
                    }} label="Date" />
                </div>
              )}
            />
          </div>
        </div>
        <div className='tw-flex tw-gap-4 tw-justify-end tw-items-end'>
          <Button variant="outlined" disabled={!tagsValue.length > 0 && !createdbyValue && !fromValue && !toValue && !answerFormatValue && !answerTypeValue} onClick={ResetFilter} className="uppercase tw-text-secondary">Reset Filters</Button>
          <Button type="submit" disabled={!tagsValue.length > 0 && !createdbyValue && !fromValue && !toValue && !answerFormatValue && !answerTypeValue} variant="contained" className="uppercase">Apply</Button>
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
