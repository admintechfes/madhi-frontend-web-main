import React from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form';
import { ErrorBox } from '../../components/Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function ParentsBasicForm({ control, errors }) {

  const renderTextFieldWithError = (field, label, error, onKeyPress, type) => (
    <div className='tw-w-[280px]'>
      <TextField variant="outlined" className='tw-w-full' size="small" label={label} onKeyPress={onKeyPress} step="1" type={type ? type : "text"} value={field.value || ''} {...field} />
      {error && (
        <ErrorBox>
          <ErrorOutlineIcon fontSize="small" />
          <span>{error.message}</span>
        </ErrorBox>
      )}
    </div>
  );


  return (
    <div className='tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-rounded-xl tw-mb-8 tw-shadow-md tw-bg-white'>
      <div className='tw-flex tw-justify-between tw-items-center tw-mb-7 tw-w-full'>
        <Typography variant="h3" className='!tw-font-semibold !tw-text-secondaryText'>Basic Info</Typography>
        {/* <span className='tw-text-sm tw-text-secondaryText'><strong className='tw-text-error'>*</strong>All fields are mandatory</span> */}
      </div>
      <div className='tw-flex tw-flex-wrap tw-gap-6'>
        <Controller name="first_name" control={control}
          rules={{
            required: 'This field is mandatory',
            validate: value => value.length > 1 || 'Please enter a valid first name',
          }}
          render={({ field }) => renderTextFieldWithError(field, 'First Name', errors.first_name, (e) => {
            if (!/^[a-zA-Z\s]*$/.test(e.key)) {
              e.preventDefault();
            }
          })}
        />
        <Controller name="last_name" control={control}
          rules={{
            required: 'This field is mandatory',
            validate: value => value.length > 1 || 'Please enter a valid last name',

          }}
          render={({ field }) => renderTextFieldWithError(field, 'Last Name', errors.last_name, (e) => {
            if (!/^[a-zA-Z\s]*$/.test(e.key)) {
              e.preventDefault();
            }
          })}
        />
        {/* <Controller name="email" control={control}
          rules={{
            pattern: {
              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
              message: "Please enter a valid email ID",
            },
          }}
          render={({ field }) => renderTextFieldWithError(field, 'Email (Optional)', errors.email, (e) => { }, "text")}
        /> */}
        <Controller name="whatsapp_number" control={control}
          rules={{
            required: 'This field is mandatory',
            pattern: {
              value: /^[0-9]{10}$/, // Change the pattern based on your mobile number format
              message: 'Please enter a valid number',
            },
          }}
          render={({ field }) => renderTextFieldWithError(field, 'WhatsApp Number', errors.whatsapp_number, (e) => {
            if (e.target.value.length === 10) {
              e.preventDefault();
            }
            if (['+', '-'].includes(event.key)) {
              e.preventDefault();
            }
          }, 'number')}
        />
        <Controller name="mobile" control={control}
          rules={{
            pattern: {
              value: /^[0-9]{10}$/, // Change the pattern based on your mobile number format
              message: 'Please enter a valid number',
            },
          }}
          render={({ field }) => renderTextFieldWithError(field, 'Other Number (Optional)', errors.mobile, (e) => {
            if (e.target.value.length === 10) {
              e.preventDefault();
            }
            if (['+', '-'].includes(event.key)) {
              e.preventDefault();
            }
          }, 'number')}
        />
        <Controller name="address" control={control}
          rules={{
            required: 'This field is mandatory',
            validate: value => value.length > 1 || 'Please enter a valid Address',
          }}
          render={({ field }) => renderTextFieldWithError(field, 'House Address', errors.address, (e) => { }, "text")}
        />
      </div>
    </div>
  )
}

