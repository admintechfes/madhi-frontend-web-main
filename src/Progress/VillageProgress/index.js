import { Button, CircularProgress, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import EnhancedTable from './Table';
import ParentSelectSearch from '../../components/parents/ParentSelectSearch';
import VillageProgressFilter from './filter';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getOutBoundParentUnitNumberMaster } from '../../OutBoundCampaign/duck/network';
import { getVillageWiseProgressList } from '../duck/network';
import filter_on from '../../../public/assets/icons/filter_on.svg';

export default function VillageProgress() {
  const navigate = useNavigate();
  const paginateInfo = useSelector((state) => state.progress.villagewiseprogresspaginate)
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10)
  const [list, setList] = useState([])
  const loader = useSelector((state) => state.loader.openTableLoader);
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const { programName, programId, unitId } = location?.state || {};
  const [applyfilter, setApplyFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [storeIds, setStoreIds] = useState({
    district_id: [],
    block_zone_id: [],
    panchayat_ward_id: [],
    village_area_id: []
  });
  const UnitNumberMaster = useSelector((state) => state.outboundCampaign.OutboundParentsUnitNumberMaster)
  const [unitValue, setunitValue] = useState("");
  const headers = useSelector((state) => state.progress.villagewiseheader)

  let header = headers?.map((item) => {
    return {
      id: item.key,
      numeric: false,
      disablePadding: true,
      label: item.label,
      sort: true,
      width: 140,
    }
  })

  useEffect(() => {
    dispatch(getVillageWiseProgressList({
      page: page,
      per_page: limitPerPage,
      program_id: programId,
      program_unit_id: unitValue ? unitValue : unitId,
      ...(storeIds?.district_id.length > 0 && { district_ids: storeIds?.district_id }),
      ...(storeIds?.block_zone_id.length > 0 && { blockZoneIds: storeIds?.block_zone_id }),
      ...(storeIds?.panchayat_ward_id.length > 0 && { panchayatWardIds: storeIds?.panchayat_ward_id }),
      ...(storeIds?.village_area_id.length > 0 && { village_area_ids: storeIds?.village_area_id }),
    })).then((res) => {
      formatForDisplay(res?.headers, res?.data)
    })
  }, [page, limitPerPage, unitValue])

  useEffect(() => {
    dispatch(getOutBoundParentUnitNumberMaster({
      programId: params?.id
    }));
  }, [])


  const formatForDisplay = (header, data) => {
    const formattedRows = [];
  
    if (Array.isArray(data)) {
      data.forEach((item) => {
        const formattedRow = {};
  
        header?.forEach((el) => {
          const key = el?.key;
  
          if (key?.startsWith("quiz") || key?.startsWith("workshop") || key?.startsWith("survey") || key?.startsWith("visit") || key?.startsWith("learning") || key?.startsWith("veracity")) {
            // Handle quiz or workshop-related keys
            formattedRow[el?.key] = item[key]
              ? `${item[key]?.submitted_quizzes || 0}/${item[key]?.total_quizzes || 0}`
              : "--";
          } else {
            // Handle other keys
            formattedRow[el?.key] = item[key] || "--";
          }
        });
  
        formattedRows.push(formattedRow);
      });
    }
  
    setList(formattedRows); // Assuming setList is a state setter
  };
  
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


  return (
    <div>
      <div className="tw-flex tw-flex-col tw-w-full tw-mb-5 tw-gap-1">
        <a className='tw-cursor-pointer' onClick={Back}>
          <ArrowBackIcon className="tw-text-grey" />
          <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">Program/Village Progress</span>
        </a>
        <div className="tw-flex tw-justify-between tw-px-3">
          <Typography variant="h3" className='!tw-font-semibold'>{programName}</Typography>
        </div>
      </div>
      <Paper className="tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-mt-6">
        <div className='tw-flex tw-flex-col tw-gap-10 tw-w-full tw-mb-14'>
          <Typography variant="h4" className='!tw-font-semibold'>Village-wise Progress</Typography>
          <div className='tw-flex tw-justify-between tw-items-start'>
            <span className='tw-text-grey tw-text-sm'>Data shown in the table is based on completion activities</span>
            <div className='tw-flex tw-gap-5 tw-relative'>
              <div className="tw-w-[242px]">
                <ParentSelectSearch options={UnitNumberMaster} height={20} value={unitValue ? unitValue : unitId} onChange={onChangeUnit} valuekey="id" labelkey="title" label="Select Unit" />
              </div>
              <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>Filters</Button>
              <VillageProgressFilter storeIds={storeIds} setStoreIds={setStoreIds} anchorEl={anchorEl} applyfilter={applyfilter} setApplyFilter={setApplyFilter} page={page} setPage={setPage} setAnchorEl={setAnchorEl} handleClose={handleClose} unitId={unitValue ? unitValue : unitId} programId={programId} limitPerPage={limitPerPage} formatForDisplay={formatForDisplay} />
            </div>
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
