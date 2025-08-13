import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller, useFieldArray, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Button, CircularProgress, Container, IconButton, Paper, TextField, Tooltip } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LoadingButton } from '@mui/lab';

import { ErrorBox } from '../../../components/Errorbox';
import { Dropdown } from '../../../components/Select';
import Questionnaire from '../../../components/UnitContent/Questionnaire';
import { deleteSelectedQuestionnnaire, resetSelectedQuestionnaire, setSurveyForm, setSelectedQuestionnaire, skipSelectedQuestion, displaySelectedQuestion, handleRelation, handleConditonOneContentId, handleConditonTwoContentId, handleConditonOneOptionIndexes, handleConditonTwoOptionIndexes } from '../../duck/unitContentSlice';
import { createSurvey, createVisit, getVisitInviteType, updateSurvey, updateVisit } from '../../duck/network';
import { DeleteDialog } from '../../../components/Dialog';

export default function VisitsCreate(props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const qParams = useParams();
	const location = useLocation();

	const program = useSelector((state) => state.program.programDetails);
	const loading = useSelector((state) => state.unitContent.surveyCreateLoading);
	const questionnaireData = useSelector((state) => state.unitContent.selectedQuestionnaire);
	const surveyForm = useSelector((state) => state.unitContent.surveyForm);
	const visitInviteType = useSelector((state) => state.unitContent.visitInviteType)

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
	const [permissions, setPermissions] = useState({});
	const [savePermission, setSavePermission] = useState(false);
	const [programStatus, setProgramStatus] = useState('');

	const unitId = location?.state?.unit?.id;
	const programDetails = location?.state?.programDetails;

	const methods = useForm({
		defaultValues: surveyForm,
	});

	const {
		control,
		handleSubmit,
		setValue,
		getValues,
		trigger,
		formState: { errors },
	} = methods;

	const { fields, append, remove, replace } = useFieldArray({
		control,
		name: 'sections',
	});

	useEffect(() => {
		dispatch(getVisitInviteType())
		let access = JSON.parse(window.localStorage.getItem('permissions'));
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
		if (props?.type == 'update') {
			if (access?.Programs?.program_unit['1o1msf']?.update) setSavePermission(true);
		} else {
			if (access?.Programs?.program_unit['1o1msf']?.create) setSavePermission(true);
		}
		let currentProgramStatus = JSON.parse(window.localStorage.getItem('currentProgram'));
		if (currentProgramStatus) {
			setProgramStatus(currentProgramStatus?.status);
		}
	}, []);

	useEffect(() => {
		setValue('title', surveyForm?.title ?? '');
		setValue('type', surveyForm?.type ?? null);
		replace(surveyForm.sections || []);
	}, [surveyForm]);

	const payloadConstruct = (formValues, questionnaire, programUnitId) => {
		let payload = { programUnitId, ...formValues };
		let payloadArray = payload?.sections?.map((section, index) => {
			return { ...section, questionnaire: questionnaire[index] };
		});
		delete payload.sections;
		payload.sections = payloadArray;
		return payload;
	};

	const handlePersistData = () => {
		const currentValues = getValues();
		if (!currentValues) {
			return;
		}

		const val = { ...currentValues };
		if (!val.sections || !Array.isArray(val.sections)) {
			return;
		}
		dispatch(setSurveyForm({ ...val, hiddenProperty: true }));
	};

	const handleFormSubmit = async (formValues) => {
		const valid = await trigger();
		if (valid) {
			if (props?.type === 'update') {
			let dispatchFormValues = payloadConstruct(formValues, questionnaireData, unitId);
			const res = await dispatch(updateVisit(props.defaultValues.id, dispatchFormValues));
			if (res?.statusCode === 200)
				navigate(`/programs-unit/unit-content/${unitId}`, {
					state: { unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails },
				});
		} else {
			let dispatchFormValues = payloadConstruct(formValues, questionnaireData, unitId);
			const res = await dispatch(createVisit(dispatchFormValues));
			if (res?.statusCode === 200)
				navigate(`/programs-unit/unit-content/${unitId}`, {
					state: { unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails },
				});
		}
		} else {
			console.log('Validation failed');
		}
		
	};

	const handleQuestionDelete = (id, sectionIndex) => {
		setOpenDeleteDialog(true);
		setSelectedId(id);
		setSelectedSectionIndex(sectionIndex);
	};

	const handleDeleteConfirm = () => {
		dispatch(deleteSelectedQuestionnnaire({ selectedId, selectedSectionIndex }));
		setOpenDeleteDialog(false);
		setSelectedId(null);
		setSelectedSectionIndex(null);
	};

	const handleClose = () => {
		setOpenDeleteDialog(false);
		setSelectedId(null);
	};

	const handleOrder = (questionnaire, index) => {
		dispatch(setSelectedQuestionnaire({ finalData: questionnaire, sectionIndex: index, orderUpdate: true }));
	};

	const handleSkipQuestion = (selectedId, selectedSectionIndex) => {
		dispatch(skipSelectedQuestion({ selectedId, selectedSectionIndex }));
	};

	const handleDisplayQuestion = (selectedId, selectedSectionIndex, isDelete = false) => {
		dispatch(displaySelectedQuestion({ selectedId, selectedSectionIndex, isDelete }));
	};

	return (
		<>
			<div>
				<FormProvider {...methods}>
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
								<h1 className="tw-px-2 tw-mt-[-4px]">{props?.type == 'update' ? 'Edit visit Details' : 'Create New visit'}</h1>
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
										<LoadingButton disabled={programStatus == 'closed'} loading={loading} type="submit" variant="contained" size="small" className={`tw-h-[35px] ${programStatus == 'closed' ? '!tw-bg-[#9999]' : ''}`}>
											Save
										</LoadingButton>
									</div>
								</div>
							)}
						</div>
						<div className="tw-pt-6">
							<Paper>
								<Container maxWidth={false}>
									<div className="tw-py-6">
										<div className="tw-flex tw-flex-col tw-gap-4 tw-italic tw-text-gray-400 tw-font-karla">
											<p className='tw-text-sm'>Note: Upon selecting "Add Display Logic," a list of questions with a multiple-choice answer type will be displayed.</p>
											<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Visit Form Details</h1>
										</div>

										<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-py-6 tw-w-full">
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
															label="Visit Title"
															{...field}
															disabled={programStatus === 'closed' ? true : savePermission ? false : true}
															onChange={(e) => setValue('title', e.target.value)}
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
											<Controller
												name="type"
												control={control}
												rules={{ required: 'This field is mandatory' }}
												render={({ field }) => (
													<div className="tw-min-w-[500px] tw-flex-1">
														<Dropdown
															{...field}
															//value={quizForm?.contentFor}
															onChange={(e) => {
																setValue(`type`, e, { shouldValidate: true });
																// dispatch(setQuizForm({ contentFor: e }));
															}}
															disabled={programStatus == 'closed' ? true : savePermission ? false : true}
															options={visitInviteType}
															valuekey="type"
															labelkey="label"
															label="Visit invitee type"
														/>
														{errors.contentFor && (
															<ErrorBox>
																<ErrorOutlineIcon fontSize="small" />
																<span>{errors.contentFor.message}</span>
															</ErrorBox>
														)}
													</div>
												)}
											/>
										</div>

										<div className="tw-flex tw-flex-col tw-gap-6">
											{fields.map((item, index) => (
												<div key={item.id} style={{ padding: '18px 12px', border: '1px solid #EEE', borderRadius: '4px' }}>
													<div className="tw-flex tw-w-full tw-justify-between">
														<div className="tw-flex tw-gap-x-12 tw-gap-y-5 tw-flex-wrap tw-w-full">
															<Controller
																name={`sections.${index}.title`}
																control={control}
																render={({ field }) => (
																	<div className="tw-min-w-[300px] tw-flex-1">
																		<TextField
																			variant="outlined"
																			fullWidth
																			size="small"
																			label="Section Title (optional)"
																			{...field}
																			disabled={programStatus == 'closed' ? true : savePermission ? false : true}
																			onChange={(e) => setValue(`sections.${index}.title`, e.target.value)}
																		/>
																	</div>
																)}
															/>
															<Controller
																name={`sections.${index}.description`}
																control={control}
																render={({ field }) => (
																	<div className="tw-min-w-[300px] tw-flex-1">
																		<TextField
																			variant="outlined"
																			fullWidth
																			size="small"
																			label="Section Description (optional)"
																			{...field}
																			disabled={programStatus == 'closed' ? true : savePermission ? false : true}
																			onChange={(e) => setValue(`sections.${index}.description`, e.target.value)}
																		/>
																	</div>
																)}
															/>
														</div>

														<div className="tw-w-[250px] tw-text-end">
															{index > 0 && (
																<Button
																	variant="outlined"
																	color="error"
																	onClick={() => {
																		remove(index);

																		const currentValues = getValues();
																		if (!currentValues) {
																			return;
																		}

																		const val = { ...currentValues };
																		if (!val.sections || !Array.isArray(val.sections)) {
																			return;
																		}
																		if (index < 0 || index >= val.sections.length) {
																			return;
																		}

																		dispatch(setSurveyForm(val));
																		let questionnaire = [...questionnaireData];
																		questionnaire.splice(index, 1);

																		dispatch(setSelectedQuestionnaire({ finalData: questionnaire, deleteSection: true }));
																	}}
																>
																	Delete Section
																</Button>
															)}
														</div>
													</div>
													<Controller
														name={`sections.${index}.questionnaire`}
														control={control}
														render={({ field }) => (
															<div className="tw-pt-5 tw-mb-[-20px]">
																<Questionnaire
																	type="survey"
																	isPermit={programStatus !== 'closed'}
																	disabled={!savePermission}
																	questionnaireData={questionnaireData[index] ?? []}
																	AllSectionQuestions={questionnaireData}
																	handleDelete={handleQuestionDelete}
																	handleOrder={handleOrder}
																	sectionIndex={index}
																	handlePersistData={handlePersistData}
																	handleSkipQuestion={handleSkipQuestion}
																	handleDisplayQuestion={handleDisplayQuestion}
																	handleConditonOneContentId={handleConditonOneContentId}
																	handleConditonTwoContentId={handleConditonTwoContentId}
																	handleConditonOneOptionIndexes={handleConditonOneOptionIndexes}
																	handleConditonTwoOptionIndexes={handleConditonTwoOptionIndexes}
																	handleRelation={handleRelation}
																/>
															</div>
														)}
													/>
												</div>
											))}
										</div>

										<div className="tw-text-center tw-pt-5">
											<Button
												variant="outlined"
												onClick={() => {
													append({ title: '', description: '' });
												}}
											>
												Add Section
											</Button>
										</div>
									</div>
								</Container>
							</Paper>
						</div>
					</form>
				</FormProvider>
			</div>
			{openDeleteDialog && (
				<DeleteDialog open={openDeleteDialog} close={handleClose} delete={handleDeleteConfirm} title="Delete Confirmation">
					<p>Are you sure you want to delete this question?</p>
					<p>This action is irreversible</p>
				</DeleteDialog>
			)}
		</>
	);
}
