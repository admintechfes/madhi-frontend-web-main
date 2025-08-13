import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Button, TextField, Typography } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { ErrorBox } from '../components/Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DropDownAddWithSearch from '../components/contentlibrary/DropDownAddWithSearch';
import { DropAudioImage } from '../components/contentlibrary/DropAudioImage';

export const CreateIVRSTemplate = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { control, register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(props.defaultValues ? props?.defaultValues?.tagObject?.map(item => item.id) : []);
  const [selectedValues, setSelectedValues] = useState(props.defaultValues ? props?.defaultValues?.tagObject?.map(item => item.id) : []);
  const [searchText, setSearchText] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [key, setKey] = useState(0); // Key to reset input value
  const [fileError, setFileError] = useState('');
  const [error, setErr] = useState("");


  const onSubmitTemplate = (values) => {

  };

  const renderTextFieldWithError = (field, label, error, desc) => (
    <div className='tw-w-1/2'>
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
    // dispatch(createTag({ name: searchText })).then((res) => {
    //   res.data.statusCode == 200 && dispatch(getAllTags()).then((response) => {
    //     setSearchData(response.data)
    //   })
    // })
  }


  return (
    <form onSubmit={handleSubmit(onSubmitTemplate)}>
      <div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
        <div className="tw-font-bold tw-text-[24px]">
          <Button variant="text" onClick={() => navigate(-1)} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[14px]" disableRipple startIcon={<KeyboardBackspaceIcon />}>
            IVRS outbound Campaign
          </Button>
          <h1 className="tw-px-2 tw-mt-[-4px]">Create IVRS outbound Template</h1>
        </div>
        <div className="tw-flex tw-gap-x-5">
          <div className="tw-flex tw-gap-x-5">
            <Button onClick={() => navigate('/outbound-template')} type="button" variant="contained" size="small" className="tw-h-[35px] !tw-bg-white !tw-text-primary">
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" size="small" className="tw-h-[35px]">Create</LoadingButton>
          </div>
        </div>
      </div>

      <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
        <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">Template</Typography>
        <div className="!tw-w-full tw-flex tw-gap-5 tw-mb-5">
          <Controller name="campaignName" control={control}
            rules={{ required: 'This field is mandatory', }}
            render={({ field }) => renderTextFieldWithError(field, 'Template Name', errors.campaignName)}
          />
          <Controller name="campaignDescription" control={control}
            rules={{ required: 'This field is mandatory', }}
            render={({ field }) => (
              <div className='tw-flex tw-flex-col tw-w-1/2'>
                <DropDownAddWithSearch
                  setSearchData={setSearchData}
                  defaultValues={props?.defaultValues?.tagObject?.map(item => item?.name)}
                  onChange={setSelectedValues}
                  selectedValues={selectedValues}
                  searchData={searchData}
                  Data={[]}
                  valuekey="id"
                  labelkey="name"
                  label="Select Tags"
                  value={selectedValues}
                  searchText={searchText}
                  AddNewData={AddNewData}
                  setSearchText={setSearchText}
                  setSelectedId={setSelectedId}
                  {...field}
                />
                {errors.tagIds && (
                  <ErrorBox>
                    <ErrorOutlineIcon fontSize="small" />
                    <span>{errors.tagIds.message}</span>
                  </ErrorBox>
                )}
              </div>
            )

            }
          />
        </div>
        <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">Attachement</Typography>
        <Controller name="mediaUrl" control={control}
          render={({ field }) => (
            <a className='tw-block tw-w-full'>
              <DropAudioImage {...field} fileError={fileError} setFileError={setFileError} setError={setErr} error={error} key={key}
                setKey={setKey} setSelectedFile={setSelectedFile}
                selectedFile={selectedFile}
                register={register}
                bigSize={true}
              />
            </a>
          )}
        />
      </div>
    </form>
  );
};
