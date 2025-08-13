import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Paper, Typography } from '@mui/material';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '../../../../../public/assets/icons/check.svg';
import CheckIcon1 from '../../../../../public/assets/icons/check-icon.svg';
import CrossIcon from '../../../../../public/assets/icons/cross.svg';
import CheckCrossIcon from '../../../../../public/assets/icons/check-cross.svg';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getObservationForm, getWorkshopQuiz } from '../duck/network';

export default function WorkshopQuizPreview() {
	const navigate = useNavigate();
	const params = useParams();
	const dispatch = useDispatch();
	const workshopPreviewData = useSelector((state) => state.workshop.workshopPreviewQuiz);
	const loading = false;

	const location = useLocation();
	const { parentId, villageAreaId, conductedById, programUnitContentId, progressName, name, workshopSessionId, supervisor } = location.state || {};

	useEffect(() => {
		dispatch(getWorkshopQuiz({ workshopSessionId, parentId: params?.id, programUnitContentId }));
	}, []);

	const Back = () => {
		navigate(-1, { state: { progressName, name, parentId, villageAreaId, conductedById, programUnitContentId, progressName, name, workshopSessionId, supervisor } });
	};


	return (
		<>
			<div className="tw-flex tw-justify-between">
				<div onClick={Back} className="tw-mb-5">
					<ArrowBackIcon className="tw-text-grey" />
					<span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">Back</span>
				</div>
			</div>

			{loading ? (
				<div className="tw-text-center tw-py-5 tw-w-full">
					<CircularProgress />
				</div>
			) : (
				<>
					{/* <div className="tw-flex tw-justify-between tw-w-full tw-items-center tw-mb-3 tw-px-2"> */}
						{/* <div>
							<Typography variant="h2" className="!tw-font-semibold !tw-text-secondaryText">
								{workshopPreviewData?.parentName}
							</Typography>
							<div className="tw-text-grey tw-pt-5 tw-pb-2 tw-text-[14px]">
								{' '}
								{workshopPreviewData?.unitName}
								{'>'}
								{workshopPreviewData?.workshopName}
							</div>
							<div className="tw-text-grey ">
								{workshopPreviewData?.programUnitContentSerialNumber} : {workshopPreviewData?.programUnitContentName}
							</div>
						</div> */}
						{/* <span className="tw-text-primaryText tw-text-lg">
							Score: <strong className="tw-text-secondaryText">{workshopPreviewData?.quizScore}</strong>
						</span> */}
					{/* </div> */}


					<div className='tw-flex tw-justify-between tw-w-full tw-items-center tw-mb-6'>
            <Typography variant="h2" className='!tw-font-semibold !tw-text-secondaryText'>{workshopPreviewData?.parentName}</Typography>
            <span className='tw-text-primaryText tw-text-lg'>Score: <strong className='tw-text-secondaryText'>{workshopPreviewData?.quizScore === null ? "-"  : workshopPreviewData?.quizScore}</strong></span>
          </div>
					<div className="tw-text-grey tw-pt-5 tw-pb-2 tw-text-[14px]">
								{' '}
								{workshopPreviewData?.unitName}
								{'>'}
								{workshopPreviewData?.workshopName}
							</div>
							<div className="tw-text-grey ">
								{workshopPreviewData?.programUnitContentSerialNumber} : {workshopPreviewData?.programUnitContentName}
							</div>
					{/* <div className="tw-flex tw-flex-col gap-2 tw-mb-10">
						<span className="tw-text-xs tw-text-grey tw-block">{workshopPreviewData?.quizUnit}</span>
						<span className="tw-text-primaryText tw-text-sm">{workshopPreviewData?.quizTitle}</span>
					</div> */}


					{workshopPreviewData?.submittedForm?.map((el, index) => (
						<div className={`${workshopPreviewData?.submittedForm.length > 1 ? "tw-pb-7 tw-mb-7 tw-border-b tw-border-[#CCC]" : ""}`} key={index}>
							<div className="tw-px-2">
								<p className="tw-text-black tw-pb-1">
									<span className="tw-text-grey">Section title: </span>
									{el?.title}
								</p>
								{el?.description && (
									<p className="tw-text-black">
										<span className="tw-text-grey">Section description: </span>
										{el?.description}
									</p>
								)}
							</div>
							{el.questionnaire.map((item, index) =>
								<Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6' key={index}>
									<span className='tw-text-sm tw-text-[#333333] tw-font-semibold mb-5'>Q.{index + 1} {item.title}</span>
									{item.description && <p className="tw-text-sm tw-text-[#333] tw-mt-3">{item?.description}</p>}
									{item?.mediaUrl && item?.mediaUrl.endsWith('.mp3') ? (
										<audio controls className="tw-mt-3 tw-mb-2">
											<source src={item?.temporaryMediaUrl} type="audio/mpeg" />
										</audio>
									) : item?.mediaUrl ? (
										<>
											<div className="tw-mt-2 tw-mb-3 tw-cursor-pointer" onClick={() => OptionsDialog(item?.temporaryMediaUrl)}>
												<img className="tw-rounded-2xl tw-w-20 tw-h-20" alt="image" src={item?.temporaryMediaUrl} />
											</div>
										</>
									) : null}
									{item?.questionnairesJson?.options.length > 0 ?
										item?.questionnairesJson?.options.map((el, i) => {

                      const isCorrect = el.isCorrect ? el.isCorrect : false;
                      const isSelected = el.isSelected ? el.isSelected : false;

                      return (
                        <div className={`tw-flex tw-gap-4 tw-items-center tw-w-full tw-pt-2 tw-px-2 tw-relative tw-rounded ${(!isCorrect && isSelected) ? "tw-bg-[#EB57571A] tw-pb-2" : (isCorrect && isSelected) ? "tw-bg-[#57C79633] tw-pb-2" : ""}`} key={i}>
                          {item?.questionnairesJson?.meta?.answerType === "1" ? (
                            el.isSelected ? (
                              <div className="tw-p-1 tw-border-2 tw-border-primary tw-rounded-full">
                                <div className="tw-p-1 tw-bg-primary tw-rounded-full"></div>
                              </div>) : (
                              <div className="tw-p-2 tw-border-2 tw-border-primary tw-rounded-full"></div>
                            )
                          ) : (
                            null)}
                          {item?.questionnairesJson?.meta?.answerType === "2" ? (
                            el.isSelected ? (
                              <img src={CheckIcon1} alt="check" />
                            ) : (
                              <div className="tw-p-2 tw-border-2 tw-border-primary"></div>
                            )
                          ) : (
                            null)}

                          <div className='tw-w-5 tw-h-5 tw-absolute tw-right-3'>
                            {isCorrect ?
                              <img src={CheckIcon1} alt="check" />
                              :
                              (!isCorrect && isSelected) ? <img src={CheckCrossIcon} alt="check" />
                                :
                                null
                            }
                          </div>
                          {el?.mediaUrl &&
                            (item?.questionnairesJson?.meta?.answerFormat === '3' ||
                              item?.questionnairesJson?.meta?.answerFormat === '5') ? (
                            <audio controls>
                              <source src={el?.temporaryMediaUrl} type="audio/mpeg" />
                            </audio>
                          ) : el?.mediaUrl ? (
                            <>
                              <img
                                className="tw-rounded-2xl tw-w-20 tw-h-20 tw-cursor-pointer"
                                alt="image"
                                src={el?.temporaryMediaUrl}
                              />
                            </>
                          ) : null}
                          <span className='tw-text-[15px] tw-text-primaryText'>{el.label}</span>
                        </div>
                      )
                    }

                    )
										:
										<div className='tw-flex tw-gap-1 tw-items-center'>
											<span className='tw-text-sm tw-text-primaryText'>Ans:</span>
											<span className='tw-text-[15px] tw-text-primaryText'>{item?.questionnairesJson?.value}</span>
										</div>
									}
								</Paper>)}
						</div>
					)
					)}


				</>
			)}
		</>
	);
}
