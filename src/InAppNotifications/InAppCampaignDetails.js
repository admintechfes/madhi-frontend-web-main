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
import OutboundCampaignParentsFilter from '../components/OutBoundCampaign/outboundparentfilter';
import InAppMemberFilter from '../components/InappNotification/InAppMemberFilter';
import { getNotificationDetails, getNotificationMembersList } from './duck/network';
import dayjs from 'dayjs';


const header = [
  {
    id: "memberList",
    numeric: false,
    disablePadding: true,
    label: "Members List",
    sort: true,
    width: 180,
  },
  {
    id: "role",
    numeric: false,
    disablePadding: true,
    label: "Role",
    sort: true,
    width: 180,
  },
  {
    id: "district",
    numeric: false,
    disablePadding: true,
    label: "District",
    sort: true,
    width: 180,
  },
  {
    id: "blockZone",
    numeric: false,
    disablePadding: true,
    label: "Block/Zone",
    sort: true,
    width: 120,
  },
  {
    id: "panchyatWard",
    numeric: false,
    disablePadding: true,
    label: "Panchayat/Ward",
    sort: true,
    width: 120,
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
    id: "clickStatus",
    numeric: false,
    disablePadding: true,
    label: "Click Status",
    sort: true,
    width: 120,
  },
  {
    id: "clickedOn",
    numeric: false,
    disablePadding: true,
    label: "Clicked On",
    sort: true,
    width: 120,
  },
]

export default function InAppCampaignDetail() {
  const [page, setPage] = useState(1)
  const loading = useSelector(state => state.notification.loading)
  const notificationMemberPaginateInfo = useSelector(state => state.notification.notificationMemberPaginateInfo)
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [searchText, setSearchText] = useState("")
  const [applyfilter, setApplyFilter] = useState(false);
  const params = useParams();
  const notificationDetails = useSelector((state) => state.notification.notificationDetails)
  const [anchorEl, setAnchorEl] = useState(null);
  const [storeIds, setStoreIds] = useState({
    district_id: [],
    block_zone_id: [],
    panchayat_ward_id: [],
    village_area_id: []
  });

  useEffect(() => {
    dispatch(getNotificationDetails({ manualNotificationId: params?.id }))
  }, [])

  useEffect(() => {
    dispatch(getNotificationMembersList({
      manualNotificationId: params?.id,
      page: page, perPage: limitPerPage,
    })).then(resp => {
      formatForDisplay(resp.data)
    })
  }, [limitPerPage, page])


  const formatForDisplay = data => {
    const formatedRows = []
    data?.forEach((item, index) => {
      formatedRows.push({
        "memberList": item.memberList,
        "role": item.role,
        "district": item.district,
        "blockZone": item.blockZone,
        "panchyatWard": item.panchyatWard,
        "village": item.village,
        "clickStatus": item.clickStatus,
        "clickedOn": dayjs(item.clickedOn).format("D MMMM YYYY h:mm A"),
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

  return (
    <div className='tw-relative'>
      <div className="tw-flex tw-items-center tw-w-full tw-justify-between">
        <Link to="/manual-in-app-notification" className='tw-flex tw-justify-center'>
          <ArrowBackIcon className="tw-text-grey" />
          <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal tw-text-nowrap tw-block">In-app Member Notification </span>
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
          {getContent("Notification Title (English)", notificationDetails?.englishTitle)}
          {getContent("Notification Description (English)", notificationDetails?.englishDescription)}
        </div>
        <div className="tw-grid tw-grid-cols-3 tw-gap-x-10 tw-gap-y-6 tw-pt-6 tw-w-full">
          {getContent("Notification Title (Tamil)", notificationDetails?.tamilTitle)}
          {getContent("Notification Description (Tamil)", notificationDetails?.tamilDescription)}
        </div>

        <div className="tw-grid tw-grid-cols-3 tw-gap-x-10 tw-gap-y-6 tw-pt-6 tw-w-full">
          {getContent("Tag", notificationDetails?.tags)}
          {getContent("Released On", dayjs(notificationDetails?.updatedAt).format("MMMM D, YYYY h:mm A"))}
        </div>
      </div>
      <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
        <div className='tw-flex tw-gap-4 tw-justify-between tw-relative tw-w-full'>
          <span className='tw-text-sm tw-text-nowrap tw-block'>Total {notificationMemberPaginateInfo?.total}</span>
          <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>Filters</Button>
          <InAppMemberFilter storeIds={storeIds} setStoreIds={setStoreIds} setPage={setPage} anchorEl={anchorEl} applyfilter={applyfilter} setApplyFilter={setApplyFilter} page={page} setAnchorEl={setAnchorEl} handleClose={handleClose} limitPerPage={limitPerPage} formatForDisplay={formatForDisplay} />
        </div>
        {!loading ? (
          <>
            {list.length ? (
              <EnhancedTable paginate={notificationMemberPaginateInfo} scrollable
                actions={{ edit: true, preview: true }} columns={header}
                data={list} onPageChange={onPageChange} page={page} details={false} keyProp="uuid"
                setLimitPerPage={setLimitPerPage}
                limitPerPage={limitPerPage} setPage={setPage}
              />
            ) : (
              <div className='tw-p-6 tw-mt-5 tw-w-full tw-text-SecondaryTextColor  tw-font-normal tw-text-sm tw-text-center tw-rounded-lg'>
                <span>No Members Found</span>
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
