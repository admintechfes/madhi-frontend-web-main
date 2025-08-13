import { Button, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from '../components/Select';
import EnhancedTable from '../components/OutBoundCampaign/Table';
import filter_on from '../../public/assets/icons/filter_on.svg';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchBox from '../components/SearchBox';
import { PanoramaSharp } from '@mui/icons-material';
import { getOutBoundCampaignParentsList, getOutboundCampaignDetails } from './duck/network';
import OutboundCampaignParentsFilter from '../components/OutBoundCampaign/outboundparentfilter';


const header = [
  {
    id: "full_name",
    numeric: false,
    disablePadding: true,
    label: "Parents List",
    sort: true,
    width: 180,
  },
  {
    id: "serial_number",
    numeric: false,
    disablePadding: true,
    label: "Parents ID",
    sort: true,
    width: 180,
  },
  {
    id: "mobile",
    numeric: false,
    disablePadding: true,
    label: "Mobile number",
    sort: true,
    width: 180,
  },
  {
    id: "program_title",
    numeric: false,
    disablePadding: true,
    label: "Program Name",
    sort: true,
    width: 180,
  },
  {
    id: "program_unit_number",
    numeric: false,
    disablePadding: true,
    label: "Unit number",
    sort: true,
    width: 180,
  },
  {
    id: "program_unit_name",
    numeric: false,
    disablePadding: true,
    label: "Unit name",
    sort: true,
    width: 180,
  },
  {
    id: "assigned_district",
    numeric: false,
    disablePadding: true,
    label: "District",
    sort: true,
    width: 180,
  },
  {
    id: "assigned_block_zone",
    numeric: false,
    disablePadding: true,
    label: "Block/Zone",
    sort: true,
    width: 120,
  },
  {
    id: "assigned_panchayat_ward",
    numeric: false,
    disablePadding: true,
    label: "Panchayat/Ward",
    sort: true,
    width: 120,
  },
  {
    id: "assigned_village_area",
    numeric: false,
    disablePadding: true,
    label: "Village",
    sort: true,
    width: 120,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "Flow Status",
    sort: true,
    width: 120,
  },
]

export default function CampaignDetail() {
  const [page, setPage] = useState(1)
  const loader = useSelector((state) => state.outboundCampaign.OutboundCampaignListLoading);
  const OutboundParentspaginateInfo = useSelector(state => state.outboundCampaign.OutboundParentspaginateInfo)
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [searchText, setSearchText] = useState("")
  const [applyfilter, setApplyFilter] = useState(false);
  const params = useParams();
  const OutboundCampaignDetails = useSelector((state) => state.outboundCampaign.OutboundCampaignDetails)
  const [anchorEl, setAnchorEl] = useState(null);
  const [storeIds, setStoreIds] = useState({
    district_id: [],
    block_zone_id: [],
    panchayat_ward_id: [],
    village_area_id: []
  });

  useEffect(() => {
    dispatch(getOutboundCampaignDetails({ id: params?.id }))
  }, [])

  useEffect(() => {
    if (!searchText) {
      dispatch(getOutBoundCampaignParentsList({
        campaignId: params?.id,
        page: page, perPage: limitPerPage,
      })).then(resp => {
        formatForDisplay(resp.data)
      })
    } else {
      let timerId = setTimeout(() => {
        dispatch(getOutBoundCampaignParentsList({
          campaignId: params?.id,
          page: 1, perPage: limitPerPage, search: searchText,
        })
        ).then(resp => {
          formatForDisplay(resp?.data)
        })
      }, 1000)
      return () => clearTimeout(timerId)

    }
  }, [limitPerPage, page, searchText])


  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
      formatedRows.push({
        "full_name": item.full_name,
        "serial_number": item.serial_number,
        "mobile": item.mobile,
        "program_title": item.program_title,
        "program_unit_number": item.program_unit_number,
        "program_unit_name": item.program_unit_name,
        "assigned_district": item.assigned_district,
        "assigned_block_zone": item.assigned_block_zone,
        "assigned_panchayat_ward": item.assigned_panchayat_ward,
        "assigned_village_area": item.assigned_village_area,
        "status": item.status,
        "errorTitle": item.errorTitle
      })
    })
    setList(formatedRows)
  }


  const getContent = (title, desc) => {
    return (
      <div className="tw-flex tw-flex-col tw-gap-1">
        <span className='tw-text-xs tw-text-grey tw-block'>{title}</span>
        <span className="tw-text-sm tw-text-primaryText">{desc ? desc : "-"}</span>
      </div>
    )
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const onPageChange = (page) => {
    setPage(page)
  }

  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }

  return (
    <div className='tw-relative'>
      <div className="tw-flex tw-items-center tw-w-full tw-justify-between">
        <Link to="/outbound-ivrs" className='tw-flex tw-justify-center'>
          <ArrowBackIcon className="tw-text-grey" />
          <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal tw-text-nowrap tw-block">Outbound IVRS</span>
        </Link>
      </div>

      <div className="tw-pt-2">
        <h2 className="tw-text-secondaryText tw-font-bold tw-text-2xl">Campaign report</h2>
      </div>
      <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
        <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
          Campaign Details
        </Typography>
        <div className="tw-grid tw-grid-cols-3 tw-gap-x-10 tw-gap-y-6 tw-pt-6 tw-w-full">
          {getContent("Campaign Name", OutboundCampaignDetails?.title)}
          {getContent("Campaign Description", OutboundCampaignDetails?.description)}
          {getContent("Released On", OutboundCampaignDetails?.updatedAt)}
        </div>
        <div className="tw-grid tw-grid-cols-3 tw-gap-x-10 tw-gap-y-6 tw-pt-6 tw-w-full">
          {getContent("IVR ID", OutboundCampaignDetails?.ivrId)}
          {getContent("Tag", OutboundCampaignDetails?.tags)}
        </div>
      </div>
      <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
        <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">List of Parents</Typography>
        <div className='tw-flex tw-justify-between tw-items-center tw-w-full'>
          <span className='tw-text-sm tw-text-nowrap'>Total {OutboundParentspaginateInfo?.total}</span>
          <div className='tw-flex tw-gap-4 tw-justify-end tw-w-full'>
            <SearchBox placeholder="Search by Parent Name/ID/Phone Number" handleSearch={handleSearch} />
            <Button variant="outlined" className="uppercase" onClick={handleClick} endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>Filters</Button>
            <OutboundCampaignParentsFilter storeIds={storeIds} setStoreIds={setStoreIds} setPage={setPage} anchorEl={anchorEl} applyfilter={applyfilter} setApplyFilter={setApplyFilter} page={page} setAnchorEl={setAnchorEl} handleClose={handleClose} limitPerPage={limitPerPage} formatForDisplay={formatForDisplay} />
          </div>
        </div>
        {!loader ? (
          <>
            {list.length ? (
              <EnhancedTable paginate={OutboundParentspaginateInfo} scrollable
                actions={{ edit: true, preview: true }} columns={header}
                data={list} onPageChange={onPageChange} page={page} details={false} keyProp="uuid"
                setLimitPerPage={setLimitPerPage}
                limitPerPage={limitPerPage} setPage={setPage}
              />
            ) : (
              <div className='tw-p-6 tw-mt-5 tw-w-full tw-text-SecondaryTextColor  tw-font-normal tw-text-sm tw-text-center tw-rounded-lg'>
                <span>No Parents Found</span>
              </div>
            )}
          </>
        ) : (
          <div className='tw-text-center tw-py-5 tw-w-full'><CircularProgress /></div>
        )}
      </div>
    </div>
  );
}
