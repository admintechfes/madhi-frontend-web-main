import React, { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { exportMemberActivity, getUserList, getUserRoleNameList } from './duck/network';
import { CircularProgress } from '@mui/material';
import { Button, Popover, TextField } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { fillFilterDistrict, fillFilterRole, fillFilterVillage, setLoading, fillApplyFilter, fillPageNum, fillPerPageNum } from './duck/userSlice';
import { Container } from '../components/Container';
import TableMaster from '../components/Masters/TableMaster';
import MasterHeader from '../components/Masters/MasterHeader';
import { Dropdown, DropdownWithNameKey } from '../components/Select';
import DropDownWithSearch from '../components/Masters/DropDownWithSearch';
import { getDistrictNameList, getVillageNameList } from '../Masters/Districts/duck/network';
import SearchBox from '../components/SearchBox';
// import {filter_on} from '../../public/assets/icons/filter_on';
import filter_on from '../../public/assets/icons/filter_on.svg';
import ManualWhatsAppParentTable from '../ManualWhatsApp/ManualWhatsAppParentTable';
import { fillNotificationCampaignAddedUsers, setSelectedMember } from '../InAppNotifications/duck/notificationSlice';
// import successIcon from '../../../public/assets/icons/success.svg';

export default React.memo(function Users() {
	const [permissions, setPermissions] = useState({});
	const [list, setList] = useState([]);
	const pageNum = useSelector((state) => state.user.pageNum)
	const [page, setPage] = useState(pageNum);
	const perPageNum = useSelector((state) => state.user.perPageNum)
	const [limitPerPage, setLimitPerPage] = useState(perPageNum);
	const [anchorEl, setAnchorEl] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [loader2, setLoader2] = useState(true);
	const [inputAdded, setInputAdded] = useState(false);
	const [notApplyFilter, setNotApplyFilter] = useState(true);

	const filterDistrict = useSelector((state) => state.user.filterDistrict);
	const filterVillage = useSelector((state) => state.user.filterVillage);
	const filterRole = useSelector((state) => state.user.filterRole);
	const applyFilter = useSelector((state) => state.user.applyFilter);
	const [filterDataPopOver, setFilterDataPopOver] = useState({
		district_id: filterDistrict,
		village_area_id: filterVillage,
		role_id: filterRole,
	});

	const districtName = useSelector((state) => state.district.districtNameList);
	const villageName = useSelector((state) => state.district.villageNameList);
	const roleWiseName = useSelector((state) => state.user.userRoleNameList);
	const userRoleType = JSON.parse(localStorage.getItem('user'));
	const roleName = userRoleType?.role_type === 'srsupervisor' ? roleWiseName.filter((item) => item?.name !== 'Senior Supervisor') : roleWiseName;
	const location = useLocation();
	const redirectFrom = location?.state?.redirectFrom;
	const selected = useSelector((state) => state.notification.addedMembers)
	const [submittedSelectedUsers, setSubmittedSelectedUsers] = useState(selected)
	const [openexport, setOpenExport] = useState(false)


	useEffect(() => {
		const userPermissions = JSON.parse(localStorage.getItem('permissions'));
		setPermissions(userPermissions['Team Members']);
	}, []);

	useEffect(() => {
		let timeoutId;

		if (!searchText) {
			if (applyFilter) {
				timeoutId = setTimeout(() => {
					dispatch(
						getUserList({
							page: page,
							per_page: limitPerPage,
							...filterDataPopOver,
							...(redirectFrom && ({ multi_role_type: ["cew", "supervisor"] }))
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
						getUserList({
							page: page,
							per_page: limitPerPage,
							...(redirectFrom && ({ multi_role_type: ["cew", "supervisor"] }))
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
					getUserList({
						page: 1,
						search: searchText,
						per_page: limitPerPage,
						...filterDataPopOver,
						...(redirectFrom && ({ multi_role_type: ["cew", "supervisor"] }))
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

	const loader = useSelector((state) => state.user.loadingUser);
	const paginateInfo = useSelector((state) => state.user.paginateInfo);


	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = (event) => {
		if (!applyFilter) {
			setFilterDataPopOver({
				district_id: '',
				village_area_id: '',
				role_id: '',
			});
			setInputAdded(false);
			dispatch(fillFilterDistrict(''));
			dispatch(fillFilterVillage(''));
			dispatch(fillFilterRole(''));
		}
		dispatch(getUserRoleNameList());
		dispatch(getDistrictNameList());
		setAnchorEl(event.currentTarget);
	};

	const header = [
		{
			id: 'full_name',
			numeric: false,
			disablePadding: true,
			label: 'Name',
			sort: true,
			width: 200,
		},

		{
			id: 'role_name',
			numeric: false,
			disablePadding: true,
			label: 'Role',
			sort: true,
			width: 200,
		},
		{
			id: 'assigned_districts',
			numeric: false,
			disablePadding: true,
			label: 'Assigned District',
			sort: true,
			width: 200,
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
			id: 'assigned_village_area',
			numeric: false,
			disablePadding: true,
			label: 'Village/Area',
			sort: true,
			width: 200,
		},
		{
			id: 'email',
			numeric: false,
			disablePadding: true,
			label: 'Email',
			sort: true,
			width: 200,
		},
		{
			id: 'mobile',
			numeric: false,
			disablePadding: true,
			label: 'Mobile No.',
			sort: true,
			width: 200,
		},
		{
			id: 'created_at',
			numeric: false,
			disablePadding: true,
			label: 'Account Created On',
			sort: true,
			width: 200,
		},
	];

	const open = Boolean(anchorEl);

	const id = open ? 'simple-popover' : undefined;

	const formatForDisplay = (data) => {
		const formatedRows = [];

		data?.length > 0 &&
			data?.forEach((item) => {
				formatedRows.push({
					id: item.id,
					full_name: item.full_name,
					role_name: item.role_name,
					role_type: item.role_type,
					assigned_districts: item.assigned_districts,
					assigned_village_area: item.assigned_village_area,
					email: item.email,
					mobile: item.mobile,
					created_at: item.created_at,
					assigned_senior_supervisors: item.assigned_senior_supervisors
				});
			});
		setList(formatedRows);
	};

	const handleSearch = (e) => {
		setSearchText(e.target.value);
	};

	const onNavigateDetails = (id) => {
		navigate({ pathname: `/team-member-details/${id}` });
	};

	const onPageChange = (page) => {
		setPage(page);
		dispatch(fillPageNum(page))

		dispatch(
			getUserList({
				page: page,
				per_page: limitPerPage,
				search: searchText,
				...filterDataPopOver,
				...(redirectFrom && ({ multi_role_type: ["cew", "supervisor"] }))
			})
		).then((resp) => {
			formatForDisplay(resp?.data);
		});
	};

	const ResetFilter = () => {
		dispatch(fillFilterDistrict(''));
		dispatch(fillFilterVillage(''));
		dispatch(fillFilterRole(''));

		setFilterDataPopOver({
			district_id: '',
			village_area_id: '',
			role_id: '',
		});
		dispatch(fillApplyFilter(false));
		setInputAdded(false);
		dispatch(getVillageNameList({ search: '' }));
		setAnchorEl(null);
		dispatch(
			getUserList({
				page: page,
				per_page: limitPerPage,
				...(redirectFrom && ({ multi_role_type: ["cew", "supervisor"] }))
			})
		).then((resp) => {
			formatForDisplay(resp?.data);
		});
	};

	const ApplyFilter = () => {
		dispatch(fillApplyFilter(true));

		setAnchorEl(null);
		dispatch(
			getUserList({
				page: page,
				per_page: limitPerPage,
				...filterDataPopOver,
				...(redirectFrom && ({ multi_role_type: ["cew", "supervisor"] }))
			})
		).then((resp) => {
			// setNotApplyFilter(false)
			formatForDisplay(resp?.data);
		});
	};
	const handleSearchDrop = (txt, type) => {
		if (type == 'district') {
			dispatch(getDistrictNameList(txt));
		}

		if (type === 'village_area_id') {
			dispatch(getVillageNameList({ search: txt, district_id: filterDataPopOver.district_id }));
		}

		if (type === 'role_id') {
			dispatch(getVillageNameList());
		}
	};

	const onChangeDropDownFilter = (e, type) => {
		setPage(1);
		const updateFilterData = (key, value) => {
			setFilterDataPopOver({ ...filterDataPopOver, [key]: value });
			setInputAdded(true);
		};

		if (type === 'district_id') {
			// setDisabledState(false)
			dispatch(getVillageNameList({ district_id: e }));
		}
		const typeToKey = {
			district_id: 'district_id',
			village_area_id: 'village_area_id',
			role_id: 'role_id',
		};

		const key = typeToKey[type];
		if (key) {
			updateFilterData(key, e);
		}
	};

	const AddNewTeamMember = () => {
		navigate({ pathname: '/team-member/add' });
	};


	const handleAddUsers = () => {
		navigate(-1, { state: { ...location.state } });
	}

	const handleSelected = (selectedData) => {
		setSubmittedSelectedUsers(selectedData)
		dispatch(setSelectedMember(selectedData))
	};

	const openET = Boolean(openexport);
	const id2 = openET ? 'simple-popover' : undefined;


	const handleOpenExport = (e) => {
		setOpenExport(e.currentTarget)
	}

	const handleCloseExport = () => setOpenExport(false)

	const ExportData = [
		{ title: "Export All CEW Activity", role: "cew" },
		{ title: "Export All Supervisor Activity", role: "supervisor" },
		{ title: "Export All members detail", role: "all" }
	]

	const onSubmitExport = (role) => {
		setOpenExport(false)
		dispatch(exportMemberActivity({ role: role }))
	}

	return (
		<div>
			<div className="tw-pb-3">
				<div className="tw-flex tw-justify-between">
					<div>
						<h2 className="tw-text-secondaryText tw-font-bold tw-text-2xl ">Team Members</h2>
					</div>
					<div className="tw-flex tw-gap-4">
						<SearchBox placeholder={'Search by name, mobile no. or email'} handleSearch={handleSearch} />
						{redirectFrom && ( // Modified by nayan for accomplishing unit content feature
							<Button
								disabled={selected?.length > 0 ? false : true}
								variant="contained"
								onClick={handleAddUsers}
								className="uppercase"
							>
								Add New Member
							</Button>
						)}
						{!redirectFrom && permissions?.create && (
							<Button className="!tw-text-white !tw-bg-primary" onClick={AddNewTeamMember}>
								Add New Member
							</Button>
						)}
					</div>
				</div>
			</div>
			<Container>
				<div className="tw-pr-3  tw-flex tw-justify-end  tw-gap-4">
					<Button variant="outlined" onClick={handleOpenExport}>Export</Button>
					<Button variant="outlined" onClick={handleClick} endIcon={!applyFilter ? <FilterListIcon className="tw-text-primary" /> : <img src={filter_on} />}>
						Filters
					</Button>

					<Popover id={1} open={openET} anchorEl={openexport} onClose={handleCloseExport}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}>
						<ul className='tw-p-5 tw-flex tw-flex-col tw-gap-4'>
							{ExportData.map((item, i) =>
								<a key={i} className='tw-text-base tw-cursor-pointer' onClick={() => onSubmitExport(item.role)}>{item.title}</a>
							)}
						</ul>
					</Popover>

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
								<h2 className="tw-text-2xl tw-text-secondaryText tw-font-bold">Filters</h2>
							</div>
							<div onClick={handleClose} className="tw-cursor-pointer ">
								<CloseIcon />
							</div>
						</div>
						<div className="tw-flex tw-items-start tw-gap-6 tw-justify-between tw-w-[608px] ">
							<div className="tw-flex tw-w-1/2 tw-flex-col tw-items-start tw-gap-4">
								<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
									<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Select District</span>
									<DropDownWithSearch
										options={districtName}
										valuekey="district_id"
										labelkey="name"
										label="Select District"
										listSearch={getDistrictNameList}
										searchText={(txt) => handleSearchDrop(txt, 'district')}
										onChange={(e) => {
											onChangeDropDownFilter(e, 'district_id');
											dispatch(fillFilterDistrict(e));
										}}
										value={filterDataPopOver?.district_id}
									/>
								</div>

								<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
									<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Select Village/Area</span>
									<DropDownWithSearch
										options={villageName}
										valuekey="village_area_id"
										labelkey="name"
										label="Select Village"
										listSearch={getDistrictNameList}
										searchText={(txt) => handleSearchDrop(txt, 'village_area_id')}
										onChange={(e) => {
											onChangeDropDownFilter(e, 'village_area_id');
											dispatch(fillFilterVillage(e));
										}}
										value={filterDataPopOver?.village_area_id}
										disabled={filterDataPopOver?.district_id === ''}
									/>
								</div>
							</div>
							<div className="tw-flex tw-flex-col tw-items-start tw-w-1/2 tw-gap-4">
								<div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
									<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Select Roles</span>
									<Dropdown
										options={roleName}
										onChange={(e) => {
											onChangeDropDownFilter(e, 'role_id');
											dispatch(fillFilterRole(e));
										}}
										value={filterDataPopOver?.role_id}
										valuekey="role_id"
										labelkey="name"
										label="Assigned To"
									/>
								</div>

								<div className="tw-flex tw-justify-end  tw-self-stretch tw-gap-3 tw-pt-12">
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
				<div>
					{!loader && !loader2 ? (
						<>
							{list.length > 0 ? (
								redirectFrom ? <ManualWhatsAppParentTable
									paginate={paginateInfo}
									onNavigateDetails={onNavigateDetails}
									scrollable
									actions={{ edit: true, preview: true }}
									columns={header}
									redirectFrom={redirectFrom || 'team-member'} // Modified by Arjun for accomplishing Manual Whatsapp feature
									handleSelected={handleSelected}// Modified by Arjun for accomplishing Manual Whatsapp feature
									selectedData={selected} // Modified by Arjun for accomplishing Manual Whatsapp feature
									data={list}
									onPageChange={onPageChange}
									page={page}
									details={true}
									keyProp="uuid"
									setLimitPerPage={setLimitPerPage}
									limitPerPage={limitPerPage}
									dispatchperPage={fillPerPageNum}
								// clearSelected={() => dispatch(clearSelectedQuestion())}

								/> :
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
