import React, { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Controller } from 'react-hook-form';
import { BasicDatePicker } from '../DatePicker';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import ParentSelectSearch from '../parents/ParentSelectSearch';
import { fillActivityTeamMemberEndDateValue, fillActivityTeamMemberStartDateValue } from '../../Activitylog/duck/activitySlice';
import { getActivityEventList, getActivityParentsList, getActivityTeamMemberList, getActivityTeamMemberSupervisorList, getActivityTypeList } from '../../Activitylog/duck/network';
import { getOutBoundParentProgramNameMaster, getOutBoundParentUnitNumberMaster } from '../../OutBoundCampaign/duck/network';
import { fillProgramNameValue, fillUnitNumberValue } from '../../OutBoundCampaign/duck/OutboundCampaignSlice';

export default function ActivityFilter({ handleClose, anchorEl, page, setPage, setAnchorEl, parents, id, control, reset, handleSubmit, watchFields, details, limitPerPage, applyfilter, setApplyFilter, formatForDisplay }) {
  const dispatch = useDispatch();
  const activityTypeData = useSelector((state) => state.activity.activityTypeData)
  const activityEventData = useSelector((state) => state.activity.activityEventData)
  const OutboundParentsProgramNameMaster = useSelector((state) => state.outboundCampaign.OutboundParentsProgramNameMaster)
  const OutboundParentsUnitNumberMaster = useSelector((state) => state.outboundCampaign.OutboundParentsUnitNumberMaster)
  const programName = useSelector((state) => state.outboundCampaign.programName)
  const unitNumber = useSelector((state) => state.outboundCampaign.unitNumber)
  const startDateValue = useSelector((state) => state.activity.startDateValue)
  const endDateValue = useSelector((state) => state.activity.endDateValue)

  useEffect(() => {
    dispatch(getActivityTypeList())
    dispatch(getActivityEventList())
    dispatch(getOutBoundParentProgramNameMaster())
  }, [])


  const ApplyFilter = (data) => {
    setApplyFilter(true)
    setPage(1)
    if (parents) {
      dispatch(getActivityParentsList({ id: id, ...data, page: 1, per_page: limitPerPage }))
        .then(resp => {
          formatForDisplay(resp?.data)
        })
    }
    else {
      if (details?.role_name === "Senior Supervisor") {
        dispatch(getActivityTeamMemberSupervisorList({ id: details?.id, ...data, page: 1, per_page: limitPerPage }))
          .then(resp => {
            formatForDisplay(resp?.data)
          })
      }
      else {
        dispatch(getActivityTeamMemberList({ teamMemberId: details?.id, ...data, page: 1, perPage: limitPerPage }))
          .then(resp => {
            formatForDisplay(resp?.data)
          })
      }
    }
    setAnchorEl(null)
  };

  const ResetFilter = () => {
    setApplyFilter(false);
    setAnchorEl(null)
    dispatch(fillProgramNameValue(""))
    dispatch(fillUnitNumberValue(""))
    dispatch(fillActivityTeamMemberStartDateValue(null))
    dispatch(fillActivityTeamMemberEndDateValue(null))
    reset();
    if (parents) {
      dispatch(getActivityParentsList({ id: id, page: page, per_page: limitPerPage })).then(resp => {
        formatForDisplay(resp?.data)
      })
    }
    else {
      if (details?.role_name === "Senior Supervisor") {
        dispatch(getActivityTeamMemberSupervisorList({ id: details.id, page: page, per_page: limitPerPage })).then(resp => {
          formatForDisplay(resp?.data)
        })
      }
      else {
        dispatch(getActivityTeamMemberList({ teamMemberId: details.id, page: page, perPage: limitPerPage })).then(resp => {
          formatForDisplay(resp?.data)
        })
      }

    }
  };

  const handleCloseModal = () => {
    handleClose();
    if (!applyfilter) {
      reset();
      dispatch(fillProgramNameValue(""))
      dispatch(fillUnitNumberValue(""))
      dispatch(fillActivityTeamMemberStartDateValue(null))
      dispatch(fillActivityTeamMemberEndDateValue(null))
    }
  }

  const renderSelect = (name, options, valuekey, labelkey, label) => (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange: formOnChange, value } }) => {
        const mergedOnChange = (selectedValue) => {
          formOnChange(selectedValue);
        };
        return <ParentSelectSearch options={options} value={value} onChange={mergedOnChange} valuekey={valuekey} labelkey={labelkey} label={label} />;
      }}
    />
  );


  return (
    <>
      <form className={`tw-flex tw-flex-col tw-max-w-[calc(100% - 32px)] !-tw-translate-y-0 !-tw-translate-x-[50%] tw-w-[900px] tw-fixed tw-top-[10%] tw-rounded-lg ${anchorEl ? 'openpop tw-z-[1203]' : 'tw-opacity-0 -tw-z-[1203]'}  tw-right-[50%] tw-left-[50%] shadow-css tw-p-4 tw-bg-white`} onSubmit={handleSubmit(ApplyFilter)}>
        <div className="tw-flex tw-justify-between tw-mb-8 tw-items-center">
          <span className="tw-text-xl tw-font-semibold">Filters</span>
          <CloseIcon className="tw-text-secondaryText tw-cursor-pointer" onClick={handleCloseModal} />
        </div>
        <div className='tw-flex tw-flex-col tw-gap-x-5 tw-mb-7'>
          <span className='tw-text-base tw-font-semibold tw-mb-4 tw-block'>Activity Type</span>
          <div className='tw-flex tw-justify-between tw-mb-6'>
            <div className='tw-flex tw-w-fit tw-gap-12 tw-justify-between tw-items-center'>
              <span className='tw-text-sm tw-text-grey'>Activity</span>
              <div className="tw-w-[325px]">{renderSelect('activityType', activityTypeData, 'activityType', 'label', 'Select Activity')}</div>
            </div>
            <div className="tw-flex tw-gap-12 tw-justify-between tw-items-center">
              <span className='tw-text-sm tw-text-grey'>Event</span>
              <div className="tw-w-[325px]">{renderSelect('eventType', activityEventData, 'eventType', 'label', 'Select Event')}</div>
            </div>
          </div>
          <span className='tw-text-base tw-font-semibold tw-mb-4 tw-block'>Program</span>
          <div className='tw-flex tw-justify-between tw-gap-4 tw-mb-6'>
            <div className='tw-flex tw-w-fit tw-gap-1 tw-justify-between tw-items-center'>
              <span className='tw-text-sm tw-text-grey'>Program name</span>
              <div className='tw-w-[325px]'>
                <Controller name="programId" control={control}
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
              <span className='tw-text-sm tw-text-grey'>Unit name</span>
              <div className='tw-w-[325px]'>
                <Controller name="programUnitId" control={control}
                  render={({ field: { onChange } }) => {
                    const mergedOnChange = (selectedValue) => {
                      onChange(selectedValue.toString())
                      dispatch(fillUnitNumberValue(selectedValue.toString()))
                    };
                    return (
                      <ParentSelectSearch options={OutboundParentsUnitNumberMaster} disabled={programName ? false : true} value={unitNumber} onChange={mergedOnChange} valuekey="id" labelkey="title" label="Select Unit name" />
                    )
                  }}
                />
              </div>
            </div>
          </div>
          <span className='tw-text-base tw-font-semibold tw-mb-4 tw-block'>Date range</span>
          <div className='tw-flex tw-justify-between'>
            <div className="tw-flex tw-justify-between tw-gap-9 tw-items-center">
              <span className='tw-text-sm tw-text-grey'>Start Date</span>
              <Controller name="startDate" control={control}
                render={({ field }) => (
                  <div className="tw-w-[325px]">
                    <BasicDatePicker
                      maxDate={endDateValue} {...field} inputFormat="DD-MM-YYYY" value={startDateValue}
                      onChange={(newValue) => {
                        if (newValue) {
                          field.onChange((moment(newValue).format('YYYY-MM-DD')));
                          dispatch(fillActivityTeamMemberStartDateValue((moment(newValue).format('YYYY-MM-DD'))))
                        } else {
                          field.onChange(null);
                          dispatch(fillActivityTeamMemberStartDateValue(null));
                        }
                      }} label="Date" />
                  </div>
                )}
              />
            </div>
            <div className="tw-flex tw-justify-between tw-gap-6 tw-items-center">
              <span className='tw-text-sm tw-text-grey'>End Date</span>
              <Controller name="endDate" control={control}
                render={({ field }) => (
                  <div className="tw-w-[325px]">
                    <BasicDatePicker {...field} inputFormat="DD-MM-YYYY" minDate={startDateValue} value={endDateValue}
                      onChange={(newValue) => {
                        if (newValue) {
                          field.onChange((moment(newValue).format('YYYY-MM-DD')));
                          dispatch(fillActivityTeamMemberEndDateValue((moment(newValue).format('YYYY-MM-DD'))))
                        } else {
                          field.onChange(null);
                          dispatch(fillActivityTeamMemberEndDateValue(null));
                        }
                      }} label="Date" />
                  </div>
                )}
              />
            </div>
          </div>
        </div>
        <div className='tw-flex tw-gap-4 tw-justify-end tw-items-end'>
          <Button variant="outlined" disabled={!watchFields?.activityType && !watchFields?.eventType && !programName && !unitNumber && !startDateValue && !endDateValue} onClick={ResetFilter} className="uppercase tw-text-secondary">Reset Filters</Button>
          <Button type="submit" disabled={!watchFields?.activityType && !watchFields?.eventType && !programName && !unitNumber && !startDateValue && !endDateValue} variant="contained" className="uppercase">Apply</Button>
        </div>
      </form>
      <div onClick={handleCloseModal} className={`tw-fixed tw-bg-[#00000018] tw-right-0 ${anchorEl ? 'transition-op tw-z-[1202]' : 'tw-opacity-0 -tw-z-10'} tw-h-full tw-top-0 tw-w-full`}></div>
      <style>{`
      body {
         overflow: ${anchorEl ? "hidden" : 'scroll'};
      }
     `}</style>
    </>
  );
}
