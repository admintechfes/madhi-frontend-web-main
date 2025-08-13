import React, { useEffect, useState } from 'react';
import { Button, Paper, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import FilterListIcon from '@mui/icons-material/FilterList';
import SurveyFilter from '../../../components/Progress/survey/surveyfilter';
import EnhancedTable from '../../../components/Progress/survey/surveyTable';
import { getSurveyDetails, getSurveyParentList } from './duck/network';
import { CircularProgress } from '@mui/material';
import filter_on from '../../../../public/assets/icons/filter_on.svg';


const header = [
	{
		id: 'parentName',
		numeric: false,
		disablePadding: true,
		label: 'Parent List',
		sort: true,
		width: 120,
	},
	{
		id: 'surveyFilledBy',
		numeric: false,
		disablePadding: true,
		label: 'Filled By',
		sort: false,
		width: 120,
	},
	{
		id: 'role',
		numeric: false,
		disablePadding: true,
		label: 'Role',
		sort: false,
		width: 120,
	},

	{
		id: 'surveyStatus',
		numeric: false,
		disablePadding: true,
		label: 'Status',
		sort: false,
		width: 120,
	},

	{
		id: 'updatedOn',
		numeric: false,
		disablePadding: true,
		label: 'Status Completed On',
		sort: false,
		width: 120,
	},
	{
		id: 'survey_link',
		numeric: false,
		disablePadding: true,
		label: 'Survey Link',
		sort: false,
		width: 120,
	},
];


const header1 = [
	{
		id: 'parentName',
		numeric: false,
		disablePadding: true,
		label: 'Parent List',
		sort: true,
		width: 120,
	},

	{
		id: 'childrenCompletionStatus',
		numeric: false,
		disablePadding: true,
		label: 'children Completion',
		sort: false,
		width: 120,
	},
	{
		id: 'surveyStatus',
		numeric: false,
		disablePadding: true,
		label: 'Status',
		sort: false,
		width: 120,
	},

	{
		id: 'updatedOn',
		numeric: false,
		disablePadding: true,
		label: 'Status Completed On',
		sort: false,
		width: 120,
	},
	{
		id: 'survey_link',
		numeric: false,
		disablePadding: true,
		label: 'Survey Link',
		sort: false,
		width: 120,
	},
];
export default function Survey() {
	const loader = useSelector((state) => state.survey.surveyParentLoader);
	const [page, setPage] = useState(1);
	const dispatch = useDispatch();
	const paginateInfo = useSelector((state) => state.survey.paginateInfo);
	const [limitPerPage, setLimitPerPage] = useState(10);
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const ProgressDetails = {};
	const location = useLocation();
	const { progressName, name, villageAreaId, conductedById, programUnitContentId, programId, unitId, moderatedById, programUnitId } = location.state || {};
	const surveyDetails = useSelector((state) => state.survey.surveyDetails);
	const surveyParent = useSelector((state) => state.survey.surveyParent);
	const surveyProgressStatusValue = useSelector((state) => state.survey.surveyProgressStatusValue);
	const startDateValue = useSelector((state) => state.survey.startDateValue);
	const endDateValue = useSelector((state) => state.survey.endDateValue);
	const applySurveyFilter = useSelector((state) => state.survey.applySurveyFilter);
	useEffect(() => {
		let timerId = setTimeout(() => {
			formatForDisplay(surveyParent?.data);
		}, 1000);
		return () => clearTimeout(timerId);
	}, [limitPerPage, page]);

	useEffect(() => {
		dispatch(getSurveyDetails({ villageAreaId: villageAreaId, conductedById: conductedById, programUnitContentId: programUnitContentId }));
	}, []);

	useEffect(() => {
		dispatch(
			getSurveyParentList({
				villageAreaId: villageAreaId,
				conductedById: conductedById,
				programUnitContentId: programUnitContentId,
				perPage: limitPerPage,
				page: page,
				...(surveyProgressStatusValue && { status: surveyProgressStatusValue }),
				...(startDateValue && { startDate: startDateValue }),
				...(endDateValue && { endDate: endDateValue }),
			})
		);
	}, [limitPerPage, page]);

	const formatForDisplay = (data) => {
		const formatedRows = [];
		data?.forEach((item, index) => {
			formatedRows.push({
				parentId: item.parentId,
				parentName: item.parentName,
				surveyFilledBy: item.surveyFilledBy,
				role: item.role,
				surveyStatus: item.surveyStatus,
				updatedOn: item.updatedOn,
			});
		});
	};

	const onPageChange = (page) => {
		setPage(page);
	};

	const onNavigateDetails = (data) => {
		if(surveyDetails?.surveyType?.toLowerCase() ==="children"){
			navigate('/progress/village/survey-details/children', { state: { parentId: data.parentId, progressName, name, villageAreaId, conductedById, programUnitContentId, surveyNumber: surveyDetails.surveyNumber } });
		}else{
			navigate('/progress/village/survey-details/preview', { state: { parentId: data.parentId, progressName, name, villageAreaId, conductedById, programUnitContentId, surveyNumber: surveyDetails.surveyNumber } });
		}
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const Back = () => {
		// http://localhost:3000/progress/village/9babace4-d61f-4903-9bbe-e5d45612c4fa/unitId/9bdfc4de-50d8-4990-8922-d61e214e762b/programId/9bc1e940-b41e-4796-947c-951308cd30be
		// navigate(`/progress/village/${villageAreaId}/unitId/${programUnitId}/programId/${programId}`, {
		// 	state: { name, progressName, villageAreaId, programId, programUnitContentId, conductedById, moderatedById, programUnitId: programUnitId, unitId: programUnitId },
		// });
		navigate(-1);

		// /progress/village/:id/unitId/:unitId/programId/:programId
	};

	let BackgroundTheme = surveyDetails?.status === 'Submitted' ? 'rgba(56, 146, 255, 0.20)' : ProgressDetails?.status === 'yet to start' ? 'rgba(255, 196, 12, 0.24)' : 'rgba(254, 13, 13, 0.10)';
	let ColorTheme = ProgressDetails?.status === 'active' ? '#3892FF' : ProgressDetails?.status === 'yet to start' ? '#F39C35' : '#FE0D0D';

	const getContent = (title, desc, status) => {
		return (
			<div className={`tw-flex tw-flex-col tw-gap-2 tw-w-[240px]`}>
				<span className="tw-text-xs tw-text-grey tw-block tw-mb-[6px]">{title}</span>
				{status ? (
					<span style={{ backgroundColor: BackgroundTheme, color: ColorTheme }} className="tw-text-sm tw-text-primaryText tw-w-fit tw-font-normal tw-px-2 tw-py-[2px] tw-rounded tw-text-center">
						Completed
					</span>
				) : (
					<span className="tw-text-sm tw-text-primaryText">{desc || "-"}</span>
				)}
			</div>
		);
	};



	return (
		<>
			<div onClick={Back}>
				<ArrowBackIcon className="tw-text-grey" />
				<span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">
					Progress / {progressName}/ {name} Village/Area/ Survey
				</span>
			</div>
			<Typography variant="h2" className="!tw-font-semibold !tw-text-secondaryText">
				{surveyDetails.surveyNumber}
			</Typography>
			<Paper className="tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6">
				<Typography variant="h4" className="!tw-font-semibold !tw-text-secondaryText">
					Survey Details
				</Typography>
				<div className="tw-flex tw-items-start tw-flex-wrap tw-gap-6">
					{getContent('Survey Name', surveyDetails.surveyTitle)}
					{getContent('Conducted By', surveyDetails.conductedBy)}
					{getContent('Supervisor', surveyDetails.supervisor)}
					{getContent('Survey Closed', surveyDetails.surveyClosed)}
					{getContent('Survey Type', surveyDetails?.surveyType)}

				</div>
			</Paper>
			<Paper className="tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6">
				<div className="tw-flex tw-justify-end tw-w-full tw-items-center">
					<div className="tw-relative">
						<Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applySurveyFilter ? <FilterListIcon className="tw-text-primary" /> : <img src={filter_on} />}>
							Filters
						</Button>
						<SurveyFilter
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
						{surveyParent?.data?.length ? (
							<EnhancedTable
								paginate={paginateInfo}
								scrollable
								onNavigateDetails={onNavigateDetails}
								actions={{ edit: true, preview: true }}
								columns={surveyDetails?.surveyType?.toLowerCase() === "children" ? header1 : header}
								data={surveyParent?.data}
								onPageChange={onPageChange}
								page={page}
								details={true}
								keyProp="uuid"
								setLimitPerPage={setLimitPerPage}
								limitPerPage={limitPerPage}
								setPage={setPage}
								surveyType={surveyDetails?.surveyType}
							/>
						) : (
							<div className="tw-p-6 tw-mt-5 tw-bg-[#FAFCFE] tw-text-SecondaryTextColor  tw-font-normal tw-text-sm tw-text-center tw-rounded-lg tw-w-full">
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
