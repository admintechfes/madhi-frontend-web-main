import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Dropdown } from '../components/Select';
import ScoreRange from '../components/StudentQuizRule/scorerange';
import { ErrorBox } from '../components/Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useDispatch } from 'react-redux';
import { createStudentQuizRule, getStudentQuizRuleGrade, getStudentQuizRuleLanguage, getStudentQuizRuleTags, updateStudentQuizRule } from './duck/network';
import { useSelector } from 'react-redux';
import ParentSelectSearch from '../components/parents/ParentSelectSearch';

export default React.memo(function CreateStudentQuizRule(props) {
  const loader = false
  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    mode: "onChange",
    defaultValues: props?.defaultValues ? props?.defaultValues : {}
  });
  const dispatch = useDispatch();
  const studentquizrulegradeData = useSelector((state) => state.studentquizrule.studentquizrulegradeData)
  const studentquizrulelanguageData = useSelector((state) => state.studentquizrule.studentquizrulelanguageData)
  const studentquizruletagsData = useSelector((state) => state.studentquizrule.studentquizruletagsData)
  const [tagObj, setTagObj] = useState({})
  const navigate = useNavigate();
  const location = useLocation();
  const { unit, programId } = location.state || {};

  useEffect(() => {
    if (props?.defaultValues) {
      dispatch(getStudentQuizRuleLanguage({ grade: props?.defaultValues?.grade }))
    }
    dispatch(getStudentQuizRuleGrade())
    dispatch(getStudentQuizRuleTags({ program_unit_id: unit?.id, currentTagId: props?.defaultValues?.tag_id || "" }))
  }, [props?.defaultValues])

  const watchFields = watch();

  const onSubmitTag = (data) => {
    if (props.formType === "edit") {
      dispatch(updateStudentQuizRule({ program_id: programId, program_unit_id: unit?.id, ...data, score_range_3: "100", tag_name: Object.keys(tagObj).length > 0 ? tagObj?.name : props.defaultValues.tag_name })).then((res) => {
        if (res?.data?.statusCode == 200) {
          navigate(`/programs-unit/student-quiz-rule`, { state: { unit: unit, programId: programId } })
        }
      })
    }
    else {
      dispatch(createStudentQuizRule({ program_id: programId, program_unit_id: unit?.id, ...data, score_range_3: "100", tag_name: tagObj?.name })).then((res) => {
        if (res?.data?.statusCode == 200) {
          navigate(`/programs-unit/student-quiz-rule`, { state: { unit: unit, programId: programId } })
        }
      })
    }
  }


  return (
    <>
      <div className='tw-flex tw-items-center tw-w-full tw-justify-between'>
        <a className='tw-cursor-pointer' onClick={() => navigate(`/programs-unit/student-quiz-rule`, { state: { unit: unit, programId: programId } })}>
          <ArrowBackIcon className='tw-text-grey' />
          <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>Student Quiz Rule</span>
        </a>
      </div>
      <Typography variant="h3" className='!tw-font-semibold'>Manage Student Quiz Rule</Typography>
      <Paper className='tw-w-full tw-p-6 tw-mt-6'>
        {loader ?
          <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">
            <CircularProgress />
          </div>
          :
          <form onSubmit={handleSubmit(onSubmitTag)}>
            <div className='tw-flex tw-justify-between tw-mb-7 tw-gap-7'>
              <div className="tw-flex tw-justify-between tw-items-start tw-w-1/2">
                <span>Select Grade</span>
                <div className="tw-w-[260px]">
                  <Controller
                    name="grade"
                    control={control}
                    rules={{ required: 'This field is mandatory' }}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <div className='tw-flex tw-flex-col'>
                          <Dropdown options={studentquizrulegradeData} value={value || ""} onChange={(selectedValue) => {
                            onChange(selectedValue)
                            dispatch(getStudentQuizRuleLanguage({ grade: selectedValue }))
                          }} valuekey="grade" labelkey="grade" label="Select Grade" />
                          {errors?.grade && (
                            <ErrorBox>
                              <ErrorOutlineIcon fontSize="small" />
                              <span>{errors?.grade?.message}</span>
                            </ErrorBox>
                          )}
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
              <div className="tw-flex tw-justify-between tw-items-start tw-w-1/2">
                <span>Select Subject</span>
                <div className="tw-w-[260px]">
                  <Controller
                    name="language"
                    control={control}
                    rules={watchFields?.grade && { required: 'This field is mandatory' }}
                    render={({ field }) => {
                      return (
                        <div className='tw-flex tw-flex-col'>
                          <Dropdown options={studentquizrulelanguageData} {...field} value={field.value || ""}
                            disabled={watchFields?.grade ? false : true} valuekey="language" labelkey="language" label="Select Language" />
                          {errors?.language && (
                            <ErrorBox>
                              <ErrorOutlineIcon fontSize="small" />
                              <span>{errors?.language?.message}</span>
                            </ErrorBox>
                          )}
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="tw-flex tw-items-start tw-w-[48.8%] tw-mb-7 tw-justify-between">
              <span>Select Tag number</span>
              <div className="tw-w-[260px]">
                <Controller
                  name="tag_id"
                  control={control}
                  rules={watchFields?.grade && { required: 'This field is mandatory' }}
                  render={({ field }) => {
                    return (
                      <div className='tw-flex tw-flex-col'>
                        <ParentSelectSearch options={studentquizruletagsData} onChange={(selectObj) => {
                          field.onChange(selectObj)
                        }} Obj={true} setObj={setTagObj} {...field} value={field.value || ""}
                          valuekey="id" labelkey="name" label="Select Tag" />
                        {errors?.tag_id && (
                          <ErrorBox>
                            <ErrorOutlineIcon fontSize="small" />
                            <span>{errors?.tag_id?.message}</span>
                          </ErrorBox>
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            </div>
            <div className="tw-flex tw-items-start tw-mb-7 tw-gap-[56px]">
              <span className='tw-text-nowrap'>Add Learning Outcome</span>
              <Controller name="learning_outcome" control={control}
                rules={{ required: 'This field is mandatory' }}
                render={({ field }) =>
                  <div className='tw-flex tw-flex-col tw-gap-1 tw-w-full'>
                    <TextField variant="outlined" type="text" inputProps={{ maxLength: 65 }} fullWidth
                      size="small" label="Learning Outcome" {...field} value={field.value || ''} />
                    <span className='tw-text-xs tw-text-grey'>Maximum 65 characters</span>
                    {errors?.learning_outcome && (
                      <ErrorBox>
                        <ErrorOutlineIcon fontSize="small" />
                        <span>{errors.learning_outcome.message}</span>
                      </ErrorBox>
                    )}
                  </div>
                }
              />
            </div>

            <ScoreRange control={control} watchFields={watchFields} />

            <div className='tw-absolute tw-top-12 tw-right-[55px]'>
              <Button type='submit' variant="contained" className="uppercase">{props?.formType === "edit" ? "Save" : "Create"}</Button>
            </div>
          </form>}
      </Paper>
    </>
  )
})
