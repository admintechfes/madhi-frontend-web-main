import { Box, Button, CircularProgress, Grid, InputAdornment, Paper, Popover, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import EnhancedTable from '../components/Programs/Table';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from '../components/Select';
import { getProgramList } from './duck/network';
import { utils } from '../utils';
import { setSelectedProgramStatus, setPaginationPage, fillProgramFilterDistrict, fillProgramFilterVillage, fillProgramFilterStatus, fillProgramApplyFilter, fillProgramFilterBlock, fillProgramFilterPanchayat } from './duck/programSlice';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import DropDownWithSearch from '../components/Masters/DropDownWithSearch';
import { getBlockNameList, getDistrictNameList, getPanchayatNameList, getVillageNameList } from '../Masters/Districts/duck/network';

import filter_on from '../../public/assets/icons/filter_on.svg';
import DropDownWithFilterCheck from '../components/Masters/DropDownWithFilterCheck';



const header = [
	{
		id: 'name',
		numeric: false,
		disablePadding: true,
		label: 'Program Name',
		sort: true,
		width: 300,
	},
	{
		id: 'program_districts',
		numeric: false,
		disablePadding: true,
		label: 'Program Districts',
		sort: true,
		width: 300,
	},
	{
		id: 'program_blockZones',
		numeric: false,
		disablePadding: true,
		label: 'Program Block/Zone',
		sort: true,
		width: 300,
	},
	{
		id: 'program_panchayatWards',
		numeric: false,
		disablePadding: true,
		label: 'Program Panchayat/Ward',
		sort: true,
		width: 300,
	},
	{
		id: 'program_village_areas',
		numeric: false,
		disablePadding: true,
		label: 'Program Village/Area',
		sort: true,
		width: 220,
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: true,
		label: 'Status',
		sort: true,
		width: 220,
	},
	{
		id: 'status_since',
		numeric: false,
		disablePadding: true,
		label: 'Status Since',
		sort: true,
		width: 100,
	},
	{
		id: 'action',
		numeric: false,
		disablePadding: true,
		label: 'Action',
		sort: false,
		width: 260,
	},
];

export default function Program() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loader = useSelector((state) => state.program.programListLoading);
	const programList = useSelector((state) => state.program.programList);
	const paginateInfo = useSelector((state) => state.program.paginateInfo);
	const filterStatusp = useSelector((state) => state.program.selectedProgramStatus)
	const page = useSelector((state => state.program.paginationPage))


	const [inputAdded, setInputAdded] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);


	const filterDistrict = useSelector((state) => state.program.programfilterDistrict);
	const filterVillage = useSelector((state) => state.program.programfilterVillage);
	const filterBlock = useSelector((state) => state.program.programfilterBlock);
	const filterPanchayat = useSelector((state) => state.program.programfilterPanchayat);
	const filterStatus = useSelector((state) => state.program.programfilterStatus);
	const applyFilter = useSelector((state) => state.program.applyFilter);

	const [filterDataPopOver, setFilterDataPopOver] = useState({
		districtIds: filterDistrict,
		villageAreaIds: filterVillage,
		blockZoneIds: filterBlock,
		panchayatWardIds: filterPanchayat,
		status: filterStatus,
	});
	const districtNameList = useSelector((state) => state.district.districtNameList);
	const blockNameList = useSelector((state) => state.district.blockNameList);
	const panchayatNameList = useSelector((state) => state.district.panchayatNameList);
	const villageNameList = useSelector((state) => state.district.villageNameList);
	// const roleWiseName = useSelector((state) => state.user.userRoleNameList);

	const [searchText, setSearchText] = useState('');
	const [list, setList] = useState([]);
	// const [page, setPage] = useState(1);
	const [limitPerPage, setLimitPerPage] = useState(10);
	const [status, setStatus] = useState([
		{ label: 'All', value: 'all' },
		{ label: 'Active', value: 'active' },
		{ label: 'Yet to Start', value: 'yet_to_start' },
		{ label: 'Closed', value: 'closed' },
	]);
	const [permissions, setPermissions] = useState({});


	useEffect(() => {
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
	}, []);

	useEffect(() => {
		let timeoutId;

		if (!searchText) {

			if (applyFilter) {
				timeoutId = setTimeout(() => {
					dispatch(
						getProgramList({
							page: page,
							// status: programSelectedStatus,
							perPage: limitPerPage,
							...filterDataPopOver,
						})
					).then((resp) => {

						formatForDisplay(resp?.data?.data);
					});
				}, 100);
			} else {
				dispatch(getProgramList({ page: page, perPage: limitPerPage })).then((resp) => {
					if (resp?.statusCode == 200) formatForDisplay(resp?.data?.data);
				});
			}
		} else {
			timeoutId = setTimeout(() => {
				dispatch(
					getProgramList({
						keyword: searchText,
						page: 1,
						perPage: limitPerPage,
						...filterDataPopOver,
					})
				).then((resp) => {
					if (resp.statusCode == 200) formatForDisplay(resp?.data?.data);
				});
			}, 500);
		}

		return () => clearTimeout(timeoutId);
	}, [searchText, page, limitPerPage]);



	const formatForDisplay = (data) => {
		const formatedRows = [];
		data?.forEach((item, index) => {
			formatedRows.push({
				id: item.id,
				name: item.name,
				program_districts: item.programDistricts,
				program_blockZones: item.programBlockZones,
				program_panchayatWards: item.programPanchayatWards,
				program_village_areas: item.programVillageAreas,
				status: item.status,
				status_since: item.statusSince,
			});
		});
		setList(formatedRows);
	};

	const handleSearch = (e) => {
		setSearchText(e.target.value);
	};

	const handleManage = (id) => {
		navigate({ pathname: `/program-details/${id}` });
	};


	const onPageChange = (page) => {

		dispatch(setPaginationPage(page))
		// setPage(page);
	};

	const onStatusChange = (e) => {
		dispatch(setSelectedProgramStatus(e));
		dispatch(setPaginationPage(1))


		// setPage(1);
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
	}


	const ResetFilter = () => {
		dispatch(fillProgramFilterDistrict(''));
		dispatch(fillProgramFilterBlock(''));
		dispatch(fillProgramFilterPanchayat(''));
		dispatch(fillProgramFilterVillage(''));
		dispatch(fillProgramFilterStatus(''));

		setFilterDataPopOver({
			districtIds: '',
			blockZoneIds: '',
			panchayatWardIds: '',
			villageAreaIds: '',
			status: ""
		});
		dispatch(fillProgramApplyFilter(false));
		setInputAdded(false);
		dispatch(getVillageNameList({ search: '' }));
		setAnchorEl(null);
		dispatch(
			getProgramList({
				page: page,
				perPage: limitPerPage,
			})
		).then((resp) => {
			formatForDisplay(resp?.data?.data);
		});

	}

	const ApplyFilter = () => {
		dispatch(fillProgramApplyFilter(true));

		setAnchorEl(null);
		dispatch(
			getProgramList({
				page: 1,
				perPage: limitPerPage,
				...filterDataPopOver,
			})
		).then((resp) => {

			formatForDisplay(resp?.data?.data);
		});
		dispatch(setPaginationPage(1))
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
				status: '',
			});
			setInputAdded(false);
			dispatch(fillProgramFilterDistrict(''));
			dispatch(fillProgramFilterBlock(''));
			dispatch(fillProgramFilterPanchayat(''));
			dispatch(fillProgramFilterVillage(''));
			dispatch(fillProgramFilterStatus(""));
		}
		// dispatch(getUserRoleNameList());
		dispatch(getDistrictNameList());
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const onChangeDropDownFilter = (e, type) => {
		// setPage(1);
		
		const updateFilterData = (key, value) => {
			if(value!==""){
				setFilterDataPopOver({ ...filterDataPopOver, [key]: value });
				setInputAdded(true);
			}
		};
		if (type === 'districtIds' && e) {
			dispatch(getBlockNameList({ districtIds: e }));
			// setFilterDataPopOver((prev) => ({ ...prev, blockZoneIds: [] }))
			if(e.length<filterDistrict.length){
				dispatch(fillProgramFilterBlock([]));
				dispatch(fillProgramFilterPanchayat([]));
				dispatch(fillProgramFilterVillage([]));
			}
		}
		if (type === 'blockZoneIds' && e) {
			dispatch(getPanchayatNameList({ blockZoneIds: e }));
			if(e.length<filterBlock.length){
				dispatch(fillProgramFilterPanchayat([]));
				dispatch(fillProgramFilterVillage([]));
			}
		}
		if (type === 'panchayatWardIds' && e) {
			dispatch(getVillageNameList({ panchayatWardIds: e }));
			if(e.length<filterPanchayat.length){
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
			<div className="tw-flex tw-justify-between">
				<Typography variant="h3" className="!tw-font-semibold">
					Programs
				</Typography>
				<div className="tw-flex tw-gap-6 tw-justify-between">
					<TextField
						size="small"
						type="search"
						placeholder="Search by program name, districts"
						onChange={handleSearch}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon className="tw-text-[#DEDEDE]" />
								</InputAdornment>
							),
						}}
						className="tw-w-[350px]"
					/>
					{permissions?.Programs?.create && (
						<div className="tw-flex tw-gap-x-5">
							<Button variant="contained" disableElevation={true} onClick={() => navigate({ pathname: `/programs/add` })} className="uppercase !tw-font-semibold">
								Add new Program
							</Button>
						</div>
					)}
				</div>
			</div>
			<Paper className="tw-w-full tw-pt-6 tw-mt-6">
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

						<div className="tw-flex tw-items-start tw-gap-6 tw-justify-between tw-w-[400px] ">
							<div className="tw-flex tw-w-full tw-flex-col tw-items-start tw-gap-4">
								<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
									<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Select Status</span>
									<div className="tw-flex tw-justify-between tw-items-center tw-pl-4 tw-w-[260px]">
										<Dropdown
											label="All Statuses"
											bgColor="rgba(255, 196, 12, 0.24)"
											value={filterDataPopOver?.status}
											onChange={(e) => {
												// onStatusChange(e);
												onChangeDropDownFilter(e, 'status');
												dispatch(fillProgramFilterStatus(e));
											}}
											labelkey="label"
											valuekey="value"
											options={status}
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
										style={{ maxWidth: '300px' }}
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
										disabled={filterDistrict.length===0}

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
										disabled={filterBlock.length===0}

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
										disabled={filterPanchayat.length===0}
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


				<>
					{!loader ? (
						<>
							{list.length > 0 ? (
								<EnhancedTable
									handleManage={handleManage}
									scrollable
									columns={header}
									data={list}
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
									<span>No Programs Found</span>
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
