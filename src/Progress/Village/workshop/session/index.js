import React, { useEffect, useState } from 'react';
import { Button, Paper, Typography, Grid } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import FilterListIcon from '@mui/icons-material/FilterList';
import Filter from '../../../../components/Progress/workshop/session/filter';

import { getWorkshopSessionDetails, getWorkshopSessionQuizList } from '../duck/network';
import { SurveyDropdown } from '../../../../components/Progress/survey/surveyDropDown';
import EnhancedQuizTable from '../../../../components/Progress/workshop/session/sessionQuizTable';
import filter_on from '../../../../../public/assets/icons/filter_on.svg';
import EnhancedObservationFormTable from '../../../../components/Progress/workshop/session/sessionFormTable';


const header = [
	{
		id: 'parentName',
		numeric: false,
		disablePadding: true,
		label: 'Parent List',
		sort: false,
		width: 140,
	},
	{
		id: 'attendanceStatus',
		numeric: false,
		disablePadding: true,
		label: 'Attendance',
		sort: false,
		width: 140,
	},
	{
		id: 'attendanceStatusUpdatedOn',
		numeric: false,
		disablePadding: true,
		label: 'Status Updated On',
		sort: false,
		width: 140,
	},
	{
		id: 'quizStatus',
		numeric: false,
		disablePadding: true,
		label: 'Quiz Status',
		sort: false,
		width: 140,
	},
	{
		id: 'childrenCompletion',
		numeric: false,
		disablePadding: true,
		label: 'Children Completion',
		sort: false,
		width: 140,
	},

	{
		id: 'hasSubmittedQuiz',
		numeric: false,
		disablePadding: true,
		label: 'Quiz Link',
		sort: false,
		width: 140,
	},
];


const header2=[
	{
		id: 'parentName',
		numeric: false,
		disablePadding: true,
		label: 'Parent List',
		sort: false,
		width: 140,
	},
	{
		id: 'attendanceStatus',
		numeric: false,
		disablePadding: true,
		label: 'Attendance',
		sort: false,
		width: 140,
	},
	{
		id: 'attendanceStatusUpdatedOn',
		numeric: false,
		disablePadding: true,
		label: 'attendance Updated On',
		sort: false,
		width: 140,
	},
	{
		id: 'quizStatus',
		numeric: false,
		disablePadding: true,
		label: 'Quiz Status',
		sort: false,
		width: 140,
	},
	{
		id: 'quizFilledBy',
		numeric: false,
		disablePadding: true,
		label: 'Quiz Filled By',
		sort: false,
		width: 140,
	},
	{
		id: 'score',
		numeric: false,
		disablePadding: true,
		label: 'Score',
		sort: false,
		width: 140,
	},
	{
		id: 'whatsappStatus',
		numeric: false,
		disablePadding: true,
		label: 'Quiz Shared On WhatsApp',
		sort: false,
		width: 140,
	},
	{
		id: 'smsStatus',
		numeric: false,
		disablePadding: true,
		label: 'Quiz Shared On SMS',
		sort: false,
		width: 140,
	},
	{
		id: 'hasSubmittedQuiz',
		numeric: false,
		disablePadding: true,
		label: 'Quiz Link',
		sort: false,
		width: 140,
	},

]
const header1 = [
	{
		id: 'formName',
		numeric: false,
		disablePadding: true,
		label: 'Form Name',
		sort: false,
		width: 140,
	},

	{
		id: 'formFilledBy',
		numeric: false,
		disablePadding: true,
		label: 'Filled By',
		sort: false,
		width: 140,
	},

	{
		id: 'formStatus',
		numeric: false,
		disablePadding: true,
		label: 'Status',
		sort: false,
		width: 140,
	},
	{
		id: 'formReason',
		numeric: false,
		disablePadding: true,
		label: 'Reason',
		sort: false,
		width: 140,
	},
	{
		id: 'formFilled',
		numeric: false,
		disablePadding: true,
		label: 'Form Link',
		sort: false,
		width: 140,
	},
];

export default function Session() {
	const loader = false;
	const [page, setPage] = useState(1);
	const dispatch = useDispatch();
	const paginateInfo = useSelector((state) => state.workshop.paginateInfoQuiz);
	// const paginateInfo1 = useSelector((state) => state.workshop.paginateInfoWorkShopObservation);
	const [limitPerPage, setLimitPerPage] = useState(10);
	// const [limitPerPage1, setLimitPerPage1] = useState(10);
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const location = useLocation();
	const { progressName, name, villageAreaId, conductedById, programUnitContentId, programId, unitId, moderatedById, programUnitId, workshopSessionId, supervisor } = location.state || {};
	const workshopSessionDetails = useSelector((state) => state.workshop.workshopSessionDetails);
	const [selectedValue, setSelecedValue] = useState(null);
	const [selectedType, setSelectedType] = useState(null)
	const workshopSessionQuizList = useSelector((state) => state.workshop.workshopSessionQuizList);
	const workshopSessionQuizAttendanceValue = useSelector((state) => state.workshop.workshopSessionQuizAttendanceValue);
	const workshopSessionQuizStatusValue = useSelector((state) => state.workshop.workshopSessionQuizStatusValue);
	const workshopSessionFilter = useSelector((state) => state.workshop.workshopSessionFilter);



	useEffect(() => {
		let timerId = setTimeout(() => {
			formatForDisplay(workshopSessionQuizList?.data);
		}, 1000);
		return () => clearTimeout(timerId);
	}, [limitPerPage]);
	// useEffect(() => {
	// 	let timerId = setTimeout(() => {
	// 		formatForDisplay1(workshopSessionDetails?.observationForms);
	// 	}, 1000);
	// 	return () => clearTimeout(timerId);
	// }, [limitPerPage1]);

	useEffect(() => {
		dispatch(getWorkshopSessionDetails({ workshopSessionId }));
	}, []);




	useEffect(() => {
		if (workshopSessionDetails?.quizFilter?.length > 0) {
			setSelecedValue(workshopSessionDetails?.quizFilter[0]?.value);
			setSelectedType(workshopSessionDetails?.quizFilter[0]?.type)
		}
	}, [workshopSessionDetails]);

	useEffect(() => {

		if (workshopSessionDetails?.quizFilter?.length > 0 && selectedValue) {
			dispatch(getWorkshopSessionQuizList({ workshopSessionId, quizId: selectedValue, perPage: limitPerPage, page: page, quizStatus: workshopSessionQuizStatusValue, attendanceStatus: workshopSessionQuizAttendanceValue }));
			// dispatch(getWorkshopSessionQuizList({ workshopSessionId, quizId, perPage: limitPerPage, page: page,}));
		}
	}, [selectedValue, limitPerPage, page]);

	const formatForDisplay = (data) => {
		const formatedRows = [];
		data?.forEach((item, index) => {
			formatedRows.push({
				id: 1,
				name: item.name,
				attendance: item.attendance,
				attendance_updated_on: item.attendance_updated_on,
				quiz_status: item.quiz_status,
				quiz_filled_by: item.quiz_filled_by,
				quiz_score: item.quiz_score,
				whatsappStatus: item.whatsappStatus,
				smsStatus: item.smsStatus,
				whatsappErrorTitle: item.whatsappErrorTitle,
				smsErrorTitle: item.smsErrorTitle
			});
		});
	};


	// const formatForDisplay1 = (data) => {
	// 	const formatedRows1 = [];
	// 	data?.forEach((item, index) => {
	// 		formatedRows1.push({
	// 			id: 1,
	// 			formName: item.formName,
	// 			formFilled: item.formFilled,
	// 			formId: item.formId,
	// 		});
	// 	});
	// }

	const onPageChange = (page) => {
		setPage(page);
	};

	const onNavigateDetails = (id) => {


		navigate(`/progress/village/workshop/session/previewQuiz/${id}`, { state: { villageAreaId, conductedById, programUnitContentId: selectedValue, progressName, name, workshopSessionId, supervisor } });



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

	const getContent = (title, desc, area) => {
		return (
			<div className={`tw-flex tw-flex-col tw-gap-2 ${area ? 'tw-w-full' : 'tw-w-[240px]'}`}>
				<span className="tw-text-xs tw-text-grey tw-block tw-mb-[6px]">{title}</span>
				<span className="tw-text-sm tw-text-primaryText">{desc}</span>
			</div>
		);
	};

	const handleChange = (selectedValue) => {
		setSelecedValue(selectedValue);
		setPage(1);
	};

	const handleSessionForm = (formId) => {
		navigate(`/progress/village/workshop/session/previewForm/${formId}`, {
			state: { progressName, name, villageAreaId, conductedById, programUnitContentId, programId, unitId, moderatedById, programUnitId, workshopSessionId, supervisor },
		});
	};


	const handleViewPhoto = (img) => {
		img && window.open(img, '_blank')
	}



	let BackgroundTheme =
		workshopSessionDetails?.status?.toLowerCase() === 'pending' ? '#F4E6E6' : workshopSessionDetails?.status?.toLowerCase() === 'closed' ? 'rgba(56, 146, 255, 0.20)' : '#DDDDDD';
	let ColorTheme = workshopSessionDetails?.status?.toLowerCase() === 'pending' ? '#EB5757' : workshopSessionDetails?.status?.toLowerCase() === 'closed' ? '#3892FF' : '#666666';


	const onNavigateDetailsChildren = (data) => {
		navigate(`/progress/village/workshop/session/children`, { state: { parentId: data.id, villageAreaId, conductedById, programUnitContentId: selectedValue, progressName, name, workshopSessionId, supervisor,parentName:data?.parentName } });


	}

	const typeQuiz = workshopSessionDetails?.quizFilter?.find((item) => item?.value === selectedValue)
	return (
		<>
			<Link onClick={Back}>
				<ArrowBackIcon className="tw-text-grey" />
				<span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">Progress / Kids Learning Importance/ Egamore Village/Area/ Workshop/ Session</span>
			</Link>
			<Typography variant="h2" className="!tw-font-semibold !tw-text-secondaryText">
				Session
			</Typography>
			<Paper className="tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6">
				<Typography variant="h4" className="!tw-font-semibold !tw-text-secondaryText">
					Session Details
				</Typography>
				<div className="tw-flex tw-items-start tw-flex-wrap tw-gap-6">
					{getContent('Agenda of The Session', workshopSessionDetails?.agenda)}
					{getContent('Start Date and Time', workshopSessionDetails?.formattedStartedAt)}
					{getContent('End Date and Time', workshopSessionDetails?.formattedEndedAt)}
					{getContent('Meeting Location', workshopSessionDetails?.location)}
					{getContent('Status Updated On', workshopSessionDetails?.statusUpdatedOn)}
					<div className="tw-flex tw-items-start tw-flex-wrap tw-gap-6">
						<div className={`tw-flex tw-flex-col tw-gap-2  tw-w-[240px]`}>
							<span className="tw-text-xs tw-text-grey tw-block tw-mb-[6px]">CEW Photo</span>
							<span className="tw-text-sm tw-text-primaryText">
								<Button variant="outlined" disabled={workshopSessionDetails?.temporaryWorkshopMediaUrl === null} onClick={() => handleViewPhoto(workshopSessionDetails?.temporaryWorkshopMediaUrl)}>
									View Photo</Button>
							</span>
						</div>
					</div>

					<div className={`tw-flex tw-flex-col tw-gap-2  tw-w-[240px]`}>
						<span className="tw-text-xs tw-text-grey tw-block tw-mb-[6px]">Status</span>
						<span className=" tw-text-primaryText tw-py-1 tw-rounded tw-px-2 tw-text-center tw-text-sm tw-w-fit" style={{ backgroundColor: BackgroundTheme, color: ColorTheme }} >{workshopSessionDetails?.status}</span>
					</div>

				</div>
				{/* <div className="tw-flex tw-items-start tw-flex-wrap tw-gap-6">{getContent('Status Updated On', workshopSessionDetails?.statusUpdatedOn)}</div> */}
			</Paper>
			<Paper className="tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6">
				<Typography variant="h4" className="!tw-font-semibold !tw-text-secondaryText">
					Observation Form for Supervisor
				</Typography>

				{workshopSessionDetails?.observationForms?.length > 0 ? workshopSessionDetails?.observationForms?.map((item) => (
					<div className="tw-flex tw-justify-between tw-w-full tw-items-center" key={item.formId}>
						<span className="!tw-font-semibold !tw-text-secondaryText tw-text-lg">{item.formName}</span>
						<Button variant="outlined" disabled={!item.formFilled} onClick={() => handleSessionForm(item.formId)}>
							View Observation Form
						</Button>
					</div>
				)) :
					<p className='tw-w-full tw-text-center tw-mx-auto'>No observation Forms</p>
				}
				{/* {!loader ? (
					<>
						{workshopSessionDetails?.observationForms?.length ? (
							<EnhancedObservationFormTable
								paginate={paginateInfo}
								scrollable
								onNavigateDetails={onNavigateDetails}
								actions={{ edit: true, preview: true }}
								columns={header1}
								data={workshopSessionDetails?.observationForms}
								onPageChange={onPageChange}
								page={page}
								details={true}
								keyProp="uuid"
								setLimitPerPage={setLimitPerPage}
								limitPerPage={limitPerPage}
								setPage={setPage}
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
				)} */}
			</Paper>

			<Paper className="tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6">
				<div className={`tw-flex tw-justify-between tw-w-full tw-items-center`}>
					{/* {workshopSessionQuizList?.data?.length ? ( */}
					<div className="tw-w-[200px] tw-flex ">
						<SurveyDropdown options={workshopSessionDetails?.quizFilter} value={selectedValue} onChange={handleChange} valuekey="value" labelkey="label" label="Select Quiz" />
					</div>
					{/* ) : null} */}

					<div className="tw-relative">
						<Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!workshopSessionFilter ? <FilterListIcon className="tw-text-primary" /> : <img src={filter_on} />}>
							Filters
						</Button>
						<Filter anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleClose={handleClose} page={page} limitPerPage={limitPerPage} workshopSessionId={workshopSessionId} quizId={selectedValue} />
					</div>
				</div>

				{!loader ? (
					<>
						{workshopSessionQuizList?.data?.length ? (
							<EnhancedQuizTable
								paginate={paginateInfo}
								scrollable
								onNavigateDetails={onNavigateDetails}
								actions={{ edit: true, preview: true }}
								columns={typeQuiz?.type==="Children"?header:header2}
								data={workshopSessionQuizList?.data}
								onPageChange={onPageChange}
								page={page}
								details={true}
								keyProp="uuid"
								setLimitPerPage={setLimitPerPage}
								limitPerPage={limitPerPage}
								setPage={setPage}
								selectedType={typeQuiz?.type}
								onNavigateDetailsChildren={onNavigateDetailsChildren}
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
