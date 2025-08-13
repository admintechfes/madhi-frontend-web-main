import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button, CircularProgress, Popover, Tooltip, Typography } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';

import programIcon from '../../../public/assets/icons/program_icon.svg';
import calenderIcon from '../../../public/assets/icons/calendar.svg';
import mapIcon from '../../../public/assets/icons/map_marker.svg';
import statusIcon from '../../../public/assets/icons/status.svg';
import duplicateIcon from '../../../public/assets/icons/duplicate.svg';
import deleteIcon from '../../../public/assets/icons/delete.svg';
import { Box } from '../../components/Loader/style';
import Units from '../../Units';
import ProgramUnitProgress from './ProgramUnitProgress';
import { deleteProgram, duplicateProgram, getProgramDetails, getProgramUnitProgressList, toggleProgramStatus } from '../duck/network';
import { getUnitList } from '../../Units/duck/network';
import { hideProgramLoader, showProgramLoader } from '../../components/Loader/duck/loaderSlice';
import FormDialog, { DeleteDialog } from '../../components/Dialog';
import ViewMore from '../../components/ViewMore';

export default function ProgramDetails() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams();

	const programDetails = useSelector((state) => state.program.programDetails);
	const unitList = useSelector((state) => state.unit.unitList);
	const loader = useSelector((state) => state.loader.openProgramLoader);
	const toggleloader = useSelector((state) => state.program.programToggleLoading);
	const duplicateLoader = useSelector((state)=> state.loader.duplicateLoader)

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
		dispatch(getProgramDetails(params.id)).then(() => {
			dispatch(getUnitList({ programId: params.id, page: 1 })).then(() => {
				dispatch(getProgramUnitProgressList(params.id, { districtId: 'all', status: 'all', programId: params.id })).then(() => {
					dispatch(hideProgramLoader());
				});
			});
		});

		return () => dispatch(showProgramLoader());
	}, []);

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const handlePopoverClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleEdit = () => {};

	const handleStartProgram = () => {
		dispatch(toggleProgramStatus(params.id, { status: 'active' })).then(() => {
			handleClose();
			dispatch(getProgramDetails(params.id));
		});
	};

	const handleCloseProgram = () => {
		dispatch(toggleProgramStatus(params.id, { status: 'closed' })).then(() => {
			dispatch(getProgramDetails(params.id));
			handleClose();
			handlePopoverClose();
		});
	};

	const handleDeleteProgram = () => {
		dispatch(deleteProgram(params.id)).then((res) => {
			if (res.statusCode == 200) {
				navigate('/programs');
			}
			handleClose();
		});
	};

	const handleClose = () => {
		setOpenCloseProgramDialog(false);
		setOpenDeleteDialog(false);
		setOpenStartProgramDialog(false);
	};

	const handleDuplicateProgram = () => {
		dispatch(duplicateProgram(params.id)).then((res) => {
			if(res.statusCode == 200) {
				navigate('/programs')
			}
		})
		handlePopoverClose()
	}

	let BackgroundTheme = programDetails?.status === 'active' ? 'rgba(56, 146, 255, 0.20)' : programDetails?.status === 'yet to start' ? 'rgba(255, 196, 12, 0.24)' : 'rgba(254, 13, 13, 0.10)';
	let ColorTheme = programDetails?.status === 'active' ? '#3892FF' : programDetails?.status === 'yet to start' ? '#F39C35' : '#FE0D0D';

	return (
		<>
			{!loader ? (
				<>
					<div>
						<div className="tw-flex tw-items-center tw-w-full tw-justify-between">
							<div className="tw-flex tw-justify-center ">
								<Link to="/programs">
									<KeyboardBackspaceIcon className="tw-text-grey" />
									<span className="tw-text-grey tw-ml-2 tw-mt-2 tw-text-sm tw-leading-normal">Programs</span>
								</Link>
							</div>
							<div className="tw-flex tw-gap-4 items-center">
								{permissions?.Programs?.update && programDetails?.status == 'yet to start' && (
									<Tooltip arrow placement="top-start" title={unitList.length > 0 ? '' : 'Atleast one unit is required to start the program'}>
										<span>
											<LoadingButton
												loading={toggleloader}
												disabled={unitList.length > 0 ? false : true}
												variant="outlined"
												onClick={() => setOpenStartProgramDialog(true)}
												className={`!tw-font-semibold ${unitList.length <= 0 ? '!tw-bg-inherit' : ''}`}
											>
												Start program
											</LoadingButton>
										</span>
									</Tooltip>
								)}
								{programDetails?.status == 'active' && (
									<LoadingButton loading={toggleloader} variant="outlined" color="error" onClick={() => setOpenCloseProgramDialog(true)} className="!tw-font-semibold">
										close program
									</LoadingButton>
								)}
								{/* {programDetails?.status == 'closed' && (
									<LoadingButton loading={toggleloader} variant="contained" disabled color="error" className="!tw-font-semibold !tw-text-[#FE0D0D] !tw-bg-[#FE0D0D1A]">
										closed
									</LoadingButton>
								)} */}
								<Button variant="contained" onClick={handlePopoverClick} className="!tw-bg-white !tw-text-primary !tw-font-semibold">
									Actions
								</Button>
								{permissions?.Programs.update && (
									<Button
										variant="contained"
										disabled={programDetails?.status == 'closed' ? true : false}
										onClick={() => navigate(`/programs/update/${params.id}`, { state: { programDetails } })}
										className={`${programDetails?.status == 'closed' ? '!tw-bg-[#0000001f]' : '!tw-bg-primary !tw-text-white'} !tw-font-semibold`}
									>
										Edit Program
									</Button>
								)}
							</div>
						</div>

						<div className="tw-pt-2">
							<h2 className="tw-text-secondaryText tw-font-bold tw-text-2xl ">{programDetails.name}</h2>
						</div>
						<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
							<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
								Program Details
							</Typography>
							<div className="tw-flex  tw-gap-x-8 tw-gap-y-8 tw-flex-wrap tw-pt-6">
								<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
									<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
										<div>
											<img src={programIcon} />
										</div>
										<div className="tw-flex tw-flex-col tw-gap-1">
											<span className="tw-text-xs tw-text-grey">Program Name</span>
											<span className="tw-text-sm tw-text-primaryText tw-font-normal">{programDetails.name}</span>
										</div>
									</div>
								</div>
								<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
									<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
										<div>
											<img src={calenderIcon} />
										</div>
										<div className="tw-flex tw-flex-col tw-gap-1">
											<span className="tw-text-xs  tw-text-grey">Start date and End date of the program</span>
											<span className="tw-text-sm tw-text-primaryText tw-font-normal">{programDetails.startEndDate}</span>
										</div>
									</div>
								</div>
								<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
									<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
										<div>
											<img src={statusIcon} />
										</div>
										<div className="tw-flex tw-flex-col tw-gap-1">
											<span className="tw-text-xs  tw-text-grey">Program Status</span>
											<span style={{ backgroundColor: BackgroundTheme, color: ColorTheme }} className="tw-text-sm tw-text-primaryText tw-font-normal tw-px-2 tw-py-[2px] tw-rounded tw-text-center">
												{programDetails.status}
											</span>
										</div>
									</div>
								</div>
								<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
									<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
										<div>
											<img src={calenderIcon} />
										</div>
										<div className="tw-flex tw-flex-col tw-gap-1">
											<span className="tw-text-xs  tw-text-grey">{programDetails?.status != 'closed' ? 'Status Since' : 'Closed on'}</span>
											<span className="tw-text-sm tw-text-primaryText tw-font-normal">{programDetails?.statusSince}</span>
										</div>
									</div>
								</div>
							</div>

							<div className="tw-flex  tw-gap-x-8 tw-gap-y-8 tw-flex-wrap tw-pt-6">
								<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
									<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
										<div>
											<img src={mapIcon} />
										</div>
										<div className="tw-flex tw-flex-col tw-gap-1">
											<span className="tw-text-xs  tw-text-grey">Selected Program Districts </span>
											{/* <span className="tw-text-sm tw-text-primaryText tw-font-normal">{programDetails.programDistricts}</span> */}
											<ViewMore data={programDetails?.programDistricts || '-'} className="tw-text-sm tw-font-normal  tw-text-primaryText" />
										</div>
									</div>
								</div>

								<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
									<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
										<div>
											<img src={mapIcon} />
										</div>
										<div className="tw-flex tw-flex-col tw-gap-1">
											<span className="tw-text-xs  tw-text-grey">Selected Block/Zone</span>
											<ViewMore data={programDetails?.programBlockZones || '-'} className="tw-text-sm tw-text-primaryText tw-font-normal" />

											{/* <span className="tw-text-sm tw-text-primaryText tw-font-normal">{programDetails.programBlockZones}</span> */}
										</div>
									</div>
								</div>

								<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
									<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
										<div>
											<img src={mapIcon} />
										</div>
										<div className="tw-flex tw-flex-col tw-gap-1">
											<span className="tw-text-xs  tw-text-grey">Selected Panchayat/Ward </span>
											<ViewMore data={programDetails?.programPanchayatWards || '-'} className="tw-text-sm tw-text-primaryText tw-font-normal" />

											{/* <span className="tw-text-sm tw-text-primaryText tw-font-normal">{programDetails.programPanchayatWards}</span> */}
										</div>
									</div>
								</div>

								<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
									<div className="tw-flex tw-gap-2 tw-flex-2 tw-items-center">
										<div>
											<img src={mapIcon} />
										</div>
										<div className="tw-flex tw-flex-col tw-gap-1">
											<span className="tw-text-xs  tw-text-grey">Selected Program Village/Area </span>
											<ViewMore data={programDetails?.programVillageAreas || '-'} className="tw-text-sm tw-text-primaryText tw-font-normal" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<Units programId={programDetails.id} programDetails={programDetails} />
					{unitList.length > 0 && <ProgramUnitProgress programId={programDetails.id} />}
					{openStartProgramDialog && (
						<FormDialog open={openStartProgramDialog} close={handleClose} title="Start Program">
							<div>
								<p>Are you sure you want to start this program? Once started, it cannot be deleted. This action is irreversible.</p>
								<div className="tw-pt-8 tw-pb-1 tw-flex tw-justify-end tw-gap-5">
									<div className="tw-grow">
										<Button onClick={handleClose} fullWidth variant="outlined">
											Cancel
										</Button>
									</div>
									<div className="tw-grow">
										<LoadingButton loading={toggleloader} onClick={handleStartProgram} fullWidth variant="contained" color="primary" disableElevation>
											start
										</LoadingButton>
									</div>
								</div>
							</div>
						</FormDialog>
					)}
					{opencloseProgramDialog && (
						<FormDialog open={opencloseProgramDialog} close={handleClose} title="Close Program">
							<div>
								<p>Are you sure you want to close this program?</p> <p> This action is irreversible.</p>
								<div className="tw-pt-8 tw-pb-1 tw-flex tw-justify-end tw-gap-5">
									<div className="tw-grow">
										<Button onClick={handleClose} fullWidth variant="outlined">
											Cancel
										</Button>
									</div>
									<div className="tw-grow">
										<LoadingButton loading={toggleloader} onClick={handleCloseProgram} fullWidth variant="contained" color="error" disableElevation>
											close
										</LoadingButton>
									</div>
								</div>
							</div>
						</FormDialog>
					)}
					{openDeleteDialog && (
						<FormDialog open={openDeleteDialog} close={handleClose} title="Delete Program">
							<div>
								<p>Are you sure you want to delete this program?</p> <p> This action is irreversible.</p>
								<div className="tw-pt-8 tw-pb-1 tw-flex tw-justify-end tw-gap-5">
									<div className="tw-grow">
										<Button onClick={handleClose} fullWidth variant="outlined">
											Cancel
										</Button>
									</div>
									<div className="tw-grow">
										<LoadingButton loading={toggleloader} onClick={handleDeleteProgram} fullWidth variant="contained" color="error" disableElevation>
											Delete
										</LoadingButton>
									</div>
								</div>
							</div>
						</FormDialog>
					)}
					<Popover
						id={id}
						open={open}
						anchorEl={anchorEl}
						onClose={handlePopoverClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
					>
						<div className="tw-flex tw-flex-col tw-justify-start tw-gap-1 tw-p-1">
							<LoadingButton loadingPosition='end' onClick={handleDuplicateProgram} loading={duplicateLoader} startIcon={<img width={20} height={20} src={duplicateIcon} />} className={`!tw-text-secondary !tw-bg-inherit !tw-justify-start`} variant="text">
								Duplicate Program
							</LoadingButton>
							{permissions?.Programs?.delete && (
								<Button
								disabled={programDetails?.status == 'yet to start' ? false : true}
								startIcon={<DeleteIcon />}
								className={`${programDetails?.status == 'yet to start' ? '!tw-text-error' : '!tw-text-grey'} !tw-justify-start`}
								variant="text"
								onClick={() => setOpenDeleteDialog(true)}
							>
								Delete Program
							</Button>
							)}							
						</div>
					</Popover>
				</>
			) : (
				<Box className="tw-text-center tw-py-5">{<CircularProgress />}</Box>
			)}
		</>
	);
}
