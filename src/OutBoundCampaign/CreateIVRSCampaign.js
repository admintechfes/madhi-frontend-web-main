import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { ErrorBox } from '../components/Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { getTagNameList } from '../ManualWhatsApp/duck/network';
import { createTagManualcampaign } from '../ManualWhatsApp/duck/network';
import DropDownAddWithSearch from '../components/contentlibrary/DropDownAddWithSearch';
import { fillFormDataOutboundCampaign } from './duck/OutboundCampaignSlice';

export const CreateIVRSCampaign = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm();
  const dispatch = useDispatch();
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const tagsnameList = useSelector((state) => state.manualWhatsApp.tagsNameList);
  const [searchText, setSearchText] = useState("");
  const formDataCampaign = useSelector((state) => state.outboundCampaign.formDataCampaign)

  useEffect(() => {
    dispatch(getTagNameList({ type: "outbound_ivrs" })).then((response) => {
      setSearchData(response?.data)
    })
  }, [dispatch])

  useEffect(() => {
    if (formDataCampaign) {
      setValue('title', formDataCampaign?.title || '');
      setValue('description', formDataCampaign?.description || '');
      setValue('tags', formDataCampaign?.tags || []);
      setValue('ivrId', formDataCampaign.ivrId)
      setValue("tags", formDataCampaign?.tags || [])
      setSelectedValues(formDataCampaign?.tags || []);
    }
  }, [formDataCampaign, setValue]);

  const onSubmitCampaign = () => {
    dispatch(fillFormDataOutboundCampaign({ ...getValues() }));
    navigate('/parents', {
      state: {
        redirectFrom: 'outbound-campaign',
        tags: selectedValues,
      },
    });

  };

  const renderTextFieldWithError = (field, label, error, desc) => (
    <div className='tw-w-full'>
      <TextField variant="outlined" multiline rows={desc ? 4 : null} className='tw-w-full' size="small" label={label} type="text" value={field.value || ''} {...field} />
      {error && (
        <ErrorBox>
          <ErrorOutlineIcon fontSize="small" />
          <span>{error.message}</span>
        </ErrorBox>
      )}
    </div>
  );

  const AddNewData = () => {
    dispatch(createTagManualcampaign({ name: searchText, type: "outbound_ivrs" })).then((res) => {
      res.data.statusCode == 200 && dispatch(getTagNameList({ type: "outbound_ivrs" })).then((response) => {
        setSearchData(response.data)
      })
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmitCampaign)}>
      <div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
        <div className="tw-font-bold tw-text-[24px]">
          <Button variant="text" onClick={() => navigate(-1)} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[14px]" disableRipple startIcon={<KeyboardBackspaceIcon />}>
            IVRS outbound Campaign
          </Button>
          <h1 className="tw-px-2 tw-mt-[-4px]">Create IVRS Campaign</h1>
        </div>
        <div className="tw-flex tw-gap-x-5">
          <div className="tw-flex tw-gap-x-5">
            <Button onClick={() => navigate('/outbound-ivrs')} type="button" variant="contained" size="small" className="tw-h-[35px] !tw-bg-white !tw-text-primary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="small"  className="tw-h-[35px]">Add Parent</Button>
          </div>
        </div>
      </div>

      <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
        <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
          Campaign Details
        </Typography>
        <div className="!tw-w-full tw-grid tw-grid-cols-2 tw-gap-5">
          <Controller name="title" control={control}
            rules={{ required: 'This field is mandatory', }}
            render={({ field }) => renderTextFieldWithError(field, 'Campaign Name', errors.title)}
          />
          <Controller name="description" control={control}
            render={({ field }) => renderTextFieldWithError(field, 'Campaign Description (Optional)', errors.description)}
          />
          <Controller name="ivrId" control={control}
            rules={{ required: 'This field is mandatory', }}
            render={({ field }) => renderTextFieldWithError(field, 'Enter IVR ID from Kalerya dashboard', errors.ivrId)}
          />
          <Controller name="tags" control={control} rules={{ required: 'Please Select Tags' }} render={({ field }) => (
            <div className='tw-flex tw-flex-col'>
              <DropDownAddWithSearch
                setSearchData={setSearchData}
                onChange={setSelectedValues}
                selectedValues={selectedValues}
                searchData={searchData}
                Data={tagsnameList}
                valuekey="id"
                labelkey="name"
                label="Select Tags"
                value={selectedValues}
                searchText={searchText}
                AddNewData={AddNewData}
                setSearchText={setSearchText}
                defaultValues={formDataCampaign?.tags}
                {...field}
              />
              {errors.tags && (
                <ErrorBox>
                  <ErrorOutlineIcon fontSize="small" />
                  <span>{errors.tags.message}</span>
                </ErrorBox>
              )}
            </div>
          )} />
        </div>
      </div>
    </form>
  );
};
