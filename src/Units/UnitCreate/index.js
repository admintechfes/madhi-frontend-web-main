import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { Button, CircularProgress, Container, IconButton, Paper, TextField, Tooltip } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LoadingButton } from '@mui/lab';

import { ErrorBox } from '../../components/Errorbox';
import { BasicDatePicker } from '../../components/DatePicker';
import { updateUnit, createUnit } from '../duck/network';

export default function UnitCreate(props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const qParams = useParams();

	const program = useSelector((state) => state.program.programDetails);
	const loading = useSelector((state) => state.unit.unitCreateLoading);

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [permissions, setPermissions] = useState({});
	const [savePermission, setSavePermission] = useState({});

	const programId = program?.id ? program.id : qParams.programId;
	const programDetails = location?.state?.programDetails;

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({ defaultValues: props?.defaultValues ?? {} });

	useEffect(() => {
		let access = JSON.parse(window.localStorage.getItem('permissions'));
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
		if (props?.type == 'update') {
			if (access?.Programs?.program_unit.update) setSavePermission(true);
		} else {
			if (access?.Programs?.program_unit.create) setSavePermission(true);
		}
	}, []);

	useEffect(() => {
		if (props.defaultValues) {
			setStartDate(props.defaultValues.startedAt);
			setEndDate(props.defaultValues.endedAt);
			setValue('startDate', moment(props.defaultValues.startedAt).format('DD-MM-YYYY'));
			setValue('endDate', moment(props.defaultValues.endedAt).format('DD-MM-YYYY'));
		}
	}, [props.defaultValues]);

	const handleFormSubmit = async (formValues) => {
		if (props?.type == 'update') {
			let dispatchFormValues = { ...formValues, programId: programId, startDate: moment(startDate).format('YYYY-MM-DD'), endDate: moment(endDate).format('YYYY-MM-DD') };
			const res = await dispatch(updateUnit(qParams.unitId, dispatchFormValues));
			if (res?.statusCode == 200) navigate(`/program-details/${programId}`);
		} else {
			let dispatchFormValues = { ...formValues, programId: programId, startDate: moment(startDate).format('YYYY-MM-DD'), endDate: moment(endDate).format('YYYY-MM-DD') };
			const res = await dispatch(createUnit(dispatchFormValues));
			if (res?.statusCode == 200) navigate(`/program-details/${programId}`);
		}
	};

	return (
		<>
			<div>
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
						<h1 className="tw-font-bold tw-text-[24px]">
							<Button variant="text" onClick={() => navigate(`/program-details/${programId}`)} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[12px]" disableRipple startIcon={<KeyboardBackspaceIcon />}>
								Program
							</Button>
							<h1 className="tw-px-2 tw-mt-[-4px]">{props?.type == 'update' ? 'Edit Unit Details' : 'Create New Unit'}</h1>
						</h1>
						<div className="tw-flex tw-gap-x-5">
							<div className="tw-flex tw-gap-x-5">
								{savePermission && (
									<Button onClick={() => navigate(`/program-details/${programId}`)} type="button" variant="contained" size="small" className="tw-h-[35px] !tw-bg-white !tw-text-primary">
										Cancel
									</Button>
								)}
								{savePermission && (
									<LoadingButton
										disabled={programDetails?.status == 'closed' ? true : false}
										loading={loading}
										type="submit"
										variant="contained"
										size="small"
										className={` ${programDetails?.status == 'closed' ? '!tw-bg-[#0000001f]' : ''} tw-h-[35px]`}
									>
										Save
									</LoadingButton>
								)}
							</div>
						</div>
					</div>
					<div className="tw-pt-6">
						<Paper>
							<Container maxWidth={false}>
								<div className="tw-py-6">
									<div className="tw-flex tw-justify-between tw-items-center">
										<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Unit Details</h1>
										<p className="tw-text-sm">
											<sup className="tw-text-error tw-text-[12px]">*</sup>All fields are mandatory
										</p>
									</div>

									<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-pt-6 tw-items-start">
										<Controller
											name="name"
											control={control}
											rules={{ required: 'This field is mandatory', pattern: { value: /.{2,}/, message: 'Minimum 2 character are required' } }}
											render={({ field }) => (
												<div className="tw-w-[500px]">
													<TextField disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true} variant="outlined" fullWidth size="small" label="Unit Name" {...field} />
													{errors.name && (
														<ErrorBox>
															<ErrorOutlineIcon fontSize="small" />
															<span>{errors.name.message}</span>
														</ErrorBox>
													)}
												</div>
											)}
										/>
										<Controller
											name="description"
											control={control}
											rules={{ required: 'This field is mandatory', pattern: { value: /.{2,}/, message: 'Minimum 2 character are required' } }}
											render={({ field }) => (
												<div className="tw-w-[500px]">
													<TextField disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true} variant="outlined" fullWidth size="small" label="Unit Description" {...field} />
													{errors.description && (
														<ErrorBox>
															<ErrorOutlineIcon fontSize="small" />
															<span>{errors.description.message}</span>
														</ErrorBox>
													)}
												</div>
											)}
										/>
									</div>
									<div className="tw-pt-6">Select Start and End date of the Unit</div>
									<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-pt-3 tw-items-start">
										<Controller
											name="startDate"
											control={control}
											rules={{ required: 'This field is mandatory' }}
											render={({ field }) => (
												<div className="tw-w-[500px]">
													<BasicDatePicker
														{...field}
														disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
														inputFormat="DD-MM-YYYY"
														value={startDate}
														maxDate={endDate}
														onChange={(newValue) => {
															setStartDate(moment(newValue).format('YYYY-MM-DD'));
															setValue('startDate', newValue, { shouldValidate: true });
														}}
														label="Start Date"
													/>
													{errors.startDate && (
														<ErrorBox>
															<ErrorOutlineIcon fontSize="small" />
															<span>{errors.startDate.message}</span>
														</ErrorBox>
													)}
												</div>
											)}
										/>
										<Controller
											name="endDate"
											control={control}
											rules={{ required: 'This field is mandatory' }}
											render={({ field }) => (
												<div className="tw-w-[500px]">
													<BasicDatePicker
														{...field}
														disabled={programDetails?.status == 'closed' ? true : savePermission ? false : true}
														inputFormat="DD-MM-YYYY"
														value={endDate}
														minDate={startDate}
														onChange={(newValue) => {
															setEndDate(moment(newValue).format('YYYY-MM-DD'));
															setValue('endDate', newValue, { shouldValidate: true });
														}}
														label="End Date"
													/>
													{errors.endDate && (
														<ErrorBox>
															<ErrorOutlineIcon fontSize="small" />
															<span>{errors.endDate.message}</span>
														</ErrorBox>
													)}
												</div>
											)}
										/>
									</div>
								</div>
							</Container>
						</Paper>
					</div>
				</form>
			</div>
		</>
	);
}
