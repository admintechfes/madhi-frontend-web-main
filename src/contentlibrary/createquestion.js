import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Paper, TextField, TextareaAutosize, Typography } from '@mui/material';
import { Dropdown } from '../components/Select';
import { ErrorBox } from '../components/Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Controller, useForm } from 'react-hook-form';
import SelectComponent from '../components/Select';
import OptionsForm from '../components/contentlibrary/optionsform';
import { useDispatch, useSelector } from 'react-redux';
import DropDownAddWithSearch from '../components/contentlibrary/DropDownAddWithSearch';
import { toast } from 'react-toastify';
import axiosInstance from '../config/Axios';
import { fillTabSucess, fillTags } from './duck/contentlibrarySlice';
import { UpdateQuestion, createQuestion, createTag, getAllTags } from './duck/network';
import { DropAudioImage } from '../components/contentlibrary/DropAudioImage';
import SurveyOptionsForm from '../components/contentlibrary/surveyoptionsform';

const AnswerTypeDataForSurvey = [
  { label: "Short Answer (200 character)", optionType: "3" },
  { label: "Long Answer (1000 character)", optionType: "4" },
  { label: "Multiple Choice (One answer)", optionType: "1" },
  { label: "Multiple Choice (Many answers)", optionType: "2" },
  { label: "Matrix Grid", optionType: "5" },
  { label: "Multiple textboxes", optionType: "6" },
  { label: "File upload", optionType: "7" }
]

const AnswerTypeDataForQuiz = [
  { label: "Multiple Choice (One answer)", optionType: "1" },
  { label: "Multiple Choice (Many answers)", optionType: "2" },
]

const QuizAnswerFormatData = [
  { label: "Text", value: "1" },
  { label: "Image", value: "2" },
  { label: "Image with text", value: "4" },
  { label: "Audio", value: "3" },
  { label: "Audio with text", value: "5" }
]

export default function CreateQuestion(props) {
  const loader = useSelector((state) => state.loader.openTableLoader);
  const [searchData, setSearchData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedValues, setSelectedValues] = useState(props.defaultValues ? props?.defaultValues?.tagObject?.map(item => item.id) : []);
  const { control, register, handleSubmit, formState: { errors }, setValue, setError, reset, clearErrors, watch } = useForm({
    mode: "onChange", defaultValues: props.defaultValues ? {
      ...props.defaultValues,
      answerType: props.defaultValues.questionnairesJson?.meta?.answerType,
      answerFormat: props.defaultValues?.questionnairesJson?.meta?.answerFormat,
      options: props.defaultValues?.questionnairesJson?.options,
      matrixData: {
        structure: {
          rows: props.defaultValues?.questionnairesJson?.structure?.rows,
          columns: props.defaultValues?.questionnairesJson?.structure?.columns,
        }
      },
      textboxes: props.defaultValues?.questionnairesJson?.textboxes,
      tagIds: props.defaultValues?.tagObject,
      uploadLimit: props.defaultValues?.questionnairesJson?.uploadLimit,
      allowedMediaType: props.defaultValues?.questionnairesJson?.allowedMediaType
    } : {}
  });
  const dispatch = useDispatch();
  const tagsData = useSelector((state) => state.contentlibrary.tagsData)
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(props.defaultValues ? props?.defaultValues?.tagObject?.map(item => item.id) : []);
  const [error, setErr] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [key, setKey] = useState(0); // Key to reset input value
  const [fileError, setFileError] = useState('');
  const [answertype, setAnswerType] = useState(props.defaultValues?.questionnairesJson?.meta.answerType ? props.defaultValues?.questionnairesJson?.meta.answerType : "");
  const [contentType, setContentType] = useState("");
  const [AnswerTypeData, setAnswerTypeData] = useState(AnswerTypeDataForQuiz)
  const [answertypeformat, setAnswerTypeFormat] = useState(props.defaultValues?.questionnairesJson?.meta.answerFormat ? props.defaultValues?.questionnairesJson?.meta.answerFormat : "")
  const [Index, setIndex] = useState(null);
  const [mediaType, setMediaType] = useState(props.defaultValues?.questionnairesJson?.allowedMediaType ? props.defaultValues?.questionnairesJson?.allowedMediaType : "");
  const watchAllFields = watch();
  const [showRes, setShowRes] = useState(false);

  useEffect(() => {
    let url = `/v1/tags`;
    async function fetchData() {
      try {
        const response = await axiosInstance.post(url);
        setSearchData(response?.data.data)
        dispatch(fillTags(response?.data?.data));
      } catch (err) {
        if (err.response?.data.statusCode !== 401) toast.error(err?.response?.data?.userMessageTitle);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (props?.defaultValues) {
      if (props.defaultValues?.contentType == 1) {
        setAnswerTypeData(AnswerTypeDataForQuiz)
      }
      if (props.defaultValues?.contentType == 2) {
        setAnswerTypeData(AnswerTypeDataForSurvey)
      }
      if (props.defaultValues?.questionnairesJson?.meta.answerType) {
        setValue("answerType", props.defaultValues?.questionnairesJson?.meta.answerType)
      }
      if (props.defaultValues?.questionnairesJson?.meta.answerFormat) {
        setValue("answerFormat", props.defaultValues?.questionnairesJson?.meta.answerFormat)
      }
      setSelectedFile(props?.defaultValues?.mediaUrl)
    }
  }, [])

  useEffect(() => {
    if (props.formType === "edit") {
      watchAllFields?.questionnairesJson?.options?.map((el) => {
        if (el.label === "Custom Response" || el.mediaUrl === "Custom Response") {
          setShowRes(true)
        }
        else {
          setShowRes(false)
        }
      })
    }
  }, [])


  const onSubmitQuestions = (data) => {
    if (showRes) {
      if (answertypeformat === "1") {
        data.options.push({ label: "Custom Response" })
      }
      else if (answertypeformat === "2" || answertypeformat === "4") {
        data.options.push({ mediaUrl: "Custom Response" })
      }
      else {
        data.options.push({ label: "Custom Response", mediaUrl: "Custom Response", isSelected: false })
      }
    }
    else {
      data.options = data?.options?.filter(option => (option?.label !== "Custom Response" || option?.mediaUrl !== "Custom Response"))
    }
    if (props.formType === "edit") {
      dispatch(UpdateQuestion({ ...data, tagIds: selectedId, id: props.defaultValues.id })).then((res) => {
        if (res?.data?.statusCode == 200) {
          navigate('/content-library');
          dispatch(fillTabSucess(data.contentType))
        }
      })
    }
    else {
      dispatch(createQuestion({ ...data, tagIds: selectedId })).then((res) => {
        if (res?.data?.statusCode == 200) {
          navigate('/content-library');
          dispatch(fillTabSucess(data.contentType))
        }
      })
    }
  }

  const AddNewData = () => {
    dispatch(createTag({ name: searchText })).then((res) => {
      res.data.statusCode == 200 && dispatch(getAllTags()).then((response) => {
        setSearchData(response.data)
      })
    })
  }

  
  return (
    <>
      <div className='tw-flex tw-items-center tw-w-full tw-justify-between'>
        <Link to="/content-library">
          <ArrowBackIcon className='tw-text-grey' />
          <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>Content Library</span>
        </Link>
      </div>
      <Typography variant="h2" className='!tw-font-semibold !tw-text-secondaryText'>{props.formType === "edit" ? "Edit Question Details" : "Create New Question"}</Typography>
      <Paper className='tw-w-full tw-p-6 tw-mt-6'>
        {loader ?
          <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">
            <CircularProgress />
          </div>
          :
          <form onSubmit={handleSubmit(onSubmitQuestions)}>
            <div className="tw-grid tw-grid-cols-2 tw-gap-7 tw-mb-5">
              <Controller name="contentType" control={control} rules={{ required: 'Please add the title' }}
                render={({ field }) => (
                  <div className='tw-flex tw-flex-col'>
                    <Dropdown label="Question for" disabled={props.formType === "edit" ? true : false} value={field.value || ""} {...field} onChange={(newvalue) => {
                      field.onChange(newvalue)
                      setContentType(newvalue)
                      setValue("title", "")
                      setValue("description", "")
                      setSelectedFile(null)
                      setValue("answerType", "")
                      setValue("answerFormat", "")
                      setAnswerType("")
                      setAnswerTypeFormat("")
                      if (newvalue == 1) {
                        setAnswerTypeData(AnswerTypeDataForQuiz)
                      }
                      if (newvalue == 2) {
                        setAnswerTypeData(AnswerTypeDataForSurvey)
                      }
                    }} labelkey="label" valuekey="value" options={[
                      { label: 'Quiz', value: "1" },
                      { label: 'Survey', value: "2" }]}
                    />
                    {errors.contentType && (
                      <ErrorBox>
                        <ErrorOutlineIcon fontSize="small" />
                        <span>{errors.contentType.message}</span>
                      </ErrorBox>
                    )}
                  </div>
                )}
              />
              <Controller name="tagIds" control={control} rules={{ required: 'Please Select Tags' }} render={({ field }) => (
                <div className='tw-flex tw-flex-col'>
                  <DropDownAddWithSearch
                    setSearchData={setSearchData}
                    defaultValues={props?.defaultValues?.tagObject?.map(item => item?.name)}
                    onChange={setSelectedValues}
                    selectedValues={selectedValues}
                    searchData={searchData}
                    Data={tagsData}
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
              )} />
            </div>
            {(contentType || props?.defaultValues?.contentType) && <div className='tw-bg-[#FBFBFB] tw-p-6'>
              <div className='tw-w-full tw-flex tw-justify-between tw-items-start tw-mb-5'>
                <span className='tw-text-sm tw-text-grey'>Accepted filetypes: .jpeg, .png, .mp3 (under 2MB) and image aspect ratio must be 1:1</span>
                <Controller name="addCommentBox" control={control} render={({ field }) =>
                  <FormGroup {...field} className='!-tw-mt-3'>
                    <FormControlLabel control={<Checkbox checked={field.value} />} label="Add comment textbox" />
                  </FormGroup>
                } />
              </div>
              <Controller name="title" control={control} rules={{ required: 'Please add question to save!' }}
                render={({ field }) => (
                  <>
                    <TextField fullWidth size="small" label="Question" placeholder='Add a title'  {...field} error={errors.title ? true : false} />
                    {errors.title && (
                      <ErrorBox>
                        <ErrorOutlineIcon fontSize="small" />
                        <span>{errors.title.message}</span>
                      </ErrorBox>
                    )}
                  </>
                )}
              />
              <Controller name="description" control={control}
                render={({ field }) => (
                  <div className='tw-mt-5'>
                    <TextField fullWidth size="small" label="Question Description (Optional)" placeholder='Add a Description'  {...field} error={errors.description ? true : false} />
                    {errors.description && (
                      <ErrorBox>
                        <ErrorOutlineIcon fontSize="small" />
                        <span>{errors.description.message}</span>
                      </ErrorBox>
                    )}
                  </div>
                )}
              />
              <Controller name="mediaUrl" control={control}
                render={({ field }) => (
                  <a className='tw-mt-5 tw-block'>
                    <DropAudioImage {...field} fileError={fileError} setFileError={setFileError} setError={setErr} error={error} key={key}
                      setKey={setKey} setSelectedFile={setSelectedFile}
                      selectedFile={selectedFile}
                      register={register}
                      optionalFile={true}
                    />
                  </a>
                )}
              />
              {(contentType || props?.defaultValues?.contentType) && <div className='tw-flex tw-gap-5 tw-items-center tw-mt-9'>
                <div className={`tw-flex tw-items-center tw-gap-5 ${(answertype === "1" || answertype === "2") ? "tw-w-full" : "tw-w-[600px]"}`}>
                  <span className='text-[15px] tw-text-grey'>Type</span>
                  <Controller name="answerType" control={control} rules={{ required: 'This field is mandatory' }}
                    render={({ field: { onChange, value } }) => (
                      <div className='tw-flex tw-flex-col tw-w-full'>
                        <SelectComponent options={AnswerTypeData} valuekey="optionType" labelkey="label" value={value || ""} label="Select Answer Type"
                          onChange={(newvalue) => {
                            onChange(newvalue)
                            setAnswerType(newvalue)
                            setValue("answerFormat", "")
                            setAnswerTypeFormat("")
                            watchAllFields?.options?.forEach((_, index) => {
                              setValue(`options.${index}.isCorrect`, "");
                              setValue(`options.${index}.label`, "");
                              setValue(`options.${index}.mediaUrl`, "")
                            })
                            watchAllFields?.textboxes?.forEach((_, index) => {
                              setValue(`textboxes.${index}.label`, "")
                              setValue(`textboxes.${index}.inputType`, "")
                              setError(`textboxes.${index}.inputType`, { type: '', message: '' })
                            })
                            if (watchAllFields.questionnairesJson?.allowedMediaType && watchAllFields.questionnairesJson?.uploadLimit) {
                              setValue("allowedMediaType", "")
                              setValue("uploadLimit", "")
                              setError(`allowedMediaType`, { type: '', message: '' })
                              setError(`uploadLimit`, { type: '', message: '' })
                              setMediaType("")
                            }
                            watchAllFields?.matrixData?.structure?.rows?.forEach((_, index) => {
                              setValue(`matrixData.structure.rows.${index}.label`, "")
                              setValue(`matrixData.structure.rows.${index}.canSkip`, "")
                              setError(`matrixData.structure.rows.${index}.label`, { type: '', message: '' })
                              setError(`matrixData.structure.rows.${index}.canSkip`, { type: '', message: '' })
                            })
                            watchAllFields?.matrixData?.structure.columns?.forEach((_, index) => {
                              setValue(`matrixData.structure.columns.${index}.label`, "")
                              setValue(`matrixData.structure.columns.${index}.inputType`, "")
                              setError(`matrixData.structure.columns.${index}.label`, { type: '', message: '' })
                              setError(`matrixData.structure.columns.${index}.inputType`, { type: '', message: '' })
                            })
                            setShowRes(false)
                          }}
                        />
                        {errors.answerType && (
                          <ErrorBox>
                            <ErrorOutlineIcon fontSize="small" />
                            <span>{errors.answerType.message}</span>
                          </ErrorBox>
                        )}
                      </div>
                    )}
                  />
                </div>
                {((contentType === "1" || props.defaultValues?.contentType === "1") || (answertype === "1" || answertype === "2")) && <Controller name="answerFormat" control={control} rules={{ required: 'This field is mandatory' }}
                  render={({ field: { onChange, value } }) => {
                    const mergedOnChange = (selectedValue) => {
                      onChange(selectedValue)
                      setAnswerTypeFormat(selectedValue)
                    };
                    return (
                      <div className='tw-flex tw-flex-col tw-w-full'>
                        <SelectComponent disabled={(answertype || props.defaultValues?.questionnairesJson?.meta.answerFormat) ? false : true} options={QuizAnswerFormatData} valuekey="value" labelkey="label" value={value || ""} label="Select Answer Format"
                          onChange={mergedOnChange} />
                        {errors.answerFormat && (
                          <ErrorBox>
                            <ErrorOutlineIcon fontSize="small" />
                            <span>{errors.answerFormat.message}</span>
                          </ErrorBox>
                        )}
                      </div>
                    )
                  }
                  }
                />}
              </div>}
              {answertypeformat ?
                <OptionsForm setError={setError} reset={reset} clearErrors={clearErrors} errors={errors}
                  contentType={contentType} answertypeformat={answertypeformat}
                  setValue={setValue} setIndex={setIndex} defaultValues={props.defaultValues} control={control}
                  register={register} formType={props.formType} watchAllFields={watchAllFields}
                  AnswerFormatData={QuizAnswerFormatData} optionType={answertype} showRes={showRes} setShowRes={setShowRes} />
                : null}
              {(contentType === "2" || props?.defaultValues?.contentType === "2") &&
                <SurveyOptionsForm setError={setError} errors={errors} contentType={contentType}
                  setValue={setValue} defaultValues={props.defaultValues} control={control}
                  register={register} optionType={answertype}
                  setMediaType={setMediaType} mediaType={mediaType}
                />}
            </div>
            }
            <div className='tw-absolute tw-top-6 tw-right-[34px] tw-flex tw-gap-x-4'>
              <Button variant="outlined" className="uppercase" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type='submit' variant="contained" className="uppercase">{props.formType === "edit" ? "Save" : "Create"}</Button>
            </div>
          </form>
        }
      </Paper>
    </>
  )
}

