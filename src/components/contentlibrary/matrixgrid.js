import React from 'react'
import RowForm from './rowform';
import ColumnForm from './columnform';

export default function MatrixGrid({ control, optionType, defaultValues, setValue, errors, contentType,setError }) {

  return (
    <>
      <div className='tw-border-b  tw-border-[#999] tw-pb-10 tw-mt-8 tw-w-full'>
        <span className='tw-text-base tw-mb-2 tw-block'>Enter the row details</span>
        <RowForm control={control} optionType={optionType} setError={setError} defaultValues={defaultValues} setValue={setValue} errors={errors} contentType={contentType}/>
      </div>
      <div>
        <span className='tw-text-base tw-mb-7 tw-mt-7 tw-block'>Enter the column details</span>
        <ColumnForm control={control} optionType={optionType} setError={setError} defaultValues={defaultValues} setValue={setValue} errors={errors} contentType={contentType}/>
      </div>
    </>

  )
}
