import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Button, CircularProgress, Paper, Typography } from '@mui/material';

import EnhancedTable from '../../components/Progress/VillageUsersTable';
import { getVillageUsersList } from '../duck/network';
import Tabs from '../../components/Tabs/Tabs';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const memberHeader = [
	{
		id: 'full_name',
		numeric: false,
		disablePadding: true,
		label: 'Name',
		sort: true,
		width: 300,
	},
	{
		id: 'email',
		numeric: false,
		disablePadding: true,
		label: 'Email',
		sort: false,
		width: 300,
	},
	{
		id: 'mobile',
		numeric: false,
		disablePadding: true,
		label: 'Mobile No.',
		sort: false,
		width: 220,
	},

	{
		id: 'role_name',
		numeric: false,
		disablePadding: true,
		label: 'Role',
		sort: false,
		width: 220,
	},
];

const parentHeader = [
	{
		id: 'full_name',
		numeric: false,
		disablePadding: true,
		label: 'Name',
		sort: true,
		width: 300,
	},
	{
		id: 'email',
		numeric: false,
		disablePadding: true,
		label: 'Email',
		sort: false,
		width: 300,
	},
	{
		id: 'mobile',
		numeric: false,
		disablePadding: true,
		label: 'Mobile No.',
		sort: false,
		width: 220,
	},

	{
		id: 'assigned_village_area',
		numeric: false,
		disablePadding: true,
		label: 'Village Area',
		sort: false,
		width: 220,
	},
];

export default function VillageUsers() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams()

	const villageUsers = useSelector((state) => state.progress.villageUsers);
	const paginateInfo = useSelector((state) => state.progress.paginateInfo);
	const loading = useSelector((state) => state.progress.progressLoading);

	const [page, setPage] = useState(1);
	const [limitPerPage, setLimitPerPage] = useState(10);
	const [tab, setTab] = useState(0);
	const [searchParams] = useSearchParams();

	useEffect(() => {
		switch (tab) {
			case 0:
				dispatch(getVillageUsersList(tab, { page: page, per_page: limitPerPage, village_area_id: params?.id, role_type: 'supervisor' }));
				break;
			case 1:
				dispatch(getVillageUsersList(tab, { page: page, per_page: limitPerPage, village_area_id: params?.id, role_type: 'cew' }));
				break;
			case 2:
				dispatch(getVillageUsersList(tab, { page: page, per_page: limitPerPage, villageAreaId: params?.id }));
				break;
			default:
				dispatch(getVillageUsersList(tab, { page: page, per_page: limitPerPage, village_area_id: params?.id, role_type: 'supervisor' }));
		}
	}, [tab, page, limitPerPage]);

	useEffect(() => {
		if (searchParams.get('tab')) {
			setTab(parseInt(searchParams.get('tab')));
		}
	}, []);

	const handleTabChange = (tabValue) => {
		setTab(tabValue);
		setPage(1);
	};

	const onPageChange = (page) => {
		setPage(page);
	};

	const handleManage = (id) => {
		switch (tab) {
			case 0:
			case 1:
				navigate(`/team-member-details/${id}?redirect=program&villageAreaId=${params?.id}&programId=${searchParams.get('programId')}&tab=${tab}`);
				break;
			case 2:
				navigate(`/parents-detail/${id}?redirect=program&villageAreaId=${params?.id}&programId=${searchParams.get('programId')}&tab=${tab}`);
				break;
			default:
				navigate(`/team-member-details/${id}?redirect=program&villageAreaId=${params?.id}&programId=${searchParams.get('programId')}&tab=${tab}`);
		}
	};

	return (
		<>
			<Button onClick={()=>navigate(`/progress/${searchParams.get('programId')}`)} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[14px] !tw-px-0" variant="text" disableRipples startIcon={<KeyboardBackspaceIcon />}>
				{`Progress / Kids Learning Importance / Egamore`}
			</Button>
			<div>
				<Typography variant="h3" className="!tw-font-semibold !tw-text-secondaryText">
					Egamore
				</Typography>
			</div>
			<Paper className="tw-w-full tw-pt-6 tw-mt-6">
				<Tabs tabValue={tab} tabs={['Supervisor List', 'CEW List', 'Parent List']} tabChange={handleTabChange} />
				<>
					{!loading ? (
						<>
							{villageUsers.length > 0 ? (
								<EnhancedTable
									handleManage={handleManage}
									scrollable
									columns={tab == 2 ? parentHeader : memberHeader}
									data={villageUsers}
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
		</>
	);
}
