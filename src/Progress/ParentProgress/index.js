import { Button, CircularProgress, Paper, Popover, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import ParentSelectSearch from '../../components/parents/ParentSelectSearch';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getOutBoundParentUnitNumberMaster } from '../../OutBoundCampaign/duck/network';
import EnhancedTable from './table';
import ParentProgressFilter from './filter';
import { RefreshParentProgress, getParentWiseProgressList, onExportParentWiseProgressList } from '../duck/network';
import filter_on from '../../../public/assets/icons/filter_on.svg';

const header = [
  {
    id: "parentsName",
    numeric: false,
    disablePadding: true,
    label: "Parents Name",
    sort: true,
    width: 140,
  },
  {
    id: "village",
    numeric: false,
    disablePadding: true,
    label: "Village",
    sort: true,
    width: 120,
  },
  {
    id: "panchayat",
    numeric: false,
    disablePadding: true,
    label: "Panchayat/Ward Name",
    sort: true,
    width: 120,
  },
  {
    id: "block",
    numeric: false,
    disablePadding: true,
    label: "Block/zone Name",
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
    id: "unit",
    numeric: false,
    disablePadding: true,
    label: "Current Unit",
    sort: true,
    width: 120,
  },
  {
    id: "unitScore",
    numeric: false,
    disablePadding: true,
    label: "Unit Score",
    sort: true,
    width: 120,
  },
  {
    id: "quiz1",
    numeric: false,
    disablePadding: true,
    label: "Standalone parent Quiz Score",
    sort: true,
    width: 120,
  },
  {
    id: "quiz2",
    numeric: false,
    disablePadding: true,
    label: "Standalone student Quiz Score",
    sort: true,
    width: 120,
  },
  {
    id: "workshop1",
    numeric: false,
    disablePadding: true,
    label: "Parents Workshop Quiz",
    sort: true,
    width: 120,
  },
  {
    id: "workshop2",
    numeric: false,
    disablePadding: true,
    label: "Workshop Attendance",
    sort: true,
    width: 120,
  },
  {
    id: "updatedOn",
    numeric: false,
    disablePadding: true,
    label: "Last updated",
    sort: true,
    width: 120,
  }
]

export default function ParentProgress() {
  const navigate = useNavigate();
  const paginateInfo = useSelector((state) => state.progress.parentwiseprogresspaginate)
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10)
  const [list, setList] = useState([])
  const loader = useSelector((state) => state.loader.openTableLoader);
  const dispatch = useDispatch();
  const location = useLocation();
  const { programName, programId, unitId } = location?.state || {};
  const [applyfilter, setApplyFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl2] = useState(null);
  const [storeIds, setStoreIds] = useState({
    district_id: [],
    block_zone_id: [],
    panchayat_ward_id: [],
    village_area_id: []
  });
  const open = Boolean(anchorEl1);
  const id = open ? 'simple-popover' : undefined;
  const UnitNumberMaster = useSelector((state) => state.outboundCampaign.OutboundParentsUnitNumberMaster)
  const [unitValue, setunitValue] = useState("");

  useEffect(() => {
    dispatch(getParentWiseProgressList({
      page: page,
      per_page: limitPerPage,
      program_id: programId,
      program_unit_id: unitValue ? unitValue : unitId,
      ...(storeIds?.district_id.length > 0 && { district_ids: storeIds?.district_id }),
      ...(storeIds?.block_zone_id.length > 0 && { blockZoneIds: storeIds?.block_zone_id }),
      ...(storeIds?.panchayat_ward_id.length > 0 && { panchayatWardIds: storeIds?.panchayat_ward_id }),
      ...(storeIds?.village_area_id.length > 0 && { village_area_ids: storeIds?.village_area_id }),
    })).then((res) => {
      formatForDisplay(res?.data)
    })
  }, [page, limitPerPage, unitValue])

  useEffect(() => {
    dispatch(getOutBoundParentUnitNumberMaster({
      programId: programId
    }));
  }, [])

  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
      formatedRows.push({
        "parentsName": item?.parent_name,
        "district": item?.assigned_district,
        "panchayat": item?.assigned_panchayat_ward,
        "block": item?.assigned_block_zone,
        "village": item?.assigned_village_area,
        "unit": item?.program_unit_name,
        "unitScore": item?.unit_score,
        "quiz1": item?.standalone_parent_quiz_score_progress_score,
        "quiz2": item?.standalone_student_quiz_score_progress_score,
        "workshop1": item?.standalone_parent_workshop_quiz_score_progress_score,
        "workshop2": item?.parent_workshop_attendance_score_progress_score,
        "updatedOn": dayjs(item.updated_at).format("DD MMM, YYYY"),
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

  const onChangeUnit = (e) => {
    setunitValue(e)
  }


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickBtn = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleCloseBtn = () => {
    setAnchorEl2(null);
  };

  const onRefersh = () => {
    dispatch(RefreshParentProgress({
      program_id: programId,
      program_unit_id: unitValue ? unitValue : unitId,
      ...(storeIds?.district_id.length > 0 && { district_ids: storeIds?.district_id }),
      ...(storeIds?.block_zone_id.length > 0 && { blockZoneIds: storeIds?.block_zone_id }),
      ...(storeIds?.panchayat_ward_id.length > 0 && { panchayatWardIds: storeIds?.panchayat_ward_id }),
      ...(storeIds?.village_area_id.length > 0 && { village_area_ids: storeIds?.village_area_id }),
    })).then((res) => {
      if (res?.status === 200) {
        dispatch(getParentWiseProgressList({
          page: page,
          per_page: limitPerPage,
          program_id: programId,
          program_unit_id: unitValue ? unitValue : unitId,
        })).then((res) => {
          formatForDisplay(res?.data)
        })
      }
    })
  }

  const onExport = () => {
    dispatch(onExportParentWiseProgressList({
      page: page,
      per_page: limitPerPage,
      program_id: programId,
      program_unit_id: unitValue ? unitValue : unitId,
      export: true,
      ...(storeIds?.district_id.length > 0 && { district_ids: storeIds?.district_id }),
      ...(storeIds?.block_zone_id.length > 0 && { blockZoneIds: storeIds?.block_zone_id }),
      ...(storeIds?.panchayat_ward_id.length > 0 && { panchayatWardIds: storeIds?.panchayat_ward_id }),
      ...(storeIds?.village_area_id.length > 0 && { village_area_ids: storeIds?.village_area_id }),
    })).then((res) => {
      formatForDisplay(res?.data)
    })
  }


  return (
    <div>
      <div className="tw-flex tw-flex-col tw-w-full tw-mb-5 tw-gap-1">
        <a className='tw-cursor-pointer' onClick={Back}>
          <ArrowBackIcon className="tw-text-grey" />
          <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">Program/Parent Progress</span>
        </a>
        <div className="tw-flex tw-justify-between tw-px-3">
          <Typography variant="h3" className='!tw-font-semibold'>{programName}</Typography>
        </div>
      </div>
      <Paper className="tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-mt-6">
        <div className='tw-flex tw-flex-col tw-gap-10 tw-w-full tw-mb-14'>
          <Typography variant="h4" className='!tw-font-semibold'>Parent-wise Progress</Typography>
          <div className='tw-flex tw-justify-between tw-items-start'>
            <div className='tw-flex tw-flex-col tw-gap-2'>
              <span className='tw-text-grey tw-text-sm'>Total parents</span>
              <span className='tw-text-grey'>{paginateInfo?.total}</span>
            </div>
            <div className='tw-flex tw-gap-5 tw-relative'>
              <div className="tw-w-[242px]">
                <ParentSelectSearch options={UnitNumberMaster} height={20} value={unitValue ? unitValue : unitId} onChange={onChangeUnit} valuekey="id" labelkey="title" label="Select Unit" />
              </div>
              <Button variant='contained' onClick={handleClickBtn}>Action</Button>
              <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>Filters</Button>
              <ParentProgressFilter unitId={unitValue ? unitValue : unitId} programId={programId} storeIds={storeIds} setStoreIds={setStoreIds} anchorEl={anchorEl} applyfilter={applyfilter} setApplyFilter={setApplyFilter} page={page} setPage={setPage} setAnchorEl={setAnchorEl} handleClose={handleClose} limitPerPage={limitPerPage} formatForDisplay={formatForDisplay} />
            </div>
          </div>
        </div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl1}
          onClose={handleCloseBtn}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <div className="tw-flex tw-flex-col tw-gap-1 tw-p-1">
            <Button onClick={onExport} className="!tw-text-secondary !tw-justify-start" variant="text">
              Export
            </Button>
            <Button className="!tw-text-secondary !tw-justify-start" variant="text" onClick={onRefersh}>
              Recalculate Scores
            </Button>
          </div>
        </Popover>
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
