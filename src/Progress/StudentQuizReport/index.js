import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, CircularProgress, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import ParentSelectSearch from '../../components/parents/ParentSelectSearch';
import filter_on from '../../../public/assets/icons/filter_on.svg';
import FilterListIcon from '@mui/icons-material/FilterList';
import EnhancedTable from '../../components/StudentQuizReport/table';
import StudentQuizReportFilter from '../../components/StudentQuizReport/filter';
import { DeleteDialog, FormDialog2 } from '../../components/Dialog';
import { getStudentQuizReportList, resendQuizReport } from './duck/network';
import { getVillageUnit } from '../duck/network';
import { getOutBoundParentUnitNumberMaster } from '../../OutBoundCampaign/duck/network';

const header = [
  {
    id: "childrenName",
    numeric: false,
    disablePadding: true,
    label: "Children Name",
    sort: true,
    width: 160,
  },
  {
    id: "parentsName",
    numeric: false,
    disablePadding: true,
    label: "Parents Name",
    sort: true,
    width: 160,
  },
  {
    id: "grade",
    numeric: false,
    disablePadding: true,
    label: "Grade Number",
    sort: true,
    width: 160,
  },
  {
    id: "tamilScorePercentage",
    numeric: false,
    disablePadding: true,
    label: "Tamil Score in %",
    sort: true,
    width: 160,
  },
  {
    id: "tamilPerformanceStar",
    numeric: false,
    disablePadding: true,
    label: "Tamil Performance",
    sort: true,
    width: 160,
  },
  {
    id: "mathsScorePercentage",
    numeric: false,
    disablePadding: true,
    label: "maths Score in %",
    sort: true,
    width: 160,
  },
  {
    id: "mathsPerformanceStar",
    numeric: false,
    disablePadding: true,
    label: "Maths Performance",
    sort: true,
    width: 160,
  },
  {
    id: "englishScorePercentage",
    numeric: false,
    disablePadding: true,
    label: "English Score in %",
    sort: true,
    width: 160,
  },
  {
    id: "englishPerformanceStar",
    numeric: false,
    disablePadding: true,
    label: "English Performance",
    sort: true,
    width: 160,
  },
  {
    id: "assignedDistrict",
    numeric: false,
    disablePadding: true,
    label: "District Name",
    sort: true,
    width: 160,
  },
  {
    id: "assignedBlockZone",
    numeric: false,
    disablePadding: true,
    label: "Block/Zone Name",
    sort: true,
    width: 160,
  },
  {
    id: "assignedPanchayatWard",
    numeric: false,
    disablePadding: true,
    label: "Panchayat/Ward Name",
    sort: true,
    width: 160,
  },
  {
    id: "assignedVillageArea",
    numeric: false,
    disablePadding: true,
    label: "Village Name",
    sort: true,
    width: 160,
  },
  {
    id: "whatsappNumber",
    numeric: false,
    disablePadding: true,
    label: "Whatsapp Number",
    sort: true,
    width: 160,
  },
  {
    id: "reportSharedStatus",
    numeric: false,
    disablePadding: true,
    label: "Reported Status",
    sort: true,
    width: 160,
  },
  {
    id: "updatedAt",
    numeric: false,
    disablePadding: true,
    label: "Status Updated On",
    sort: true,
    width: 160,
  },
  {
    id: "action",
    numeric: false,
    disablePadding: true,
    label: "Actions",
    sort: true,
    width: 160,
  },
]

const Data = [
  {
    childrenName: "Ria",
    parentName: "Nimit",
    grade: "Grade 1",
    tamilScore: "30",
    tamilPerformance: "Silver - 1 star",
    mathsScore: "34",
    mathsPerformance: "Gold - 3 star",
    englishScore: "32",
    englishPerformance: "Gold - 2 star",
    district: "Thane",
    blockZone: "Kandivali",
    panchayatName: "Khar",
    village: "Koper",
    whatsappNumber: "1234567890",
    status: "Delivered",
    updatedOn: "2022-01-01",
  }
]

export default function StudentQuizReport() {
  const loader = useSelector((state) => state.studentquizreport.loading)
  const [list, setList] = useState(Data)
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [applyfilter, setApplyFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [storeIds, setStoreIds] = useState({
    district_id: [],
    block_zone_id: [],
    panchayat_ward_id: [],
    village_area_id: []
  });
  const paginateInfo = useSelector((state) => state.studentquizreport.paginateInfo)
  const totalParent = useSelector((state) => state.studentquizreport.totalParent)
  const totalChild = useSelector((state) => state.studentquizreport.totalChild)

  const [openDeleteDialog, setOpenDeleteDialog] = useState({
    show: false,
    id: "",
    parentId: "",
    childId: ""
  })
  const { unitId, programId, villageAreaId, programName } = location.state || {};
  const UnitNumberMaster = useSelector((state) => state.outboundCampaign.OutboundParentsUnitNumberMaster)
  const [unitValue, setunitValue] = useState("");


  useEffect(() => {
    dispatch(getStudentQuizReportList({
      programUnitId: unitValue ? unitValue : unitId,
      page: page,
      perPage: limitPerPage
    })).then(res => formatForDisplay(res.data))

  }, [page, limitPerPage, unitValue])

  useEffect(() => {
    dispatch(getOutBoundParentUnitNumberMaster({
      programId: programId,
    }));
  }, [])

  const onPageChange = (page) => {
    setPage(page)
  }

  const formatForDisplay = data => {
    const formatedRows = []
    Array.isArray(data) &&
      data?.forEach((item) => {
        formatedRows.push({
          "id": item.id,
          "childrenName": item.childrenName,
          "parentsName": item.parentsName,
          "grade": item.grade,
          "tamilScorePercentage": item.tamilScorePercentage,
          "tamilPerformanceStar": item.tamilPerformanceStar,
          "mathsScorePercentage": item.mathsScorePercentage,
          "mathsPerformanceStar": item.mathsPerformanceStar,
          "englishScorePercentage": item.englishScorePercentage,
          "englishPerformanceStar": item.englishPerformanceStar,
          "assignedDistrict": item.assignedDistrict,
          "assignedBlockZone": item.assignedBlockZone,
          "assignedPanchayatWard": item.assignedPanchayatWard,
          "assignedVillageArea": item.assignedVillageArea,
          "updatedAt": dayjs(item.updatedAt).format('DD MMM, YYYY'),
          "whatsappNumber": item.whatsappNumber,
          "reportSharedStatus": item.reportSharedStatus,
          "errorTitle": item.errorTitle,
          "parentId": item.parentId,
          "childId": item.childId,
          "report_certificate_url": item.report_certificate_url
        })
      })
    setList(formatedRows)
  }

  const Back = () => {
    navigate(-1)
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onNavigateDetails = () => {
  }

  const onChangeUnit = (e) => {
    setunitValue(e)
  }

  const handleClickExport = () => {

  }

  const sendReport = () => {
    dispatch(resendQuizReport({
      programUnitId: unitValue ? unitValue : unitId,
      villageAreaId: villageAreaId,
      parentId: openDeleteDialog.parentId,
      childId: openDeleteDialog.childId,
      studentQuizProgressId: openDeleteDialog.id
    }))
    setOpenDeleteDialog({ show: false })
  }

  const handleCloseDialog = () => {
    setOpenDeleteDialog({ show: false })
  }


  return (
    <div>
      <div className="tw-flex tw-flex-col tw-w-full tw-mb-5 tw-gap-1">
        <a className='tw-cursor-pointer' onClick={Back}>
          <ArrowBackIcon className="tw-text-grey" />
          <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">Progress/Student Quiz Report</span>
        </a>
        <div className="tw-flex tw-justify-between tw-px-3">
          <Typography variant="h3" className='!tw-font-semibold'>{programName}</Typography>
        </div>
      </div>
      <Paper className="tw-w-full tw-py-6 tw-flex tw-flex-col tw-items-start tw-mt-6">
        <Typography variant="h4" className='!tw-font-semibold tw-px-5'>Student Quiz Report</Typography>
        <div className='tw-flex tw-justify-between tw-w-full tw-items-center tw-mb-5 tw-mt-6 tw-px-5'>
          <div className='tw-flex tw-gap-5 tw-w-[200px]'>
            <div className='tw-flex tw-flex-col tw-w-full tw-gap-1'>
              <span className='tw-text-xs tw-text-grey tw-block tw-mb-[6px]'>Total Children</span>
              <span>{totalChild}</span>
            </div>
            <div className='tw-flex tw-flex-col tw-w-full tw-gap-1'>
              <span className='tw-text-xs tw-text-grey tw-block tw-mb-[6px]'>Total Parents</span>
              <span>{totalParent}</span>
            </div>
          </div>
          <div className='tw-flex tw-gap-3'>
            <div className="tw-w-[242px]">
              <ParentSelectSearch options={UnitNumberMaster} height={20} value={unitValue ? unitValue : unitId} onChange={onChangeUnit} valuekey="id" labelkey="title" label="Select Unit" />
            </div>
            {/* <Button variant="outlined" className="tw-text-primaryColor tw-px-2" onClick={handleClickExport}>Export</Button> */}
            <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>Filters</Button>
          </div>
          <StudentQuizReportFilter unitValue={unitValue} storeIds={storeIds} setStoreIds={setStoreIds} setPage={setPage} anchorEl={anchorEl} applyfilter={applyfilter} setApplyFilter={setApplyFilter} page={page} setAnchorEl={setAnchorEl} handleClose={handleClose} limitPerPage={limitPerPage} formatForDisplay={formatForDisplay} />
        </div>
        {!loader ? (
          <>
            {list.length ? (
              <EnhancedTable paginate={paginateInfo} onNavigateDetails={onNavigateDetails} scrollable
                actions={{ edit: false, preview: false }} columns={header}
                data={list} onPageChange={onPageChange} page={page} details={true} keyProp="uuid" setLimitPerPage={setLimitPerPage}
                limitPerPage={limitPerPage} setPage={setPage} setOpenDeleteDialog={setOpenDeleteDialog}
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
      <FormDialog2 open={openDeleteDialog.show} hideClose={true} title="Are you sure, you want to send the report to parent" close={handleCloseDialog} maxWidth={"490px"} >
        <Button variant='contained' onClick={sendReport} className='tw-w-full'>Send Report</Button>
      </FormDialog2>

    </div>
  )
}
