import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { ErrorBox } from '../components/Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { fillFormDataCampaign } from './duck/manualWhatsAppSlice';
import { Dropdown } from '../components/Select';
import { createTagManualcampaign, getGlificFlowNameList, getTagNameList, postManualWhatsAppCreate } from './duck/network';
import DropDownAddWithSearchManual from './DropDownAddWithSearchManual';
import DropDownAddWithSearch from '../components/contentlibrary/DropDownAddWithSearch';

export const CampaignCreate = () => {
	const navigate = useNavigate();
	const [searchText, setSearchText] = useState("");
	const [searchData, setSearchData] = useState([]);
	const [selectedValues, setSelectedValues] = useState([]);
	const formDataCampaign = useSelector((state) => state.manualWhatsApp.formDataCampaign);
	const tagsnameList = useSelector((state) => state.manualWhatsApp.tagsNameList);
	const glificFlowNameList = useSelector((state) => state.manualWhatsApp.glificFlowNameList);
	const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getTagNameList()).then((response) => {
			setSearchData(response?.data)
		});
		dispatch(getGlificFlowNameList());
	}, []);

	useEffect(() => {
		if (formDataCampaign) {
			setValue('title', formDataCampaign?.title || '');
			setValue('description', formDataCampaign?.description || '');
			setValue('tags', formDataCampaign?.tags || []);
			setValue('glificFlowName', formDataCampaign?.glificFlowName || '');
			setValue('glificFlowId', formDataCampaign?.glificFlowId || ''); // Populate Flow ID
			setSelectedValues(formDataCampaign?.tags || []);
		}
	}, [formDataCampaign, setValue]);

	const handleFlowChange = (selected) => {
		const flowId = findFlowIdByName(selected);
		setValue('glificFlowName', selected);
		setValue('glificFlowId', flowId); // Set the Flow ID in the form

	};

	const findFlowIdByName = (flowName) => {
		// Assuming glificFlowNameList contains objects with names and ids
		const selectedFlow = glificFlowNameList?.find((flow) => flow?.glificFlowName === flowName);
		return selectedFlow ? selectedFlow?.glificFlowId : '';
	};


	const onSubmitDistrict = (data) => {
		dispatch(fillFormDataCampaign({ ...getValues()}));
		navigate('/parents', {
			state: {
				redirectFrom: 'manual-whatsapp',
				tags: selectedValues,
			},
		});

	};

	const AddNewData = () => {
		dispatch(createTagManualcampaign({ name: searchText })).then((res) => {
			res.data.statusCode == 200 && dispatch(getTagNameList()).then((response) => {
				setSearchData(response?.data)
			})
		})
	}

	return (
		<form onSubmit={handleSubmit(onSubmitDistrict)}>
			<div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
				<div className="tw-font-bold tw-text-[24px]">
					<Button variant="text" onClick={() => navigate(-1)} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[14px]" disableRipple startIcon={<KeyboardBackspaceIcon />}>
						Manual WhatsApp
					</Button>
					<h1 className="tw-px-2 tw-mt-[-4px]"> Create Manual WhatsApp</h1>
				</div>
				<div className="tw-flex tw-gap-x-5">
					<div className="tw-flex tw-gap-x-5">
						<Button onClick={() => navigate('/manual-whatsapp')} type="button" variant="contained" size="small" className="tw-h-[35px] !tw-bg-white !tw-text-primary">
							Cancel
						</Button>
						<Button type="submit" variant="contained" size="small" className="tw-h-[35px]">Add Parent</Button>
					</div>
				</div>
			</div>

			<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
				<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
					Campaign Details
				</Typography>
				<div className="!tw-w-full">
					<Controller
						name="title"
						control={control}
						rules={{
							required: 'Please enter campaign name to release.',
							validate: (value) => value.length > 1 || 'Please enter campaign name to release.',
						}}
						render={({ field }) => (
							<div className="!tw-w-full">
								<TextField variant="outlined" size="small" label="Campaign Name" type="text" {...field} className="!tw-w-full" />
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
						render={({ field }) => (
							<div className="!tw-w-full tw-py-5">
								<TextField variant="outlined" size="small" label="Campaign Description (Optional)" type="text" {...field} className="!tw-w-full" multiline rows={4} />
							</div>
						)}
					/>
					<Controller name="tags" control={control} render={({ field }) => {
						return (<div className='tw-flex tw-flex-col'>
							<DropDownAddWithSearch
                setSearchData={setSearchData}
                onChange={setSelectedValues}
                selectedValues={selectedValues}
                searchData={searchData}
                Data={tagsnameList}
                valuekey="id"
                labelkey="name"
                label="Add Tags"
                value={selectedValues}
                searchText={searchText}
                AddNewData={AddNewData}
                setSearchText={setSearchText}
                defaultValues={formDataCampaign?.tags}
                {...field}
              />
							{errors.tagIds && (
								<ErrorBox>
									<ErrorOutlineIcon fontSize="small" />
									<span>{errors.tagIds.message}</span>
								</ErrorBox>
							)}
						</div>)
					}} />
				</div>
			</div>

			<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
				<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
					WhatsApp Flow
				</Typography>
				<div className="tw-flex tw-w-full ">
					<Controller
						name="glificFlowName"
						control={control}
						rules={{
							required: 'Please select state to create.',
						}}
						render={({ field }) => (
							<div className="!tw-w-[500px] tw-pt-2">
								<Dropdown
									{...field}
									options={glificFlowNameList}
									valuekey="glificFlowName"
									labelkey="glificFlowName"
									label="Select Flow"
									onChange={(value) => {
										field.onChange(value);
										handleFlowChange(value);
									}}
								/>
								{errors.glificFlowName && (
									<ErrorBox>
										<ErrorOutlineIcon fontSize="small" />
										<span>{errors.glificFlowName.message}</span>
									</ErrorBox>
								)}
							</div>
						)}
					/>
					<Controller
						name="glificFlowId"
						control={control}
						render={({ field }) => (
							<div className="tw-px-5">
								<div className="tw-text-grey">Flow Template Id</div>
								<div className="tw-text-black">{field.value || '-'}</div>
							</div>
						)}
					/>
				</div>
			</div>
		</form>
	);
};
