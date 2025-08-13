import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { VillageGroupWhatsAppStatusAction, checkDependanceVillage, deleteVillage, getGroupWhatsAppStatusList, getVillageDetails } from '../duck/network';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '../../../components/Loader/style';
import { CircularProgress } from '@mui/material';
import { setLoading } from '../duck/VillageSlice';
import { getVillageNameList } from '../../Districts/duck/network';
import DeleteAlert from '../../../components/Masters/DeleteAlert';
import DropDownWithSearch from '../../../components/Masters/DropDownWithSearch';
import access from '../../../../public/assets/icons/access_denied.svg';
import { FormDialog2, InfoDialog } from '../../../components/Dialog';
import ViewMore from '../../../components/ViewMore';
import EnhancedTable from '../../../components/Masters/villagewhatsapptable';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';


const header = [
	{
		id: "name",
		numeric: false,
		disablePadding: true,
		label: "Member",
		sort: true,
		width: 180,
	},
	{
		id: "role",
		numeric: false,
		disablePadding: true,
		label: "Role",
		sort: true,
		width: 180,
	},
	{
		id: "status",
		numeric: false,
		disablePadding: true,
		label: "Status",
		sort: true,
		width: 180,
	},
	{
		id: "action",
		numeric: false,
		disablePadding: true,
		label: "Actions",
		sort: true,
		width: 180,
	}
]



export default function VillageDetails() {
	const pathname = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const details = useSelector((state) => state.village.villageDetails);
	const loader = useSelector((state) => state.village.loading);
	const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
	const [trasferDialog, setTrasferDialog] = useState(false);
	const [transferName, setTransferName] = useState();
	const [roleName, setRoleName] = useState([]);
	const [permissions, setPermissions] = useState({});
	const [isDeleteInfoDialogOpen, setIsDeleteInfoDialogOpen] = useState(false);
	const [list, setList] = useState([]);
	const [page, setPage] = useState(1);
	const [limitPerPage, setLimitPerPage] = useState(10);
	const paginateInfo = useSelector((state) => state.village.statuspaginateInfo)
	const [openDeleteDialog, setOpenDeleteDialog] = useState({
		show: false,
		text: "",
		userId: "",
		userName: "",
	})
	const GroupInfo = useSelector((state) => state.village.whatsAppGroupInfo)
  const statusLoading = useSelector((state) => state.village.statusLoading) 

	useEffect(() => {
		dispatch(getGroupWhatsAppStatusList({
			page: page,
			per_page: limitPerPage,
			village_id: pathname.id
		})).then((res) => formatForDisplay(res?.data))
	}, [page, limitPerPage])

	const formatForDisplay = data => {
		const formatedRows = []
		Array.isArray(data) &&
			data?.forEach((item, index) => {
				formatedRows.push({
					"name": item.name,
					"role": item.role,
					"status": item.status,
					"user_id": item.user_id,
				})
			})
		setList(formatedRows);
	}

	useEffect(() => {
		const userPermissions = JSON.parse(localStorage.getItem('permissions'));
		setPermissions(userPermissions['Masters']['Village/Area']);
	}, []);

	useEffect(() => {
		dispatch(setLoading(true));
		dispatch(getVillageDetails({ id: pathname.id }));
	}, [pathname.id]);

	const openDeleteMember = () => {
		setIsInfoDialogOpen(true);
		setTransferName('');
		dispatch(getVillageNameList({ block_zone_id: details?.block_zone_id })).then((resp) => {
			const updateRoleName = resp.filter((data) => data.panchayat_ward_id !== pathname.id);
			setRoleName(updateRoleName);
		});
	};

	const handleTransfer = () => {
		setIsInfoDialogOpen(false);
		setTrasferDialog(true);
	};

	const closeTrasferDelete = () => {
		setTrasferDialog(false);
	};

	const closeDelete = () => setIsDeleteInfoDialogOpen(false);
	const closeDeleteInfo = () => setIsInfoDialogOpen(false);

	const onChangeDropDownFilter = (e, type) => {
		setTransferName(e);

		dispatch(getVillageNameList({ block_zone_id: details?.block_zone_id })).then((resp) => {
			const updateRoleName = resp.filter((data) => data.panchayat_ward_id !== pathname.id);
			setRoleName(updateRoleName);
		});
	};

	const handleSearchDrop = (txt, type) => {
		// dispatch(getDistrictNameList())

		dispatch(getVillageNameList({ block_zone_id: details?.block_zone_id, search: txt })).then((resp) => {
			const updateRoleName = resp?.filter((data) => data.panchayat_ward_id !== pathname.id);
			setRoleName(updateRoleName);
		});
	};

	const handleTransferRecords = () => {
		dispatch(deleteVillage({ id: pathname?.id }));
		navigate('/masters/panchayat_ward');
	};

	const handleDeleteDependance = () => {
		dispatch(checkDependanceVillage({ id: details.id, isSuccess: true })).then((resp) => {
			if (resp?.statusCode == 200) {
				dispatch(deleteVillage({ id: details.id })).then((resp) => {
					navigate('/masters/village_area');
					setIsInfoDialogOpen(false);
				});
			} else if (resp?.data?.statusCode == 422) {
				setIsInfoDialogOpen(false);
				setIsDeleteInfoDialogOpen(true);
			}
		});
	};

	const onPageChange = (page) => {
		setPage(page)
	}

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

	let BackgroundTheme =
		details?.glific_whatsapp_group_status?.toLowerCase() === 'created' ? '#57C79633' :
			details?.glific_whatsapp_group_status?.toLowerCase() === 'not initiated' ? '#FFC40C33' : ""

	let ColorTheme =
		details?.glific_whatsapp_group_status?.toLowerCase() === 'created' ? '#57C796' :
			details?.glific_whatsapp_group_status?.toLowerCase() === 'not initiated' ? '#F39C35' : "";

	const onAction = (text, user_id, name) => {
		setOpenDeleteDialog({
			show: true,
			text: text,
			userId: user_id,
			userName: name
		})
	}

	const onSendAction = () => {
		dispatch(VillageGroupWhatsAppStatusAction({
			status: openDeleteDialog?.text?.includes("promote") ? "make-admin" : openDeleteDialog?.text?.includes("demote") ? "remove-admin" : "send-invite",
			villageAreaId: pathname?.id,
			assignUserId: openDeleteDialog?.userId,
			assignUserName: openDeleteDialog?.userName,
			groupName: GroupInfo?.name,
			groupConversationId: GroupInfo.id
		})).then((res) => {
			if (res?.status === 200) {
				dispatch(getGroupWhatsAppStatusList({
					page: page,
					per_page: limitPerPage,
					village_id: pathname.id
				})).then((res) => formatForDisplay(res.data))
			}
		})
		setOpenDeleteDialog({
			show: false
		})
	}

	const onRefreshStatus = () => {
		dispatch(getGroupWhatsAppStatusList({
			page: page,
			village_id: pathname.id,
			per_page: limitPerPage
		})).then((res) => formatForDisplay(res.data))
	}

	const handleCloseDialog = () => {
		setOpenDeleteDialog({
			show: false
		})
	}

	return (
		<>
			{!loader ? (
				<div>
					<div className="tw-flex tw-items-center tw-w-full tw-justify-between">
						<div className="tw-flex tw-justify-center ">
							<Link to="/masters/village_area">
								<ArrowBackIcon className="tw-text-grey" />
								<span className="tw-text-grey tw-ml-2 tw-mt-2 tw-text-sm tw-leading-normal">Village/Area</span>
							</Link>
						</div>
						<div className="tw-flex tw-gap-5">
							{permissions?.delete && (
								<Button onClick={openDeleteMember} variant="outlined" className="!tw-bg-none !tw-text-error !tw-border-error !tw-text-base">
									Delete
								</Button>
							)}
							{permissions?.update && (
								<Button onClick={() => navigate(`/village-area/update/${pathname.id}`)} className="!tw-bg-primary !tw-text-white">
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
							<DeleteAlert open={trasferDialog} close={closeTrasferDelete} title={`Select Village/Area to transfer ${details?.name} parents record`}>
								<DropDownWithSearch
									options={roleName}
									valuekey="village_area_id"
									labelkey="name"
									label={`Select Village/Area account`}
									listSearch={getVillageNameList}
									searchText={(txt) => handleSearchDrop(txt, 'village_area_id')}
									onChange={(e) => {
										onChangeDropDownFilter(e, 'village_area_id');
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
							Village/Area Info
						</Typography>
						<div className="tw-flex  tw-gap-x-10 tw-gap-y-6 tw-flex-wrap tw-pt-6">
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Village/Area Name</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.name || '-'}</span>
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Panchayat/Ward </span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.assigned_panchayat_ward || '-'}</span>
								</div>
							</div>

							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Block/Zone</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details.assigned_block_zone || '-'}</span>
								</div>
							</div>

							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Assigned District</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details.assigned_district || '-'}</span>
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
									<span className="tw-text-xs  tw-text-grey">Assigned CEW</span>
									<ViewMore data={details?.assigned_cews || '-'} className="tw-text-sm tw-text-primaryText tw-font-normal" />
								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Assigned Supervisor</span>
									{/* <span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.assigned_supervisors || '-'}</span> */}
									<ViewMore data={details?.assigned_supervisors || '-'} className="tw-text-sm tw-text-primaryText tw-font-normal" />

								</div>
							</div>
							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">Assigned sr. Supervisor</span>
									{/* <span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.assigned_senior_supervisors || '-'}</span> */}
									<ViewMore data={details?.assigned_senior_supervisors || '-'} className="tw-text-sm tw-text-primaryText tw-font-normal" />

								</div>
							</div>

							<div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
								<div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
									<span className="tw-text-xs  tw-text-grey">No.of Total Parents</span>
									<span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.no_of_parents || '0'}</span>
								</div>
							</div>
						</div>
					</div>

					<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
						<div className='tw-flex tw-justify-between tw-items-start tw-mb-5 tw-w-full'>
							<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
								WhatsApp Group Status
							</Typography>
						</div>
						<div className='tw-w-full tw-flex tw-justify-between tw-items-start'>
							<div className='tw-flex tw-gap-20'>
								<div className='tw-flex tw-flex-col tw-gap-1'>
									<span className="tw-text-xs tw-text-grey tw-font-normal">Group Status</span>
									<div className='tw-text-sm tw-text-center tw-rounded tw-p-1' style={{ backgroundColor: BackgroundTheme, color: ColorTheme }}>{details?.glific_whatsapp_group_status}</div>
								</div>
								{details?.glific_whatsapp_group_invite_link &&
									<div className='tw-flex tw-flex-col tw-gap-1'>
										<span className="tw-text-xs tw-text-grey tw-font-normal">Generated WhatsApp Group Link</span>
										<div className='tw-flex tw-gap-2 tw-items-center'>
											<span className='tw-text-sm tw-line-clamp-3'>{details?.glific_whatsapp_group_invite_link}</span>
											<button onClick={() => handleCopy(details?.glific_whatsapp_group_invite_link)}>
												<ContentCopyIcon className='!tw-text-gray !tw-w-5 !tw-h-5' />
											</button>
										</div>
									</div>}
							</div>
							{details?.glific_whatsapp_group_invite_link && <Button variant='outlined' onClick={onRefreshStatus}>Refresh Status</Button>}
						</div>

						{details?.glific_whatsapp_group_invite_link && <div className='tw-relative tw-flex tw-justify-center tw-w-full tw-items-center'>
							{!statusLoading ?
								list.length ? <EnhancedTable paginate={paginateInfo} scrollable columns={header}
									data={list} onPageChange={onPageChange} page={page} details={false}
									keyProp="uuid" setLimitPerPage={setLimitPerPage}
									limitPerPage={limitPerPage} onAction={onAction} setPage={setPage} /> :
									<div className='tw-text-secondaryText tw-w-full tw-font-normal tw-text-sm tw-text-center'>
										<span>No Data found</span>
									</div>
								:
								<div className="tw-text-center tw-py-5">{<CircularProgress />}</div>
							}
						</div>}

					</div>
					<FormDialog2 open={openDeleteDialog?.show} hideClose={true} title={openDeleteDialog?.text} close={handleCloseDialog} maxWidth={"590px"} >
						<Button variant='contained' onClick={onSendAction} className='tw-w-full'>Okay</Button>
					</FormDialog2>

				</div>
			) : (
				<Box className="tw-text-center tw-py-5">{<CircularProgress />}</Box>
			)}
		</>
	);
}
