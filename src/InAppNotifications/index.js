import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { Button, Popover, TextField } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Container } from '../components/Container';
import TableMaster from '../components/Masters/TableMaster';
import SearchBox from '../components/SearchBox';
import filter_on from '../../public/assets/icons/filter_on.svg';
import dayjs from 'dayjs';
import { getNotificationList } from './duck/network';
import NotificationFilter from '../components/InappNotification/notificationfilter';
import { fillNotificationCampaignAddedUsers, setSelectedMember } from './duck/notificationSlice';

const header = [
	{
		id: 'englishTitle',
		numeric: false,
		disablePadding: true,
		label: 'Notification Title',
		sort: true,
		width: 200,
	},
	{
		id: 'englishDescription',
		numeric: false,
		disablePadding: true,
		label: 'Notification Description',
		sort: true,
		width: 200,
	},
	{
		id: 'tags',
		numeric: false,
		disablePadding: true,
		label: 'Tags',
		sort: true,
		width: 200,
	},
	{
		id: 'membersCount',
		numeric: false,
		disablePadding: true,
		label: 'No. of Members',
		sort: true,
		width: 200,
	},
	{
		id: 'releaseAt',
		numeric: false,
		disablePadding: true,
		label: 'Released on',
		sort: true,
		width: 200,
	},


];

export default React.memo(function InAppNotification() {
	const [permissions, setPermissions] = useState({});
	const [list, setList] = useState([]);
	const [page, setPage] = useState(1);
	const [limitPerPage, setLimitPerPage] = useState(10);
	const [anchorEl, setAnchorEl] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [applyfilter, setApplyFilter] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loader = useSelector((state) => state.notification.loading)
	const paginateInfo = useSelector((state) => state.notification.paginateInfo);
	const [storeTagValue, setStoreTagValue] = useState([]);
	const tagsValue = useSelector((state) => state.notification.tagsValue);
	const fromValue = useSelector((state) => state.notification.fromValue);
	const toValue = useSelector((state) => state.notification.toValue);

	useEffect(() => {
		if (!searchText) {
			dispatch(getNotificationList({
				page: page, perPage: limitPerPage,
				tags: tagsValue,
				startDate: fromValue,
				endDate: toValue
			})).then(resp => {
				formatForDisplay(resp.data)
			})
		} else {
			let timerId = setTimeout(() => {
				dispatch(getNotificationList({
					page: 1, perPage: limitPerPage, keyword: searchText,
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


	useEffect(() => {
		const userPermissions = JSON.parse(localStorage.getItem('permissions'));
		setPermissions(userPermissions['Team Members']);
	}, []);


	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const formatForDisplay = (data) => {
		const formatedRows = [];

		data?.length > 0 &&
			data?.forEach((item) => {
				formatedRows.push({
					id: item.id,
					englishTitle: item.englishTitle,
					englishDescription: item.englishDescription,
					tags: item.tags,
					membersCount: item.membersCount,
					releaseAt: dayjs(item.releaseAt).format("DD MMM, YYYY"),
				});
			});
		setList(formatedRows);
	};

	const handleSearch = (e) => {
		setSearchText(e.target.value);
	};

	const onNavigateDetails = (id) => {
		navigate(`/manual-in-app-notification/campaign-detail/${id}`);
	};

	const onPageChange = (page) => {
		setPage(page);

	};

	const AddNewNotification = () => {
		navigate("/manual-in-app-notification/create-notification")
		dispatch(fillNotificationCampaignAddedUsers({}))
		dispatch(setSelectedMember([]))
	};


	return (
		<div>
			<div className="tw-pb-3">
				<div className="tw-flex tw-justify-between">
					<div>
						<h2 className="tw-text-secondaryText tw-font-bold tw-text-2xl ">In-app Member Notification</h2>
					</div>
					<div className="tw-flex tw-gap-4">
						<SearchBox placeholder='Search by notification title' handleSearch={handleSearch} />
						<Button className="!tw-text-white !tw-bg-primary" onClick={AddNewNotification}>
							Add New Notifcation
						</Button>
					</div>
				</div>
			</div>
			<Container>
				<div className='tw-flex tw-justify-between tw-relative tw-items-center tw-pr-4'>
					<div className='tw-flex tw-gap-4 tw-justify-between tw-w-full'>
						<span className='tw-text-sm tw-text-nowrap tw-ml-4 tw-block'>Total {paginateInfo?.total}</span>
						<Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>Filters</Button>
						<NotificationFilter notification={true} storeTagValue={storeTagValue} setStoreTagValue={setStoreTagValue} setPage={setPage} anchorEl={anchorEl} applyfilter={applyfilter} setApplyFilter={setApplyFilter} page={page} setAnchorEl={setAnchorEl} handleClose={handleClose} limitPerPage={limitPerPage} formatForDisplay={formatForDisplay} />
					</div>
				</div>
				<div>
					{!loader ? (
						<>
							{list.length > 0 ? (
								<TableMaster
									scrollable
									actions={{ edit: true, preview: true }}
									columns={header}
									data={list}
									paginate={paginateInfo}
									onPageChange={onPageChange}
									page={page}
									details={true}
									onNavigateDetails={onNavigateDetails}
									keyProp={(item) => item?.id}
									setLimitPerPage={setLimitPerPage}
									limitPerPage={limitPerPage}
									setPage={setPage}
								/>
							) : (
								<div className="tw-p-6 tw-mt-5 tw-bg-[#FAFCFE] tw-text-SecondaryTextColor tw-font-normal tw-text-sm tw-text-center tw-rounded-lg">
									<span>No Data Found</span>
								</div>
							)}
						</>
					) : (
						<div className="tw-text-center tw-py-5">
							<CircularProgress />
						</div>
					)}
				</div>
			</Container>
		</div>
	);
});
