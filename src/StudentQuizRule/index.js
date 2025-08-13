import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, CircularProgress, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import SearchBox from '../components/SearchBox';
import EnhancedTable from '../components/parents/Table';
import { getStudentQuizRuleList } from './duck/network';
import dayjs from 'dayjs';


const header = [
  {
    id: "tag_name",
    numeric: false,
    disablePadding: true,
    label: "Tag Number",
    sort: true,
    width: 120,
  },
  {
    id: "language",
    numeric: false,
    disablePadding: true,
    label: "Subject",
    sort: true,
    width: 120,
  },
  {
    id: "grade",
    numeric: false,
    disablePadding: true,
    label: "Grade",
    sort: true,
    width: 120,
  },
  {
    id: "learning_outcome",
    numeric: false,
    disablePadding: true,
    label: "Learning Outcome",
    sort: true,
    width: 220,
  },
  {
    id: "updated_at",
    numeric: false,
    disablePadding: true,
    label: "Last Updated On",
    sort: true,
    width: 120,
  }
]

export default function StudentQuizRule() {
  const loader = useSelector((state) => state.studentquizrule.loading)
  const [list, setList] = useState([])
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const paginateInfo = useSelector((state) => state.studentquizrule.paginateInfo)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { unit, programId } = location.state || {};
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    if (!searchText) {
      dispatch(getStudentQuizRuleList({
        program_unit_id: unit?.id,
        page: page,
        perPage: limitPerPage
      })).then(res => formatForDisplay(res.data))
    }
    else {
      let timerId = setTimeout(() => {
        dispatch(getStudentQuizRuleList({
          program_unit_id: unit?.id,
          search: searchText,
          page: page,
          perPage: limitPerPage
        })).then(res => formatForDisplay(res.data))
      }, 1000)
      return () => clearTimeout(timerId)
    }
  }, [page, limitPerPage, searchText])

  const onPageChange = (page) => {
    setPage(page)
  }

  const formatForDisplay = data => {
    const formatedRows = []
    Array.isArray(data) &&
      data?.forEach((item) => {
        formatedRows.push({
          "id": item.id,
          "tag_name": item.tag_name,
          "language": item.language,
          "grade": item.grade,
          "learning_outcome": item.learning_outcome,
          "updated_at": dayjs(item.updated_at).format("DD MMM, YYYY"),
          "program_id": item.program_id,
          "program_unit_id": item.program_unit_id,
          "tag_id": item.tag_id,
          "tag_name": item.tag_name,
          "score_range_1": item.score_range_1,
          "remark_1": item.remark_1,
          "speech_bubble_1": item.speech_bubble_1,
          "score_range_2": item.score_range_2,
          "remark_2": item.remark_2,
          "speech_bubble_2": item.speech_bubble_2,
          "score_range_3": item.score_range_3,
          "remark_3": item.remark_3,
          "speech_bubble_3": item.speech_bubble_3,
          "created_at": item.created_at,

        })
      })
    setList(formatedRows)
  }

  const Back = () => {
    navigate(`/program-details/${programId}`)
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }

  const AddTag = () => {
    navigate(`/programs-unit/student-quiz-rule/create`, { state: { unit: unit, programId: programId } })
  }

  const onNavigateDetails = (id, index, data) => {
    navigate(`/programs-unit/student-quiz-rule/update`, { state: { id: id, unit: unit, programId: programId } })
  }

  return (
    <div>
      <div className="tw-flex tw-flex-col tw-w-full tw-mb-5 tw-gap-1">
        <a className='tw-cursor-pointer' onClick={Back}>
          <ArrowBackIcon className="tw-text-grey" />
          <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">Progress</span>
        </a>
        <div className="tw-flex tw-justify-between tw-px-3">
          <Typography variant="h3" className='!tw-font-semibold'>Student Quiz LO tags</Typography>
          <div className='tw-flex tw-gap-6 tw-justify-between'>
            <SearchBox placeholder="Search by Tag Number" handleSearch={handleSearch} />
            <div className='tw-flex tw-gap-x-5'>
              <Button variant="contained" onClick={AddTag} className="uppercase">Add Tag</Button>
            </div>
          </div>
        </div>
      </div>
      <Paper className="tw-w-full tw-py-6 tw-flex tw-flex-col tw-items-start tw-mt-6">
        <div className='tw-flex tw-justify-between tw-w-full tw-items-center tw-mb-2'>
          <div className='tw-flex tw-w-full tw-gap-3 tw-px-4'>
            <span>Total {paginateInfo.total}</span>
          </div>
        </div>
        {!loader ? (
          <>
            {list.length ? (
              <EnhancedTable paginate={paginateInfo} onNavigateDetails={onNavigateDetails} scrollable
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
