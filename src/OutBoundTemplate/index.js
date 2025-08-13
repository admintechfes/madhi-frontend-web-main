import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import EnhancedTable from '../components/parents/Table';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material'
import SearchBox from '../components/SearchBox';
import { useDispatch, useSelector } from 'react-redux';
import FilterListIcon from '@mui/icons-material/FilterList';
import dayjs from 'dayjs';
import filter_on from '../../public/assets/icons/filter_on.svg';
import Filter from '../components/OutBoundTemplate/filter';


const header = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Template Name",
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
    id: "updatedOn",
    numeric: false,
    disablePadding: true,
    label: "Release on",
    sort: true,
    width: 120,
  }
]

const NewData = [
  {
    name: "Greetings",
    tags: ["Festivity", "Maths", "Workshop reminder"],
    updatedOn: "12 Mar, 2024",
  }
]

export default function Template() {
  const [page, setPage] = useState(1)
  const loader = false;
  const paginateInfo = useSelector(state => state.parents.paginateInfo)
  const [list, setList] = useState(NewData);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [applyfilter, setApplyFilter] = useState(false);
  const [storeTagValue, setStoreTagValue] = useState([])

  useEffect(() => {
    // if (!searchText) {
    //   dispatch(getParentsList({
    //     page: page, per_page: limitPerPage,
    //   })).then(resp => {
    //     formatForDisplay(resp.data)
    //   })
    // } else {
    //   let timerId = setTimeout(() => {
    //     dispatch(getParentsList({
    //       page: 1, per_page: limitPerPage, search: searchText,
    //     })
    //     ).then(resp => {
    //       formatForDisplay(resp?.data)
    //     })
    //   }, 1000)
    //   return () => clearTimeout(timerId)

    // }
  }, [limitPerPage, searchText])


  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
      formatedRows.push({
        "name": item.name,
        "tags": item.tags,
        "updatedOn": dayjs(item.updatedOn).format("D MMM, YYYY")
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

  const onNavigateDetails = () => {
    navigate({ pathname: `/outbound/template-detail` })
  }

  const onPageChange = (page) => {
    setPage(page)
  }


  return (
    <Box>
      <div className="tw-flex tw-justify-between tw-px-3">
        <Typography variant="h3" className='!tw-font-semibold !tw-text-black'>Outbound IVRS</Typography>
        <div className='tw-flex tw-gap-6 tw-justify-between'>
          <SearchBox placeholder="Search by Template name" handleSearch={handleSearch} />
          <div className='tw-flex tw-gap-x-5'>
            <Button variant="contained" onClick={() => navigate('/parents/create-parent')} className="uppercase">Add Template</Button>
          </div>
        </div>
      </div>
      <Paper className='tw-w-full tw-bg-white tw-pt-6 tw-mt-6'>
        <div className='tw-flex tw-justify-between tw-relative tw-items-center tw-pr-4'>
          <div className='tw-flex tw-gap-4 tw-justify-end tw-w-full'>
            <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>Filters</Button>
            <Filter storeTagValue={storeTagValue} setStoreTagValue={setStoreTagValue} anchorEl={anchorEl} applyfilter={applyfilter} setApplyFilter={setApplyFilter} page={page} setAnchorEl={setAnchorEl} handleClose={handleClose} limitPerPage={limitPerPage} formatForDisplay={formatForDisplay} />
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
                  <span>No Template Found</span>
                </div>
              )}
            </>
          ) : (
            <div className='tw-text-center tw-py-5'><CircularProgress /></div>
          )}
        </>
      </Paper>
    </Box>
  )
}

