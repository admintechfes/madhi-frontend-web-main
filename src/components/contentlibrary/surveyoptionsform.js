import { TextareaAutosize } from '@mui/material'
import React from 'react'
import MatrixGrid from './matrixgrid'
import MultipleTextBox from './multipletextbox'
import FileUploadComponent from './fileuploadcomponent'

export default function SurveyOptionsForm({ control, optionType, defaultValues, setMediaType, mediaType, setValue, errors, contentType, setError, register }) {
  return (
    <div>
      {(optionType === "3" || optionType === "4") && <TextareaAutosize disabled={true} className='tw-w-full tw-mt-4 tw-p-5 tw-rounded-xl tw-bg-[#EEE]' aria-label="minimum height" minRows={5} placeholder="Answer" />}
      {optionType === "5" && <MatrixGrid control={control} optionType={optionType} setError={setError} defaultValues={defaultValues} setValue={setValue} errors={errors} contentType={contentType} />}
      {optionType === "6" && <MultipleTextBox control={control} optionType={optionType} setError={setError} defaultValues={defaultValues} setValue={setValue} errors={errors} contentType={contentType} />}
      {optionType === "7" && <FileUploadComponent control={control} setMediaType={setMediaType} mediaType={mediaType} optionType={optionType} setError={setError} defaultValues={defaultValues} setValue={setValue} errors={errors} contentType={contentType} />}
    </div>
  )
}
