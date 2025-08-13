import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, CircularProgress, IconButton, Paper, Popover, Tooltip } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import EnhancedTable from '../../../components/UnitContent/Table';
import { useDispatch, useSelector } from 'react-redux';
import { deleteContent, getWorkshopContentList, workshopUploadMedia } from '../duck/network';
import { resetQuizForm, resetSelectedQuestionnaire, setWorkshopUploadMediaLoading } from '../duck/workshopContentSlice';
import FormDialog, { DeleteDialog } from '../../../components/Dialog';
import { DropzoneDocument } from '../../../components/Dropzone';
import { duplicateContent, toggleContentVisibility, updateWorkshop } from '../../duck/network';
import { LoadingButton } from '@mui/lab';
import { ErrorBox } from '../../../components/Errorbox';
import duplicateIcon from '../../../../public/assets/icons/duplicate.svg';
import duplicateDisableIcon from '../../../../public/assets/icons/duplicate_disable.svg';
import previewIcon from '../../../../public/assets/icons/preview.svg';
import previewDisableIcon from '../../../../public/assets/icons/preview_disable.svg';

const header1 = [
	{
		id: 'serialNumber',
		numeric: false,
		disablePadding: true,
		label: 'Sr No.',
		sort: false,
		width: 100,
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
		id: 'totalQuestions',
		numeric: false,
		disablePadding: true,
		label: 'Total Question',
		sort: false,
		width: 100,
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
		width: 220,
	},
];

export default function WorkshopContent() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loader = useSelector((state) => state.workshopContent.workshopContentListLoading);
	const workshopContentList = useSelector((state) => state.workshopContent.workshopContentList);
	const workshopUploadMediaLoading = useSelector((state) => state.workshopContent.workshopUploadMediaLoading);
	const duplicateLoader = useSelector((state) => state.loader.duplicateLoader);

	const [selectedWorkshopContent, setSelectedWorkshopContent] = useState({});
	const [selectedContentType, setSelectedContentType] = useState({});
	const [quizList, setQuizList] = useState([]);
	const [observationFormList, setObservationFormList] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [openAttachmentDialog, setOpenAttachmentDialog] = useState(false);
	const [media, setMedia] = useState([]);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedMedia, setSelectedMedia] = useState(null);
	const [fileSizeError, setFileSizeError] = useState(null);
	const [permissions, setPermissions] = useState({});
	const [header, setHeader] = useState(header1);
	const [openDeleteContentDialog, setOpenDeleteContentDialog] = useState(false);
	const [totalMedia, setTotalMedia] = useState([]);

	const unit = location?.state?.unit;
	const workshop = location?.state?.workshop;
	const programDetails = JSON.parse(window.localStorage.getItem('currentProgram'));

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	useEffect(() => {
		if (workshopContentList?.mediaContents?.length > 0) {
			setTotalMedia([...workshopContentList?.mediaContents, ...media]);
		} else {
			setTotalMedia([...media]);
		}
	}, [workshopContentList, media]);

	useEffect(() => {
		runEffect();

		if (programDetails?.status == 'closed') {
			setHeader((prev) => {
				let newHeader = [...prev];
				newHeader[3].label = 'Closed On';
				// newHeader.pop();
				return newHeader;
			});
		}
	}, [programDetails?.status]);

	useEffect(() => {
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
	}, []);

	const runEffect = () => {
		dispatch(getWorkshopContentList({ workshopId: workshop?.id })).then((res) => {
			let filteredQuiz = res?.data?.childContents?.filter((item) => item.type == 'ws_uq');
			let filteredObservationForm = res?.data?.childContents?.filter((item) => item.type == 'ws_of');

			if (filteredQuiz) setQuizList(filteredQuiz);
			if (filteredObservationForm) setObservationFormList(filteredObservationForm);
		});
		dispatch(resetSelectedQuestionnaire());
		dispatch(resetQuizForm());
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleManage = (id, e, type) => {
		setAnchorEl(e.currentTarget);
		let filterWorkshopContent = workshopContentList?.childContents?.find((item) => item.id == id);
		setSelectedWorkshopContent(filterWorkshopContent);
		setSelectedContentType(type);
	};

	const handleRowClick = (id, type) => {
		let filterWorkshopContent = workshopContentList?.childContents?.find((item) => item.id == id);
		if (type == 'observationForms')
			navigate(`/workshop-content/${type}/update/${id}`, { state: { workshop: workshop, workshopContent: filterWorkshopContent, unit: location?.state?.unit, programId: location.state.programId } });
		if (type == 'quizzes') navigate(`/workshop-content/${type}/update/${id}`, { state: { workshop: workshop, workshopContent: filterWorkshopContent, unit: location?.state?.unit, programId: location.state.programId } });
	};

	const handleAttachment = () => {
		setOpenAttachmentDialog(true);
	};

	const handleDialogClose = () => {
		setOpenAttachmentDialog(false);
		setMedia([]);
	};

	const handleOnDrop = (files) => {
		setFileSizeError('');
		files.map((file) => {
			if (file.size > 5000000) {
				setFileSizeError('File size cannot be greator then 5MB');
			}
		});
		setMedia((prevMedia) => [...prevMedia, ...files]);
	};

	const handleDocUpload = () => {
		let formData = new FormData();
		if (media.length > 0) {
			media.map((file, index) => {
				formData.append(`files[${index}]`, file);
			});
			dispatch(setWorkshopUploadMediaLoading(true));
			dispatch(workshopUploadMedia(formData)).then((resp) => {
				dispatch(updateWorkshop(workshopContentList?.id, { mediaContents: [...workshopContentList?.mediaContents, ...resp?.data], updateType: 'addMediaContent' })).then(() => {
					dispatch(setWorkshopUploadMediaLoading(false));
					setOpenAttachmentDialog(false);
					setFileSizeError();
					setMedia([]);
					runEffect();
				});
			});
		}
	};

	const handleDocDelete = (file) => {
		setFileSizeError('');
		const newMedia = [...media];
		newMedia.splice(newMedia.indexOf(file), 1);
		setMedia(newMedia);
	};

	const handleAttachmentDelete = (file) => {
		setOpenDeleteDialog(true);
		setSelectedMedia(file);
	};

	const handleDeleteConfirm = () => {
		const newMedia = [...workshopContentList?.mediaContents];
		newMedia.splice(newMedia.indexOf(selectedMedia), 1);
		dispatch(updateWorkshop(workshopContentList?.id, { mediaContents: [...newMedia], updateType: 'deleteMediaContent' })).then(() => {
			dispatch(setWorkshopUploadMediaLoading(false));
			setOpenDeleteDialog(false);
			setSelectedMedia(null);
			setMedia([]);
			runEffect();
		});
	};

	const handleAttachmentClose = () => {
		setOpenDeleteDialog(false);
		setSelectedMedia(null);
	};

	const handleToggle = (id) => {
		dispatch(toggleContentVisibility(id)).then((res) => {
			runEffect();
		});
	};

	const handleCloseDialog = () => {
		setOpenDeleteContentDialog(false);
	};

	const handleDeleteContent = () => {
		let type = '';

		switch (selectedContentType) {
			case 'observationForms':
				type = 'workshop-observation-forms';
				break;
			case 'quizzes':
				type = 'workshop-user-quizzes';
				break;
			default:
				type = '';
		}

		dispatch(deleteContent(selectedWorkshopContent?.id, type)).then((res) => {
			if (res.statusCode == 200) {
				dispatch(getWorkshopContentList({ workshopId: workshop?.id })).then((res) => {
					let filteredQuiz = res?.data?.childContents?.filter((item) => item.type == 'ws_uq');
					let filteredObservationForm = res?.data?.childContents?.filter((item) => item.type == 'ws_of');

					if (filteredQuiz) setQuizList(filteredQuiz);
					if (filteredObservationForm) setObservationFormList(filteredObservationForm);
				});
			}
			handleCloseDialog();
			handleClose();
		});
	};

	const getContentType = () => {
		if (selectedContentType == 'observationForms') {
			return 'observation form';
		}
		if (selectedContentType == 'quizzes') {
			return 'quiz';
		}
	};

	const handleDuplicateContent = () => {
		dispatch(duplicateContent(selectedWorkshopContent?.id)).then((res) => {
			handleClose();
			if (res.statusCode == 200) {
				dispatch(getWorkshopContentList({ workshopId: workshop?.id })).then((res) => {
					let filteredQuiz = res?.data?.childContents?.filter((item) => item.type == 'ws_uq');
					let filteredObservationForm = res?.data?.childContents?.filter((item) => item.type == 'ws_of');

					if (filteredQuiz) setQuizList(filteredQuiz);
					if (filteredObservationForm) setObservationFormList(filteredObservationForm);
				});
			}
		});
	};

	return !loader ? (
		<>
			<h1 className="tw-font-bold tw-text-[24px]">
				<Button
					variant="text"
					onClick={() => navigate(`/programs-unit/unit-content/${location?.state?.unit?.id}`, { state: { unitContent: location?.state?.workshop, unit: location?.state?.unit, programId: location.state.programId } })}
					className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[12px]"
					disableRipple
					startIcon={<KeyboardBackspaceIcon />}
				>
					{`Program / ${unit.serialNumber} / ${workshop.serialNumber}`}
				</Button>
				<h1 className="tw-px-2 tw-mt-[-4px]">{location?.state?.workshop?.title}</h1>
				<div className="tw-pt-6">
					<Paper sx={{ padding: '24px' }}>
						<div className="tw-bg-backgroundBody tw-p-4 tw-rounded tw-mb-6">
							<div className="tw-flex tw-justify-between tw-items-center">
								<p className="tw-text-[18px] tw-font-semibold tw-text-[#231F20]"> Workshop Quiz</p>
								{permissions?.Programs?.program_unit?.ws?.create && (
									<Button
										variant="outlined"
										className="tw-w-[200px]"
										onClick={() => navigate(`/workshop-content/quizzes/create`, { state: { unit: location?.state?.unit, programId: location.state.programId, workshop: workshop } })}
										disabled={programDetails?.status == 'closed' ? true : false}
									>
										Add Quiz
									</Button>
								)}
							</div>
							{quizList && quizList?.length > 0 && (
								<div>
									<EnhancedTable
										disabled={programDetails?.status == 'closed' ? true : permissions?.Programs?.program_unit?.ws?.update ? false : true}
										handleToggle={handleToggle}
										handleRowClick={handleRowClick}
										handleManage={handleManage}
										contentType="quizzes"
										scrollable
										columns={header}
										data={quizList}
										details={true}
										keyProp="id"
										type="workshop"
										programId={location.state.programId}
										programUnitId={location?.state?.unit?.id}
									/>
								</div>
							)}
						</div>
						<div className="tw-bg-backgroundBody tw-p-4 tw-rounded tw-mb-6">
							<div className="tw-flex tw-justify-between tw-items-center">
								<p className="tw-text-[18px] tw-font-semibold tw-text-[#231F20]">Observation Form</p>
								{permissions?.Programs?.program_unit?.ws?.create && (
									<Button
										variant="outlined"
										className="tw-w-[200px]"
										onClick={() => navigate(`/workshop-content/observationForms/create`, { state: { unit: location?.state?.unit, programId: location.state.programId, workshop: workshop } })}
										disabled={programDetails?.status == 'closed' ? true : false}
									>
										Add Observation Form
									</Button>
								)}
							</div>
							{observationFormList && observationFormList?.length > 0 && (
								<div>
									<EnhancedTable
										disabled={programDetails?.status == 'closed' ? true : permissions?.Programs?.program_unit?.ws?.update ? false : true}
										handleToggle={handleToggle}
										handleRowClick={handleRowClick}
										handleManage={handleManage}
										contentType="observationForms"
										scrollable
										columns={header}
										data={observationFormList}
										details={true}
										keyProp="id"
									/>
								</div>
							)}
						</div>
					</Paper>
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
									if (selectedContentType == 'observationForms')
										navigate(`/workshop-content/${selectedContentType}/update/${selectedWorkshopContent?.id}`, {
											state: { workshopContent: selectedWorkshopContent, unit: location?.state?.unit, programId: location.state.programId, workshop: workshop },
										});
									if (selectedContentType == 'quizzes')
										navigate(`/workshop-content/${selectedContentType}/update/${selectedWorkshopContent?.id}`, {
											state: { unit: location?.state?.unit, programId: location?.state?.programId, workshopContent: selectedWorkshopContent, workshop: workshop },
										});
								}}
								variant="text"
								className="!tw-text-secondary !tw-justify-start"
								startIcon={<VisibilityIcon />}
							>
								view details
							</Button>
							{(selectedContentType == 'quizzes' || selectedContentType == 'observationForms') && (
								<Button
									disabled={programDetails?.status !== 'closed' ? false : true}
									startIcon={<img height={20} width={20} src={programDetails?.status !== 'closed' ? previewIcon : previewDisableIcon} />}
									className={`${programDetails?.status !== 'closed' ? '!tw-text-secondary' : '!tw-text-grey'} !tw-justify-start`}
									variant="text"
									onClick={() => {
										if (selectedContentType == 'quizzes' || selectedContentType == 'observationForms')
											navigate(`/workshop-content/${selectedContentType}/preview/${selectedWorkshopContent?.id}`, {
												state: { unit: location?.state?.unit, programId: location?.state?.programId, workshopContent: selectedWorkshopContent, workshop: workshop },
											});
									}}
								>
									Preview
								</Button>
							)}
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
							{permissions?.Programs?.program_unit?.ws?.delete && (
								<Button
									disabled={programDetails?.status !== 'closed' ? false : true}
									startIcon={<DeleteIcon />}
									className={`${programDetails?.status !== 'closed' ? '!tw-text-error' : '!tw-text-grey'} !tw-justify-start`}
									variant="text"
									onClick={() => setOpenDeleteContentDialog(true)}
								>
									Delete
								</Button>
							)}
						</div>
					</Popover>
				</div>
				<div className="tw-pt-6">
					<Paper sx={{ padding: '24px' }}>
						<div className="">
							<div className="tw-flex tw-justify-between tw-items-center">
								<p className="tw-text-[18px] tw-font-semibold tw-text-[#231F20]">Session Plan</p>
								{permissions?.Programs?.program_unit?.ws?.create && (
									<Tooltip arrow placement="top" title={`${totalMedia?.length >= 3 ? 'max limit reached' : ''}`}>
										<span>
											<Button disabled={programDetails?.status == 'closed' ? true : totalMedia?.length >= 3 ? true : false} variant="outlined" className="tw-w-[200px]" onClick={() => handleAttachment()}>
												Add Attachments
											</Button>
										</span>
									</Tooltip>
								)}
							</div>
							{workshopContentList?.mediaContents?.length > 0 && (
								<div>
									{workshopContentList?.mediaContents.map((media, index) => {
										return (
											<div key={index} className="tw-flex tw-justify-between tw-items-center tw-bg-backgroundBody tw-rounded  tw-px-2 tw-py-4 tw-mt-6">
												<div className="tw-flex tw-gap-2 tw-items-center">
													<AttachFileIcon />
													<p className="tw-text-sm">{media.mediaUrl.slice(10)}</p>
												</div>
												{permissions?.Programs?.program_unit?.ws?.update && (
													<IconButton disabled={programDetails?.status == 'closed' ? true : false} sx={{ padding: 0 }} color="error" onClick={(media) => handleAttachmentDelete(media)}>
														<DeleteIcon />
													</IconButton>
												)}
											</div>
										);
									})}
								</div>
							)}
							{totalMedia?.length > 0 && (
								<p className="tw-text-[14px] tw-font-semibold tw-text-right tw-pt-4 tw-text-[#999999]">
									<sup>*</sup>Max 3 pdf allowed to add
								</p>
							)}
						</div>
					</Paper>
				</div>
			</h1>
			<FormDialog open={openAttachmentDialog} close={handleDialogClose} title="Add Attachments">
				<div>
					<DropzoneDocument multiple={false} fileCount={totalMedia.length} onDrop={handleOnDrop} handleDocRemove={handleDocDelete} />
					{fileSizeError && (
						<ErrorBox>
							<ErrorOutlineIcon fontSize="small" />
							<span>{fileSizeError}</span>
						</ErrorBox>
					)}
					<div className="tw-pt-8 tw-pb-1 tw-flex tw-justify-end tw-gap-5">
						<div className="tw-grow">
							<Button onClick={handleDialogClose} fullWidth variant="outlined">
								Cancel
							</Button>
						</div>
						<div className="tw-grow">
							<LoadingButton
								disabled={media.length > 0 && !fileSizeError ? false : true}
								className={`${media.length > 0 && !fileSizeError ? '' : '!tw-bg-[#0000001f]'}`}
								onClick={handleDocUpload}
								loading={workshopUploadMediaLoading}
								fullWidth
								variant="contained"
								disableElevation
							>
								Add
							</LoadingButton>
						</div>
					</div>
				</div>
			</FormDialog>
			{openDeleteDialog && (
				<DeleteDialog open={openDeleteDialog} loading={false} close={handleAttachmentClose} delete={handleDeleteConfirm} title="Delete Attachment">
					<p>Are you sure you want to delete this Attachment?</p>
					<p>This action is irreversible</p>
				</DeleteDialog>
			)}
			{openDeleteContentDialog && (
				<FormDialog open={openDeleteContentDialog} close={handleCloseDialog} title={`Delete ${getContentType()}`}>
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
		</>
	) : (
		<div className="tw-flex tw-items-center tw-justify-center">{<CircularProgress />}</div>
	);
}
