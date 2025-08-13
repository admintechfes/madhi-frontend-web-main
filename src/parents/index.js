import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import EnhancedTable from '../components/parents/Table';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material'
import SearchBox from '../components/SearchBox';
import { useDispatch, useSelector } from 'react-redux';
import ParentsFilter from '../components/parents/parentsfilter';
import { getParentsList } from './duck/network';
import FilterListIcon from '@mui/icons-material/FilterList';
import dayjs from 'dayjs';
import { FormDialog2 } from '../components/Dialog';
import { LoadingButton } from '@mui/lab';
import axiosInstance from '../config/Axios';
import filter_on from '../../public/assets/icons/filter_on.svg';
import { toast } from 'react-toastify';
import { fillPageNumParents, fillPerPageNumParents, setSelectedQuestion } from './duck/parentsSlice';
import { useLocation } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ManualWhatsAppParentTable from '../ManualWhatsApp/ManualWhatsAppParentTable';
import { postManualWhatsAppCreate } from '../ManualWhatsApp/duck/network';
import { CreateOutboundIVRSCampaign } from '../OutBoundCampaign/duck/network';

const header = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
    sort: true,
    width: 180,
  },
  {
    id: "whatsapp_number",
    numeric: false,
    disablePadding: true,
    label: "WhatsApp Number",
    sort: true,
    width: 180,
  },
  {
    id: "districtName",
    numeric: false,
    disablePadding: true,
    label: "District Name",
    sort: true,
    width: 180,
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
  },
  {
    id: "assignedsupervisior",
    numeric: false,
    disablePadding: true,
    label: "Assigned  Supervisor",
    sort: true,
    width: 180,
  },
  {
    id: "assignedcew",
    numeric: false,
    disablePadding: true,
    label: "Assigned CEW",
    sort: true,
    width: 120,
  },
  {
    id: "added",
    numeric: false,
    disablePadding: true,
    label: "Added By",
    sort: true,
    width: 120,
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
    id: "createdon",
    numeric: false,
    disablePadding: true,
    label: "Account Created On",
    sort: true,
    width: 120,
  }
]

export default function Parents() {
  const perPageNum = useSelector((state) => state.parents.perPageNum)
  const page = useSelector((state) => state.parents.pageNum)
  const loader = useSelector((state) => state.parents.parentsListLoading);
  const paginateInfo = useSelector(state => state.parents.paginateInfo)
  const [list, setList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [limitPerPage, setLimitPerPage] = useState(perPageNum);
  const Permissions = JSON.parse(localStorage.getItem('permissions'))
  const supervisorValue = useSelector((state) => state.parents.supervisorValue);
  const cewValue = useSelector((state) => state.parents.cewValue);
  const startDateValue = useSelector((state) => state.parents.startDateValue);
  const endDateValue = useSelector((state) => state.parents.endDateValue);
  const selected = useSelector((state) => state.parents.selectedQuestion)
  const [applyfilter, setApplyFilter] = useState(false);
  const [IsLoading, setIsLoading] = useState(false)
  const districtIds = useSelector((state) => state.parents.district_id);
  const blockZoneIds = useSelector((state) => state.parents.block_zone_id);
  const panchayatWardIds = useSelector((state) => state.parents.panchayat_ward_id);
  const villageAreaIds = useSelector((state) => state.parents.village_area_id);
  const [submittedSelectedParents, setSubmittedSelectedParents] = useState(selected)
  const addedParents = useSelector((state) => state.manualWhatsApp.addedParents)
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [isSelectedAll, setIsSelectedAll] = useState(false)
  const formDataCampaign = useSelector((state) => state.manualWhatsApp.formDataCampaign);
  const [isSubmit, setIsSubmit] = useState(false)
  const [loadingRelease, setLoadingRelease] = useState(false);
  const manualLoader = useSelector((state) => state.manualWhatsApp.loadingCamping);
  const formDataOutBoundCampaign = useSelector((state) => state.outboundCampaign.formDataCampaign)

  /* Modified by Arjun for accomplishing Manual WhatsApp feature */
  /* Modified by Arjun for accomplishing Manual WhatsApp feature */
  const location = useLocation();
  const redirectFrom = location?.state?.redirectFrom;

  useEffect(() => {
    if (!searchText) {
      dispatch(getParentsList({
        page: page, per_page: limitPerPage,
        ...(districtIds?.length > 0 && { districtIds: districtIds?.map(el => el?.district_id) }),
        ...(blockZoneIds.length > 0 && { blockZoneIds: blockZoneIds?.map(el => el?.block_zone_id) }),
        ...(panchayatWardIds?.length > 0 && { panchayatWardIds: panchayatWardIds?.map(el => el?.panchayat_ward_id) }),
        ...(villageAreaIds?.length > 0 && { villageAreaIds: villageAreaIds?.map(el => el?.village_area_id) }),
        assignedSupervisorId: supervisorValue,
        assignedCEWId: cewValue,
        startDate: startDateValue,
        endDate: endDateValue
      })).then(resp => {
        formatForDisplay(resp.data)
      })
    } else {
      let timerId = setTimeout(() => {
        dispatch(getParentsList({
          page: 1, per_page: limitPerPage, search: searchText,
          ...(districtIds?.length > 0 && { districtIds: districtIds?.map(el => el?.district_id) }),
          ...(blockZoneIds.length > 0 && { blockZoneIds: blockZoneIds?.map(el => el?.block_zone_id) }),
          ...(panchayatWardIds?.length > 0 && { panchayatWardIds: panchayatWardIds?.map(el => el?.panchayat_ward_id) }),
          ...(villageAreaIds?.length > 0 && { villageAreaIds: villageAreaIds?.map(el => el?.village_area_id) }),
          assignedSupervisorId: supervisorValue,
          assignedCEWId: cewValue,
          startDate: startDateValue,
          endDate: endDateValue
        })
        ).then(resp => {
          formatForDisplay(resp?.data)
        })
      }, 1000)
      return () => clearTimeout(timerId)

    }
  }, [limitPerPage, searchText, page])

  useEffect(() => {
    if (isSelectAll) {
      setIsSelectAll(false)
    }
  }, [page, limitPerPage, searchText])

  useEffect(() => {
    if (isSelectAll) {
      setIsSelectedAll(false)
    }
  }, [isSelectAll])

  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
      formatedRows.push({
        "id": item.id,
        "districtName": item.assigned_district,
        "panchayatWardName": item.assigned_panchayat_ward,
        "blockZoneName": item.assigned_block_zone,
        "name": item.full_name,
        "whatsapp_number": item.whatsapp_number,
        "village": item.assigned_village_area,
        "assignedsupervisior": item.assigned_supervisor,
        "assignedcew": item.assigned_village_worker,
        "added": item.added_by,
        "role": item.role,
        "createdon": dayjs(item.created_at).format("D MMM, YYYY"),
        "kids_count": item.kids_count,
        "assigned_district": item.assigned_district,
        "assigned_block_zone": item.assigned_block_zone,
        "assigned_panchayat_ward": item.assigned_panchayat_ward,
      })
    })
    setList(formatedRows)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }

  const onNavigateDetails = (id) => {
    if (redirectFrom) {

    } else {
      navigate({ pathname: `/parents-detail/${id}` })
    }
  }

  const onPageChange = (page) => {
    dispatch(fillPageNumParents(page))
  }


  const ExportData = async () => {
    const url = `v1/parents/export`;
    try {
      setIsLoading(true)
      const response = await axiosInstance.post(url, {}, { responseType: 'blob' });
      setIsLoading(false)
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `parents-${dayjs(new Date()).format("DD-MM-YYYY")}.xlsx`; // Adjust the file name and extension as needed
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      return response;
    } catch (err) {
      toast.error(err?.response?.statusText);
      setIsLoading(false)
      return err.response;
    }
  };


  const handleSelected = (selectedData) => {
    setSubmittedSelectedParents(selectedData)
    dispatch(setSelectedQuestion(selectedData))
  };

  const handleAddParents = () => {
    setIsSubmit(true)
  }

  const submitData = () => {
    let finalValues = {}
    if (redirectFrom === "manual-whatsapp") {
      finalValues = {
        ...formDataCampaign,
        parentIds: isSelectedAll ? [] : submittedSelectedParents?.map(el => el?.id),
        type: "3",
        isSelectAll: isSelectedAll,
        search: searchText,
        ...(districtIds?.length > 0 && { districtIds: districtIds?.map(el => el?.district_id) }),
        ...(blockZoneIds.length > 0 && { blockZoneIds: blockZoneIds?.map(el => el?.block_zone_id) }),
        ...(panchayatWardIds?.length > 0 && { panchayatWardIds: panchayatWardIds?.map(el => el?.panchayat_ward_id) }),
        ...(villageAreaIds?.length > 0 && { villageAreaIds: villageAreaIds?.map(el => el?.village_area_id) }),
        assignedSupervisorId: supervisorValue,
        assignedCEWId: cewValue,
        startDate: startDateValue,
        endDate: endDateValue
      }
      dispatch(postManualWhatsAppCreate(finalValues)).then((resp) => {
        if (resp?.data?.statusCode === 200) {
          navigate(`/manual-whatsapp`);
          setLoadingRelease(false);
          setIsSubmit(false)

        } else {
          setLoadingRelease(false);
          setIsSubmit(false)
        }
      });
    }
    else {
      finalValues = {
        ...formDataOutBoundCampaign,
        parentIds: isSelectedAll ? [] : submittedSelectedParents?.map(el => el?.id),
        isSelectAll: isSelectedAll,
        search: searchText,
        ...(districtIds?.length > 0 && { districtIds: districtIds?.map(el => el?.district_id) }),
        ...(blockZoneIds.length > 0 && { blockZoneIds: blockZoneIds?.map(el => el?.block_zone_id) }),
        ...(panchayatWardIds?.length > 0 && { panchayatWardIds: panchayatWardIds?.map(el => el?.panchayat_ward_id) }),
        ...(villageAreaIds?.length > 0 && { villageAreaIds: villageAreaIds?.map(el => el?.village_area_id) }),
        assignedSupervisorId: supervisorValue,
        assignedCEWId: cewValue,
        startDate: startDateValue,
        endDate: endDateValue
      }
      dispatch(CreateOutboundIVRSCampaign(finalValues)).then((res) => {
        if (res?.data?.statusCode == 200) {
          navigate('/outbound-ivrs');
          setLoadingRelease(false);
          setIsSubmit(false)
        }
        else {
          setLoadingRelease(false);
          setIsSubmit(false)
        }
      })
    }
  }

  const handleBackParents = () => {
    dispatch(setSelectedQuestion(addedParents))
    navigate(-1)
  }

  const SendAllParents = () => {
    setIsSelectedAll(!isSelectedAll)
  }

  const ClearParents = () => {
    setIsSelectedAll(false)
    setIsSelectAll(false)
    setSubmittedSelectedParents([])
    dispatch(setSelectedQuestion([]))
  }


  return (
    <Box>
      {redirectFrom && (
        <Button variant="text" onClick={handleBackParents} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[12px]" disableRipple startIcon={<KeyboardBackspaceIcon />}>
          Back
        </Button>
      )}
      <div className="tw-flex tw-justify-between tw-px-3">
        <Typography variant="h3" className='!tw-font-semibold'>Parents</Typography>
        <div className='tw-flex tw-gap-6 tw-justify-between'>
          <SearchBox placeholder="Search by name and mobile no" handleSearch={handleSearch} />
          <div className='tw-flex tw-gap-x-5'>
            {!redirectFrom && Permissions?.Parents?.create && <Button variant="contained" onClick={() => navigate('/parents/create-parent')} className="uppercase">Add new Parent</Button>}
            {redirectFrom && ( // Modified by nayan for accomplishing unit content feature
              <LoadingButton
                disabled={selected?.length > 0 ? false : true}
                variant="contained"
                onClick={handleAddParents}
                loading={manualLoader || loadingRelease}
                className="uppercase"
                sx={{
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(0, 0, 0, 0.12)', // Default disabled background color
                    color: 'rgba(0, 0, 0, 0.26)', // Default disabled text color
                  },
                }}
              >
                {redirectFrom === "manual-whatsapp" ? "Release" : "Initiate Call"}
              </LoadingButton>
            )}
            {!redirectFrom && Permissions?.Parents?.create ? <Button variant='outlined' onClick={() => navigate('/parents/manage-bulk-upload')}>
              Manage Bulk  Upload
            </Button> : null}
          </div>
        </div>
      </div>
      <Paper className='tw-w-full tw-bg-white tw-pt-6 tw-mt-6'>
        <div className='tw-flex tw-justify-between tw-relative tw-items-center tw-pr-4'>
          {paginateInfo.total && <div className='tw-flex tw-gap-4 tw-items-center tw-justify-between tw-w-[400px]'>
            <span className='tw-text-sm tw-ml-4'>Total {paginateInfo.total}</span>
            {isSelectAll && <div className='tw-bg-backgroundPrimary tw-p-2 tw-border tw-rounded tw-flex tw-justify-between tw-items-center tw-w-[77%]'>
              <span className='tw-text-sm tw-text-[#333333]'>{!isSelectedAll && "Select"} {paginateInfo.total} parents {isSelectedAll && "selected"}</span>
              {!isSelectedAll ?
                <Button variant='outlined' className='!tw-text-sm !tw-text-primary' onClick={SendAllParents}>Select All</Button>
                :
                <Button variant='outlined' className='!tw-text-sm !tw-text-primary' onClick={ClearParents}>Clear</Button>
              }
            </div>
            }
          </div>}
          <div className={`tw-flex tw-gap-4 tw-justify-end ${paginateInfo.total ? "w-auto" : "tw-w-full"}`}>
            {/* {!redirectFrom && <Button variant="outlined" className="uppercase" disabled={selected.length > 0 ? false : true} onClick={() => setOpenDeleteDialog(true)}>Delete</Button>} */}
            {!redirectFrom && <LoadingButton loading={IsLoading} disableElevation variant='outlined' className='uppercase' onClick={ExportData}>
              Export Data
            </LoadingButton>}
            <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>Filters</Button>
            <ParentsFilter setIsSelectAll={setIsSelectAll} setIsSelectedAll={setIsSelectedAll}
              anchorEl={anchorEl} applyfilter={applyfilter} setApplyFilter={setApplyFilter} page={page} setAnchorEl={setAnchorEl} handleClose={handleClose} limitPerPage={limitPerPage} formatForDisplay={formatForDisplay} />
          </div>
        </div>
        <>
          {!loader ? (
            <>
              {list.length ? (
                redirectFrom ? <ManualWhatsAppParentTable
                  paginate={paginateInfo}
                  onNavigateDetails={onNavigateDetails}
                  scrollable
                  actions={{ edit: true, preview: true }}
                  columns={header}
                  redirectFrom={redirectFrom || 'parents'} // Modified by Arjun for accomplishing Manual Whatsapp feature
                  handleSelected={handleSelected}// Modified by Arjun for accomplishing Manual Whatsapp feature
                  selectedData={selected} // Modified by Arjun for accomplishing Manual Whatsapp feature
                  data={list}
                  onPageChange={onPageChange}
                  page={page}
                  details={true}
                  keyProp="uuid"
                  setLimitPerPage={setLimitPerPage}
                  limitPerPage={limitPerPage}
                  dispatchperPage={fillPerPageNumParents}
                  setIsSelectAll={setIsSelectAll}
                  setIsSelectedAll={setIsSelectedAll}
                />
                  :
                  <EnhancedTable paginate={{ totalPages: paginateInfo.totalPages, page: page }}
                    onNavigateDetails={onNavigateDetails} scrollable
                    actions={{ edit: true, preview: true }} columns={header}
                    data={list} onPageChange={onPageChange} page={page} details={true}
                    keyProp="uuid" setLimitPerPage={setLimitPerPage}
                    limitPerPage={limitPerPage} dispatchperPage={fillPerPageNumParents} />
              ) : (
                <div className='tw-p-6 tw-mt-5 tw-bg-[#FAFCFE] tw-text-SecondaryTextColor  tw-font-normal tw-text-sm tw-text-center tw-rounded-lg'>
                  <span>No Parents Found</span>
                </div>
              )}
            </>
          ) : (
            <div className='tw-text-center tw-py-5'><CircularProgress /></div>
          )}
        </>
      </Paper>
      <FormDialog2 open={isSubmit} title="Are you sure, you want to release campaign?" close={() => setIsSubmit(false)} maxWidth={"490px"} >
        <Button variant='contained' onClick={submitData} className='tw-w-full'>Okay</Button>
      </FormDialog2>
    </Box>
  )
}

