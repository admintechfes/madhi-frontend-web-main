import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button, CircularProgress, Paper, Popover } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';

import EnhancedTable from '../components/UnitContent/Table';
import FormDialog from '../components/Dialog';
import { deleteContent, duplicateContent, getUnitContentList, getWorkshopList, toggleContentVisibility } from './duck/network';
import { resetQuizForm, resetSelectedQuestionnaire, resetSurveyForm } from './duck/unitContentSlice';
import duplicateIcon from '../../public/assets/icons/duplicate.svg';
import duplicateDisableIcon from '../../public/assets/icons/duplicate_disable.svg';
import previewIcon from '../../public/assets/icons/preview.svg';
import previewDisableIcon from '../../public/assets/icons/preview_disable.svg';
import EditIcon from '@mui/icons-material/Edit';

const workshopHeader1 = [
	{
		id: 'serialNumber',
		numeric: false,
		disablePadding: true,
		label: 'Sr No.',
		sort: false,
		width: 140,
	},
	{
		id: 'title',
		numeric: false,
		disablePadding: true,
		label: 'Title',
		sort: false,
		width: 200,
	},
	{
		id: 'createdOn',
		numeric: false,
		disablePadding: true,
		label: 'Created On',
		sort: false,
		width: 200,
	},

	{
		id: 'action',
		numeric: false,
		disablePadding: true,
		label: 'Action',
		sort: false,
		// align: 'right',
		width: 220,
	},
];

const header1 = [
	{
		id: 'serialNumber',
		numeric: false,
		disablePadding: true,
		label: 'Sr No.',
		sort: false,
		width: 200,
	},
	{
		id: 'title',
		numeric: false,
		disablePadding: true,
		label: 'Title',
		sort: false,
		width: 300,
	},
	{
		id: 'contentFor',
		numeric: false,
		disablePadding: true,
		label: 'Type',
		sort: false,
		width: 300,
	},
	{
		id: 'totalQuestions',
		numeric: false,
		disablePadding: true,
		label: 'Total Question',
		sort: false,
		width: 200,
	},
	{
		id: 'createdOn',
		numeric: false,
		disablePadding: true,
		label: 'Created On',
		sort: false,
		width: 200,
	},

	{
		id: 'action',
		numeric: false,
		disablePadding: true,
		label: 'Action',
		sort: false,
		// align: 'right',
		width: 200,
	},
];

const visitHeader = [
	{
		id: 'serialNumber',
		numeric: false,
		disablePadding: true,
		label: 'Sr No.',
		sort: false,
		width: 200,
	},
	{
		id: 'title',
		numeric: false,
		disablePadding: true,
		label: 'Title',
		sort: false,
		width: 300,
	},
	{
		id: 'typeName',
		numeric: false,
		disablePadding: true,
		label: 'Type',
		sort: false,
		width: 300,
	},
	{
		id: 'totalQuestions',
		numeric: false,
		disablePadding: true,
		label: 'Total Question',
		sort: false,
		width: 200,
	},
	{
		id: 'createdOn',
		numeric: false,
		disablePadding: true,
		label: 'Created On',
		sort: false,
		width: 200,
	},

	{
		id: 'action',
		numeric: false,
		disablePadding: true,
		label: 'Action',
		sort: false,
		// align: 'right',
		width: 200,
	},
];

export default function UnitContent() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loader = useSelector((state) => state.unitContent.unitContentListLoading);
	const unitContentList = useSelector((state) => state.unitContent.unitContentList);

	const [selectedUnitContent, setSelectedUnitContent] = useState({});
	const [selectedContentType, setSelectedContentType] = useState('');
	const [anchorEl, setAnchorEl] = useState(null);
	const [header, setHeader] = useState(header1);
	const [workshopHeader, setWorkshopHeader] = useState(workshopHeader1);
	const [permissions, setPermissions] = useState({});
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const duplicateLoader = useSelector((state) => state.loader.duplicateLoader);

	const programDetails = JSON.parse(window.localStorage.getItem('currentProgram'));

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	useEffect(() => {
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
	}, []);

	useEffect(() => {
		dispatch(getUnitContentList({ programUnitId: location?.state?.unit?.id }));
		dispatch(resetSelectedQuestionnaire());
		dispatch(resetQuizForm());
		dispatch(resetSurveyForm());

		if (programDetails?.status == 'closed') {
			setHeader((prev) => {
				let newHeader = [...prev];
				newHeader[3].label = 'Closed On';
				// newHeader.pop();
				return newHeader;
			});
			setWorkshopHeader((prev) => {
				let newHeader = [...prev];
				newHeader[2].label = 'Closed On';
				// newHeader.pop();
				return newHeader;
			});
		}
	}, [programDetails?.status]);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const formatForDisplay = (data) => {
		const formatedRows = [];
		data?.forEach((item, index) => {
			formatedRows.push({
				id: item.id,
				srNo: `Workshop ${index + 1}`,
				title: item.title,
				createdOn: item.createdOn,
			});
		});
	};

	const handleManage = (id, e, type) => {
		setAnchorEl(e.currentTarget);
		let filterUnitContent = '';
		filterUnitContent = unitContentList[type]?.find((item) => item.id == id);
		if (type == 'surveys') {
			filterUnitContent = unitContentList['oneOnOneMeetingSurveyForms']?.find((item) => item.id == id);
		}
		if (type == 'learning-activity') {
			filterUnitContent = unitContentList['learningActivityContents']?.find((item) => item.id == id);
		}
		setSelectedUnitContent(filterUnitContent);
		setSelectedContentType(type);
	};

	const handleRowClick = (id, type) => {
		let filterUnitContent = unitContentList[type]?.find((item) => item.id == id);
		if (type == 'workshops') navigate(`/unit-content/${type}/${id}`, { state: { unitContent: filterUnitContent, unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } });
		if (type == 'quizzes') navigate(`/unit-content/${type}/update/${id}`, { state: { unitContent: filterUnitContent, unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } });
		if (type == 'surveys') navigate(`/unit-content/${type}/update/${id}`, { state: { unitContent: filterUnitContent, unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } });
		if (type == 'learning-activity')
			navigate(`/unit-content/${type}/update/${id}`, { state: { unitContent: filterUnitContent, unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } });
		if (type == 'visits') navigate(`/unit-content/${type}/update/${id}`, { state: { unitContent: filterUnitContent, unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } });
	};

	const handleToggle = (id) => {
		dispatch(toggleContentVisibility(id)).then((res) => {
			dispatch(getUnitContentList({ programUnitId: location?.state?.unit?.id }));
		});
	};

	const handleDeleteContent = () => {
		let type = '';

		switch (selectedContentType) {
			case 'workshops':
				type = 'workshops';
				break;
			case 'quizzes':
				type = 'quizzes';
				break;
			case 'surveys':
				type = 'meeting-surveys';
				break;
			case 'learning-activity':
				type = 'learning-activity-contents';
				break;
			case 'visits':
				type = 'visits';
				break;
			default:
				type = '';
		}

		dispatch(deleteContent(selectedUnitContent?.id, type)).then((res) => {
			if (res.statusCode == 200) {
				dispatch(getUnitContentList({ programUnitId: location?.state?.unit?.id }));
			}
			handleCloseDialog();
			handleClose();
		});
	};

	const handleCloseDialog = () => {
		setOpenDeleteDialog(false);
	};

	const getContentType = () => {
		if (selectedContentType == 'workshops') {
			return 'workshop';
		}
		if (selectedContentType == 'quizzes') {
			return 'quiz';
		}
		if (selectedContentType == 'surveys') {
			return 'survey';
		}
		if (selectedContentType == 'learning-activity') {
			return 'learning activity';
		}
		if (selectedContentType == 'visits') {
			return 'visits';
		}
	};

	const getDeletePermissionType = () => {
		if (selectedContentType == 'workshops') {
			return 'ws';
		}
		if (selectedContentType == 'quizzes') {
			return 'qz';
		}
		if (selectedContentType == 'surveys') {
			return '1o1msf';
		}
		if (selectedContentType == 'learning-activity') {
			return 'lac';
		}
		if (selectedContentType == 'visits') {
			return '1o1msf';
		}
	};

	const handleDuplicateContent = () => {
		dispatch(duplicateContent(selectedUnitContent?.id)).then((res) => {
			handleClose();
			if (res.statusCode == 200) {
				dispatch(getUnitContentList({ programUnitId: location?.state?.unit?.id }));
			}
		});
	};

	return !loader ? (
		<>
			<h1 className="tw-font-bold tw-text-[24px]">
				<Button
					variant="text"
					onClick={() => navigate(`/program-details/${location.state.programId}`)}
					className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[12px]"
					disableRipple
					startIcon={<KeyboardBackspaceIcon />}
				>
					{`Programs Details`}
				</Button>
				<h1 className="tw-px-2 tw-mt-[-4px]">{`${location?.state?.unit?.serialNumber} - ${location?.state?.unit?.name}`}</h1>
				<div className="tw-pt-6">
					<Paper sx={{ padding: '24px' }}>
						<div className="tw-bg-backgroundBody tw-p-4 tw-rounded tw-mb-6">
							<div className="tw-flex tw-justify-between tw-items-center">
								<p className="tw-text-md tw-font-semibold tw-text-[#231F20]">Workshop</p>
								{permissions?.Programs?.program_unit?.ws?.create && (
									<Button
										disabled={programDetails?.status == 'closed' ? true : false}
										variant="outlined"
										className="tw-w-[200px]"
										onClick={() => navigate(`/unit-content/workshops/create`, { state: { unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } })}
									>
										Add Workshop
									</Button>
								)}
							</div>
							{unitContentList && unitContentList?.workshops?.length > 0 && (
								<div>
									<EnhancedTable
										disabled={programDetails?.status == 'closed' ? true : permissions?.Programs?.program_unit?.ws?.update ? false : true}
										handleToggle={handleToggle}
										handleRowClick={handleRowClick}
										handleManage={handleManage}
										contentType="workshops"
										scrollable
										columns={workshopHeader}
										data={unitContentList?.workshops ?? []}
										details={true}
										keyProp="id"
									/>
								</div>
							)}
						</div>
						<div className="tw-bg-backgroundBody tw-p-4 tw-rounded tw-mb-6">
							<div className="tw-flex tw-justify-between tw-items-center">
								<p className="tw-text-md tw-font-semibold tw-text-[#231F20]">Quiz</p>
								{permissions?.Programs?.program_unit?.qz?.create && (
									<Button
										disabled={programDetails?.status == 'closed' ? true : false}
										variant="outlined"
										className="tw-w-[200px]"
										onClick={() => navigate(`/unit-content/quizzes/create`, { state: { unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } })}
									>
										Add Quiz
									</Button>
								)}
							</div>
							{unitContentList && unitContentList?.quizzes?.length > 0 && (
								<div>
									<EnhancedTable
										disabled={programDetails?.status == 'closed' ? true : permissions?.Programs?.program_unit?.qz?.update ? false : true}
										handleToggle={handleToggle}
										handleRowClick={handleRowClick}
										handleManage={handleManage}
										contentType="quizzes"
										scrollable
										columns={header}
										data={unitContentList?.quizzes ?? []}
										details={true}
										keyProp="id"
										programId={location.state.programId}
										programUnitId={location?.state?.unit?.id}
									/>
								</div>
							)}
						</div>
						<div className="tw-bg-backgroundBody tw-p-4 tw-rounded tw-mb-6">
							<div className="tw-flex tw-justify-between tw-items-center">
								<p className="tw-text-md tw-font-semibold tw-text-[#231F20]">Survey</p>
								{permissions?.Programs?.program_unit['1o1msf']?.create && (
									<Button
										disabled={programDetails?.status == 'closed' ? true : false}
										variant="outlined"
										className="tw-w-[200px]"
										onClick={() => navigate(`/unit-content/surveys/create`, { state: { unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } })}
									>
										Add Survey Form
									</Button>
								)}
							</div>
							{unitContentList && unitContentList?.oneOnOneMeetingSurveyForms?.length > 0 && (
								<div>
									<EnhancedTable
										disabled={programDetails?.status == 'closed' ? true : permissions?.Programs?.program_unit['1o1msf']?.update ? false : true}
										handleToggle={handleToggle}
										handleRowClick={handleRowClick}
										handleManage={handleManage}
										contentType="surveys"
										scrollable
										columns={header}
										data={unitContentList?.oneOnOneMeetingSurveyForms ?? []}
										details={true}
										keyProp="id"
									/>
								</div>
							)}
						</div>
						<div className="tw-bg-backgroundBody tw-p-4 tw-rounded tw-mb-6">
							<div className="tw-flex tw-justify-between tw-items-center">
								<p className="tw-text-md tw-font-semibold tw-text-[#231F20]">Learning Content</p>
								{permissions?.Programs?.program_unit?.lac?.create && (
									<Button
										disabled={programDetails?.status == 'closed' ? true : false}
										variant="outlined"
										className="tw-w-[200px]"
										onClick={() => navigate(`/unit-content/learning-activity/create`, { state: { unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } })}
									>
										Add Content
									</Button>
								)}
							</div>
							{unitContentList && unitContentList?.learningActivityContents?.length > 0 && (
								<div>
									<EnhancedTable
										disabled={programDetails?.status == 'closed' ? true : permissions?.Programs?.program_unit?.lac?.update ? false : true}
										handleToggle={handleToggle}
										handleRowClick={handleRowClick}
										handleManage={handleManage}
										contentType="learning-activity"
										scrollable
										columns={workshopHeader}
										data={unitContentList?.learningActivityContents ?? []}
										details={true}
										keyProp="id"
									/>
								</div>
							)}
						</div>
						<div className="tw-bg-backgroundBody tw-p-4 tw-rounded">
							<div className="tw-flex tw-justify-between tw-items-center">
								<p className="tw-text-md tw-font-semibold tw-text-[#231F20]">Visit</p>
								{permissions?.Programs?.program_unit['1o1msf']?.create && (
									<Button
										disabled={programDetails?.status == 'closed' ? true : false}
										variant="outlined"
										className="tw-w-[200px]"
										onClick={() => navigate(`/unit-content/visits/create`, { state: { unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } })}
									>
										Add Visit Form
									</Button>
								)}
							</div>
							{unitContentList && unitContentList?.visits?.length > 0 && (
								<div>
									<EnhancedTable
										disabled={programDetails?.status == 'closed' ? true : permissions?.Programs?.program_unit['1o1msf']?.update ? false : true}
										handleToggle={handleToggle}
										handleRowClick={handleRowClick}
										handleManage={handleManage}
										contentType="visits"
										scrollable
										columns={visitHeader}
										data={unitContentList?.visits ?? []}
										details={true}
										keyProp="id"
									/>
								</div>
							)}
						</div>
					</Paper>
					{openDeleteDialog && (
						<FormDialog open={openDeleteDialog} close={handleCloseDialog} title={`Delete ${getContentType()}`}>
							<div>
								<p>{`Are you sure you want to delete this ${getContentType()} ?`}</p> <p> This action is irreversible.</p>
								<div className="tw-pt-8 tw-pb-1 tw-flex tw-justify-end tw-gap-5">
									<div className="tw-grow">
										<Button onClick={handleCloseDialog} fullWidth variant="outlined">
											Cancel
										</Button>
									</div>
									<div className="tw-grow">
										<LoadingButton loading={false} onClick={handleDeleteContent} fullWidth variant="contained" color="error" disableElevation>
											Delete
										</LoadingButton>
									</div>
								</div>
							</div>
						</FormDialog>
					)}
					<Popover
						id={id}
						open={open}
						anchorEl={anchorEl}
						onClose={handleClose}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
					>
						<div className="tw-flex tw-flex-col tw-gap-1 tw-p-1">
							<Button
								onClick={() => {
									if (selectedContentType == 'workshops')
										navigate(`/unit-content/${selectedContentType}/${selectedUnitContent?.id}`, { state: { unitContent: selectedUnitContent, unit: location?.state?.unit, programId: location.state.programId } });
									if (selectedContentType == 'quizzes')
										navigate(`/unit-content/${selectedContentType}/update/${selectedUnitContent?.id}`, { state: { unitContent: selectedUnitContent, unit: location?.state?.unit, programId: location.state.programId } });
									if (selectedContentType == 'surveys')
										navigate(`/unit-content/${selectedContentType}/update/${selectedUnitContent?.id}`, { state: { unitContent: selectedUnitContent, unit: location?.state?.unit, programId: location.state.programId } });
									if (selectedContentType == 'learning-activity')
										navigate(`/unit-content/${selectedContentType}/update/${selectedUnitContent?.id}`, { state: { unitContent: selectedUnitContent, unit: location?.state?.unit, programId: location.state.programId } });
									if (selectedContentType == 'visits')
										navigate(`/unit-content/${selectedContentType}/update/${selectedUnitContent?.id}`, { state: { unitContent: selectedUnitContent, unit: location?.state?.unit, programId: location.state.programId } });
								}}
								className={`!tw-text-secondary !tw-justify-start`}
								variant="text"
								startIcon={<VisibilityIcon />}
							>
								view details
							</Button>
							{(selectedContentType == 'workshops') && (
								<Button
									disabled={programDetails?.status !== 'closed' ? false : true}
									startIcon={<EditIcon color={programDetails?.status !== 'closed' ? 'secondary' : 'disabled'} />}
									className={`${programDetails?.status !== 'closed' ? '!tw-text-secondary' : '!tw-text-grey'} !tw-justify-start`}
									variant="text"
									onClick={() => {
										if (selectedContentType == 'workshops')
											navigate(`/unit-content/workshop-content/${selectedUnitContent?.id}`, { state: { unit: location?.state?.unit, workshop: selectedUnitContent, programId: location.state.programId, programDetails: programDetails } })
									}}
								>
									Manage Workshop
								</Button>
							)}
							{(selectedContentType == 'quizzes' || selectedContentType == 'surveys' || selectedContentType == 'visits') && (
								<Button
									disabled={programDetails?.status !== 'closed' ? false : true}
									startIcon={<img height={20} width={20} src={programDetails?.status !== 'closed' ? previewIcon : previewDisableIcon} />}
									className={`${programDetails?.status !== 'closed' ? '!tw-text-secondary' : '!tw-text-grey'} !tw-justify-start`}
									variant="text"
									onClick={() => {
										if (selectedContentType == 'quizzes' || selectedContentType == 'surveys' || selectedContentType == 'visits')
											navigate(`/unit-content/${selectedContentType}/preview/${selectedUnitContent?.id}`, {
												state: { unitContent: selectedUnitContent, unit: location?.state?.unit, programId: location.state.programId },
											});
									}}
								>
									Preview
								</Button>
							)}
							{!selectedContentType=="visits" && (
							<LoadingButton
								disabled={programDetails?.status !== 'closed' ? false : true}
								onClick={handleDuplicateContent}
								loading={duplicateLoader}
								loadingPosition="end"
								startIcon={<img height={20} width={20} src={programDetails?.status !== 'closed' ? duplicateIcon : duplicateDisableIcon} />}
								className={`${programDetails?.status !== 'closed' ? '!tw-text-secondary' : '!tw-text-grey'} !tw-bg-inherit !tw-justify-start`}
								variant="text"
							>
								Duplicate
							</LoadingButton>
							)}
							{permissions?.Programs?.program_unit?.[getDeletePermissionType()]?.delete && (
								<Button
									disabled={programDetails?.status !== 'closed' ? false : true}
									startIcon={<DeleteIcon />}
									className={`${programDetails?.status !== 'closed' ? '!tw-text-error' : '!tw-text-grey'} !tw-justify-start`}
									variant="text"
									onClick={() => setOpenDeleteDialog(true)}
								>
									Delete
								</Button>
							)}
						</div>
					</Popover>
				</div>
			</h1>
		</>
	) : (
		<div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>
	);
}
