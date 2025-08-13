import React, { useEffect, useState } from 'react'
import EnhancedTable from '../components/parents/Table'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, CircularProgress, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { ActivityHeader } from '../components/Users/activityheader'
import filter_on from '../../public/assets/icons/filter_on.svg';
import FilterListIcon from '@mui/icons-material/FilterList';
import ActivityFilter from '../components/activitylog/activityfilter';
import { getActivityParentsList, getActivityTeamMemberList, getActivityTeamMemberSupervisorList } from './duck/network';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

export default function ActivityLog() {
  const loader = useSelector((state) => state.activity.loading)
  const [list, setList] = useState([])
  const [header, setHeader] = useState([]);
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const paginateInfo = useSelector((state) => state.activity.paginateInfo);
  const paginateParentsInfo = useSelector((state) => state.activity.paginateParentsInfo)
  const paginateSupervisorInfo = useSelector((state) => state.activity.paginateSupervisorInfo);


  const navigate = useNavigate();
  const location = useLocation();
  const { details, parents, id, parentsData } = location.state || {};
  const [applyfilter, setApplyFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const dispatch = useDispatch();
  const { control, handleSubmit, reset, watch } = useForm();
  const watchFields = watch();

  useEffect(() => {
    if (parents) {
      dispatch(getActivityParentsList({
        id: id, page: page,
        ...watchFields,
        per_page: limitPerPage
      })).then((res) => {
        formatForDisplay(res?.data);
      })
    }
    else {
      if(details?.role_name === "Senior Supervisor"){
        dispatch(getActivityTeamMemberSupervisorList({
          id: details.id, page: page,
          ...watchFields,
          per_page: limitPerPage
        })).then((res) => {
          formatForDisplay(res?.data);
        })
      }
      else{
        dispatch(getActivityTeamMemberList({
          teamMemberId: details.id, page: page,
          ...watchFields,
          perPage: limitPerPage
        })).then((res) => {
          formatForDisplay(res?.data);
        })
      }
    }
  }, [page, limitPerPage])


  useEffect(() => {
    let newData
    if (parents) {
      newData = [...ActivityHeader].find((item) => item.name === "Parents")
    }
    else {
      newData = [...ActivityHeader].find((item) => item.name === details?.role_name)
    }
    setHeader(newData?.header)
  }, [details])

  const onPageChange = (page) => {
    setPage(page)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const formatForDisplay = data => {
    const formatedRows = []
    if (parents) {
      Array.isArray(data) &&
        data?.forEach((item) => {
          formatedRows.push({
            "id": item.id,
            "activity": item.activity,
            "event_type": item.event_type,
            "description": item.description,
            "description_event": item.description_event,
            "program_name": item.program_name,
            "member": item.member,
            "role": item.role,
            "unit_number": item.unit_number,
            "unit_name": item.unit_name,
            "createdAt": dayjs(item.createdAt).format("DD MMM YYYY h:mm a")
          })
        })
    }
    else {
      Array.isArray(data) &&
        data?.forEach((item) => {
          formatedRows.push({
            "id": item.id,
            "activity": item.activity,
            "event": item.event,
            "event_type": item.event_type,
            "particulars": item.particulars,
            "supervisorName": item.supervisorName,
            "districtName": item.districtName,
            "blockZoneName": item.blockZoneName,
            "panchyatWardName": item.panchyatWardName,
            "villageAreaName": item.villageAreaName,
            "programName": item.programName,
            "programUnitNumber": item.programUnitNumber,
            "programUnitName": item.programUnitName,
            "program_name": item.program_name,
            "unit_number": item.unit_number,
            "unit_name": item.unit_name,
            "createdAt": dayjs(item.createdAt).format("DD MMM YYYY h:mm a"),
            "updated_at": dayjs(item.updated_at).format("DD MMM YYYY h:mm a")
          })
        })
    }
    setList(formatedRows)
  }

  const Back = () => {
    navigate(-1);
  };

  const ExportData = () => {

  }

  return (
    <div>
      <div className="tw-flex tw-flex-col tw-w-full tw-mb-5 tw-gap-1">
        <Link onClick={Back}>
          <ArrowBackIcon className="tw-text-grey" />
          <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">{parents ? `Parents/${parentsData?.full_name}` : `Team member/${details?.full_name}`}</span>
        </Link>
        <Typography variant="h3" className="!tw-font-semibold !tw-text-secondaryText">Activity log</Typography>
      </div>
      <Paper className="tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-mt-6">
        <div className='tw-flex tw-justify-between tw-w-full tw-items-center'>
          <div className='tw-flex tw-justify-end tw-w-full tw-gap-3'>
            <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>Filters</Button>
            <ActivityFilter parents={parents} id={id} details={details} watchFields={watchFields} control={control} reset={reset} handleSubmit={handleSubmit} anchorEl={anchorEl} applyfilter={applyfilter} setPage={setPage} setApplyFilter={setApplyFilter} page={page} setAnchorEl={setAnchorEl} handleClose={handleClose} limitPerPage={limitPerPage} formatForDisplay={formatForDisplay} />
            {/* <LoadingButton disableElevation variant='outlined' endIcon={<ExitToAppIcon />} className='uppercase' onClick={ExportData}>
              Export Data
            </LoadingButton> */}
          </div>
        </div>
        {!loader ? (
          <>
            {list.length ? (
              <EnhancedTable paginate={parents ? paginateParentsInfo : details?.role_name === "Senior Supervisor" ? paginateSupervisorInfo : paginateInfo} onNavigateDetails={() => { }} scrollable
                actions={{ edit: false, preview: false }} columns={header}
                data={list} onPageChange={onPageChange} page={page} details={true} keyProp="uuid" setLimitPerPage={setLimitPerPage}
                limitPerPage={limitPerPage} setPage={setPage}
              />
            ) : (
              <div className="tw-text-secondaryText tw-w-full tw-font-normal tw-text-sm tw-text-center">
                <span>No Data found</span>
              </div>
            )}
          </>)
          :
          <div className='tw-text-center tw-py-5 tw-w-full'><CircularProgress /></div>
        }
      </Paper>
    </div>
  )
}
