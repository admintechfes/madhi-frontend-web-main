import { Button, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray } from 'react-hook-form';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { ErrorBox } from '../Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallIcon from '@mui/icons-material/Call';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { Dropdown } from '../Select';

export default function MultipleTextBox({ control, defaultValues, setValue }) {
  const { fields, append, remove, replace } = useFieldArray({ control, name: 'textboxes' });
  const [answerType, setAnswerType] = useState([]);

  const answerOptions = [
    { value: '1', label: 'Textbox' },
    { value: '2', label: 'Phone Number' },
    { value: '3', label: 'Email' },
    { value: '4', label: 'Date' },
  ];

  useEffect(() => {
    if (defaultValues?.questionnairesJson?.textboxes) {
      fields.map((item, index) => {
        setValue(`textboxes.${index}.label`, item.label)
        setValue(`textboxes.${index}.inputType`, item.inputType)
      })
      let newData = [...fields].map(el => el.inputType);
      setAnswerType(newData)
    }
  }, [])

  if (fields.length === 0) {
    append({ label: "", inputType: "" });
  }

  const renderTextFieldWithError = (field, label, errors, type) => (
    <div className="tw-w-[300px]">
      <TextField variant="outlined" type={type} fullWidth size="small" label={label} placeholder={label} {...field}
        value={field.value || ''} />
      {errors?.message && (
        <ErrorBox>
          <ErrorOutlineIcon fontSize="small" />
          <span>{errors.message}</span>
        </ErrorBox>
      )}
    </div>
  );


  return (
    <div className='tw-mt-5'>
      <span className='tw-text-base tw-mb-5 tw-block'>Enter the details</span>
      {fields.map((input, index) =>
        <div key={input.id}>
          <div className='tw-flex tw-items-start tw-gap-3 tw-mb-6 tw-relative'>
            <Controller
              name={`textboxes.${index}.inputType`} control={control}
              rules={{ required: 'This field is mandatory' }}
              render={({ field, fieldState }) => (
                <div className='tw-w-[300px]'>
                  <Dropdown options={answerOptions} value={field.value || ""} {...field}
                    onChange={(selectedValue) => {
                      field.onChange(selectedValue)
                      setValue(`textboxes.${index}.label`, "")
                      setAnswerType((prev) => {
                        const newValue = [...prev];
                        newValue[index] = selectedValue;
                        return newValue;
                      });
                    }}
                    valuekey="value" labelkey="label" label="Select Input Type" />
                  {fieldState?.error?.message && (
                    <ErrorBox>
                      <ErrorOutlineIcon fontSize="small" />
                      <span>{fieldState.error.message}</span>
                    </ErrorBox>
                  )}
                </div>
              )}
            />
            <Controller name={`textboxes.${index}.label`} control={control}
              render={({ field, fieldState }) =>
                renderTextFieldWithError(field, "Add a label (Optional)", fieldState.error, "text", "Add a label (Optional)")
              } />
            {answerType[index] === '1' && (
              <div className='tw-w-[300px] tw-py-[8.5px] tw-px-4 tw-bg-[#EEE] tw-rounded-md tw-text-grey'>Answer</div>
            )}
            {answerType[index] === '2' && (
              <div className='tw-w-[300px] tw-flex tw-gap-2 tw-py-[8.5px] tw-px-4 tw-bg-[#EEE] tw-rounded-md tw-text-grey'>
                <CallIcon className='tw-text-[#CCC]' />
                <span>Enter phone number</span>
              </div>
            )}
            {answerType[index] === '3' && (
              <div className='tw-w-[300px] tw-flex tw-gap-2 tw-py-[8.5px] tw-px-4 tw-bg-[#EEE] tw-rounded-md tw-text-grey'>
                <MailOutlineIcon className='tw-text-[#CCC]' />
                <span>Enter email address</span>
              </div>
            )}
            {answerType[index] === '4' && (
              <div className='tw-w-[300px] tw-flex tw-gap-2 tw-py-[8.5px] tw-px-4 tw-bg-[#EEE] tw-rounded-md tw-text-grey'>
                <DateRangeIcon className='tw-text-[#CCC]' />
                <span>Select Date</span>
              </div>
            )}
            {index >= 1 && <HighlightOffIcon className='tw-text-grey tw-w-[10%] tw-cursor-pointer'
              onClick={() => {
                remove(index)
                const updatedAnswerValue = [...answerType];
                updatedAnswerValue.splice(index, 1); // Remove the item at index
                setAnswerType(updatedAnswerValue);
              }}
            />}
          </div>
        </div>
      )}
      <Tooltip placement="top" title={`${fields.length > 4 ? 'max limit reached' : ''}`}>
        <Button variant='outlined' className="tw-w-fit !tw-mt-1 tw-block" disabled={fields.length > 4 ? true : false} onClick={() => { if (fields.length < 5) { append({ label: null, inputType: null }) } }}>Add more</Button>
      </Tooltip>
    </div>
  )
}
