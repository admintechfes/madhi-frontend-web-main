import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, InputAdornment, Paper, TextField, Typography, Popover } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ReplayIcon from '@mui/icons-material/Replay';
import { fillWhatsappEndDateValue, fillWhatsappStartDateValue } from '../../ManualWhatsApp/duck/manualWhatsAppSlice';
import filter_on from '../../../public/assets/icons/filter_on.svg';
import { useDispatch } from 'react-redux';
import { getCEWAttendance, getTrainingAttendeesList, getTrainingStatus } from '../duck/network';
import { useSelector } from 'react-redux';
import EnhancedTable from '../../components/TrainingAttendees/Table';
import { hideLoader, showLoader } from '../../components/Loader/duck/loaderSlice';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import axiosInstance from '../../config/Axios';
import { Dropdown } from '../../components/Select';
import DropDownWithFilterCheck from '../../components/Masters/DropDownWithFilterCheck';
import { getBlockNameList, getDistrictNameList, getPanchayatNameList, getVillageNameList } from '../../Masters/Districts/duck/network';
import {
	fillProgramApplyFilter,
	fillProgramFilterBlock,
	fillProgramFilterDistrict,
	fillProgramFilterPanchayat,
	fillProgramFilterStatus,
	fillProgramFilterVillage,
	setPaginationPage,
} from '../../Programs/duck/programSlice';
import { BasicDatePicker } from '../../components/DatePicker';
import moment from 'moment';
import { fillTainingDetailsApplyFilter, fillTainingDetailsStatusFilter, filltrainingAttendanceByVal, filltrainingStatusVal } from '../duck/trainingSlice';

const header = [
	{
		id: 'cewList',
		numeric: false,
		disablePadding: true,
		label: 'CEW List',
		sort: true,
		width: 200,
	},
	{
		id: 'district',
		numeric: false,
		disablePadding: true,
		label: 'District',
		sort: true,
		width: 200,
	},
	{
		id: 'blockZone',
		numeric: false,
		disablePadding: true,
		label: 'Block/Zone',
		sort: true,
		width: 200,
	},
	{
		id: 'panchyatWard',
		numeric: false,
		disablePadding: true,
		label: 'Panchayat/Ward',
		sort: true,
		width: 200,
	},
	{
		id: 'village',
		numeric: false,
		disablePadding: true,
		label: 'Village',
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

function TrainingAttendees(props) {
	const dispatch = useDispatch();
	const trainingAttendeesListData = useSelector((state) => state.training.trainingAttendeesList);
	const listLoading = useSelector((state) => state.training.trainingAttendeesListLoading);
	const attendeesPaginateInfo = useSelector((state) => state.training.attendeesPaginateInfo);
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

	const filterDistrict = useSelector((state) => state.program.programfilterDistrict) || [];
	const filterVillage = useSelector((state) => state.program.programfilterVillage) || [];
	const filterBlock = useSelector((state) => state.program.programfilterBlock) || [];
	const filterPanchayat = useSelector((state) => state.program.programfilterPanchayat) || [];
	const applyFilter = useSelector((state) => state.training.applyFilterTrainingDetail);
	const districtNameList = useSelector((state) => state.district.districtNameList);
	const blockNameList = useSelector((state) => state.district.blockNameList);
	const panchayatNameList = useSelector((state) => state.district.panchayatNameList);
	const villageNameList = useSelector((state) => state.district.villageNameList);
	const trainingStatusVal = useSelector((state) => state.training.trainingDetailStatus);
	const attendanceFilter = useSelector((state) => state.training.attendanceFilter);

	const [filterDataPopOver, setFilterDataPopOver] = useState({
		status: '',
		districtIds: filterDistrict,
		villageAreaIds: filterVillage,
		blockZoneIds: filterBlock,
		panchayatWardIds: filterPanchayat,
	});
	
	useEffect(() => {
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
		dispatch(getCEWAttendance());
	}, []);

	useEffect(() => {
		let timeoutId;

		if (!searchText) {
			if (applyFilter) {
				timeoutId = setTimeout(() => {
					dispatch(
						getTrainingAttendeesList({
							trainingId: props.trainingId,
							page: page,
							// status: programSelectedStatus,
							perPage: limitPerPage,
							trainingId: props.trainingId,
							...filterDataPopOver,
						})
					);
				}, 100);
			} else {
				dispatch(getTrainingAttendeesList({ page: page, perPage: limitPerPage, trainingId: props.trainingId }));
			}
		} else {
			timeoutId = setTimeout(() => {
				dispatch(
					getTrainingAttendeesList({
						search: searchText,
						page: 1,
						perPage: limitPerPage,
						trainingId: props.trainingId,
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

	const handleSearchDrop = (txt, type) => {
		if (type == 'district' && txt.trim() !== '') {
			dispatch(getDistrictNameList(txt));
		}

		if (type === 'blockZoneIds' && txt.trim() !== '') {
			dispatch(getBlockNameList({ search: txt, districtIds: filterDataPopOver.districtIds }));
		}

		if (type === 'panchayatWardIds' && txt.trim() !== '') {
			dispatch(getPanchayatNameList({ search: txt, blockZoneIds: filterDataPopOver.blockZoneIds }));
		}

		if (type === 'villageAreaIds' && txt.trim() !== '') {
			dispatch(getVillageNameList({ search: txt, panchayatWardIds: filterDataPopOver.panchayatWardIds }));
		}

		if (type === 'programSelectedStatus') {
			// dispatch(getVillageNameList());
		}
	};

	const ResetFilter = () => {
		dispatch(fillProgramFilterDistrict([]));
		dispatch(fillProgramFilterBlock([]));
		dispatch(fillProgramFilterPanchayat([]));
		dispatch(fillProgramFilterVillage([]));
		dispatch(fillTainingDetailsStatusFilter(null));
		setFilterDataPopOver({
			districtIds: [],
			blockZoneIds: [],
			panchayatWardIds: [],
			villageAreaIds: [],
			status: '',
		});
		dispatch(fillTainingDetailsApplyFilter(false));
		setInputAdded(false);
		dispatch(getVillageNameList({ search: '' }));
		setAnchorEl(null);
		dispatch(
			getTrainingAttendeesList({
				page: page,
				perPage: limitPerPage,
				trainingId: props.trainingId,
			})
		);
	};

	const ApplyFilter = () => {
		dispatch(fillTainingDetailsApplyFilter(true));

		setAnchorEl(null);
		dispatch(
			getTrainingAttendeesList({
				page: 1,
				perPage: limitPerPage,
				trainingId: props.trainingId,
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
				districtIds: [],
				blockZoneIds: [],
				panchayatWardIds: [],
				villageAreaIds: [],
				status: '',
			});
			setInputAdded(false);
			dispatch(fillProgramFilterDistrict([]));
			dispatch(fillProgramFilterBlock([]));
			dispatch(fillProgramFilterPanchayat([]));
			dispatch(fillProgramFilterVillage([]));
			dispatch(fillProgramFilterStatus(''));
			dispatch(fillTainingDetailsStatusFilter(null));
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
				let newVal = Array.isArray(value) ? value.filter((item) => item !== '') : value;
				setFilterDataPopOver((prev)=>({ ...prev, [key]: newVal }));
				setInputAdded(true);
			}
		};
		if (type === 'districtIds' && e) {
			setFilterDataPopOver((prev) => ({ ...prev, blockZoneIds: [], panchayatWardIds: [], villageAreaIds: [] }));
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
			<Paper className="tw-w-full tw-pt-6 tw-mt-6">
				<div className="tw-flex tw-justify-between">
					<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText tw-px-6">
						Training Attendees
					</Typography>
				</div>
				<div className="tw-flex tw-justify-between tw-mt-6">
					<div className="tw-px-6">{trainingAttendeesListData?.length > 0 && <span className="tw-text-base   tw-text-[#666]">Total {attendeesPaginateInfo?.total}</span>}</div>
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
											<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Attendance</span>
											<div className="tw-flex tw-justify-between tw-items-center tw-pl-4 tw-w-[260px]">
												<Dropdown
													label="All Statuses"
													bgColor="rgba(255, 196, 12, 0.24)"
													value={filterDataPopOver?.status}
													onChange={(e) => {
														// onStatusChange(e);
														onChangeDropDownFilter(e, 'status');
														dispatch(fillTainingDetailsStatusFilter(e));
													}}
													labelkey="label"
													valuekey="value"
													options={attendanceFilter}
												/>
											</div>
										</div>
										<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3 ">
											<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Select District</span>
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
												// style={{ maxWidth: '300px' }}
												// selectWidth={"300px"}
											/>
										</div>
										<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3 ">
											<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Select Block/Zone</span>
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
												style={{ maxWidth: '300px' }}
												disabled={filterDistrict.length === 0}
											/>
										</div>
										<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3 ">
											<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Select Panchayat/Ward</span>
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
												style={{ maxWidth: '300px' }}
												disabled={filterBlock.length === 0}
											/>
										</div>
										<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
											<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Select Village/Area</span>
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
											/>
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
							{trainingAttendeesListData.length > 0 ? (
								<EnhancedTable
									scrollable
									columns={header}
									data={trainingAttendeesListData}
									onPageChange={onPageChange}
									page={page}
									details={true}
									paginate={{ totalPages: attendeesPaginateInfo.totalPages, page: page }}
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

export default TrainingAttendees;
