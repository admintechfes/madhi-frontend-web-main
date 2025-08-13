import React, { useEffect, useState } from 'react';
import { Button, Paper, Typography, Grid } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import EnhancedTable from '../../../components/Progress/workshopTable';
import SessionFilter from '../../../components/Progress/workshop/sessionfilter';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getWorkshopDetails, getWorkshopSessionList } from './duck/network';
// import filter_on from '../../public/assets/icons/filter_on.svg';
import filter_on from '../../../../public/assets/icons/filter_on.svg';


const header = [
	{
		id: 'agenda',
		numeric: false,
		disablePadding: true,
		label: 'Agenda of the Session',
		sort: true,
		width: 120,
	},
	{
		id: 'parentsAdded',
		numeric: false,
		disablePadding: true,
		label: 'Parents invited',
		sort: false,
		width: 120,
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: true,
		label: 'Status',
		sort: false,
		width: 120,
	},
	{
		id: 'statusUpdatedOn',
		numeric: false,
		disablePadding: true,
		label: 'Status Updated On',
		sort: false,
		width: 120,
	},
];

export default function Workshop() {
	const loader = false;

	const [page, setPage] = useState(1);
	const dispatch = useDispatch();
	const location = useLocation();
	const { progressName, name, villageAreaId, conductedById, programUnitContentId, programId, unitId, moderatedById, programUnitId } = location.state || {};

	const [limitPerPage, setLimitPerPage] = useState(10);
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const paginateInfo = useSelector((state) => state.workshop.paginateInfo);
	const workshopDetails = useSelector((state) => state.workshop.workshopDetails);
	const workshopSessionsList = useSelector((state) => state.workshop.workshopSessionsList);
	const sessionStatus = useSelector((state) => state.workshop.sessionStatus);


	useEffect(() => {
		let timerId = setTimeout(() => {
			formatForDisplay(workshopSessionsList?.data);
		}, 1000);
		return () => clearTimeout(timerId);
	}, [page, limitPerPage]);

	useEffect(() => {
		dispatch(getWorkshopDetails({ villageAreaId: villageAreaId, conductedById: conductedById, programUnitContentId: programUnitContentId }));
	}, []);

	useEffect(() => {
		dispatch(
			getWorkshopSessionList({
				villageAreaId: villageAreaId,
				conductedById: conductedById,
				programUnitContentId: programUnitContentId,
				perPage: limitPerPage,
				page: page,
				...(sessionStatus && { status: sessionStatus }),
				// ...(startDateValue && { startDate: startDateValue }),
				// ...(endDateValue && { endDate: endDateValue }),
			})
		);
	}, [limitPerPage, page]);

	const formatForDisplay = (data) => {
		const formatedRows = [];
		data?.forEach((item, index) => {
			formatedRows.push({
				id: item.id,
				agenda: item.agenda,
				parentsAdded: item.parentsAdded,
				status: item.status,
				statusUpdatedOn: item.statusUpdatedOn,
			});
		});
		// setList(formatedRows)
	};

	const onPageChange = (page) => {
		setPage(page);
	};

	const onNavigateDetails = (id) => {
		navigate(`/progress/village/workshop/session/${id}`, { state: { progressName, name, villageAreaId, conductedById, programUnitContentId, programId, unitId, moderatedById, programUnitId, workshopSessionId: id, supervisor: workshopDetails?.supervisor } });
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);

	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const Back = () => {
		navigate(-1);
	};

	const getContent = (title, desc,) => {
		return (
			<div className={`tw-flex tw-flex-col tw-gap-2 tw-w-[240px]`}>
				<span className={`tw-text-xs tw-text-grey tw-block tw-mb-[6px] `}>{title}</span>
				<span className={`tw-text-sm tw-text-primaryText `}>{desc}</span>
			</div>
		);
	};

	return (
		<>
			<Link onClick={Back}>
				<ArrowBackIcon className="tw-text-grey" />
				<span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">
					{' '}
					Progress / {progressName}/ {name} Village/Area/ Workshop
				</span>
			</Link>
			<Typography variant="h2" className="!tw-font-semibold !tw-text-secondaryText">
				{workshopDetails?.workshopNumber}
			</Typography>
			<Paper className="tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6">
				<Typography variant="h4" className="!tw-font-semibold !tw-text-secondaryText">
					Workshop Details
				</Typography>
				<div className="tw-flex tw-items-start tw-flex-wrap tw-gap-6">
					{getContent('Workshop Name', workshopDetails?.workshopTitle)}
					{getContent('Conducted by', workshopDetails?.moderatedBy)}
					{getContent('Role', workshopDetails?.moderatorRole)}
					{getContent('Supervised By', workshopDetails?.supervisor)}
				</div>
				<div className="tw-flex tw-items-start tw-flex-wrap tw-gap-6">
					{getContent('No.of Sessions', workshopDetails?.workshopSessionCount)}
					{getContent('Parents Present', workshopDetails?.parentInvited)}
				</div>
			</Paper>
			<Paper className="tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6">
				<div className="tw-flex tw-justify-between tw-w-full tw-items-center">
					<Typography variant="h4" className="!tw-font-semibold !tw-text-secondaryText">
						Sessions
					</Typography>
					<div className="tw-relative">
						<Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!sessionStatus ? <FilterListIcon className="tw-text-primary" /> : <img src={filter_on} />}>
							Filters
						</Button>
						<SessionFilter
							anchorEl={anchorEl}
							setAnchorEl={setAnchorEl}
							handleClose={handleClose}
							page={page}
							limitPerPage={limitPerPage}
							formatForDisplay={formatForDisplay}
							villageAreaId={villageAreaId}
							conductedById={conductedById}
							programUnitContentId={programUnitContentId}
						/>
					</div>
				</div>
				{!loader ? (
					<>
						{workshopSessionsList?.data?.length ? (
							<EnhancedTable
								paginate={paginateInfo}
								scrollable
								onNavigateDetails={onNavigateDetails}
								actions={{ edit: true, preview: true }}
								columns={header}
								data={workshopSessionsList?.data}
								onPageChange={onPageChange}
								page={page}
								details={true}
								keyProp="uuid"
								setLimitPerPage={setLimitPerPage}
								limitPerPage={limitPerPage}
								setPage={setPage}
							/>
						) : (
							<div className="tw-p-6 tw-mt-5 tw-mx-auto tw-bg-[#FAFCFE] tw-w-full tw-text-SecondaryTextColor  tw-font-normal tw-text-sm tw-text-center tw-rounded-lg">
								<span>No Data found</span>
							</div>
						)}
					</>
				) : (
					<div className="tw-text-center tw-py-5 tw-w-full">
						<CircularProgress />
					</div>
				)}
			</Paper>
		</>
	);
}
