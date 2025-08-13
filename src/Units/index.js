import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import EnhancedTable from '../components/Units/Table';
import { deleteUnit, duplicateUnit, getUnitList } from './duck/network';

import { Box, Button, CircularProgress, Grid, InputAdornment, Paper, Popover, TextField, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalculateIcon from '@mui/icons-material/Calculate';

import duplicateIcon from '../../public/assets/icons/duplicate.svg';
import duplicateDisableIcon from '../../public/assets/icons/duplicate_disable.svg';
import { resetUnitList } from './duck/unitSlice';
import FormDialog from '../components/Dialog';
import { LoadingButton } from '@mui/lab';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';

const header = [
	{
		id: 'serialNumber',
		numeric: false,
		disablePadding: true,
		label: 'Sr No.',
		sort: false,
		width: 50,
	},
	{
		id: 'name',
		numeric: false,
		disablePadding: true,
		label: 'Unit Name',
		sort: false,
		width: 300,
	},
	{
		id: 'startEndDate',
		numeric: false,
		disablePadding: true,
		label: 'Start and End Date',
		sort: false,
		width: 220,
	},
	{
		id: 'action',
		numeric: false,
		disablePadding: true,
		label: 'Action',
		sort: false,
		align: 'right',
		width: 220,
	},
];

export default function Units({ programId, programDetails }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const params = useParams();

	const loader = useSelector((state) => state.unit.unitListLoading);
	const unitList = useSelector((state) => state.unit.unitList);
	const paginateInfo = useSelector((state) => state.unit.paginateInfo);
	const deleteLoader = useSelector((state) => state.unit.unitCreateLoading);
	const duplicateLoader = useSelector((state) => state.loader.duplicateLoader);

	const [searchText, setSearchText] = useState('');
	const [list, setList] = useState([]);
	const [page, setPage] = useState(1);
	const [selectedStatus, setSelectedStatus] = useState('');
	const [selectedUnit, setSelectedUnit] = useState({});
	const [permissions, setPermissions] = useState({});
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	useEffect(() => {
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
	}, []);

	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	useEffect(() => {
		formatForDisplay(unitList);
	}, []);

	// useEffect(() => {
	// 	let timeoutId;

	// 	if (!searchText) {
	// 		dispatch(getUnitList({ programId: params.id, page: page, status: selectedStatus })).then((resp) => {
	// 			if (resp?.statusCode == 200) formatForDisplay(resp?.data?.data);
	// 		});
	// 	} else {
	// 		timeoutId = setTimeout(() => {
	// 			dispatch(
	// 				getUnitList({
	// 					keyword: searchText,
	// 					page: page,
	// 				})
	// 			).then((resp) => {
	// 				if (resp.statusCode == 200) formatForDisplay(resp?.data?.data);
	// 			});
	// 		}, 500);
	// 	}

	// 	return () => clearTimeout(timeoutId);
	// }, [searchText, page, selectedStatus]);

	const formatForDisplay = (data) => {
		const formatedRows = [];
		data?.forEach((item, index) => {
			formatedRows.push({
				id: item.id,
				serialNumber: item.serialNumber,
				name: item.name,
				startEndDate: item.startEndDate,
			});
		});
		setList(formatedRows);
	};

	const handleSearch = (e) => {
		setSearchText(e.target.value);
		setPage(1);
	};

	const handleManage = (id, e) => {
		setAnchorEl(e.currentTarget);
		let filterUnit = unitList.filter((item) => item.id == id);
		setSelectedUnit(filterUnit[0]);
		//navigate({ pathname: `/programs-unit/update/${params.id}/${id}` });
	};

	const onPageChange = (page) => {
		setPage(page);
	};

	const onStatusChange = (e) => {
		setSelectedStatus(e);
		setPage(1);
	};

	const handleCloseDialog = () => {
		setOpenDeleteDialog(false);
	};

	const handleDeleteUnit = () => [
		dispatch(deleteUnit(selectedUnit?.id)).then((res) => {
			if (res.statusCode == 200) {
				dispatch(getUnitList({ programId: params.id, page: page, status: selectedStatus })).then((resp) => {
					if (resp?.statusCode == 200) formatForDisplay(resp?.data?.data);
				});
			}
			handleCloseDialog();
			handleClose();
		}),
	];

	const handleDuplicateUnit = () => {
		dispatch(duplicateUnit(selectedUnit?.id)).then((res) => {
			handleClose();
			if (res.statusCode == 200) {
				dispatch(getUnitList({ programId: params.id, page: page, status: selectedStatus })).then((resp) => {
					if (resp?.statusCode == 200) formatForDisplay(resp?.data?.data);
				});
			}
		});
	};

	return (
		<Box>
			<Paper className={`tw-pt-6 tw-w-full  tw-my-6`}>
				<div className="tw-flex tw-justify-between tw-items-center tw-px-6 ">
					<h2 className="tw-text-secondaryText tw-font-bold tw-text-xl">Units</h2>
					{permissions?.Programs?.program_unit?.create && (
						<Button
							disabled={programDetails?.status == 'closed' ? true : false}
							variant="contained"
							disableElevation={true}
							onClick={() => navigate(`/programs-unit/create/${programId}`)}
							className="uppercase !tw-font-semibold"
						>
							Add new Unit
						</Button>
					)}
				</div>
				<>
					{!loader ? (
						<>
							{list.length > 0 ? (
								<>
									<EnhancedTable
										handleManage={handleManage}
										scrollable
										columns={header}
										data={list}
										onPageChange={onPageChange}
										page={page}
										details={true}
										paginate={{ totalPages: paginateInfo.totalPages, page: page }}
										keyProp="uuid"
									/>
									<Popover
										id={id}
										open={open}
										anchorEl={anchorEl}
										onClose={handleClose}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										transformOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
									>
										<div className="tw-flex tw-flex-col tw-gap-1 tw-p-1">
											<Button
												className="!tw-text-secondary !tw-justify-start"
												onClick={() => navigate(`/programs-unit/update/${params.id}/${selectedUnit.id}`, { state: { unit: selectedUnit, programId: params.id, programDetails: programDetails } })}
												variant="text"
												startIcon={<VisibilityIcon />}
											>
												view details
											</Button>
											<Button
												className="!tw-text-secondary !tw-justify-start"
												onClick={() => navigate(`/programs-unit/unit-content/${selectedUnit.id}`, { state: { unit: selectedUnit, programId: params.id, programDetails: programDetails } })}
												variant="text"
												startIcon={<EditIcon />}
											>
												Manage Unit
											</Button>
											<Button
												className="!tw-text-secondary !tw-justify-start"
												onClick={() => navigate(`/programs-unit/engagement-rule`, { state: { unit: selectedUnit, programId: params.id, programDetails: programDetails } })}
												variant="text"
												startIcon={<CalculateIcon />}
											>
												Engagement Score Rule
											</Button>
											<Button
												className="!tw-text-secondary !tw-justify-start"
												onClick={() => navigate(`/programs-unit/student-quiz-rule`, { state: { unit: selectedUnit, programId: params.id, programDetails: programDetails } })}
												variant="text"
												startIcon={<TextIncreaseIcon />}
											>
												Student Quiz Rule
											</Button>
											<LoadingButton
												disabled={programDetails?.status !== 'closed' ? false : true}
												loadingPosition="end"
												className={`${programDetails?.status !== 'closed' ? '!tw-text-secondary' : '!tw-text-grey'} !tw-bg-inherit !tw-justify-start`}
												variant="text"
												onClick={handleDuplicateUnit}
												loading={duplicateLoader}
												startIcon={<img height={20} width={20} src={programDetails?.status !== 'closed' ? duplicateIcon : duplicateDisableIcon} />}
											>
												Duplicate Unit
											</LoadingButton>
											{permissions?.Programs?.program_unit?.delete && (
												<Button
													disabled={programDetails?.status == 'closed' ? true : false}
													className={`${programDetails?.status == 'closed' ? '!tw-text-grey' : '!tw-text-error'} !tw-justify-start`}
													variant="text"
													onClick={() => setOpenDeleteDialog(true)}
													startIcon={<DeleteIcon />}
												>
													Delete Unit
												</Button>
											)}
										</div>
									</Popover>
									{openDeleteDialog && (
										<FormDialog open={openDeleteDialog} close={handleCloseDialog} title="Delete Unit">
											<div>
												<p>Are you sure you want to delete this unit?</p> <p> This action is irreversible.</p>
												<div className="tw-pt-8 tw-pb-1 tw-flex tw-justify-end tw-gap-5">
													<div className="tw-grow">
														<Button onClick={handleCloseDialog} fullWidth variant="outlined">
															Cancel
														</Button>
													</div>
													<div className="tw-grow">
														<LoadingButton loading={deleteLoader} onClick={handleDeleteUnit} fullWidth variant="contained" color="error" disableElevation>
															Delete
														</LoadingButton>
													</div>
												</div>
											</div>
										</FormDialog>
									)}
								</>
							) : (
								<div className="tw-pt-6"></div>
							)}
						</>
					) : (
						<div className="tw-text-center tw-py-5">{<CircularProgress />}</div>
					)}
				</>
			</Paper>
		</Box>
	);
}
