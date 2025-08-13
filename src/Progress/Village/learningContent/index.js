import React, { useEffect, useState } from 'react'
import { Button, Paper, Typography, Grid, CircularProgress } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import FilterListIcon from '@mui/icons-material/FilterList';
import LearningFilter from '../../../components/Progress/learningcontent/learningfilter';
import EnhancedTable from './learningtable';
import { getLearningContentist, getLearningDetails } from './duck/network';
import filter_on from '../../../../public/assets/icons/filter_on.svg';


const header = [
  {
    id: "contentType",
    numeric: false,
    disablePadding: true,
    label: "Content Shared",
    sort: true,
    width: 600,
  },
  {
    id: "whatsappSharedCount",
    numeric: false,
    disablePadding: true,
    label: "Shared on WhatsApp",
    sort: true,
    width: 300,
  },
  {
    id: "smsSharedCount",
    numeric: false,
    disablePadding: true,
    label: "Shared on SMS",
    sort: true,
    width: 300,
  },
]

export default function LearningContent() {
  const loader = useSelector((state) => state.loader.openTableLoader);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const paginateInfo = useSelector((state) => state.learning.contentPaginateInfo);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const learningDetails = useSelector((state) => state.learning.learningDetails)
  const location = useLocation();
  const { progressName, name, villageAreaId, managedById, programUnitContentId } = location.state || {};
  const learningContentValue = useSelector((state) => state.learning.learningContentValue)
  const learningContentList = useSelector((state) => state.learning.learningContentData)
  const [applyfilter, setApplyFilter] = useState(false)


  useEffect(() => {
    let timerId = setTimeout(() => {
      formatForDisplay(learningContentList?.data);
    }, 1000);
    return () => clearTimeout(timerId);
  }, [limitPerPage,page]);


  useEffect(() => {
    dispatch(getLearningDetails({ villageAreaId: villageAreaId, programUnitContentId: programUnitContentId, managedById: managedById }))
  }, [])

  useEffect(() => {
    dispatch(getLearningContentist({
      villageAreaId: villageAreaId, programUnitContentId: programUnitContentId, managedById: managedById,
      ...(learningContentValue && { contentType: learningContentValue }),
      page: page, per_page: limitPerPage
    }))
  }, [limitPerPage,page])


  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
      formatedRows.push({
        "programMediaContentId": item.programMediaContentId,
        "contentType": item.contentType,
        "contentShared": item.contentShared,
      })
    })
  }

  const onPageChange = (page) => {
    setPage(page)
  }

  const onNavigateDetails = (programMediaContentId) => {
    navigate(`/progress/village/learning-content-details`, { state: { name, progressName, villageAreaId, managedById, programMediaContentId } })
  }


  const getContent = (title, desc, area) => {
    return (
      <div className={`tw-flex tw-flex-col tw-gap-2 ${area ? "tw-w-full" : "tw-w-[170px]"}`}>
        <span className='tw-text-xs tw-text-grey tw-block tw-mb-[6px]'>{title}</span>
        <span className='tw-text-sm tw-text-primaryText'>{desc}</span>
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

  return (
    <>
      <Link onClick={Back}>
        <ArrowBackIcon className='tw-text-grey' />
        <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>Progress / {progressName}/ {name}/ Learning Content</span>
      </Link>
      <Typography variant="h2" className='!tw-font-semibold !tw-text-secondaryText'>{learningDetails?.learningContentNumber}</Typography>
      <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
        <Typography variant="h4" className='!tw-font-semibold !tw-text-secondaryText'>Learning Content Details</Typography>
        <div className='tw-flex tw-items-start tw-gap-16 tw-flex-wrap'>
          {getContent("Content name", learningDetails?.learningContentTitle)}
          {getContent("Managed By", learningDetails?.managedBy)}
          {getContent("Supervisor", learningDetails?.supervisor)}
          {getContent("Total Shared", learningDetails?.totalContents)}
        </div>
      </Paper>
      <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
        <div className='tw-flex tw-justify-between tw-w-full tw-items-center'>
          <Typography variant="h4" className='!tw-font-semibold !tw-text-secondaryText'>Content List</Typography>
          <div className='tw-relative'>
            <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>
              Filters
            </Button>
            <LearningFilter anchorEl={anchorEl} setAnchorEl={setAnchorEl} applyfilter={applyfilter} setApplyFilter={setApplyFilter} handleClose={handleClose} formatForDisplay={formatForDisplay} page={page} limitPerPage={limitPerPage} />
          </div>
        </div>
        {!loader ?
          <>
            {learningContentList?.data?.length ? (
              <EnhancedTable paginate={paginateInfo} scrollable onNavigateDetails={onNavigateDetails}
                actions={{ edit: true, preview: true }} columns={header}
                data={learningContentList.data} onPageChange={onPageChange} page={page} details={true} keyProp="uuid"
                setLimitPerPage={setLimitPerPage}
                limitPerPage={limitPerPage} setPage={setPage} />
            ) : (
              <div className='tw-w-full tw-text-secondaryText tw-font-normal tw-text-sm tw-text-center tw-rounded-lg'>
                <span>No Data found</span>
              </div>
            )}
          </> :
          <div className='tw-text-center tw-py-5 tw-w-full'><CircularProgress /></div>
        }
      </Paper>
    </>
  )
}

