import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { Box } from '../../components/Loader/style';
import ListParentWhatsAppDetails from './ListParentWhatsAppDetails';
import { getCampingDetails, getManualWhatsAppStatus, getManualWhatsAppStatusNew } from '../duck/network';


export default function ManualWhatsAppDetails() {
	const pathname = useParams();
	const dispatch = useDispatch();

	const loader = useSelector((state) => state.manualWhatsApp.loadingCamping);
	const details = useSelector((state) => state.manualWhatsApp.campaingDetails);

	useEffect(() => {
		dispatch(getManualWhatsAppStatusNew())
		dispatch(getCampingDetails({ id: pathname.id }));
	}, [pathname.id]);





	const formatText = (text) => {
		return text?.split(",").join(", ");
	};

	return (
		<>
			{!loader ? (
				<div>
					<div className="tw-flex tw-items-center tw-w-full tw-justify-between">
						<div className="tw-flex tw-justify-center ">
							<Link to="/manual-whatsapp">
								<ArrowBackIcon className="tw-text-grey" />
								<span className="tw-text-grey tw-ml-2 tw-mt-2 tw-text-sm tw-leading-normal">Campaign</span>
							</Link>
						</div>
					</div>

					<div className="tw-pt-2">
						<h2 className="tw-text-secondaryText tw-font-bold tw-text-2xl ">Campaign Report</h2>
					</div>
					<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
						<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
							Campaign Details
						</Typography>
						<div className="tw-flex  tw-gap-x-10 tw-gap-y-6  tw-pt-6 tw-w-full">
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-1/2 ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Campaign Name</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.title || '-'}</span>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-1/2 ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Campaign Description</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.description || '-'}</span>
								</div>
							</div>
						</div>
						<div className="tw-flex  tw-gap-x-10 tw-gap-y-6  tw-pt-6 tw-w-full">
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-1/2 ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Tags</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{formatText(details?.tags) || '-'}</span>
								</div>
							</div>

							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-1/2">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Released On </span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.releaseAt || '-'}</span>
								</div>
							</div>
						</div>
					</div>
					<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
						<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
							WhatsApp Flow
						</Typography>
						<div className="tw-flex  tw-gap-x-10 tw-gap-y-6 tw-w-full tw-pt-6">
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-1/2 ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">WhatsApp Flow</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.glificFlowName || '0'}</span>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-1/2 ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Flow Template ID</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.glificFlowId || '0'}</span>
								</div>
							</div>
						</div>
					</div>
					<div>
            <ListParentWhatsAppDetails />
          </div>
				</div>
			) : (
				<Box className="tw-text-center tw-py-5">{<CircularProgress />}</Box>
			)}
		</>
	);
}
