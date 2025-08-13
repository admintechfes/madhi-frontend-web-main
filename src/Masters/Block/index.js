import React, { useEffect, useState } from 'react';
import MasterHeader from '../../components/Masters/MasterHeader';
import { Container } from '../../components/Container';

import FilterExport from '../../components/Masters/FilterExportDistrict';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TableMaster from '../../components/Masters/TableMaster';
import { exportBlockZone, getBlockList } from './duck/network';
import { CircularProgress } from '@mui/material';
import { Button, Popover, TextField } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import filter_on from '../../../public/assets/icons/filter_on.svg';

import { Dropdown } from '../../components/Select';
// import { getDistrictNameList, getSupervisorNameList, getUserNameList,getSupervisorNameList,getUserNameList } from '../Districts/duck/network';
import { getSupervisorNameList, getUserNameList,getDistrictNameList } from '../Districts/duck/network';
import {
	fillMinPanchayatWardsCount,
	fillMaxPanchayatWardsCount,
	fillMinVillageAreasCount,
	fillMaxVillageAreasCount,
	fillMinParentCount,
	fillMaxParentCount,
	setLoading,
	fillApplyFilter,
	fillAssignedSupervisorId,
	fillAssignedDistrict,
	fillPerPageNum,
} from './duck/blockSlice';
import DropDownWithSearch from '../../components/Masters/DropDownWithSearch';

export default React.memo(function Block() {
	const [list, setList] = useState([]);
	const pageNum=useSelector((state)=>state.block.pageNum)
	const [page, setPage] = useState(pageNum);
	const perPageNum=useSelector((state)=>state.block.perPageNum)
	const [limitPerPage, setLimitPerPage] = useState(perPageNum);
	const [anchorEl, setAnchorEl] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [inputAdded, setInputAdded] = useState(false);
	const [permissions, setPermissions] = useState({});

	const minPanchayatWardsCount = useSelector((state) => state.block.minPanchayatWardsCount);
	const maxPanchayatWardsCount = useSelector((state) => state.block.maxPanchayatWardsCount);
	const minVillageAreasCount = useSelector((state) => state.block.minVillageAreasCount);
	const maxVillageAreasCount = useSelector((state) => state.block.maxVillageAreasCount);
	const minParentCount = useSelector((state) => state.block.minParentCount);
	const maxParentCount = useSelector((state) => state.block.maxParentCount);
	const applyFilter = useSelector((state) => state.block.applyFilter);
	const assignedSupervisorId = useSelector((state) => state.block.assignedSupervisorId);
	const district_id = useSelector((state) => state.block.district_id);
  const listDistrict = useSelector((state) => state.district.districtNameList);
	const [filterDataPopOver, setFilterDataPopOver] = useState({
		minPanchayatWardsCount: minPanchayatWardsCount,
		maxPanchayatWardsCount: maxPanchayatWardsCount,
		minVillageAreasCount: minVillageAreasCount,
		maxVillageAreasCount: maxVillageAreasCount,
		minParentCount: minParentCount,
		maxParentCount: maxParentCount,
		assignedSupervisorId: assignedSupervisorId,
		district_id: district_id,
		// "source":"masters"
	});

	const [filterErrors, setFilterErrors] = useState({
		minPanchayatWardsCount: '',
		maxPanchayatWardsCount: '',
		minVillageAreasCount: '',
		maxVillageAreasCount: '',
		minParentCount: '',
		maxParentCount: '',
		assignedSupervisorId: '',
		district_id:""
	});
	const errors = {
		minPanchayatWardsCount: '',
		maxPanchayatWardsCount: '',
		minVillageAreasCount: '',
		maxVillageAreasCount: '',
		minParentCount: '',
		maxParentCount: '',
		assignedSupervisorId: '',
		district_id:""
	};

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loader = useSelector((state) => state.block.loading);
	const paginateInfo = useSelector((state) => state.block.paginateInfo);
	// const paginateInfo = useSelector((state) => state.district.paginateInfo);
	const userName = useSelector((state) => state.district.supervisorNameList);
	const header = [
		{
			id: 'name',
			numeric: false,
			disablePadding: true,
			label: 'Block/Zone Name',
			sort: true,
			width: 220,
		},
		{
			id: 'assigned_district',
			numeric: false,
			disablePadding: true,
			label: 'Assigned District',
			sort: true,
			width: 220,
		},
		{
			id: 'assigned_senior_supervisors',
			numeric: false,
			disablePadding: true,
			label: 'Assigned Senior Supervisor',
			sort: true,
			width: 250,
		},
		{
			id: 'assigned_supervisors',
			numeric: false,
			disablePadding: true,
			label: 'Assigned Supervisor',
			sort: true,
			width: 220,
		},

		{
			id: 'no_of_panchayat_wards',
			numeric: false,
			disablePadding: true,
			label: 'No.of Panchayat/Ward',
			sort: true,
			width: 220,
		},
		{
			id: 'no_of_village_areas',
			numeric: false,
			disablePadding: true,
			label: 'No.of Village/Area',
			sort: true,
			width: 220,
		},
		{
			id: 'no_of_supervisors',
			numeric: false,
			disablePadding: true,
			label: 'No.of Supervisors',
			sort: true,
			width: 220,
		},
		{
			id: 'no_of_parents',
			numeric: false,
			disablePadding: true,
			label: 'No.of Total Parents',
			sort: true,
			width: 220,
		},
	];

	useEffect(() => {
		const userPermissions = JSON.parse(localStorage.getItem('permissions'));
		setPermissions(userPermissions['Masters']['Block/Zone']);
	}, []);

	useEffect(() => {
		let timeoutId;
		dispatch(setLoading(true));
		// dispatch(getUserNameList)
		if (!searchText) {
			if (applyFilter) {
				timeoutId = setTimeout(() => {
					dispatch(
						getBlockList({
							page: page,
							per_page: limitPerPage,
							...filterDataPopOver,
						})
					).then((resp) => {
						formatForDisplay(resp?.data);
					});
				}, 100);
			} else {
				timeoutId = setTimeout(() => {
					dispatch(
						getBlockList({
							page: page,
							per_page: limitPerPage,
						})
					).then((resp) => {
						formatForDisplay(resp?.data);
						// dispatch(setLoading(false));
					});
				}, 100);
			}
		} else {
			timeoutId = setTimeout(() => {
				dispatch(
					getBlockList({
						page: 1,
						search: searchText,
						per_page: limitPerPage,
						...filterDataPopOver,
					})
				).then((resp) => {
					formatForDisplay(resp?.data);
				});
			}, 100);
		}

		return () => clearTimeout(timeoutId);
	}, [limitPerPage, searchText]);

	const formatForDisplay = (data) => {
		const formatedRows = [];

		data?.length > 0 &&
			data?.forEach((item) => {
				formatedRows.push({
					id: item.id,
					name: item.name,
					assigned_senior_supervisors: item.assigned_senior_supervisors,
					assigned_district: item.assigned_district,
					assigned_supervisors: item.assigned_supervisors,
					no_of_panchayat_wards: item.no_of_panchayat_wards,
					no_of_village_areas: item.no_of_village_areas,
					no_of_supervisors: item.no_of_supervisors,
					no_of_parents: item.no_of_parents,
				});
			});
		setList(formatedRows);
	};

	const open = Boolean(anchorEl);

	const id = open ? 'simple-popover' : undefined;

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = (event) => {
		if (userName.length === 0) {
			dispatch(getSupervisorNameList());
		}
    dispatch(getDistrictNameList())
		if (!applyFilter) {
			setFilterDataPopOver({
				minPanchayatWardsCount: null,
				maxPanchayatWardsCount: null,
				minVillageAreasCount: null,
				maxVillageAreasCount: null,
				minParentCount: null,
				maxParentCount: null,
				assignedSupervisorId: null,
				district_id:null
			});

			setInputAdded(false);

			dispatch(fillMinPanchayatWardsCount(null));
			dispatch(fillMaxPanchayatWardsCount(null));
			dispatch(fillMinVillageAreasCount(null));
			dispatch(fillMaxVillageAreasCount(null));
			dispatch(fillMinParentCount(null));
			dispatch(fillMaxParentCount(null));
			dispatch(fillAssignedSupervisorId(null));
			dispatch(fillAssignedDistrict(null));
		}

		setAnchorEl(event.currentTarget);
	};
	const onChangeFilter = (e, type) => {
		setPage(1);
		const updateFilterData = (key, value) => {
			setFilterDataPopOver({ ...filterDataPopOver, [key]: value });
			setInputAdded(true);
		};

		const typeToKey = {
			minPanchayatWardsCount: 'minPanchayatWardsCount',
			maxPanchayatWardsCount: 'maxPanchayatWardsCount',
			minVillageAreasCount: 'minVillageAreasCount',
			maxVillageAreasCount: 'maxVillageAreasCount',
			minParentCount: 'minParentCount',
			maxParentCount: 'maxParentCount',
			assignedSupervisorId: 'assignedSupervisorId',
			district_id:"district_id"
		};

		const key = typeToKey[type];
		if (key) {
			updateFilterData(key, e);
		}
	};
	const handleSearchHeader = (e) => {
		setSearchText(e.target.value);
	};

	const onNavigateDetails = (id) => {
		navigate({ pathname: `/block-zone-details/${id}` });
	};

	const ResetFilter = () => {
		setFilterErrors({});
		dispatch(fillMinPanchayatWardsCount(null));
		dispatch(fillMaxPanchayatWardsCount(null));
		dispatch(fillMinVillageAreasCount(null));
		dispatch(fillMaxVillageAreasCount(null));
		dispatch(fillMinParentCount(null));
		dispatch(fillMaxParentCount(null));
		dispatch(fillAssignedDistrict(null));
		setFilterDataPopOver({
			minPanchayatWardsCount: null,
			maxPanchayatWardsCount: null,
			minVillageAreasCount: null,
			maxVillageAreasCount: null,
			minParentCount: null,
			maxParentCount: null,
			assignedSupervisorId: null,
		});
		setInputAdded(false);
		dispatch(fillApplyFilter(false));

		setAnchorEl(null);
		dispatch(
			getBlockList({
				page: page,
				per_page: limitPerPage,
			})
		).then((resp) => {
			formatForDisplay(resp?.data);
		});
	};

	const ApplyFilter = () => {
		dispatch(fillApplyFilter(true));

		setFilterErrors({});

		['PanchayatWardsCount', 'VillageAreasCount', 'ParentCount'].forEach((field) => {
			const minField = `min${field}`;
			const maxField = `max${field}`;

			if (parseFloat(filterDataPopOver[maxField]) === 0) {
				errors[maxField] = 'Max must be greater than or equal to Min';
			} else if (filterDataPopOver[minField] !== null && filterDataPopOver[maxField] !== null && parseFloat(filterDataPopOver[minField]) > parseFloat(filterDataPopOver[maxField])) {
				errors[maxField] = 'Max must be greater than or equal to Min';
			} else {
				errors[maxField] = '';
			}
		});

		if (Object.values(errors).every((value) => value === '')) {
			setAnchorEl(null);
			dispatch(
				getBlockList({
					page: page,
					per_page: limitPerPage,
					// "source":"masters",
					...filterDataPopOver,
				})
			).then((resp) => {
				formatForDisplay(resp?.data);
			});
		} else {
			setFilterErrors(errors);
		}
	};

	const onPageChange = (page) => {
		
		setPage(page);
		dispatch(
			getBlockList({
				page: page,
				per_page: limitPerPage,
				search: searchText,
				...filterDataPopOver,
			})
		).then((resp) => {
			formatForDisplay(resp?.data);
		});
	};

	const fields = [
		{
			label: 'No.of  Panchayat/Ward',
			minField: 'minPanchayatWardsCount',
			maxField: 'maxPanchayatWardsCount',
			filter1: fillMinPanchayatWardsCount,
			filter2: fillMaxPanchayatWardsCount,
			error: filterErrors.maxPanchayatWardsCount,
		},
		{
			label: 'No.of  Village/Area',
			minField: 'minVillageAreasCount',
			maxField: 'maxVillageAreasCount',
			filter1: fillMinVillageAreasCount,
			filter2: fillMaxVillageAreasCount,
			error: filterErrors.maxVillageAreasCount,
		},
	];

	const fields2 = [
		{
			label: 'No.of  Total Parents',
			minField: 'minParentCount',
			maxField: 'maxParentCount',
			filter1: fillMinParentCount,
			filter2: fillMaxParentCount,
			error: filterErrors.maxParentCount,
		},
	];

	const handleSearch = (txt, type) => {
		if (type === 'assignedSupervisorId') {
			dispatch(getSupervisorNameList({ search: txt }));
		}
		if(type=="district"){
      dispatch(getDistrictNameList(txt))
    }
	};

	const ExportData = () => {
		dispatch(exportBlockZone())
	}

	

	return (
		<div>
			<div className="tw-pb-3">
				<MasterHeader title={'Block'} placeHolderName={'Search by Block/Zone Name'} handleSearch={handleSearchHeader} navigateValue={'/block-zone/add'} addBtnName={'Add New Block/Zone'} permissions={permissions} />
			</div>
			<Container>
				<div className="tw-pr-3  tw-flex tw-justify-end  tw-gap-4">
				<Button
						variant="outlined"
						onClick={() => ExportData()}>
						Export Data
					</Button>
					<Button variant="outlined" onClick={handleClick} endIcon={!applyFilter ? <FilterListIcon className="tw-text-primary" /> : <img src={filter_on} />}>
						Filters
					</Button>
					<Popover
						sx={{
							'& .MuiPaper-root': {
								padding: '16px',
								overflow: 'visible',
							},
						}}
						id={1}
						open={open}
						anchorEl={anchorEl}
						onClose={handleClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
					>
						<div className="tw-flex tw-justify-between tw-w-full tw-pb-5 ">
							<div>
								<h2 className="tw-text-2xl tw-text-secondaryText tw-font-bold">Block/Zone</h2>
							</div>
							<div onClick={handleClose} className="tw-cursor-pointer ">
								<CloseIcon />
							</div>
						</div>
						<div className="tw-flex tw-items-start tw-gap-6 tw-justify-between tw-w-[608px] ">
							<div className="tw-flex tw-w-1/2 tw-flex-col tw-items-start tw-gap-4">
								{fields.map((field, index) => (
									<>
										<div key={index} className="tw-flex tw-items-center tw-self-stretch tw-gap-2 tw-justify-between">
											<span className="tw-text-xs  tw-font-normal tw-text-grey block tw-w-1/2">{field.label}</span>
											<TextField
												size="small"
												type="number"
												placeholder="Min"
												onChange={(e) => {
													onChangeFilter(e.target.value, field.minField);
													dispatch(field.filter1(e.target.value));
												}}
												value={filterDataPopOver[field.minField]}
												className="tw-w-[33.33%]"
											/>
											<span className="tw-text-xs tw-font-normal tw-text-grey block">-</span>
											<TextField
												size="small"
												type="number"
												placeholder="Max"
												onChange={(e) => {
													onChangeFilter(e.target.value, field.maxField);
													dispatch(field.filter2(e.target.value));
												}}
												value={filterDataPopOver[field.maxField]}
												className="tw-w-[33.33%]"
											/>
										</div>
										{field.error && (
											<div key={index + 'error'} className="tw-text-red-500 tw-text-sm tw-flex tw-justify-end">
												{field.error}
											</div>
										)}
									</>
								))}

								<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
									<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Assigned District</span>

									<DropDownWithSearch
										options={listDistrict}
										valuekey="district_id"
										labelkey="name"
										label="Select District"
										value={filterDataPopOver.district_id}
										onChange={(e) => {
											onChangeFilter(e, 'district_id');
											dispatch(fillAssignedDistrict(e));
										}}
										// value={filterDataPopOver.assignedSupervisorId}
										listSearch={getDistrictNameList}
										searchText={(txt) => handleSearch(txt, 'district')}
									/>
								</div>
							</div>
							<div className="tw-flex tw-flex-col tw-items-start tw-w-1/2 tw-gap-4">
								<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
									<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Assigned Supervisor</span>
									{/* <Dropdown
										options={userName}
										onChange={(e) => onChangeFilter(e, 'assignedSupervisorId')}
										value={filterDataPopOver.assignedSupervisorId}
										valuekey="id"
										labelkey="full_name"
										label="Assigned To"
									/> */}

									<DropDownWithSearch
										options={userName}
										valuekey="id"
										labelkey="full_name"
										label="Assigned To"
										value={filterDataPopOver.assignedSupervisorId}
										onChange={(e) => {
											onChangeFilter(e, 'assignedSupervisorId');
											dispatch(fillAssignedSupervisorId(e));
										}}
										// value={filterDataPopOver.assignedSupervisorId}
										listSearch={getSupervisorNameList}
										searchText={(txt) => handleSearch(txt, 'assignedSupervisorId')}
									/>
								</div>
								{fields2.map((field, index) => (
									<>
										<div key={index} className="tw-flex tw-items-center tw-self-stretch tw-gap-2 tw-justify-between">
											<span className="tw-text-xs  tw-font-normal tw-text-grey block tw-w-1/2">{field.label}</span>
											<TextField
												size="small"
												type="number"
												placeholder="Min"
												onChange={(e) => {
													onChangeFilter(e.target.value, field.minField);
													dispatch(field.filter1(e.target.value));
												}}
												value={filterDataPopOver[field.minField]}
												className="tw-w-[33.33%]"
											/>
											<span className="tw-text-xs tw-font-normal tw-text-grey block">-</span>
											<TextField
												size="small"
												type="number"
												placeholder="Max"
												onChange={(e) => {
													onChangeFilter(e.target.value, field.maxField);
													dispatch(field.filter2(e.target.value));
												}}
												value={filterDataPopOver[field.maxField]}
												className="tw-w-[33.33%]"
											/>
										</div>
										{field.error && (
											<div key={index + 'error'} className="tw-text-red-500 tw-text-sm tw-flex tw-justify-end">
												{field.error}
											</div>
										)}
									</>
								))}

								{/* <div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
									<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Assigned Sr.Supervisor</span>
									<Dropdown
										options={[{ "uuid": "a" }]}
										onChange={(e) => onChangeFilter(e, 'assign_uuid')}
										value={filterDataPopOver.assign_uuid}
										valuekey="uuid"
										labelkey="name"
										label="Assigned To"
									/>
								</div> */}
								<div className="tw-flex tw-justify-end  tw-self-stretch tw-gap-3">
									<Button
										variant={!inputAdded && !applyFilter ? 'contained' : 'outlined'}
										onClick={ResetFilter}
										disabled={!inputAdded && !applyFilter}
										className={`${!inputAdded && !applyFilter ? 'uppercase !tw-bg-[#FAFAFA] tw-w-[55%] !tw-text-grey !tw-shadow-none' : 'uppercase tw-w-[55%] !tw-shadow-none`'}`}
									>
										Reset Filters
									</Button>
									<Button variant="contained" disabled={!inputAdded && !applyFilter} onClick={ApplyFilter} className="uppercase tw-w-[60%] !tw-text-white !tw-shadow-none">
										Apply
									</Button>
								</div>
							</div>
						</div>
					</Popover>
				</div>
				<div>
					<>
						{!loader ? (
							<>
								{list.length ? (
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
									<div
										className="tw-p-6 tw-mt-5 tw-bg-[#FAFCFE] tw-text-SecondaryTextColor 
                                tw-font-normal tw-text-sm tw-text-center tw-rounded-lg"
									>
										<span>No Data Found. Click Add New Button to add a new Block</span>
									</div>
								)}
							</>
						) : (
							<div className="tw-text-center tw-py-5">
								<CircularProgress />
							</div>
						)}
					</>
				</div>
			</Container>
		</div>
	);
});
