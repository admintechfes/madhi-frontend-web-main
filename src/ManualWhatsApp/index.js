import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {  getTagNameList, getWhatsAppManualList } from './duck/network';
import { CircularProgress } from '@mui/material';
import { Button, Popover, TextField } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import {  fillAddedParents, fillApplyFilter, fillWhatsappEndDateValue, fillFilterData, fillPageNum, fillPerPageNum, fillWhatsappStartDateValue, fillTagsFilter } from './duck/manualWhatsAppSlice';
import { Container } from '../components/Container';
import TableMaster from '../components/Masters/TableMaster';
import SearchBox from '../components/SearchBox';
import filter_on from '../../public/assets/icons/filter_on.svg';
import ManualWhatsAppFilter from './ManualWhatsAppFilter';

export default React.memo(function ManualWhatsApp() {
	const [permissions, setPermissions] = useState({});
	const [list, setList] = useState([]);
	const pageNum = useSelector((state) => state.manualWhatsApp.pageNum);
	const [page, setPage] = useState(pageNum);
	const perPageNum = useSelector((state) => state.manualWhatsApp.perPageNum);
	const [limitPerPage, setLimitPerPage] = useState(perPageNum);
	const [anchorEl, setAnchorEl] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [loader2, setLoader2] = useState(true);
	const filterData = useSelector((state) => state.manualWhatsApp.filterData);
	const applyFilter = useSelector((state) => state.manualWhatsApp.applyFilter);
	const [applyfilter, setApplyFilter] = useState(false);
	const tagsFilter = useSelector((state) => state.manualWhatsApp.tagsFilter);
	const [storeTagValue, setStoreTagValue] = useState(tagsFilter);


	useEffect(() => {
		const userPermissions = JSON.parse(localStorage.getItem('permissions'));
		setPermissions(userPermissions['Team Members']);
	}, []);

	
	useEffect(() => {
		dispatch(getTagNameList());
	}, []);


	useEffect(() => {
		let timeoutId;

		if (!searchText) {
			if (applyFilter) {
				timeoutId = setTimeout(() => {
					dispatch(
						getWhatsAppManualList({
							page: page,
							perPage: limitPerPage,
							...filterData,
						})
					).then((resp) => {
						if (loader2) {
							setLoader2(true);
							setTimeout(() => {
								setLoader2(false);
							}, 100);
						}
						formatForDisplay(resp?.data);
					});
				}, 100);
			} else {
				timeoutId = setTimeout(() => {
					dispatch(
						getWhatsAppManualList({
							page: page,
							perPage: limitPerPage,
						})
					).then((resp) => {
						if (loader2) {
							setLoader2(true);
							setTimeout(() => {
								setLoader2(false);
							}, 100);
						}
						formatForDisplay(resp?.data);
					});
				}, 100);
			}
		} else {
			timeoutId = setTimeout(() => {
				dispatch(
					getWhatsAppManualList({
						page: 1,
						search: searchText,
						perPage: limitPerPage,
						...filterData,
					})
				).then((resp) => {
					formatForDisplay(resp?.data);
				});
			}, 100);
		}

		return () => clearTimeout(timeoutId);
	}, [limitPerPage, searchText,filterData]);



	const ResetFilter = () => {
		dispatch(fillTagsFilter([]));
		dispatch(fillFilterData({}))
		dispatch(fillWhatsappEndDateValue(null))
		dispatch(fillWhatsappStartDateValue(null))
		setStoreTagValue([]);
		setAnchorEl(null);
		setApplyFilter(false);
		dispatch(fillApplyFilter(false));
	};




	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loader = useSelector((state) => state.manualWhatsApp.loadingCamping);
	const paginateInfo = useSelector((state) => state.manualWhatsApp.paginateInfo);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const header = [
		{
			id: 'title',
			numeric: false,
			disablePadding: true,
			label: 'Campaign Name',
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
			id: 'glificFlowName',
			numeric: false,
			disablePadding: true,
			label: 'Flow Name',
			sort: true,
			width: 200,
		},
		{
			id: 'glificFlowId',
			numeric: false,
			disablePadding: true,
			label: 'Flow ID',
			sort: true,
			width: 250,
		},
		{
			id: 'parentCount',
			numeric: false,
			disablePadding: true,
			label: 'No of parents',
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


	const formatForDisplay = (data) => {
		const formatedRows = [];

		data?.length > 0 &&
			data?.forEach((item) => {
				formatedRows.push({
					id: item.id,
					title: item.title,
					tags: item.tags,
					glificFlowName: item.glificFlowName,
					glificFlowId: item.glificFlowId,
					parentCount: item.parentCount,
					releaseAt: item.releaseAt,

				});
			});
		setList(formatedRows);
	};

	const handleSearch = (e) => {
		setSearchText(e.target.value);
	};

	const onNavigateDetails = (id) => {
		navigate({ pathname: `/manual-whatsapp-details/${id}` });
	};

	const onPageChange = (page) => {
		setPage(page);
		dispatch(fillPageNum(page));

		dispatch(
			getWhatsAppManualList({
				page: page,
				perPage: limitPerPage,
				search: searchText,
				...filterData,
			})
		).then((resp) => {
			formatForDisplay(resp?.data);
		});
	};

	const AddNewTeamMember = () => {
		dispatch(fillAddedParents([]))
		navigate({ pathname: '/manual-whatsapp/add' });
	};


	return (
		<div>
			<div className="tw-pb-3">
				<div className="tw-flex tw-justify-between">
					<div>
						<h2 className="tw-text-secondaryText tw-font-bold tw-text-2xl ">Manual WhatsApp</h2>
					</div>
					<div className="tw-flex tw-gap-4">
						<SearchBox placeholder={'Search by Campaign Name'} handleSearch={handleSearch} />

						{permissions?.create && (
							<Button className="!tw-text-white !tw-bg-primary" onClick={AddNewTeamMember}>
								Add New Campaign
							</Button>
						)}
					</div>
				</div>
			</div>

			<Container>
				<div className="tw-px-3  tw-flex tw-justify-between  tw-gap-4 tw-relative">
				<div className=" tw-py-2">
						{paginateInfo?.total>0 && <span className="tw-text-base   tw-text-grey">Total {paginateInfo?.total}</span>}
					</div>
					<Button variant="outlined" onClick={handleClick} endIcon={!applyFilter ? <FilterListIcon className="tw-text-primary" /> : <img src={filter_on} />}>
						Filters
					</Button>
					<ManualWhatsAppFilter
						anchorEl={anchorEl}
						setAnchorEl={setAnchorEl}
						handleClose={handleClose}
						page={page}
						limitPerPage={limitPerPage}
						formatForDisplay={formatForDisplay}
						ResetFilter={ResetFilter}
						setApplyFilter={setApplyFilter}
						applyfilter={applyfilter}
						storeTagValue={storeTagValue}
						setStoreTagValue={setStoreTagValue}
						setPage={setPage}
					/>
		
				</div>
				<div>
					{!loader && !loader2 ? (
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
									dispatchperPage={fillPerPageNum}
								/>
							) : (
								<div className="tw-p-6 tw-mt-5 tw-bg-[#FAFCFE] tw-text-SecondaryTextColor tw-font-normal tw-text-sm tw-text-center tw-rounded-lg">
									<span>No Data Found. Click Add New Button to add a new campaign</span>
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
