import { Button, CircularProgress, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EnhancedTable from '../../../components/parents/managebulktable';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { BulkUploadSuccessist } from '../../duck/network';
import dayjs from 'dayjs';

const header = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
    sort: true,
    width: 140,
  },
  {
    id: "whatsapp_number",
    numeric: false,
    disablePadding: true,
    label: "whatsApp Number",
    sort: true,
    width: 120,
  },
  {
    id: "mobile",
    numeric: false,
    disablePadding: true,
    label: "Mobile Number",
    sort: true,
    width: 120,
  },
  {
    id: "address",
    numeric: false,
    disablePadding: true,
    label: "Address",
    sort: true,
    width: 120,
  },
  {
    id: "assigned_village_area",
    numeric: false,
    disablePadding: true,
    label: "village Area",
    sort: true,
    width: 120,
  },
  {
    id: "panchayatWardName",
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
    id: "districtName",
    numeric: false,
    disablePadding: true,
    label: "District",
    sort: true,
    width: 120,
  },
  {
    id: "added",
    numeric: false,
    disablePadding: true,
    label: "Added On",
    sort: true,
    width: 120,
  }
]

export default function ParentsAdded() {
  const navigate = useNavigate();
  const paginateInfo = useSelector((state) => state.parents.parentsAddedPaginateInfo)
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10)
  const [list, setList] = useState([])
  const bulkloading = useSelector((state) => state.parents.bulkloading);
  const dispatch = useDispatch();
  const location = useLocation();
  const { bulk_upload_id } = location.state || {};

  useEffect(() => {
    dispatch(BulkUploadSuccessist({
      page: page,
      per_page: limitPerPage,
      bulk_upload_id: bulk_upload_id
    })).then((res) => {
      formatForDisplay(res?.data)
    })
  }, [page, limitPerPage])

  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
      formatedRows.push({
        "id": item?.id,
        "districtName": item?.parents_district?.name,
        "panchayatWardName": item?.parents_panchayat_ward?.name,
        "blockZone": item?.parents_block_zone?.name,
        "name": item?.full_name,
        "whatsapp_number": item?.whatsapp_number,
        "mobile": item?.mobile,
        "assigned_village_area": item?.parents_village_area?.name,
        "added": dayjs(item.created_at).format("DD MMM, YYYY"),
        "address": item?.address
      })
    })
    setList(formatedRows)
  }

  const onPageChange = (page) => {
    setPage(page)
  }

  const Back = () => {
    navigate("/parents/manage-bulk-upload")
  }

  const onNavigateDetails = () => { }


  return (
    <div>
      <div className="tw-flex tw-flex-col tw-w-full tw-mb-5 tw-gap-1">
        <a className='tw-cursor-pointer' onClick={Back}>
          <ArrowBackIcon className="tw-text-grey" />
          <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">Parents</span>
        </a>
        <div className="tw-flex tw-justify-between tw-px-3">
          <Typography variant="h3" className='!tw-font-semibold'>Parents Updated List</Typography>
        </div>
      </div>
      <Paper className="tw-w-full tw-py-6 tw-flex tw-flex-col tw-items-start tw-mt-6">
        <div className='tw-flex tw-justify-between tw-w-full tw-items-center tw-mb-2'>
          <div className='tw-flex tw-w-full tw-gap-3 tw-px-4'>
            <span>Total {paginateInfo?.total}</span>
          </div>
        </div>
        {!bulkloading ? (
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
