import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import { Button, CircularProgress, Popover } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { BasicDatePicker } from '../components/DatePicker';

import Filtercheckbox from '../components/contentlibrary/filtercheckbox';
import { getTagNameList, getWhatsAppManualList } from './duck/network';
import { fillFilterData, fillTagsFilter, fillApplyFilter, fillStartDateValue, fillEndDateValue } from './duck/glificFlowManagementSlice';

export default function GlificFlowFilter({
	handleClose,
	anchorEl,
	page,
	setAnchorEl,
	limitPerPage,
	applyfilter,
	setApplyFilter,
	villageAreaId,
	ResetFilter,
	conductedById,
	programUnitContentId,
	formatForDisplay,
	storeTagValue,
	setStoreTagValue,
	setPage
}) {
	const dispatch = useDispatch();
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
		watch,
		setValue,
	} = useForm();
	const watchedFields = watch(); // Watch all fields
	const [isFormDirty, setIsFormDirty] = useState(false);


	const tagsFilter = useSelector((state) => state.manualWhatsApp.tagsFilter);
	const applyManualFilter = useSelector((state) => state.manualWhatsApp.applyFilter);

	const startDateValue = useSelector((state) => state.manualWhatsApp.startDateValue);
	const endDateValue = useSelector((state) => state.manualWhatsApp.endDateValue);
	const tagsnameList = useSelector((state) => state.manualWhatsApp.tagsNameList);
	const loader = useSelector((state) => state.manualWhatsApp.loadingCamping);

	const ApplyFilter = (data) => {
		setPage(1)
		dispatch(fillFilterData(data));
		setAnchorEl(null);
		dispatch(fillApplyFilter(true));
		setApplyFilter(true);
		dispatch(fillTagsFilter(storeTagValue));
	};

	useEffect(() => {
		if (tagsFilter.length > 0 || startDateValue || endDateValue) {
			dispatch(fillApplyFilter(true));
		} else {
			dispatch(fillApplyFilter(false));
			setApplyFilter(false);
		}
	}, [tagsFilter, startDateValue, endDateValue]);

	const handleCloseModal = () => {
		handleClose();
		if (applyfilter) {
			dispatch(fillTagsFilter(storeTagValue));
		} else {
			reset();
			ResetFilter();
		}
	};

	return (
		<>
		
				<form
					className={`tw-flex tw-flex-col tw-max-w-[calc(100% - 32px)] tw-min-w-4 tw-w-[400px] tw-absolute tw-top-5 tw-rounded ${
						anchorEl ? 'openpop tw-z-30' : 'tw-opacity-0 -tw-z-30'
					}  tw-right-0 shadow-css tw-p-4 tw-bg-white`}
					onSubmit={handleSubmit(ApplyFilter)}
				>
					<div className="tw-flex tw-justify-between tw-mb-8 tw-items-center">
						<span className="tw-text-xl tw-font-semibold">Filters</span>
						<CloseIcon className="tw-text-secondaryText tw-cursor-pointer" onClick={handleCloseModal} />
					</div>
					<div className="tw-flex tw-justify-between tw-items-center tw-mb-5">
						<span>Trigger Type</span>
						<div className="tw-w-[200px]">
							<Controller
								name="tags"
								control={control}
								render={({ field }) => {
									const mergeOnChange = (selectedValue) => {
										field.onChange(selectedValue);
										setStoreTagValue(selectedValue);
										dispatch(fillTagsFilter(selectedValue));
									};
									return <Filtercheckbox options={tagsnameList} {...field} onChange={mergeOnChange} value={storeTagValue} valuekey="name" labelkey="name" label="Select Tags" />;
								}}
							/>
						</div>
					</div>

					<div className="tw-mb-5">
						<span className="tw-text-lg  tw-text-secondaryText tw-block tw-mb-5 tw-font-semibold">Date Range</span>
						<div className="tw-flex tw-gap-4 tw-flex-col">
							<div className="tw-flex tw-justify-between tw-items-center tw-gap-4">
								<span className="tw-text-grey">Start Date</span>
								<Controller
									name="startDate"
									defaultValue={null}
									control={control}
									render={({ field }) => (
										<div className="tw-w-[180px]">
											<BasicDatePicker
												{...field}
												inputFormat="DD-MM-YYYY"
												value={startDateValue}
												onChange={(newValue) => {
													if (newValue) {
														field.onChange(moment(newValue).format('YYYY-MM-DD'));
														dispatch(fillStartDateValue(moment(newValue).format('YYYY-MM-DD')));
													} else {
														field.onChange(null);
														dispatch(fillStartDateValue(null));
													}
												}}
												label="Date"
											/>
										</div>
									)}
								/>
							</div>
							<div className="tw-flex tw-justify-between tw-items-center tw-gap-4">
								<span className="tw-text-grey">End Date</span>
								<Controller
									name="endDate"
									control={control}
									defaultValue={null}
									render={({ field }) => (
										<div className="tw-w-[180px]">
											<BasicDatePicker
												{...field}
												inputFormat="DD-MM-YYYY"
												value={endDateValue}
												minDate={startDateValue}
												onChange={(newValue) => {
													if (newValue) {
														field.onChange(moment(newValue).format('YYYY-MM-DD'));
														dispatch(fillEndDateValue(moment(newValue).format('YYYY-MM-DD')));
													} else {
														field.onChange(null);
														dispatch(fillEndDateValue(null));
													}
												}}
												label="Date"
											/>
										</div>
									)}
								/>
							</div>
						</div>
					</div>
					<div className="tw-flex tw-gap-4 tw-justify-end tw-items-end">
						<Button variant="outlined" disabled={!applyManualFilter} onClick={ResetFilter} className="uppercase tw-text-secondary">
							Reset Filters
						</Button>
						<Button type="submit" disabled={!applyManualFilter} variant="contained" className="uppercase">
							Apply
						</Button>
					</div>
				</form>
			
			<div onClick={handleCloseModal} className={`tw-fixed tw-bg-transparent tw-right-0 ${anchorEl ? 'transition-op tw-z-10' : 'tw-opacity-0 -tw-z-10'} tw-h-full tw-top-0 tw-w-full`}></div>
			<style>{`
      body {
         overflow: ${anchorEl ? 'hidden' : 'scroll'};
      }
     `}</style>
		</>
	);
}
