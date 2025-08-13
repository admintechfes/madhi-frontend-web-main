import React, { useEffect, useState } from 'react'
import { Button, CircularProgress, Paper, Typography } from '@mui/material'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import FilterListIcon from '@mui/icons-material/FilterList';
import QuizFilter from '../../../components/Progress/quiz/quizfilter';
import filter_on from '../../../../public/assets/icons/filter_on.svg';
import { getQuizChildrenList, getQuizParentList, getQuizProgresStatus } from '../../../Progress/Village/quiz/duck/network';
import EnhancedTable from '../../../components/Progress/quiz/childrentable';

const childrenheader = [
  {
    id: "childName",
    numeric: false,
    disablePadding: true,
    label: "Children List",
    sort: true,
    width: 120,
  },
  {
    id: "quizStatus",
    numeric: false,
    disablePadding: true,
    label: "Status",
    sort: true,
    width: 120,
  },
  {
    id: "updatedOn",
    numeric: false,
    disablePadding: true,
    label: "Status Updated On",
    sort: true,
    width: 120,
  },
  {
    id: "quizFilledBy",
    numeric: false,
    disablePadding: true,
    label: "Filled By",
    sort: true,
    width: 120,
  },
  {
    id: "quizScore",
    numeric: false,
    disablePadding: true,
    label: "Score",
    sort: true,
    width: 120,
  },
  {
    id: "whatsAppSharedStatus",
    numeric: false,
    disablePadding: true,
    label: "WhatsApp shared status",
    sort: true,
    width: 120,
  },
  {
    id: "SMSSharedStatus",
    numeric: false,
    disablePadding: true,
    label: "SMS shared status",
    sort: true,
    width: 120,
  },
  {
    id: "quiz_link",
    numeric: false,
    disablePadding: true,
    label: "Quiz Link",
    sort: false,
    width: 120,
  },
]


export default function QuizChildren() {
  const loader = useSelector((state) => state.loader.openTableLoader);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const paginateInfo = useSelector((state) => state.quiz.childrenpaginateInfo);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const { progressName, name, villageAreaId, moderatedById, programUnitContentId, parentName, quizNumber } = location.state || {};
  const quizDetails = useSelector((state) => state.quiz.quizDetails);
  const quizstatusValue = useSelector((state) => state.quiz.quizstatusValue)
  const startDateValue = useSelector((state) => state.quiz.startDateValue);
  const endDateValue = useSelector((state) => state.quiz.endDateValue);
  const quizChildrenData = useSelector((state) => state.quiz.quizChildrenData)
  const [applyfilter, setApplyFilter] = useState(false)
  const params = useParams();

  useEffect(() => {
    dispatch(getQuizProgresStatus({ villageAreaId: villageAreaId, moderatedById: moderatedById, programUnitContentId: programUnitContentId }))
  }, [])

  useEffect(() => {
    dispatch(getQuizChildrenList({
      villageAreaId: villageAreaId, moderatedById: moderatedById, programUnitContentId: programUnitContentId,
      parentId: params.id,
      ...(quizstatusValue && { status: quizstatusValue }),
      ...(startDateValue && { startDate: startDateValue }),
      ...(endDateValue && { endDate: endDateValue }),
      page: page, per_page: limitPerPage,
    }))
  }, [limitPerPage, page])


  const onPageChange = (page) => {
    setPage(page)
  }

  const onNavigateDetails = () => {
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const Back = () => {
    navigate(-1);
  }


  return (
    <>
      <Link onClick={Back}>
        <ArrowBackIcon className='tw-text-grey' />
        <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>Progress / {progressName}/ {name} Village/Area/ Quiz</span>
      </Link>
      <Typography variant="h2" className='!tw-font-semibold !tw-text-secondaryText'>{parentName}</Typography>
      <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
        <div className='tw-flex tw-justify-end tw-w-full tw-items-center'>
          <div className='tw-relative'>
            <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>
              Filters
            </Button>
            <QuizFilter type="children" anchorEl={anchorEl} setAnchorEl={setAnchorEl} applyfilter={applyfilter} setApplyFilter={setApplyFilter} handleClose={handleClose} page={page} limitPerPage={limitPerPage} />
          </div>
        </div>
        {!loader ?
          <>
            {quizChildrenData?.data?.length ? (
              <EnhancedTable paginate={paginateInfo} scrollable onNavigateDetails={onNavigateDetails}
                actions={{ edit: false, preview: false }} columns={childrenheader}
                data={quizChildrenData?.data} onPageChange={onPageChange} page={page} details={false} keyProp="uuid"
                setLimitPerPage={setLimitPerPage} quizDetails={quizDetails}
                limitPerPage={limitPerPage} setPage={setPage} programUnitContentId={programUnitContentId}
                villageAreaId={villageAreaId} quizNumber={quizNumber} />
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

