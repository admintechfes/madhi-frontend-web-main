import { Button, CircularProgress, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import EnhancedTable from './table';
import { GetEngagementScoreChangeLog } from '../duck/network';

const header = [
  {
    id: "updated_by",
    numeric: false,
    disablePadding: true,
    label: "Updated By",
    sort: true,
    width: 140,
  },
  {
    id: "role",
    numeric: false,
    disablePadding: true,
    label: "Role",
    sort: true,
    width: 120,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "Status",
    sort: true,
    width: 120,
  },
  {
    id: "allowed_weight",
    numeric: false,
    disablePadding: true,
    label: "Total Weightage allotted",
    sort: true,
    width: 120,
  },
  {
    id: "updated_at",
    numeric: false,
    disablePadding: true,
    label: "Updated On",
    sort: true,
    width: 120,
  },
  {
    id: "action",
    numeric: false,
    disablePadding: true,
    label: "Actions",
    sort: true,
    width: 120,
  }
]


export default function ParentsAdded() {
  const navigate = useNavigate();
  const paginateInfo = useSelector((state) => state.score.paginateInfo)
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10)
  const [list, setList] = useState([])
  const loader = useSelector((state) => state.score.loading)
  const dispatch = useDispatch();
  const location = useLocation();
  const { programId, unit } = location?.state

  useEffect(() => {
    dispatch(GetEngagementScoreChangeLog({
      page: page,
      perPage: limitPerPage,
      program_unit_id: unit,
      program_id: programId
    })).then((res) => {
      formatForDisplay(res?.data)
    })
  }, [page, limitPerPage])

  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
      formatedRows.push({
        "id": item?.id,
        "updated_by": item?.updated_by,
        "role": item?.role,
        "status": item?.status,
        "allowed_weight": item?.allowed_weight,
        "updated_at": dayjs(item.updated_at).format("DD MMM, YYYY"),
        "log_data": item?.log_data
      })
    })
    setList(formatedRows)
  }

  const onPageChange = (page) => {
    setPage(page)
  }

  const Back = () => {
    navigate(-1)
  }

  const onNavigateDetails = () => { }


  return (
    <div>
      <div className="tw-flex tw-flex-col tw-w-full tw-mb-5 tw-gap-1">
        <a className='tw-cursor-pointer' onClick={Back}>
          <ArrowBackIcon className="tw-text-grey" />
          <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">Program/Past Engagement Score Rule</span>
        </a>
        <div className="tw-flex tw-justify-between tw-px-3">
          <Typography variant="h3" className='!tw-font-semibold'>Unit 1: Past Engagement Score Rule</Typography>
        </div>
      </div>
      <Paper className="tw-w-full tw-py-6 tw-flex tw-flex-col tw-items-start tw-mt-6">
        <div className='tw-flex tw-justify-between tw-w-full tw-items-center tw-mb-2'>
          <div className='tw-flex tw-w-full tw-gap-3 tw-px-4'>
            <span>Total {paginateInfo?.total}</span>
          </div>
        </div>
        {!loader ? (
          <>
            {list.length ? (
              <EnhancedTable paginate={paginateInfo} onNavigateDetails={onNavigateDetails} scrollable
                actions={{ edit: false, preview: false }} columns={header}
                data={list} onPageChange={onPageChange} page={page} details={false} keyProp="uuid" setLimitPerPage={setLimitPerPage}
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
