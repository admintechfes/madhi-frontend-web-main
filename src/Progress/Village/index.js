import React from 'react';
import { Button, Paper, Typography, Grid, CircularProgress } from '@mui/material';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ParentSelectSearch from '../../components/parents/ParentSelectSearch';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import FilterListIcon from '@mui/icons-material/FilterList';
import Tabs from '../../components//Tabs/Tabs';
import VillageFilter from '../../components/Progress/villagefilter';
import { VillageHeader } from '../../components/Progress/villageHeader';
import { useEffect } from 'react';
import EnhancedTable from '../../components/Progress/Table';
import { getVillageUnit } from '../duck/network';
import { getVisitsData } from './visits/duck/network';
import dayjs from 'dayjs';
import { fillStatusObj, fillStoreTabValue, fillUnitValue } from '../duck/progressSlice';
import { getQuizList } from './quiz/duck/network';
import { showTableLoader } from '../../components/Loader/duck/loaderSlice';
import { getSurveyList } from './survey/duck/network';
import EnhancedTablePagination from '../../components/Progress/survey/surveyTablePagination';
import { getLearningList } from './learningContent/duck/network';
import { getWorkshopList } from './workshop/duck/network';
import filter_on from '../../../public/assets/icons/filter_on.svg';
import { fillQuizStatusValue } from './quiz/duck/quizSlice';
import { fillConductedByValue, fillMeetingValue, fillStatusValue, fillVisitsEndDateValue, fillVisitsStartDateValue, fillinviteeVisitTypeValue } from './visits/duck/visitsSlice';
import { fillWorkshopStatusValue } from './workshop/duck/workshopSlice';
import { fillSurveyStatusValue } from './survey/duck/surveySlice';
import { fillLearningStatusValue } from './learningContent/duck/learningSlice';


export default function VillageArea() {
	const [list, setList] = useState([]);
	const [header, setHeader] = useState(VillageHeader[0].header);
	const [page, setPage] = useState(1);
	const [limitPerPage, setLimitPerPage] = useState(10);
	const [anchorEl, setAnchorEl] = useState(null);
	const paginateInfo = useSelector((state) => state.visits.paginateInfo);
	const loader = useSelector((state) => state.loader.openTableLoader);
	const UnitVillage = useSelector((state) => state.progress.unitvillage);
	const unitValue = useSelector((state) => state.progress.unitValue);
	const statusObj = useSelector((state) => state.progress.statusObj);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id, unitId, programId } = useParams();
	const location = useLocation();
	const { serialNumber, status, updatedOn, progressName, name, programUnitId } = location.state || {};
	const conductedValue = useSelector((state) => state.visits.conductedValue);
	const statusValue = useSelector((state) => state.visits.statusValue);
	const statusQuizValue = useSelector((state) => state.quiz.statusValue);
	const statusLearningValue = useSelector((state) => state.learning.statusValue);
	const startDateValue = useSelector((state) => state.visits.startDateValue);
	const endDateValue = useSelector((state) => state.visits.endDateValue);
	const statusSurveyValue = useSelector((state) => state.survey.statusValue);
	const statusWorkshopValue = useSelector((state) => state.workshop.statusValue);
	const storetabValue = useSelector((state) => state.progress.storetabValue)
	const visitsData = useSelector((state) => state.visits.visitsData);
	const workshopData = useSelector((state) => state.workshop.workshopData)
	const quizsData = useSelector((state) => state.quiz.quizsData)
	const surveyData = useSelector((state) => state.survey.surveyData)
	const learningData = useSelector((state) => state.learning.learningData)
	const [applyfilter, setApplyFilter] = useState(false);
	let ProgramUnitId = unitValue ? unitValue : unitId


	useEffect(() => {
		switch (storetabValue) {
			case 0:
				dispatch(
					getVisitsData({
						villageAreaId: id,
						programUnitId: unitValue ? unitValue : unitId,
						programId: programId,
						page: page,
						per_page: limitPerPage,
						...(conductedValue && { conductedBy: conductedValue }),
						...(statusValue && { status: statusValue }),
						...(startDateValue && { startDate: startDateValue }),
						...(endDateValue && { endDate: endDateValue }),
					})
				);
				break;
			case 1:
				dispatch(
					getWorkshopList({
						villageAreaId: id,
						programUnitId: unitValue ? unitValue : unitId,
						programId: programId,
						...(statusWorkshopValue && { conductedById: statusWorkshopValue }),
					})
				);
				break;
			case 2:
				dispatch(
					getQuizList({
						villageAreaId: id,
						programUnitId: unitValue ? unitValue : unitId,
						programId: programId,
						...(statusQuizValue && { moderatedById: statusQuizValue }),
					})
				);
				break;
			case 3:
				dispatch(
					getSurveyList({
						villageAreaId: id,
						programUnitId: unitValue ? unitValue : unitId,
						programId: programId,
						...(statusSurveyValue && { conductedById: statusSurveyValue }),
					})
				);
				break;
			case 4:
				dispatch(
					getLearningList({
						villageAreaId: id,
						programUnitId: unitValue ? unitValue : unitId,
						...(statusLearningValue && { managedById: statusLearningValue }),
					})
				);
				break;
			default:
				break;
		}
	}, [storetabValue, limitPerPage, page]);

	useEffect(() => {
		dispatch(
			getVillageUnit({
				villageAreaId: id,
				programId: programId,
			})
		);
	}, []);

	useEffect(() => {
		let newData = [...VillageHeader].find((item) => item.id === storetabValue);
		setHeader(newData.header);
	}, [])

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const onChangeUnit = (e) => {
		dispatch(fillUnitValue(e));
		const newData = [...UnitVillage].filter((el) => el.id === e);
		dispatch(fillStatusObj(newData[0]));
		switch (storetabValue) {
			case 0:
				dispatch(
					getVisitsData({
						villageAreaId: id,
						programId: programId,
						programUnitId: e,
						page: page,
						per_page: limitPerPage,
						...(conductedValue && { conductedBy: conductedValue }),
						...(statusValue && { status: statusValue }),
						...(startDateValue && { startDate: startDateValue }),
						...(endDateValue && { endDate: endDateValue }),
					})
				)
				break;
			case 1:
				dispatch(
					getWorkshopList({
						villageAreaId: id,
						programUnitId: e,
						programId: programId,
						...(statusWorkshopValue && { conductedById: statusWorkshopValue }),
					})
				)
				break;
			case 2:
				dispatch(
					getQuizList({
						villageAreaId: id,
						programUnitId: e,
						programId: programId,
						...(statusQuizValue && { moderatedById: statusQuizValue }),
					})
				)
				break;
			case 3:
				dispatch(
					getSurveyList({
						villageAreaId: id,
						programUnitId: e,
						programId: programId,
						...(statusSurveyValue && { moderatedById: statusSurveyValue }),
					})
				)
				break;
			case 4:
				dispatch(
					getLearningList({
						villageAreaId: id,
						programUnitId: e,
						...(statusLearningValue && { managedById: statusLearningValue }),
					})
				)
				break;
		}
	};

	const handleTabChange = (tabValue) => {
		dispatch(fillStoreTabValue(tabValue));
		let newData = [...VillageHeader].find((item) => item.id === tabValue);
		setHeader(newData.header);
		setApplyFilter(false)
		setPage(1);
		switch (storetabValue) {
			case 0:
				dispatch(fillConductedByValue(''));
				dispatch(fillStatusValue(''));
				dispatch(fillVisitsStartDateValue(null));
				dispatch(fillVisitsEndDateValue(null));
				dispatch(fillinviteeVisitTypeValue(""))
				dispatch(fillMeetingValue(""))
				break;
			case 1:
				dispatch(fillQuizStatusValue(''));
				break;
			case 2:
				dispatch(fillWorkshopStatusValue(''));
				break;
			case 3:
				dispatch(fillSurveyStatusValue(''));
				break;
			case 4:
				dispatch(fillLearningStatusValue(''));
				break;
			default:
				break;
		}
	};

	const onNavigateDetails = (villageAreaId, moderatedById, programUnitContentId, conductedById, managedById) => {
		switch (storetabValue) {
			case 0:
				navigate(`/progress/village/visits/${villageAreaId}`, { state: { name, progressName, villageAreaId, ProgramUnitId, programId, id } });
				break;
			case 1:
				navigate(`/progress/village/workshop`, { state: { name, progressName, villageAreaId: id, unitId, programId, programUnitContentId, conductedById, moderatedById } });
				break;
			case 2:
				navigate(`/progress/village/quiz-details`, { state: { name, progressName, villageAreaId: id, moderatedById, programUnitContentId } });
				break;
			case 3:
				navigate(`/progress/village/survey-details`, { state: { name, progressName, villageAreaId: id, conductedById, programUnitContentId, moderatedById, programId, programUnitId: unitId } });
				break;
			case 4:
				navigate(`/progress/village/learning-details`, { state: { name, progressName, villageAreaId: id, managedById, programUnitContentId } });
				break;
		}
	};

	const Back = () => {
		navigate(-1);
	};
	let BackgroundTheme = (statusObj?.status || status)?.toLowerCase() === 'active' ? 'rgba(56, 146, 255, 0.20)' : '#EB57571A';
	let ColorTheme = (statusObj?.status || status)?.toLowerCase() === 'active' ? '#3892FF' : '#EB5757';

	let unitData = { id: unitId, name: serialNumber };


	let DataLength;
	let storeData;

	switch (storetabValue) {
		case 0:
			DataLength = visitsData?.data?.length;
			storeData = visitsData?.data;
			break;
		case 1:
			DataLength = workshopData?.data?.length;
			storeData = workshopData?.data;
			break;
		case 2:
			DataLength = quizsData?.data?.length;
			storeData = quizsData?.data;
			break;
		case 3:
			DataLength = surveyData?.data?.length;
			storeData = surveyData?.data;
			break;
		case 4:
			DataLength = learningData?.data?.length;
			storeData = learningData?.data;
			break;

	}
	return (
		<>
			<Link onClick={Back}>
				<ArrowBackIcon className="tw-text-grey" />
				<span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">
					Progress / {progressName}/ {name} Village-Area
				</span>
			</Link>
			<Typography variant="h2" className="!tw-font-semibold !tw-text-secondaryText">
				{name}
			</Typography>
			<Paper className="tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-mt-6">
				<div className="tw-flex tw-gap-14 tw-items-center tw-mb-6">
					<div className="tw-w-[242px]">
						<ParentSelectSearch options={UnitVillage} height={20} value={unitValue ? unitValue : unitData.id} onChange={onChangeUnit} valuekey="id" labelkey="name" label="Select Unit" />
					</div>
					<div className="tw-flex tw-items-center tw-gap-9">
						<div className="tw-flex tw-flex-col gap-2">
							<span className="tw-text-xs  tw-text-grey">Status</span>
							<span style={{ backgroundColor: BackgroundTheme, color: ColorTheme }} className="tw-text-sm tw-text-primaryText tw-font-normal tw-px-2 tw-py-[2px] tw-rounded tw-text-center">
								{statusObj?.status || status}
							</span>
						</div>
						<div className="tw-flex tw-flex-col gap-2">
							<span className="tw-text-xs  tw-text-grey">Status Updated On</span>
							<span className="tw-text-sm tw-text-primaryText">{statusObj?.updatedOn ? dayjs(statusObj?.updatedOn).format('D MMM, YYYY') : updatedOn}</span>
						</div>
					</div>
				</div>
				<div className="tw-flex tw-justify-between tw-w-full tw-items-start tw-pr-4 tw-mb-2">
					<Grid justifyContent={'space-between'} sx={{ marginLeft: '0px' }}>
						<Tabs tabs={['Visits', 'Workshops', 'Quiz', 'Survey', 'Learning Content']} tabValue={storetabValue} tabChange={handleTabChange} />
					</Grid>
					<div className="tw-relative">
						<Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>
							Filters
						</Button>
						<VillageFilter unitValue={unitValue ? unitValue : unitId} applyfilter={applyfilter} setApplyFilter={setApplyFilter} anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleClose={handleClose} tab={storetabValue} page={page} limitPerPage={limitPerPage} />
					</div>
				</div>
				{!loader ? (
					<>
						{DataLength ? (
							<EnhancedTablePagination
								paginate={paginateInfo}
								scrollable
								onNavigateDetails={onNavigateDetails}
								actions={{ edit: true, preview: true }}
								columns={header}
								data={storeData}
								// onPageChange={onPageChange}
								page={page}
								details={true}
								keyProp="uuid"
								tab={storetabValue}
								setPage={setPage}
							/>
						) : (
							<div className="tw-text-secondaryText tw-w-full tw-font-normal tw-text-sm tw-text-center">
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
