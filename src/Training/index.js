import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, InputAdornment, Paper, TextField, Typography, Popover } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ReplayIcon from '@mui/icons-material/Replay';

import filter_on from '../../public/assets/icons/filter_on.svg';
import { useDispatch } from 'react-redux';
import { getProgramCreatedBy, getProgramName, getProgramUnit, getTrainingList, getTrainingStatus } from './duck/network';
import { useSelector } from 'react-redux';
import EnhancedTable from '../components/Training/Table';
import { hideLoader, showLoader } from '../components/Loader/duck/loaderSlice';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import axiosInstance from '../config/Axios';
import { Dropdown } from '../components/Select';
import DropDownWithFilterCheck from '../components/Masters/DropDownWithFilterCheck';
import { getBlockNameList, getDistrictNameList, getPanchayatNameList, getVillageNameList } from '../Masters/Districts/duck/network';
import {  fillProgramFilterBlock, fillProgramFilterDistrict, fillProgramFilterPanchayat, fillProgramFilterStatus, fillProgramFilterVillage, setPaginationPage } from '../Programs/duck/programSlice';
import { BasicDatePicker } from '../components/DatePicker';
import { fillWhatsappEndDateValue, fillWhatsappStartDateValue } from '../ManualWhatsApp/duck/manualWhatsAppSlice';
import moment from 'moment';
import { fillTainingApplyFilter, filltrainingCreatedByVal, filltrainingProgramUnitVal, filltrainingProgramVal, filltrainingStatusVal } from './duck/trainingSlice';
import { useNavigate } from 'react-router-dom';

const header = [
	{
		id: 'trainingName',
		numeric: false,
		disablePadding: true,
		label: 'Name of the training',
		sort: true,
		width: 200,
	},
	{
		id: 'createdBy',
		numeric: false,
		disablePadding: true,
		label: 'Created by',
		sort: true,
		width: 200,
	},
	{
		id: 'totalCew',
		numeric: false,
		disablePadding: true,
		label: 'Total CEW',
		sort: true,
		width: 200,
	},
	{
		id: 'cewPresent',
		numeric: false,
		disablePadding: true,
		label: 'CEW Attendance (%}',
		sort: true,
		width: 200,
	},
	{
		id: 'programName',
		numeric: false,
		disablePadding: true,
		label: 'Program name',
		sort: true,
		width: 200,
	},
	{
		id: 'unitNumber',
		numeric: false,
		disablePadding: true,
		label: 'Unit number',
		sort: true,
		width: 200,
	},
	{
		id: 'unitName',
		numeric: false,
		disablePadding: true,
		label: 'Unit name',
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
		id: 'statusUpdatedOn',
		numeric: false,
		disablePadding: true,
		label: 'Status Updated On',
		sort: true,
		width: 200,
	},
];

function Training() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const trainingListData = useSelector((state) => state.training.trainingList);
	const listLoading = useSelector((state) => state.training.trainingListLoading);
	const paginateInfo = useSelector((state) => state.training.paginateInfo);
	const snycLoader = useSelector((state) => state.loader.openLoader);
	const trainingStatus = useSelector((state) => state.training.trainingStatus);
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

	const filterDistrict = useSelector((state) => state.program.programfilterDistrict);
	const filterVillage = useSelector((state) => state.program.programfilterVillage);
	const filterBlock = useSelector((state) => state.program.programfilterBlock);
	const filterPanchayat = useSelector((state) => state.program.programfilterPanchayat);
	const trainingCreatedBy = useSelector((state) => state.training.trainingCreatedBy);
	const trainingProgram = useSelector((state) => state.training.trainingProgram);
	const trainingProgramUnit = useSelector((state) => state.training.trainingProgramUnit);

	const applyFilter = useSelector((state) => state.training.applyFilter);
	const districtNameList = useSelector((state) => state.district.districtNameList);
	const blockNameList = useSelector((state) => state.district.blockNameList);
	const startDateValue = useSelector((state) => state.manualWhatsApp.startDateValue);
	const endDateValue = useSelector((state) => state.manualWhatsApp.endDateValue);
	const trainingStatusVal = useSelector((state) => state.training.trainingStatusVal);
	const trainingProgramVal = useSelector((state) => state.training.trainingProgramVal);
	const trainingProgramUnitVal = useSelector((state) => state.training.trainingProgramUnitVal);
	const filterStatus = useSelector((state) => state.training.trainingCreatedByVal);

	const [filterDataPopOver, setFilterDataPopOver] = useState({
		programName: trainingProgramVal,
		programUnitId: trainingProgramUnitVal,
		createdBy: filterStatus,
		startDate: startDateValue,
		endDate: endDateValue,
		status: trainingStatusVal,
	});
	
	useEffect(() => {
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
		dispatch(getTrainingStatus());
		dispatch(getProgramName());
		dispatch(getProgramCreatedBy());
	}, []);

	useEffect(() => {
		let timeoutId;

		if (!searchText) {
			if (applyFilter) {
				timeoutId = setTimeout(() => {
					dispatch(
						getTrainingList({
							page: page,
							perPage: limitPerPage,
							...filterDataPopOver,
						})
					);
				}, 100);
			} else {
				dispatch(getTrainingList({ page: page, perPage: limitPerPage }));
			}
		} else {
			timeoutId = setTimeout(() => {
				dispatch(
					getTrainingList({
						keyword: searchText,
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

	const handleManage = (id) => {
		navigate({ pathname: `/cew-training-details/${id}` });
	};


	const ResetFilter = () => {
		dispatch(filltrainingCreatedByVal(''));

		dispatch(filltrainingStatusVal(''));
		dispatch(fillWhatsappStartDateValue(null));
		dispatch(fillWhatsappEndDateValue(null));
		dispatch(filltrainingProgramVal(null));
		dispatch(filltrainingProgramUnitVal(null))
		setFilterDataPopOver({
			programName: "",
		programUnitId: "",
		createdBy: "",
		startDate: startDateValue,
		endDate: endDateValue,
		status: trainingStatusVal,
		});
		dispatch(fillTainingApplyFilter(false));
		setInputAdded(false);
		dispatch(getVillageNameList({ search: '' }));
		setAnchorEl(null);
		dispatch(
			getTrainingList({
				page: page,
				perPage: limitPerPage,
			})
		);
	};

	const ApplyFilter = () => {
		dispatch(fillTainingApplyFilter(true));

		setAnchorEl(null);
		dispatch(
			getTrainingList({
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
				programId: '',
				programUnitId: '',
				panchayatWardIds: '',
				villageAreaIds: '',
				createdBy: '',
				startDate: '',
				endDate: '',
				status: '',
			});
			setInputAdded(false);
			dispatch(fillProgramFilterDistrict(''));
			dispatch(fillProgramFilterBlock(''));
			dispatch(fillProgramFilterPanchayat(''));
			dispatch(fillProgramFilterVillage(''));
			dispatch(fillProgramFilterStatus(''));
			dispatch(fillWhatsappStartDateValue(null));
			dispatch(fillWhatsappEndDateValue(null));
			dispatch(fillWhatsappEndDateValue(null));
			dispatch(filltrainingStatusVal(null));
			dispatch(filltrainingCreatedByVal(null))

		}
		// dispatch(getUserRoleNameList());
		dispatch(getDistrictNameList());
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
		if (type === 'programName' && e) {
			dispatch(getProgramUnit({ programId: e }));
		
		}
	

		const typeToKey = {
			programName: 'programName',
			programUnitId: 'programUnitId',
			createdBy: 'createdBy',
			startDate: 'startDate',
			endDate: 'endDate',
			status: 'status',
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
					CEW Training
				</Typography>
				<div className="tw-flex tw-gap-6 tw-justify-between">
					<TextField
						size="small"
						type="search"
						placeholder="Search by Training Name"
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
					<div className="tw-px-4">{trainingListData?.length > 0 && <span className="tw-text-base   tw-text-[#666]">Total {paginateInfo?.total}</span>}</div>
					<div className="tw-pr-3  tw-flex tw-justify-end  tw-gap-4">
						<div className="tw-pr-3  tw-flex tw-justify-end  tw-gap-4">
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

								<div className="tw-flex tw-items-start tw-gap-6 tw-justify-between tw-w-[400px] ">
									<div className="tw-flex tw-w-full tw-flex-col tw-items-start tw-gap-4">
										<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
											<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Status</span>
											<div className="tw-flex tw-justify-between tw-items-center tw-pl-4 tw-w-[260px]">
												<Dropdown
													label="All Statuses"
													bgColor="rgba(255, 196, 12, 0.24)"
													value={filterDataPopOver?.status}
													onChange={(e) => {
														// onStatusChange(e);
														onChangeDropDownFilter(e, 'status');
														dispatch(filltrainingStatusVal(e));
													}}
													labelkey="label"
													valuekey="status"
													options={trainingStatus}
												/>
											</div>
										</div>

										<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
											<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Created By</span>
											<div className="tw-flex tw-justify-between tw-items-center tw-pl-4 tw-w-[260px]">
												<Dropdown
													label="Created By"
													bgColor="rgba(255, 196, 12, 0.24)"
													value={filterDataPopOver?.createdBy}
													onChange={(e) => {
														// onStatusChange(e);
														onChangeDropDownFilter(e, 'createdBy');
														dispatch(filltrainingCreatedByVal(e));
													}}
													labelkey="createdBy"
													valuekey="id"
													options={trainingCreatedBy}
												/>
											</div>
										</div>
										<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3 ">
											<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Program Name</span>
											<div className="tw-flex tw-justify-between tw-items-center tw-pl-4 tw-w-[260px]">
												<Dropdown
													label="Program Name"
													bgColor="rgba(255, 196, 12, 0.24)"
													value={filterDataPopOver?.programName}
													onChange={(e) => {
														// onStatusChange(e);
														onChangeDropDownFilter(e, 'programName');
														dispatch(filltrainingProgramVal(e));
													}}
													labelkey="title"
													valuekey="id"
													options={trainingProgram}

												/>
											</div>
										</div>
										<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3 ">
											<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Unit Number</span>
											<div className="tw-flex tw-justify-between tw-items-center tw-pl-4 tw-w-[260px]">
												<Dropdown
													label="Unit Number"
													bgColor="rgba(255, 196, 12, 0.24)"
													value={filterDataPopOver?.programUnitId}
													onChange={(e) => {
														// onStatusChange(e);
														onChangeDropDownFilter(e, 'programUnitId');
														dispatch(filltrainingProgramUnitVal(e));
													}}
													labelkey="unitNumber"
													valuekey="id"
													options={trainingProgramUnit}
													disabled={!trainingProgramVal}
												/>
											</div>
										</div>
										<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
											<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Start Date</span>
											<div className="tw-w-[230px]">
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
											<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">End Date</span>

											<div className="tw-w-[230px]">
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
							{trainingListData.length > 0 ? (
								<EnhancedTable
									scrollable
									columns={header}
									data={trainingListData}
									onPageChange={onPageChange}
									page={page}
									details={true}
									paginate={{ totalPages: paginateInfo.totalPages, page: page }}
									keyProp="uuid"
									setLimitPerPage={setLimitPerPage}
									limitPerPage={limitPerPage}
									handleManage={handleManage}
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

export default Training;
