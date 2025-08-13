import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
	Button,
	Checkbox,
	CircularProgress,
	Container,
	FormControl,
	FormControlLabel,
	FormGroup,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Radio,
	RadioGroup,
	Select,
	TextField,
	TextareaAutosize,
	Tooltip,
} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LoadingButton } from '@mui/lab';
import { ErrorBox } from '../../components/Errorbox';
import QuizResponse from '../../components/UnitContent/QuizResponse';
import QuizExpire from '../../components/UnitContent/QuizExpire';
import { submitUnitContentFormData } from '../duck/network';
import { BasicDatePicker } from '../../components/DatePicker';
import moment from 'moment';
import { DropAudioImageWoV } from '../../Progress/Village/survey/DropAudioImageWoV';

export default function QuizForm(props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const qParams = useParams();
	const location = useLocation();
	let [searchParams, setSearchParams] = useSearchParams();

	const program = useSelector((state) => state.program.programDetails);
	const loading = useSelector((state) => state.loader.duplicateLoader);

	const [permissions, setPermissions] = useState({});
	const [savePermission, setSavePermission] = useState(false);
	const [programStatus, setProgramStatus] = useState('');
	const [sectionPage, setSectionPage] = useState(1);
	const [questionnaireData, setQuestionnaireData] = useState(props?.defaultValues?.sections ?? []);
	const [openSuccessResponse, setOpenSuccessResponse] = useState(false);

	const unitId = location?.state?.unit?.id;
	const programDetails = location?.state?.programDetails;
	let params = { programUnitContentId: searchParams.get('programUnitContentId'), parentId: searchParams.get('parentId') };
	if(searchParams.get('childId')) {
		params.childId = searchParams.get('childId')
	}

	const {
		control,
		handleSubmit,
		setValue,
		trigger,
		formState: { errors },
	} = useForm({
		defaultValues: {
			sections: props?.defaultValues?.sections,
		},
	});

	const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
		control,
		name: 'sections',
	});

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// useEffect(() => {
	// 	let access = JSON.parse(window.localStorage.getItem('permissions'));
	// 	setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
	// 	if (props?.type == 'update') {
	// 		if (access?.Programs?.program_unit?.qz?.update) setSavePermission(true);
	// 	} else {
	// 		if (access?.Programs?.program_unit?.qz?.create) setSavePermission(true);
	// 	}
	// 	let currentProgramStatus = JSON.parse(window.localStorage.getItem('currentProgram'));
	// 	if (currentProgramStatus) {
	// 		setProgramStatus(currentProgramStatus?.status);
	// 	}
	// }, []);

	const handleQuestionnareUpdate = (e, index, optionIndex, sectionIndex) => {
		setQuestionnaireData((prevState) => {
			let updateQuestionnaire = JSON.parse(JSON.stringify(prevState));
			let optionType = updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.meta.answerType;
			if (optionType == '3' || optionType == '4') {
				updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.value = e.target.value;
			}
			if (optionType == '1') {
				let options = updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.options;
				options.forEach((option, index) => {
					if (index == optionIndex) {
						option.isSelected = true;
					} else {
						option.isSelected = false;
					}
				});
			}
			if (optionType == '2') {
				let options = updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.options;
				const lastElements = e?.map((str) => str.split('_').pop());
				options.forEach((option, index) => {
					if (lastElements.includes(index.toString())) {
						option.isSelected = true;
					} else {
						option.isSelected = false;
					}
				});
			}
			return updateQuestionnaire;
		});
	};

	const handleNext = async () => {
		if (props?.type == 'attempt') {
			const res = await trigger();
			if (res) {
				setSectionPage((prev) => prev + 1);
			}
		} else {
			setSectionPage((prev) => prev + 1);
		}
	};

	const handleFormSubmit = async (formValues) => {
		const { parentId, programUnitContentId, villageAreaId, managedById, type } = props?.defaultValues;
		let values = { parentId, programUnitContentId, villageAreaId, managedById, type, submittedForm: questionnaireData }
		if(props?.defaultValues?.childId) {
			values.childId = props?.defaultValues?.childId
		}
		if (props?.type == 'attempt') {
			dispatch(submitUnitContentFormData(values)).then((res) => {
				setOpenSuccessResponse(true);
			});
		}
	};

	const renderOptions = (answerFormat, answerType, option) => {
		switch (answerFormat) {
			case '1':
				return <div className="tw-pt-2">{option?.label?.toLowerCase() == 'custom response' ? <div>{'Other'}</div> : <div>{option?.label}</div>}</div>;
			case '2':
				return <div className="tw-pb-3">{option?.temporaryMediaUrl && <img src={option?.temporaryMediaUrl} width={80} height={80} alt="option image" className="tw-py-2" />}</div>;
			case '3':
				return <div className="">{option?.temporaryMediaUrl && <audio src={option?.temporaryMediaUrl} controls className="tw-pb-3" />}</div>;
			case '4':
				return (
					<div className="tw">
						{option?.label && <div className="tw-py-2">{option?.label}</div>}
						{option?.temporaryMediaUrl && <img src={option?.temporaryMediaUrl} width={80} height={80} alt="option image" className="tw-pb-3" />}
					</div>
				);
			case '5':
				return (
					<div className="tw">
						{option?.label && <div className="tw-py-2 tw-pl-2">{option?.label}</div>}
						{option?.temporaryMediaUrl && <audio src={option?.temporaryMediaUrl} controls className="tw-pb-3" />}
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<>
			{(props?.type == 'attempt' && !props?.defaultValues.submittedData?.length > 0 && props.statusCode == 200 && !openSuccessResponse) || props?.type == 'preview' ? (
				<div>
					<form onSubmit={handleSubmit(handleFormSubmit)}>
						<div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
							{props?.type == 'preview' ? (
								<h1 className="tw-font-bold tw-text-[24px]">
									<Button variant="text" onClick={() => navigate(-1)} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[12px]" disableRipple startIcon={<KeyboardBackspaceIcon />}>
										{`program / ${location?.state?.unit?.serialNumber} / ${props?.defaultValues?.title}`}
									</Button>
									{props?.previewType == 'Visit' ? (
										<h1 className="tw-px-2 tw-mt-[-4px]">{props?.type == 'preview' ? `${props?.previewType} Preview` : ''}</h1>
									 ) : (
										<h1 className="tw-px-2 tw-mt-[-4px]">{props?.type == 'preview' ? `${props?.questionnaireType} Preview` : ''}</h1>
									)}
									
								</h1>
							) : (
								<QuizDetail data={props?.defaultValues} />
							)}

							{props?.defaultValues?.sections?.length <= 1 && props?.type !== 'preview' && (
								<div className="md:tw-flex tw-gap-x-5 tw-hidden">
									<div className="tw-flex tw-gap-x-5">
										<LoadingButton loading={loading} type="submit" variant="contained" size="small" className={`tw-h-[35px]`}>
											Submit
										</LoadingButton>
									</div>
								</div>
							)}
							{props?.defaultValues?.sections?.length <= 1 && props?.type !== 'preview' && (
								<div className="tw-fixed md:tw-hidden tw-bottom-0 tw-w-full tw-z-10 tw-left-0 tw-bg-white tw-p-5 tw-gap-x-5 tw-shadow-[0px_-1.42px_7.11px_0px_#0000001A]">
									<LoadingButton loading={loading} type="submit" variant="contained" size="small" fullWidth className={`tw-h-[35px]`}>
										Submit
									</LoadingButton>
								</div>
							)}
							{props?.defaultValues?.sections?.length > 1 && (
								<div className="md:tw-flex tw-gap-x-5 tw-hidden">
									<div className="tw-flex tw-gap-x-5">
										{sectionPage !== 1 && (
											<Button disabled={sectionPage == 1} onClick={() => setSectionPage((prev) => prev - 1)} type="button" variant="outlined" size="small" className={`tw-h-[35px] tw-w-[85px]`}>
												Previous
											</Button>
										)}
										
										{sectionPage < props?.defaultValues?.sections?.length ? (
											<Button onClick={handleNext} type="button" variant="outlined" size="small" className={`tw-h-[35px] tw-w-[85px]`}>
												Next
											</Button>
										) : (
											props?.type !== 'preview' && (
												<div className="md:tw-flex tw-gap-x-5 tw-hidden">
													<div className="tw-flex tw-gap-x-5">
														<LoadingButton loading={loading} type="submit" variant="contained" size="small" className={`tw-h-[35px]`}>
															Submit
														</LoadingButton>
													</div>
												</div>
											)
										)}
									</div>
								</div>
							)}
							{props?.defaultValues?.sections?.length > 1 && (
								<div className="tw-fixed tw-flex md:tw-hidden tw-bottom-0 tw-w-full tw-z-10 tw-left-0 tw-bg-white tw-p-5 tw-gap-x-5 tw-shadow-[0px_-1.42px_7.11px_0px_#0000001A]">
									{sectionPage !== 1 && (
										<Button disabled={sectionPage == 1} onClick={() => setSectionPage((prev) => prev - 1)} type="button" variant="outlined" size="small" fullWidth className={`tw-h-[35px]`}>
										Previous
									</Button>
									)}
									{sectionPage < props?.defaultValues?.sections?.length ? (
										<Button onClick={handleNext} variant="outlined" size="small" fullWidth className={`tw-h-[35px]`}>
											Next
										</Button>
									) : (
										props?.type !== 'preview' && (
											<LoadingButton loading={loading} type="submit" variant="contained" size="small" fullWidth className={`tw-h-[35px]`}>
												Submit
											</LoadingButton>
										)
									)}
								</div>
							)}
						</div>

						{fields.map((section, sectionIndex) => {
							if (sectionIndex + 1 !== sectionPage) return;
							return (
								<div className="">
									{(section?.title || section?.description) && (
										<div className="tw-pt-10 tw-px-2">
											{section?.title && (
												<p className="tw-text-black tw-pb-1">
													<span className="tw-text-grey">Section title: </span>
													{section?.title}
												</p>
											)}
											{section?.description && (
												<p className="tw-text-black">
													<span className="tw-text-grey">Section description: </span>
													{section?.description}
												</p>
											)}
										</div>
									)}

									<div className='tw-text-end tw-text-grey'><span className="tw-text-rose-500">*</span> Indicates required question</div>

									{section?.questionnaire?.map((question, rootIndex) => {
										switch (question?.questionnairesJson?.meta?.answerType) {
											case '1':
												return (
													<div className="tw-pt-6">
														<Paper>
															<Container maxWidth={false}>
																<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-py-6 tw-w-full">
																	<Controller
																		name={`question_${sectionIndex + 1}_${rootIndex + 1}`}
																		control={control}
																		rules={{ required: question?.canSkip ? false : 'One option must be selected', pattern: { value: /.{2,}/, message: 'Minimum 2 character are required' } }}
																		render={({ field }) => (
																			<div className="tw-flex-1">
																				<div className="tw-flex tw-flex-col tw-gap-2 tw-pb-3">
																					<span className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-1">
																						{question?.canSkip == false && <sup className="tw-text-rose-500">*</sup>}
																						{`Q.${rootIndex + 1} ${question?.title}`}
																					</span>
																					{question?.description && (
																						<div className="">
																							<p>{question?.description}</p>
																						</div>
																					)}
																					{question?.mediaType?.includes('image') && question?.temporaryMediaUrl && (
																						<div className="">
																							<img className="tw-rounded-[12px]" src={question?.temporaryMediaUrl} width={80} height={80} />
																						</div>
																					)}
																					{question?.mediaType?.includes('audio') && question?.temporaryMediaUrl && (
																						<div className="">
																							<audio src={question?.temporaryMediaUrl} controls />
																						</div>
																					)}
																				</div>
																				<RadioGroup
																					{...field}
																					value={
																						questionnaireData[sectionIndex].questionnaire[rootIndex]?.questionnairesJson?.options?.find((item) => item?.isSelected == true) !== undefined
																							? `${sectionIndex}_${rootIndex}_${questionnaireData[sectionIndex].questionnaire[rootIndex]?.questionnairesJson?.options?.findIndex((item) => item?.isSelected == true)}`
																							: null
																					}
																					aria-labelledby="demo-radio-buttons-group-label"
																					name="radio-buttons-group"
																				>
																					{question?.questionnairesJson?.options?.map((option, optionIndex) => (
																						<FormControlLabel
																							sx={{alignItems:'flex-start'}}
																							{...field}
																							disabled={props?.type == 'preview' ? true : false}
																							value={`${sectionIndex}_${rootIndex}_${optionIndex}`}
																							control={
																								<Radio
																									onClick={(e) => {
																										handleQuestionnareUpdate(e, rootIndex, optionIndex, sectionIndex);
																										setValue(`question_${sectionIndex + 1}_${rootIndex + 1}`, `${sectionIndex}_${rootIndex}_${optionIndex}`, { shouldValidate: question?.canSkip ? false : true });
																									}}
																								/>
																							}
																							label={renderOptions(question.questionnairesJson.meta.answerFormat, question.questionnairesJson.meta.answerType, option)}
																						/>
																					))}
																				</RadioGroup>
																				{errors[`question_${sectionIndex + 1}_${rootIndex + 1}`] && (
																					<ErrorBox>
																						<ErrorOutlineIcon fontSize="small" />
																						<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}`].message}</span>
																					</ErrorBox>
																				)}
																			</div>
																		)}
																	/>
																</div>
															</Container>
														</Paper>
													</div>
												);
											case '2':
												return (
													<div className="tw-pt-6">
														<Paper>
															<Container maxWidth={false}>
																<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-py-6 tw-w-full">
																	<Controller
																		name={`question_${sectionIndex + 1}_${rootIndex + 1}`}
																		control={control}
																		rules={{
																			validate: {
																				atLeastOneSelected: (value) => {
																					if (question?.canSkip) return null;
																					const checkedOptions = Array.isArray(value) ? value.filter((option) => option !== false) : [];
																					return checkedOptions.length > 0 || 'At least one option must be selected';
																				},
																				atMostSelected: (value) => {
																					if (question?.canSkip && !value) return null;
																					const checkedOptions = Array.isArray(value) ? value.filter((option) => option !== false) : [];
																					let maxLimit = question?.questionnairesJson?.options.filter(option=> option.isCorrect == true).length
																					return checkedOptions.length <= maxLimit || `Maximum ${maxLimit} options can be selected`;
																				},
																			},
																		}}
																		render={({ field }) => (
																			<div className="tw-flex-1">
																				<div className="tw-flex tw-flex-col tw-gap-2 tw-pb-3">
																					<span className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-1">
																						{question?.canSkip == false && <sup className="tw-text-rose-500">*</sup>}
																						{`Q.${rootIndex + 1} ${question?.title}`}
																					</span>
																					{question?.description && (
																						<div className="">
																							<p>{question?.description}</p>
																						</div>
																					)}
																					{question?.mediaType?.includes('image') && question?.temporaryMediaUrl && (
																						<div className="">
																							<img className="tw-rounded-[12px]" src={question?.temporaryMediaUrl} width={80} height={80} />
																						</div>
																					)}
																					{question?.mediaType?.includes('audio') && question?.temporaryMediaUrl && (
																						<div className="">
																							<audio src={question?.temporaryMediaUrl} controls />
																						</div>
																					)}
																				</div>

																				<FormGroup>
																					{question?.questionnairesJson?.options?.map((option, optionIndex) => (
																						<FormControlLabel
																							sx={{alignItems:'flex-start'}}
																							disabled={props?.type === 'preview'}
																							control={
																								<Checkbox
																									{...field}
																									value={`${sectionIndex}_${rootIndex}_${optionIndex}`}
																									checked={(field.value ?? []).includes(`${sectionIndex}_${rootIndex}_${optionIndex}`)}
																									onChange={(e) => {
																										const newValue = Array.isArray(field.value) ? [...field.value] : [];
																										const value = e.target.value;
																										if (e.target.checked) {
																											newValue.push(value);
																										} else {
																											const index = newValue.indexOf(value);
																											if (index !== -1) {
																												newValue.splice(index, 1);
																											}
																										}
																										handleQuestionnareUpdate(newValue, rootIndex, optionIndex, sectionIndex);
																										field.onChange(newValue);
																									}}
																								/>
																							}
																							label={renderOptions(question.questionnairesJson.meta.answerFormat, question.questionnairesJson.meta.answerType, option)}
																						/>
																					))}
																				</FormGroup>
																				{errors[`question_${sectionIndex + 1}_${rootIndex + 1}`] && (
																					<ErrorBox>
																						<ErrorOutlineIcon fontSize="small" />
																						<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}`].message}</span>
																					</ErrorBox>
																				)}
																			</div>
																		)}
																	/>
																</div>
															</Container>
														</Paper>
													</div>
												);
											case '3':
												return (
													<div className="tw-pt-6">
														<Paper>
															<Container maxWidth={false}>
																<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-py-6 tw-w-full">
																	<Controller
																		name={`question_${sectionIndex + 1}_${rootIndex + 1}`}
																		disabled={props?.type == 'preview' ? true : false}
																		control={control}
																		rules={{ required: 'This field is mandatory', pattern: { value: /.{2,}/, message: 'Minimum 2 character are required' } }}
																		render={({ field }) => (
																			<div className="tw-flex-1">
																				<div className="tw-flex tw-flex-col tw-gap-2">
																					<span className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-1">{`Q.${rootIndex + 1} ${question?.title}`}</span>
																					{question?.description && (
																						<div className="">
																							<p>{question?.description}</p>
																						</div>
																					)}
																					{question?.mediaType?.includes('image') && question?.temporaryMediaUrl && (
																						<div className="tw-pb-4">
																							<img className="tw-rounded-[12px]" src={question?.temporaryMediaUrl} width={80} height={80} />
																						</div>
																					)}
																					{question?.mediaType?.includes('audio') && question?.temporaryMediaUrl && (
																						<div className="tw-pb-4">
																							<audio src={question?.temporaryMediaUrl} controls />
																						</div>
																					)}
																					<TextField
																						variant="outlined"
																						// label="Answer"
																						{...field}
																						value={questionnaireData?.[rootIndex]?.questionnairesJson?.value}
																						onChange={(e) => {
																							if (e.target.value.length >= 200) {
																								e.preventDefault();
																							}
																							if (e.target.value.length <= 200) {
																								handleQuestionnareUpdate(e, rootIndex);
																								setValue(`question_${sectionIndex + 1}_${rootIndex + 1}`, e.target.value);
																							}
																						}}
																						disabled={props?.type == 'preview' ? true : false}
																						className="tw-max-w-[900px] tw-w-full"
																						size="small"
																						placeholder="Type Answer"
																					/>
																					<div className="tw-text-end tw-text-xs tw-text-grey tw-max-w-[900px]">Max 200 characters allowed</div>
																				</div>
																				{errors[`question_${sectionIndex + 1}_${rootIndex + 1}`] && (
																					<ErrorBox>
																						<ErrorOutlineIcon fontSize="small" />
																						<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}`].message}</span>
																					</ErrorBox>
																				)}
																			</div>
																		)}
																	/>
																</div>
															</Container>
														</Paper>
													</div>
												);
											case '4':
												return (
													<div className="tw-pt-6">
														<Paper>
															<Container maxWidth={false}>
																<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-py-6 tw-w-full">
																	<Controller
																		name={`question_${sectionIndex + 1}_${rootIndex + 1}`}
																		control={control}
																		rules={{ required: 'This field is mandatory', pattern: { value: /.{2,}/, message: 'Minimum 2 character are required' } }}
																		render={({ field }) => (
																			<div className="tw-flex-1">
																				<div className="tw-flex tw-flex-col tw-gap-2">
																					<span className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-1">{`Q.${rootIndex + 1} ${question?.title}`}</span>
																					{question?.description && (
																						<div className="">
																							<p>{question?.description}</p>
																						</div>
																					)}
																					{question?.mediaType?.includes('image') && question?.temporaryMediaUrl && (
																						<div className="tw-pb-4">
																							<img className="tw-rounded-[12px]" src={question?.temporaryMediaUrl} width={80} height={80} />
																						</div>
																					)}
																					{question?.mediaType?.includes('audio') && question?.temporaryMediaUrl && (
																						<div className="tw-pb-4">
																							<audio src={question?.temporaryMediaUrl} controls />
																						</div>
																					)}
																					<div style={{ display: 'flex' }}>
																						<textarea
																							{...field}
																							value={questionnaireData?.[rootIndex]?.questionnairesJson?.value}
																							onChange={(e) => {
																								if (e.target.value.length >= 1000) {
																									e.preventDefault();
																								}
																								if (e.target.value.length <= 1000) {
																									handleQuestionnareUpdate(e, rootIndex);
																									setValue(`question_${sectionIndex + 1}_${rootIndex + 1}`, e.target.value);
																								}
																							}}
																							disabled={props?.type == 'preview' ? true : false}
																							minRows={6}
																							size="small"
																							rows="4"
																							placeholder="Type Answer"
																							className="tw-max-w-[900px] tw-w-full tw-px-3 tw-py-2 tw-rounded tw-rounded-br-none tw-border-[1px] tw-border-solid tw-border-[#0000003b] hover:tw-border-black focus:tw-border-primary focus:tw-border-2 tw-resize  tw-bg-white  tw-text-slate-900  focus-visible:tw-outline-0 tw-box-border"
																							aria-label="empty textarea"
																						/>
																					</div>
																					<div className="tw-text-end tw-text-xs tw-text-grey tw-max-w-[900px]">Max 1000 characters allowed</div>
																				</div>
																				{errors[`question_${sectionIndex + 1}_${rootIndex + 1}`] && (
																					<ErrorBox>
																						<ErrorOutlineIcon fontSize="small" />
																						<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}`].message}</span>
																					</ErrorBox>
																				)}
																			</div>
																		)}
																	/>
																</div>
															</Container>
														</Paper>
													</div>
												);
											case '5':
												return (
													<>
														<div className="tw-pt-6">
															<Paper>
																<Container maxWidth={false}>
																	<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-py-6 ">
																		<div className="tw-py-6  tw-flex tw-flex-col tw-gap-4 tw-w-full">
																			<div className="tw-flex tw-flex-col tw-gap-2 tw-pb-3">
																				<span className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-1">{`Q.${rootIndex + 1} ${question?.title}`}</span>
																				{question?.description && (
																					<div className="">
																						<p>{question?.description}</p>
																					</div>
																				)}
																				{question?.mediaType?.includes('image') && question?.temporaryMediaUrl && (
																					<div className="">
																						<img className="tw-rounded-[12px]" src={question?.temporaryMediaUrl} width={80} height={80} />
																					</div>
																				)}
																				{question?.mediaType?.includes('audio') && question?.temporaryMediaUrl && (
																					<div className="">
																						<audio src={question?.temporaryMediaUrl} controls />
																					</div>
																				)}
																			</div>

																			{question?.questionnairesJson?.form?.map((data, index) => (
																				<div key={index}>
																					<div className="tw-text-base tw-font-semibold tw-pb-4">
																						{!data?.canSkip && <sup className="tw-text-red-500 ">* </sup>}
																						{data?.label}
																					</div>
																					<div className="tw-ml-8">
																						{data.children?.map((d, childIndex) => {
																							switch (d.inputType) {
																								case '1':
																									return (
																										<div className="tw-flex tw-gap-2 tw-w-[350px] tw-flex-col tw-pb-2">
																											<div className="">{d.label}</div>
																											<Controller
																												name={`question_${rootIndex + 1}_${index}_${childIndex}`}
																												disabled={props?.type == 'preview' ? true : false}
																												control={control}
																												rules={{
																													required: !data?.canSkip ? 'This field is mandatory' : false,
																													pattern: {
																														value: /.{1,}/,
																														message: 'Minimum 1 character is required',
																													},
																												}}
																												render={({ field }) => (
																													<div className="tw-flex-1">
																														<>
																															<TextField
																																variant="outlined"
																																{...field}
																																value={d.value}
																																onChange={(e) => {
																																	if (e.target.value.length >= 200) {
																																		e.preventDefault();
																																	}
																																	if (e.target.value.length <= 200) {
																																		handleQuestionnareUpdate(e, rootIndex, index, childIndex);
																																		setValue(`question_${rootIndex + 1}_${index}_${childIndex}`, e.target.value);
																																	}
																																}}
																																// disabled={props?.type == 'preview' ? true : false}
																																className="tw-max-w-[520px] tw-w-[350px]"
																																size="small"
																																placeholder="Type Answer"
																															/>
																															<div className="tw-text-end tw-text-xs tw-text-grey tw-max-w-[350px]">Max 200 characters allowed</div>
																														</>
																														{errors[`question_${rootIndex + 1}_${index}_${childIndex}`] && (
																															<ErrorBox>
																																<ErrorOutlineIcon fontSize="small" />
																																<span>{errors[`question_${rootIndex + 1}_${index}_${childIndex}`].message}</span>
																															</ErrorBox>
																														)}
																													</div>
																												)}
																											/>
																										</div>
																									);

																								case '2':
																									return (
																										<>
																											<div className="tw-flex tw-gap-2 tw-w-[350px] tw-flex-col tw-pb-4">
																												<div>{d.label}</div>
																												<Controller
																													name={`question_${rootIndex + 1}_${index}_${childIndex}`}
																													disabled={props?.type == 'preview' ? true : false}
																													control={control}
																													rules={{
																														required: !data?.canSkip ? 'This field is mandatory' : false,
																														pattern: {
																															value: /^[0-9]{10}$/,
																															message: 'Please enter a valid number',
																														},
																													}}
																													render={({ field }) => (
																														<div className="tw-flex-1">
																															<>
																																<TextField
																																	variant="outlined"
																																	{...field}
																																	type="number"
																																	value={d.value}
																																	onKeyPress={(e) => {
																																		if (!/^\d*$/.test(e.target.value)) {
																																			e.preventDefault();
																																		}

																																		if (e.target.value.length === 10) {
																																			e.preventDefault();
																																		}
																																	}}
																																	onChange={(e) => {
																																		if (e.target.value.length <= 10) {
																																			handleQuestionnareUpdate(e, rootIndex, index, childIndex);
																																			setValue(`question_${rootIndex + 1}_${index}_${childIndex}`, e.target.value);
																																		}
																																	}}
																																	disabled={props?.type == 'preview' ? true : false}
																																	className="tw-max-w-[520px] tw-w-[350px]"
																																	size="small"
																																	placeholder="Enter phone number"
																																/>
																																{/* <div className="tw-text-end tw-text-xs tw-text-grey tw-max-w-[520px]">Phone Number is allowed</div> */}
																															</>
																															{errors[`question_${rootIndex + 1}_${index}_${childIndex}`] && (
																																<ErrorBox>
																																	<ErrorOutlineIcon fontSize="small" />
																																	<span>{errors[`question_${rootIndex + 1}_${index}_${childIndex}`].message}</span>
																																</ErrorBox>
																															)}
																														</div>
																													)}
																												/>
																											</div>
																										</>
																									);
																								case '3':
																									return (
																										<>
																											<div className="tw-flex tw-gap-2 tw-w-[350px] tw-flex-col tw-pb-4">
																												<div>{d.label}</div>
																												<Controller
																													name={`question_${rootIndex + 1}_${index}_${childIndex}`}
																													disabled={props?.type == 'preview' ? true : false}
																													control={control}
																													rules={{
																														required: !data?.canSkip ? 'This field is mandatory' : false,
																														pattern: {
																															value: /^\S+@\S+\.\S+$/,
																															message: 'Please enter a valid email address.',
																														},
																													}}
																													render={({ field }) => (
																														<div className="tw-flex-1">
																															<>
																																<TextField
																																	variant="outlined"
																																	{...field}
																																	value={d.value}
																																	onChange={(e) => {
																																		if (e.target.value.length >= 200) {
																																			e.preventDefault();
																																		}
																																		if (e.target.value.length <= 200) {
																																			handleQuestionnareUpdate(e, rootIndex, index, childIndex);
																																			setValue(`question_${rootIndex + 1}_${index}_${childIndex}`, e.target.value);
																																		}
																																	}}
																																	disabled={props?.type == 'preview' ? true : false}
																																	className="tw-max-w-[520px] tw-w-full"
																																	size="small"
																																	placeholder="Enter email address"
																																/>
																																{/* <div className="tw-text-end tw-text-xs tw-text-grey tw-max-w-[520px]">Email Id is allowed</div> */}
																															</>
																															{errors[`question_${rootIndex + 1}_${index}_${childIndex}`] && (
																																<ErrorBox>
																																	<ErrorOutlineIcon fontSize="small" />
																																	<span>{errors[`question_${rootIndex + 1}_${index}_${childIndex}`].message}</span>
																																</ErrorBox>
																															)}
																														</div>
																													)}
																												/>
																											</div>
																										</>
																									);

																								case '4':
																									return (
																										<>
																											<div className="tw-flex tw-gap-2 tw-w-[350px] tw-flex-col tw-pb-4">
																												<div>{d.label}</div>
																												<Controller
																													name={`question_${rootIndex + 1}_${index}_${childIndex}`}
																													disabled={props?.type === 'preview'}
																													control={control}
																													rules={{
																														required: !data?.canSkip ? 'This field is mandatory' : false,
																													}}
																													render={({ field }) => (
																														<div className="tw-w-[350px]">
																															<BasicDatePicker
																																{...field}
																																disabled={props?.type === 'preview'}
																																inputFormat="DD/MM/YYYY"
																																value={null} // Ensure the value is a moment object
																																onChange={(date) => {
																																	const formattedDate = moment(date).format('DD/MM/YYYY');
																																	handleQuestionnareUpdate(formattedDate, rootIndex, index, childIndex);
																																	setValue(`question_${rootIndex + 1}_${index}_${childIndex}`, formattedDate);
																																}}
																																label="Select Date"
																															/>
																															{errors[`question_${rootIndex + 1}_${index}_${childIndex}`] && (
																																<ErrorBox>
																																	<ErrorOutlineIcon fontSize="small" />
																																	<span>{errors[`question_${rootIndex + 1}_${index}_${childIndex}`].message}</span>
																																</ErrorBox>
																															)}
																														</div>
																													)}
																												/>
																											</div>
																										</>
																									);
																								case '5':
																									return (
																										<>
																											<div className="tw-flex tw-gap-2 tw-w-[350px] tw-flex-col tw-pb-4">
																												<div>{d.label}</div>
																												<Controller
																													name={`question_${rootIndex + 1}_${index}_${childIndex}`}
																													disabled={props?.type === 'preview'}
																													control={control}
																													rules={{
																														required: !data?.canSkip ? 'This field is mandatory' : false,
																													}}
																													render={({ field }) => (
																														<div className="tw-flex-1">
																															<>
																																<FormControl fullWidth size="small" className="tw-max-w-[520px]">
																																	<InputLabel id={`select-label-${rootIndex}-${index}-${childIndex}`}>Choose one</InputLabel>
																																	<Select
																																		labelId={`select-label-${rootIndex}-${index}-${childIndex}`}
																																		variant="outlined"
																																		{...field}
																																		value={d.value || ''}
																																		onChange={(e) => {
																																			handleQuestionnareUpdate(e, rootIndex, index, childIndex);
																																			setValue(`question_${rootIndex + 1}_${index}_${childIndex}`, e.target.value);
																																		}}
																																		disabled={props?.type === 'preview'}
																																		label="Select an option"
																																	>
																																		{d.children.map((child, childIndex) => (
																																			<MenuItem key={childIndex} value={child.label}>
																																				{child.label}
																																			</MenuItem>
																																		))}
																																	</Select>
																																</FormControl>
																																{errors[`question_${rootIndex + 1}_${index}_${childIndex}`] && (
																																	<ErrorBox>
																																		<ErrorOutlineIcon fontSize="small" />
																																		<span>{errors[`question_${rootIndex + 1}_${index}_${childIndex}`].message}</span>
																																	</ErrorBox>
																																)}
																															</>
																														</div>
																													)}
																												/>
																											</div>
																										</>
																									);

																								default:
																									return null;
																							}
																						})}
																					</div>
																				</div>
																			))}
																			<div className="tw-w-[400px]">
																				{question?.questionnairesJson?.addCommentBox && (
																					<div className="tw-pt-2">
																						<span className="!tw-text-primaryText tw-py-2">Additional comment</span>
																						<TextField
																							variant="outlined"
																							disabled={props?.type == 'preview' ? true : false}
																							fullWidth
																							multiline
																							rows={3}
																							value={question?.questionnairesJson?.comment}
																							placeholder="Please provide your comment here"
																							onChange={(e) => {
																								handleQuestionnareUpdate(e, rootIndex, null, null, 'comment');
																							}}
																						/>
																					</div>
																				)}
																			</div>
																		</div>
																	</div>
																</Container>
															</Paper>
														</div>
													</>
												);
											case '6':
												return (
													<div className="tw-pt-6">
														<Paper>
															<Container maxWidth={false}>
																<div className="tw-py-6 tw-w-full tw-flex tw-flex-col tw-gap-2">
																	<div className="tw-flex tw-flex-col tw-gap-2 tw-pb-3">
																		<span className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-1">{`Q.${rootIndex + 1} ${question?.title}`}</span>
																		{question?.description && (
																			<div className="">
																				<p>{question?.description}</p>
																			</div>
																		)}
																		{question?.mediaType?.includes('image') && question?.temporaryMediaUrl && (
																			<div className="">
																				<img className="tw-rounded-[12px]" src={question?.temporaryMediaUrl} width={80} height={80} />
																			</div>
																		)}
																		{question?.mediaType?.includes('audio') && question?.temporaryMediaUrl && (
																			<div className="">
																				<audio src={question?.temporaryMediaUrl} controls />
																			</div>
																		)}
																	</div>
																	<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-col">
																		{question?.questionnairesJson?.textboxes.map((d, index) => {
																			switch (d.inputType) {
																				case '1':
																					return (
																						<>
																							<div className="tw-flex tw-gap-12 tw-w-[350px]">
																								<Controller
																									name={`question_${rootIndex + 1}_${index}`}
																									disabled={props?.type == 'preview' ? true : false}
																									control={control}
																									rules={{ required: 'This field is mandatory', pattern: { value: /.{1,}/, message: 'Minimum 2 character are required' } }}
																									render={({ field }) => (
																										<div className="tw-flex-1">
																											<>
																												<TextField
																													variant="outlined"
																													{...field}
																													value={d.value}
																													onChange={(e) => {
																														if (e.target.value.length >= 200) {
																															e.preventDefault();
																														}
																														if (e.target.value.length <= 200) {
																															handleQuestionnareUpdate(e, rootIndex, index);
																															setValue(`question_${rootIndex + 1}_${index}`, e.target.value);
																														}
																													}}
																													disabled={props?.type == 'preview' ? true : false}
																													className="tw-max-w-[520px] tw-w-full"
																													size="small"
																													placeholder="Type Answer"
																												/>
																												<div className="tw-text-end tw-text-xs tw-text-grey tw-max-w-[520px]">Max 200 characters allowed</div>
																											</>
																											{errors[`question_${rootIndex + 1}_${index}`] && (
																												<ErrorBox>
																													<ErrorOutlineIcon fontSize="small" />
																													<span>{errors[`question_${rootIndex + 1}_${index}`].message}</span>
																												</ErrorBox>
																											)}
																										</div>
																									)}
																								/>
																							</div>
																						</>
																					);

																				case '2':
																					return (
																						<>
																							<div className="tw-flex tw-gap-2 tw-w-[350px]">
																								<Controller
																									name={`question_${rootIndex + 1}_${index}`}
																									disabled={props?.type == 'preview' ? true : false}
																									control={control}
																									rules={{
																										required: 'This field is mandatory.',
																										pattern: {
																											value: /^[0-9]{10}$/,
																											message: 'Please enter a valid number',
																										},
																									}}
																									render={({ field }) => (
																										<div className="tw-flex-1">
																											<>
																												<TextField
																													variant="outlined"
																													{...field}
																													value={d.value}
																													type="number"
																													onKeyPress={(e) => {
																														if (!/^\d*$/.test(e.target.value)) {
																															e.preventDefault();
																														}

																														if (e.target.value.length === 10) {
																															e.preventDefault();
																														}
																													}}
																													onChange={(e) => {
																														if (e.target.value.length <= 10) {
																															handleQuestionnareUpdate(e, rootIndex, index);
																															setValue(`question_${rootIndex + 1}_${index}`, e.target.value);
																														}
																													}}
																													disabled={props?.type == 'preview' ? true : false}
																													className="tw-max-w-[520px] tw-w-full"
																													size="small"
																													placeholder="Enter phone number"
																												/>
																											</>
																											{errors[`question_${rootIndex + 1}_${index}`] && (
																												<ErrorBox>
																													<ErrorOutlineIcon fontSize="small" />
																													<span>{errors[`question_${rootIndex + 1}_${index}`].message}</span>
																												</ErrorBox>
																											)}
																										</div>
																									)}
																								/>
																							</div>
																						</>
																					);

																				case '3':
																					return (
																						<>
																							<div className="tw-flex tw-gap-2 tw-w-[350px]">
																								<Controller
																									name={`question_${rootIndex + 1}_${index}`}
																									disabled={props?.type == 'preview' ? true : false}
																									control={control}
																									rules={{
																										required: 'This field is mandatory.',
																										pattern: {
																											value: /^\S+@\S+\.\S+$/,
																											message: 'Please enter a valid email address.',
																										},
																									}}
																									render={({ field }) => (
																										<div className="tw-flex-1">
																											<>
																												<TextField
																													variant="outlined"
																													{...field}
																													value={d.value}
																													onChange={(e) => {
																														if (e.target.value.length >= 200) {
																															e.preventDefault();
																														}
																														if (e.target.value.length <= 200) {
																															handleQuestionnareUpdate(e, rootIndex, index);
																															setValue(`question_${rootIndex + 1}_${index}`, e.target.value);
																														}
																													}}
																													disabled={props?.type == 'preview' ? true : false}
																													className="tw-max-w-[520px] tw-w-full"
																													size="small"
																													placeholder="Enter email address"
																												/>
																											</>
																											{errors[`question_${rootIndex + 1}_${index}`] && (
																												<ErrorBox>
																													<ErrorOutlineIcon fontSize="small" />
																													<span>{errors[`question_${rootIndex + 1}_${index}`].message}</span>
																												</ErrorBox>
																											)}
																										</div>
																									)}
																								/>
																							</div>
																						</>
																					);
																				case '4':
																					return (
																						<>
																							<div className="tw-flex tw-gap-2 tw-w-[350px]">
																								<Controller
																									name={`question_${rootIndex + 1}_${index}`}
																									disabled={props?.type === 'preview'}
																									control={control}
																									rules={{ required: 'This field is mandatory' }}
																									render={({ field }) => (
																										<div className="tw-w-[500px]">
																											<BasicDatePicker
																												{...field}
																												disabled={props?.type === 'preview'}
																												inputFormat="DD/MM/YYYY"
																												value={null}
																												//value={moment(field.value, 'DD/MM/YYYY')} // Ensure the value is a moment object
																												onChange={(date) => {
																													const formattedDate = moment(date).format('DD/MM/YYYY');
																													handleQuestionnareUpdate(formattedDate, rootIndex, index);
																													setValue(`question_${rootIndex + 1}_${index}`, formattedDate);
																												}}
																												label="Date"
																											/>
																											{errors[`question_${rootIndex + 1}_${index}`] && (
																												<ErrorBox>
																													<ErrorOutlineIcon fontSize="small" />
																													<span>{errors[`question_${rootIndex + 1}_${index}`].message}</span>
																												</ErrorBox>
																											)}
																										</div>
																									)}
																								/>
																							</div>
																						</>
																					);
																				default:
																					return null;
																			}
																		})}
																		<>
																			{question?.questionnairesJson?.addCommentBox && (
																				<div className="tw-pt-4 tw-w-[520px]">
																					<span className="!tw-text-primaryText tw-p-2">Additional comment</span>
																					<TextField
																						variant="outlined"
																						fullWidth
																						multiline
																						rows={4}
																						disabled={props?.type === 'preview'}
																						value={question?.questionnairesJson?.comment}
																						placeholder="Please provide your comment here"
																						onChange={(e) => {
																							handleQuestionnareUpdate(e, rootIndex, null, null, 'comment');
																						}}
																					/>
																				</div>
																			)}
																		</>
																	</div>
																</div>
															</Container>
														</Paper>
													</div>
												);
											case '7':
												//const atLeastOneFileUploaded = question?.questionnairesJson?.uploadMedia?.length > 0;

												return (
													<div className="tw-pt-6">
														<Paper>
															<Container maxWidth={false}>
																<div className="tw-py-6 tw-w-full tw-flex tw-flex-col tw-gap-2">
																	<div className="tw-flex tw-justify-between">
																		<div className="tw-flex tw-flex-col tw-gap-2 tw-pb-3">
																			<span className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-1">{`Q.${rootIndex + 1} ${question?.title}`}</span>
																			{question?.description && (
																				<div className="">
																					<p>{question?.description}</p>
																				</div>
																			)}
																			{question?.mediaType?.includes('image') && question?.temporaryMediaUrl && (
																				<div className="">
																					<img className="tw-rounded-[12px]" src={question?.temporaryMediaUrl} width={80} height={80} />
																				</div>
																			)}
																			{question?.mediaType?.includes('audio') && question?.temporaryMediaUrl && (
																				<div className="">
																					<audio src={question?.temporaryMediaUrl} controls />
																				</div>
																			)}
																		</div>
																		<div className="tw-text-sm tw-text-gray-500 tw-text-right">Upload Limit: {question?.questionnairesJson?.uploadLimit}</div>
																	</div>

																	<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-col">
																		{question?.questionnairesJson?.uploadMedia?.map((media, index) => (
																			<div key={`${rootIndex}-${index}`}>
																				<Controller
																					name={`question_${rootIndex + 1}_${index}`}
																					control={control}
																					render={({ field }) => (
																						<div className="tw-flex-1">
																							<div className="tw-flex tw-flex-col tw-gap-1">
																								<div style={{ display: 'flex' }}>
																									<DropAudioImageWoV
																										selectedFile={selectedFiles[rootIndex]?.[index]}
																										setSelectedFile={(file) => handleFileChange(rootIndex, file, index)}
																										setFileError={(error) => handleFileError(rootIndex, error, index)}
																										fileError={fileErrors[rootIndex]?.[index]}
																										setError={setErr}
																										error={errors[`question_${rootIndex + 1}_${index}`]}
																										key={`${rootIndex}-${index}`}
																										setKey={setKey}
																										register={field}
																										rootIndex={rootIndex}
																										index={index}
																										handleDeleteMedia={handleDeleteMedia}
																										setQuestionnaireData={setQuestionnaireData}
																										handleQuestionnareUpdate={() => handleQuestionnareUpdate('7', rootIndex, index)}
																										onChange={field.onChange}
																										allowedMediaType={question?.questionnairesJson?.allowedMediaType}
																										{...field}
																									/>
																								</div>
																								{errors[`question_${rootIndex + 1}_${index}`] && (
																									<ErrorBox>
																										<ErrorOutlineIcon fontSize="small" />
																										<span>{errors[`question_${rootIndex + 1}_${index}`].message}</span>
																									</ErrorBox>
																								)}
																							</div>
																						</div>
																					)}
																				/>
																			</div>
																		))}

																		{question?.questionnairesJson?.uploadLimit && (
																			<Controller
																				name={`question_${rootIndex + 1}_${question?.questionnairesJson?.uploadMedia?.length}`}
																				control={control}
																				render={({ field }) => (
																					<div className="tw-flex-1">
																						<div className="tw-flex tw-flex-col tw-gap-1">
																							<div style={{ display: 'flex', pointerEvents: 'none' }}>
																								<DropAudioImageWoV
																									selectedFile={null}
																									setSelectedFile={(file) => null}
																									setFileError={(error) => null}
																									fileError={null}
																									setError={null}
																									error={errors[`question_${rootIndex + 1}_${question?.questionnairesJson?.uploadMedia?.length}`]}
																									key={`${rootIndex}-${question?.questionnairesJson?.uploadMedia?.length}`}
																									setKey={null}
																									register={field}
																									rootIndex={rootIndex}
																									index={question?.questionnairesJson?.uploadMedia?.length}
																									handleDeleteMedia={() => null}
																									setQuestionnaireData={() => null}
																									handleQuestionnareUpdate={() => null}
																									onChange={field.onChange}
																									{...field}
																								/>
																							</div>
																							<div>{`Accepted filetypes ${
																								question?.questionnairesJson?.allowedMediaType == 1
																									? '.png, .jpg'
																									: question?.questionnairesJson?.allowedMediaType == 2
																									? '.mp4'
																									: question?.questionnairesJson?.allowedMediaType == 3
																									? '.mp3'
																									: '.pdf'
																							}, (under 2MB)`}</div>
																							{errors[`question_${rootIndex + 1}_${question?.questionnairesJson?.uploadMedia?.length}`] && (
																								<ErrorBox>
																									<ErrorOutlineIcon fontSize="small" />
																									<span>{errors[`question_${rootIndex + 1}_${question?.questionnairesJson?.uploadMedia?.length}`].message}</span>
																								</ErrorBox>
																							)}
																						</div>
																					</div>
																				)}
																			/>
																		)}

																		{/* {!atLeastOneFileUploaded && (
																	<ErrorBox>
																		<ErrorOutlineIcon fontSize="small" />
																		<span>{'At least one file upload is required.'}</span>
																	</ErrorBox>
																)} */}
																	</div>
																	<>
																		{question?.questionnairesJson?.addCommentBox && (
																			<div className="tw-pt-2 tw-w-[350px]">
																				<span className="!tw-text-primaryText tw-py-2">Additional comment</span>
																				<TextField
																					variant="outlined"
																					disabled
																					fullWidth
																					multiline
																					rows={3}
																					value={question?.questionnairesJson?.comment}
																					placeholder="Please provide your comment here"
																					onChange={(e) => {
																						handleQuestionnareUpdate(e, rootIndex, null, null, 'comment');
																					}}
																				/>
																			</div>
																		)}
																	</>
																</div>
															</Container>
														</Paper>
													</div>
												);
											default:
												return;
										}
									})}
								</div>
							);
						})}
					</form>
				</div>
			) : (
				<>
					{props?.statusCode == 200 && (
						<div className="tw-flex tw-flex-col tw-gap-8">
							<QuizDetail data={props?.defaultValues} />
							<QuizResponse data={props?.defaultValues} />
						</div>
					)}
					{props?.statusCode == 422 && (
						<div className="tw-flex tw-flex-col tw-gap-8">
							<QuizExpire />
						</div>
					)}
				</>
			)}
		</>
	);
}

export const QuizDetail = (props) => {
	return (
		<div className="">
			{props.data?.childName ? (
				<>
				<h1 className="tw-font-semibold tw-text-[24px] tw-pb-2">{props.data.childName}</h1>
				<h1 className="tw-font-semibold tw-text-[18px] tw-pb-2">Parent: {props.data.parentName}</h1>
				</>
			):(
				<h1 className="tw-font-bold tw-text-[24px] tw-pb-2">{props.data.parentName}</h1>
			)}
			
			
			<p className="tw-pb-2">
				<span className="tw-text-xs tw-text-grey">{props.data.programUnitName}</span>
				{props.data.programContentName && <span className="tw-text-xs tw-text-grey">{` > ${props.data.programContentName}`}</span>}
			</p>
			<p className="tw-text-sm tw-text-primaryText tw-pb-2">
				{props.data.serialNumber}: {props.data.title}
			</p>
		</div>
	);
};
