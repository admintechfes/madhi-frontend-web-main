import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { CircularProgress, Typography } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { Box } from '../../components/Loader/style';
import TrainingAttendees from '../TrainingAttendees';
import { getTrainingAttendeesList, getTrainingDetails } from '../duck/network';
import { hideProgramLoader, showProgramLoader } from '../../components/Loader/duck/loaderSlice';

export default function TrainingDetails() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams();

	const trainingDetails = useSelector((state) => state.training.trainingDetails);
	const unitList = useSelector((state) => state.unit.unitList);
	const loader = useSelector((state) => state.loader.openProgramLoader);
	const toggleloader = useSelector((state) => state.program.programToggleLoading);
	const duplicateLoader = useSelector((state) => state.loader.duplicateLoader);

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [opencloseProgramDialog, setOpenCloseProgramDialog] = useState(false);
	const [openStartProgramDialog, setOpenStartProgramDialog] = useState(false);
	const [permissions, setPermissions] = useState({});
	const [anchorEl, setAnchorEl] = useState(null);

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	useEffect(() => {
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
	}, []);

	useEffect(() => {
		dispatch(showProgramLoader());
		dispatch(getTrainingDetails(params.id)).then(() => {
			dispatch(getTrainingAttendeesList({ trainingId: params.id, page: 1, perPage:10 })).then(() => {
				dispatch(hideProgramLoader());
			});
      // dispatch(hideProgramLoader())
		});

		return () => dispatch(showProgramLoader());
	}, []);

	let BackgroundTheme = trainingDetails.status?.toLowerCase() == ('answer')  || trainingDetails.status?.toLowerCase() == ('accepted') ? 'rgba(56, 146, 255, 0.20)' : trainingDetails.status?.toLowerCase() == 'scheduled' ?  'rgba(255, 196, 12, 0.24)' : trainingDetails.status?.toLowerCase() == 'completed' ? '#57C79633' : 'rgba(254, 13, 13, 0.10)';
	let ColorTheme = trainingDetails.status?.toLowerCase() == ('answer') || trainingDetails.status?.toLowerCase() == ('accepted') ? '#3892FF' : trainingDetails.status?.toLowerCase() === 'scheduled' ? '#F39C35' : trainingDetails.status?.toLowerCase() == 'no answer' ?  'rgba(255, 196, 12, 0.24)' : trainingDetails.status?.toLowerCase() == 'completed' ? '#57C796' : '#FE0D0D';

	return (
		<>
			{!loader ? (
			<>
				<div>
					<div className="tw-flex tw-items-center tw-w-full tw-justify-between">
						<div className="tw-flex tw-justify-center ">
							<Link to="/cew-training">
								<KeyboardBackspaceIcon className="tw-text-grey" />
								<span className="tw-text-grey tw-ml-2 tw-mt-2 tw-text-sm tw-leading-normal">CEW Training</span>
							</Link>
						</div>
					</div>

					<div className="tw-pt-2">
						<h2 className="tw-text-secondaryText tw-font-bold tw-text-2xl ">{trainingDetails.trainingName}</h2>
					</div>
					<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
						<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
							Training Details
						</Typography>
						<div className="tw-flex  tw-gap-x-8 tw-gap-y-8 tw-flex-wrap tw-pt-6">
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
									{/* <div>
											<img src={programIcon} />
										</div> */}
									<div className="tw-flex tw-flex-col tw-gap-1">
										<span className="tw-text-xs tw-text-grey">Name of the Training</span>
										<span className="tw-text-sm tw-text-primaryText tw-font-normal">{trainingDetails.trainingName}</span>
									</div>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
									{/* <div>
											<img src={calenderIcon} />
										</div> */}
									<div className="tw-flex tw-flex-col tw-gap-1">
										<span className="tw-text-xs  tw-text-grey">Date</span>
										<span className="tw-text-sm tw-text-primaryText tw-font-normal">{trainingDetails.date && moment(trainingDetails.date).format('DD MMM YYYY')}</span>
									</div>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
									{/* <div>
											<img src={statusIcon} />
										</div> */}
									<div className="tw-flex tw-flex-col tw-gap-1">
										<span className="tw-text-xs  tw-text-grey">Start Time</span>
										<span className="tw-text-sm tw-text-primaryText tw-font-normal ">{trainingDetails.startTime  && moment(trainingDetails.startTime).format('LT')}</span>
									</div>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
									{/* <div>
											<img src={calenderIcon} />
										</div> */}
									<div className="tw-flex tw-flex-col tw-gap-1">
										<span className="tw-text-xs  tw-text-grey">End Time</span>
										<span className="tw-text-sm tw-text-primaryText tw-font-normal">{trainingDetails.endTime  && moment(trainingDetails.endTime).format('LT')}</span>
									</div>
								</div>
							</div>
						</div>

						<div className="tw-flex  tw-gap-x-8 tw-gap-y-8 tw-flex-wrap tw-pt-6">
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
									{/* <div>
											<img src={programIcon} />
										</div> */}
									<div className="tw-flex tw-flex-col tw-gap-1">
										<span className="tw-text-xs tw-text-grey">Program Name</span>
										<span className="tw-text-sm tw-text-primaryText tw-font-normal">{trainingDetails.programName}</span>
									</div>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
									{/* <div>
											<img src={calenderIcon} />
										</div> */}
									<div className="tw-flex tw-flex-col tw-gap-1">
										<span className="tw-text-xs  tw-text-grey">Unit Number</span>
										<span className="tw-text-sm tw-text-primaryText tw-font-normal">{`Unit ${trainingDetails.unitNumber}`}</span>
									</div>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
									{/* <div>
											<img src={statusIcon} />
										</div> */}
									<div className="tw-flex tw-flex-col tw-gap-1">
										<span className="tw-text-xs  tw-text-grey">Unit Name</span>
										<span className="tw-text-sm tw-text-primaryText tw-font-normal ">{trainingDetails.unitName}</span>
									</div>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
									{/* <div>
											<img src={calenderIcon} />
										</div> */}
									<div className="tw-flex tw-flex-col tw-gap-1">
										<span className="tw-text-xs  tw-text-grey">Created By</span>
										<span className="tw-text-sm tw-text-primaryText tw-font-normal">{trainingDetails?.createdBy}</span>
									</div>
								</div>
							</div>
						</div>

						<div className="tw-flex  tw-gap-x-8 tw-gap-y-8 tw-flex-wrap tw-pt-6">
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
									{/* <div>
											<img src={programIcon} />
										</div> */}
									<div className="tw-flex tw-flex-col tw-gap-1">
										<span className="tw-text-xs tw-text-grey">Meeting Location</span>
										<span className="tw-text-sm tw-text-primaryText tw-font-normal">{trainingDetails.meetingLocation}</span>
									</div>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
									{/* <div>
											<img src={calenderIcon} />
										</div> */}
									<div className="tw-flex tw-flex-col tw-gap-1">
										<span className="tw-text-xs  tw-text-grey">Status</span>
										<span style={{backgroundColor:BackgroundTheme, color:ColorTheme, borderRadius:'4px', padding:'5px 10px'}} className="tw-text-sm tw-text-primaryText tw-font-normal">{trainingDetails.status}</span>
									</div>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
									{/* <div>
											<img src={statusIcon} />
										</div> */}
									<div className="tw-flex tw-flex-col tw-gap-1">
										<span className="tw-text-xs  tw-text-grey">Last Updated On</span>
										<span className="tw-text-sm tw-text-primaryText tw-font-normal ">{trainingDetails.lastUpdatedOn && moment(trainingDetails.date).format('DD MMM YYYY')}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<TrainingAttendees trainingId={trainingDetails.id} trainingDetails={trainingDetails} />
				
			</>
			) : (
				<Box className="tw-text-center tw-py-5">{<CircularProgress />}</Box>
			)}
		</>
	);
}
