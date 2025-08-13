import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Button, TextField, Typography } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import ManualParentPagination from './ManualParentPagination';
// import EnhancedTableParentPagination from "../components/ManualWhatsApp/EnhancedTableParentPagination";
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { ErrorBox } from '../components/Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { fillFormDataCampaign, fillTagsNameVal } from './duck/glificFlowManagementSlice';
import { Dropdown } from '../components/Select';
import { createTagManualcampaign, getGlificFlowNameList, getTagNameList, postManualWhatsAppCreate } from './duck/network';
import Filtercheckbox from '../components/contentlibrary/filtercheckbox';
import DropDownAddWithSearch from '../components/contentlibrary/DropDownAddWithSearch';
import DropDownAddWithSearchManual from './DropDownAddWithSearchManual';
// import DropDownAddWithSearchManual from './DropDownAddWithSearchManual';

const header = [
	{
		id: 'name',
		numeric: false,
		disablePadding: true,
		label: 'Parent List',
		sort: true,
		width: 180,
	},
	{
		id: 'whatsapp_number',
		numeric: false,
		disablePadding: true,
		label: 'WhatsApp Number',
		sort: true,
		width: 180,
	},
	{
		id: 'kids_count',
		numeric: false,
		disablePadding: true,
		label: 'Children count',
		sort: true,
		width: 120,
	},
	{
		id: 'assigned_district',
		numeric: false,
		disablePadding: true,
		label: 'District',
		sort: true,
		width: 180,
	},
	{
		id: 'assigned_block_zone',
		numeric: false,
		disablePadding: true,
		label: 'Block/Zone',
		sort: true,
		width: 120,
	},
	{
		id: 'assigned_panchayat_ward',
		numeric: false,
		disablePadding: true,
		label: 'Panchayat/Ward',
		sort: true,
		width: 120,
	},
	{
		id: 'village',
		numeric: false,
		disablePadding: true,
		label: 'Village/Area',
		sort: true,
		width: 120,
	},

];
export const GlificFlowCreate = () => {
	const navigate = useNavigate();
	const [page, setPage] = useState();
	const [storeTagValue, setStoreTagValue] = useState([]);
	const [loadingRelease, setLoadingRelease] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchData, setSearchData] = useState([]);

	const [selectedValues, setSelectedValues] = useState([]);
	const [selectedId, setSelectedId] = useState([]);
	const tagsNameVal = useSelector((state) => state.manualWhatsApp.tagsNameVal)
	// const selected = useSelector((state) => state.parents.selectedQuestion);
	const addedParents = useSelector((state) => state.manualWhatsApp.addedParents)
	const formDataCampaign = useSelector((state) => state.manualWhatsApp.formDataCampaign);
	const tagsnameList = useSelector((state) => state.manualWhatsApp.tagsNameList);
	const glificFlowNameList = useSelector((state) => state.manualWhatsApp.glificFlowNameList);

	const loader = useSelector((state) => state.manualWhatsApp.loadingCamping);

	const location = useLocation();

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
	} = useForm();
	const dispatch = useDispatch();
	const onNavigateDetails = () => { };

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
			// setSelectedId(formDataCampaign?.tags || []);
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
	const parentsIdFunction = (data) => data.map((item) => item.id);

	const onSubmitDistrict = (values) => {
		let finalValues = {
			...values,
			parentIds: parentsIdFunction(addedParents),
			type: '3',
		};

		setLoadingRelease(true);
		dispatch(postManualWhatsAppCreate(finalValues)).then((resp) => {
			if (resp?.data?.statusCode === 200) {
				navigate(`/manual-whatsapp`);
				setLoadingRelease(false);
			} else {
				setLoadingRelease(false);
			}
		});
	};

	parentsIdFunction(addedParents);

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
						Campaign
					</Button>
					<h1 className="tw-px-2 tw-mt-[-4px]"> Manage Glific Flow</h1>
				</div>
				<div className="tw-flex tw-gap-x-5">
					<div className="tw-flex tw-gap-x-5">
						<Button onClick={() => navigate('/glific-flow-management')} type="button" variant="contained" size="small" className="tw-h-[35px] !tw-bg-white !tw-text-primary">
							Cancel
						</Button>
						<LoadingButton
							type="submit"
							variant="contained"
							size="small"
							loading={loader || loadingRelease}
							className="tw-h-[35px]"
							disableRipple={addedParents?.length === 0}
							disabled={addedParents?.length === 0}
							sx={{
								'&.Mui-disabled': {
									backgroundColor: 'rgba(0, 0, 0, 0.12)', // Default disabled background color
									color: 'rgba(0, 0, 0, 0.26)', // Default disabled text color
								},
							}}
						>
							Save
						</LoadingButton>
					</div>
				</div>
			</div>

			<>
			
			</>

			<>
				<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
					<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
						Flow Details
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
										label="Select Glific Flow"
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
									<div className="tw-text-grey">Glific Flow Id</div>
									<div className="tw-text-black">{field.value || '-'}</div>
								</div>
							)}
						/>
					</div>

		
				</div>
			</>

		</form>
	);
};
