import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { Button, CircularProgress, Container, IconButton, Paper, TextField, Tooltip } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LoadingButton } from '@mui/lab';

import { ErrorBox } from '../../../components/Errorbox';
import { createWorkshop, updateWorkshop } from '../../duck/network';
// import { updateUnit, createUnit } from '../duck/network';

export default function WorkshopCreate(props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const qParams = useParams();
  const location = useLocation();

	const program = useSelector((state) => state.program.programDetails);
	const loading = useSelector((state) => state.unitContent.workhopCreateLoading);


	const unitId = location?.state?.unit?.id;
	const programId = location?.state?.programId
	const programDetails = location?.state?.programDetails

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues: props?.defaultValues ?? {} });


	const handleFormSubmit = async (formValues) => {
		if (props?.type == 'update') {
      let dispatchFormValues = { ...formValues, programUnitId: unitId };
			const res = await dispatch(updateWorkshop(location.state?.unitContent?.id, dispatchFormValues));
			if (res?.statusCode == 200) navigate(`/programs-unit/unit-content/${unitId}`,{state:{unit:location?.state?.unit, programId:location.state.programId, programDetails:programDetails}});
		} else {
			let dispatchFormValues = { ...formValues, programUnitId: unitId};
			const res = await dispatch(createWorkshop(dispatchFormValues));
			if (res?.statusCode == 200) navigate(`/programs-unit/unit-content/${unitId}`,{state:{unit:location?.state?.unit, programId:location.state.programId, programDetails:programDetails}});
		}
	};

	return (
		<>
			<div>
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
						<h1 className="tw-font-bold tw-text-[24px]">
							<Button variant="text" onClick={() => navigate(`/programs-unit/unit-content/${unitId}`,{state:{unit:location?.state?.unit, programId:location.state.programId, programDetails:programDetails}})} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[12px]" disableRipple startIcon={<KeyboardBackspaceIcon />}>
								{`program / ${location?.state?.unit?.serialNumber}`}
							</Button>
							<h1 className="tw-px-2 tw-mt-[-4px]">{props?.type == 'update' ? 'Edit Workshop Details':'Create New Workshop'}</h1>
						</h1>
						<div className="tw-flex tw-gap-x-5">
							<div className="tw-flex tw-gap-x-5">
								<Button onClick={() => navigate(`/programs-unit/unit-content/${unitId}`,{state:{unit:location?.state?.unit, programId:location.state.programId, programDetails:programDetails}})} type="button" variant="contained" size="small" className="tw-h-[35px] !tw-bg-white !tw-text-primary">
									Cancel
								</Button>
								<LoadingButton loading={loading} type="submit" variant="contained" size="small" className="tw-h-[35px]">
									Save
								</LoadingButton>
							</div>
						</div>
					</div>
					<div className="tw-pt-6">
						<Paper>
							<Container maxWidth={false}>
								<div className="tw-py-6">
									<div className="tw-flex tw-justify-between tw-items-center">
										<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Workshop Details</h1>
										<p className="tw-text-sm">
											<sup className="tw-text-error tw-text-[12px]">*</sup>All fields are mandatory
										</p>
									</div>

									<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-pt-6 tw-items-start">
										<Controller
											name="title"
											control={control}
											rules={{ required: 'This field is mandatory', pattern: { value: /.{2,}/, message: 'Minimum 2 character are required' } }}
											render={({ field }) => (
												<div className="tw-w-[500px]">
													<TextField variant="outlined" fullWidth size="small" label="Workshop Title" {...field} />
													{errors.title && (
														<ErrorBox>
															<ErrorOutlineIcon fontSize="small" />
															<span>{errors.title.message}</span>
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
													<TextField variant="outlined" fullWidth size="small" label="Workshop Content" {...field} />
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
								</div>
							</Container>
						</Paper>
					</div>
				</form>
			</div>
		</>
	);
}
