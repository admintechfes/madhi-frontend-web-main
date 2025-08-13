import { Button, CircularProgress, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import FormDialog from '../../../components/Dialog';
import EnhancedTable from '../../../components/Masters/managebulktable';
import { DropExcelDocument } from '../../../components/contentlibrary/dropexceldocument';
import { BulkUploadVillageMaster, BulkUploadVillageMasterList } from '../duck/network';
import dayjs from 'dayjs';
import axiosInstance from '../../../config/Axios';

const header = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Uploaded By",
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
    id: "total_records",
    numeric: false,
    disablePadding: true,
    label: "Location Uploaded",
    sort: true,
    width: 120,
  },
  {
    id: "successful",
    numeric: false,
    disablePadding: true,
    label: "Location added",
    sort: true,
    width: 120,
  },
  {
    id: "failed",
    numeric: false,
    disablePadding: true,
    label: "Error",
    sort: true,
    width: 120,
  },
  {
    id: "updated_at",
    numeric: false,
    disablePadding: true,
    label: "Uploaded On",
    sort: true,
    width: 120,
  },
  {
    id: "action",
    numeric: false,
    disablePadding: true,
    label: "Actions",
    sort: true,
    width: 160,
  }
]

export default function ManageBulkUploadVillageArea() {
  const loader = useSelector((state) => state.village.statusLoading);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const paginateInfo = useSelector((state) => state.village.villageMasterListDataPaginateInfo)
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10)
  const [list, setList] = useState([])
  const bulkloading = useSelector((state) => state.village.bulkloading);
  const [error, setError] = useState("");
  const [openAttachmentDialog, setOpenAttachmentDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [key, setKey] = useState(0); // Key to reset input value
  const [fileError, setFileError] = useState('');
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dispatch(BulkUploadVillageMasterList({
      page: page,
      per_page: limitPerPage
    })).then((res) => {
      formatForDisplay(res?.data)
    })
  }, [page, limitPerPage])

  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
      formatedRows.push({
        "id": item?.id,
        "name": item.uploaded_by?.name,
        "role": item.uploaded_by?.roles[0]?.name,
        "total_records": String(item?.total_records),
        "successful": String(item?.successful),
        "failed": String(item?.failed),
        "updated_at": dayjs(item?.updated_at).format("DD MMM, YYYY h:mm a"),
        "file_path": item?.file_path,
      })
    })
    setList(formatedRows)
  }

  const onPageChange = (page) => {
    setPage(page)
  }

  const Back = () => {
    navigate("/masters/village_area")
  }

  const handleAttachment = () => {
    setOpenAttachmentDialog(true);
  };

  const handleDialogClose = () => {
    setOpenAttachmentDialog(false);
    setError("");
  };

  const handleUpload = () => {
    let formData = new FormData();
    formData.append("file", selectedFile)
    dispatch(BulkUploadVillageMaster(formData)).then((res) => {
      setOpenAttachmentDialog(false)
      setKey(Math.random())
      setSelectedFile(null)
      if (res?.status === 200) {
        dispatch(BulkUploadVillageMasterList({
          page: page, per_page: limitPerPage,
        })).then(resp => {
          formatForDisplay(resp?.data)
        })
      }
    })
  }

  const onNavigateDetails = () => { }

  const OnDownloadSampleTemplate = async () => {
    const url = `/v1/masters/bulk_upload_location/download-sample`;
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(url);
      setIsLoading(false);
      const link = document.createElement('a');
      link.href = response?.data?.data; // Set the file path as the download URL
      link.download = response?.data?.data; // Use the file name from the URL or set a custom name
      document.body.appendChild(link); // Append the link to the body
      link.click(); // Trigger the download
      document.body.removeChild(link); // Clean up by removing the link
    } catch (err) {
      toast.error(err?.response?.statusText);
      setIsLoading(false);
      return err.response;
    }

  }


  return (
    <div>
      <div className="tw-flex tw-flex-col tw-w-full tw-mb-5 tw-gap-1">
        <a className='tw-cursor-pointer' onClick={Back}>
          <ArrowBackIcon className="tw-text-grey" />
          <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">Village/Area</span>
        </a>
        <div className="tw-flex tw-justify-between tw-px-3">
          <Typography variant="h3" className='!tw-font-semibold'>Manage Location Bulk Upload</Typography>
          <div className='tw-flex tw-gap-6 tw-justify-between'>
            <div className='tw-flex tw-gap-x-5'>
              <LoadingButton disableElevation loading={isLoading} variant="outlined" onClick={OnDownloadSampleTemplate} className="uppercase">Download Sample Template</LoadingButton>
              <Button variant="contained" onClick={handleAttachment} className="uppercase">Bulk Upload</Button>
            </div>
          </div>
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
      <FormDialog open={openAttachmentDialog} close={handleDialogClose} title="Add Attachments">
        <form onSubmit={handleSubmit(handleUpload)}>
          <DropExcelDocument fileError={fileError} setFileError={setFileError} setError={setError} error={error} key={key} setKey={setKey} setSelectedFile={setSelectedFile} selectedFile={selectedFile} register={register} />
          <div className="tw-pt-8 tw-pb-1 tw-flex tw-justify-end tw-gap-5">
            <div className="tw-grow">
              <Button onClick={handleDialogClose} fullWidth variant="outlined">Cancel</Button>
            </div>
            <div className="tw-grow">
              <LoadingButton loading={bulkloading} type='submit' className={`${selectedFile ? '' : '!tw-bg-[#0000001f]'}`} fullWidth variant="contained" disableElevation disabled={selectedFile ? false : true}>Add</LoadingButton>
            </div>
          </div>
        </form>
      </FormDialog>
    </div>
  )
}
