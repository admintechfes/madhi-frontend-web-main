import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import EnhancedTable from '../components/parents/Table';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material'
import SearchBox from '../components/SearchBox';
import { useDispatch, useSelector } from 'react-redux';
import ParentsFilter from '../components/parents/parentsfilter';
import FilterListIcon from '@mui/icons-material/FilterList';
import dayjs from 'dayjs';
import { FormDialog2 } from '../components/Dialog';
import { LoadingButton } from '@mui/lab';
import filter_on from '../../public/assets/icons/filter_on.svg';
import { useLocation } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { getShareUnitWorkshopList, postSharedWorkshopCreate } from '../parents/duck/network';
import { fillPageNumSharedQuizParents, fillPerPageNumSharedQuizParents, setSelectedSha, setSelectedSharedWorkshopQuestion, setSelectedSharedWorkshopQuestionredWorkshopQuestion } from '../parents/duck/parentsSlice';
import SharedQuizParentTable from '../sharedQuizParents/table';


const header1 = [
  {
    id: "parentName",
    numeric: false,
    disablePadding: true,
    label: "Parent Name",
    sort: true,
    width: 180,
  },
  {
    id: "parentWhatsappNumber",
    numeric: false,
    disablePadding: true,
    label: "WhatsApp Number",
    sort: true,
    width: 180,
  },
  {
    id: "whatsAppSharedStatus",
    numeric: false,
    disablePadding: true,
    label: "WhatsApp Quiz Sharing Status",
    sort: true,
    width: 120,
  },
  {
    id: "added",
    numeric: false,
    disablePadding: true,
    label: "Quiz Shared By",
    sort: true,
    width: 120,
  },
  {
    id: "role",
    numeric: false,
    disablePadding: true,
    label: "Designation",
    sort: true,
    width: 120,
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
  
]

export default function SharedWorkshopParents() {
  const perPageNum = useSelector((state) => state.parents.perPageSharedQuizNum)
  const page = useSelector((state) => state.parents.pageSharedQuizNum)
  const loader = useSelector((state) => state.parents.parentsListLoading);
  const [list, setList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [limitPerPage, setLimitPerPage] = useState(perPageNum);
  const supervisorValue = useSelector((state) => state.parents.supervisorValue);
  const cewValue = useSelector((state) => state.parents.cewValue);
  const startDateValue = useSelector((state) => state.parents.startDateValue);
  const endDateValue = useSelector((state) => state.parents.endDateValue);
  const selected = useSelector((state) => state.parents.selectedSharedWorkshopQuestion)
  const [applyfilter, setApplyFilter] = useState(false);
  const districtIds = useSelector((state) => state.parents.district_id);
  const blockZoneIds = useSelector((state) => state.parents.block_zone_id);
  const panchayatWardIds = useSelector((state) => state.parents.panchayat_ward_id);
  const villageAreaIds = useSelector((state) => state.parents.village_area_id);
  const [submittedSelectedParents, setSubmittedSelectedParents] = useState(selected)
  const addedParents = useSelector((state) => state.manualWhatsApp.addedParents)
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [isSelectedAll, setIsSelectedAll] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [loadingRelease, setLoadingRelease] = useState(false);
  const manualLoader = useSelector((state) => state.manualWhatsApp.loadingCamping);
  const workshopSharedpaginateInfo = useSelector(state => state.parents.workshopSharedpaginateInfo)
  const location = useLocation();
  const redirectFrom = location?.state?.redirectFrom;

  useEffect(() => {
    if (!searchText) {
      dispatch(getShareUnitWorkshopList({
        page: page, perPage: limitPerPage,
        ...(districtIds?.length > 0 && { districtIds: districtIds?.map(el => el?.district_id) }),
        ...(blockZoneIds.length > 0 && { blockZoneIds: blockZoneIds?.map(el => el?.block_zone_id) }),
        ...(panchayatWardIds?.length > 0 && { panchayatWardIds: panchayatWardIds?.map(el => el?.panchayat_ward_id) }),
        ...(villageAreaIds?.length > 0 && { villageAreaIds: villageAreaIds?.map(el => el?.village_area_id) }),
        assignedSupervisorId: supervisorValue,
        assignedCEWId: cewValue,
        startDate: startDateValue,
        endDate: endDateValue,
        programId: location?.state?.programId,
        programUnitId: location?.state?.programUnitId,
        programUnitContentId: location?.state?.programUnitContentId
      })).then(resp => {
        formatForDisplay(resp?.data)
      })
    } else {
      let timerId = setTimeout(() => {
        dispatch(getShareUnitWorkshopList({
          page: 1, perPage: limitPerPage, search: searchText,
          ...(districtIds?.length > 0 && { districtIds: districtIds?.map(el => el?.district_id) }),
          ...(blockZoneIds.length > 0 && { blockZoneIds: blockZoneIds?.map(el => el?.block_zone_id) }),
          ...(panchayatWardIds?.length > 0 && { panchayatWardIds: panchayatWardIds?.map(el => el?.panchayat_ward_id) }),
          ...(villageAreaIds?.length > 0 && { villageAreaIds: villageAreaIds?.map(el => el?.village_area_id) }),
          assignedSupervisorId: supervisorValue,
          assignedCEWId: cewValue,
          startDate: startDateValue,
          endDate: endDateValue,
          programId: location?.state?.programId,
          programUnitId: location?.state?.programUnitId,
          programUnitContentId: location?.state?.programUnitContentId
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
        "id": item.parentId,
        "parentName": item?.parentName,
        "districtName": item.assigned_district,
        "panchayatWardName": item.assigned_panchayat_ward,
        "blockZoneName": item.assigned_block_zone,
        "parentWhatsappNumber": item?.parentWhatsappNumber,
        "whatsAppSharedStatus": item?.whatsAppSharedStatus,
        "village": item.assigned_village_area,
        "assignedsupervisior": item.assigned_supervisor,
        "assignedcew": item.assigned_village_worker,
        "added": item?.whatsAppSharedByName,
        "role": item?.whatsAppSharedBy,
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

  }

  const onPageChange = (page) => {
    dispatch(fillPageNumSharedQuizParents(page))
  }


  const handleSelected = (selectedData) => {
    setSubmittedSelectedParents(selectedData)
    dispatch(setSelectedSharedWorkshopQuestion(selectedData))
  };

  const handleAddParents = () => {
    setIsSubmit(true)
  }

  const submitData = () => {
    let finalValues = {}
    finalValues = {
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
      endDate: endDateValue,
      programId: location?.state?.programId,
      programUnitId: location?.state?.programUnitId,
      programUnitContentId: location?.state?.programUnitContentId
    }
    dispatch(postSharedWorkshopCreate(finalValues)).then((resp) => {
      if (resp?.data?.statusCode === 200) {
        navigate(`/programs`);
        setLoadingRelease(false);
        setIsSubmit(false)

      } else {
        setLoadingRelease(false);
        setIsSubmit(false)
      }
    });

  }

  const handleBackParents = () => {
    dispatch(setSelectedSharedWorkshopQuestion(addedParents))
    navigate(-1)
  }

  const SendAllParents = () => {
    setIsSelectedAll(!isSelectedAll)
  }

  const ClearParents = () => {
    setIsSelectedAll(false)
    setIsSelectAll(false)
    setSubmittedSelectedParents([])
    dispatch(setSelectedSharedWorkshopQuestion([]))
  }


  return (
    <Box>
      <Button variant="text" onClick={handleBackParents} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[12px]" disableRipple startIcon={<KeyboardBackspaceIcon />}>
        Back
      </Button>

      <div className="tw-flex tw-justify-between tw-px-3">
        <Typography variant="h3" className='!tw-font-semibold'>Parents</Typography>
        <div className='tw-flex tw-gap-6 tw-justify-between'>
          <SearchBox placeholder="Search by name and mobile no" handleSearch={handleSearch} />
          <div className='tw-flex tw-gap-x-5'>
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
              Release Report
            </LoadingButton>
          </div>
        </div>
      </div>
      <Paper className='tw-w-full tw-bg-white tw-pt-6 tw-mt-6'>
        <div className='tw-flex tw-justify-between tw-relative tw-items-center tw-pr-4'>
          {workshopSharedpaginateInfo.total && <div className='tw-flex tw-gap-4 tw-items-center tw-justify-between tw-w-[400px]'>
            <span className='tw-text-sm tw-ml-4'>Total {workshopSharedpaginateInfo.total}</span>
            {isSelectAll && <div className='tw-bg-backgroundPrimary tw-p-2 tw-border tw-rounded tw-flex tw-justify-between tw-items-center tw-w-[77%]'>
              <span className='tw-text-sm tw-text-[#333333]'>{!isSelectedAll && "Select"} {workshopSharedpaginateInfo.total} parents {isSelectedAll && "selected"}</span>
              {!isSelectedAll ?
                <Button variant='outlined' className='!tw-text-sm !tw-text-primary' onClick={SendAllParents}>Select All</Button>
                :
                <Button variant='outlined' className='!tw-text-sm !tw-text-primary' onClick={ClearParents}>Clear</Button>
              }
            </div>
            }
          </div>}
          <div className={`tw-flex tw-gap-4 tw-justify-end ${workshopSharedpaginateInfo.total ? "w-auto" : "tw-w-full"}`}>
            <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>Filters</Button>
            <ParentsFilter contentType="workshop" type={true} setIsSelectAll={setIsSelectAll} setIsSelectedAll={setIsSelectedAll}
              anchorEl={anchorEl} applyfilter={applyfilter}
              programId={location?.state?.programId}
              programUnitId={location?.state?.programUnitId}
              programUnitContentId={location?.state?.programUnitContentId}
              setApplyFilter={setApplyFilter} page={page} setAnchorEl={setAnchorEl} handleClose={handleClose} limitPerPage={limitPerPage} formatForDisplay={formatForDisplay} />
          </div>
        </div>
        <>
          {!loader ? (
            <>
              {list.length ? (

                <SharedQuizParentTable
                  paginate={workshopSharedpaginateInfo}
                  onNavigateDetails={onNavigateDetails}
                  scrollable
                  actions={{ edit: true, preview: true }}
                  columns={header1}
                  redirectFrom={redirectFrom || 'parents'}
                  handleSelected={handleSelected}
                  selectedData={selected}
                  data={list}
                  onPageChange={onPageChange}
                  page={page}
                  details={true}
                  keyProp="uuid"
                  setLimitPerPage={setLimitPerPage}
                  limitPerPage={limitPerPage}
                  dispatchperPage={fillPerPageNumSharedQuizParents}
                  setIsSelectAll={setIsSelectAll}
                  setIsSelectedAll={setIsSelectedAll}
                />
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

