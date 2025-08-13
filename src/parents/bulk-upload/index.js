import React, { useEffect, useState } from 'react'
import { CircularProgress, Grid, Paper, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Tabs from '../../components/Tabs/Tabs'
import EnhancedTable from '../../components/parents/Table';
import { useDispatch } from 'react-redux';
import { BulkUploadErrorList } from '../duck/network';
import dayjs from 'dayjs';
import axiosInstance from '../../config/Axios';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

const parentheader = [
  {
    id: "rowNumber",
    numeric: false,
    disablePadding: true,
    label: "Row Number",
    sort: true,
    width: 120,
  },
  {
    id: "firstName",
    numeric: false,
    disablePadding: true,
    label: "First Name",
    sort: true,
    width: 120,
  },
  {
    id: "lastName",
    numeric: false,
    disablePadding: true,
    label: "Last Name",
    sort: true,
    width: 120,
  },
  {
    id: "mobile_number",
    numeric: false,
    disablePadding: true,
    label: "Mobile Number",
    sort: true,
    width: 120,
  },
  {
    id: "whatsapp_number",
    numeric: false,
    disablePadding: true,
    label: "WhatsApp Number",
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
    id: "cew_name",
    numeric: false,
    disablePadding: true,
    label: "Assigned CEW",
    sort: true,
    width: 120,
  },
  {
    id: "supervisor_name",
    numeric: false,
    disablePadding: true,
    label: "Assigned  Supervisor",
    sort: true,
    width: 120,
  },
  {
    id: "districtName",
    numeric: false,
    disablePadding: true,
    label: "District Name",
    sort: true,
    width: 120,
  },
  {
    id: "blockZoneName",
    numeric: false,
    disablePadding: true,
    label: "Block/Zone Name",
    sort: true,
    width: 120,
  },
  {
    id: "panchayatWardName",
    numeric: false,
    disablePadding: true,
    label: "Panchayat/Ward Name",
    sort: true,
    width: 120,
  },
  {
    id: "village",
    numeric: false,
    disablePadding: true,
    label: "Village/Area",
    sort: true,
    width: 120,
  }
]

const childheader = [
  {
    id: "rowNumber",
    numeric: false,
    disablePadding: true,
    label: "Row Number",
    sort: true,
    width: 120,
  },
  {
    id: "childName",
    numeric: false,
    disablePadding: true,
    label: "Child name",
    sort: true,
    width: 120,
  },
  {
    id: "whatsapp_number",
    numeric: false,
    disablePadding: true,
    label: "Parent whatsApp Number",
    sort: true,
    width: 120,
  },
  {
    id: "dob",
    numeric: false,
    disablePadding: true,
    label: "Date of Birth",
    sort: true,
    width: 120,
  },
  {
    id: "gender",
    numeric: false,
    disablePadding: true,
    label: "Gender",
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
    id: "school",
    numeric: false,
    disablePadding: true,
    label: "School",
    sort: true,
    width: 120,
  },
  {
    id: "relationship",
    numeric: false,
    disablePadding: true,
    label: "Relationship",
    sort: true,
    width: 120,
  }
]

export default function BulkUpload() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [tab, setTab] = useState(0)
  const parentsErrorPaginateInfo = useSelector((state) => state.parents.parentsErrorPaginateInfo);
  const [header, setHeader] = useState(parentheader)
  const [list, setList] = useState([])
  const loader = useSelector((state) => state.parents.bulkloading);
  const dispatch = useDispatch();
  const location = useLocation();
  const { bulk_upload_id } = location.state || {};
  const parentsErrorData = useSelector((state) => state.parents.parentsErrorData)
  const [IsLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dispatch(BulkUploadErrorList({
      page, page,
      per_page: limitPerPage,
      bulk_upload_id: bulk_upload_id,
      type: tab == 0 ? "parent" : "child",
    })).then((res) => {
      formatForDisplay(res?.data)
    })
  }, [page, limitPerPage, tab])


  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
      if (tab == 0) {
        formatedRows.push({
          "id": item?.id,
          "rowNumber": item?.row_number,
          "districtName": item?.error_message?.district_title,
          "panchayatWardName": item?.error_message?.panchayat_ward_title,
          "blockZoneName": item?.error_message?.block_zone_title,
          "firstName": item?.error_message?.first_name, 
          "lastName": item?.error_message?.last_name,
          "whatsapp_number": item?.error_message?.whatsapp_number,
          "mobile": item?.error_message?.mobile,
          "village": item?.error_message?.village_area_title,
          "supervisor_name": item?.error_message?.supervisor_name,
          "cew_name": item?.error_message?.cew_name,
          "added": dayjs(item.created_at).format("DD MMM, YYYY"),
          "address": item?.error_message?.address
        })
      }
      else {
        formatedRows.push({
          "id": item?.id,
          "rowNumber": item?.row_number,
          "childName": item?.error_message?.child_name,
          "dob": item?.error_message?.dob,
          "grade": item?.error_message?.grade,
          "gender": item?.error_message?.gender,
          "school": item?.error_message?.school,
          "whatsapp_number": item?.error_message?.parent_whatsapp_number,
          "relationship": item?.error_message?.relationship
        })
      }

    })
    setList(formatedRows)
  }

  useEffect(() => {
    if (!tab) {
      setHeader(parentheader)
    }
    else {
      setHeader(childheader)
    }

  }, [tab])


  const handleTabChange = (tabval) => {
    setTab(tabval)
  }

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  const onNavigateDetails = () => { }

  const downloadErrorList = async () => {
    const url = '/v1/parents/bulk_upload/failed-list';
    try {
      setIsLoading(true)
      const response = await axiosInstance.post(url, {
        bulk_upload_id: bulk_upload_id,
        type: tab == 0 ? "parent" : "child",
        download: true
      }, { responseType: 'blob' });
      setIsLoading(false)
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `errors-${dayjs(new Date()).format("DD-MM-YYYY")}.xlsx`; // Adjust the file name and extension as needed
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      return response;
    }
    catch (err) {
      toast.error(err?.response?.statusText);
      setIsLoading(false)
      return err.response;
    }
  }


  return (
    <>
      <div className='tw-flex tw-items-center tw-w-full tw-justify-between'>
        <a className='tw-cursor-pointer' onClick={() => navigate(-1)}>
          <ArrowBackIcon className='tw-text-grey' />
          <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>Parents</span>
        </a>
        <div className='tw-flex tw-gap-x-4 tw-items-center'>
          <LoadingButton loading={IsLoading} disableElevation disabled={parentsErrorData?.data?.length > 0 ? false : true} variant="contained" onClick={downloadErrorList}>Download Error List</LoadingButton>
        </div>
      </div>
      <Typography variant="h2" className='!tw-font-semibold !tw-text-secondaryText'>Bulk upload errors</Typography>
      <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
        <Grid justifyContent={'space-between'} sx={{ marginLeft: '-20px', marginRight: '0 !important' }}>
          <Tabs tabValue={tab} tabs={['Parents', 'Children']} tabChange={handleTabChange} />
        </Grid>
        <span className='tw-text-sm'>Total {parentsErrorPaginateInfo.total}</span>

        {!loader ? (
          <>
            {list.length ? (
              <EnhancedTable paginate={parentsErrorPaginateInfo}
                onNavigateDetails={onNavigateDetails} scrollable
                actions={{ edit: false, preview: false }} columns={header}
                data={list} onPageChange={onPageChange} page={page} details={false}
                keyProp="uuid" setLimitPerPage={setLimitPerPage}
                limitPerPage={limitPerPage} />
            ) : (
              <div className='tw-text-SecondaryTextColor tw-w-full tw-font-normal tw-text-sm tw-text-center tw-rounded-lg'>
                <span>No Data Found</span>
              </div>
            )}
          </>)
          : (
            <div className='tw-text-center tw-py-5'><CircularProgress /></div>
          )}
      </Paper>
    </>
  )
}

