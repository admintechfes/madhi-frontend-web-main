import { Button, CircularProgress, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EnhancedTable from '../../../../components/Masters/managebulktable';
import { BulkUploadVillageSuccessList } from '../../duck/network';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const header = [
  {
    id: "villageArea",
    numeric: false,
    disablePadding: true,
    label: "village Area",
    sort: true,
    width: 120,
  },
  {
    id: "panchayat",
    numeric: false,
    disablePadding: true,
    label: "Panchayat/Ward",
    sort: true,
    width: 120,
  },
  {
    id: "blockZone",
    numeric: false,
    disablePadding: true,
    label: "Block/Zone",
    sort: true,
    width: 120,
  },

  {
    id: "district",
    numeric: false,
    disablePadding: true,
    label: "District",
    sort: true,
    width: 120,
  },
  {
    id: "state",
    numeric: false,
    disablePadding: true,
    label: "State",
    sort: true,
    width: 120,
  }
]

export default function LocationAdded() {
  const loader = useSelector((state) => state.village.statusLoading);
  const navigate = useNavigate();
  const paginateInfo = useSelector((state) => state.village.villageSuccessAddedPaginateInfo)
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10)
  const [list, setList] = useState([])
  const dispatch = useDispatch();
  const location = useLocation();
  const { bulk_upload_master_location_id } = location.state || {};

  useEffect(() => {
    dispatch(BulkUploadVillageSuccessList({
      page: page,
      per_page: limitPerPage,
      bulk_upload_master_location_id: bulk_upload_master_location_id
    })).then((res) => {
      formatForDisplay(res?.data)
    })
  }, [page, limitPerPage])

  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
      formatedRows.push({
        "id": item?.id,
        "district": item?.district?.name,
        "panchayat": item?.panchayat_ward?.name,
        "blockZone": item?.block_zone?.name,
        "villageArea": item?.village_area?.name,
        "state": item?.state?.name
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
          <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">Village/Area</span>
        </a>
        <div className="tw-flex tw-justify-between tw-px-3">
          <Typography variant="h3" className='!tw-font-semibold'>Master Location Added</Typography>
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
