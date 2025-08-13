import React, { useEffect, useState } from 'react'
import { CircularProgress, Paper, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { BulkUploadVillageErrorList } from '../duck/network';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import EnhancedTable from '../../../components/Masters/managebulktable';
import axiosInstance from '../../../config/Axios';

const header = [
  {
    id: "rowNumber",
    numeric: false,
    disablePadding: true,
    label: "Row Number",
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
    id: "blockZoneName",
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
    label: "Districts",
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



export default function ErrorsAdded() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const paginateInfo = useSelector((state) => state.village.villageErrorPaginateInfo);
  const [list, setList] = useState([])
  const loader = useSelector((state) => state.village.bulkloading);
  const dispatch = useDispatch();
  const location = useLocation();
  const { bulk_upload_master_location_id } = location.state || {};
  const villageErrorData = useSelector((state) => state.village.villageErrorData)
  const [IsLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dispatch(BulkUploadVillageErrorList({
      page, page,
      per_page: limitPerPage,
      bulk_upload_master_location_id: bulk_upload_master_location_id,
    })).then((res) => {
      formatForDisplay(res?.data)
    })
  }, [page, limitPerPage])


  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
        formatedRows.push({
          "id": item?.id,
          "rowNumber": item?.row_number,
          "districtName": item?.error_message?.district,
          "panchayatWardName": item?.error_message?.block_zone,
          "blockZoneName": item?.error_message?.block_zone,
          "village": item?.error_message?.village_area,
          "state": item?.error_message?.state,
        })
    })
    setList(formatedRows)
  }

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  const onNavigateDetails = () => { }

  const downloadErrorList = async () => {
    const url = '/v1/masters/bulk_upload_location/failed-list';
    try {
      setIsLoading(true)
      const response = await axiosInstance.post(url, {
        bulk_upload_master_location_id: bulk_upload_master_location_id,
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
          <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>Village/Area</span>
        </a>
        <div className='tw-flex tw-gap-x-4 tw-items-center'>
          <LoadingButton loading={IsLoading} disableElevation disabled={villageErrorData?.data?.length > 0 ? false : true} variant="contained" onClick={downloadErrorList}>Download Error List</LoadingButton>
        </div>
      </div>
      <Typography variant="h2" className='!tw-font-semibold !tw-text-secondaryText'>Bulk Upload Errors</Typography>
      <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
        <span className='tw-text-sm'>Total {paginateInfo?.total}</span>

        {!loader ? (
          <>
            {list.length ? (
              <EnhancedTable paginate={paginateInfo}
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

