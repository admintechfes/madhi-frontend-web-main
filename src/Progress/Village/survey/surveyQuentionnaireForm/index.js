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
	Typography,
} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LoadingButton } from '@mui/lab';
// import { ErrorBox } from '../../components/Errorbox';
// import QuizResponse from '../../components/UnitContent/QuizResponse';
// import QuizExpire from '../../components/UnitContent/QuizExpire';
import { ErrorBox } from '../../../../components/Errorbox';
import { submitSurveyQuestionnaire } from '../duck/network';
import { BasicDatePicker } from '../../../../components/DatePicker';
import moment from 'moment';
import { DropzoneUploadDocument } from '../../../../components/Dropzone';
// import { submitUnitContentFormData } from '../duck/network';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { DropAudioImageWoV } from '../DropAudioImageWoV';
import { comment } from 'postcss';

export default function SurveyQuentionnaireForm(props) {

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const qParams = useParams();
	const location = useLocation();
	const { progressName, name, parentId, villageAreaId, conductedById, programUnitContentId, childId, surveyNumber, surveyUnit } = location.state || {};
	let [searchParams, setSearchParams] = useSearchParams();

	const program = useSelector((state) => state.program.programDetails);
	const loading = useSelector((state) => state.loader.duplicateLoader);

	const [commentText, setCommentText] = useState('');
	const [savePermission, setSavePermission] = useState(false);
	const [programStatus, setProgramStatus] = useState('');
	const [questionnaireData, setQuestionnaireData] = useState(props?.defaultValues ?? []);
	const [openSuccessResponse, setOpenSuccessResponse] = useState(false);
	const [multitextBox, setMultiTextBox] = useState([]);
	const [fileErrors, setFileErrors] = useState([]);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [sevenTypeData, setSevenTypeData] = useState([]);
	const [key, setKey] = useState(0); // Key to reset input value
	const [error, setErr] = useState('');
	const unitId = location?.state?.unit?.id;
	const programDetails = location?.state?.programDetails;
	let params = { programUnitContentId: searchParams.get('programUnitContentId'), parentId: searchParams.get('parentId') };
	const surveyPreviewData = useSelector((state) => state.survey.surveyPreview);



	const {
		control,
		handleSubmit,
		getValues,
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: {
			sections: props?.defaultValues,
		},
	});
	const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
		control,
		name: 'sections',
	});



	useEffect(() => {
		let arr = [];


		props?.defaultValues?.map((item, sectionIndex) => {

			item?.questionnaire?.map((question, rootIndex) => {

				if (question?.questionnairesJson?.meta?.answerType == 2) {
					question?.questionnairesJson?.options?.map((option, index) => {
						if (option?.isSelected) {
							arr.push(`${sectionIndex}_${rootIndex}_${index}`);
						}
					});

					setValue(`question_${sectionIndex + 1}_${rootIndex + 1}`, arr);
				}
				if (question?.questionnairesJson?.meta?.answerType == 1) {
					question?.questionnairesJson?.options?.map((option) => {
						if (option?.isSelected) {
							arr.push(option?.label);
						}
					});
					setValue(`question_${sectionIndex + 1}_${rootIndex + 1}`, arr);
				}
				if (question?.questionnairesJson?.meta?.answerType == 3 || question?.questionnairesJson?.meta?.answerType == 4) {
					setValue(`question_${sectionIndex + 1}_${rootIndex + 1}`, question?.questionnairesJson?.value);
				}

				if (question?.questionnairesJson?.meta?.answerType == 6) {
					question?.questionnairesJson?.textboxes?.map((option, index) => {
						setValue(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`, option?.value);
					});
				}

				if (question?.questionnairesJson?.meta?.answerType == 5) {
					question?.questionnairesJson?.form?.map((data, index) => {
						data?.children?.map((d, childIndex) => {
							setValue(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`, d?.value);
						});
					});
				}

				if (question?.questionnairesJson?.meta?.answerType == 7) {
					question?.questionnairesJson?.uploadMedia?.map((option, index) => {
						setValue(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`, option?.temporaryMediaUrl);
						let newData = [];
						newData.push(option);



						setSelectedFiles((prevSelectedFiles) => {
							// const newSelectedFiles = [...prevSelectedFiles];

							// if (!newSelectedFiles[rootIndex]) {
							// 	newSelectedFiles[rootIndex] = [];
							// } else {
							// 	newSelectedFiles[rootIndex] = [...newSelectedFiles[rootIndex]];
							// }


							const newSelectedFiles = [...prevSelectedFiles];
							newSelectedFiles[sectionIndex] = newSelectedFiles[sectionIndex] || [];
							newSelectedFiles[sectionIndex][rootIndex] = newSelectedFiles[sectionIndex][rootIndex] || [];
							newSelectedFiles[sectionIndex][rootIndex][index] = option;

							// newSelectedFiles[rootIndex][index] = option;
							return newSelectedFiles;
						});
					});
					// setSevenTypeData(()=>[...question?.questionnairesJson?.uploadMedia])
					// setSevenTypeData()
				}
			})

		});
	}, []);


	const handleQuestionnareUpdate = (e, index, optionIndex, sectionIndex, childIndex, comment) => {
		setQuestionnaireData((prevState) => {
			let updateQuestionnaire = JSON.parse(JSON.stringify(prevState));
			let optionType = updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.meta.answerType;
			if (optionType == '3' || optionType == '4') {
				if (comment !== 'comment') {
					updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.value = e.target.value;
				} else {
					updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.comment = e.target.value;
				}

			}
			if (optionType == '6') {

				if (comment !== 'comment') {

					if (optionIndex !== 3) {
						// updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.textboxes[optionIndex].value = e.target.value;
						// Assume that sectionIndex, index, optionIndex, and e are defined

						let questionnaire = updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.textboxes[optionIndex];
						// Check if 'value' key exists
						if (!('value' in questionnaire)) {
							// Add 'value' key if it doesn't exist
							questionnaire.value = e?.target?.value || e;;
						} else {
							// Update the value if the key already exists
							questionnaire.value = e?.target?.value || e;;
						}

					} else {


						updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.textboxes[optionIndex].value = e;
					}
				} else {

					updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.comment = e.target.value;
				}
			}


			if (optionType == '1') {
				if (comment !== 'comment') {
					let options = updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.options;
					if (comment === "other") {
						options.forEach((option, index) => {

							if (option.label === "Custom Response") {
								option.value = e.target.value
							}
						});
					} else {
						options.forEach((option, index) => {
							if (index == optionIndex) {
								option.isSelected = true;
							} else {
								option.isSelected = false;
							}
						});
					}

				} else {
					updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.comment = e.target.value;
				}

			}
			if (optionType == '2') {
				if (comment !== 'comment') {
					let options = updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.options;
					if (comment === "other") {
						options.forEach((option, index) => {

							if (option.label === "Custom Response") {
								option.value = e.target.value
							}
						});
					} else {
						const lastElements = e?.map((str) => str.split('_').pop());
						options.forEach((option, index) => {
							if (lastElements.includes(index.toString())) {
								option.isSelected = true;
							} else {
								option.isSelected = false;
							}
						});
					}

				} else {
					updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.comment = e.target.value;
				}

			}

			if (optionType == '5') {

				if (comment !== 'comment') {
					if (optionIndex !== 4) {
						updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.form[optionIndex].children[childIndex].value = e?.target?.value || e;
					} else {
						updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.form[optionIndex].children[childIndex].value = e?.target?.value || e;
					}
				} else {
					updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.comment = e.target.value;
				}
			}
			if (optionType == '7') {
				if (comment !== 'comment') {
					let files = e[sectionIndex][index].filter((item) => item)
					updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.uploadMedia = files;
				} else {

					updateQuestionnaire[sectionIndex].questionnaire[index].questionnairesJson.comment = e.target.value;
				}
			}
			return updateQuestionnaire;
		});
	};

	const handleFormSubmit = async (formValues) => {
		let submittedValues = { programUnitContentId: searchParams.get('programUnitContentId'), parentId: searchParams.get('parentId'), villageAreaId, submittedForm: questionnaireData, managedById: conductedById };
		dispatch(submitSurveyQuestionnaire(submittedValues)).then((resp) => {
			if (resp?.statusCode == 200) {
				navigate(-1);
			}
		});

	};


	const handleFileChange = (rootIndex, file, index, sectionIndex) => {
		setSelectedFiles((prevSelectedFiles) => {

			let newSelectedFiles = [...prevSelectedFiles];
			newSelectedFiles[sectionIndex] = newSelectedFiles[sectionIndex] || [];
			newSelectedFiles[sectionIndex][rootIndex] = newSelectedFiles[sectionIndex][rootIndex] || [];
			newSelectedFiles[sectionIndex][rootIndex][index] = file;

			handleQuestionnareUpdate(newSelectedFiles, rootIndex, index, sectionIndex);
			return newSelectedFiles;
		});
	};

	const handleFileError = (rootIndex, error, index, sectionIndex) => {
		setFileErrors((prevSelectedErrors) => {
			const newSelectedErrors = [...prevSelectedErrors];
			newSelectedErrors[sectionIndex] = newSelectedErrors[sectionIndex] || [];
			newSelectedErrors[sectionIndex][rootIndex] = newSelectedErrors[sectionIndex][rootIndex] || [];
			newSelectedErrors[sectionIndex][rootIndex][index] = error;
			return newSelectedErrors;
		});
	};

	const renderOptions = (answerFormat, answerType, option) => {
		switch (answerFormat) {
			case '1':
				return (
					<div className="tw-pt-3">
						{option?.label.toLowerCase() === "custom response" ? (
							<p>Other </p>
						) : (
							<div>{option?.label}</div>
						)}
					</div>
				);

			case '2':
				return <div className="tw-pt-3">{option?.temporaryMediaUrl && <img src={option?.temporaryMediaUrl} width={80} height={80} alt="option image" className="tw-py-1" />}</div>;
			case '3':
				return <div className="">{option?.temporaryMediaUrl && <audio src={option?.mediaUrl} controls className="tw-py-2" />}</div>;
			case '4':
				return (
					<div className="tw">
						{option?.label && <div className="tw-py-1">{option?.label}</div>}
						{option?.temporaryMediaUrl && <img src={option?.temporaryMediaUrl} width={80} height={80} alt="option image" className="tw-pb-3" />}
					</div>
				);
			case '5':
				return (
					<div className="tw">
						{option?.label && <div className="tw-py-1 tw-pl-2">{option?.label}</div>}
						{option?.temporaryMediaUrl && <audio src={option?.mediaUrl} controls className="tw-pb-3" />}
					</div>
				);
			default:
				return null;
		}
	};



	function isRequired(question) {
		if (question.conditionalLogic) {

			return false
		} else {
			return question?.canSkip ? false : true
		}







		// if (Object.keys(question?.conditionalLogic).length === 0) {
		// 	return question?.canSkip ? false : true
		// } else {
		// 	if (question?.canSkip) {
		// 		return true
		// 	} else {
		// 		switch(question?.questionnairesJson?.meta?.answerType){
		// 			case "1":
		// 			case "2":
		// 				return  question?.questionnairesJson?.options?.find(option=>option?.isSelected)?true:false

		// 		}



		// }


		// }




	}


	return (
		<>
			{props?.type == 'attempt' ? (
				<div>
					<form onSubmit={handleSubmit(handleFormSubmit)}>
						<div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
							<h1 className="tw-font-bold tw-text-[24px]">
								<Button variant="text" onClick={() => navigate(-1)} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[16px]" disableRipple startIcon={<KeyboardBackspaceIcon />}>
									Back
								</Button>
								<h1 className="tw-px-2 tw-mt-[-4px]">{props?.type == 'preview' ? `${props?.questionnaireType} Preview` : ''}</h1>
							</h1>
							{props?.type !== 'preview' && (
								<div className="md:tw-flex tw-gap-x-5 tw-hidden">
									<div className="tw-flex tw-gap-x-5">
										<LoadingButton loading={loading} type="button" variant="contained" size="small" className={`tw-h-[35px] !tw-bg-white !tw-text-primary`} onClick={() => navigate(-1)}>
											cancel
										</LoadingButton>
									</div>
									<div className="tw-flex tw-gap-x-5">
										<LoadingButton loading={loading} type="submit" variant="contained" size="small" className={`tw-h-[35px]`}>
											Save
										</LoadingButton>
									</div>
								</div>
							)}
						</div>
						<div>
							<Typography variant="h2" className="!tw-font-semibold !tw-text-secondaryText">
								{props?.parentName}
							</Typography>
							<div className="tw-text-grey tw-pt-5 tw-pb-2 tw-text-[20px]"> {surveyPreviewData?.surveyUnit}</div>
							<div className="tw-text-grey tw-text-[18px]">
								{surveyNumber} : {surveyPreviewData?.surveyTitle}
							</div>
						</div>
						{questionnaireData.map((section, sectionIndex) => {
							return <div>
								{(section?.title || section?.description) && (
									<div className="tw-pt-4 tw-px-2">
										{section?.title && (
											<p className="tw-text-black tw-pb-1 tw-text-[18px]">
												<span className="tw-text-grey ">Section title: </span>
												{section?.title}
											</p>
										)}
										{section?.description && (
											<p className="tw-text-black tw-text-[18px]">
												<span className="tw-text-grey">Section description: </span>
												{section?.description}
											</p>
										)}
									</div>
								)}
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
																	rules={{ required: isRequired(question) ? 'This field is mandatory' : false, pattern: { value: /.{2,}/, message: 'Minimum 2 character are required' } }}
																	render={({ field }) => (
																		<div className="tw-flex-1">
																			<div className="tw-flex tw-flex-col tw-gap-2 tw-pb-3">
																				<div className="tw-flex tw-justify-between ">
																					<div className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-4">{`Q.${rootIndex + 1}  ${question?.title}`}</div>
																					{isRequired(question) && <div>
																						(This field is mandatory)
																					</div>}
																				</div>
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
																						{...field}
																						disabled={props?.type == 'preview' ? true : false}
																						value={`${sectionIndex}_${rootIndex}_${optionIndex}`}
																						control={
																							<Radio
																								onClick={(e) => {
																									handleQuestionnareUpdate(e, rootIndex, optionIndex, sectionIndex);
																									setValue(`question_${sectionIndex + 1}_${rootIndex + 1}`, `${sectionIndex}_${rootIndex}_${optionIndex}`, { shouldValidate: true });
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
																			<div className='tw-w-[520px]'>
																				{question?.questionnairesJson?.options.find((option) => option?.label?.toLowerCase() === "custom response") && question?.questionnairesJson?.options.find((option) => option?.label?.toLowerCase() === "custom response")?.isSelected && (
																					<div className="tw-pt-4">
																						<TextField
																							variant="outlined"
																							fullWidth
																							multiline
																							rows={4}
																							value={question?.questionnairesJson?.options.find((option) => option?.label?.toLowerCase() === "custom response") ? question?.questionnairesJson?.options.find((option) => option?.label?.toLowerCase() === "custom response")?.value : ""}
																							placeholder="Please provide your response here"
																							onChange={(e) => {

																								handleQuestionnareUpdate(e, rootIndex, null, sectionIndex, null, 'other');
																							}}
																						/>
																					</div>
																				)}
																			</div>
																			<div className='tw-w-[520px]'>
																				{question?.questionnairesJson?.addCommentBox && (
																					<div className="tw-pt-4">
																						<span className="!tw-text-primaryText tw-p-2">Additional comment</span>
																						<TextField
																							variant="outlined"
																							fullWidth
																							multiline
																							rows={4}
																							value={question?.questionnairesJson?.comment}
																							placeholder="Please provide your comment here"
																							onChange={(e) => {
																								handleQuestionnareUpdate(e, rootIndex, null, sectionIndex, null, 'comment');
																							}}
																						/>
																					</div>
																				)}
																			</div>
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
															<div className="tw-py-6  tw-flex tw-flex-col tw-gap-2">
																{/* <span className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-4">{`Q.${rootIndex + 1} ${question?.title}`}</span> */}

																<Controller
																	name={`question_${sectionIndex + 1}_${rootIndex + 1}`}
																	control={control}
																	rules={{
																		validate: {
																			atLeastOneSelected: (value) => {
																				if (question?.canSkip && !value) return null;
																				const checkedOptions = Array.isArray(value) ? value.filter((option) => option !== false) : [];
																				let minLimit = question?.questionnairesJson?.min || 1
																				return checkedOptions.length > minLimit || `At least ${minLimit} option must be selected`;
																			},
																			atMostSelected: (value) => {
																				if (question?.canSkip && !value) return null;
																				const checkedOptions = Array.isArray(value) ? value.filter(item=>item.includes(`${sectionIndex}_${rootIndex}`)) : [];
																				let maxLimit = question?.questionnairesJson?.max
																				if (!maxLimit) return null
																				return checkedOptions.length <= maxLimit || `Maximum ${maxLimit} options can be selected`;
																			},
																		},
																	}}
																	render={({ field }) => (
																		<div className="tw-flex-1">
																			<div className="tw-flex tw-flex-col tw-gap-2 tw-pb-3">
																				<div className="tw-flex tw-justify-between ">
																					<div className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-4">{`Q.${rootIndex + 1}  ${question?.title}`}</div>
																					{isRequired(question) && <div>
																						(This field is mandatory)
																					</div>}
																				</div>																				{question?.description && (
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
																			<div aria-labelledby="demo-checkbox-group-label" className="checkbox-group  tw-flex !tw-flex-col tw-w-[520px]">
																				{question?.questionnairesJson?.options?.map((option, optionIndex) => (
																					<FormControlLabel

																						key={optionIndex}
																						control={
																							<Checkbox
																								{...field}
																								value={`${sectionIndex}_${rootIndex}_${optionIndex}`}
																								checked={(field.value ?? []).includes(`${sectionIndex}_${rootIndex}_${optionIndex}`)}
																								onChange={(e) => {
																									const newValue = Array.isArray(field.value) ? [...field.value].filter(item=>item.includes(`${sectionIndex}_${rootIndex}`)) : [];
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
																								disabled={props?.type === 'preview'}
																							/>}
																						label={renderOptions(question.questionnairesJson.meta.answerFormat, question.questionnairesJson.meta.answerType, option)}

																					/>
																				))}
																			</div>

																			{errors[`question_${sectionIndex + 1}_${rootIndex + 1}`] && (
																				<ErrorBox>
																					<ErrorOutlineIcon fontSize="small" />
																					<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}`].message}</span>
																				</ErrorBox>
																			)}

																			<div className='tw-w-[520px]'>
																				{question?.questionnairesJson?.options.find((option) => option?.label?.toLowerCase() === "custom response") && question?.questionnairesJson?.options.find((option) => option?.label?.toLowerCase() === "custom response")?.isSelected && (
																					<div className="tw-pt-4">
																						<TextField
																							variant="outlined"
																							fullWidth
																							multiline
																							rows={4}
																							value={question?.questionnairesJson?.options.find((option) => option?.label?.toLowerCase() === "custom response") ? question?.questionnairesJson?.options.find((option) => option?.label?.toLowerCase() === "custom response")?.value : ""}
																							placeholder="Please provide your response here"
																							onChange={(e) => {

																								handleQuestionnareUpdate(e, rootIndex, null, sectionIndex, null, 'other');
																							}}
																						/>
																					</div>
																				)}
																			</div>

																			<div className='tw-w-[520px]'>
																				{question?.questionnairesJson?.addCommentBox && (
																					<div className="tw-pt-4">
																						<span className="!tw-text-primaryText tw-p-2">Additional comment</span>
																						<TextField
																							variant="outlined"
																							fullWidth
																							multiline
																							rows={4}
																							value={question?.questionnairesJson?.comment}
																							placeholder="Please provide your comment here"
																							onChange={(e) => {
																								handleQuestionnareUpdate(e, rootIndex, null, sectionIndex, null, 'comment');
																							}}
																						/>
																					</div>
																				)}
																			</div>
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
															<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-py-6 ">
																<Controller
																	name={`question_${sectionIndex + 1}_${rootIndex + 1}`}
																	disabled={props?.type == 'preview' ? true : false}
																	control={control}
																	rules={{ required: isRequired(question) ? 'This field is mandatory' : false, pattern: { value: /.{2,}/, message: 'Minimum 2 character are required' } }}
																	render={({ field }) => (
																		<div className="tw-flex-1">
																			<div className="tw-flex tw-flex-col tw-gap-2">
																				<div className="tw-flex tw-justify-between ">
																					<div className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-4">{`Q.${rootIndex + 1}  ${question?.title}`}</div>
																					{isRequired(question) && <div>
																						(This field is mandatory)
																					</div>}
																				</div>																				<TextField
																					variant="outlined"
																					// label="Answer"
																					{...field}
																					value={questionnaireData?.[sectionIndex].questionnaire[rootIndex].questionnairesJson.value}
																					onChange={(e) => {
																						if (e.target.value.length >= 200) {
																							e.preventDefault();
																						}
																						if (e.target.value.length <= 200) {
																							handleQuestionnareUpdate(e, rootIndex, null, sectionIndex);
																							setValue(`question_${sectionIndex + 1}_${rootIndex + 1}`, e.target.value);
																						}
																					}}
																					disabled={props?.type == 'preview' ? true : false}
																					className=" tw-w-[520px]"
																					size="small"
																					placeholder="Type Answer"
																				/>
																				<div className="tw-text-end tw-text-xs tw-text-grey tw-max-w-[520px]">Max 200 characters allowed</div>
																			</div>
																			{/* {question?.questionnairesJson?.addCommentBox && (
																				<div className="tw-pt-4">
																					<span className="!tw-text-primaryText tw-p-2">Additional comment</span>
																					<TextField
																						variant="outlined"
																						fullWidth
																						multiline
																						rows={4}
																						value={question?.questionnairesJson?.comment}
																						placeholder="Please provide your comment here"
																						onChange={(e) => {
																							handleQuestionnareUpdate(e, rootIndex, null, null, 'comment');
																						}}
																					/>
																				</div>
																			)} */}

																			{errors[`question_${sectionIndex + 1}_${rootIndex + 1}`] && (
																				<ErrorBox>
																					<ErrorOutlineIcon fontSize="small" />
																					<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}`].message}</span>
																				</ErrorBox>
																			)}
																			<div className='tw-w-[520px]'>
																				{question?.questionnairesJson?.addCommentBox && (
																					<div className="tw-pt-4">
																						<span className="!tw-text-primaryText tw-p-2">Additional comment</span>
																						<TextField
																							variant="outlined"
																							fullWidth
																							multiline
																							rows={4}
																							value={question?.questionnairesJson?.comment}
																							placeholder="Please provide your comment here"
																							onChange={(e) => {
																								handleQuestionnareUpdate(e, rootIndex, null, sectionIndex, null, 'comment');
																							}}
																						/>
																					</div>
																				)}
																			</div>
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
															<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-py-6">
																<Controller
																	name={`question_${sectionIndex + 1}_${rootIndex + 1}`}
																	control={control}
																	rules={{ required: isRequired(question) ? 'This field is mandatory' : false, pattern: { value: /.{2,}/, message: 'Minimum 2 character are required' } }}
																	render={({ field }) => (
																		<div className="tw-flex-1">
																			<div className="tw-flex tw-flex-col tw-gap-2">
																				<div className="tw-flex tw-justify-between ">
																					<div className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-4">{`Q.${rootIndex + 1}  ${question?.title}`}</div>
																					{isRequired(question) && <div>
																						(This field is mandatory)
																					</div>}
																				</div>																				<div style={{ display: 'flex' }}>
																					<textarea
																						{...field}
																						value={questionnaireData?.[sectionIndex].questionnaire[rootIndex].questionnairesJson.value}
																						onChange={(e) => {
																							if (e.target.value.length >= 1000) {
																								e.preventDefault();
																							}
																							if (e.target.value.length <= 1000) {
																								handleQuestionnareUpdate(e, rootIndex, null, sectionIndex);
																								setValue(`question_${sectionIndex + 1}_${rootIndex + 1}`, e.target.value);
																							}
																						}}
																						// disabled={props?.type == 'preview' ? true : false}
																						minRows={6}
																						size="small"
																						rows="4"
																						placeholder="Type Answer"
																						className="tw-max-w-[520px] tw-w-full tw-px-3 tw-py-2 tw-rounded tw-rounded-br-none tw-border-[1px] tw-border-solid tw-border-[#0000003b] hover:tw-border-black focus:tw-border-primary focus:tw-border-2 tw-resize  tw-bg-white  tw-text-slate-900  focus-visible:tw-outline-0 tw-box-border"
																						aria-label="empty textarea"
																					/>
																				</div>
																				<div className="tw-text-end tw-text-xs tw-text-grey tw-max-w-[520px]">Max 1000 characters allowed</div>
																			</div>
																			{/* {question?.questionnairesJson?.addCommentBox && (
																				<div className="tw-pt-4 tw-w-[520px]">
																					<span className="!tw-text-primaryText tw-p-2">Additional comment</span>
																					<TextField
																						variant="outlined"
																						fullWidth
																						multiline
																						rows={4}
																						value={question?.questionnairesJson?.comment}
																						placeholder="Please provide your comment here"
																						onChange={(e) => {
																							handleQuestionnareUpdate(e, rootIndex, null, null, 'comment');
																						}}
																					/>
																				</div>
																			)} */}

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
																	<div className="tw-py-6  tw-flex tw-flex-col tw-gap-2 tw-w-full">
																		<div className="tw-flex tw-flex-col tw-gap-2 tw-pb-3">
																			<div className="tw-flex tw-justify-between ">
																				<div className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-4">{`Q.${rootIndex + 1}  ${question?.title}`}</div>
																				{isRequired(question) && <div>
																					(This field is mandatory)
																				</div>}
																			</div>
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
																					{!data?.canSkip && <span className="tw-text-red-500 ">*</span>}
																					{data?.label}
																				</div>

																				{data.children?.map((d, childIndex) => {
																					switch (d.inputType) {
																						case '1':
																							return (
																								<div className="tw-flex tw-gap-x-12 tw-w-[520px] tw-flex-col tw-py-2">
																									<div className='tw-pb-4'>label:{d.label}</div>
																									<Controller
																										name={`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`}
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
																														id="outlined-basic"
																														label="Answere type here"
																														value={d.value}
																														onChange={(e) => {
																															if (e.target.value.length >= 200) {
																																e.preventDefault();
																															}
																															if (e.target.value.length <= 200) {
																																handleQuestionnareUpdate(e, rootIndex, index, sectionIndex, childIndex);

																																// handleQuestionnareUpdate(e, rootIndex, index, childIndex);
																																setValue(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`, e.target.value);
																															}
																														}}
																														// disabled={props?.type == 'preview' ? true : false}
																														className="tw-w-[520px]"
																														size="small"
																														placeholder="Type Answer"
																													/>
																													<div className="tw-text-end tw-text-xs tw-text-grey tw-max-w-[520px]">Note: Max 200 characters allowed</div>
																												</>
																												{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`] && (
																													<ErrorBox>
																														<ErrorOutlineIcon fontSize="small" />
																														<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`].message}</span>
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
																									<div className="tw-flex tw-gap-x-12 tw-w-[520px] tw-flex-col  tw-py-2">
																										<div className='tw-pb-4'>label:{d.label}</div>
																										<Controller
																											name={`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`}
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
																															label={"Phone Number"}
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
																																	handleQuestionnareUpdate(e, rootIndex, index, sectionIndex, childIndex);
																																	setValue(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`, e.target.value);
																																}
																															}}
																															disabled={props?.type == 'preview' ? true : false}
																															className="tw-w-[520px]"
																															size="small"
																															placeholder="Type Answer"
																														/>
																													</>
																													{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`] && (
																														<ErrorBox>
																															<ErrorOutlineIcon fontSize="small" />
																															<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`].message}</span>
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
																									<div className="tw-flex tw-gap-x-12 tw-w-[520px] tw-flex-col  tw-py-2">
																										<div className='tw-pb-4'>label:{d.label}</div>
																										<Controller
																											name={`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`}
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
																															label={"Email Id"}
																															value={d.value}
																															onChange={(e) => {
																																if (e.target.value.length >= 200) {
																																	e.preventDefault();
																																}
																																if (e.target.value.length <= 200) {
																																	handleQuestionnareUpdate(e, rootIndex, index, sectionIndex, childIndex);
																																	setValue(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`, e.target.value);
																																}
																															}}
																															disabled={props?.type == 'preview' ? true : false}
																															className="tw-w-[520px] "
																															size="small"
																															placeholder="Type Answer"
																														/>
																														{/* <div className="tw-text-end tw-text-xs tw-text-grey tw-max-w-[520px]">Email Id is allowed</div> */}
																													</>
																													{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`] && (
																														<ErrorBox>
																															<ErrorOutlineIcon fontSize="small" />
																															<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`].message}</span>
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
																									<div className="tw-flex tw-gap-x-12 tw-w-[520px] tw-flex-col tw-py-2">
																										<div className='tw-pb-4'>{`Q)${d.label}`}</div>
																										<Controller
																											name={`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`}
																											disabled={props?.type === 'preview'}
																											control={control}
																											rules={{
																												required: !data?.canSkip ? 'This field is mandatory' : false,
																											}}
																											render={({ field }) => (
																												<div className="tw-w-[520px]">
																													<BasicDatePicker
																														{...field}
																														disabled={props?.type === 'preview'}
																														inputFormat="DD/MM/YYYY"
																														value={moment(d.value, 'DD/MM/YYYY')} // Ensure the value is a moment object
																														label="Date"
																														onChange={(date) => {
																															if (moment(date).isValid()) {
																																// Format the valid date
																																const formattedDate = moment(date).format('DD/MM/YYYY');

																																// Call the update functions with the formatted date
																																handleQuestionnareUpdate(formattedDate, rootIndex, index, sectionIndex, childIndex);
																																setValue(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`, formattedDate);
																																clearErrors(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`);

																															} else {
																																console.error("Invalid date selected");
																																// Optionally, manually set an error for invalid date
																																setError(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`, {
																																	type: 'manual',
																																	message: 'Please select a date using the calendar.',
																																});
																															}
																														}}
																													/>
																													{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`] && (
																														<ErrorBox>
																															<ErrorOutlineIcon fontSize="small" />
																															<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`].message}</span>
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
																									<div className="tw-flex tw-gap-x-12 tw-w-[520px] tw-flex-col  tw-py-2">
																										<div className='tw-pb-4'>label: {d.label}</div>
																										<Controller
																											name={`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`}
																											disabled={props?.type === 'preview'}
																											control={control}
																											rules={{
																												required: !data?.canSkip ? 'This field is mandatory' : false,
																											}}
																											render={({ field }) => (
																												<div className="tw-flex-1">
																													<>
																														<FormControl fullWidth size="small" className="tw-w-[520px]">
																															<InputLabel id={`select-label-${rootIndex}-${index}-${childIndex}`}>Select an option</InputLabel>
																															<Select
																																labelId={`select-label-${rootIndex}-${index}-${childIndex}`}
																																variant="outlined"
																																{...field}
																																value={d.value || ''}
																																onChange={(e) => {
																																	handleQuestionnareUpdate(e, rootIndex, index, sectionIndex, childIndex);
																																	// handleQuestionnareUpdate(e, rootIndex, index, childIndex);
																																	setValue(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`, e.target.value);
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
																														{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`] && (
																															<ErrorBox>
																																<ErrorOutlineIcon fontSize="small" />
																																<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}_${childIndex}`].message}</span>
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
																		))}
																		<div className='tw-w-[520px]'>
																			{question?.questionnairesJson?.addCommentBox && (
																				<div className="tw-pt-4">
																					<span className="!tw-text-primaryText tw-p-2">Additional comment</span>
																					<TextField
																						variant="outlined"
																						fullWidth
																						multiline
																						rows={4}
																						value={question?.questionnairesJson?.comment}
																						placeholder="Please provide your comment here"
																						onChange={(e) => {
																							handleQuestionnareUpdate(e, rootIndex, null, sectionIndex, null, 'comment');
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
																	<div className="tw-flex tw-justify-between ">
																		<div className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-4">{`Q.${rootIndex + 1}  ${question?.title}`}</div>
																		{isRequired(question) && <div>
																			(This field is mandatory)
																		</div>}
																	</div>
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
																						<div className="tw-flex tw-gap-x-12 tw-w-[520px]">
																							<Controller
																								name={`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`}
																								disabled={props?.type == 'preview' ? true : false}
																								control={control}
																								rules={{ required: isRequired(question) ? 'This field is mandatory' : false, pattern: { value: /.{1,}/, message: 'Minimum 2 character are required' } }}
																								render={({ field }) => (
																									<div className="tw-flex-1">
																										<>
																											<TextField
																												variant="outlined"
																												id="outlined-basic"
																												label="Answere"
																												{...field}
																												value={d.value}
																												onChange={(e) => {
																													if (e.target.value.length >= 200) {
																														e.preventDefault();
																													}
																													if (e.target.value.length <= 200) {

																														handleQuestionnareUpdate(e, rootIndex, index, sectionIndex);

																														setValue(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`, e.target.value);
																													}
																												}}
																												disabled={props?.type == 'preview' ? true : false}
																												className="tw-max-w-[520px] tw-w-full"
																												size="small"
																												placeholder="Type Answer"
																											/>
																											<div className="tw-text-end tw-text-xs tw-text-grey tw-max-w-[520px]">Max 200 characters allowed</div>
																										</>
																										{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`] && (
																											<ErrorBox>
																												<ErrorOutlineIcon fontSize="small" />
																												<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`].message}</span>
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
																						<div className="tw-flex tw-gap-x-12 tw-w-[520px]">
																							<Controller
																								name={`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`}
																								disabled={props?.type == 'preview' ? true : false}
																								control={control}
																								rules={{
																									required: isRequired(question) ? 'This field is mandatory' : false,
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
																												id="outlined-basic"
																												label="Phone Number"
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

																														handleQuestionnareUpdate(e, rootIndex, index, sectionIndex);
																														setValue(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`, e.target.value);
																													}
																												}}
																												disabled={props?.type == 'preview' ? true : false}
																												className="tw-max-w-[520px] tw-w-full"
																												size="small"
																												placeholder="Type Answer"
																											/>
																											{/* <div className="tw-text-end tw-text-xs tw-text-grey tw-max-w-[520px]">Phone Number is allowed</div> */}
																										</>
																										{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`] && (
																											<ErrorBox>
																												<ErrorOutlineIcon fontSize="small" />
																												<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`].message}</span>
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
																						<div className="tw-flex tw-gap-x-12  tw-w-[520px]">
																							<Controller
																								name={`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`}
																								disabled={props?.type == 'preview' ? true : false}
																								control={control}
																								rules={{
																									required: isRequired(question) ? 'This field is mandatory' : false,
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
																												id="outlined-basic"
																												label="Email"
																												{...field}
																												value={d.value}
																												onChange={(e) => {
																													if (e.target.value.length >= 200) {
																														e.preventDefault();
																													}
																													if (e.target.value.length <= 200) {

																														handleQuestionnareUpdate(e, rootIndex, index, sectionIndex);
																														setValue(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`, e.target.value);
																													}
																												}}
																												disabled={props?.type == 'preview' ? true : false}
																												className="tw-max-w-[520px] tw-w-full"
																												size="small"
																												placeholder="Type Answer"
																											/>
																											{/* <div className="tw-text-end tw-text-xs tw-text-grey tw-max-w-[520px]">Email Id is allowed</div> */}
																										</>
																										{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`] && (
																											<ErrorBox>
																												<ErrorOutlineIcon fontSize="small" />
																												<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`].message}</span>
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
																						<div className="tw-flex tw-gap-x-12 tw-w-[520px]">
																							<Controller
																								name={`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`}
																								disabled={props?.type === 'preview'}
																								control={control}
																								rules={{
																									required: isRequired(question) ? 'This field is mandatory' : false,
																								}}
																								render={({ field }) => (
																									<div className="tw-w-[520px]">
																										<BasicDatePicker
																											{...field}
																											disabled={props?.type === 'preview'}
																											inputFormat="DD/MM/YYYY"
																											value={moment(field.value, 'DD/MM/YYYY')} // Ensure the value is a moment object
																											onChange={(date) => {
																												if (moment(date).isValid()) {
																													// Format the valid date
																													const formattedDate = moment(date).format('DD/MM/YYYY');

																													// Call the update functions with the formatted date
																													handleQuestionnareUpdate(formattedDate, rootIndex, index, sectionIndex);
																													setValue(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`, formattedDate);
																													clearErrors(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`);

																												} else {
																													console.error("Invalid date selected");
																													// Optionally, manually set an error for invalid date
																													setError(`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`, {
																														type: 'manual',
																														message: 'Please select a date using the calendar.',
																													});
																												}
																											}}
																											label="Date"
																										/>
																										{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`] && (
																											<ErrorBox>
																												<ErrorOutlineIcon fontSize="small" />
																												<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`].message}</span>
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
																			<div className="tw-pt-4  tw-w-[520px]">
																				<span className="!tw-text-primaryText tw-p-2">Additional comment</span>
																				<TextField
																					variant="outlined"
																					id="outlined-basic"
																					label="Comment"
																					fullWidth
																					multiline
																					rows={4}
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
											const atLeastOneFileUploaded = question?.questionnairesJson?.uploadMedia?.length > 0;
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
																	{isRequired(question) && <div>
																		(This field is mandatory)
																	</div>}
																</div>
																<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-col">
																	{question?.questionnairesJson?.uploadMedia?.map((media, index) => (
																		<div key={`${rootIndex}-${index}`}>

																			<Controller
																				name={`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`}
																				control={control}
																				render={({ field }) => (
																					<div className="tw-flex-1">
																						<div className="tw-flex tw-flex-col tw-gap-1">
																							<div style={{ display: 'flex' }}>
																								<DropAudioImageWoV
																									selectedFile={selectedFiles[sectionIndex]?.[rootIndex]?.[index]}
																									setSelectedFile={(file) => handleFileChange(rootIndex, file, index, sectionIndex)}
																									setFileError={(error) => handleFileError(rootIndex, error, index, sectionIndex)}
																									fileError={fileErrors[sectionIndex]?.[rootIndex]?.[index]}
																									setError={setErr}
																									error={errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`]}
																									key={`${rootIndex}-${index}`}
																									setKey={setKey}
																									register={field}
																									rootIndex={rootIndex}
																									index={index}
																									setQuestionnaireData={setQuestionnaireData}
																									sectionIndex={sectionIndex}
																									onChange={field.onChange}
																									removeFile={selectedFiles[sectionIndex]?.[rootIndex]}
																									allowedMediaType={question?.questionnairesJson?.allowedMediaType}
																									{...field}
																								/>
																							</div>
																							{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`] && (
																								<ErrorBox>
																									<ErrorOutlineIcon fontSize="small" />
																									<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${index}`].message}</span>
																								</ErrorBox>
																							)}
																						</div>
																					</div>
																				)}
																			/>
																		</div>
																	))}


																	{question?.questionnairesJson?.uploadMedia?.length < question?.questionnairesJson?.uploadLimit && (
																		<div>
																			<Controller
																				name={`question_${sectionIndex + 1}_${rootIndex + 1}_${question?.questionnairesJson?.uploadMedia?.length}`}
																				control={control}
																				render={({ field }) => (
																					<div className="tw-flex-1">
																						<div className="tw-flex tw-flex-col tw-gap-1">
																							<div style={{ display: 'flex' }}>
																								<DropAudioImageWoV
																									selectedFile={selectedFiles[sectionIndex]?.[rootIndex]?.[question?.questionnairesJson?.uploadMedia?.length]}
																									setSelectedFile={(file) => handleFileChange(rootIndex, file, question?.questionnairesJson?.uploadMedia?.length, sectionIndex)}
																									setFileError={(error) => handleFileError(rootIndex, error, question?.questionnairesJson?.uploadMedia?.length, sectionIndex)}
																									fileError={fileErrors[sectionIndex]?.[rootIndex]?.[question?.questionnairesJson?.uploadMedia?.length]}
																									setError={setErr}
																									error={errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${question?.questionnairesJson?.uploadMedia?.length}`]}
																									key={`${rootIndex}-${question?.questionnairesJson?.uploadMedia?.length}`}
																									setKey={setKey}
																									register={field}
																									rootIndex={rootIndex}
																									index={question?.questionnairesJson?.uploadMedia?.length}
																									setQuestionnaireData={setQuestionnaireData}
																									sectionIndex={sectionIndex}
																									onChange={field.onChange}
																									allowedMediaType={question?.questionnairesJson?.allowedMediaType}
																									{...field}
																								/>
																							</div>
																							{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${question?.questionnairesJson?.uploadMedia?.length}`] && (
																								<ErrorBox>
																									<ErrorOutlineIcon fontSize="small" />
																									<span>{errors[`question_${sectionIndex + 1}_${rootIndex + 1}_${question?.questionnairesJson?.uploadMedia?.length}`].message}</span>
																								</ErrorBox>
																							)}
																						</div>
																					</div>
																				)}
																			/>
																		</div>
																	)}
																	{!atLeastOneFileUploaded && (
																		<ErrorBox>
																			<ErrorOutlineIcon fontSize="small" />
																			<span>{'At least one file upload is required.'}</span>
																		</ErrorBox>
																	)}
																</div>
																<>
																	<div className='tw-w-[520px]'>
																		{question?.questionnairesJson?.addCommentBox && (
																			<div className="tw-pt-4">
																				<span className="!tw-text-primaryText tw-p-2">Additional comment</span>
																				<TextField
																					variant="outlined"
																					fullWidth
																					multiline
																					rows={4}
																					value={question?.questionnairesJson?.comment}
																					placeholder="Please provide your comment here"
																					onChange={(e) => {
																						handleQuestionnareUpdate(e, rootIndex, null, sectionIndex, null, 'comment');
																					}}
																				/>
																			</div>
																		)}
																	</div>
																</>
																<div className="tw-text-sm tw-text-gray-500 tw-text-right">Upload Limit: {question?.questionnairesJson?.uploadLimit}</div>
															</div>
														</Container>
													</Paper>
												</div>
											);
										default: return;
									}
								})
								}
								{/* <div className='tw-pt-8'> */}
								<hr className=' tw-pb-7 tw-mb-7 tw-border-b tw-border-[#CCC]' />
								{/* </div> */}
							</div>
						}
						)}
					</form>
				</div>
			) : (
				<>
				</>
			)}
		</>
	);
}

