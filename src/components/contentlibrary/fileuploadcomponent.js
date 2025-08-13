import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form';
import { ErrorBox } from '../Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Dropdown } from '../Select';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export default function FileUploadComponent({ control, optionType, defaultValues, setMediaType, mediaType, setValue, errors, contentType, register, setError }) {

  const mediaOptions = [
    { value: '1', label: 'Image' },
    { value: '2', label: 'Video' },
    { value: '3', label: 'Audio' },
    { value: '4', label: 'PDF' },
  ];

  const renderTextFieldWithError = (field, label, errors, type) => (
    <div className="tw-w-[300px]">
      <TextField variant="outlined" type={type} fullWidth size="small" label={label} placeholder={label} {...field}
        value={field.value !== '' ? parseInt(field.value, 10) || '' : ''}
        onChange={(e) => field.onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
      />
      {errors?.message && (
        <ErrorBox>
          <ErrorOutlineIcon fontSize="small" />
          <span>{errors.message}</span>
        </ErrorBox>
      )}
    </div>
  );

  let MediaValue = ""
  let MediaTypeValue = ""

  switch (mediaType) {
    case "1":
      MediaValue = "Image"
      MediaTypeValue = ".jpeg .png,"
      break;
    case "2":
      MediaValue = "Video"
      MediaTypeValue = ".mp4,"

      break;
    case "3":
      MediaValue = "Audio"
      MediaTypeValue = ".mp3,"
      break;
    case "4":
      MediaValue = "PDF"
      MediaTypeValue = ".pdf,"
      break;
    default:
      MediaValue = ""
      MediaTypeValue = ""
      break;
  }


  return (
    <div className='tw-mt-5'>
      <div className='tw-flex tw-items-start tw-gap-3 tw-mb-6 tw-relative'>
        <Controller
          name="allowedMediaType" control={control}
          rules={{ required: 'This field is mandatory' }}
          render={({ field }) => (
            <div className='tw-w-[300px]'>
              <Dropdown options={mediaOptions} value={field.value || ""} {...field}
                onChange={(selectedValue) => {
                  field.onChange(selectedValue)
                  setMediaType(selectedValue)
                }}
                valuekey="value" labelkey="label" label="Select Media Type" />
              {errors?.allowedMediaType?.message && (
                <ErrorBox>
                  <ErrorOutlineIcon fontSize="small" />
                  <span>{errors?.allowedMediaType?.message}</span>
                </ErrorBox>
              )}
            </div>
          )}
        />
        <Controller name="uploadLimit" control={control}
          rules={{
            required: 'This field is mandatory',
            validate: value => value <= 5 || 'Max count is 5'
          }}
          render={({ field }) =>
            renderTextFieldWithError(field, "Enter media count", errors.uploadLimit, "number", "Enter media count")
          } />
        {mediaType &&
          <div className='tw-flex tw-flex-col tw-gap-3'>
            <div className='tw-w-[300px] tw-py-[9px] tw-flex tw-gap-4 tw-items-center tw-px-4 tw-bg-[#EEE] tw-rounded-md tw-text-grey'>
              <AttachFileIcon className='tw-text-grey' />
              <span>Choose {MediaValue}</span>
            </div>
            <p className='tw-text-sm tw-text-grey'>Accepted filestypes {MediaTypeValue} (under {mediaType === "2" ? "5MB" : "2MB"})</p>
          </div>
        }
      </div>
    </div>
  )
}
