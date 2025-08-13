import { Button, Typography, TextField, Box, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { getCampingDetails, getManualWhatsAppStatus } from '../duck/network';
import { LoadingButton } from '@mui/lab';
import { Dropdown } from '../../components/Select';
import FormDialog, { InfoDialog } from '../../components/Dialog';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';

export default function GlificFlowManagementDetails() {
	const pathname = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const loader = useSelector((state) => state.manualWhatsApp.loadingCamping);
	const details = useSelector((state) => state.manualWhatsApp.campaingDetails);

	useEffect(() => {
		dispatch(getManualWhatsAppStatus());
		dispatch(getCampingDetails({ id: pathname.id }));
	}, [pathname.id]);

	const formatText = (text) => {
		return text?.split(',').join(', ');
	};
	let status = 1;

	const { control, handleSubmit, reset } = useForm({
		defaultValues: {
			fields: [
				{ val: 1, name: 'ads' },
				{ val: 2, name: 'ewr' },
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'fields',
	});

	const onSubmit = (data) => {
		console.log(data);
	};

	const handleClearAll = () => {
		reset({ fields: [{ value: '' }] });
	};

	const handleClick = () => {
		navigate('/glific-flow-management/add');
	};

	const handleClickManage = () => {
		navigate('/glific-flow-management/manage-flow');
	};

	const handleCopy = (copyData) => {
		const textToCopy = copyData || ""

		// Copy the text to clipboard
		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				toast.success('Copied to clipboard!'); // 
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	};

	return (
		<>
			{!loader ? (
				<div>
					<div className="tw-flex tw-items-center tw-w-full tw-justify-between">
						<div className="tw-flex tw-justify-center ">
							<Link to="/glific-flow-management">
								<ArrowBackIcon className="tw-text-grey" />
								<span className="tw-text-grey tw-ml-2 tw-mt-2 tw-text-sm tw-leading-normal">Glific Flow Management</span>
							</Link>
						</div>
					</div>

					<div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
						<h2 className="tw-text-secondaryText tw-font-bold tw-text-2xl ">Manage Glific Flow</h2>
						<div className="tw-flex tw-gap-x-5">
							<div className="tw-flex tw-gap-x-5">
								{status === 1 && (
									<LoadingButton
										type="submit"
										variant="contained"
										size="small"
										// loading={loader || loadingRelease}
										className="tw-h-[35px]"
										// disableRipple={addedParents?.length === 0}
										// disabled={addedParents?.length === 0}
										sx={{
											'&.Mui-disabled': {
												backgroundColor: 'rgba(0, 0, 0, 0.12)', // Default disabled background color
												color: 'rgba(0, 0, 0, 0.26)', // Default disabled text color
											},
										}}
									>
										{false ? 'Add Flow' : 'Save'}
									</LoadingButton>
								)}

								{status === 2 && (
									<div className="tw-flex tw-gap-4">
										<Button variant="outlined">Update Flow</Button>
										<LoadingButton
											type="submit"
											variant="contained"
											size="small"
											// loading={loader || loadingRelease}
											className="tw-h-[35px]"
											// disableRipple={addedParents?.length === 0}
											// disabled={addedParents?.length === 0}
											sx={{
												'&.Mui-disabled': {
													backgroundColor: 'rgba(0, 0, 0, 0.12)', // Default disabled background color
													color: 'rgba(0, 0, 0, 0.26)', // Default disabled text color
												},
											}}

											// onClick={}
										>
											Activate
										</LoadingButton>
									</div>
								)}

								{/* 
								<FormDialog open={true} title={"Are you sure you want to activate"} >
									<Button variant='contained' className='tw-w-full'>Okay</Button>
								</FormDialog> */}
							</div>
						</div>
					</div>
					<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
						<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
							Trigger Details
						</Typography>
						<div className="tw-flex  tw-gap-x-10 tw-gap-y-6  tw-pt-6 tw-w-full">
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-1/2 ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Trigger activity</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details.title || '-'}</span>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-1/2 ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Module</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.description || '-'}</span>
								</div>
							</div>
						</div>
					</div>

					<div className='tw-my-8'>
						<div className="tw-shadow-md tw-bg-white  tw-gap-5 tw-mb-5 tw-rounded-xl ">
							<Accordion>
								<AccordionSummary expandIcon={<ExpandMoreIcon />}>
									{/* Title with Expand Icon on Left */}
									<Typography variant="h4" className="!tw-font-semibold !tw-text-secondaryText tw-my-8">
										Variables Details
									</Typography>
								</AccordionSummary>

								<AccordionDetails>
									<Box component="form" onSubmit={handleSubmit(onSubmit)} >
										<i className="tw-text-primaryText">Kindly use the below variable to add in the Glific flow</i>

										<div className="tw-flex tw-flex-wrap tw-gap-y-6 tw-pt-6">
											<div className="tw-flex tw-items-center tw-gap-2 tw-w-1/4">
												<div className="tw-flex tw-flex-col tw-flex-1">
													<span className="tw-text-xs tw-flex tw-text-grey">
														Name Of The Workshop Session{' '}
														<button className="tw-flex tw-items-center tw-px-2 tw-py-1 tw-text-gray tw-rounded" onClick={()=>handleCopy("workshop.session.name")}>
															<ContentCopyIcon className="tw-mr-1" />
														</button>
													</span>
													<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.glificFlowName || 'workshop.session.name'}</span>
												</div>
											</div>

											<div className="tw-flex tw-items-center tw-gap-2 tw-w-1/4">
												<div className="tw-flex tw-flex-col tw-flex-1">
													<span className="tw-text-xs tw-flex tw-text-grey">
														Workshop Session Date{' '}
														<button className="tw-flex tw-items-center tw-px-2 tw-py-1 tw-text-gray tw-rounded" onClick={()=>handleCopy("workshop.date")}>
															<ContentCopyIcon className="tw-mr-1" />
														</button>
													</span>
													<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.glificFlowId || 'workshop.date'}</span>
												</div>
											</div>

											<div className="tw-flex tw-items-center tw-gap-2 tw-w-1/4">
												<div className="tw-flex tw-flex-col tw-flex-1">
													<span className="tw-text-xs tw-flex tw-text-grey">
														Workshop Session Start Time{' '}
														<button className="tw-flex tw-items-center tw-px-2 tw-py-1 tw-text-gray tw-rounded" onClick={()=>handleCopy("workshop.start.time")}>
															<ContentCopyIcon className="tw-mr-1" />
														</button>
													</span>
													<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.glificFlowId || 'workshop.start.time'}</span>
												</div>
											</div>

											<div className="tw-flex tw-items-center tw-gap-2 tw-w-1/4">
												<div className="tw-flex tw-flex-col tw-flex-1">
													<span className="tw-text-xs tw-flex tw-text-grey">
														Workshop Session End Time{' '}
														<button className="tw-flex tw-items-center tw-px-2 tw-py-1 tw-text-gray tw-rounded" onClick={()=>handleCopy("workshop.end.time")}>
															<ContentCopyIcon className="tw-mr-1" />
														</button>
													</span>
													<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.glificFlowId || 'workshop.end.time'}</span>
												</div>
											</div>

											<div className="tw-flex tw-items-center tw-gap-2 tw-w-1/4">
												<div className="tw-flex tw-flex-col tw-flex-1">
													<span className="tw-text-xs tw-flex tw-text-grey">
														Name of The Workshop Location{' '}
														<button className="tw-flex tw-items-center tw-px-2 tw-py-1 tw-text-gray tw-rounded" onClick={()=>handleCopy("workshop.location")}>
															<ContentCopyIcon className="tw-mr-1" />
														</button>
													</span>
													<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.glificFlowId || 'workshop.location'}</span>
												</div>
											</div>

											<div className="tw-flex tw-items-center tw-gap-2 tw-w-1/4">
												<div className="tw-flex tw-flex-col tw-flex-1">
													<span className="tw-text-xs tw-flex tw-text-grey">
														Name Of The Workshop Session Village{' '}
														<button className="tw-flex tw-items-center tw-px-2 tw-py-1 tw-text-gray tw-rounded" onClick={()=>handleCopy("workshop.session.village")}>
															<ContentCopyIcon className="tw-mr-1" />
														</button>
													</span>
													<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.glificFlowId || 'workshop.session.village'}</span>
												</div>
											</div>
										</div>
									</Box>
								</AccordionDetails>
							</Accordion>
						</div>
					</div>
					<div>
						<div className="tw-flex tw-p-6 tw-flex-col  tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
							<div className="tw-flex tw-w-full tw-justify-between tw-pb-1">
								<Typography variant="h4" className="!tw-font-semibold  !tw-text-secondaryText">
									Flow Details
								</Typography>
							</div>
							<div>
								<div className="tw-flex    tw-w-full tw-flex-wrap   ">
									<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-1/4 ">
										<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
											<span className="tw-text-xs  tw-text-grey">Glific Flow Name</span>
											<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.glificFlowName || '-'}</span>
										</div>
									</div>
									<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch  tw-w-1/4">
										<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
											<span className="tw-text-xs  tw-text-grey">Glific Flow Id</span>
											<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.glificFlowId || '-'}</span>
										</div>
									</div>
									<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch  tw-w-1/4">
										<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
											<span className="tw-text-xs  tw-text-grey">Flow Status</span>
											<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.glificFlowId || '-'}</span>
										</div>
									</div>
									<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch  tw-w-1/4">
										<div className="tw-flex tw-flex-col tw-items-start  tw-flex-1">
											<Button className="tw-text-backgroundPrimary" onClick={handleClickManage}>
												{' '}
												Manage
											</Button>
										</div>
										<div className="tw-flex tw-flex-col tw-items-start  tw-flex-1">
											<Button className="tw-text-backgroundPrimary" onClick={handleClick}>
												{' '}
												Update Flow
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<Box className="tw-text-center tw-py-5">{<CircularProgress />}</Box>
			)}
		</>
	);
}
