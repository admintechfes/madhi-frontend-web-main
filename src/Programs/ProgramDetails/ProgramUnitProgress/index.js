import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, CircularProgress, Grid, InputAdornment, Paper, Popover, TextField, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { getDistrictNameList, getDistrictbyProgramList } from '../../../Masters/Districts/duck/network';
import { Dropdown } from '../../../components/Select';
import DropdownWithSearch from '../../../components/Programs/DropdownWithSearch';
import EnhancedTable from '../../../components/ProgramProgress/Table';
import { ReleaseReport, getProgramUnitProgressList, toggleeProgramUnitStatus } from '../../duck/network';
import startIcon from '../../../../public/assets/icons/file_start.svg';
import stopIcon from '../../../../public/assets/icons/file_stop.svg';
import restartIcon from '../../../../public/assets/icons/file_restart.svg';
import startIconD from '../../../../public/assets/icons/d_file_start.svg';
import stopIconD from '../../../../public/assets/icons/d_file_stop.svg';
import restartIconD from '../../../../public/assets/icons/d_file_restart.svg';
import FormDialog from '../../../components/Dialog';
import { LoadingButton } from '@mui/lab';


const header = [
	{
		id: 'name',
		numeric: false,
		disablePadding: true,
		label: 'Village/Area Name',
		sort: true,
		width: 170,
	},
	{
		id: 'districtName',
		numeric: false,
		disablePadding: true,
		label: 'District',
		sort: true,
		width: 170,
	},
	{
		id: 'serialNumber',
		numeric: false,
		disablePadding: true,
		label: 'Unit',
		sort: true,
		width: 200,
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: true,
		label: 'Status',
		sort: true,
		width: 150,
	},
	{
		id: 'updatedOn',
		numeric: false,
		disablePadding: true,
		label: 'Activate/Closed On',
		sort: true,
		width: 200,
	},
	{
		id: 'action',
		numeric: false,
		disablePadding: true,
		label: 'Action',
		sort: false,
		align: 'right',
		width: 240,
	},
];

export default function ProgramUnitProgress({ programId }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const params = useParams();

	const [filterData, setFilterData] = useState({
		districtId: 'all',
		status: 'all',
	});

	const loader = useSelector((state) => state.program.programDetailLoading);
	const paginateInfo = useSelector((state) => state.program.progressPaginateInfo);
	const districtName = useSelector((state) => state.district.districtNameList);
	const progressList = useSelector((state) => state.program.programUnitProgressList);
	const programDetails = useSelector((state) => state.program.programDetails);

	const [searchText, setSearchText] = useState('');
	const [list, setList] = useState([]);
	const [page, setPage] = useState(1);
	const [limitPerPage, setLimitPerPage] = useState(10);
	const [selectedUnit, setSelectedUnit] = useState({});
	const [selected, setSelected] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [permissions, setPermissions] = useState({});
	const [progressHeader, setProgressHeader] = useState(header)
	const [districtList, setDistrictList] = useState(districtName)
	const [openCloseUnit, setOpenCloseUnit] = useState(false)
	const [ActionType, setActionType] = useState({
		type: "",
		unitType: ""
	})

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const statusOption = [
		{
			name: 'All',
			status: 'all',
		},
		{
			name: 'Not Initiated',
			status: 'not_initiated',
		},
		{
			name: 'Active',
			status: 'active',
		},
		{
			name: 'Closed',
			status: 'closed',
		},
	];

	useEffect(() => {
		let actionPermssion = JSON.parse(window.localStorage.getItem('permissions'))
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
		if (!actionPermssion?.Programs?.program_unit?.update || programDetails?.status == 'closed') {
			setProgressHeader((prev) => {
				let newHeader = [...prev];
				newHeader.pop();
				return newHeader;
			});
		}
	}, []);

	useEffect(() => {
		dispatch(getDistrictbyProgramList({ programId }));
	}, []);

	useEffect(() => {
		setDistrictList([{ district_id: 'all', name: 'All' }, ...districtName])
	}, [districtName]);

	useEffect(() => {
		dispatch(getProgramUnitProgressList(programId, { ...filterData, programId, page: page, perPage: limitPerPage }));
	}, [filterData, limitPerPage, page]);

	const formatForDisplay = (data) => {
		const formatedRows = [];
		data?.forEach((item, index) => {
			formatedRows.push({
				id: item.id,
				srNo: index + 1,
				name: item.name,
				startEndDate: item.startEndDate,
			});
		});
		setList(formatedRows);
	};

	const handleManage = (id, e) => {
		setAnchorEl(e.currentTarget);
		let filterUnit = progressList.filter((item) => item.id == id);
		setSelected(filterUnit[0]);
	};

	const onPageChange = (page) => {
		setPage(page);
	};

	const onStatusChange = (e) => {
		setSelectedStatus(e);
		setPage(1);
	};

	const handleSearchDrop = (txt, type) => {
		dispatch(getDistrictbyProgramList({ search: txt, programId }));
	};

	const onChangeDropDownFilter = (e, type) => {
		setFilterData((prevData) => {
			return { ...prevData, [type]: e };
		});
		setSelected([]);
	};

	const handleSelected = (selectedData) => {
		setSelected(selectedData);
	};

	const handleProgramUnitStatus = (actionType, type) => {

		if (type == 'multiple') {
			const filterIds = selected.map((item) => {
				return item.id;
			});
			dispatch(toggleeProgramUnitStatus(programId, { action: actionType, villageAreaIds: filterIds })).then(() => {
				handleClose();
				dispatch(getProgramUnitProgressList(programId, { ...filterData, programId, page: page, perPage: limitPerPage }));
			});
		}
		if (type == 'single')
			dispatch(toggleeProgramUnitStatus(programId, { action: actionType, villageAreaId: selected.id })).then(() => {
				handleClose();
				dispatch(getProgramUnitProgressList(programId, { ...filterData, programId, page: page, perPage: limitPerPage }));
			});
	};

	const handleDropdownSearch = (text, index, dropdownName) => {

		if (dropdownName.includes('district')) {
			let res = districtName.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
			if (!text) {
				res = [{ district_id: 'all', name: 'All' }, ...res]
			}
			setDistrictList(res);
		}
	};

	const handleCloseUnit = () => {
		setOpenCloseUnit(false)
		setActionType({
			type: "",
			unitType: ""
		})
	}

	const CloseReleaseUnit = (type) => {
		if (ActionType.type === "multiple") {
			const filterIds = selected.map((item) => {
				return item.id;
			});
			if (type === "report") {
				dispatch(toggleeProgramUnitStatus(programId, { action: ActionType.unitType, villageAreaIds: filterIds, isReleaseStudentReport: true })).then(() => {
					handleClose();
					setOpenCloseUnit(false)
					dispatch(getProgramUnitProgressList(programId, { ...filterData, programId, page: page, perPage: limitPerPage }));
				});
			}
			else {
				dispatch(toggleeProgramUnitStatus(programId, { action: ActionType.unitType, villageAreaIds: filterIds })).then(() => {
					handleClose();
					setOpenCloseUnit(false)
					dispatch(getProgramUnitProgressList(programId, { ...filterData, programId, page: page, perPage: limitPerPage }));
				});
			}
		}
		else {
			if (type === "report") {
				dispatch(toggleeProgramUnitStatus(programId, { action: ActionType.unitType, villageAreaId: selected.id, isReleaseStudentReport: true })).then(() => {
					handleClose();
					setOpenCloseUnit(false)
					dispatch(getProgramUnitProgressList(programId, { ...filterData, programId, page: page, perPage: limitPerPage }));
				});
			}
			else {
				dispatch(toggleeProgramUnitStatus(programId, { action: ActionType.unitType, villageAreaId: selected.id })).then(() => {
					handleClose();
					setOpenCloseUnit(false)
					dispatch(getProgramUnitProgressList(programId, { ...filterData, programId, page: page, perPage: limitPerPage }));
				});
			}
		}
	}

	const onSubmitReleaseReport = (id, unitId) => {
		dispatch(ReleaseReport({ programUnitId: unitId, villageAreaId: id }))
	}

	return (
		<Box>
			<Paper className={`tw-pt-6 tw-w-full  tw-my-6`}>
				<div className="tw-flex tw-justify-between tw-items-center tw-px-6 ">
					<h2 className="tw-text-secondaryText tw-font-bold tw-text-xl">Unit's Progress </h2>
				</div>
				<div className="tw-flex tw-justify-between tw-items-center tw-px-6 tw-my-6">
					<div className="tw-flex tw-gap-5 tw-items-center">
						<div className="tw-w-[250px]">
							<DropdownWithSearch
								options={districtName.length > 0 && districtList}
								valuekey="district_id"
								labelkey="name"
								label="Select District"
								handleSearch={(text) => handleDropdownSearch(text, 0, 'district')}
								listSearch={getDistrictNameList}
								searchText={(txt) => handleSearchDrop(txt, 'district')}
								onChange={(e) => {
									onChangeDropDownFilter(e, 'districtId');
								}}
								value={filterData?.districtId}
							/>
						</div>
						<div className="tw-w-[250px]">
							<Dropdown
								options={statusOption}
								valuekey="status"
								labelkey="name"
								label="Unit Status"
								onChange={(e) => {
									onChangeDropDownFilter(e, 'status');
								}}
								value={filterData?.status}
							/>
						</div>
					</div>
					{permissions?.Programs?.program_unit.update && (
						<div className="tw-flex tw-justify-between px-2">
							<Button
								variant="outlined"
								disabled={(filterData.status == 'not_initiated' || filterData.status == 'closed') && programDetails.status == 'active' ? false : true}
								disableElevation={true}
								onClick={() => handleProgramUnitStatus('activate_next_unit', 'multiple')}
								className="uppercase !tw-font-semibold !tw-mr-2"
							>
								Activate Next Unit
							</Button>
							<Button
								variant="outlined"
								disabled={filterData.status == 'active' && programDetails.status == 'active' ? false : true}
								disableElevation={true}
								onClick={() => {
									setOpenCloseUnit(true)
									setActionType({
										type: "multiple",
										unitType: "close_current_unit"
									})
								}}
								className="uppercase !tw-font-semibold !tw-mr-2"
							>
								Close Unit
							</Button>
							<Button
								variant="outlined"
								disabled={filterData.status == 'closed' && programDetails.status == 'active' ? false : true}
								disableElevation={true}
								onClick={() => handleProgramUnitStatus('reactivate_current_unit', 'multiple')}
								className="uppercase !tw-font-semibold"
							>
								Reactivate Unit
							</Button>
						</div>
					)}
				</div>
				<>
					{!loader ? (
						<>
							{progressList.length > 0 ? (
								<>
									<EnhancedTable
										handleManage={handleManage}
										scrollable
										columns={progressHeader}
										data={progressList}
										onPageChange={onPageChange}
										page={page}
										details={true}
										paginate={{ totalPages: paginateInfo.totalPages, page: page }}
										keyProp="uuid"
										multiSelect={filterData.status != 'all' && permissions?.Programs?.program_unit.update && programDetails?.status == 'active' ? true : false}
										handleSelected={handleSelected}
										selectedData={selected}
										setLimitPerPage={setLimitPerPage}
										limitPerPage={limitPerPage}
										programDetails={programDetails}
										onSubmitReleaseReport={onSubmitReleaseReport}
									/>
									<Popover
										id={id}
										open={open}
										anchorEl={anchorEl}
										onClose={handleClose}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										transformOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
									>
										<div className="tw-flex tw-flex-col tw-justify-start tw-gap-1 tw-p-1">
											<Button
												disabled={selected.status == 'Not Initiated' || selected.status == 'Closed' ? false : true}
												className={`${selected.status == 'Not Initiated' || selected.status == 'Closed' ? '!tw-text-secondary ' : '!tw-text-grey'} !tw-justify-start`}
												onClick={() => handleProgramUnitStatus('activate_next_unit', 'single')}
												variant="text"
												startIcon={<img src={selected.status == 'Not Initiated' || selected.status == 'Closed' ? startIcon : startIconD} />}
											>
												Activate Next Unit
											</Button>
											<Button
												disabled={selected.status == 'Active' ? false : true}
												disableElevation={true}
												className={`${selected.status == 'Active' ? '!tw-text-secondary ' : '!tw-text-grey'} !tw-justify-start`}
												onClick={() => {
													setOpenCloseUnit(true)
													setActionType({
														type: "single",
														unitType: "close_current_unit"
													})
												}}
												variant="text"
												startIcon={<img src={selected.status == 'Active' ? stopIcon : stopIconD} />}
											>
												Close Unit
											</Button>
											<Button
												disabled={selected.status == 'Closed' ? false : true}
												className={`${selected.status == 'Closed' ? '!tw-text-secondary ' : '!tw-text-grey'} !tw-justify-start`}
												onClick={() => handleProgramUnitStatus('reactivate_current_unit', 'single')}
												variant="text"
												startIcon={<img src={selected.status == 'Closed' ? restartIcon : restartIconD} />}
											>
												Reactivate Unit
											</Button>
										</div>
									</Popover>
								</>
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

			{openCloseUnit && (
				<FormDialog open={openCloseUnit} close={handleCloseUnit} title="Close Program and Release Report">
					<div>
						<p>You can either close the unit or close it and release student reports at the same time. What would you like to do?</p>
						<div className="tw-pt-8 tw-pb-1 tw-flex tw-justify-end tw-gap-5">
							<div className="tw-grow">
								<LoadingButton onClick={() => CloseReleaseUnit('')} fullWidth variant="outlined" disableElevation>
									Close Only
								</LoadingButton>
							</div>
							<div className="tw-grow">
								<LoadingButton onClick={() => CloseReleaseUnit('report')} fullWidth variant="contained" disableElevation>
									Close & Release
								</LoadingButton>
							</div>
						</div>
					</div>
				</FormDialog>
			)}

		</Box>
	);
}
