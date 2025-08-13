import React, { useEffect, useState } from 'react'
import { Button, Paper, Typography, Grid, CircularProgress } from '@mui/material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import FilterListIcon from '@mui/icons-material/FilterList';
import LearningFilter from '../../../../components/Progress/learningcontent/learningfilter';
import EnhancedTable from '../../../../components/Progress/learningcontent/contentlist/contentTable';
import { getLearningContentParents } from '../duck/network';
import dayjs from 'dayjs';
import ContentParentsFilter from '../../../../components/Progress/learningcontent/contentlist/contentparentsfilter';
import filter_on from '../../../../../public/assets/icons/filter_on.svg';

const header = [
  {
    id: "parentName",
    numeric: false,
    disablePadding: true,
    label: "Parents Name",
    sort: true,
    width: 200,
  },
  {
    id: "whatsappStatus",
    numeric: false,
    disablePadding: true,
    label: "WhatsApp Status",
    sort: true,
    width: 200,
  },
  {
    id: "whatsappStatusUpdatedAt",
    numeric: false,
    disablePadding: true,
    label: "Status Updated On",
    sort: true,
    width: 200,
  },
  {
    id: "smsStatus",
    numeric: false,
    disablePadding: true,
    label: "SMS Status",
    sort: true,
    width: 250,
  }, 
  {
    id: "smsStatusUpdatedAt",
    numeric: false,
    disablePadding: true,
    label: "Status Updated On",
    sort: true,
    width: 200,
  },
]


export default function ContentList() {
  const loader = useSelector((state) => state.loader.openTableLoader);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const paginateInfo = useSelector((state) => state.learning.paginateInfo);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const { progressName, name, villageAreaId, managedById, programMediaContentId } = location.state || {};
  const learningContentParentsStatusValue = useSelector((state) => state.learning.learningContentParentsStatusValue)
  const learningContentParentsPlatformValue = useSelector((state) => state.learning.learningContentParentsPlatformValue)
  const startDateValue = useSelector((state) => state.learning.startDateValue);
  const endDateValue = useSelector((state) => state.learning.endDateValue);
  const learningParentsData = useSelector((state) => state.learning.learningParentsData)
  const [applyfilter, setApplyFilter] = useState(false)


  useEffect(() => {
    let timerId = setTimeout(() => {
      formatForDisplay(learningParentsData?.data);
    }, 1000);
    return () => clearTimeout(timerId);
  }, [limitPerPage]);


  useEffect(() => {
      dispatch(getLearningContentParents({
        villageAreaId: villageAreaId, programMediaContentId: programMediaContentId, managedById: managedById,
        page: page, per_page: limitPerPage,
        ...(learningContentParentsStatusValue && { whatsappStatus: learningContentParentsStatusValue }),
        ...(learningContentParentsPlatformValue && { smsStatus: learningContentParentsPlatformValue }),
        ...(startDateValue && { startDate: startDateValue }),
        ...(endDateValue && { endDate: endDateValue }),
      }))
    }, [limitPerPage, page])


    const formatForDisplay = data => {
      const formatedRows = []
      Array.isArray(data) &&
        data?.forEach((item, index) => {
          formatedRows.push({
            "parentId": item.parentId,
            "parentName": item.parentName,
            "status": item.status,
            "smsPlatform": item.smsPlatform,
            "whatsappPlatform": item.whatsappPlatform,
            "whatsappErrorTitle":item?.whatsappErrorTitle,
            "smsErrorTitle":item?.smsErrorTitle,
            "updatedOn": item.updatedOn ? dayjs(item.updatedOn).format("D MMM, YYYY") : item.updatedOn,
          })
        })
    }

    const onPageChange = (page) => {
      setPage(page)
    }

    const onNavigateDetails = () => {
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
          <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>Progress / {progressName}/ {name}/ Learning Content Details</span>
        </Link>
        <Typography variant="h2" className='!tw-font-semibold !tw-text-secondaryText'>PDF</Typography>
        <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
          <div className='tw-flex tw-justify-between tw-w-full tw-items-center'>
            <Typography variant="h4" className='!tw-font-semibold !tw-text-secondaryText'>Parents List</Typography>
            <div className='tw-relative'>
              <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>
                Filters
              </Button>
              <ContentParentsFilter anchorEl={anchorEl} setApplyFilter={setApplyFilter} applyfilter={applyfilter} formatForDisplay={formatForDisplay} setAnchorEl={setAnchorEl} handleClose={handleClose} page={page} limitPerPage={limitPerPage} />
            </div>
          </div>
          {!loader ?
            <>
              {learningParentsData?.data?.length ? (
                <EnhancedTable paginate={paginateInfo} scrollable onNavigateDetails={onNavigateDetails}
                  actions={{ edit: true, preview: true }} columns={header}
                  data={learningParentsData?.data} onPageChange={onPageChange} page={page} details={true} keyProp="uuid"
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

