import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Button, CircularProgress, Container, IconButton, Paper, TextField, Tooltip } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LoadingButton } from '@mui/lab';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';

import { ErrorBox } from '../../../components/Errorbox';
import { Dropdown } from '../../../components/Select';
import Questionnaire from '../../../components/UnitContent/Questionnaire';
import { deleteSelectedQuestionnnaire, resetSelectedQuestionnaire, setSurveyForm, setSelectedQuestionnaire } from '../../duck/unitContentSlice';
import { createLearningActivity, createSurvey, learningActivityUploadMedia, updateLearningActivity, updateSurvey } from '../../duck/network';
import { DeleteDialog } from '../../../components/Dialog';
import Tabs from '../../../components/UnitContent/Tabs';
import { DropzoneDocument, DropzoneDocumentForActivity, DropzoneImagesForActivity } from '../../../components/Dropzone';
import { toast } from 'react-toastify';

export default function LearningActivityCreate(props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const qParams = useParams();
	const location = useLocation();

	const program = useSelector((state) => state.program.programDetails);
	const loading = useSelector((state) => state.unitContent.surveyCreateLoading);
	const questionnaireData = useSelector((state) => state.unitContent.selectedQuestionnaire);
	const surveyForm = useSelector((state) => state.unitContent.surveyForm);

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [permissions, setPermissions] = useState({});
	const [savePermission, setSavePermission] = useState(false);
	const [programStatus, setProgramStatus] = useState('')
	const [tab, setTab] = useState(0);
	const [links, setLinks] = useState([]);
	const [pdfs, setPdfs] = useState([]);
	const [images, setImages] = useState([]);

	const unitId = location?.state?.unit?.id;
	const programDetails = location?.state?.programDetails;

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({ defaultValues: props.defaultValues ?? {} });

	const {
		control: controlLink,
		handleSubmit: handleSubmitLink,
		setValue: setValueLink,
		reset: resetLink,
		formState: { errors: errorsLink, isDirty: isDirtyLink },
	} = useForm({ defaultValues: { mediaUrl: '' } });

	useEffect(() => {
		let access = JSON.parse(window.localStorage.getItem('permissions'));
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
		if (props?.type == 'update') {
			if (access?.Programs?.program_unit?.lac?.update) setSavePermission(true);
		} else {
			if (access?.Programs?.program_unit?.lac?.create) setSavePermission(true);
		}
		let currentProgramStatus = JSON.parse(window.localStorage.getItem('currentProgram'));
		if(currentProgramStatus) {
			setProgramStatus(currentProgramStatus?.status)
		}
	}, []);

	useEffect(() => {
		if (props?.defaultValues) {
			const filterbyLinkType = props.defaultValues?.mediaContents?.filter((media) => media?.contentType == 'link');
			const filterbyImageType = props.defaultValues?.mediaContents?.filter((media) => media?.contentType == 'image');
			const filterbyPdfType = props.defaultValues?.mediaContents?.filter((media) => media?.contentType == 'pdf');
			setLinks(filterbyLinkType);
			setImages(filterbyImageType);
			setPdfs(filterbyPdfType);
		}
	}, [props?.defaultValues]);

	const handleFormSubmit = async (formValues) => {
		if (props?.type == 'update') {
			let dispatchFormValues = { ...formValues, mediaContents: [...links, ...images, ...pdfs], programUnitId: unitId };
			const res = await dispatch(updateLearningActivity(props.defaultValues.id, dispatchFormValues));
			if (res?.statusCode == 200) navigate(`/programs-unit/unit-content/${unitId}`, { state: { unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } });
		} else {
			let dispatchFormValues = { ...formValues, mediaContents: [...links, ...images, ...pdfs], programUnitId: unitId };
			const res = await dispatch(createLearningActivity(dispatchFormValues));
			if (res?.statusCode == 200) navigate(`/programs-unit/unit-content/${unitId}`, { state: { unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } });
		}
	};

	const handleMediaDelete = (id) => {
		setOpenDeleteDialog(true);
		setSelectedId(id);
	};

	const handleDeleteConfirm = () => {
		if (tab == 0) setLinks((prev) => prev.filter((item, index) => index !== selectedId));
		if (tab == 1) setImages((prev) => prev.filter((item, index) => index !== selectedId));
		if (tab == 2) setPdfs((prev) => prev.filter((item, index) => index !== selectedId));
		setOpenDeleteDialog(false);
		setSelectedId(null);
	};

	const handleClose = () => {
		setOpenDeleteDialog(false);
		setSelectedId(null);
	};

	const handleOrder = (questionnaire) => {
		dispatch(resetSelectedQuestionnaire());
		dispatch(setSelectedQuestionnaire(questionnaire));
	};

	const handleTabChange = (value) => {
		setTab(value);
	};

	const handleLink = (value) => {
		const newLink = {
			mediaUrl: value.mediaUrl,
			mediaType: 'text/html',
			contentType: 'link',
		};
		setLinks((prev) => [...prev, newLink]);
		resetLink({
			mediaUrl: '',
		});
	};

	const handleOnDrop = (files) => {
		const filesGreatorThanFiveMB = [];
		files.forEach((file) => {
			if (file.size > 5000000) {
				filesGreatorThanFiveMB.push(file);
			}
		});

		if (filesGreatorThanFiveMB?.length > 0) {
			toast.error('File size should not be greator than 5MB');
			return;
		}

		handleDocUpload(files);
	};

	const handleDocUpload = (media) => {
		let formData = new FormData();
		if (media.length > 0) {
			media.map((file, index) => {
				formData.append(`files[${index}]`, file);
				formData.append(`contentType`, `${tab == 1 ? 'image' : tab == 2 ? 'pdf' : 'link'}`);
			});
			dispatch(learningActivityUploadMedia(formData)).then((resp) => {
				if (tab == 1) setImages((prev) => [...prev, ...resp?.data]);
				if (tab == 2) setPdfs((prev) => [...prev, ...resp?.data]);
			});
		}
	};

	return (
		<>
			<div>
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
						<h1 className="tw-font-bold tw-text-[24px]">
							<Button
								variant="text"
								onClick={() => navigate(`/programs-unit/unit-content/${unitId}`, { state: { unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } })}
								className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[12px]"
								disableRipple
								startIcon={<KeyboardBackspaceIcon />}
							>
								{`program / ${location?.state?.unit?.serialNumber}`}
							</Button>
							<h1 className="tw-px-2 tw-mt-[-4px]">{props?.type == 'update' ? 'Edit Learning Activity' : 'Create New Learning Activity'}</h1>
						</h1>
						{savePermission && (
							<div className="tw-flex tw-gap-x-5">
								<div className="tw-flex tw-gap-x-5">
									<Button
										onClick={() => navigate(`/programs-unit/unit-content/${unitId}`, { state: { unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } })}
										type="button"
										variant="contained"
										size="small"
										className="tw-h-[35px] !tw-bg-white !tw-text-primary"
									>
										Cancel
									</Button>
									<LoadingButton disabled={programStatus == 'closed' ? true : false} loading={loading} type="submit" variant="contained" size="small" className={`tw-h-[35px] ${programStatus == 'closed' ? '!tw-bg-[#9999]' : ''}`}>
										Save
									</LoadingButton>
								</div>
							</div>
						)}
					</div>
					<div className="tw-pt-6">
						<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-pb-6 tw-w-full">
							<Controller
								name="title"
								control={control}
								rules={{ required: 'This field is mandatory', pattern: { value: /.{2,}/, message: 'Minimum 2 character are required' } }}
								render={({ field }) => (
									<div className="tw-min-w-[500px] tw-flex-1">
										<TextField
											variant="outlined"
											fullWidth
											size="small"
											label="Title"
											{...field}
											onChange={(e) => {
												setValue(`title`, e.target.value, { shouldValidate: true });
												dispatch(setSurveyForm({ title: e.target.value }));
											}}
											disabled={programStatus == 'closed' ? true : savePermission ? false : true}
										/>
										{errors.title && (
											<ErrorBox>
												<ErrorOutlineIcon fontSize="small" />
												<span>{errors.title.message}</span>
											</ErrorBox>
										)}
									</div>
								)}
							/>
						</div>
					</div>
				</form>

				<div className="">
					<form onSubmit={handleSubmitLink(handleLink)}>
						<Paper>
							<Container maxWidth={false}>
								<div className="tw-py-6">
									<div className="tw-flex tw-justify-between tw-items-center">
										<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[18px]">Add Content</h1>
										<p className="tw-text-sm">
											<sup className="tw-text-[#999] tw-text-[12px]">*</sup>
											{`Max 5 ${tab == 0 ? 'links' : tab == 1 ? 'images' : 'pdf'} are allowed to add`}
										</p>
									</div>
								</div>
								<div className="tw-pb-2">
									<Tabs tabs={['Links', 'Images', 'Pdf']} tabChange={handleTabChange} />
								</div>
								{tab == 0 && (
									<div className="tw-pb-6">
										<div>
											{links.map((media, index) => {
												return (
													<div
														onClick={() => window.open(media.mediaUrl, '_blank')}
														key={index}
														className="tw-flex tw-justify-between tw-items-center tw-bg-backgroundBody tw-rounded-lg tw-cursor-pointer  tw-px-4 tw-py-6 tw-mb-6"
													>
														<div className="tw-flex tw-gap-2 tw-items-center">
															<AttachFileIcon />
															<p className="tw-text-md tw-font-bold tw-text-[#333]">{media.mediaUrl}</p>
														</div>
														{permissions?.Programs?.program_unit?.lac?.update && (
															<IconButton
																sx={{ padding: 0 }}
																color="error"
																onClick={(e) => {
																	e.stopPropagation();
																	handleMediaDelete(index);
																}}
																disabled={programStatus == 'closed' ? true : false}
															>
																<DeleteIcon />
															</IconButton>
														)}
													</div>
												);
											})}
										</div>
										{savePermission && (
											<div className="tw-bg-backgroundBody tw-rounded-lg  tw-px-4 tw-py-6">
												<div className="tw-pb-4">Add Media Links</div>
												<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-pb-6 tw-w-full">
													<Controller
														name="mediaUrl"
														control={controlLink}
														rules={{ pattern: { value: /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{0,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/, message: 'Please enter valid URL' } }}
														render={({ field }) => (
															<div className="tw-min-w-[500px] tw-flex-1">
																<Tooltip arrow placement="top" title={links?.length >= 5 ? 'Max Limit Reached' : ''}>
																	<span>
																		<TextField variant="outlined" fullWidth size="small" label="Media Link" {...field} disabled={programStatus == 'closed' ? true : !savePermission ? true : links.length >= 5 ? true : false} />
																	</span>
																</Tooltip>
																{errorsLink.mediaUrl && (
																	<ErrorBox>
																		<ErrorOutlineIcon fontSize="small" />
																		<span>{errorsLink.mediaUrl.message}</span>
																	</ErrorBox>
																)}
															</div>
														)}
													/>
													<div>
														<Tooltip arrow placement="top-start" title={links?.length >= 5 ? 'Max Limit Reached' : ''}>
															<span>
																<Button disabled={programStatus == 'closed' || !isDirtyLink || links.length >= 5} type="submit" variant="outlined" className="!tw-px-12" color="primary">
																	Add Link
																</Button>
															</span>
														</Tooltip>
													</div>
												</div>
											</div>
										)}
									</div>
								)}
								{tab == 1 && (
									<div className="tw-pb-6">
										<div>
											{images.map((media, index) => {
												return (
													<div
														onClick={() => window.open(media.temporaryMediaUrl)}
														key={index}
														className="tw-flex tw-justify-between tw-items-center tw-bg-backgroundBody tw-rounded-lg tw-cursor-pointer  tw-px-4 tw-py-6 tw-mb-6"
													>
														<div className="tw-flex tw-gap-2 tw-items-center">
															<AttachFileIcon />
															<p className="tw-text-md tw-font-bold tw-text-[#333]">{media.mediaUrl.slice(24)}</p>
														</div>
														{permissions?.Programs?.program_unit?.lac?.update && (
															<IconButton
																sx={{ padding: 0 }}
																color="error"
																onClick={(e) => {
																	e.stopPropagation();
																	handleMediaDelete(index);
																}}
																disabled={programStatus == 'closed' ? true : false}
															>
																<DeleteIcon />
															</IconButton>
														)}
													</div>
												);
											})}
										</div>
										{savePermission && (
											<div className={`${programStatus == 'closed' || images?.length >= 5 ? '!tw-cursor-not-allowed' : ''}`}>
												<Tooltip arrow placement="top" title={images?.length >= 5 ? 'Max Limit Reached' : ''}>
													<span>
														<div className={`${programStatus == 'closed' || images?.length >= 5 ? '!tw-pointer-events-none !tw-cursor-not-allowed' : ''}`}>
															<DropzoneImagesForActivity multiple={false} onDrop={handleOnDrop} />
														</div>
													</span>
												</Tooltip>
											</div>
										)}
									</div>
								)}
								{tab == 2 && (
									<div className="tw-pb-6">
										<div>
											{pdfs.map((media, index) => {
												return (
													<div
														onClick={() => window.open(media.temporaryMediaUrl)}
														key={index}
														className="tw-flex tw-justify-between tw-items-center tw-bg-backgroundBody tw-rounded-lg tw-cursor-pointer  tw-px-4 tw-py-6 tw-mb-6"
													>
														<div className="tw-flex tw-gap-2 tw-items-center">
															<AttachFileIcon />
															<p className="tw-text-md tw-font-bold tw-text-[#333]">{media.mediaUrl.slice(24)}</p>
														</div>
														{permissions?.Programs?.program_unit?.lac?.update && (
															<IconButton
																sx={{ padding: 0 }}
																color="error"
																onClick={(e) => {
																	e.stopPropagation();
																	handleMediaDelete(index);
																}}
																disabled={programStatus == 'closed' ? true : false}
															>
																<DeleteIcon />
															</IconButton>
														)}
													</div>
												);
											})}
										</div>
										{savePermission && (
											<div className={`${programStatus == 'closed' || pdfs?.length >= 5 ? '!tw-cursor-not-allowed' : ''}`}>
												<Tooltip arrow placement="top" title={pdfs?.length >= 5 ? 'Max Limit Reached' : ''}>
													<span>
														<div className={`${programStatus == 'closed' || pdfs?.length >= 5 ? '!tw-pointer-events-none !tw-cursor-not-allowed' : ''}`}>
															<DropzoneDocumentForActivity multiple={false} onDrop={handleOnDrop} />
														</div>
													</span>
												</Tooltip>
											</div>
										)}
									</div>
								)}

								{/* <div className="tw-py-3">
									<Questionnaire type="survey" disabled={savePermission ? false : true} questionnaireData={questionnaireData} handleDelete={handleQuestionDelete} handleOrder={handleOrder} />
								</div> */}
							</Container>
						</Paper>
					</form>
				</div>
			</div>
			{openDeleteDialog && (
				<DeleteDialog open={openDeleteDialog} loading={false} close={handleClose} delete={handleDeleteConfirm} title="Delete Media">
					<p>Are you sure you want to remove this media?</p>
					<p>This action is irreversible</p>
				</DeleteDialog>
			)}
		</>
	);
}
