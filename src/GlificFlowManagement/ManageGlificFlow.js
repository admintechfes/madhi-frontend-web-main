import { Button, Typography, TextField, Box, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import ListParentWhatsAppDetails from '../ManualWhatsApp/ManualWhatsAppDetails/ListParentWhatsAppDetails';

export default function ManageGlificFlow() {
	const navigate = useNavigate();

	const loader = useSelector((state) => state.manualWhatsApp.loadingCamping);
	const details = useSelector((state) => state.manualWhatsApp.campaingDetails);

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
										variant="outlined"
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
										{false ? 'Add Flow' : 'Pause'}
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
									<span className="tw-text-xs  tw-text-grey">Hourly Frequency</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details.title || '-'}</span>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-1/2 ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Active Glific Flows</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.description || '-'}</span>
								</div>
							</div>
              <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-1/2 ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Flow ID</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.description || '-'}</span>
								</div>
							</div>
              <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-1/2 ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Status</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.description || '-'}</span>
								</div>
							</div>
              <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-1/2 ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Status updated on</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.description || '-'}</span>
								</div>
							</div>
						</div>
					</div>

					<ListParentWhatsAppDetails />
				</div>
			) : (
				<Box className="tw-text-center tw-py-5">{<CircularProgress />}</Box>
			)}
		</>
	);
}
