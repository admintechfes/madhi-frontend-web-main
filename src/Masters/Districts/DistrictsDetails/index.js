import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { checkDependanceDistrict, deleteDistrict, getDistrictDetails, getDistrictNameList } from '../duck/network';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../duck/DistrictsSlice';
import { CircularProgress } from '@mui/material';
import { Box } from '../../../components/Loader/style';
import DeleteAlert from '../../../components/Masters/DeleteAlert';
import { Dropdown } from '../../../components/Select';
import DropDownWithSearch from '../../../components/Masters/DropDownWithSearch';
import { InfoDialog } from '../../../components/Dialog';
// import DeleteAlert from '../../components/Masters/DeleteAlert';
import access from '../../../../public/assets/icons/access_denied.svg';
import ViewMore from '../../../components/ViewMore';

export default function DistrictsDetails() {
	const pathname = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
	const [trasferDialog, setTrasferDialog] = useState(false);
	const [transferName, setTransferName] = useState();
	const [roleName, setRoleName] = useState([]);
	const [permissions, setPermissions] = useState({});
	const [isDeleteInfoDialogOpen, setIsDeleteInfoDialogOpen] = useState(false);

	const loader = useSelector((state) => state.district.loading);
	const details = useSelector((state) => state.district.districtDetails);

	useEffect(() => {
		dispatch(setLoading(true));
		dispatch(getDistrictDetails({ id: pathname.id }));
	}, [pathname.id]);

	const openDeleteMember = () => {
		setIsInfoDialogOpen(true);
		setTransferName('');
		dispatch(getDistrictNameList()).then((resp) => {
			const updateRoleName = resp.filter((data) => data.district_id !== pathname.id);
			setRoleName(updateRoleName);
		});
	};

	useEffect(() => {
		const userPermissions = JSON.parse(localStorage.getItem('permissions'));
		setPermissions(userPermissions['Masters']['Districts']);
	}, []);

	const handleTransfer = () => {
		setIsInfoDialogOpen(false);
		setTrasferDialog(true);
	};

	const closeTrasferDelete = () => {
		setTrasferDialog(false);
	};

	const closeDelete = () => setIsDeleteInfoDialogOpen(false);
	const onChangeDropDownFilter = (e, type) => {
		setTransferName(e);

		dispatch(getDistrictNameList()).then((resp) => {
			const updateRoleName = resp.filter((data) => data.id !== pathname.id);
			setRoleName(updateRoleName);
		});
	};

	const handleSearchDrop = (txt, type) => {
		// dispatch(getDistrictNameList())

		dispatch(getDistrictNameList(txt)).then((resp) => {
			const updateRoleName = resp?.filter((data) => data.district_id !== pathname.id);
			setRoleName(updateRoleName);
		});
	};

	// const handleTransferRecords = () => {
	// 	dispatch(deleteDistrict({ id: pathname?.id }));
	// 	navigate('/masters/districts');
	// };

	const handleDeleteDependance = () => {
		dispatch(checkDependanceDistrict({ id: details.id })).then((resp) => {
			if (resp?.statusCode == 200) {
				dispatch(deleteDistrict({ id: details.id }));
				setIsInfoDialogOpen(false);
				navigate('/masters/districts');
			} else if (resp?.data?.statusCode == 422) {
				setIsInfoDialogOpen(false);
				setIsDeleteInfoDialogOpen(true);
			}
		});
	};


	const closeDeleteInfo = () => setIsInfoDialogOpen(false);
	return (
		<>
			{!loader ? (
				<div>
					<div className="tw-flex tw-items-center tw-w-full tw-justify-between">
						<div className="tw-flex tw-justify-center ">
							<Link to="/masters/districts">
								<ArrowBackIcon className="tw-text-grey" />
								<span className="tw-text-grey tw-ml-2 tw-mt-2 tw-text-sm tw-leading-normal">Districts</span>
							</Link>
						</div>
						<div className="tw-flex tw-gap-5">
							{permissions?.delete && <Button onClick={openDeleteMember} variant="outlined" className="!tw-bg-none !tw-text-error !tw-border-error !tw-text-base">
								Delete
							</Button>}
							{permissions?.update && (
								<Button onClick={() => navigate(`/district/update/${pathname.id}`)} className="!tw-bg-primary !tw-text-white">
									Edit Info
								</Button>
							)}
						</div>
					</div>

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
					{trasferDialog ? (
						<div>
							<DeleteAlert open={trasferDialog} close={closeTrasferDelete} title={`Select district to transfer ${details?.name} parents record`}>
								<DropDownWithSearch
									options={roleName}
									valuekey="district_id"
									labelkey="name"
									label={`Select district account`}
									listSearch={getDistrictNameList}
									searchText={(txt) => handleSearchDrop(txt, 'district')}
									onChange={(e) => {
										onChangeDropDownFilter(e, 'district_id');
									}}
									value={transferName}
								/>
								<div className="tw-pt-8">
									<Button variant="contained" className="!tw-text-white !tw-w-[100%] " onClick={handleTransferRecords} disabled={transferName === ''}>
										Transfer Records and Delete Account
									</Button>
								</div>
							</DeleteAlert>
						</div>
					) : null}
					<div className="tw-pt-2">
						<h2 className="tw-text-secondaryText tw-font-bold tw-text-2xl ">{details?.name || '-'}</h2>
					</div>
					<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
						<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
							District Info
						</Typography>
						<div className="tw-flex  tw-gap-x-10 tw-gap-y-6 tw-flex-wrap tw-pt-6">
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">State</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details.state || '-'}</span>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">District Name</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.name || '-'}</span>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Assigned Block/Zone</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.assigned_block_zones || '-'}</span>
								</div>
							</div>

							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Assigned Panchayat/Ward </span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details.assigned_panchayat_wards || '-'}</span>
								</div>
							</div>

							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Assigned Village</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details.assigned_village_areas || '-'}</span>
								</div>
							</div>
						</div>
					</div>
					<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
						<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
							Other Details
						</Typography>
						<div className="tw-flex  tw-gap-x-10 tw-gap-y-6 tw-flex-wrap tw-pt-6">
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">No.of Panchayat/Ward</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.no_of_panchayat_wards || '0'}</span>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">No.of Block/Zone</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.no_of_block_zones || '0'}</span>
								</div>
							</div>

							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">No.of Village/Area</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.no_of_village_areas || '0'}</span>
								</div>
							</div>

							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">No.of Total Parents</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.no_of_parents || '0'}</span>
								</div>
							</div>

							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">No.of Programs Assigned</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.no_of_programs_assigned || '0'}</span>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">No.of Supervisors</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.no_of_supervisors || '0'}</span>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">No.of CEWs</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.no_of_cews || '0'}</span>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Assigned Senior Supervisor</span>
									<ViewMore data={details?.assigned_senior_supervisors || '-'} className="tw-text-sm tw-text-primaryText tw-font-normal" />
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
