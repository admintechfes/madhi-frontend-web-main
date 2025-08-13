import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import EnhancedTable from '../components/parents/Table';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material'
import SearchBox from '../components/SearchBox';
import { useDispatch, useSelector } from 'react-redux';
import FilterListIcon from '@mui/icons-material/FilterList';
import dayjs from 'dayjs';
import filter_on from '../../public/assets/icons/filter_on.svg';
import Filter from '../components/OutBoundCampaign/filter';
import { getOutBoundCampaignList } from './duck/network';
import { fillFormDataOutboundCampaign, fillOutboundCampaignAddedParents } from './duck/OutboundCampaignSlice';


const header = [
  {
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "Campaign Name",
    sort: true,
    width: 180,
  },
  {
    id: "ivrId",
    numeric: false,
    disablePadding: true,
    label: "IVR ID",
    sort: true,
    width: 180,
  },
  {
    id: "tags",
    numeric: false,
    disablePadding: true,
    label: "Tags",
    sort: true,
    width: 180,
  },
  {
    id: "parentCount",
    numeric: false,
    disablePadding: true,
    label: "Parents added",
    sort: true,
    width: 180,
  },
  {
    id: "updatedAt",
    numeric: false,
    disablePadding: true,
    label: "Released On",
    sort: true,
    width: 120,
  }
]


export default function Campaign() {
  const [page, setPage] = useState(1)
  const loader = useSelector((state) => state.outboundCampaign.OutboundCampaignListLoading);
  const paginateInfo = useSelector(state => state.outboundCampaign.paginateInfo)
  const [list, setList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [applyfilter, setApplyFilter] = useState(false);
  const [storeTagValue, setStoreTagValue] = useState([]);
  const tagsValue = useSelector((state) => state.outboundCampaign.tagsValue);
  const fromValue = useSelector((state) => state.outboundCampaign.fromValue);
  const toValue = useSelector((state) => state.outboundCampaign.toValue);
  const ivrValue = useSelector((state) => state.outboundCampaign.ivrValue);

  useEffect(() => {
    if (!searchText) {
      dispatch(getOutBoundCampaignList({
        page: page, perPage: limitPerPage,
        ivrId: ivrValue,
        tags: tagsValue,
        startDate: fromValue,
        endDate: toValue
      })).then(resp => {
        formatForDisplay(resp.data)
      })
    } else {
      let timerId = setTimeout(() => {
        dispatch(getOutBoundCampaignList({
          page: 1, perPage: limitPerPage, search: searchText,
          ivrId: ivrValue,
          tags: tagsValue,
          startDate: fromValue,
          endDate: toValue,
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
        "id": item.id,
        "title": item.title,
        "ivrId": item.ivrId,
        "tags": item.tags,
        "parentCount": item.parentCount,
        "updatedAt": dayjs(item.updatedAt).format("D MMM, YYYY")
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
    navigate({ pathname: `/outbound-ivrs/campaign-detail/${id}` })
  }

  const onPageChange = (page) => {
    setPage(page)
  }


  return (
    <Box>
      <div className="tw-flex tw-justify-between tw-px-3">
        <Typography variant="h3" className='!tw-font-semibold !tw-text-black'>Outbound IVRS Campaign</Typography>
        <div className='tw-flex tw-gap-6 tw-justify-between'>
          <SearchBox placeholder="Search by Campaign Name" handleSearch={handleSearch} />
          <div className='tw-flex tw-gap-x-5'>
            <Button variant="contained" onClick={() => {
              navigate('/outbound-ivrs/create-campaign')
              dispatch(fillOutboundCampaignAddedParents([]))
              dispatch(fillFormDataOutboundCampaign({}))
            }} className="uppercase">Add New Campaign</Button>
          </div>
        </div>
      </div>
      <Paper className='tw-w-full tw-bg-white tw-pt-6 tw-mt-6'>
        <div className='tw-flex tw-justify-between tw-relative tw-items-center tw-pr-4'>
          <div className='tw-flex tw-gap-4 tw-justify-between tw-w-full'>
            <span className='tw-text-sm tw-text-nowrap tw-ml-4 tw-block'>Total {paginateInfo?.total}</span>
            <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>Filters</Button>
            <Filter storeTagValue={storeTagValue} setStoreTagValue={setStoreTagValue} setPage={setPage} anchorEl={anchorEl} applyfilter={applyfilter} setApplyFilter={setApplyFilter} page={page} setAnchorEl={setAnchorEl} handleClose={handleClose} limitPerPage={limitPerPage} formatForDisplay={formatForDisplay} />
          </div>
        </div>
        <>
          {!loader ? (
            <>
              {list.length ? (
                <EnhancedTable paginate={paginateInfo} onNavigateDetails={onNavigateDetails} scrollable
                  actions={{ edit: true, preview: true }} columns={header}
                  data={list} onPageChange={onPageChange} page={page} details={true} keyProp="uuid"
                  setLimitPerPage={setLimitPerPage}
                  limitPerPage={limitPerPage} setPage={setPage}
                />
              ) : (
                <div className='tw-p-6 tw-mt-5 tw-bg-[#FAFCFE] tw-text-SecondaryTextColor  tw-font-normal tw-text-sm tw-text-center tw-rounded-lg'>
                  <span>No Campaign Found</span>
                </div>
              )}
            </>
          ) : (
            <div className='tw-text-center tw-py-5 tw-w-full'><CircularProgress /></div>
          )}
        </>
      </Paper>
    </Box>
  )
}

