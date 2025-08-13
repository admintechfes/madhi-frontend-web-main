import { Button, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { ErrorBox } from '../Errorbox';
import SelectComponent from '../Select';
import { DropAudioImage } from './DropAudioImage';
import Selectioncomponent from './selectioncomponent';

export default React.memo(function OptionsForm({ control, optionType, defaultValues, clearErrors, setValue, contentType, answertypeformat, showRes, setShowRes, formType, watchAllFields }) {
  const { fields, append, remove, watch } = useFieldArray({ control, name: 'options' });
  let AnswersData = [{ label: "Correct", value: "true" }, { label: "Incorrect", value: "false" }];
  const [error, setErr] = useState("");
  const [fileErrors, setFileErrors] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [key, setKey] = useState(0); // Key to reset input value
  const [selectionOptions, setSelectionOptions] = useState(fields.length)
  const [minVal, setMinVal] = useState(defaultValues?.min ? defaultValues?.min : "");

  useEffect(() => {
    if (contentType || answertypeformat || optionType) {
      fields.forEach((_, index) => {
        if (contentType === "1" || defaultValues?.contentType === "1") {
          setValue(`options.${index}.isCorrect`, "");
        }
        setValue(`options.${index}.label`, "");
        setValue(`options.${index}.mediaUrl`, "")
        clearErrors('options');
      });
      setSelectedFiles([]);
      setFileErrors([]);
    }
  }, [contentType, answertypeformat, setValue, optionType]);

  if (fields.length === 0) {
    append([{ label: "", isCorrect: "", mediaUrl: "" }, { label: "", isCorrect: "", mediaUrl: "" }]);
  }

  useEffect(() => {
    if (defaultValues?.questionnairesJson?.options) {
      fields.forEach((item, index) => {
        if (answertypeformat === "1" || answertypeformat === "4" || answertypeformat === "5") {
          setValue(`options.${index}.label`, item.label)
        }
        setValue(`options.${index}.isCorrect`, item?.isCorrect?.toString())
        let newData = [];
        newData.push(item.mediaUrl)
        setSelectedFiles(prev => [...prev, ...newData]);
        setValue(`options.${index}.mediaUrl`, ...newData)

      })
    }
  }, [])

  useEffect(() => {
    if (formType === "edit" && !showRes) {
      watchAllFields?.questionnairesJson?.options?.map((el) => {
        if (el.label === "Custom Response" || el.mediaUrl === "Custom Response") {
          remove(fields.length - 1)
        }
      })
    }
  }, [])


  useEffect(() => {
    let length = fields.length
    let updateOptions = Array.from({ length }, (_, i) => ({
      value: i + 1,
      label: i + 1
    }));
    setSelectionOptions(updateOptions)
  }, [fields])


  const renderTextFieldWithError = (field, label, errors, type) => (
    <div className="tw-w-full">
      <TextField variant="outlined" type={type} fullWidth size="small" label={label} placeholder='Add a option' {...field}
        value={field.value || ''} />
      {errors?.message && (
        <ErrorBox>
          <ErrorOutlineIcon fontSize="small" />
          <span>{errors.message}</span>
        </ErrorBox>
      )}
    </div>
  );

  const handleFileChange = (index, file) => {
    const newFiles = [...selectedFiles];
    newFiles[index] = file;
    setSelectedFiles(newFiles);
  };

  const handleFileError = (index, error) => {
    const newErrors = [...fileErrors];
    newErrors[index] = error;
    setFileErrors(newErrors);
  };


  const openResponse = () => {
    setShowRes(true);
  };

  const removeResponse = () => {
    setShowRes(false);
  }


  return (
    <div className='tw-flex tw-flex-col tw-items-start tw-gap-5 tw-mt-8'>
      {/* <span className='tw-text-[15px] tw-font-normal tw-text-primaryText'>Select the {optionType === "1" ? "radio button" : "checkbox"} for the correct answer</span> */}
      <div className='tw-flex tw-flex-col tw-w-[96%] tw-items-start tw-gap-5 tw-self-stretch'>
        {fields.map((input, index) => {
          return (
            <>
              {(input.label === "Custom Response" || input.mediaUrl === "Custom Response") ? null :
                <div key={input.id} className='tw-flex tw-items-center tw-gap-3 tw-self-stretch tw-relative'>
                  <div className='tw-w-full'>
                    <div className='tw-w-full tw-flex tw-items-center tw-gap-6'>
                      {(answertypeformat === "1" || answertypeformat === "4" || answertypeformat === "5") &&
                        <Controller name={`options.${index}.label`} control={control} rules={{ required: 'This field is mandatory' }}
                          render={({ field, fieldState }) => renderTextFieldWithError(field, `Option ${index + 1}`, fieldState.error, "text")}
                        />}
                      {answertypeformat === "1" ? null :
                        <Controller name={`options.${index}.mediaUrl`} control={control} rules={{ required: 'This field is mandatory' }}
                          render={({ field, fieldState }) =>
                            <div className='tw-w-full'>
                              <DropAudioImage css={true}
                                selectedFile={selectedFiles[index]}
                                setSelectedFile={(file) => handleFileChange(index, file)}
                                setFileError={(error) => handleFileError(index, error)}
                                fileError={fileErrors[index]}
                                setError={setErr} error={error} key={key} setKey={setKey} register={field}
                                onChange={(file) => field.onChange(file)} // Pass onChange method
                                {...field}
                                answertypeformat={answertypeformat}
                              />
                              {fieldState.error?.message && (
                                <ErrorBox>
                                  <ErrorOutlineIcon fontSize="small" />
                                  <span>{fieldState.error.message}</span>
                                </ErrorBox>
                              )}
                            </div>
                          }
                        />}
                      {(contentType === "1" || defaultValues?.contentType === "1") &&
                        <Controller name={`options.${index}.isCorrect`} control={control} rules={{ required: 'This field is mandatory' }}
                          render={({ field, fieldState }) => (
                            <div className='tw-flex tw-flex-col tw-w-full'>
                              <SelectComponent options={AnswersData} {...field} value={field.value} valuekey="value" labelkey="label" label="Answer"
                              />
                              {fieldState.error?.message && (
                                <ErrorBox>
                                  <ErrorOutlineIcon fontSize="small" />
                                  <span>{fieldState.error.message}</span>
                                </ErrorBox>
                              )}
                            </div>)
                          }
                        />}
                    </div>
                  </div>
                  {index >= 2 && <HighlightOffIcon className='tw-text-grey tw-w-[10%] tw-cursor-pointer tw-ml-3 tw-absolute tw-bottom-3 -tw-right-10' onClick={() => {
                    remove(index)
                    const updatedMediaValue = [...selectedFiles];
                    updatedMediaValue.splice(index, 1); // Remove the item at index
                    setSelectedFiles(updatedMediaValue)
                    setValue("min", "")
                    setMinVal("")
                    setValue("max", "")

                  }} />}
                </div>}
            </>
          )
        })}
      </div>
      <div className='tw-flex tw-gap-5'>
        <Tooltip placement="top" title={`${fields.length > 19 ? 'max limit reached' : ''}`}>
          <Button variant='outlined' disabled={fields.length > 19 ? true : false} onClick={() => {
            if (fields.length < 21) {
              if (contentType === "1") {
                append({ label: null, isCorrect: null })
              }
              else {
                setMinVal("")
                setValue("min", "")
                setValue("max", "")
                if (showRes) {
                  watchAllFields?.questionnairesJson?.options?.map((el) => {
                    if (el.label === "Custom Response" || el.mediaUrl === "Custom Response") {
                      if (selectedFiles.includes("Custom Response")) {
                        let updateFiles = [...selectedFiles.slice(0, -1)];
                        setSelectedFiles(updateFiles)
                      }
                    }
                  })
                }
                append({ label: null, mediaUrl: null })
              }
            }
          }}>Add more</Button>
        </Tooltip>
        {answertypeformat !== "1" ? null : (!showRes && (contentType === "2" || defaultValues?.contentType === "2")) && <Button variant='outlined' onClick={openResponse}>Add "Custom Response"</Button>}
      </div>
      {answertypeformat !== "1" ? null : (showRes && (contentType === "2" || defaultValues?.contentType === "2")) &&
        <div className='tw-w-1/2 tw-flex tw-items-center tw-mt-5'>
          <Controller name="response" control={control}
            render={({ field }) =>
              <div className='tw-w-full'>
                <TextField variant="outlined" type="text" disabled={true} {...field}
                  fullWidth size="small" label={`Option ${watchAllFields?.options?.length + 1}`} value='To be add by user'
                />
              </div>
            }
          />
          <HighlightOffIcon className="tw-text-grey tw-cursor-pointer tw-ml-3" onClick={removeResponse} />
        </div>
      }
      {(contentType === "2" || defaultValues?.contentType === "2") && optionType === "2" && 
        <Selectioncomponent control={control} selectionOptions={selectionOptions} setValue={setValue} minVal={minVal} setMinVal={setMinVal} />}
    </div>
  );
});
