import React, { useEffect, useState } from 'react';
import { Button, Checkbox, CircularProgress, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Radio, Select, TextField, Typography } from '@mui/material';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '../../../../../public/assets/icons/check.svg';
import CheckIcon1 from '../../../../../public/assets/icons/check-icon.svg';
import CrossIcon from '../../../../../public/assets/icons/cross.svg';
import CheckCrossIcon from '../../../../../public/assets/icons/check-cross.svg';
import { useDispatch } from 'react-redux';
import { getSurveyPreview } from '../duck/network';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { BasicDatePicker } from '../../../../components/DatePicker';
import moment from 'moment';

export default function SurveyPreview() {
	const navigate = useNavigate();
	const params = useParams();
	const dispatch = useDispatch();
	const surveyPreviewData = useSelector((state) => state.survey.surveyPreview);
	const loading = false;

	const location = useLocation();
	const { parentId, surveyNumber, villageAreaId, conductedById, programUnitContentId, progressName, name, childId } = location.state || {};

	useEffect(() => {
		dispatch(getSurveyPreview({ parentId, villageAreaId, cewId: conductedById, programUnitContentId, childId: childId }));
	}, []);

	const Back = () => {
		navigate(-1, { state: { progressName, name, parentId, villageAreaId, conductedById, programUnitContentId, surveyNumber, childId } });
	};

	const editAnswersNavigate = () => {
		if (childId) {
			navigate(`/progress/village/survey-details/survey-questionnaire/update?programUnitContentId=${programUnitContentId}&parentId=${parentId}&villageAreaId=${villageAreaId}&cewId=${conductedById}&childId=${childId}`, {
				state: { progressName, name, parentId, villageAreaId, conductedById, programUnitContentId, surveyNumber },
			});
		} else {
			navigate(`/progress/village/survey-details/survey-questionnaire/update?programUnitContentId=${programUnitContentId}&parentId=${parentId}&villageAreaId=${villageAreaId}&cewId=${conductedById}`, {
				state: { progressName, name, parentId, villageAreaId, conductedById, programUnitContentId, surveyNumber },
			});
		}

	};


	const renderOptions = (answerFormat, answerType, option) => {
		switch (answerFormat) {
			case '1':
				return <div className="tw-pt-3">
					{option?.label.toLowerCase() === "custom response" ? (
						<p>Other </p>
					) : (
						<div>{option?.label}</div>
					)}
				</div>;
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

	return (
		<>
			<div className="tw-flex tw-justify-between">
				<div onClick={Back} className="tw-mb-8">
					<ArrowBackIcon className="tw-text-grey" />
					<span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">Back</span>
				</div>

				<div>
					<Button variant="outlined" size="large" className="!tw-text-white !tw-bg-primary tw-px-5" onClick={editAnswersNavigate}>
						Edit Answers
					</Button>
				</div>
			</div>

			{loading ? (
				<div className="tw-text-center tw-py-5 tw-w-full">
					<CircularProgress />
				</div>
			) : (
				<div>
					<div className="tw-flex tw-justify-between tw-w-full tw-items-center tw-mb-3 tw-px-2">
						<div>
							<Typography variant="h2" className="!tw-font-semibold !tw-text-secondaryText">
								{surveyPreviewData?.parentName}
							</Typography>
							<div className="tw-text-grey tw-pt-5 tw-pb-2 tw-text-[20px]"> {surveyPreviewData?.surveyUnit}</div>
							<div className="tw-text-grey tw-text-[18px]">
								{surveyNumber} : {surveyPreviewData?.surveyTitle}
							</div>
						</div>
					</div>
					{<div>

						{surveyPreviewData?.submittedForm?.map((section, sectionIndex) => {

							return <div>
								{(section?.title || section?.description) && (
									<div className="tw-pt-4 tw-px-2">
										{section?.title && (
											<p className="tw-text-black tw-pb-1 tw-text-[18px]">
												<span className="tw-text-grey">Section title: </span>
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
												<>
													<div key={question.id} className="tw-pt-6">
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
																	<div className="tw-flex tw-gap-1 tw-flex-col ">

																		{question?.questionnairesJson?.options.map((el, i) => (
																			<div className="tw-flex tw-gap-1 " key={i}>

																				<Radio checked={el.isSelected} disabled />
																				<div className="tw-flex tw-items-center tw-gap-6">
																					{/* {el.mediaUrl && <img src={el.temporaryMediaUrl} alt="option media" className="tw-w-20  " />}
																					{el.label && <span className="tw-text-[15px] tw-text-black">{el.label}</span>} */}
																					{renderOptions(question.questionnairesJson.meta.answerFormat, question.questionnairesJson.meta.answerType, el)}
																				</div>
																			</div>
																		))}

																	</div>
																</div>
																{question?.questionnairesJson?.options.find((option) => option?.label?.toLowerCase() === "custom response") && question?.questionnairesJson?.options.find((option) => option?.label?.toLowerCase() === "custom response")?.isSelected && (
																	<div className="tw-pt-4 tw-w-[520px]">
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
																			disabled
																		/>
																	</div>
																)}
																<div className='tw-w-[520px]'>
																	{question?.questionnairesJson?.addCommentBox && (
																		<div className="tw-py-4">
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
																				disabled
																			/>
																		</div>
																	)}
																</div>
															</Container>
														</Paper>
													</div>
												</>
											);

										case '2':
											return (
												<div className="tw-pt-6">
													<Paper>
														<Container maxWidth={false}>
															<div className="tw-py-6 tw-w-full tw-flex tw-flex-col tw-gap-2">
																{/* <span className="tw-text-base tw-text-secondaryText tw-font-semibold tw-pb-4">{`Q.${rootIndex + 1} ${question?.title}`}</span> */}

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
																<div aria-labelledby="demo-checkbox-group-label" className="checkbox-group  tw-flex !tw-flex-col !tw-text-black">
																	{question?.questionnairesJson?.options?.map((option, optionIndex) => (
																		<FormControlLabel
																			key={optionIndex}
																			control={<Checkbox checked={option?.isSelected} disabled />}
																			label={renderOptions(question.questionnairesJson.meta.answerFormat, question.questionnairesJson.meta.answerType, option)}
																		/>
																	))}
																</div>
															</div>
															{question?.questionnairesJson?.options.find((option) => option?.label?.toLowerCase() === "custom response") && question?.questionnairesJson?.options.find((option) => option?.label?.toLowerCase() === "custom response")?.isSelected && (
																<div className="tw-pt-4 tw-w-[520px]">
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
																		disabled
																	/>
																</div>
															)}
															<div className='tw-w-[520px]'>
																{question?.questionnairesJson?.addCommentBox && (
																	<div className="tw-py-4">
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
																			disabled
																		/>
																	</div>
																)}
															</div>
														</Container>
													</Paper>
												</div>
											);

										case '3':
											return (
												<div key={question.id} className="tw-pt-6">
													<Paper>
														<Container maxWidth={false}>
															<div className="tw-py-6 tw-w-[520px] tw-flex tw-flex-col tw-gap-2 ">
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
																</div>																		<div className="tw-flex tw-gap-1 tw-items-center">

																	<TextField
																		variant="outlined"
																		fullWidth
																		multiline
																		label="Enter your answer here"
																		rows={1}
																		value={question?.questionnairesJson?.value}
																		placeholder="Please provide your comment here"
																		disabled
																	/>
																</div>
															</div>
															<div className='tw-w-[520px]'>
																{question?.questionnairesJson?.addCommentBox && (
																	<div className="tw-py-4">
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
																			disabled
																		/>
																	</div>
																)}
															</div>
														</Container>
													</Paper>
												</div>
											);

										case '4':
											return (
												<div key={question.id} className="tw-pt-6">
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
																</div>																		<div className="tw-flex tw-gap-1 tw-items-center">
																	<textarea className="tw-w-[520px] tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md" rows="4" placeholder="Enter your answer here" value={question?.questionnairesJson?.value} disabled />
																</div>
															</div>
															<div className='tw-w-[520px]'>
																{question?.questionnairesJson?.addCommentBox && (
																	<div className="tw-pt-2 tw-pb-4">
																		<TextField
																			variant="outlined"
																			fullWidth
																			multiline
																			label="Additional comment"
																			rows={4}
																			value={question?.questionnairesJson?.comment}
																			placeholder="Please provide your comment here"
																			disabled
																		/>
																	</div>
																)}
															</div>
														</Container>
													</Paper>
												</div>
											);

										case '5':
											return (
												<div key={question.id} className="tw-pt-6">
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
																</div>																		<div className="tw-flex tw-gap-x-12 tw-flex-wrap  tw-w-[520px]">
																	{question?.questionnairesJson?.form?.map((section, sectionIndex) => (
																		<div key={sectionIndex} className="tw-py-2 tw-w-[520px] tw-flex tw-flex-col tw-gap-2">
																			<span className="tw-text-base tw-text-secondaryText tw-font-semibold ">{section.label}</span>
																			{section.children.map((field, fieldIndex) => {
																				switch (field.inputType) {
																					case '1':
																						return (
																							<div key={fieldIndex} className="tw-flex  tw-gap-x-12 tw-w-[520px] tw-flex-col tw-py-2">
																								<div className='tw-py-1'>label: {field.label}</div>
																								<TextField variant="outlined" value={field.value} className="tw-max-w-[900px] tw-w-[520px] tw-text-black" size="small" placeholder="Type Answer" disabled />
																							</div>
																						);

																					case '2':
																						return (
																							<div key={fieldIndex} className="tw-flex tw-gap-x-12 tw-w-[520px] tw-flex-col tw-py-2">
																								<div className='tw-py-1'>label: {field.label}</div>
																								<TextField variant="outlined" type="number" value={field.value} className="tw-max-w-[900px] tw-w-[520px]" size="small" placeholder="Type Answer" disabled />
																							</div>
																						);

																					case '3':
																						return (
																							<div key={fieldIndex} className="tw-flex tw-gap-x-12 tw-w-[520px] tw-flex-col tw-py-2">
																								<div className='tw-py-1'>label: {field.label}</div>
																								<TextField variant="outlined" type="email" value={field.value} className="tw-max-w-[900px] tw-w-full" size="small" placeholder="Type Answer" disabled />
																							</div>
																						);

																					case '4':
																						return (
																							<div key={fieldIndex} className="tw-flex tw-gap-x-12 tw-w-[520px] tw-flex-col tw-py-2">
																								<div className='tw-py-1'>label: {field.label}</div>
																								<BasicDatePicker value={moment(field.value, 'DD/MM/YYYY')} inputFormat="DD/MM/YYYY" disabled label="Date" />
																							</div>
																						);

																					case '5':
																						return (
																							<div key={fieldIndex} className="tw-flex tw-gap-x-12 tw-w-[520px] tw-flex-col tw-py-2">
																								<div className='tw-py-1'>label: {field.label}</div>
																								<FormControl fullWidth size="small" className="tw-max-w-[900px]">
																									<InputLabel id={`select-label-${sectionIndex}-${fieldIndex}`}>Select an option</InputLabel>
																									<Select labelId={`select-label-${sectionIndex}-${fieldIndex}`} variant="outlined" value={field.value || ''} disabled label="Select an option">
																										{field.children.map((option, optionIndex) => (
																											<MenuItem key={optionIndex} value={option.label}>
																												{option.label}
																											</MenuItem>
																										))}
																									</Select>
																								</FormControl>
																							</div>
																						);

																					default:
																						return null;
																				}
																			})}
																		</div>
																	))}
																</div>
															</div>
															<div className='tw-w-[520px]'>
																{question?.questionnairesJson?.addCommentBox && (
																	<div className="tw-py-4">
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
																			disabled
																		/>
																	</div>
																)}
															</div>
														</Container>
													</Paper>
												</div>
											);

										case '6':
											return (
												<div key={question.id} className="tw-pt-6">
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
																<div className="tw-flex tw-gap-1 tw-items-center">
																	<div className="tw-flex tw-flex-col tw-gap-2">
																		{question?.questionnairesJson?.textboxes.map((item, index) => (
																			<div key={index} className="tw-flex tw-gap-1 tw-items-center">
																				<span className="tw-text-[15px] tw-font-semibold tw-text-primaryText">{item?.label || index + 1}:</span>
																				<span className="tw-text-[15px] tw-text-primaryText">{item?.value}</span>
																			</div>
																		))}
																	</div>
																</div>
															</div>
															<div className='tw-w-[520px]'>
																{question?.questionnairesJson?.addCommentBox && (
																	<div className="tw-py-4">
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
																			disabled
																		/>
																	</div>
																)}
															</div>
														</Container>
													</Paper>
												</div>
											);

										case '7':
											return (
												<div key={question.id} className="tw-pt-6">
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
																{question?.questionnairesJson?.uploadMedia?.map((media, mediaIndex) => (
																	<>
																		{media?.temporaryMediaUrl ? (
																			<Box key={mediaIndex} className="tw-flex tw-items-center tw-w-fit tw-gap-5 tw-justify-between tw-py-2 tw-px-2 tw-bg-[#EEE] tw-rounded">
																				<a href={media?.temporaryMediaUrl} target="_blank" rel="noopener noreferrer" className="tw-text-[#666] tw-flex tw-gap-2 tw-items-center">
																					<AttachFileIcon fontSize="small" />
																					<p>{media?.mediaUrl}</p>
																				</a>
																				<IconButton sx={{ padding: 0 }} color="error" onClick={() => removeFile(mediaIndex)}></IconButton>
																			</Box>
																		) : null}
																	</>
																))}
															</div>
															<div className='tw-w-[520px]'>
																{question?.questionnairesJson?.addCommentBox && (
																	<div className="tw-py-4">
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
																			disabled
																		/>
																	</div>
																)}
															</div>
														</Container>
													</Paper>
												</div>
											);
										default:
											return null;
									}
								})
								}
								<hr className=' tw-pb-7 tw-mb-7 tw-border-b tw-border-[#CCC]' />
							</div>
						})}
					</div>
					}
				</div>
			)}
		</>
	);
}
