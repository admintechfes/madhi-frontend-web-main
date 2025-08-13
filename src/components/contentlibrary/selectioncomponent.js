import React, { useState } from 'react'
import { Controller } from 'react-hook-form'
import SelectComponent from '../Select'
import { Button } from '@mui/material'
import { ErrorBox } from '../Errorbox'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


export default function Selectioncomponent({ selectionOptions, control, setValue, setMinVal, minVal }) {

  const onReset = () => {
    setMinVal("")
    setValue("min", "")
    setValue("max", "")
  }

  return (
    <div className='mt-5 tw-flex tw-flex-col tw-gap-5 tw-w-[60%] tw-mb-5'>
      <span>Add Min. and Max. selection</span>
      <div className='tw-flex tw-gap-3 tw-items-start'>
        <Controller name="min" control={control}
          render={({ field }) => {
            const handleChange = (val) => {
              field.onChange(val)
              setMinVal(val)
            }
            return (
              <div className='tw-flex tw-flex-col tw-w-full'>
                <SelectComponent options={Array.isArray(selectionOptions) ? selectionOptions : []} onChange={handleChange} value={minVal} valuekey="value" labelkey="label" label="Min Select Answer"
                />
                {field.minLimit?.message && (
                  <ErrorBox>
                    <ErrorOutlineIcon fontSize="small" />
                    <span>{field.minLimit.message}</span>
                  </ErrorBox>
                )}
              </div>
            )
          }
          }
        />
        <Controller name="max" control={control}
          render={({ field }) => (
            <div className='tw-flex tw-flex-col tw-w-full'>
              <SelectComponent options={Array.isArray(selectionOptions) ? selectionOptions : []} {...field} value={field.value || ""} valuekey="value" labelkey="label" label="Max Select Answer"
              />
              {minVal > field.value && (
                <ErrorBox>
                  <ErrorOutlineIcon fontSize="small" />
                  <span>Max responses can't be less than min responses.Please adjust</span>
                </ErrorBox>
              )}
            </div>)
          }
        />
        <Button variant='outlined' onClick={onReset}>Reset</Button>
      </div>
    </div>

  )
}
