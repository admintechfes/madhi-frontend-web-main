import { Button, Popover, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { Box } from '../../components/Loader/style';
import { setLoading } from '../duck/userSlice';
import { ErrorBox } from '../../components/Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LoadingButton } from '@mui/lab';
import moment from 'moment';
import { changeSrPassword, deleteUser, getUserDetails, getUserRoleNameList, checkDependanceTeamMember, getAccessDelegateList, deleteDelegateAcces } from '../duck/network';
import { formatDate } from '../../components/Masters/TableMaster';
import FormDialog, { InfoDialog } from '../../components/Dialog';
import { getCEWDelegateNameList, getCEWNameList, getSrSupervisorNameList, getSupervisorNameList } from '../../Masters/Districts/duck/network';
import CallIcon from '@mui/icons-material/Call';
import access from '../../../public/assets/icons/access_denied.svg';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PersonIcon from '@mui/icons-material/Person';
import DeleteAlert from '../../components/Masters/DeleteAlert';
import { Dropdown } from '../../components/Select';
import DropDownWithSearch from '../../components/Masters/DropDownWithSearch';
import { BasicDatePicker } from '../../components/DatePicker';
import AccessCewDelegate from './AccessCewDelegate';
import ViewMore from '../../components/ViewMore';

export default function UserDetails() {
	const [permissions, setPermissions] = useState({});
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [anchorE, setAnchor] = useState(null);
	const [isForgetPassModalOpen, setIsForgetPassModalOpen] = useState(false);
	const [errorsPassword, setErrorsPassword] = useState({
		password: '',
		confirmPassword: '',
	});
	const [user, setUser] = useState(null);
	const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
	const [isDeleteInfoDialogOpen, setIsDeleteInfoDialogOpen] = useState(false);
	const [trasferDialog, setTrasferDialog] = useState(false);
	const [roleName, setRoleName] = useState([]);
	const [transferName, setTransferName] = useState();
	const [isCEWDelegateModalOpen, setIsCEWDelegateModalOpen] = useState(false);
	const [stopDelegateAlert, setStopDelegateAlert] = useState(false);
	const [checkCEW, setCheckCEW] = useState(true)
	// const [getNetworkName,setGetNetworkName]=useState()
	const [stopDelegateId, setStopDelegateId] = useState()

	const pathname = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const loader = useSelector((state) => state.user.loading);
	const details = useSelector((state) => state.user.userDetails);
	const cewDelegateList = useSelector((state) => state.user.cewDelegateList);
	const srSupervisorNameList = useSelector((state) => state.district.srSupervisorNameList);
	const supervisorNameList = useSelector((state) => state.district.supervisorNameList);
	const CEWData = useSelector((state) => state.district.CEWDelegateNameList);
	// const roleName = useSelector((state) => state.user.userRoleNameList)
	// const params=useParams();
	useEffect(() => {
		const userPermissions = JSON.parse(localStorage.getItem('permissions'));
		setPermissions(userPermissions['Team Members']);
	}, []);

	useEffect(() => {
		dispatch(setLoading(true));
		dispatch(getUserDetails({ id: pathname.id })).then((resp) => {
			if (resp?.role_name === 'Supervisor') {
				dispatch(getSrSupervisorNameList());
				dispatch(getCEWDelegateNameList({ supervisor_id: pathname.id }));
				dispatch(getAccessDelegateList({ delegatedToId: pathname.id }));
			}

		});

		// dispatch(getUserRoleNameList())
		setCheckCEW(true)
		setAnchor(null);
		const userData = localStorage.getItem('user');
		if (userData) {
			const profileDetails = JSON.parse(userData);
			setUser(profileDetails);
			// dispatch(getUserDetails({ id: idProfile.id })).then(resp => setUser(resp))
		}
	}, [pathname.id, stopDelegateId, checkCEW]);


	const open = Boolean(anchorE);
	const close = () => {
		setErrorsPassword({
			password: '',
			confirmPassword: '',
		});
		setPassword('');
		setConfirmPassword('');
		setIsForgetPassModalOpen(false);
	};
	const handleForgetPasswordFormSubmit = (e) => {
		e.preventDefault();

		setErrorsPassword({
			password: '',
			confirmPassword: '',
		});

		if (password.trim() === '') {
			setErrorsPassword((prevErrors) => ({
				...prevErrors,
				password: 'This field is mandatory',
			}));
		}

		if (confirmPassword.trim() === '') {
			setErrorsPassword((prevErrors) => ({
				...prevErrors,
				confirmPassword: 'This field is mandatory',
			}));
		}

		if (password !== confirmPassword) {
			setErrorsPassword((prevErrors) => ({
				...prevErrors,
				confirmPassword: 'New password and confirm password are not match',
			}));
		}
		const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;

		if (!password.match(passwordRegex)) {
			setErrorsPassword((prevErrors) => ({
				...prevErrors,
				password: 'Password must be within 8 to 15 characters with one uppercase letter, one special characters and numbers.',
			}));
		}
		if (!confirmPassword.match(passwordRegex)) {
			setErrorsPassword((prevErrors) => ({
				...prevErrors,
				confirmPassword: 'Password must be within 8 to 15 characters with one uppercase letter, one special characters and numbers.',
			}));
		}

		if (password.trim() === '') {
			setErrorsPassword((prevErrors) => ({
				...prevErrors,
				password: 'This field is mandatory',
			}));
		}

		if (confirmPassword.trim() === '') {
			setErrorsPassword((prevErrors) => ({
				...prevErrors,
				confirmPassword: 'This field is mandatory',
			}));
		}

		if (password !== '' && confirmPassword !== '' && password === confirmPassword && password.match(passwordRegex)) {
			const formData = {
				id: pathname.id,
				password: password,
				password_confirmation: confirmPassword,
			};

			dispatch(changeSrPassword(formData)).then((res) => {
				if (res.data.statusCode === 200) {
					setIsForgetPassModalOpen(false);
					setPassword('');
					setConfirmPassword('');
				}
				if (res.data.statusCode === 422) {
					// setIsForgetPassModalOpen(true);
					// setPassword("")
					// setConfirmPassword("")
				}
			});
		}
	};

	const handleAction = (event) => {
		setAnchor(event.currentTarget);
	};


	const handleClose = () => {
		setAnchor(null);
	};

	const openChangePassword = () => {
		setIsForgetPassModalOpen(true);
	};

	const openCEWDelegate = () => {
		setIsCEWDelegateModalOpen(true);
	};
	// let resultSrSupervisors
	// const seniorSupervisorsInA = details?.role_name !== "CEW" ? srSupervisorNameList?.filter(supervisor => {
	//   return details?.assigned_details?.some(item => item?.senior_supervisor_id === supervisor?.id);
	// })?.map(supervisor => supervisor?.full_name) : "";

	// resultSrSupervisors = seniorSupervisorsInA ? seniorSupervisorsInA?.join(', ') : "-";

	const clearErrors = () => {
		setErrorsPassword((prevErrors) => ({
			...prevErrors,
			password: '',
		}));
	};

	const clearErrorsConform = () => {
		setErrorsPassword((prevErrors) => ({
			...prevErrors,
			confirmPassword: '',
		}));
	};

	const openDeleteMember = () => {
		setIsInfoDialogOpen(true);
		// setTransferName('');
		// if (details?.role_name === 'CEW') {
		// 	dispatch(getCEWNameList()).then((resp) => {
		// 		const updateRoleName = resp?.filter((data) => data?.id !== pathname.id);
		// 		setRoleName(updateRoleName);
		// 	});
		// } else if (details?.role_name === 'Senior Supervisor') {
		// 	dispatch(getSrSupervisorNameList()).then((resp) => {
		// 		const updateRoleName = resp?.filter((data) => data.id !== pathname.id);
		// 		setRoleName(updateRoleName);
		// 	});
		// } else if (details?.role_name === 'Supervisor') {
		// 	dispatch(getSupervisorNameList()).then((resp) => {
		// 		const updateRoleName = resp?.filter((data) => data.id !== pathname.id);
		// 		setRoleName(updateRoleName);
		// 	});
		// }
	};

	// const closeDelete = () => setIsDeleteInfoDialogOpen(false);

	const closeDelete = () => setIsDeleteInfoDialogOpen(false);
	const closeDeleteInfo = () => setIsInfoDialogOpen(false);
	const onChangeDropDownFilter = (e, type) => {
		setTransferName(e);
		if (type == 'CEW') {
			dispatch(getCEWNameList({ search: '' })).then((resp) => {
				const updateRoleName = resp?.filter((data) => data.id !== pathname.id);
				setRoleName(updateRoleName);
			});
		}

		if (type === 'Senior Supervisor') {
			dispatch(getSrSupervisorNameList({ search: '' })).then((resp) => {
				const updateRoleName = resp?.filter((data) => data.id !== pathname.id);
				setRoleName(updateRoleName);
			});
		}

		if (type === 'Supervisor') {
			dispatch(getSupervisorNameList({ search: '' })).then((resp) => {
				const updateRoleName = resp?.filter((data) => data.id !== pathname.id);
				setRoleName(updateRoleName);
			});
		}
	};

	const handleTransfer = () => {
		setIsInfoDialogOpen(false);
		setTrasferDialog(true);
	};

	const closeTrasferDelete = () => {
		setTrasferDialog(false);
	};

	const handleSearchDrop = (txt, type) => {
		if (type == 'CEW') {
			dispatch(getCEWNameList({ search: txt })).then((resp) => {
				const updateRoleName = resp?.filter((data) => data.id !== pathname.id);
				setRoleName(updateRoleName);
			});
		}

		if (type === 'Senior Supervisor') {
			dispatch(getSrSupervisorNameList({ search: txt })).then((resp) => {
				const updateRoleName = resp?.filter((data) => data.id !== pathname.id);
				setRoleName(updateRoleName);
			});
		}

		if (type === 'Supervisor') {
			dispatch(getSupervisorNameList({ search: txt })).then((resp) => {
				const updateRoleName = resp?.filter((data) => data.id !== pathname.id);
				setRoleName(updateRoleName);
			});
		}
	};

	const handleTransferRecords = () => {
		dispatch(deleteUser({ id: pathname?.id }));
		navigate('/team-members');
	};

	const closeIsCEWDelegateModalOpen = () => {
		setIsCEWDelegateModalOpen(false);
	};

	const handleDelegateCancel = () => {
		setIsCEWDelegateModalOpen(false);
	};

	const handleStopDelegateAlertCancel = () => {
		setStopDelegateAlert(() => false);
	};

	const handleStopDelegate = (stopId) => {
		setStopDelegateId(stopId)
		setStopDelegateAlert(true);
	};

	const handleConfirmStopDelegateAlert = () => {

		dispatch(deleteDelegateAcces(stopDelegateId))
		setStopDelegateAlert(false);
		setStopDelegateId()
		// setIsCEWDelegateModalOpen(false)
	};

	const handleDeleteDependance = () => {
		dispatch(checkDependanceTeamMember({ id: details.id, isSuccess: true })).then((resp) => {
			if (resp?.statusCode == 200) {
				dispatch(deleteUser({ id: details.id })).then((resp) => {
					navigate('/team-members');
					setIsInfoDialogOpen(false);
				});
			} else if (resp?.data?.statusCode == 422) {
				setIsInfoDialogOpen(false);
				setIsDeleteInfoDialogOpen(true);
			}
		});
	};

	const formatText = (text) => {
		return text?.split(",").join(", ");
	};

	

	const GotoActivitylog = (details) => {
     navigate('/view-activity-log', { state: { details: details } });
	}


	return (
		<>
			{!loader ? (
				<div>
					<div className="tw-flex tw-items-center tw-w-full tw-justify-between">
						<div className="tw-flex tw-justify-center ">
							<Link
								to={searchParams.get('redirect') == 'program' ? `/progress/village-users/${searchParams.get('villageAreaId')}?programId=${searchParams.get('programId')}&tab=${searchParams.get('tab')}` : '/team-members'}
							>
								<ArrowBackIcon className="tw-text-grey" />
								<span className="tw-text-grey tw-ml-2 tw-mt-2 tw-text-sm tw-leading-normal">{searchParams.get('redirect') == 'program' ? 'Back' : 'Team member'}</span>
							</Link>
						</div>

						<div className="tw-flex tw-gap-5">
							{details?.role_name === 'Supervisor' && (user?.role_type === 'admin' || user?.role_type === 'srsupervisor') && (
								<div>
									<Button variant="contained" onClick={handleAction} className="!tw-bg-white !tw-text-primary !tw-font-semibold">
										Actions
									</Button>
								</div>
							)}
							{permissions?.delete && details?.role_name !== 'Supervisor' && (
								<Button variant="outlined" className="!tw-bg-none !tw-text-error !tw-border-error !tw-text-base" onClick={openDeleteMember}>
									Delete Member
								</Button>
							)}
							{/* {permissions?.delete && user?.role_type !== 'admin' && details?.role_name !== 'Supervisor'&& (
							<Button variant="outlined" className="!tw-bg-none !tw-text-error !tw-border-error !tw-text-base" onClick={openDeleteMember}>
								Delete Member
							</Button>
						)} */}

							{permissions?.update && (
								<Button onClick={() => navigate(`/team-member/update/${pathname.id}`)} variant="outlined" className="!tw-bg-none !tw-text-secondary !tw-text-base">
									Edit Info
								</Button>
							)}


						</div>
					</div>

					{stopDelegateAlert && (
						<FormDialog open={stopDelegateAlert} close={handleStopDelegateAlertCancel} title="Stop Delegate Access">
							<div>
								<p>Are you sure you want to stop this delegate access.</p> <p> This action is not reversible.</p>
								<div className="tw-pt-8 tw-pb-1 tw-flex tw-justify-end tw-gap-5">
									<div className="tw-grow">
										<Button onClick={handleStopDelegateAlertCancel} fullWidth variant="outlined">
											Cancel
										</Button>
									</div>
									<div className="tw-grow">
										<LoadingButton onClick={handleConfirmStopDelegateAlert} fullWidth variant="contained" color="error" disableElevation>
											Stop
										</LoadingButton>
									</div>
								</div>
							</div>
						</FormDialog>
					)}
					{isForgetPassModalOpen ? (
						<div>
							<FormDialog open={isForgetPassModalOpen} close={close} title="Change Password">
								<form onSubmit={handleForgetPasswordFormSubmit} className="tw-max-w-[400px] tw-mx-auto tw-py-2">
									<div className="tw-flex tw-flex-col tw-gap-6">
										<div className="text-center">
											<TextField
												variant="outlined"
												fullWidth
												size="small"
												label="New Password"
												type="text"
												value={password}
												onChange={(e) => {
													setPassword(e.target.value);
													if (errorsPassword.password) {
														clearErrors();
													}
												}}
												error={Boolean(errorsPassword.password)}
												helperText={errorsPassword.password || ''}
											/>
										</div>
										<div className="text-center">
											<TextField
												variant="outlined"
												fullWidth
												size="small"
												label="Confirm Password"
												type="text"
												value={confirmPassword}
												onChange={(e) => {
													setConfirmPassword(e.target.value);
													if (errorsPassword.confirmPassword) {
														clearErrorsConform();
													}
												}}
												error={Boolean(errorsPassword.confirmPassword)}
												helperText={errorsPassword.confirmPassword}
											/>
										</div>
									</div>
									<div className="tw-text-center tw-pt-10">
										<Button variant="contained" type="submit" disableElevation fullWidth className="tw-px-[105px] !tw-text-white !tw-text-base">
											Change Password
										</Button>
									</div>
								</form>
							</FormDialog>
						</div>
					) : null}
					<Popover
						sx={{
							'& .MuiPaper-root': {
								padding: '16px',
								overflow: 'visible',
								display: 'flex',
								flexDirection: 'column',
							},
						}}
						id={1}
						open={open}
						anchorEl={anchorE}
						onClose={handleClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
					>
						{details?.role_name === 'Senior Supervisor' && user?.role_type === 'admin' && (
							<Button className="!tw-text-md   !tw-text-primaryText !tw-font-medium  !tw-border-none  tw-pb-2 !tw-px-2   !tw-shadow-none" onClick={openChangePassword}>
								Change Password
							</Button>
						)}
						{details?.role_name === 'Supervisor' && (
							<Button className="!tw-text-md   !tw-text-primaryText !tw-font-medium  !tw-border-none  tw-pb-2 !tw-px-2   !tw-shadow-none" onClick={openCEWDelegate}>
								CEW Delegate Access
							</Button>
						)}



						{permissions?.delete && (
							<Button variant="outlined" className="!tw-text-md  !tw-text-[#f44336] tw-font-medium  tw-pt-2 !tw-px-2 !tw-border-none !tw-shadow-none !tw-flex !tw-justify-start " onClick={openDeleteMember}>
								Delete Member
							</Button>
						)}
					</Popover>

					{isInfoDialogOpen ? (
						<div>
							<DeleteAlert open={isInfoDialogOpen} close={closeDeleteInfo} title={`Delete account?`}>
								<p className="tw-w-[95%]">Are you sure you want to delete {details?.full_name} account.</p>
								<div className="tw-pt-8 tw-flex tw-gap-10  ">
									<Button variant="outlined" className="!tw-text-secondary tw-flex-grow" onClick={() => setIsInfoDialogOpen(false)}>
										Cancel
									</Button>
									<Button variant="contained" className="!tw-text-white tw-flex-grow" color="error" onClick={handleDeleteDependance}>
										Delete
									</Button>
								</div>
							</DeleteAlert>
						</div>
					) : null}

					{isDeleteInfoDialogOpen ? (
						<InfoDialog open={isDeleteInfoDialogOpen} close={closeDelete}>
							<div className="tw-text-center">
								<img className="tw-mx-auto" src={access} />
								<h3 className="tw-font-bold tw-text-inter tw-pt-5 tw-text-[20px] tw-text-secondaryText">Unable to delete</h3>
								<p className="tw-pt-5">Already linked to an active program.</p>

								<div className="tw-pt-5">
									<Button
										onClick={() => {
											setIsDeleteInfoDialogOpen(false);
										}}
										variant="contained"
										fullWidth
										disableElevation
										className="tw-px-[105px] !tw-text-white "
									>
										Okay
									</Button>
								</div>
							</div>
						</InfoDialog>
					) : null}

					{isCEWDelegateModalOpen ? (
						<AccessCewDelegate isCEWDelegateModalOpen={isCEWDelegateModalOpen} setCheckCEW={setCheckCEW} id={pathname?.id} closeIsCEWDelegateModalOpen={closeIsCEWDelegateModalOpen} handleDelegateCancel={handleDelegateCancel} CEWData={CEWData} />
					) : null}
					{trasferDialog ? (
						<div>
							<DeleteAlert open={trasferDialog} close={closeTrasferDelete} title={`Select ${details?.role_name} to transfer  ${details?.full_name} parents record`}>
								{/* <Dropdown
                options={roleName}
                onChange={(e) => onChangeDropDownFilter(e, details?.role_name)}
                value={transferName}
                valuekey="id"
                labelkey="full_name"
                label={`Select  ${details?.role_name} account`}
              /> */}

								{details?.role_name === 'CEW' && (
									<DropDownWithSearch
										options={roleName}
										valuekey="id"
										labelkey="full_name"
										label={`Select  ${details?.role_name} account`}
										listSearch={getCEWNameList}
										searchText={(txt) => handleSearchDrop(txt, details?.role_name)}
										onChange={(e) => {
											onChangeDropDownFilter(e, details?.role_name);
										}}
										value={transferName}
									/>
								)}
								{details?.role_name === 'Senior Supervisor' && (
									<DropDownWithSearch
										options={roleName}
										valuekey="id"
										labelkey="full_name"
										label={`Select  ${details?.role_name} account`}
										listSearch={getSrSupervisorNameList}
										searchText={(txt) => handleSearchDrop(txt, details?.role_name)}
										onChange={(e) => {
											onChangeDropDownFilter(e, details?.role_name);
										}}
										value={transferName}
									/>
								)}
								{details?.role_name === 'Supervisor' && (
									<DropDownWithSearch
										options={roleName}
										valuekey="id"
										labelkey="full_name"
										label={`Select  ${details?.role_name} account`}
										listSearch={getSupervisorNameList}
										searchText={(txt) => handleSearchDrop(txt, details?.role_name)}
										onChange={(e) => {
											onChangeDropDownFilter(e, details?.role_name);
										}}
										value={transferName}
									/>
								)}

								<div className="tw-pt-8">
									<Button variant="contained" className="!tw-text-white !tw-w-[100%] " disabled={transferName === ''} onClick={handleTransferRecords}>
										Transfer Records and Delete Account
									</Button>
								</div>
							</DeleteAlert>
						</div>
					) : null}

					<div className="tw-pt-2">
						<h2 className="tw-text-secondaryText tw-font-bold tw-text-2xl ">{details?.full_name || '-'}</h2>
					</div>
					<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
						<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
							Basic Info
						</Typography>
						<div className="tw-flex  tw-gap-x-10 tw-gap-y-6 tw-flex-wrap tw-pt-6">
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div>
									<CallIcon className="tw-text-grey" />
								</div>
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Mobile No.</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.mobile || '-'}</span>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div>
									<MailOutlineIcon className="tw-text-grey" />
								</div>
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Email</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.email || '-'}</span>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div>
									<WorkOutlineIcon className="tw-text-grey" />
								</div>
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Role</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.role_name || '-'}</span>
								</div>
							</div>

							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div>
									<InfoOutlinedIcon className="tw-text-grey" />
								</div>
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Created On </span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.created_at ? formatDate(details.created_at) : '-'}</span>
								</div>
							</div>
						</div>
					</div>
					<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
						<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
							Location Details
						</Typography>

						<div className="tw-flex  tw-gap-x-10 tw-gap-y-6 tw-flex-wrap tw-pt-6">
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div>
									<FmdGoodIcon className="tw-text-grey" />
								</div>
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Assigned District</span>
								
									<ViewMore data={details?.assigned_districts || '-'} className="tw-text-sm tw-text-primaryText tw-font-normal" />

								</div>
							</div>
							{details?.role_name === 'CEW' && (
								<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
									<div>
										<FmdGoodIcon className="tw-text-grey" />
									</div>
									<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
										<span className="tw-text-xs  tw-text-grey">Assigned Block/Zone</span>
										{/* <span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.assigned_details?.assigned_block_zone || '-'}</span> */}
										<ViewMore data={details?.assigned_details?.assigned_block_zone  || '-'} className="tw-text-sm tw-text-primaryText tw-font-normal" />
									</div>
								</div>
							)}
							{details?.role_name === 'CEW' && (
								<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
									<div>
										<FmdGoodIcon className="tw-text-grey" />
									</div>
									<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
										<span className="tw-text-xs tw-text-grey">Assigned Panchayat/Ward</span>
									
										<ViewMore data={formatText(details?.assigned_details?.assigned_panchayat_ward) || "-"} className="tw-text-sm tw-text-primaryText tw-font-normal  tw-break-words" />
									</div>
								</div>
							)}
							{details?.role_name === 'CEW' && (
								<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
									<div>
										<FmdGoodIcon className="tw-text-grey" />
									</div>
									<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
										<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
											<span className="tw-text-xs  tw-text-grey">Assigned Village/Area</span>
											<ViewMore data={formatText(details?.assigned_details?.assigned_village_area) || "-"} className="tw-text-sm tw-text-primaryText tw-font-normal !tw-flex-wrap" />
										</div>
										
									</div>
								</div>
							)}
							{details?.role_name === 'Supervisor' && (
								<div className="tw-flex tw-items-start tw-gap-x-2 tw-self-stretch tw-w-[250px]">
									<div>
										<PersonIcon className="tw-text-grey" />
									</div>
									<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
										<span className="tw-text-xs tw-text-grey">Assigned Senior Supervisor</span>
										{/* <span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.assigned_senior_supervisors || '-'}</span> */}
										<ViewMore data={details?.assigned_senior_supervisors || '-'} className="tw-text-sm tw-text-primaryText tw-font-normal" />
									</div>
								</div>
							)}

							{details?.role_name === 'CEW' && (
								<div className="tw-flex tw-items-start tw-gap-x-2 tw-self-stretch tw-w-[250px]">
									<div>
										<PersonIcon className="tw-text-grey" />
									</div>
									<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
										<span className="tw-text-xs tw-text-grey">Assigned Supervisor</span>
										<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.assigned_details?.assigned_supervisor ? details?.assigned_details?.assigned_supervisor : '-'}</span>
									</div>
								</div>
							)}
						</div>
					</div>

					{details?.role_name === 'Supervisor' && (
						cewDelegateList?.data?.length > 0 && <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
							<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
								CEW Delegate Access
							</Typography>

							{cewDelegateList?.data?.map((item) => (
								<div className="tw-flex tw-justify-between tw-w-[100%] ">
									<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
										<div>
											<WorkOutlineIcon className="tw-text-grey" />
										</div>
										<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
											<span className="tw-text-xs  tw-text-grey">CEW accounts</span>
											<span className="tw-text-sm tw-text-primaryText tw-font-normal">{item?.CEWName}</span>
										</div>
									</div>

									<div>
										<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[300px] ">
											<div>
												<CalendarMonthIcon className="tw-text-grey" />
											</div>
											<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
												<span className="tw-text-xs  tw-text-grey">Start and End date of the delegate access</span>
												<span className="tw-text-sm tw-text-primaryText tw-font-normal">
													{item?.startedAt} - {item?.endedAt}
												</span>
											</div>
										</div>
									</div>
									<div>
										<Button variant="outlined" onClick={() => handleStopDelegate(item?.id)} className="!tw-bg-none !tw-text-secondary !tw-text-base">
											Stop Delegate Access
										</Button>
									</div>
								</div>
							))}
						</div>
					)}

					<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
						<div className='tw-flex tw-w-full tw-justify-between tw-items-center'>
							<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">Activity log</Typography>
							<Button variant='outlined' onClick={() => GotoActivitylog(details)}>View Details</Button>
						</div>
					</div>
				</div>
			) : (
				<Box className="tw-text-center tw-py-5">{<CircularProgress />}</Box>
			)}
		</>
	);
}
