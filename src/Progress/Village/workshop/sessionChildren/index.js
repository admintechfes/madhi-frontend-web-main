import React, { useEffect, useState } from 'react';
import { Button, Paper, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import FilterListIcon from '@mui/icons-material/FilterList';
import { CircularProgress } from '@mui/material';
// import { getSurveyChildrenList, getSurveyDetails, getSurveyParentList } from '../duck/network';


import EnhancedTable from '../../../../components/Progress/survey/surveyTable';
import filter_on from '../../../../../public/assets/icons/filter_on.svg';
import SurveyChildrenFilter from '../../../../components/Progress/survey/surveyChildrenFilter';
import { getSessionChildrenList, getWorkshopSessionDetails } from '../duck/network';



const header = [
	{
		id: 'childName',
		numeric: false,
		disablePadding: true,
		label: 'Children List',
		sort: true,
		width: 120,
	},
	{
		id: 'quizStatus',
		numeric: false,
		disablePadding: true,
		label: 'Quiz Status',
		sort: false,
		width: 120,
	},
	{
		id: 'lastUpdatedOn',
		numeric: false,
		disablePadding: true,
		label: 'Status Updated On',
		sort: false,
		width: 120,
	},

	{
		id: 'updatedBy',
		numeric: false,
		disablePadding: true,
		label: 'Quiz Filled By',
		sort: false,
		width: 120,
	},

	{
		id: 'quizScore',
		numeric: false,
		disablePadding: true,
		label: 'Score',
		sort: false,
		width: 120,
	},
	{
		id: 'WhatsAppStatus',
		numeric: false,
		disablePadding: true,
		label: 'WhatsApp shared Status',
		sort: false,
		width: 120,
	},
	{
		id: 'SMSStatus',
		numeric: false,
		disablePadding: true,
		label: 'SMS shared Status',
		sort: false,
		width: 120,
	},
	{
		id: 'quiz_Link',
		numeric: false,
		disablePadding: true,
		label: 'Quiz Link',
		sort: false,
		width: 120,
	},
];

export default function SessionChildren() {
	// const loader = useSelector((state) => state.survey.surveyParentLoader);
	const [page, setPage] = useState(1);
	const dispatch = useDispatch();
	const paginateInfo = useSelector((state) => state.survey.paginateInfo);
	const [limitPerPage, setLimitPerPage] = useState(10);
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const ProgressDetails = {};
	const location = useLocation();
	const { progressName, name, villageAreaId, conductedById,parentId, programUnitContentId,parentName, programId, unitId, moderatedById, programUnitId } = location.state || {};
	const surveyDetails = useSelector((state) => state.survey.surveyDetails);
	const surveyParent = useSelector((state) => state.workshop.workshopChildList);
	const surveyProgressStatusValue = useSelector((state) => state.survey.surveyProgressStatusValueChildren);
	const startDateValue = useSelector((state) => state.survey.startDateValueChildren);
	const endDateValue = useSelector((state) => state.survey.endDateValueChildren);
	const applySurveyFilter = useSelector((state) => state.survey.applySurveyFilterChildren);
	useEffect(() => {
		let timerId = setTimeout(() => {
			formatForDisplay(surveyParent?.data);
		}, 1000);
		return () => clearTimeout(timerId);
	}, [limitPerPage, page]);

	useEffect(() => {
		// dispatch(getWorkshopSessionDetails({ villageAreaId: villageAreaId, conductedById: conductedById, programUnitContentId: programUnitContentId }));
	}, []);

	useEffect(() => {
		dispatch(
			getSessionChildrenList({
				villageAreaId: villageAreaId,
				conductedById: conductedById,
				programUnitContentId: programUnitContentId,
				parentId:parentId,
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
    
			navigate(`/progress/village/workshop/session/previewQuiz/children/${data.id}`, { state: { progressName, name, villageAreaId, conductedById, programUnitContentId, surveyNumber: surveyDetails.surveyNumber,childId:data.id,parentId:data?.parentId } });
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

	let BackgroundTheme = surveyDetails?.status === 'Submitted' ? 'rgba(56, 146, 255, 0.20)' : ProgressDetails?.status === 'yet to start' ? 'rgba(255, 196, 12, 0.24)' : 'rgba(254, 13, 13, 0.10)';
	let ColorTheme = ProgressDetails?.status === 'active' ? '#3892FF' : ProgressDetails?.status === 'yet to start' ? '#F39C35' : '#FE0D0D';


	return (
		<>
			<div onClick={Back}>
				<ArrowBackIcon className="tw-text-grey" />
				<span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">
					Progress / {progressName}/ {name} Village/Area/ Survey
				</span>
			</div>
			<Typography variant="h2" className="!tw-font-semibold !tw-text-secondaryText">
			{parentName}
			</Typography>
		
			<Paper className="tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6">
				<div className="tw-flex tw-justify-end tw-w-full tw-items-center">
					<div className="tw-relative">
						{/* <Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applySurveyFilter ? <FilterListIcon className="tw-text-primary" /> : <img src={filter_on} />}>
							Filters
						</Button> */}
						<SurveyChildrenFilter
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
				{true ? (
					<>
						{surveyParent?.data?.length ? (
							<EnhancedTable
								paginate={paginateInfo}
								scrollable
								onNavigateDetails={onNavigateDetails}
								actions={{ edit: true, preview: true }}
								columns={ header}
								data={surveyParent?.data}
								onPageChange={onPageChange}
								page={page}
								details={true}
								keyProp="uuid"
								setLimitPerPage={setLimitPerPage}
								limitPerPage={limitPerPage}
								setPage={setPage}
                surveyType = 'children'
							/>
						) : (
							<div className="tw-p-6 tw-mt-5 tw-bg-[#FAFCFE] tw-text-SecondaryTextColor  tw-font-normal tw-text-sm tw-text-center tw-rounded-lg tw-w-full">
								<span>No Data found</span>
							</div>
						)}
					</>
				) : (
					<div className="tw-text-center tw-py-5 tw-w-full">
						{/* <CircularProgress /> */}
					</div>
				)}
			</Paper>
		</>
	);
}
