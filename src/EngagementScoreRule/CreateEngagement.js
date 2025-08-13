import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, CircularProgress, Container, IconButton, Paper, TextField, Tooltip } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import { ErrorBox } from '../components/Errorbox';
import { Dropdown } from '../components/Select';
import { getUnitContentList } from '../UnitContent/duck/network';
import { getWorkshopContentList } from '../UnitContent/Workshops/duck/network';
import { CreateEngagementScoreUpdate, GetEngagementScoreDetail } from './duck/network';

export default function EngagementScoreRuleCreate(props) {
	const scoreloader = useSelector((state) => state.score.loading)
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const EngagementDetails = useSelector((state) => state.score.EngagementDetails)
	const loading = useSelector((state) => state.unit.unitCreateLoading);
	const unitContentList = useSelector((state) => state.unitContent.unitContentList);
	const workshopContentList = useSelector((state) => state.workshopContent.workshopContentList);
	const [permissions, setPermissions] = useState({});
	const [savePermission, setSavePermission] = useState({});
	const programId = location?.state?.programId
	const programDetails = location?.state?.programDetails;
	const programUnitId = location?.state?.unit?.id;
	const { control, handleSubmit, setValue, getValues, watch, formState: { errors } } = useForm({ mode: 'onChange' });
	const parentQuizWeightage = watch('quizzes.quiz_weightage');
	const studentQuizWeightage = watch('student_quizzes.student_quiz_weightage');
	const workshopQuizWeightage = watch('workshop_quizzes.workshop_quiz_weightage');
	const workshopId = watch('workshop_quizzes.workshop_id');
	const workshopQuizId = watch('workshop_quizzes.quiz_id');
	const parentQuizId = watch('quizzes.quiz_id');
	const workshopAttendanceWeightage = watch('workshop_attendance.workshop_attendance_weightage');
	const [checkTotalWeightage, setCheckTotalWeightage] = useState(0)
	const [parentQuizObj, setParentQuizObj] = useState({})
	const [workshopNumberObj, setWorkshopNumberObj] = useState({})
	const [workshopQuizObj, setWorkshopQuizObj] = useState({})

	// field array for all range
	const { fields, append, remove } = useFieldArray({ control, name: 'quizzes.ranges' });
	const { fields: fields2, append: append2, remove: remove2 } = useFieldArray({ control, name: 'student_quizzes.ranges', });
	const { fields: fields3, append: append3, remove: remove3 } = useFieldArray({ control, name: 'workshop_quizzes.ranges', });
	const { fields: fields4, append: append4, remove: remove4 } = useFieldArray({ control, name: 'workshop_attendance.ranges' });

	useEffect(() => {
		if (!programId && !programUnitId) {
			navigate(`/programs`)
		}
		else {
			dispatch(GetEngagementScoreDetail({ program_unit_id: programUnitId, program_id: programId }))
			let access = JSON.parse(window.localStorage.getItem('permissions'));
			setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
			if (props?.type == 'update') {
				if (access?.Programs?.program_unit.update) setSavePermission(true);
			} else {
				if (access?.Programs?.program_unit.create) setSavePermission(true);
			}
		}
	}, []);

	useEffect(() => {
		if (EngagementDetails) {
			setValue("weightage", EngagementDetails?.weightage)
			setValue("quizzes.quiz_id", EngagementDetails?.quizzes?.quiz_id)
			setValue("quizzes.quiz_weightage", EngagementDetails?.quizzes?.quiz_weightage)
			setValue("student_quizzes.student_quiz_weightage", EngagementDetails?.student_quizzes?.student_quiz_weightage)
			setValue("workshop_quizzes.workshop_id", EngagementDetails?.workshop_quizzes?.workshop_id)
			setValue("workshop_quizzes.quiz_id", EngagementDetails?.workshop_quizzes?.quiz_id)
			setValue("workshop_quizzes.workshop_quiz_weightage", EngagementDetails?.workshop_quizzes?.workshop_quiz_weightage)
			setValue("workshop_attendance.workshop_attendance_weightage", EngagementDetails?.workshop_attendance?.workshop_attendance_weightage)

			EngagementDetails?.quizzes?.ranges?.forEach((quiz, index) => {
				// Only append if the field doesn't exist yet
				if (!fields[index]) {
					append({ range: quiz.range, weightage: quiz.weightage });
				} else {
					// If the field exists, just update the value
					setValue(`quizzes.ranges.${index}.range`, quiz.range);
					setValue(`quizzes.ranges.${index}.weightage`, quiz.weightage);
				}
			});

			EngagementDetails?.student_quizzes?.ranges?.forEach((quiz, index) => {
				// Only append if the field doesn't exist yet
				if (!fields2[index]) {
					append2({ range: quiz.range, weightage: quiz.weightage });
				} else {
					// If the field exists, just update the value
					setValue(`student_quizzes.ranges.${index}.range`, quiz.range);
					setValue(`student_quizzes.ranges.${index}.weightage`, quiz.weightage);
				}
			});

			if (EngagementDetails?.workshop_quizzes?.ranges?.length) {
				// If the engagement details contain workshop quiz ranges, append them
				EngagementDetails.workshop_quizzes.ranges.forEach((quiz, index) => {
					if (!fields3[index]) {
						append3({ range: quiz.range, weightage: quiz.weightage });
					} else {
						setValue(`workshop_quizzes.ranges.${index}.range`, quiz.range);
						setValue(`workshop_quizzes.ranges.${index}.weightage`, quiz.weightage);
					}
				});
			}

			EngagementDetails?.workshop_attendance?.ranges?.forEach((quiz, index) => {
				// Only append if the field doesn't exist yet
				if (!fields4[index]) {
					append4({ range: quiz.range, weightage: quiz.weightage });
				} else {
					// If the field exists, just update the value
					setValue(`workshop_attendance.ranges.${index}.range`, quiz.range);
					setValue(`workshop_attendance.ranges.${index}.weightage`, quiz.weightage);
				}
			});
		}
	}, [EngagementDetails])

	useEffect(() => {
		if (!programId) {
			navigate(`/programs`)
		}
		else {
			dispatch(getUnitContentList({ programUnitId: programUnitId, contentFor: 1 }));
		}
	}, []);

	useEffect(() => {
		if (workshopId) {
			dispatch(getWorkshopContentList({ workshopId, contentFor: 1 }));
		}
	}, [workshopId]);

	useEffect(() => {
		let parentWeightage = parentQuizWeightage ? parentQuizWeightage : 0;
		let studentWeightage = studentQuizWeightage ? studentQuizWeightage : 0;
		let workshopWeightage = workshopQuizWeightage ? workshopQuizWeightage : 0;
		let workshopattendanceWeightage = workshopAttendanceWeightage ? workshopAttendanceWeightage : 0;
		let totalWeightage = Number(parentWeightage) + Number(studentWeightage) + Number(workshopWeightage) + Number(workshopattendanceWeightage);
		setCheckTotalWeightage(totalWeightage)
	}, [parentQuizWeightage, studentQuizWeightage, workshopQuizWeightage, workshopAttendanceWeightage, checkTotalWeightage]);

	const handleFormSubmit = (formValues) => {
		let UpdatedData = {
			...formValues,
			quizzes: {
				...formValues.quizzes,
				quiz_title: parentQuizObj.title || EngagementDetails?.quizzes?.quiz_title
			},
			workshop_quizzes: {
				...formValues.workshop_quizzes,
				workshop_number: workshopNumberObj.title || EngagementDetails?.workshop_quizzes?.workshop_number,
				workshop_quiz_title: workshopQuizObj.title || EngagementDetails?.workshop_quizzes?.workshop_quiz_title
			}
		}
		let dispatchFormValues = { ...UpdatedData, program_unit_id: programUnitId, program_id: programId };
		dispatch(CreateEngagementScoreUpdate(dispatchFormValues)).then((res) => {
			if (res?.statusCode == 200) navigate(-1);
		})
	};

	return (
		<>
			{scoreloader ?
				<div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>
				:
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
						<h1 className="tw-font-bold tw-text-[24px]">
							<Button variant="text" onClick={() => navigate(-1)} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[12px]" disableRipple startIcon={<KeyboardBackspaceIcon />}>
								Program/Engagement Score Rule
							</Button>
							<h1 className="tw-px-2 tw-mt-[-4px]">Manage Engagement Score Rule</h1>
						</h1>
						<div className="tw-flex tw-gap-x-5">
							<div className="tw-flex tw-gap-x-5">
								{savePermission && (
									<Button onClick={() => navigate(-1)} type="button" variant="contained" size="small" className="tw-h-[35px] !tw-bg-white !tw-text-primary">
										Cancel
									</Button>
								)}
								{savePermission && (
									<LoadingButton
										disabled={programDetails?.status == 'closed' ? true : false}
										loading={loading}
										type="submit"
										variant="contained"
										size="small"
										className={` ${programDetails?.status == 'closed' ? '!tw-bg-[#0000001f]' : ''} tw-h-[35px]`}
									>
										Publish
									</LoadingButton>
								)}
							</div>
						</div>
					</div>
					<div className="tw-pt-6">
						<div className="tw-flex tw-flex-col tw-gap-2 tw-items-start tw-w-[700px]">
							<div className="tw-pt-2">Total Engagement Score</div>
							<div>
								<Controller
									name="weightage"
									control={control}
									rules={{
										validate: (value) => {
											if (value <= 0) {
												return 'Weightage must greater than 0';
											}
											if (!value) {
												return 'This field is mandatory';
											}
											return true;
										},
									}}
									render={({ field }) => (
										<>
											<div className="tw-w-[300px]">
												<TextField
													type="number"
													variant="outlined"
													fullWidth
													size="small"
													label='Add Total Engagement Score'
													{...field}
													value={field.value || ""}
													onWheel={(e) => e.target.blur()} // Prevents scroll behavior
												/>
											</div>
											{errors.weightage && (
												<ErrorBox>
													<ErrorOutlineIcon fontSize="small" />
													<span>{errors.weightage.message}</span>
												</ErrorBox>
											)}
										</>
									)}
								/>
							</div>
						</div>
					</div>

					{/* Standalone Parents Quiz */}
					<div className="tw-pt-6">
						<Paper>
							<Container maxWidth={false}>
								<div className="tw-py-6">
									<div className="tw-flex tw-justify-between tw-items-start">
										<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Standalone Parents Quiz</h1>
									</div>
									<div className="tw-flex tw-flex-wrap lg:tw-flex-nowrap tw-gap-x-6 tw-gap-y-6 tw-pt-6 tw-items-start tw-justify-between">
										<div className="tw-flex tw-gap-4 tw-items-start tw-w-full">
											<div className="tw-pt-2">Select End-of-Unit Quiz</div>
											<Controller
												name="quizzes.quiz_id"
												control={control}
												rules={{
													validate: (value) => {
														if ((fields.length > 0 || parentQuizWeightage) && !value) {
															return 'This field is mandatory';
														}
														return true;
													},
												}}
												render={({ field }) => (
													<div className="tw-w-[65%]">
														<Dropdown
															onChange={(selectObj) => {
																field.onChange(selectObj)
															}} Obj={true} setObj={setParentQuizObj}
															options={unitContentList?.quizzes ? (!parentQuizId ? unitContentList?.quizzes : [{ title: 'Unselect', id: 0 }, ...unitContentList?.quizzes]) : []}
															valuekey="id"
															labelkey="title"
															label="Select Parent Quiz"
															value={field.value || ""}
														/>
														{errors?.quizzes?.quiz_id && (
															<ErrorBox>
																<ErrorOutlineIcon fontSize="small" />
																<span>{errors?.quizzes?.quiz_id.message}</span>
															</ErrorBox>
														)}
													</div>
												)}
											/>
										</div>
										<div className="tw-flex tw-gap-4 tw-items-start tw-w-full">
											<div className="tw-pt-2">Add Weightage</div>
											<Controller
												name="quizzes.quiz_weightage"
												control={control}
												rules={{
													validate: (value) => {
														if (value < 0 || value > 100) {
															return 'Weightage must be between 0 and 100';
														}
														if ((fields.length > 0 || parentQuizId) && !value) {
															return 'This field is mandatory';
														}
														if (checkTotalWeightage > 100 && value) {
															return 'Sum of allocated weightages for all the below ranges cannot exceed the total weightage above'
														}
														return true;
													},
												}}
												render={({ field }) => (
													<div className="tw-w-[65%]">
														<TextField
															type="number"
															disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
															variant="outlined"
															fullWidth
															size="small"
															label="Add Weightage in (%)"
															{...field}
															value={field.value || ""}
															onWheel={(e) => e.target.blur()} // Prevents scroll behavior
														/>
														{errors?.quizzes?.quiz_weightage && (
															<ErrorBox>
																<ErrorOutlineIcon fontSize="small" />
																<span>{errors?.quizzes?.quiz_weightage.message}</span>
															</ErrorBox>
														)}
													</div>
												)}
											/>
										</div>
									</div>
									<div className="tw-flex tw-flex-col tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-pt-3 tw-items-start"></div>
									{fields.map((item, index) => (
										<div className="tw-flex tw-gap-4 tw-justify-between tw-pt-4">
											<div className="tw-flex tw-gap-4 tw-items-start tw-justify-between tw-w-full">
												<div className="tw-pt-2">{`Score range ${index + 1}`}</div>
												<Controller
													name={`quizzes.ranges.${index}.range`}
													control={control}
													rules={{
														required: 'This field is mandatory',
														validate: (value) => {
															let previousScore = getValues(`quizzes.ranges.${index - 1}.range`);
															previousScore = previousScore ? Number(previousScore) : null;

															// Ensure the current value is between 0 and 100
															if (value < 0 || value > 100) {
																return 'Score range must be between 0 and 100';
															}

															// If this is not the first index and previousScore is defined, ensure the current value is greater than the previous one
															if (index > 0 && previousScore !== null && value <= previousScore) {
																return 'Next score range must be greater than the previous one';
															}

															return true;
														},
													}}
													render={({ field }) => (
														<div className="tw-w-[65%]">
															<TextField
																{...field}
																type="number"
																disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
																variant="outlined"
																fullWidth
																size="small"
																label="Max.score range in (%)"
																value={field.value || ""}
																onWheel={(e) => e.target.blur()} // Prevents scroll behavior
															/>
															{Object.keys(errors).length > 0 && errors?.quizzes?.ranges?.[index]?.range && (
																<ErrorBox>
																	<ErrorOutlineIcon fontSize="small" />
																	<span>{errors?.quizzes?.ranges?.[index]?.range.message}</span>
																</ErrorBox>
															)}
														</div>
													)}
												/>
											</div>
											<div className="tw-flex tw-gap-4 tw-items-start tw-justify-between tw-w-full">
												<div className="tw-pt-2">{`Allocate available weightage`}</div>
												<Controller
													name={`quizzes.ranges.${index}.weightage`}
													control={control}
													rules={{
														required: 'This field is mandatory',
														validate: (value) => {
															if (value < 0 || value > 100) {
																return 'Allocate weightage must be between 0 and 100';
															}
															return true;
														},
													}}
													render={({ field }) => (
														<div className="tw-w-[65%]">
															<TextField
																{...field}
																type="number"
																disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
																variant="outlined"
																fullWidth
																size="small"
																label="Add Weightage in (%)"
																value={field.value || ""}
																onWheel={(e) => e.target.blur()} // Prevents scroll behavior
															/>
															{Object.keys(errors).length > 0 && errors?.quizzes?.ranges?.[index]?.weightage && (
																<ErrorBox>
																	<ErrorOutlineIcon fontSize="small" />
																	<span>{errors?.quizzes?.ranges?.[index]?.weightage.message}</span>
																</ErrorBox>
															)}
														</div>
													)}
												/>
											</div>
											<div>
												<IconButton color="error" onClick={() => remove(index)}>
													<DeleteIcon />
												</IconButton>
											</div>
										</div>
									))}
								</div>
								<Tooltip arrow placement="top-start" title={parentQuizWeightage ? '' : 'Add activity weightage first'}>
									<span>
										<Button disabled={parentQuizWeightage ? false : true} className="!tw-mb-6 !tw-p-0" type="button" disableRipple variant="text" onClick={() => append({ range: null, weightage: null })}>
											+ Add Score Range
										</Button>
									</span>
								</Tooltip>
							</Container>
						</Paper>
					</div>


					{/* Standalone Student Quiz */}
					<div className="tw-pt-6">
						<Paper>
							<Container maxWidth={false}>
								<div className="tw-py-6">
									<div className="tw-flex tw-justify-between tw-items-start">
										<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Standalone Student Quiz</h1>
									</div>
									<div className="tw-flex tw-flex-wrap lg:tw-flex-nowrap tw-gap-x-6 tw-gap-y-6 tw-pt-6 tw-items-start tw-justify-between">
										<div className="tw-flex tw-gap-4 tw-items-start tw-w-full">
											<div className="tw-pt-2">Add Weightage</div>
											<Controller
												name="student_quizzes.student_quiz_weightage"
												control={control}
												rules={{
													validate: (value) => {
														if (value < 0 || value > 100) {
															return 'Weightage must be between 0 and 100';
														}
														if ((fields2.length > 0) && !value) {
															return 'This field is mandatory';
														}
														if (checkTotalWeightage > 100 && value) {
															return 'Sum of allocated weightages for all the below ranges cannot exceed the total weightage above'
														}
														return true;
													},
												}}
												render={({ field }) => (
													<div className="tw-w-[300px]">
														<TextField
															type="number"
															disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
															variant="outlined"
															fullWidth
															size="small"
															label="Add Weightage in (%)"
															{...field}
															value={field.value || ""}
															onWheel={(e) => e.target.blur()} // Prevents scroll behavior
														/>
														{errors?.student_quizzes?.student_quiz_weightage && (
															<ErrorBox>
																<ErrorOutlineIcon fontSize="small" />
																<span>{errors?.student_quizzes?.student_quiz_weightage.message}</span>
															</ErrorBox>
														)}
													</div>
												)}
											/>
										</div>
									</div>
									<div className="tw-flex tw-flex-col tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-pt-3 tw-items-start"></div>
									{fields2.map((item, index) => (
										<div className="tw-flex tw-gap-4 tw-justify-between tw-pt-4">
											<div className="tw-flex tw-gap-4 tw-items-start tw-justify-between tw-w-full">
												<div className="tw-pt-2">{`Quiz completion range ${index + 1}`}</div>
												<Controller
													name={`student_quizzes.ranges.${index}.range`}
													control={control}
													rules={{
														required: 'This field is mandatory',
														validate: (value) => {
															let previousScore = getValues(`student_quizzes.ranges.${index - 1}.range`);
															previousScore = previousScore ? Number(previousScore) : null;

															// Ensure the current value is between 0 and 100
															if (value < 0 || value > 100) {
																return 'Score range must be between 0 and 100';
															}

															// If this is not the first index and previousScore is defined, ensure the current value is greater than the previous one
															if (index > 0 && previousScore !== null && value <= previousScore) {
																return 'Next score range must be greater than the previous one';
															}

															return true;
														},
													}}
													render={({ field }) => (
														<div className="tw-w-[65%]">
															<TextField
																{...field}
																type="number"
																disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
																variant="outlined"
																fullWidth
																size="small"
																label="Max.score range in (%)"
																value={field.value || ""}
																onWheel={(e) => e.target.blur()} // Prevents scroll behavior
															/>
															{Object.keys(errors).length > 0 && errors?.student_quizzes?.ranges?.[index]?.range && (
																<ErrorBox>
																	<ErrorOutlineIcon fontSize="small" />
																	<span>{errors?.student_quizzes?.ranges?.[index]?.range.message}</span>
																</ErrorBox>
															)}
														</div>
													)}
												/>
											</div>
											<div className="tw-flex tw-gap-4 tw-items-start tw-justify-between tw-w-full">
												<div className="tw-pt-2">Allocate available weightage</div>
												<Controller
													name={`student_quizzes.ranges.${index}.weightage`}
													control={control}
													rules={{
														required: 'This field is mandatory',
														validate: (value) => {
															if (value < 0 || value > 100) {
																return 'Allocate weightage must be between 0 and 100';
															}
															return true;
														},
													}}
													render={({ field }) => (
														<div className="tw-w-[65%]">
															<TextField
																{...field}
																type="number"
																disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
																variant="outlined"
																fullWidth
																size="small"
																label="Add Weightage in (%)"
																value={field.value || ""}
																onWheel={(e) => e.target.blur()} // Prevents scroll behavior
															/>
															{Object.keys(errors).length > 0 && errors?.student_quizzes?.ranges?.[index]?.weightage && (
																<ErrorBox>
																	<ErrorOutlineIcon fontSize="small" />
																	<span>{errors?.student_quizzes?.ranges?.[index]?.weightage.message}</span>
																</ErrorBox>
															)}
														</div>
													)}
												/>
											</div>
											<div>
												<IconButton color="error" onClick={() => remove2(index)}>
													<DeleteIcon />
												</IconButton>
											</div>
										</div>
									))}
								</div>
								<Tooltip arrow placement="top-start" title={studentQuizWeightage ? '' : 'Add activity weightage first'}>
									<span>
										<Button disabled={studentQuizWeightage ? false : true} className="!tw-mb-6 !tw-p-0" type="button" disableRipple variant="text" onClick={() => append2({ range: null, weightage: null })}>
											+ Add Score Range
										</Button>
									</span>
								</Tooltip>
							</Container>
						</Paper>
					</div>

					{/* Parents Worksop Quiz */}
					<div className="tw-pt-6">
						<Paper>
							<Container maxWidth={false}>
								<div className="tw-py-6">
									<div className="tw-flex tw-justify-between tw-items-start">
										<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Parents Workshop Quiz</h1>
									</div>
									<div className="tw-flex tw-flex-wrap lg:tw-flex-nowrap tw-gap-x-12 tw-gap-y-6 tw-pt-6 tw-items-start tw-justify-between">
										<div className="tw-flex tw-gap-4 tw-items-start tw-w-full">
											<div className="tw-pt-2">Select Workshop</div>
											<Controller
												name="workshop_quizzes.workshop_id"
												control={control}
												rules={{
													validate: (value) => {
														if ((fields3.length > 0 || workshopQuizWeightage) && !value) {
															return 'This field is mandatory';
														}
														return true;
													},
												}}
												render={({ field }) => (
													<div className="tw-w-[65%]">
														<Dropdown
															{...field}
															options={unitContentList?.workshops ? (!workshopId ? unitContentList?.workshops : [{ serialNumber: 'Unselect', id: 0 }, ...unitContentList?.workshops]) : []}
															valuekey="id"
															labelkey="serialNumber"
															label="Select Workshop Number"
															value={field.value || ""}
															onChange={(selectObj) => {
																field.onChange(selectObj)
															}}
															Obj={true} setObj={setWorkshopNumberObj}
														/>
														{errors.workshop_quizzes?.workshop_id && (
															<ErrorBox>
																<ErrorOutlineIcon fontSize="small" />
																<span>{errors.workshop_quizzes?.workshop_id.message}</span>
															</ErrorBox>
														)}
													</div>
												)}
											/>
										</div>
										<div className="tw-flex tw-gap-4 tw-items-start tw-w-full">
											<div className="tw-pt-2">Select Quiz</div>
											<Controller
												name="workshop_quizzes.quiz_id"
												control={control}
												rules={{
													validate: (value) => {
														if ((fields3.length > 0 || workshopQuizWeightage || workshopId) && !value) {
															return 'This field is mandatory';
														}
														return true;
													},
												}}
												render={({ field }) => (
													<div className="tw-w-[65%]">
														<Tooltip arrow placement="top-start" title={workshopId ? '' : 'Select workshop first'}>
															<span className="tw-w-[65%]">
																<Dropdown
																	disabled={workshopId ? false : true}
																	{...field}
																	options={
																		workshopContentList?.childContents?.filter((item) => item.type == 'ws_uq')
																			? !workshopQuizId
																				? workshopContentList?.childContents?.filter((item) => item.type == 'ws_uq')
																				: [{ title: 'Unselect', id: 0 }, ...workshopContentList?.childContents?.filter((item) => item.type == 'ws_uq')]
																			: []
																	}
																	valuekey="id"
																	labelkey="title"
																	label="Select Quiz"
																	value={field.value || ""}
																	onChange={(selectObj) => {
																		field.onChange(selectObj)
																	}}
																	Obj={true} setObj={setWorkshopQuizObj}
																/>
															</span>
														</Tooltip>
														{errors.workshop_quizzes?.quiz_id && (
															<ErrorBox>
																<ErrorOutlineIcon fontSize="small" />
																<span>{errors.workshop_quizzes?.quiz_id.message}</span>
															</ErrorBox>
														)}
													</div>
												)}
											/>
										</div>
									</div>
									<div>
										<div className="tw-flex tw-gap-7 tw-pt-6 tw-items-start tw-w-full">
											<div className="tw-pt-2">Add Weightage</div>
											<Controller
												name="workshop_quizzes.workshop_quiz_weightage"
												control={control}
												rules={{
													validate: (value) => {
														if (value < 0 || value > 100) {
															return 'Weightage must be between 0 and 100';
														}
														if ((fields3.length > 0 || workshopId || workshopQuizId) && !value) {
															return 'This field is mandatory';
														}
														if (checkTotalWeightage > 100 && value) {
															return 'Sum of allocated weightages for all the below ranges cannot exceed the total weightage above'
														}
														return true;
													},
												}}
												render={({ field }) => (
													<div className="tw-w-auto">
														<TextField
															type="number"
															disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
															variant="outlined"
															fullWidth
															size="small"
															label="Add Weightage in (%)"
															{...field}
															value={field.value || ""}
															onWheel={(e) => e.target.blur()} // Prevents scroll behavior
														/>
														{errors.workshop_quizzes?.workshop_quiz_weightage && (
															<ErrorBox>
																<ErrorOutlineIcon fontSize="small" />
																<span>{errors.workshop_quizzes?.workshop_quiz_weightage.message}</span>
															</ErrorBox>
														)}
													</div>
												)}
											/>
										</div>
									</div>
									<div className="tw-flex tw-flex-col tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-pt-3 tw-items-start"></div>
									{fields3.map((item, index) => (
										<div className="tw-flex tw-gap-4 tw-justify-between tw-pt-4">
											<div className="tw-flex tw-gap-4 tw-items-start tw-justify-between tw-w-full">
												<div className="tw-pt-2">{`Score range ${index + 1}`}</div>
												<Controller
													name={`workshop_quizzes.ranges.${index}.range`}
													control={control}
													rules={{
														required: 'This field is mandatory',
														validate: (value) => {
															let previousScore = getValues(`workshop_quizzes.ranges.${index - 1}.range`);
															previousScore = previousScore ? Number(previousScore) : null;

															// Ensure the current value is between 0 and 100
															if (value < 0 || value > 100) {
																return 'Score range must be between 0 and 100';
															}

															// If this is not the first index and previousScore is defined, ensure the current value is greater than the previous one
															if (index > 0 && previousScore !== null && value <= previousScore) {
																return 'Next score range must be greater than the previous one';
															}
														},
													}}
													render={({ field }) => (
														<div className="tw-w-[65%]">
															<TextField
																{...field}
																type="number"
																disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
																variant="outlined"
																fullWidth
																size="small"
																label="Max. range in (%)"
																{...field}
																onWheel={(e) => e.target.blur()} // Prevents scroll behavior
															/>
															{Object.keys(errors).length > 0 && errors?.workshop_quizzes?.ranges?.[index]?.range && (
																<ErrorBox>
																	<ErrorOutlineIcon fontSize="small" />
																	<span>{errors?.workshop_quizzes?.ranges?.[index]?.range.message}</span>
																</ErrorBox>
															)}
														</div>
													)}
												/>
											</div>
											<div className="tw-flex tw-gap-4 tw-items-start tw-justify-between tw-w-full">
												<div className="tw-pt-">Allocate available weightage</div>
												<Controller
													name={`workshop_quizzes.ranges.${index}.weightage`}
													control={control}
													rules={{
														required: 'This field is mandatory',
														validate: (value) => {
															if (value < 0 || value > 100) {
																return 'Allocate weightage must be between 0 and 100';
															}
															return true;
														},
													}}
													render={({ field }) => (
														<div className="tw-w-[65%]">
															<TextField
																{...field}
																type="number"
																disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
																variant="outlined"
																fullWidth
																size="small"
																label="Add Weightage in (%)"
																{...field}
																onWheel={(e) => e.target.blur()} // Prevents scroll behavior
															/>
															{Object.keys(errors).length > 0 && errors?.workshop_quizzes?.ranges?.[index]?.weightage && (
																<ErrorBox>
																	<ErrorOutlineIcon fontSize="small" />
																	<span>{errors?.workshop_quizzes?.ranges?.[index]?.weightage.message}</span>
																</ErrorBox>
															)}
														</div>
													)}
												/>
											</div>
											<div>
												<IconButton color="error" onClick={() => remove3(index)}>
													<DeleteIcon />
												</IconButton>
											</div>
										</div>
									))}
								</div>
								<Tooltip arrow placement="top-start" title={workshopQuizWeightage ? '' : 'Add activity weightage first'}>
									<span>
										<Button disabled={workshopQuizWeightage ? false : true} className="!tw-mb-6 !tw-p-0" type="button" disableRipple variant="text" onClick={() => append3({ range: null, weightage: null })}>
											+ Add Score Range
										</Button>
									</span>
								</Tooltip>
							</Container>
						</Paper>
					</div>

					{/* Workshop Attendance */}
					<div className="tw-pt-6">
						<Paper>
							<Container maxWidth={false}>
								<div className="tw-py-6">
									<div className="tw-flex tw-justify-between tw-items-start">
										<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Workshop Attendance</h1>
									</div>
									<div className="tw-flex tw-flex-wrap lg:tw-flex-nowrap tw-gap-x-6 tw-gap-y-6 tw-pt-6 tw-items-start tw-justify-between">
										<div className="tw-flex tw-gap-4 tw-items-start tw-w-full">
											<div className="tw-pt-2">Add Weightage</div>
											<Controller
												name="workshop_attendance.workshop_attendance_weightage"
												control={control}
												rules={{
													validate: (value) => {
														if (value < 0 || value > 100) {
															return 'Weightage must be between 0 and 100';
														}
														if ((fields2.length > 0) && !value) {
															return 'This field is mandatory';
														}
														if (checkTotalWeightage > 100 && value) {
															return 'Sum of allocated weightages for all the below ranges cannot exceed the total weightage above'
														}
														return true;
													},
												}}
												render={({ field }) => (
													<div className="tw-w-[300px]">
														<TextField
															type="number"
															disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
															variant="outlined"
															fullWidth
															size="small"
															label="Add Weightage in (%)"
															{...field}
															value={field.value || ""}
															onWheel={(e) => e.target.blur()} // Prevents scroll behavior
														/>
														{errors?.workshop_attendance?.workshop_attendance_weightage && (
															<ErrorBox>
																<ErrorOutlineIcon fontSize="small" />
																<span>{errors?.workshop_attendance?.workshop_attendance_weightage.message}</span>
															</ErrorBox>
														)}
													</div>
												)}
											/>
										</div>
									</div>
									<div className="tw-flex tw-flex-col tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-pt-3 tw-items-start"></div>
									{fields4.map((item, index) => (
										<div className="tw-flex tw-gap-4 tw-justify-between tw-pt-4">
											<div className="tw-flex tw-gap-4 tw-items-start tw-justify-between tw-w-full">
												<div className="tw-pt-2">{`Attendance range ${index + 1}`}</div>
												<Controller
													name={`workshop_attendance.ranges.${index}.range`}
													control={control}
													rules={{
														required: 'This field is mandatory',
														validate: (value) => {
															let previousScore = getValues(`workshop_attendance.ranges.${index - 1}.range`);
															previousScore = previousScore ? Number(previousScore) : null;

															// Ensure the current value is between 0 and 100
															if (value < 0 || value > 100) {
																return 'Score range must be between 0 and 100';
															}

															// If this is not the first index and previousScore is defined, ensure the current value is greater than the previous one
															if (index > 0 && previousScore !== null && value <= previousScore) {
																return 'Next score range must be greater than the previous one';
															}

															return true;
														},
													}}
													render={({ field }) => (
														<div className="tw-w-[65%]">
															<TextField
																{...field}
																type="number"
																disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
																variant="outlined"
																fullWidth
																size="small"
																label="Max.score range in (%)"
																value={field.value || ""}
																onWheel={(e) => e.target.blur()} // Prevents scroll behavior
															/>
															{Object.keys(errors).length > 0 && errors?.workshop_attendance?.ranges?.[index]?.range && (
																<ErrorBox>
																	<ErrorOutlineIcon fontSize="small" />
																	<span>{errors?.workshop_attendance?.ranges?.[index]?.range.message}</span>
																</ErrorBox>
															)}
														</div>
													)}
												/>
											</div>
											<div className="tw-flex tw-gap-4 tw-items-start tw-justify-between tw-w-full">
												<div className="tw-pt-2">Allocate available weightage</div>
												<Controller
													name={`workshop_attendance.ranges.${index}.weightage`}
													control={control}
													rules={{
														required: 'This field is mandatory',
														validate: (value) => {
															if (value < 0 || value > 100) {
																return 'Allocate weightage must be between 0 and 100';
															}
															return true;
														},
													}}
													render={({ field }) => (
														<div className="tw-w-[65%]">
															<TextField
																{...field}
																type="number"
																disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
																variant="outlined"
																fullWidth
																size="small"
																label="Add Weightage in (%)"
																value={field.value || ""}
																onWheel={(e) => e.target.blur()} // Prevents scroll behavior
															/>
															{Object.keys(errors).length > 0 && errors?.workshop_attendance?.ranges?.[index]?.weightage && (
																<ErrorBox>
																	<ErrorOutlineIcon fontSize="small" />
																	<span>{errors?.workshop_attendance?.ranges?.[index]?.weightage.message}</span>
																</ErrorBox>
															)}
														</div>
													)}
												/>
											</div>
											<div>
												<IconButton color="error" onClick={() => remove4(index)}>
													<DeleteIcon />
												</IconButton>
											</div>
										</div>
									))}
								</div>
								<Tooltip arrow placement="top-start" title={workshopAttendanceWeightage ? '' : 'Add activity weightage first'}>
									<span>
										<Button disabled={workshopAttendanceWeightage ? false : true} className="!tw-mb-6 !tw-p-0" type="button" disableRipple variant="text" onClick={() => append4({ range: null, weightage: null })}>
											+ Add Score Range
										</Button>
									</span>
								</Tooltip>
							</Container>
						</Paper>
					</div>
				</form>
			}
		</>
	);
}
