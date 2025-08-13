import React, { useEffect, useState } from 'react'
import MasterHeader from '../../components/Masters/MasterHeader';
import { Container } from '../../components/Container';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TableMaster from '../../components/Masters/TableMaster';
import { exportDistrict, geUserNameList, getDistrictList } from './duck/network';
import { CircularProgress } from '@mui/material';
import FilterExportDistrict from '../../components/Masters/FilterExportDistrict';
import { Button, Popover, TextField } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { Dropdown } from '../../components/Select';
import { fillApplyFilter, fillMaxBlockZonesCount, fillMaxCEWCount, fillMaxPanchayatWardsCount, fillMaxParentCount, fillMaxProgramCount, fillMaxSupervisorCount, fillMaxVillageAreasCount, fillMinBlockZonesCount, fillMinCEWCount, fillMinPanchayatWardsCount, fillMinParentCount, fillMinProgramCount, fillMinSupervisorCount, fillMinVillageAreasCount, fillPageNum, fillPerPageNum, setDistrictloading } from './duck/DistrictsSlice';
import filter_on from '../../../public/assets/icons/filter_on.svg';



export default React.memo(function Districts() {
	const [list, setList] = useState([]);
	const pageNum = useSelector((state) => state.district.pageNum)
	const [page, setPage] = useState(pageNum);
	const perPageNum = useSelector((state) => state.district.perPageNum)
	const [limitPerPage, setLimitPerPage] = useState(perPageNum);
	const [anchorEl, setAnchorEl] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [inputAdded, setInputAdded] = useState(false);
	const [permissions, setPermissions] = useState({})

	const minBlockZonesCount = useSelector((state) => state.district.minBlockZonesCount)
	const maxBlockZonesCount = useSelector((state) => state.district.maxBlockZonesCount)
	const minPanchayatWardsCount = useSelector((state) => state.district.minPanchayatWardsCount)
	const maxPanchayatWardsCount = useSelector((state) => state.district.maxPanchayatWardsCount)
	const minVillageAreasCount = useSelector((state) => state.district.minVillageAreasCount)
	const maxVillageAreasCount = useSelector((state) => state.district.maxVillageAreasCount)
	const minCEWCount = useSelector((state) => state.district.minCEWCount)
	const maxCEWCount = useSelector((state) => state.district.maxCEWCount)
	const minSupervisorCount = useSelector((state) => state.district.minSupervisorCount)
	const maxSupervisorCount = useSelector((state) => state.district.maxSupervisorCount)
	const minParentCount = useSelector((state) => state.district.minParentCount)
	const maxParentCount = useSelector((state) => state.district.maxParentCount)
	const minProgramCount = useSelector((state) => state.district.minProgramCount)
	const maxProgramCount = useSelector((state) => state.district.maxProgramCount)
	const applyFilter = useSelector((state) => state.district.applyFilter)

	const [filterDataPopOver, setFilterDataPopOver] = useState({
		minBlockZonesCount: minBlockZonesCount,
		maxBlockZonesCount: maxBlockZonesCount,
		minPanchayatWardsCount: minPanchayatWardsCount,
		maxPanchayatWardsCount: maxPanchayatWardsCount,
		minVillageAreasCount: minVillageAreasCount,
		maxVillageAreasCount: maxVillageAreasCount,
		minCEWCount: minCEWCount,
		maxCEWCount: maxCEWCount,
		minSupervisorCount: minSupervisorCount,
		maxSupervisorCount: maxSupervisorCount,
		minParentCount: minParentCount,
		maxParentCount: maxParentCount,
		minProgramCount: minProgramCount,
		maxProgramCount: maxProgramCount,
		assignedSeniorSupervisorId: null
	});

	const [filterErrors, setFilterErrors] = useState({
		minBlockZonesCount: "",
		maxBlockZonesCount: "",
		minPanchayatWardsCount: "",
		maxPanchayatWardsCount: "",
		minVillageAreasCount: "",
		maxVillageAreasCount: "",
		minCEWCount: "",
		maxCEWCount: "",
		minSupervisorCount: "",
		maxSupervisorCount: "",
		minParentCount: "",
		maxParentCount: "",
		minProgramCount: "",
		maxProgramCount: "",

	});
	const errors = {
		minBlockZonesCount: "",
		maxBlockZonesCount: "",
		minPanchayatWardsCount: "",
		maxPanchayatWardsCount: "",
		minVillageAreasCount: "",
		maxVillageAreasCount: "",
		minCEWCount: "",
		maxCEWCount: "",
		minSupervisorCount: "",
		maxSupervisorCount: "",
		minParentCount: "",
		maxParentCount: "",
		minProgramCount: "",
		maxProgramCount: "",

	};

	useEffect(() => {
		let timeoutId;
		dispatch(setDistrictloading(true));

		if (!searchText) {
			if (applyFilter) {
				timeoutId = setTimeout(() => {
					dispatch(
						getDistrictList({
							page: page,
							per_page: limitPerPage,
							...filterDataPopOver
						})
					).then((resp) => {

						formatForDisplay(resp?.data);
					});
				}, 500);
			} else {
				timeoutId = setTimeout(() => {
					dispatch(
						getDistrictList({
							page: page,
							per_page: limitPerPage,
						})
					).then((resp) => {

						formatForDisplay(resp?.data);
					});
				}, 500);
			}
		} else {

			timeoutId = setTimeout(() => {
				dispatch(
					getDistrictList({
						page: 1,
						search: searchText,
						per_page: limitPerPage,
						...filterDataPopOver
					})
				).then((resp) => {

					formatForDisplay(resp?.data);
				});
			}, 500);
		}



		return () => clearTimeout(timeoutId);
	}, [limitPerPage, searchText]);






	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loader = useSelector((state) => state.district.districtLoading);
	const paginateInfo = useSelector((state) => state.district.paginateInfo);
	const userName = useSelector((state) => state.district.userNameList);
	const districtList = useSelector((state) => state.district.districtList);

	const header = [
		{
			id: 'name',
			numeric: false,
			disablePadding: true,
			label: 'District Name',
			sort: true,
			width: 150,
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
			id: 'no_of_block_zones',
			numeric: false,
			disablePadding: true,
			label: 'No.of  Block/Zone',
			sort: true,
			width: 200,
		},
		{
			id: 'no_of_panchayat_wards',
			numeric: false,
			disablePadding: true,
			label: 'No.of  Panchayat/Ward',
			sort: true,
			width: 200,
		},
		{
			id: 'no_of_village_areas',
			numeric: false,
			disablePadding: true,
			label: 'No.of  Village/Area',
			sort: true,
			width: 200,
		},
		{
			id: 'no_of_parents',
			numeric: false,
			disablePadding: true,
			label: 'No.of  Total Parents',
			sort: true,
			width: 200,
		},
		{
			id: 'no_of_programs_assigned',
			numeric: false,
			disablePadding: true,
			label: 'No.of  Program Assigned',
			sort: true,
			width: 200,
		},
		{
			id: 'no_of_supervisors',
			numeric: false,
			disablePadding: true,
			label: 'No.of  Supervisor',
			sort: true,
			width: 150,
		},
		{
			id: 'no_of_cews',
			numeric: false,
			disablePadding: true,
			label: 'No.of  CEWs',
			sort: true,
			width: 150,
		},
	];

	const open = Boolean(anchorEl);

	const id = open ? 'simple-popover' : undefined;

	const handleClose = () => {
		setAnchorEl(null);
	};


	const handleClick = (event) => {
		//console.lo("xyz")
		if (!applyFilter) {
			setFilterDataPopOver({
				minBlockZonesCount: null,
				maxBlockZonesCount: null,
				minPanchayatWardsCount: null,
				maxPanchayatWardsCount: null,
				minVillageAreasCount: null,
				maxVillageAreasCount: null,
				minCEWCount: null,
				maxCEWCount: null,
				minSupervisorCount: null,
				maxSupervisorCount: null,
				minParentCount: null,
				maxParentCount: null,
				minProgramCount: null,
				maxProgramCount: null,
			})
			setInputAdded(false)
			dispatch(fillMinBlockZonesCount(null))
			dispatch(fillMaxBlockZonesCount(null))
			dispatch(fillMinPanchayatWardsCount(null))
			dispatch(fillMaxPanchayatWardsCount(null))
			dispatch(fillMinVillageAreasCount(null))
			dispatch(fillMaxVillageAreasCount(null))
			dispatch(fillMinSupervisorCount(null))
			dispatch(fillMaxSupervisorCount(null))
			dispatch(fillMinCEWCount(null))
			dispatch(fillMaxCEWCount(null))
			dispatch(fillMinParentCount(null))
			dispatch(fillMaxParentCount(null))
			dispatch(fillMinProgramCount(null))
			dispatch(fillMaxProgramCount(null))
		}
		setAnchorEl(event.currentTarget);
	}




	useEffect(() => {
		const userPermissions = JSON.parse(localStorage.getItem('permissions'))
		setPermissions(userPermissions["Masters"]["Districts"])
	}, [])


	const onChangeFilter = (e, type) => {
		setPage(1);
		const updateFilterData = (key, value) => {
			setFilterDataPopOver({ ...filterDataPopOver, [key]: value });
			setInputAdded(true);

		};

		const typeToKey = {
			'minBlockZonesCount': 'minBlockZonesCount',
			'maxBlockZonesCount': 'maxBlockZonesCount',
			'minPanchayatWardsCount': 'minPanchayatWardsCount',
			'maxPanchayatWardsCount': 'maxPanchayatWardsCount',
			"minVillageAreasCount": "minVillageAreasCount",
			"maxVillageAreasCount": "maxVillageAreasCount",
			"minCEWCount": "minCEWCount",
			"maxCEWCount": "maxCEWCount",
			"minSupervisorCount": "minSupervisorCount",
			"maxSupervisorCount": "maxSupervisorCount",
			"minParentCount": "minParentCount",
			"maxParentCount": "maxParentCount",
			"minProgramCount": "minProgramCount",
			"maxProgramCount": "maxProgramCount",
		};

		const key = typeToKey[type];

		if (key) {
			updateFilterData(key, e);
		}
	};

	const ResetFilter = () => {
		setFilterErrors({});

		dispatch(fillMinBlockZonesCount(null))
		dispatch(fillMaxBlockZonesCount(null))
		dispatch(fillMinPanchayatWardsCount(null))
		dispatch(fillMaxPanchayatWardsCount(null))
		dispatch(fillMinVillageAreasCount(null))
		dispatch(fillMaxVillageAreasCount(null))
		dispatch(fillMinSupervisorCount(null))
		dispatch(fillMaxSupervisorCount(null))
		dispatch(fillMinCEWCount(null))
		dispatch(fillMaxCEWCount(null))
		dispatch(fillMinParentCount(null))
		dispatch(fillMaxParentCount(null))
		dispatch(fillMinProgramCount(null))
		dispatch(fillMaxProgramCount(null))

		dispatch(fillMinBlockZonesCount(null))
		dispatch(fillApplyFilter(false))
		setFilterDataPopOver({
			minBlockZonesCount: null,
			maxBlockZonesCount: null,
			minPanchayatWardsCount: null,
			maxPanchayatWardsCount: null,
			minVillageAreasCount: null,
			maxVillageAreasCount: null,
			minCEWCount: null,
			maxCEWCount: null,
			minSupervisorCount: null,
			maxSupervisorCount: null,
			minParentCount: null,
			maxParentCount: null,
			minProgramCount: null,
			maxProgramCount: null,
		});
		setInputAdded(false);
		dispatch(fillApplyFilter(false))

		setAnchorEl(null);
		dispatch(
			getDistrictList({
				page: page,
				per_page: limitPerPage,
			})
		).then((resp) => {

			formatForDisplay(resp?.data);
		});

	}

	const ApplyFilter = () => {
		dispatch(fillApplyFilter(true))

		setFilterErrors({});


		['BlockZonesCount', 'PanchayatWardsCount', 'VillageAreasCount', 'CEWCount', "SupervisorCount", "ParentCount", "ProgramCount"].forEach(field => {
			const minField = `min${field}`;
			const maxField = `max${field}`;

			if (parseFloat(filterDataPopOver[maxField]) === 0) {
				errors[maxField] = 'Max must be greater than or equal to Min';
			} else if (
				filterDataPopOver[minField] !== null &&
				filterDataPopOver[maxField] !== null &&
				parseFloat(filterDataPopOver[minField]) > parseFloat(filterDataPopOver[maxField])
			) {
				errors[maxField] = 'Max must be greater than or equal to Min';
			} else {
				errors[maxField] = '';
			}
		});


		if (Object.values(errors).every((value) => value === '')) {

			setAnchorEl(null);
			dispatch(
				getDistrictList({
					page: page,
					per_page: limitPerPage,
					...filterDataPopOver,
				})
			).then((resp) => {

				formatForDisplay(resp?.data);
			});
		} else {
			setFilterErrors(errors);
		}
	}






	const formatForDisplay = (data) => {
		const formatedRows = [];

		data?.length > 0 &&
			data?.forEach((item) => {
				formatedRows.push({
					id: item.id,
					name: item.name,
					assigned_senior_supervisors: item.assigned_senior_supervisors,
					no_of_block_zones: item.no_of_block_zones,
					no_of_panchayat_wards: item.no_of_panchayat_wards,
					no_of_village_areas: item.no_of_village_areas,
					no_of_parents: item.no_of_parents,
					no_of_programs_assigned: item.no_of_programs_assigned,
					no_of_supervisors: item.no_of_supervisors,
					no_of_cews: item.no_of_cews,
				});
			});
		setList(formatedRows);
	};


	const handleSearch = (e) => {
		setSearchText(e.target.value);
	};

	const onNavigateDetails = (id) => {
		navigate({ pathname: `/district-details/${id}` });
	};


	const onPageChange = (page) => {
		dispatch(fillPageNum(page));

		setPage(page);
		dispatch(
			getDistrictList({
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
			label: 'No.of  Block/Zone',
			minField: 'minBlockZonesCount',
			maxField: 'maxBlockZonesCount',
			filter1: fillMinBlockZonesCount,
			filter2: fillMaxBlockZonesCount,
			error: filterErrors.maxBlockZonesCount
		},
		{
			label: 'No.of  Panchayat/Ward',
			minField: 'minPanchayatWardsCount',
			maxField: 'maxPanchayatWardsCount',
			filter1: fillMinPanchayatWardsCount,
			filter2: fillMaxPanchayatWardsCount,
			error: filterErrors.maxPanchayatWardsCount
		},
		{
			label: 'No.of  Village/Area',
			minField: 'minVillageAreasCount',
			maxField: 'maxVillageAreasCount',
			filter1: fillMinVillageAreasCount,
			filter2: fillMaxVillageAreasCount,
			error: filterErrors.maxVillageAreasCount
		},
		{
			label: 'No.of  Total Parents',
			minField: 'minParentCount',
			maxField: 'maxParentCount',
			filter1: fillMinParentCount,
			filter2: fillMaxParentCount,
			error: filterErrors.maxParentCount
		}
	];

	const fields2 = [
		{
			label: 'No.of CEWs',
			minField: 'minCEWCount',
			maxField: 'maxCEWCount',
			filter1: fillMinCEWCount,
			filter2: fillMaxCEWCount,
			error: filterErrors.maxCEWCount
		},
		{
			label: 'No.of Supervisor',
			minField: 'minSupervisorCount',
			maxField: 'maxSupervisorCount',
			filter1: fillMinSupervisorCount,
			filter2: fillMaxSupervisorCount,
			error: filterErrors.maxSupervisorCount
		},
		{
			label: 'No.of Program Assigned',
			minField: 'minProgramCount',
			maxField: 'maxProgramCount',
			filter1: fillMinProgramCount,
			filter2: fillMaxProgramCount,
			error: filterErrors.maxProgramCount
		},

	];

	const ExportData = () => {
		dispatch(exportDistrict())
	}


	return (
		<div>
			<div className='tw-pb-3 '>
				<MasterHeader title={"Districts"} placeHolderName={"Search by District Name"} handleSearch={handleSearch} navigateValue={"/district/add"} addBtnName={"Add New District"} permissions={permissions} />
			</div>
			<Container>
				<div className='tw-pr-3  tw-flex tw-justify-end  tw-gap-4'>
					<Button
						variant="outlined"
						onClick={() => ExportData()}>
						Export Data
					</Button>
					<Button
						variant="outlined"
						onClick={handleClick}
						endIcon={!applyFilter ? <FilterListIcon className="tw-text-primary" /> : <img src={filter_on} />}>
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

						<div className='tw-flex tw-justify-between tw-w-full tw-pb-5 '>
							<div>
								<h2 className='tw-text-2xl tw-text-secondaryText tw-font-bold'>Districts</h2>
							</div>
							<div onClick={handleClose} className='tw-cursor-pointer '>
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
													onChangeFilter(e.target.value, field.minField)
													dispatch(field.filter1(e.target.value))

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
													onChangeFilter(e.target.value, field.maxField)
													dispatch(field.filter2(e.target.value))
												}}
												value={filterDataPopOver[field.maxField]}
												className="tw-w-[33.33%]"
											/>
										</div>
										{field.error && (
											<div key={index + 'error'} className="tw-text-red-500 tw-text-sm tw-flex tw-justify-end">{field.error}</div>
										)}
									</>))}
							</div>
							<div className="tw-flex tw-flex-col tw-items-start tw-w-1/2 tw-gap-4">

								{fields2.map((field, index) => (
									<>
										<div key={index} className="tw-flex tw-items-center tw-self-stretch tw-gap-2 tw-justify-between">
											<span className="tw-text-xs  tw-font-normal tw-text-grey block tw-w-1/2">{field.label}</span>
											<TextField
												size="small"
												type="number"
												placeholder="Min"
												onChange={(e) => {
													onChangeFilter(e.target.value, field.minField)
													dispatch(field.filter1(e.target.value))

												}}
												value={filterDataPopOver[field.minField]}
												className="tw-w-[33.33%] "
											/>
											<span className="tw-text-xs tw-font-normal tw-text-grey block">-</span>
											<TextField
												size="small"
												type="number"
												placeholder="Max"
												onChange={(e) => {
													onChangeFilter(e.target.value, field.maxField)
													dispatch(field.filter2(e.target.value))
												}}
												value={filterDataPopOver[field.maxField]}
												className="tw-w-[33.33%]"
											/>
										</div>
										{field.error && (
											<div key={index + 'error'} className="tw-text-red-500 tw-text-sm tw-flex tw-justify-end">{field.error}</div>
										)}
									</>))}

								<div className="tw-flex tw-justify-end  tw-self-stretch tw-gap-3 tw-pt-12">
									<Button variant={!inputAdded && !applyFilter ? 'contained' : 'outlined'} onClick={ResetFilter} disabled={!inputAdded && !applyFilter} className={`${!inputAdded && !applyFilter ? 'uppercase !tw-bg-[#FAFAFA] tw-w-[55%] !tw-text-grey !tw-shadow-none' : 'uppercase tw-w-[55%] !tw-shadow-none`'}`}>
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
									dispatchperPage={fillPerPageNum}
								/>
							) : (
								<div className="tw-p-6 tw-mt-5 tw-bg-[#FAFCFE] tw-text-SecondaryTextColor tw-font-normal tw-text-sm tw-text-center tw-rounded-lg">
									<span>No Data Found. Click Add New Button to add a new Districts</span>
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
	)
})
