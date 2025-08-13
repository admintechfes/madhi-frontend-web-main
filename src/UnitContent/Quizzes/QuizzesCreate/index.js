import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Button, CircularProgress, Container, IconButton, Paper, TextField, Tooltip } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LoadingButton } from '@mui/lab';

import { ErrorBox } from '../../../components/Errorbox';
// import { createWorkshop, updateWorkshop } from '../../duck/network';
import { Dropdown } from '../../../components/Select';
import Questionnaire from '../../../components/UnitContent/Questionnaire';
import { deleteSelectedQuestionnnaire, resetSelectedQuestionnaire, setQuizForm, setSelectedQuestionnaire, skipSelectedQuestion, handleWeightage } from '../../duck/unitContentSlice';
import { createQuiz, updateQuiz } from '../../duck/network';
import { DeleteDialog } from '../../../components/Dialog';

export default function QuizzesCreate(props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const qParams = useParams();
	const location = useLocation();

	const program = useSelector((state) => state.program.programDetails);
	const loading = useSelector((state) => state.unitContent.quizCreateLoading);
	const questionnaireData = useSelector((state) => state.unitContent.selectedQuestionnaire);
	const quizForm = useSelector((state) => state.unitContent.quizForm);

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
	const [permissions, setPermissions] = useState({});
	const [savePermission, setSavePermission] = useState(false);
	const [programStatus, setProgramStatus] = useState('')

	const unitId = location?.state?.unit?.id;
	const programDetails = location?.state?.programDetails;

	const methods = useForm({ defaultValues: quizForm });

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
		let access = JSON.parse(window.localStorage.getItem('permissions'));
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
		if (props?.type == 'update') {
			if (access?.Programs?.program_unit?.qz?.update) setSavePermission(true);
		} else {
			if (access?.Programs?.program_unit?.qz?.create) setSavePermission(true);
		}
		let currentProgramStatus = JSON.parse(window.localStorage.getItem('currentProgram'));
		if(currentProgramStatus) {
			setProgramStatus(currentProgramStatus?.status)
		}
	}, []);

	useEffect(() => {
		setValue('title', quizForm?.title ?? '');
		setValue('contentFor', quizForm?.contentFor ?? null);
		replace(quizForm.sections || []);
	}, [quizForm]);

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
		dispatch(setQuizForm({...val, hiddenProperty:true}));
	};

	const handleFormSubmit = async (formValues) => {
		if (props?.type == 'update') {
			let dispatchFormValues = payloadConstruct(formValues, questionnaireData, unitId);
			const res = await dispatch(updateQuiz(props.defaultValues.id, dispatchFormValues));
			if (res?.statusCode == 200) navigate(`/programs-unit/unit-content/${unitId}`, { state: { unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } });
		} else {
			let dispatchFormValues = payloadConstruct(formValues, questionnaireData, unitId);
			const res = await dispatch(createQuiz(dispatchFormValues));
			if (res?.statusCode == 200) navigate(`/programs-unit/unit-content/${unitId}`, { state: { unit: location?.state?.unit, programId: location.state.programId, programDetails: programDetails } });
		}
	};

	const handleQuestionDelete = (id,sectionIndex) => {
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
	}

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
							<h1 className="tw-px-2 tw-mt-[-4px]">{props?.type == 'update' ? 'Edit Quiz Details' : 'Create New Quiz'}</h1>
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
						<Paper>
							<Container maxWidth={false}>
								<div className="tw-py-6">
									<div className="tw-flex tw-justify-between tw-items-center">
										<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Quiz Details</h1>
										{/* <p className="tw-text-sm">
											<sup className="tw-text-error tw-text-[12px]">*</sup>All fields are mandatory
										</p> */}
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
														label="Quiz Title"
														{...field}
														onChange={(e) => {
															setValue(`title`, e.target.value, { shouldValidate: true });
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
										<Controller
											name="contentFor"
											control={control}
											rules={{ required: 'This field is mandatory' }}
											render={({ field }) => (
												<div className="tw-min-w-[500px] tw-flex-1">
													<Dropdown
														{...field}
														//value={quizForm?.contentFor}
														onChange={(e) => {
															setValue(`contentFor`, e, { shouldValidate: true });
															// dispatch(setQuizForm({ contentFor: e }));
														}}
														disabled={programStatus == 'closed' ? true : savePermission ? false : true}
														options={[
															{ name: 'Parents', value: '1' },
															{ name: 'Children', value: '5' },
														]}
														valuekey="value"
														labelkey="name"
														label="Creating Quiz For"
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

																	dispatch(setQuizForm(val));
																	let questionnaire = [...questionnaireData];
																	questionnaire.splice(index, 1);

																	dispatch(setSelectedQuestionnaire({finalData:questionnaire, deleteSection:true}));
																}}
															>
																Delete Section
															</Button>
														)}
													</div>
												</div>
												<div className="tw-pt-5 tw-mb-[-20px]">
													<Questionnaire
														type="quiz"
														isPermit={programStatus !== 'closed'}
														disabled={!savePermission}
														questionnaireData={questionnaireData[index] ?? []}
														AllSectionQuestions={questionnaireData}
														handleDelete={handleQuestionDelete}
														handleOrder={handleOrder}
														sectionIndex={index}
														handlePersistData={handlePersistData}
														handleSkipQuestion={handleSkipQuestion}
														handleWeightage={handleWeightage}
													/>
												</div>
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
				<DeleteDialog open={openDeleteDialog} loading={false} close={handleClose} delete={handleDeleteConfirm} title="Delete Question">
					<p>Are you sure you want to delete this question?</p>
					<p>This action is irreversible</p>
				</DeleteDialog>
			)}
		</>
	);
}
