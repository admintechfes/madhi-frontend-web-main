import React, { useCallback, useEffect } from 'react'
import { Button, CircularProgress, Paper, Popover, Typography } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getActiveVillageProgram, getProgramUnitContentExport, getProgressDetails, getUnitNameList } from './duck/network';
import BookIcon from "../../public/assets/images/learning.svg"
import mapIcon from '../../public/assets/icons/map_marker.svg';
import Calendar from '../../public/assets/icons/calendar.svg';
import StatusIcon from '../../public/assets/icons/status.svg';
import { useState } from 'react';
import EnhancedTable from '../components/Progress/Table';
import VillageActiveFilter from '../components/Progress/villageactivefilter';
import filter_on from '../../public/assets/icons/filter_on.svg';
import FilterListIcon from '@mui/icons-material/FilterList';
import VillageExport from '../components/Progress/VillageExport';
import DeleteAlert from '../components/Masters/DeleteAlert';
import ExportUnitModal from '../components/Progress/ExportUnitModal';
import ExportUnitProgramReportModal from '../components/Progress/ExportUnitProgramReportModal';
import SearchBox from '../components/SearchBox';
import ViewMore from '../components/ViewMore';

const header = [
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
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Village/Area Name",
    sort: true,
    width: 180,
  },
  {
    id: "serialNumber",
    numeric: false,
    disablePadding: true,
    label: "Current Active Unit",
    sort: true,
    width: 180,
  },
  {
    id: "updatedOn",
    numeric: false,
    disablePadding: true,
    label: "Unit Active Since",
    sort: true,
    width: 120,
  },
  {
    id: "action",
    numeric: false,
    disablePadding: true,
    label: "Actions",
    sort: false,
    width: 300,
  }
]

export default function ProgressDetails() {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.loader.openTableLoader);
  const ProgressDetails = useSelector((state) => state.progress.progressdetails)
  const params = useParams();
  const paginateInfo = useSelector(state => state.progress.activepaginateInfo)
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const activeProgamRunning = useSelector((state) => state.progress.activeProgamRunning)
  const [applyfilter, setApplyFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isExportModalProgramReportOpen, setIsExportModalProgramReportOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [anchorElPop, setAnchorElPop] = useState(null);
  const open = Boolean(anchorElPop);
  const id = open ? 'simple-popover' : undefined;
  const navigate = useNavigate()
  const districtIds = useSelector((state) => state.progress.district_id);
  const blockZoneIds = useSelector((state) => state.progress.block_zone_id);
  const panchayatWardIds = useSelector((state) => state.progress.panchayat_ward_id);
  const villageAreaIds = useSelector((state) => state.progress.village_area_id);

  useEffect(() => {
    let timerId = setTimeout(() => {
      formatForDisplay(activeProgamRunning?.data);
    }, 1000);
    return () => clearTimeout(timerId);
  }, [limitPerPage]);

  useEffect(() => {
    dispatch(getProgressDetails(params))
    dispatch(getUnitNameList({ programId: params?.id }))
  }, [])

  useEffect(() => {
    dispatch(getActiveVillageProgram({
      id: params.id, page: page, per_page: limitPerPage,
      ...(districtIds?.length > 0 && { districtIds: districtIds?.map(el => el?.district_id) }),
      ...(blockZoneIds.length > 0 && { blockZoneIds: blockZoneIds?.map(el => el?.block_zone_id) }),
      ...(panchayatWardIds?.length > 0 && { panchayatWardIds: panchayatWardIds?.map(el => el?.panchayat_ward_id) }),
      ...(villageAreaIds?.length > 0 && { villageAreaIds: villageAreaIds?.map(el => el?.village_area_id) }),
    search: searchText
    }))
  }, [page, limitPerPage, searchText])

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const debouncedSearch = useCallback(debounce((value) => {
    setSearchText(value);
  }, 1000), []);

  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
      formatedRows.push({
        "id": item.id,
        "districtName": item.districtName,
        "name": item.name,
        "panchayatWardName": item.panchayatWardName,
        "blockZoneName": item.blockZoneName,
        "serialNumber": item.serialNumber,
        "unitId": item.unitId,
        "status": item.status,
        "updatedOn": item.updatedOn
      })
    })
  }

  const onPageChange = (page) => {
    setPage(page)
  }

  let BackgroundTheme = ProgressDetails?.status === 'active' ? 'rgba(56, 146, 255, 0.20)' : ProgressDetails?.status === 'yet to start' ? 'rgba(255, 196, 12, 0.24)' : 'rgba(254, 13, 13, 0.10)';
  let ColorTheme = ProgressDetails?.status === 'active' ? '#3892FF' : ProgressDetails?.status === 'yet to start' ? '#F39C35' : '#FE0D0D';

  const getIconName = (title, name, icon) => {
    return (
      <div className='tw-flex tw-items-start tw-gap-2 tw-w-[242px]'>
        <img src={icon === "map" ? mapIcon : icon === "book" ? BookIcon : Calendar} alt="map" />
        <div className='tw-flex tw-flex-col'>
          <span className='tw-text-xs tw-text-grey tw-block tw-mb-[6px]'>{title}</span>
          {/* <span className='tw-text-sm tw-text-primaryText'>{name}</span> */}
          <ViewMore data={name || '-'} className="tw-text-sm tw-text-primaryText" />
        </div>
      </div>
    )
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClose1 = () => {
    setAnchorE2(null);
  };

  const handleClickExport = (event) => {
    setAnchorE2(event.currentTarget);
  }


  const closeIsExportModal = () => {
    setIsExportModalOpen(false)
  }

  const closeIsExportReportModal = () => {
    setIsExportModalProgramReportOpen(false)
  }

  const handleClosePopover = () => {
    setAnchorElPop(null);
  };

  const handleOpenPopover = (event) => {
    setAnchorElPop(event.currentTarget);
  }

  return (
    <>
      <Link to="/programs">
        <ArrowBackIcon className='tw-text-grey' />
        <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>Progress</span>
      </Link>
      <Typography variant="h2" className='!tw-font-semibold !tw-text-secondaryText'>{ProgressDetails?.name}</Typography>
      <>
        <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
          <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">Program details for</Typography>
          <div className='tw-flex tw-items-start tw-gap-6  tw-flex-wrap tw-w-full'>
            {getIconName("Program Name", ProgressDetails?.name, "book")}
            {getIconName("Selected Districts", ProgressDetails?.programDistricts, "map")}
            {getIconName("Selected Block/Zone", ProgressDetails?.programBlockZones, "map")}
            {getIconName("Selected Panchayat/Ward", ProgressDetails?.programPanchayatWards, "map")}
          </div>
          <div className='tw-flex tw-items-start tw-gap-6 tw-flex-wrap tw-w-full'>
            {getIconName("Selected Village/Area", ProgressDetails?.programVillageAreas)}
            {getIconName("Start and End date of the Program", ProgressDetails?.startEndDate)}
            <div className='tw-flex tw-items-start tw-gap-2 tw-w-[242px]'>
              <img src={StatusIcon} alt="status" />
              <div className='tw-flex tw-flex-col'>
                <span className='tw-text-xs tw-text-grey tw-block tw-mb-[6px]'>Status</span>
                <span style={{ backgroundColor: BackgroundTheme, color: ColorTheme }} className='tw-text-sm tw-text-primaryText tw-font-normal tw-px-2 tw-py-[2px] tw-rounded tw-text-center'>{ProgressDetails?.status}</span>
              </div>
            </div>
            {getIconName("Status Since", ProgressDetails?.statusSince)}
          </div>
        </Paper>
        <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
          <Typography variant="h4" className="!tw-font-semibold tw-mb-2 !tw-text-secondaryText">List of village/area program running in</Typography>
          <div className='tw-flex tw-justify-between tw-relative tw-items-center tw-gap-4 tw-pr-6 tw-w-full'>
            <span>Total {paginateInfo.total}</span>
            <div className='tw-flex tw-gap-4'>
              <SearchBox placeholder="Search by village/area" handleSearch={(e) => debouncedSearch(e.target.value)} />
              <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>Filters</Button>
              <Button variant="outlined" className="tw-text-primaryColor tw-px-2" onClick={handleClickExport}>Export</Button>
              <Button variant='outlined' aria-describedby={id} onClick={handleOpenPopover}>View Progress</Button>
            </div>
            <VillageActiveFilter anchorEl={anchorEl} applyfilter={applyfilter} setApplyFilter={setApplyFilter} page={page} setPage={setPage} setAnchorEl={setAnchorEl} handleClose={handleClose} limitPerPage={limitPerPage} formatForDisplay={formatForDisplay} />
            <VillageExport setIsExportModalOpen={setIsExportModalOpen} anchorE2={anchorE2} setAnchorE2={setAnchorE2} handleClose1={handleClose1} setIsExportModalProgramReportOpen={setIsExportModalProgramReportOpen} />
            <Popover
              id={id}
              open={open}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              anchorEl={anchorElPop}
              onClose={handleClosePopover}
            >
              <div className="tw-flex tw-flex-col tw-gap-1 tw-p-1">
                <Button className="!tw-text-secondary !tw-justify-start" onClick={() => navigate(`/progress/student-quiz-report`, { state: { programName: ProgressDetails?.name, unitId: activeProgamRunning?.data[0]?.unitId, programId: params?.id, villageAreaId: activeProgamRunning?.data[0]?.id } })} variant="text">
                  Student Quiz Report
                </Button>
                <Button className="!tw-text-secondary !tw-justify-start" onClick={() => navigate(`/progress/${params?.id}/village-progress`, { state: { programName: ProgressDetails?.name, unitId: activeProgamRunning?.data[0]?.unitId, programId: params?.id } })} variant="text">
                  Village-wise Progress
                </Button>
                <Button className="!tw-text-secondary !tw-justify-start" onClick={() => navigate(`/progress/parent-progress`, { state: { programName: ProgressDetails?.name, unitId: activeProgamRunning?.data[0]?.unitId, programId: params?.id } })} variant="text">
                  Parent-wise Progress
                </Button>
              </div>
            </Popover>
          </div>
          <div>
            {isExportModalOpen && <ExportUnitModal isExportModalOpen={isExportModalOpen} closeIsExportModal={closeIsExportModal} setIsExportModalOpen={setIsExportModalOpen} setAnchorE2={setAnchorE2} />}

            {isExportModalProgramReportOpen && <ExportUnitProgramReportModal id={params.id} ExportUnitProgramReportModal={ExportUnitProgramReportModal} setAnchorE2={setAnchorE2} closeIsExportReportModal={closeIsExportReportModal} />}
          </div>
          {!loader ?
            <>
              {activeProgamRunning?.data?.length ? <EnhancedTable paginate={paginateInfo} scrollable
                actions={{ edit: true, preview: true }} columns={header}
                data={activeProgamRunning?.data} onPageChange={onPageChange} page={page} details={false} keyProp="uuid"
                setLimitPerPage={setLimitPerPage} programId={params.id}
                limitPerPage={limitPerPage} setPage={setPage} progressName={ProgressDetails?.name} />
                : <div className='tw-text-secondaryText tw-w-full tw-font-normal tw-text-sm tw-text-center'>
                  <span>No Data found</span>
                </div>}
            </>
            :
            <div className='tw-text-center tw-py-5 tw-w-full'><CircularProgress /></div>}
        </Paper>
      </>
    </>
  )
}

