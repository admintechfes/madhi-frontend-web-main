import React, { useEffect, useState } from 'react'
import { Button, Paper, Typography, CircularProgress } from '@mui/material'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EnhancedTable from '../../../components/Progress/meetingTable';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisitsFilter from '../../../components/Progress/visits/visitfilter';
import { getVisitParentAttendees, getVisitParentList, getVisitsDetails } from './duck/network';
import dayjs from 'dayjs';
import filter_on from '../../../../public/assets/icons/filter_on.svg';


const header = [
  {
    id: "parentName",
    numeric: false,
    disablePadding: true,
    label: "Parents List",
    sort: true,
    width: 500,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "Attendance",
    sort: true,
    width: 200,
  },
  {
    id: "updatedOn",
    numeric: false,
    disablePadding: true,
    label: "Attendance Marked On",
    sort: false,
    width: 200,
  },
]


export default function Visits() {
  const [page, setPage] = useState(1);
  const paginateInfo = useSelector((state) => state.visits.visitsparentspaginateInfo);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const loader = useSelector((state) => state.loader.openTableLoader);
  const visitDetails = useSelector((state) => state.visits.visitDetails)
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { progressName, name, villageAreaId, ProgramUnitId, programId, id } = location.state || {};
  const attendanceValue = useSelector((state) => state.visits.attendanceValue)
  const visitsParentsData = useSelector((state) => state.visits.visitsParentsData)
  const [applyfilter, setApplyFilter] = useState(false)


  useEffect(() => {
    let timerId = setTimeout(() => {
      formatForDisplay(visitsParentsData?.data);
    }, 1000);
    return () => clearTimeout(timerId);
  }, [limitPerPage]);

  useEffect(() => {
    dispatch(getVisitParentAttendees({ villageAreaId: villageAreaId, programUnitId: ProgramUnitId, programId: programId }))
    dispatch(getVisitsDetails({ visitId: params.id }))
  }, [])

  useEffect(() => {
    dispatch(getVisitParentList({ visitId: params.id, page: page, per_page: limitPerPage, ...(attendanceValue && { status: attendanceValue }) }))
  }, [limitPerPage, page])


  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
      formatedRows.push({
        "id": item.id,
        "parentName": item.parentName,
        "status": item.status,
        "updatedOn": item.updatedOn ? dayjs(item.updatedOn).format("D MMM, YYYY") : item.updatedOn
      })
    })
  }

  const onPageChange = (page) => {
    setPage(page)
  }

  const onNavigateDetails = () => {
  }

  let BackgroundTheme = visitDetails?.status?.toLowerCase() === 'completed' ? '#57C79633' : visitDetails?.status?.toLowerCase() === 'scheduled' ? '#FFC40C33' : '#EB57571A';
  let ColorTheme = visitDetails?.status?.toLowerCase() === 'completed' ? '#57C796' : visitDetails?.status?.toLowerCase() === 'scheduled' ? '#F39C35' : '#EB5757';


  const getContent = (title, desc, area, theme) => {
    return (
      <div className={`tw-flex tw-flex-col tw-gap-2 ${area ? "tw-w-full" : "tw-w-[40%]"}`}>
        <span className='tw-text-xs tw-text-grey tw-block tw-mb-[6px]'>{title}</span>
        <span style={{ backgroundColor: theme === "theme" ? BackgroundTheme : "", color: theme === "theme" ? ColorTheme : "" }} className={`tw-text-sm ${theme === "theme" ? `tw-p-2 tw-rounded-md tw-w-fit` : "tw-text-primaryText"}`}>{desc ? desc : "-"}</span>
      </div>
    )
  }

  const Back = () => {
    navigate(-1);
  }


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const NavigatePreview = (visitId) => {
    navigate(`/progress/village/visits/visits-preview`, { state: { visitId, ProgramUnitId, id, programId } })
  }

  return (
    <>
      <Link onClick={Back}>
        <ArrowBackIcon className='tw-text-grey' />
        <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>Progress / {progressName}/ {name} Village/Area/ Visits</span>
      </Link>
      <Typography variant="h2" className='!tw-font-semibold !tw-text-secondaryText'>Visits</Typography>
      {
        <>
          <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
            <Typography variant="h4" className='!tw-font-semibold !tw-text-secondaryText'>Visits Details</Typography>
            <div className='tw-flex tw-items-start tw-w-full tw-gap-6'>
              {getContent("Village", visitDetails?.villageName)}
              {getContent("Name Of the Visit", visitDetails?.agenda)}
              {getContent("Mode Of Visit", visitDetails?.mode)}
              {getContent("Date", visitDetails?.startedAt)}
            </div>
            <div className='tw-flex tw-items-start tw-w-full tw-gap-6'>
              {getContent("Start And End Time", `${visitDetails?.startedAt} to ${visitDetails?.endedAt}`)}
              {getContent("Meeting Location", visitDetails?.location)}
              {getContent("Meeting For", visitDetails?.type)}
              {getContent("Visit Type", visitDetails?.inviteeVisitType)}
            </div>
            <div className='tw-flex tw-items-start tw-w-full tw-gap-16'>
              {getContent("Created By", visitDetails?.conductedBy)}
              {getContent("Invitee Accepted", visitDetails?.invitees)}
              {getContent("Reason", visitDetails?.reason)}
            </div>
            <div className='tw-flex tw-items-start tw-w-full tw-gap-16'>
              {getContent("Status Updated On", visitDetails?.updatedOn)}
              {getContent("Status", visitDetails?.status, null, "theme")}
              {getContent("Cancelled Reason", visitDetails?.remark ? visitDetails?.remark : "-", true)}
            </div>
          </Paper>

          <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
            <Typography variant="h4" className='!tw-font-semibold !tw-text-secondaryText'>Visits Form</Typography>
            <div className='tw-flex tw-items-start tw-justify-between tw-w-full'>
              <div className='tw-flex tw-gap-36 tw-w-1/2'>
                <span className='tw-font-semibold tw-text-base tw-text-secondaryText'>Form</span>
                {getContent("Meeting for", visitDetails?.type)}
              </div>
              <Button variant='outlined' disabled={visitDetails?.formStatus === "Submitted" ? false : true} onClick={() => NavigatePreview(visitDetails?.id)}>View Visits Form</Button>
            </div>
          </Paper>

          <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
            <div className='tw-flex tw-justify-between tw-w-full tw-items-center'>
              <Typography variant="h4" className='!tw-font-semibold !tw-text-secondaryText'>Parent List and Attendance</Typography>
              <div className='tw-relative'>
                <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>
                  Filters
                </Button>
                <VisitsFilter anchorEl={anchorEl} applyfilter={applyfilter} setApplyFilter={setApplyFilter} setAnchorEl={setAnchorEl} handleClose={handleClose} formatForDisplay={formatForDisplay} paramsId={params.id} page={page} limitPerPage={limitPerPage} />
              </div>
            </div>
            {!loader ? (
              <>
                {visitsParentsData?.data?.length ? (
                  <EnhancedTable paginate={paginateInfo} scrollable onNavigateDetails={onNavigateDetails}
                    actions={{ edit: true, preview: true }} columns={header}
                    data={visitsParentsData?.data} onPageChange={onPageChange} page={page} details={true} keyProp="uuid"
                    setLimitPerPage={setLimitPerPage}
                    limitPerPage={limitPerPage} setPage={setPage} />
                ) : (
                  <div className='tw-text-SecondaryTextColor tw-w-full tw-font-normal tw-text-sm tw-text-center'>
                    <span>No Data found</span>
                  </div>
                )}
              </>
            ) :
              (<div className='tw-text-center tw-py-5 tw-w-full'><CircularProgress /></div>)
            }
          </Paper>
        </>
      }
    </>
  )
}

