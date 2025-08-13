import { Button, Checkbox, FormControlLabel, FormGroup, Paper, TextField, Tooltip } from '@mui/material';
import React, { useEffect } from 'react'
import { Controller, useFieldArray } from 'react-hook-form';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { ErrorBox } from '../Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


export default function RowForm({ control, defaultValues, setValue }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'matrixData.structure.rows' });

  useEffect(() => {
    if (defaultValues?.questionnairesJson?.structure?.rows) {
      fields.map((item, index) => {
        setValue(`matrixData.structure.rows.${index}.label`, item?.label)
        setValue(`matrixData.structure.rows.${index}.canSkip`, item?.canSkip)
      })
    }
  }, [])


  if (fields.length === 0) {
    append({ label: null, canSkip: false });
  }

  const renderTextFieldWithError = (field, label, errors, type) => (
    <div className="tw-w-[300px]">
      <TextField variant="outlined" maxLength={20} type={type} fullWidth size="small" label={label} placeholder={label} {...field}
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
    <div className='tw-flex tw-flex-col'>
      {fields.map((input, index) =>
        <Paper className='tw-w-[94%] tw-p-6 tw-mt-5 tw-relative' key={input.id}>
          <div className='tw-flex tw-w-full tw-justify-between'>
            <Controller name={`matrixData.structure.rows.${index}.label`} control={control} rules={{ required: 'This field is mandatory' }}
              render={({ field, fieldState }) => renderTextFieldWithError(field, "Enter Row Name", fieldState.error, "text")}
            />
            <Controller name={`matrixData.structure.rows.${index}.canSkip`} control={control} render={({ field }) =>
              <FormGroup {...field}>
                <FormControlLabel control={<Checkbox checked={field.value || ""} />} label="Mark as Non-Mandatory" />
              </FormGroup>
            } />
          </div>
          {index >= 1 && <HighlightOffIcon className='tw-text-grey tw-w-[10%] tw-cursor-pointer tw-ml-3 tw-absolute tw-bottom-7 -tw-right-12' onClick={() => { remove(index) }} />}
        </Paper>
      )}
      <Tooltip placement="top" title={`${fields.length > 4 ? 'max limit reached' : ''}`}>
        <Button variant='outlined' className="tw-w-fit !tw-mt-5 tw-block" disabled={fields.length > 4 ? true : false} onClick={() => { if (fields.length < 5) { append({ label: null, canSkip: false }) } }}>Add more</Button>
      </Tooltip>
    </div>
  )
}

