import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, InputAdornment, Paper, TextField, Typography, Popover } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ReplayIcon from '@mui/icons-material/Replay';

import filter_on from '../../public/assets/icons/filter_on.svg';
import { useDispatch } from 'react-redux';
import { getInboundList, getInboundStatus, getUserList, syncInboundList } from './duck/network';
import { useSelector } from 'react-redux';
import EnhancedTable from '../components/InboundIvrs/Table';
import { hideLoader, showLoader } from '../components/Loader/duck/loaderSlice';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import axiosInstance from '../config/Axios';
import { Dropdown } from '../components/Select';
import DropDownWithFilterCheck from '../components/Masters/DropDownWithFilterCheck';
import { getBlockNameList, getDistrictNameList, getPanchayatNameList, getVillageNameList } from '../Masters/Districts/duck/network';
import { fillProgramApplyFilter, fillProgramFilterBlock, fillProgramFilterDistrict, fillProgramFilterPanchayat, fillProgramFilterStatus, fillProgramFilterVillage, setPaginationPage } from '../Programs/duck/programSlice';
import { BasicDatePicker } from '../components/DatePicker';
import { fillWhatsappEndDateValue, fillWhatsappStartDateValue } from '../ManualWhatsApp/duck/manualWhatsAppSlice';
import moment from 'moment';
import { fillInboundCallerName, fillInboundCallerNameValue, fillInboundCallerRole, fillinboundStatusVal } from './duck/inboundSlice';

const header = [
	{
		id: 'caller_name',
		numeric: false,
		disablePadding: true,
		label: 'Caller Name',
		sort: true,
		width: 200,
	},
	{
		id: 'caller_type',
		numeric: false,
		disablePadding: true,
		label: 'Caller Type',
		sort: true,
		width: 200,
	},
	{
		id: 'parent_serial_number',
		numeric: false,
		disablePadding: true,
		label: 'Parent ID',
		sort: true,
		width: 200,
	},
	{
		id: 'call_from',
		numeric: false,
		disablePadding: true,
		label: 'Phone Number',
		sort: true,
		width: 200,
	},
	{
		id: 'assigned_district',
		numeric: false,
		disablePadding: true,
		label: 'District',
		sort: true,
		width: 200,
	},
	{
		id: 'assigned_block_zone',
		numeric: false,
		disablePadding: true,
		label: 'Block/Zone',
		sort: true,
		width: 200,
	},
	{
		id: 'assigned_panchayat_ward',
		numeric: false,
		disablePadding: true,
		label: 'Panchayat/Ward',
		sort: true,
		width: 200,
	},
	{
		id: 'assigned_village_area',
		numeric: false,
		disablePadding: true,
		label: 'Village/Area',
		sort: true,
		width: 200,
	},
	{
		id: 'calling_date',
		numeric: false,
		disablePadding: true,
		label: 'Calling Date',
		sort: true,
		width: 200,
	},
	{
		id: 'call_to',
		numeric: false,
		disablePadding: true,
		label: 'Called To',
		sort: true,
		width: 200,
	},
	{
		id: 'call_to_name',
		numeric: false,
		disablePadding: true,
		label: 'Called To Name',
		sort: true,
		width: 200,
	},
	{
		id: 'call_to_role',
		numeric: false,
		disablePadding: true,
		label: 'Called To Role',
		sort: true,
		width: 200,
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: true,
		label: 'Status',
		sort: true,
		width: 200,
	},
	{
		id: 'start_time',
		numeric: false,
		disablePadding: true,
		label: 'Call Start Time',
		sort: true,
		width: 200,
	},
	{
		id: 'end_time',
		numeric: false,
		disablePadding: true,
		label: 'Call End Time',
		sort: true,
		width: 200,
	},
	{
		id: 'duration',
		numeric: false,
		disablePadding: true,
		label: 'Duration',
		sort: true,
		width: 200,
	},
	{
		id: 'recording_url',
		numeric: false,
		disablePadding: true,
		label: 'Call Recording',
		sort: false,
		width: 150,
	},
];

function InboundIVRS() {
	const dispatch = useDispatch();
	const inboundListData = useSelector((state) => state.inboundIvrs.inboundList);
	const listLoading = useSelector((state) => state.inboundIvrs.inboundListLoading);
	const paginateInfo = useSelector((state) => state.inboundIvrs.paginateInfo);
	const snycLoader = useSelector((state) => state.loader.openLoader);
	const inboundStatus = useSelector((state) => state.inboundIvrs.inboundStatus);
	// const page = useSelector((state => state.program.paginationPage))

	const [page, setPage] = useState(1);
	const [limitPerPage, setLimitPerPage] = useState(10);
	const [searchText, setSearchText] = useState('');
	const [permissions, setPermissions] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [inputAdded, setInputAdded] = useState(false);
	const [callerTypeList, setCallerTypeList] = useState([
		{ label: 'Unknown', value: 'unknown' },
		{ label: 'Parent', value: 'parent' },
	]);
	const [callerRole, setCallerRole] = useState([
		{ label: 'CEW', value: 'CEW' },
		{ label: 'Supervisor', value: 'Supervisor' },
	]);

	const filterDistrict = useSelector((state) => state.program.programfilterDistrict);
	const filterVillage = useSelector((state) => state.program.programfilterVillage);
	const filterBlock = useSelector((state) => state.program.programfilterBlock);
	const filterPanchayat = useSelector((state) => state.program.programfilterPanchayat);
	const filterStatus = useSelector((state) => state.program.programfilterStatus);
	const applyFilter = useSelector((state) => state.program.applyFilter);
	const districtNameList = useSelector((state) => state.district.districtNameList);
	const blockNameList = useSelector((state) => state.district.blockNameList);
	const panchayatNameList = useSelector((state) => state.district.panchayatNameList);
	const villageNameList = useSelector((state) => state.district.villageNameList);
	const startDateValue = useSelector((state) => state.manualWhatsApp.startDateValue);
	const endDateValue = useSelector((state) => state.manualWhatsApp.endDateValue);
	const inboundStatusVal = useSelector((state) => state.inboundIvrs.inboundStatusVal);
	const inboundCallerNameValue= useSelector((state) => state.inboundIvrs.inboundCallerNameValue);
	const inboundCallerName= useSelector((state) => state.inboundIvrs.inboundCallerName);
	const inboundCallerRoleValue= useSelector((state) => state.inboundIvrs.inboundCallerRoleValue);
	const [filterDataPopOver, setFilterDataPopOver] = useState({
		districtIds: filterDistrict,
		villageAreaIds: filterVillage,
		blockZoneIds: filterBlock,
		panchayatWardIds: filterPanchayat,
		callerType: filterStatus,
		startDate: startDateValue,
		endDate: endDateValue,
		status: inboundStatusVal,
		teamMemberRole: inboundCallerRoleValue,
		teamMemberName: inboundCallerNameValue
	});

	useEffect(() => {
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
		dispatch(getInboundStatus());
	}, []);

	useEffect(() => {
		let timeoutId;

		if (!searchText) {
			if (applyFilter) {
				timeoutId = setTimeout(() => {
					dispatch(
						getInboundList({
							page: page,
							// status: programSelectedStatus,
							perPage: limitPerPage,
							...filterDataPopOver,
						})
					);
				}, 100);
			} else {
				dispatch(getInboundList({ page: page, perPage: limitPerPage }));
			}
		} else {
			timeoutId = setTimeout(() => {
				dispatch(
					getInboundList({
						search: searchText,
						page: 1,
						perPage: limitPerPage,
					})
				);
			}, 500);
		}

		return () => clearTimeout(timeoutId);
	}, [searchText, page, limitPerPage]);

	const handleSearch = (e) => {
		setSearchText(e.target.value);
	};

	const onPageChange = (page) => {
		setPage(page);
	};

	const handleSync = () => {
		dispatch(showLoader());
		dispatch(syncInboundList()).then((res) => {
			if (res?.data.statusCode == 200) toast.info(res.data.userMessageTitle);
			dispatch(hideLoader());
		});
	};

	const ExportData = async () => {
		const url = `v1/communications/campaigns/inbound-ivrs/export`;
		try {
			setIsLoading(true);
			const response = await axiosInstance.post(url, {}, { responseType: 'blob' });
			setIsLoading(false);
			const blob = new Blob([response.data], { type: response.headers['content-type'] });
			const downloadUrl = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = downloadUrl;
			a.download = `inboundIvrs-${dayjs(new Date()).format('DD-MM-YYYY')}.xlsx`; // Adjust the file name and extension as needed
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(downloadUrl);
			return response;
		} catch (err) {
			toast.error(err?.response?.statusText);
			setIsLoading(false);
			return err.response;
		}
	};

	const handleSearchDrop = (txt, type) => {
		if (type == 'district') {
			dispatch(getDistrictNameList(txt));
		}

		if (type === 'blockZoneIds') {
			dispatch(getBlockNameList({ search: txt, districtIds: filterDataPopOver.districtIds }));
		}

		if (type === 'panchayatWardIds') {
			dispatch(getPanchayatNameList({ search: txt, blockZoneIds: filterDataPopOver.blockZoneIds }));
		}

		if (type === 'villageAreaIds') {
			dispatch(getVillageNameList({ search: txt, panchayatWardIds: filterDataPopOver.panchayatWardIds }));
		}

		if (type === 'programSelectedStatus') {
			// dispatch(getVillageNameList());
		}
	};

	const ResetFilter = () => {
		dispatch(fillProgramFilterDistrict(''));
		dispatch(fillProgramFilterBlock(''));
		dispatch(fillProgramFilterPanchayat(''));
		dispatch(fillProgramFilterVillage(''));
		dispatch(fillProgramFilterStatus(''));
		dispatch(fillWhatsappStartDateValue(null));
		dispatch(fillWhatsappEndDateValue(null));
		dispatch(fillinboundStatusVal(null));
		dispatch(fillInboundCallerNameValue(""));
		dispatch(fillInboundCallerRole(null));
		setFilterDataPopOver({
			districtIds: '',
			blockZoneIds: '',
			panchayatWardIds: '',
			villageAreaIds: '',
			callerType: '',
			startDate: '',
			endDate: '',
			status: '',
			teamMemberRole:'',
			teamMemberName:''
		});
		dispatch(fillProgramApplyFilter(false));
		setInputAdded(false);
		dispatch(getVillageNameList({ search: '' }));
		setAnchorEl(null);
		dispatch(
			getInboundList({
				page: page,
				perPage: limitPerPage,
			})
		);
	};

	const ApplyFilter = () => {
		dispatch(fillProgramApplyFilter(true));

		setAnchorEl(null);
		dispatch(
			getInboundList({
				page: 1,
				perPage: limitPerPage,
				...filterDataPopOver,
			})
		);
		setPage(1);
		// dispatch(setPaginationPage(1))
	};

	// const handleClick = (event) => {
	// 	setAnchorEl(event.currentTarget);
	// };

	const handleClick = (event) => {
		if (!applyFilter) {
			setFilterDataPopOver({
				districtIds: '',
				blockZoneIds: '',
				panchayatWardIds: '',
				villageAreaIds: '',
				callerType: '',
				startDate: '',
				endDate: '',
				status: '',
				teamMemberRole:'',
				teamMemberName:''
			});
			setInputAdded(false);
			dispatch(fillProgramFilterDistrict(''));
			dispatch(fillProgramFilterBlock(''));
			dispatch(fillProgramFilterPanchayat(''));
			dispatch(fillProgramFilterVillage(''));
			dispatch(fillProgramFilterStatus(''));
			dispatch(fillWhatsappStartDateValue(null));
			dispatch(fillWhatsappEndDateValue(null));
			dispatch(fillinboundStatusVal(null));
			dispatch(fillInboundCallerRole(null));
			dispatch(fillInboundCallerNameValue(null))
		}
		// dispatch(getUserRoleNameList());
		dispatch(getDistrictNameList());
		dispatch(getUserList())
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const onChangeDropDownFilter = (e, type) => {
		const updateFilterData = (key, value) => {
			if (value !== '') {
				setFilterDataPopOver({ ...filterDataPopOver, [key]: value });
				setInputAdded(true);
			}
		};
		if (type === 'districtIds' && e) {
			dispatch(getBlockNameList({ districtIds: e }));
			// setFilterDataPopOver((prev) => ({ ...prev, blockZoneIds: [] }))
			if (e.length < filterDistrict.length) {
				dispatch(fillProgramFilterBlock([]));
				dispatch(fillProgramFilterPanchayat([]));
				dispatch(fillProgramFilterVillage([]));
			}
		}
		if (type === 'blockZoneIds' && e) {
			dispatch(getPanchayatNameList({ blockZoneIds: e }));
			if (e.length < filterBlock.length) {
				dispatch(fillProgramFilterPanchayat([]));
				dispatch(fillProgramFilterVillage([]));
			}
		}
		if (type === 'panchayatWardIds' && e) {
			dispatch(getVillageNameList({ panchayatWardIds: e }));
			if (e.length < filterPanchayat.length) {
				dispatch(fillProgramFilterVillage([]));
			}
		}

		const typeToKey = {
			districtIds: 'districtIds',
			blockZoneIds: 'blockZoneIds',
			panchayatWardIds: 'panchayatWardIds',
			villageAreaIds: 'villageAreaIds',
			callerType: 'callerType',
			startDate: 'startDate',
			endDate: 'endDate',
			status: 'status',
			teamMemberRole: 'teamMemberRole',
			teamMemberName:'teamMemberName'
		};

		const key = typeToKey[type];
		if (key) {
			updateFilterData(key, e);
		}
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	return (
		<Box>
			<div className="tw-flex tw-justify-between">
				<Typography variant="h3" className="!tw-font-semibold">
					Inbound IVRS
				</Typography>
				<div className="tw-flex tw-gap-6 tw-justify-between">
					<TextField
						size="small"
						type="search"
						placeholder="Search by Parent Name / ID / Phone Number"
						onChange={handleSearch}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon className="tw-text-[#DEDEDE]" />
								</InputAdornment>
							),
						}}
						className="tw-w-[400px]"
					/>
				</div>
			</div>
			<Paper className="tw-w-full tw-pt-6 tw-mt-6">
				<div className="tw-flex tw-justify-between">
					<div className="tw-px-4">{inboundListData?.length > 0 && <span className="tw-text-base   tw-text-[#666]">Total {paginateInfo?.total}</span>}</div>
					<div className="tw-pr-3  tw-flex tw-justify-end  tw-gap-4">
						<LoadingButton loading={snycLoader} onClick={handleSync} variant="contained" className="!tw-bg-[#FFC40C0D] !tw-text-secondary !tw-shadow-sm" endIcon={<ReplayIcon className="tw-text-primary" />}>
							Sync New Records
						</LoadingButton>

						{/* <LoadingButton loading={isLoading} variant="outlined" onClick={ExportData}>
	Export
</LoadingButton> */}

						<div className="tw-pr-3  tw-flex tw-justify-end  tw-gap-4">
							{/* <Button aria-describedby={id} variant="contained" onClick={handleClick}>
Open Popover
</Button> */}

							<Button variant="outlined" onClick={handleClick} endIcon={!applyFilter ? <FilterListIcon className="tw-text-primary" /> : <img src={filter_on} />}>
								Filters
							</Button>
							<Popover
								id={id}
								open={open}
								sx={{
									'& .MuiPaper-root': {
										padding: '16px',
										overflow: 'visible',
									},
								}}
								anchorEl={anchorEl}
								onClose={handleClose}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'left',
								}}
							>
								<div className="tw-flex tw-justify-between tw-w-full tw-pb-5 ">
									<div>
										<h2 className="tw-text-2xl tw-text-secondaryText tw-font-bold">Filters</h2>
									</div>
									<div onClick={handleClose} className="tw-cursor-pointer ">
										<CloseIcon />
									</div>
								</div>

								<div className="tw-flex tw-items-start tw-gap-6 tw-justify-between tw-w-[720px] ">
									<div className="tw-flex tw-w-full tw-flex-col tw-items-start tw-gap-4">
										<div className="tw-w-full tw-flex tw-flex-col tw-gap-5">
											<div className="tw-text-lg tw-text-secondaryText tw-font-semibold">Caller Details</div>
											<div className="tw-flex tw-gap-3 tw-justify-between tw-self-stretch">
												<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
													<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-[150px]">Caller Type</span>
													<div className="tw-flex tw-justify-between tw-items-center tw-min-w-[180px] tw-grow">
														<Dropdown
															label="Caller Type"
															bgColor="rgba(255, 196, 12, 0.24)"
															value={filterDataPopOver?.callerType}
															onChange={(e) => {
																// onStatusChange(e);
																onChangeDropDownFilter(e, 'callerType');
																dispatch(fillProgramFilterStatus(e));
															}}
															labelkey="label"
															valuekey="value"
															options={callerTypeList}
														/>
													</div>
												</div>
												<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
													<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-[150px]">Status</span>
													<div className="tw-flex tw-justify-between tw-items-center tw-min-w-[180px] tw-grow">
														<Dropdown
															label="All Statuses"
															bgColor="rgba(255, 196, 12, 0.24)"
															value={filterDataPopOver?.status}
															onChange={(e) => {
																// onStatusChange(e);
																onChangeDropDownFilter(e, 'status');
																dispatch(fillinboundStatusVal(e));
															}}
															labelkey="label"
															valuekey="contentType"
															options={inboundStatus}
														/>
													</div>
												</div>
											</div>
											<div className="tw-flex tw-gap-3 tw-justify-between tw-self-stretch">
												<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
													<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-[150px]">Call To Name</span>
													<div className="tw-flex tw-justify-between tw-items-center tw-min-w-[180px] tw-grow">
														<Dropdown
															label="Call To Name"
															bgColor="rgba(255, 196, 12, 0.24)"
															value={filterDataPopOver?.teamMemberName}
															onChange={(e) => {
																// onStatusChange(e);
																onChangeDropDownFilter(e, 'teamMemberName');
																dispatch(fillInboundCallerNameValue(e));
															}}
															labelkey="full_name"
															valuekey="full_name"
															options={inboundCallerName}
														/>
													</div>
												</div>
												<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
													<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-[150px]">Call To Role</span>
													<div className="tw-flex tw-justify-between tw-items-center tw-min-w-[180px] tw-grow">
														<Dropdown
															label="Call To Role"
															bgColor="rgba(255, 196, 12, 0.24)"
															value={filterDataPopOver?.teamMemberRole}
															onChange={(e) => {
																// onStatusChange(e);
																onChangeDropDownFilter(e, 'teamMemberRole');
																dispatch(fillInboundCallerRole(e));
															}}
															labelkey="label"
															valuekey="value"
															options={callerRole}
														/>
													</div>
												</div>
											</div>
										</div>
										<div className="tw-w-full tw-flex tw-flex-col tw-gap-5">
											<div className="tw-text-lg tw-text-secondaryText tw-font-semibold">Location</div>
											<div className="tw-flex tw-gap-3 tw-justify-between tw-self-stretch">
												<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3 ">
													<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-[150px]">Select District</span>
													<div className="tw-flex tw-justify-between tw-items-center tw-min-w-[180px] !tw-grow">
														<DropDownWithFilterCheck
															options={districtNameList}
															valuekey="district_id"
															labelkey="name"
															label="Select District"
															listSearch={getDistrictNameList}
															searchText={(txt) => handleSearchDrop(txt, 'district')}
															onChange={(e) => {
																onChangeDropDownFilter(e, 'districtIds');
																dispatch(fillProgramFilterDistrict(e));
															}}
															value={filterDistrict}
															fullWidth
															// style={{ maxWidth: '300px' }}
															// selectWidth={"300px"}
														/>
													</div>
												</div>
												<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3 ">
													<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-[150px]">Select Block/Zone</span>
													<div className="tw-flex tw-justify-between tw-items-center tw-min-w-[180px] tw-grow">
														<DropDownWithFilterCheck
															options={blockNameList}
															valuekey="block_zone_id"
															labelkey="name"
															label="Select Block/Zone"
															listSearch={getBlockNameList}
															searchText={(txt) => handleSearchDrop(txt, 'blockZoneIds')}
															onChange={(e) => {
																onChangeDropDownFilter(e, 'blockZoneIds');
																dispatch(fillProgramFilterBlock(e));
															}}
															value={filterBlock}
															fullWidth
															disabled={filterDistrict.length === 0}
														/>
													</div>
												</div>
											</div>
											<div className="tw-flex tw-gap-3 tw-justify-between tw-self-stretch">
												<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3 ">
													<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-[150px]">Select Panchayat/Ward</span>
													<div className="tw-flex tw-justify-between tw-items-center tw-min-w-[180px] tw-grow">
														<DropDownWithFilterCheck
															options={panchayatNameList}
															valuekey="panchayat_ward_id"
															labelkey="name"
															label="Select Panchayat/Ward"
															listSearch={getDistrictNameList}
															searchText={(txt) => handleSearchDrop(txt, 'panchayatWardIds')}
															onChange={(e) => {
																onChangeDropDownFilter(e, 'panchayatWardIds');
																dispatch(fillProgramFilterPanchayat(e));
															}}
															value={filterPanchayat}
															fullWidth
															disabled={filterBlock.length === 0}
														/>
													</div>
												</div>
												<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
													<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-[150px]">Select Village/Area</span>
													<div className="tw-flex tw-justify-between tw-items-center tw-min-w-[180px] tw-grow">
														<DropDownWithFilterCheck
															options={villageNameList}
															valuekey="village_area_id"
															labelkey="name"
															label="Select Village/Area"
															listSearch={getDistrictNameList}
															searchText={(txt) => handleSearchDrop(txt, 'villageAreaIds')}
															onChange={(e) => {
																onChangeDropDownFilter(e, 'villageAreaIds');
																dispatch(fillProgramFilterVillage(e));
															}}
															value={filterVillage}
															disabled={filterPanchayat.length === 0}
															fullWidth
														/>
													</div>
												</div>
											</div>
										</div>
										<div className="tw-w-full tw-flex tw-flex-col tw-gap-5">
											<div className="tw-text-lg tw-text-secondaryText tw-font-semibold">Date range</div>
											<div className="tw-flex tw-gap-3 tw-justify-between tw-self-stretch">
												<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
													<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-[150px]">Start Date</span>
													<div className="tw-flex tw-justify-between tw-items-center tw-grow tw-w-[180px]">
														<BasicDatePicker
															inputFormat="DD-MM-YYYY"
															value={startDateValue}
															onChange={(newValue) => {
																if (newValue) {
																	moment(newValue).format('YYYY-MM-DD');
																	onChangeDropDownFilter(moment(newValue).format('YYYY-MM-DD'), 'startDate');
																	dispatch(fillWhatsappStartDateValue(moment(newValue).format('YYYY-MM-DD')));
																} else {
																	dispatch(fillWhatsappStartDateValue(null));
																}
															}}
															label="Date"
														/>
													</div>
												</div>
												<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
													<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-[150px]">End Date</span>

													<div className="tw-flex tw-justify-between tw-items-center tw-grow tw-w-[180px]">
														<BasicDatePicker
															inputFormat="DD-MM-YYYY"
															value={endDateValue}
															minDate={startDateValue}
															onChange={(newValue) => {
																if (newValue) {
																	moment(newValue).format('YYYY-MM-DD');
																	onChangeDropDownFilter(moment(newValue).format('YYYY-MM-DD'), 'endDate');
																	dispatch(fillWhatsappEndDateValue(moment(newValue).format('YYYY-MM-DD')));
																} else {
																	dispatch(fillWhatsappEndDateValue(null));
																}
															}}
															label="Date"
														/>
													</div>
												</div>
											</div>
										</div>

										<div className="tw-flex tw-justify-end  tw-self-stretch tw-gap-3 tw-pt-4">
											<Button
												variant={!inputAdded && !applyFilter ? 'contained' : 'outlined'}
												onClick={ResetFilter}
												disabled={!inputAdded && !applyFilter}
												className={`${!inputAdded && !applyFilter ? 'uppercase !tw-bg-[#FAFAFA] tw-w-[55%] !tw-text-grey !tw-shadow-none' : 'uppercase tw-w-[55%] !tw-shadow-none`'}`}
											>
												Reset Filters
											</Button>
											<Button variant="contained" onClick={ApplyFilter} disabled={!inputAdded && !applyFilter} className="uppercase tw-w-[55%] !tw-shadow-none">
												Apply
											</Button>
										</div>
									</div>
								</div>
							</Popover>
						</div>
					</div>
				</div>

				<>
					{!listLoading ? (
						<>
							{inboundListData.length > 0 ? (
								<EnhancedTable
									scrollable
									columns={header}
									data={inboundListData}
									onPageChange={onPageChange}
									page={page}
									details={true}
									paginate={{ totalPages: paginateInfo.totalPages, page: page }}
									keyProp="uuid"
									setLimitPerPage={setLimitPerPage}
									limitPerPage={limitPerPage}
								/>
							) : (
								<div className="tw-p-6 tw-mt-5 tw-bg-[#FAFCFE] tw-text-SecondaryTextColor  tw-font-normal tw-text-sm tw-text-center tw-rounded-lg">
									<span>No Data Found</span>
								</div>
							)}
						</>
					) : (
						<div className="tw-text-center tw-py-5">{<CircularProgress />}</div>
					)}
				</>
			</Paper>
		</Box>
	);
}

export default InboundIVRS;
