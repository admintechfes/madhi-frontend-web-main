import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Paper, TextField, Tooltip, Button } from '@mui/material';
import { Controller, useFieldArray } from 'react-hook-form';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallIcon from '@mui/icons-material/Call';
import EventIcon from '@mui/icons-material/Event';
import { Dropdown } from '../Select';
import { ErrorBox } from '../Errorbox';

const renderTextFieldWithError = (field, label, errors, type, placeholder, maxLength) => (
  <div className="tw-w-[300px]">
    <TextField variant="outlined" maxLength={maxLength} type={type} fullWidth
      size="small" label={label} placeholder={placeholder} {...field} value={field.value || ''} />
    {errors?.message && (
      <ErrorBox>
        <ErrorOutlineIcon fontSize="small" />
        <span>{errors.message}</span>
      </ErrorBox>
    )}
  </div>
);

const answerOptions = [
  { value: '1', label: 'Textbox' },
  { value: '5', label: 'Drop-down Menus' },
  { value: '3', label: 'Email' },
  { value: '2', label: 'Phone Number' },
  { value: '4', label: 'Date' },
];

export default function ColumnForm({ control, optionType, defaultValues, setValue, errors, contentType, setError }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'matrixData.structure.columns' });
  const [answerType, setAnswerType] = useState([]);

  useEffect(() => {
    if (defaultValues?.questionnairesJson?.structure?.columns) {
      fields.map((item, index) => {
        setValue(`matrixData.structure.columns.${index}.label`, item?.label)
        setValue(`matrixData.structure.columns.${index}.inputType`, item?.inputType)
        if (item?.children?.length > 0) {
          item?.children?.map((el, i) => {
            setValue(`matrixData.structure.columns.${index}.children.${i}.label`, el?.label)
          })
        }
      })
      let newData = [...fields].map(el => el.inputType);
      setAnswerType(newData)
    }
  }, [])


  if (fields.length == 0) {
    append({ label: "", inputType: "" });
  }

  return (
    <div>
      {fields.map((input, index) => (
        <div key={input.id}>
          <Paper className='tw-w-[94%] tw-p-6 tw-mt-3 tw-mb-5 tw-relative tw-flex tw-flex-col'>
            <div className='tw-flex tw-gap-7'>
              <Controller name={`matrixData.structure.columns.${index}.label`} control={control}
                rules={{ required: 'This field is mandatory' }}
                render={({ field, fieldState }) =>
                  renderTextFieldWithError(field, "Enter Column Name", fieldState.error, "text", "Enter Column Name", 20)
                } />
              <Controller
                name={`matrixData.structure.columns.${index}.inputType`} control={control}
                rules={{ required: 'This field is mandatory' }}
                render={({ field, fieldState }) => (
                  <div className='tw-w-[300px]'>
                    <Dropdown options={answerOptions} value={field.value || ""} {...field}
                      onChange={(selectedValue) => {
                        field.onChange(selectedValue)
                        setValue(`matrixData.structure.columns.${index}.children`, [])
                        setAnswerType((prev) => {
                          const newValue = [...prev];
                          newValue[index] = selectedValue;
                          return newValue;
                        });
                      }}
                      valuekey="value" labelkey="label" label="Select Answer Type" />
                    {fieldState?.error?.message && (
                      <ErrorBox>
                        <ErrorOutlineIcon fontSize="small" />
                        <span>{fieldState.error.message}</span>
                      </ErrorBox>
                    )}
                  </div>
                )}
              />
            </div>
            {answerType[index] === '1' && (
              <div className='tw-w-[300px] tw-mt-5 tw-py-[8.5px] tw-px-4 tw-bg-[#EEE] tw-rounded-md tw-text-grey'>Answer</div>
            )}
            {answerType[index] === '5' && (
              <MenuOption control={control} index={index} Parentsfields={fields} answerType={answerType} optionType={optionType} setError={setError} defaultValues={defaultValues} setValue={setValue} errors={errors} contentType={contentType} />
            )}
            {answerType[index] === '3' && (
              <div className='tw-w-[300px] tw-flex tw-gap-2 tw-mt-5 tw-py-[8.5px] tw-px-4 tw-bg-[#EEE] tw-rounded-md tw-text-grey'>
                <MailOutlineIcon className='tw-text-grey' />
                <span>Enter email address</span>
              </div>
            )}
            {answerType[index] === '2' && (
              <div className='tw-w-[300px] tw-flex tw-gap-2 tw-mt-5 tw-py-[8.5px] tw-px-4 tw-bg-[#EEE] tw-rounded-md tw-text-grey'>
                <CallIcon className='tw-text-grey' />
                <span>Enter phone number</span>
              </div>
            )}
            {answerType[index] === '4' && (
              <div className='tw-w-[300px] tw-flex tw-gap-2 tw-mt-5 tw-py-[8.5px] tw-px-4 tw-bg-[#EEE] tw-rounded-md tw-text-grey'>
                <EventIcon className='tw-text-grey' />
                <span>Select Date</span>
              </div>
            )}
            {index >= 1 && (
              <HighlightOffIcon
                className='tw-text-grey tw-w-[10%] tw-cursor-pointer tw-ml-3 tw-absolute top-[50%] -tw-translate-x-1/2 -tw-translate-y-1/2 tw-bottom-7 -tw-right-12'
                onClick={() => {
                  remove(index)
                  const updatedAnswerValue = [...answerType];
                  updatedAnswerValue.splice(index, 1); // Remove the item at index
                  setAnswerType(updatedAnswerValue);
                }}
              />
            )}
          </Paper>
        </div>
      ))}
      <Tooltip placement="top" title={`${fields.length > 4 ? 'max limit reached' : ''}`}>
        <Button variant='outlined' className="tw-w-fit !tw-mt-1 tw-block"
          disabled={fields.length > 4}
          onClick={() => {
            if (fields.length < 5) {
              append({ label: null, inputType: null, children: [{ label: null }, { label: null }] })
            }
          }}>
          Add more
        </Button>
      </Tooltip>
    </div>
  );
}

function MenuOption({ control, index, optionType, defaultValues, answerType, setValue, errors, Parentsfields, contentType, setError }) {
  const { fields, append, remove } = useFieldArray({ control, name: `matrixData.structure.columns.${index}.children` });


  useEffect(() => {
    if (fields.length == 0) {
      append([{ label: "" }, { label: "" }]);
    }
  }, []);

  return (
    <div className='tw-mt-5'>
      {fields.map((input, childIndex) => (
        <div className='tw-mb-5 tw-relative tw-w-[340px]' key={input.id}>
          <Controller
            name={`matrixData.structure.columns.${index}.children.${childIndex}.label`}
            control={control}
            rules={{ required: 'This field is mandatory' }}
            render={({ field, fieldState }) =>
              renderTextFieldWithError(field, "Menu Detail", fieldState.error, "text", "Add a Menu Option")
            }
          />
          {childIndex >= 2 && (
            <HighlightOffIcon
              className='tw-text-grey tw-w-[10%] tw-cursor-pointer tw-ml-3 tw-absolute tw-bottom-2 tw-right-0'
              onClick={() => remove(childIndex)}
            />
          )}
        </div>
      ))}
      <Tooltip placement="top" title={`${fields.length > 4 ? 'max limit reached' : ''}`}>
        <Button variant='outlined' className="uppercase tw-w-fit !tw-mt-1 tw-block"
          disabled={fields.length > 4}
          onClick={() => {
            if (fields.length < 5) {
              append({ label: "" })
            }
          }}>
          Add Menu
        </Button>
      </Tooltip>
    </div>
  );
}
