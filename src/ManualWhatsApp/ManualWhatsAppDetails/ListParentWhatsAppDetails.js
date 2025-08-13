import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from "@mui/icons-material/Search"

import { getManualWhatsAppStatus, getWhatsAppManualParentList } from '../duck/network';
import { CircularProgress, InputAdornment, Typography } from '@mui/material';
import { Button, Popover, TextField } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { fillFilterDistrict, fillFilterRole, fillFilterVillage, setLoading, fillApplyFilter, fillPageNum, fillProgramApplyFilter, fillProgramFilterDistrict, fillProgramFilterBlock, fillProgramFilterPanchayat, fillProgramFilterVillage, fillProgramFilterStatus, setPaginationPage } from '../duck/manualWhatsAppSlice';
import { Container } from '../../components/Container';
import TableMaster from '../../components/Masters/TableMaster';
import { Dropdown, DropdownWithNameKey } from '../../components/Select';
import DropDownWithSearch from '../../components/Masters/DropDownWithSearch';
import { getBlockNameList, getDistrictNameList, getPanchayatNameList, getVillageNameList } from '../../Masters/Districts/duck/network';
import SearchBox from '../../components/SearchBox';

import filter_on from '../../../public/assets/icons/filter_on.svg';
import DropDownWithFilterCheck from '../../components/Masters/DropDownWithFilterCheck';
import { getProgramName, getProgramUnit } from '../../Training/duck/network';
import { filltrainingProgramUnitVal, filltrainingProgramVal } from '../../Training/duck/trainingSlice';

export default React.memo(function ListParentWhatsAppDetails() {
	const [permissions, setPermissions] = useState({});
	const [list, setList] = useState([]);
	const pageNum = useSelector((state) => state.user.pageNum);
	const [page, setPage] = useState(pageNum);
	const perPageNum = useSelector((state) => state.user.perPageNum);
	const [limitPerPage, setLimitPerPage] = useState(perPageNum);
	const [searchText, setSearchText] = useState('');
	const [loader2, setLoader2] = useState(true);
	const [applyFilter,setApplyFilter]=useState(false)
	const [inputAdded, setInputAdded] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);


	const filterDistrict = useSelector((state) => state.manualWhatsApp.programfilterDistrict);
	const filterVillage = useSelector((state) => state.manualWhatsApp.programfilterVillage);
	const filterBlock = useSelector((state) => state.manualWhatsApp.programfilterBlock);
	const filterPanchayat = useSelector((state) => state.manualWhatsApp.programfilterPanchayat);
	const filterStatus = useSelector((state) => state.manualWhatsApp.programfilterStatus);
	// const applyFilter = useSelector((state) => state.manualWhatsApp.programApplyFilter);
	const whatsAppStatus1 = useSelector((state) => state.manualWhatsApp.whatsAppStatusNew);
	const trainingProgramUnit = useSelector((state) => state.training.trainingProgramUnit);
	const trainingProgramVal = useSelector((state) => state.training.trainingProgramVal);
	const trainingProgramUnitVal = useSelector((state) => state.training.trainingProgramUnitVal);
	
	// const whatsAppStatus1 = whatsAppStatus?.filter((data) => !(["not initiated", "delivered"].includes(data?.label?.toLowerCase())))

	const [filterDataPopOver, setFilterDataPopOver] = useState({
		programIds: "",
		programUnitIds: "",
		districtIds: "",
		villageAreaIds: "",
		blockZoneIds: "",
		panchayatWardIds: "",
		whatsappStatus: "",
	});
	const districtNameList = useSelector((state) => state.district.districtNameList);
	const blockNameList = useSelector((state) => state.district.blockNameList);
	const panchayatNameList = useSelector((state) => state.district.panchayatNameList);
	const villageNameList = useSelector((state) => state.district.villageNameList);
	const trainingProgram = useSelector((state) => state.training.trainingProgram);



	const params = useParams();
	useEffect(() => {

		const userPermissions = JSON.parse(localStorage.getItem('permissions'));
		setPermissions(userPermissions['Team Members']);
		dispatch(getProgramName());
	}, []);

	useEffect(() => {
		let timeoutId;

		if (!searchText) {
			if (applyFilter) {
				timeoutId = setTimeout(() => {
					dispatch(
						getWhatsAppManualParentList({
							page: page,
							per_page: limitPerPage,
							campaignId: params?.id,
							...filterDataPopOver,
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
						getWhatsAppManualParentList({
							page: page,
							per_page: limitPerPage,
							campaignId: params?.id,
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
					getWhatsAppManualParentList({
						page: 1,
						search: searchText,
						per_page: limitPerPage,
						campaignId: params?.id,
						...filterDataPopOver,
					})
				).then((resp) => {
					formatForDisplay(resp?.data);
				});
			}, 100);

		}
		// dispatch(getUserNameList({ type: "srsupervisor" }))

		return () => clearTimeout(timeoutId);
	}, [limitPerPage, searchText]);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loader = useSelector((state) => state.manualWhatsApp.loadingUser);
	const paginateInfo = useSelector((state) => state.manualWhatsApp.paginateInfoParent);





	const header = [
		{
			id: 'full_name',
			numeric: false,
			disablePadding: true,
			label: 'Parent List',
			sort: true,
			width: 200,
		},

		{
			id: 'whatsapp_number',
			numeric: false,
			disablePadding: true,
			label: 'WhatsApp',
			sort: true,
			width: 200,
		},
		{
			id: 'program_title',
			numeric: false,
			disablePadding: true,
			label: 'Program Name',
			sort: true,
			width: 200,
		},
		{
			id: 'program_unit_number',
			numeric: false,
			disablePadding: true,
			label: 'Unit Number',
			sort: true,
			width: 200,
		},
		{
			id: 'program_unit_name',
			numeric: false,
			disablePadding: true,
			label: 'Unit Name',
			sort: true,
			width: 200,
		},
		
	
		{
			id: 'assigned_district',
			numeric: false,
			disablePadding: true,
			label: 'District',
			sort: true,
			width: 250,
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
			id: 'whatsappStatus',
			numeric: false,
			disablePadding: true,
			label: 'Flow Status',
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
					full_name: item.full_name,
					whatsapp_number: item.whatsapp_number,
					program_title: item.program_title,
					program_unit_name: item.program_unit_name,
					program_unit_number: item.program_unit_number,
					assigned_district: item.assigned_district,
					assigned_block_zone: item.assigned_block_zone,
					assigned_panchayat_ward: item.assigned_panchayat_ward,
					assigned_village_area: item.assigned_village_area,
					whatsappStatus: item.whatsappStatus,
					whatsappErrorTitle: item.whatsappErrorTitle
				});
			});
		setList(formatedRows);
	};

	const handleSearch = (e) => {
		setSearchText(e.target.value);
	};

	const onNavigateDetails = (id) => {
		// navigate({ pathname: `/manual-whatsapp-details/${id}` });
	};

	const onPageChange = (page) => {
		setPage(page);
		// dispatch(fillPageNum(page));

		if (searchText.trim()) {
			dispatch(
				getWhatsAppManualParentList({
					page: page,
					per_page: limitPerPage,
					campaignId: params?.id,
					search: searchText,
				})
			).then((resp) => {
				formatForDisplay(resp?.data);
			});
		} else {
			dispatch(
				getWhatsAppManualParentList({
					page: page,
					per_page: limitPerPage,
					campaignId: params?.id,
				})
			).then((resp) => {
				formatForDisplay(resp?.data);
			});
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
	}


	const ResetFilter = () => {
		dispatch(fillProgramFilterDistrict(''));
		dispatch(fillProgramFilterBlock(''));
		dispatch(fillProgramFilterPanchayat(''));
		dispatch(fillProgramFilterVillage(''));
		dispatch(fillProgramFilterStatus(''));

		setFilterDataPopOver({
			programIds: "",
			programUnitIds: "",
			districtIds: '',
			blockZoneIds: '',
			panchayatWardIds: '',
			villageAreaIds: '',
			whatsappStatus: ""
		});
		// dispatch(fillProgramApplyFilter(false));
		setApplyFilter(false)
		setInputAdded(false);
		dispatch(getVillageNameList({ search: '' }));
		setAnchorEl(null);
		dispatch(
			getWhatsAppManualParentList({
				page: page,
				per_page: limitPerPage,
				campaignId: params?.id,
			})
		).then((resp) => {
			formatForDisplay(resp?.data);
		});

	}

	const ApplyFilter = () => {
		// dispatch(fillProgramApplyFilter(true));
		setApplyFilter(true)

		setAnchorEl(null);
		dispatch(
			getWhatsAppManualParentList({
				page: 1,
				per_page: limitPerPage,
				campaignId: params?.id,
				...filterDataPopOver,
			})
		).then((resp) => {

			formatForDisplay(resp?.data);
		});
		dispatch(setPaginationPage(1))
	};

	// const handleClick = (event) => {
	// 	setAnchorEl(event.currentTarget);
	// };

	const handleClick = (event) => {

		if (!applyFilter) {
			setFilterDataPopOver({
				programIds: "",
				programUnitIds: "",
				districtIds: '',
				blockZoneIds: '',
				panchayatWardIds: '',
				villageAreaIds: '',
				whatsappStatus: '',
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
			setFilterDataPopOver({ ...filterDataPopOver, [key]: value });
			setInputAdded(true);
		};


		if (type === 'programIds' && e) {
			dispatch(getProgramUnit({ programId: e }));
		
		}

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
			programIds: 'programIds',
			programUnitIds: 'programUnitIds',
			districtIds: 'districtIds',
			blockZoneIds: 'blockZoneIds',
			panchayatWardIds: 'panchayatWardIds',
			villageAreaIds: 'villageAreaIds',
			whatsappStatus: 'whatsappStatus',
		};

		const key = typeToKey[type];
		if (key) {
			updateFilterData(key, e);
		}
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

const a=[...trainingProgramUnit]?.sort((a,b)=>a?.unitNumber-b?.unitNumber)

	return (
		<div>
			<div className="tw-pb-3">
				<div className="tw-flex tw-justify-between"></div>
			</div>

			<Container>
				<div className="tw-px-5">
					<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
					Flow Activation Count
					</Typography>
				</div>
				<div className="tw-flex tw-justify-between tw-py-8 tw-px-5">
					<div className=" tw-py-2">
						{list?.length > 0 && <span className="tw-text-base   tw-text-[#666]">Total {paginateInfo?.total}</span>}
					</div>
					<div className="tw-pr-3  tw-flex tw-justify-end  tw-gap-4">
						<div className="tw-flex tw-gap-4">
							<TextField size="small" type="search" placeholder={"Search by Parent name and WhatsApp no."} onChange={handleSearch}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon className='tw-text-[#DEDEDE]' />
										</InputAdornment>
									),
								}} className='tw-w-[380px]'
							/>

						</div>
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
											<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Select Status</span>
											<div className="tw-flex tw-justify-between tw-items-center tw-pl-4 tw-w-[260px]">
												<Dropdown
													label="All Statuses"
													bgColor="rgba(255, 196, 12, 0.24)"
													value={filterDataPopOver?.whatsappStatus}
													onChange={(e) => {
														// onStatusChange(e);
														onChangeDropDownFilter(e, 'whatsappStatus');
														dispatch(fillProgramFilterStatus(e));
													}}
													labelkey="label"
													valuekey="contentType"
													options={whatsAppStatus1}
												/>
											</div>
										</div>
										<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3 ">
											<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Program Name</span>
											<div className="tw-flex tw-justify-between tw-items-center tw-pl-4 tw-w-[260px]">
												<Dropdown
													label="Program Name"
													bgColor="rgba(255, 196, 12, 0.24)"
													value={filterDataPopOver?.programIds}
													onChange={(e) => {
														// onStatusChange(e);
														onChangeDropDownFilter(e, 'programIds');
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
													value={filterDataPopOver?.programUnitIds}
													onChange={(e) => {
														// onStatusChange(e);
														onChangeDropDownFilter(e, 'programUnitIds');
														dispatch(filltrainingProgramUnitVal(e));
													}}
													labelkey="unitNumber"
													valuekey="id"
													options={a}
													disabled={!trainingProgramVal}
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
								/>
							) : (
								<div className="tw-p-6 tw-mt-5 tw-bg-[#FAFCFE] tw-text-SecondaryTextColor tw-font-normal tw-text-sm tw-text-center tw-rounded-lg">
									<span>No Data Found. Click Add New Button to add a new member</span>
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
