import React, { useEffect, useState } from 'react'
import MasterHeader from '../../components/Masters/MasterHeader';
import { Container } from '../../components/Container';

import FilterExport from '../../components/Masters/FilterExportDistrict';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TableMaster from '../../components/Masters/TableMaster';
import { exportVillageArea, getVillageList } from './duck/network';
import { CircularProgress } from '@mui/material';
import { Button, Popover, TextField } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { Dropdown } from '../../components/Select';
import { getCEWNameList, getSrSupervisorNameList, getSupervisorNameList, getUserNameList } from '../Districts/duck/network';
import { fillApplyFilter, fillAssignedSeniorSupervisorId, fillAssignedSupervisorId, fillMaxParentCount, fillMinParentCount, fillPerPageNum, fillassignedCEWId, setLoading } from './duck/VillageSlice';
import DropDownWithSearch from '../../components/Masters/DropDownWithSearch';
import filter_on from '../../../public/assets/icons/filter_on.svg';


export default function Village() {
	const [list, setList] = useState([]);
	const pageNum = useSelector((state) => state.village.pageNum)
	const [page, setPage] = useState(pageNum);
	const perPageNum = useSelector((state) => state.village.perPageNum)
	const [limitPerPage, setLimitPerPage] = useState(perPageNum);
	const [anchorEl, setAnchorEl] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [inputAdded, setInputAdded] = useState(false);
	const [permissions, setPermissions] = useState({})
	const [cewName, setCewName] = useState([])
	const [srSupervisorName, setSrSupervisorName] = useState([])
	const [supervisorName, setSupervisorName] = useState([])

	const assignedCEWId = useSelector((state) => state.village.assignedCEWId)
	const assignedSeniorSupervisorId = useSelector((state) => state.village.assignedSeniorSupervisorId)
	const minParentCount = useSelector((state) => state.village.minParentCount)
	const maxParentCount = useSelector((state) => state.village.maxParentCount)
	const applyFilter = useSelector((state) => state.village.applyFilter)
	const assignedSupervisorId = useSelector((state) => state.village.assignedSupervisorId)

	const [filterDataPopOver, setFilterDataPopOver] = useState({
		assignedSeniorSupervisorId: assignedSeniorSupervisorId,
		assignedSupervisorId: assignedSupervisorId,
		assignedCEWId: assignedCEWId,
		minParentCount: minParentCount,
		maxParentCount: maxParentCount,
	});

	const [filterErrors, setFilterErrors] = useState({
		assignedSupervisorId: "",
		assignedSeniorSupervisorId: "",
		assignedCEWId: "",
		minParentCount: "",
		maxParentCount: "",
	});
	const errors = {
		assignedSupervisorId: "",
		assignedSeniorSupervisorId: "",
		assignedCEWId: "",
		minParentCount: "",
		maxParentCount: "",
	};
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loader = useSelector((state) => state.village.loading);
	const paginateInfo = useSelector((state) => state.village.paginateInfo);
	// const CEWName = useSelector((state) => state.district.CEWNameList);
	// const supervisorName = useSelector((state) => state.district.supervisorNameList);
	// const srSupervisorName = useSelector((state) => state.district.srSupervisorNameList);


	const header = [
		{
			id: 'name',
			numeric: false,
			disablePadding: true,
			label: 'Village/Area Name',
			sort: true,
			width: 220,
		},
		{
			id: 'assigned_district',
			numeric: false,
			disablePadding: true,
			label: 'District Name',
			sort: true,
			width: 220,
		},
		{
			id: 'assigned_block_zone',
			numeric: false,
			disablePadding: true,
			label: 'Block/Zone',
			sort: true,
			width: 220,
		},

		{
			id: 'assigned_panchayat_ward',
			numeric: false,
			disablePadding: true,
			label: 'Panchayat/Ward',
			sort: true,
			width: 220,
		},
		{
			id: 'assigned_cews',
			numeric: false,
			disablePadding: true,
			label: 'Assigned CEW',
			sort: true,
			width: 220,
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
			id: 'assigned_senior_supervisors',
			numeric: false,
			disablePadding: true,
			label: 'Assigned sr. Supervisor',
			sort: true,
			width: 250,
		},
		{
			id: 'no_of_parents',
			numeric: false,
			disablePadding: true,
			label: 'No.of Parents',
			sort: true,
			width: 220,
		},

	];


	useEffect(() => {
		const userPermissions = JSON.parse(localStorage.getItem('permissions'))
		setPermissions(userPermissions["Masters"]["Village/Area"])
	}, [])
	useEffect(() => {
		let timeoutId;
		dispatch(setLoading(true));

		if (!searchText) {

			if (applyFilter) {
				timeoutId = setTimeout(() => {
					dispatch(
						getVillageList({
							page: page,
							per_page: limitPerPage,
							...filterDataPopOver
						})
					).then((resp) => {
						formatForDisplay(resp?.data);
					});

				}, 100);
			} else {
				timeoutId = setTimeout(() => {
					dispatch(
						getVillageList({
							page: page,
							per_page: limitPerPage,
						})
					).then((resp) => {
						formatForDisplay(resp?.data);
					});

				}, 100);
			}
		} else {
			timeoutId = setTimeout(() => {
				dispatch(
					getVillageList({
						page: 1,
						search: searchText,
						per_page: limitPerPage,
						...filterDataPopOver
					})
				).then((resp) => {
					formatForDisplay(resp?.data);
				});
			}, 100);
		}


		return () => clearTimeout(timeoutId);
	}, [limitPerPage, searchText]);

	const handleSearch = (txt, type) => {

		if (type === "assignedSupervisorId") {
			dispatch(getSupervisorNameList({ ...filterDataPopOver, search: txt })).then((resp) => setSupervisorName(resp))
		}

		if (type === "assignedCEWId") {
			dispatch(getCEWNameList({ ...filterDataPopOver, search: txt })).then((resp) => setCewName(resp))
		}
		if (type === "assignedSeniorSupervisorId") {
			dispatch(getSrSupervisorNameList({ ...filterDataPopOver, search: txt })).then((resp) => setSrSupervisorName(resp))
		}

	}

	const formatForDisplay = (data) => {
		const formatedRows = [];

		data?.length > 0 &&
			data?.forEach((item) => {
				formatedRows.push({
					id: item.id,
					name: item.name,
					assigned_district: item.assigned_district,
					assigned_block_zone: item.assigned_block_zone,
					assigned_panchayat_ward: item.assigned_panchayat_ward,
					assigned_cews: item.assigned_cews,
					assigned_supervisors: item.assigned_supervisors,
					assigned_senior_supervisors: item.assigned_senior_supervisors,
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

		if (!applyFilter) {
			setFilterDataPopOver({
				assignedSeniorSupervisorId: null,
				assignedSupervisorId: null,
				assignedCEWId: null,
				minParentCount: null,
				maxParentCount: null,
			})
			setInputAdded(false)
			dispatch(fillassignedCEWId(null))
			dispatch(fillAssignedSeniorSupervisorId(null))
			dispatch(fillMinParentCount(null))
			dispatch(fillMaxParentCount(null))
			dispatch(fillAssignedSupervisorId(null))
		}


		dispatch(getSrSupervisorNameList()).then((resp) => setSrSupervisorName(resp))
		dispatch(getSupervisorNameList({ senior_supervisor_id: filterDataPopOver?.assignedSeniorSupervisorId })).then((resp) => setSupervisorName(resp))
		dispatch(getCEWNameList({ supervisor_id: filterDataPopOver?.assignedSupervisorId })).then((resp) => setCewName(resp))
		setAnchorEl(event.currentTarget);
	}
	const onChangeFilter = (e, type) => {
		setPage(1);
		const updateFilterData = (key, value) => {
			setFilterDataPopOver({ ...filterDataPopOver, [key]: value });
			setInputAdded(true);
			if (type === "assignedSeniorSupervisorId") {
				dispatch(getSupervisorNameList({ senior_supervisor_id: value })).then((resp) => setSupervisorName(resp))
				setCewName([])
				setFilterDataPopOver({
					...filterDataPopOver,
					assignedSupervisorId: null,
					assignedCEWId: null,
					[key]: value
				});
			}
			if (type === "assignedSupervisorId") {
				dispatch(getCEWNameList({ supervisor_id: value })).then((resp) => setCewName(resp))
				setFilterDataPopOver({
					...filterDataPopOver,
					assignedCEWId: null,
					[key]: value
				});
			}

			// if (type === "assignedCEWId") {
			// 	dispatch(getCEWNameList({ senior_supervisor_id: value })).then((resp) => setSupervisorName(resp))
			// }


		};
		// if (type === "assignedSupervisorId") {
		// 	dispatch(getSupervisorNameList({ senior_supervisor_id: e }))
		// }



		const typeToKey = {
			"minParentCount": "minParentCount",
			"maxParentCount": "maxParentCount",
			"assignedSupervisorId": "assignedSupervisorId",
			"assignedSeniorSupervisorId": "assignedSeniorSupervisorId",
			"assignedCEWId": "assignedCEWId",
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
		navigate({ pathname: `/village-area-details/${id}` });
	};


	const ResetFilter = () => {
		setFilterErrors({});
		setInputAdded(false);
		dispatch(fillApplyFilter(false))
		dispatch(fillassignedCEWId(null))
		dispatch(fillAssignedSeniorSupervisorId(null))
		dispatch(fillMinParentCount(null))
		dispatch(fillMaxParentCount(null))
		dispatch(fillAssignedSupervisorId(null))

		setFilterDataPopOver({
			assignedSupervisorId: null,
			assignedSeniorSupervisorId: null,
			assignedCEWId: null,
			minParentCount: null,
			maxParentCount: null,
		});

		setAnchorEl(null);

		dispatch(
			getVillageList({
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

		['CEWCount', 'VillageAreasCount', "ParentCount"].forEach(field => {
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
				getVillageList({
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


	const onPageChange = (page) => {
		setPage(page);
		dispatch(
			getVillageList({
				page: page,
				search: searchText,
				per_page: limitPerPage,
				...filterDataPopOver,
			})
		).then((resp) => {
			formatForDisplay(resp?.data);
		});
	};

	const fields = [{
		label: 'No.of  Total Parents',
		minField: 'minParentCount',
		maxField: 'maxParentCount',
		filter1: fillMinParentCount,
		filter2: fillMaxParentCount,
		error: filterErrors.maxParentCount
	}

	];

	const ExportData = () => {
		dispatch(exportVillageArea())
	}




	return (
		<>{<div>
			<div className='tw-pb-3'>
				<MasterHeader title={"Village"} placeHolderName={"Search by village/area name"} handleSearch={handleSearchHeader} navigateValue={"/village-area/add"} addBtnName={"Add New village/Area"} permissions={permissions} />
			</div>
			<Container>
				<div className='tw-pr-3  tw-flex tw-justify-end  tw-gap-4'>
					<Button
						variant="outlined"
						onClick={() => ExportData()}					>
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
								<h2 className='tw-text-2xl tw-text-secondaryText tw-font-bold'>Village/Area</h2>
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
								<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
									<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Assigned Supervisor</span>

									<DropDownWithSearch
										options={supervisorName}
										valuekey="id"
										labelkey="full_name"
										label="Assigned To"
										value={filterDataPopOver.assignedSupervisorId}
										onChange={(e) => {
											onChangeFilter(e, 'assignedSupervisorId')
											dispatch(fillAssignedSupervisorId(e))

										}}
										// value={filterDataPopOver.assignedSupervisorId}
										listSearch={getSupervisorNameList}
										searchText={(txt) => handleSearch(txt, "assignedSupervisorId")}
									/>

								</div>
							</div>
							<div className="tw-flex tw-flex-col tw-items-start tw-w-1/2 tw-gap-4">

								<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
									<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Assigned Sr.Supervisor</span>

									<DropDownWithSearch
										options={srSupervisorName}
										valuekey="id"
										labelkey="full_name"
										label="Assigned To"
										value={filterDataPopOver.assignedSeniorSupervisorId}
										onChange={(e) => {
											onChangeFilter(e, 'assignedSeniorSupervisorId')
											dispatch(fillAssignedSeniorSupervisorId(e))

										}}
										// value={filterDataPopOver.assignedSupervisorId}
										listSearch={getSrSupervisorNameList}
										searchText={(txt) => handleSearch(txt, "assignedSeniorSupervisorId")}
									/>

								</div>
								<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
									<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Assigned CEW</span>

									<DropDownWithSearch
										options={cewName}
										valuekey="id"
										labelkey="full_name"
										label="Assigned To"
										value={filterDataPopOver.assignedCEWId}
										onChange={(e) => {
											onChangeFilter(e, 'assignedCEWId')
											dispatch(fillassignedCEWId(e))

										}}
										// value={filterDataPopOver.assignedSupervisorId}
										listSearch={getSupervisorNameList}
										searchText={(txt) => handleSearch(txt, "assignedCEWId")}
									/>
								</div>

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
									<Button variant={!inputAdded && !applyFilter ? 'contained' : 'outlined'} onClick={ResetFilter} disabled={!inputAdded && !applyFilter} className={`${!inputAdded && !applyFilter ? 'uppercase !tw-bg-[#FAFAFA] tw-w-[55%] !tw-text-grey !tw-shadow-none' : 'uppercase tw-w-[55%] !tw-shadow-none`'}`}>
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
								{list.length ? (<TableMaster
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
										<span>No Data Found. Click Add New Button to add a new Village</span>
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
		</div>}

		</>
	)
}
