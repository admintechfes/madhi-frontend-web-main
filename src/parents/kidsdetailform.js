import { Button, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray } from 'react-hook-form';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ErrorBox } from '../Errorbox';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Dropdown } from '../Select';
import { useDispatch, useSelector } from 'react-redux';
import { getGenderList, getGradeList, getRelationshipList, getSchoolList } from '../../parents/duck/network';
import { BasicDatePicker } from '../../components/DatePicker';
import moment from 'moment';

export default React.memo(function KidsDetailForm({ control, defaultValues, formType, setError, setValue }) {
  const dispatch = useDispatch();
  const genderList = useSelector((state) => state.parents.genderData);
  const gradesList = useSelector((state) => state.parents.gradeData);
  const schoolList = useSelector((state) => state.parents.schoolListData);
  const relationshipList = useSelector((state) => state.parents.relationshipListData);
  const [relationshipvalue, setRelationshipValue] = useState([]);
  const [showotherRelationship, setShowOtherRelationship] = useState(false);
  const [relationshipText, setRelationshipText] = useState([]);
  const [schoolvalue, setSchoolValue] = useState([]);
  const [showotherSchool, setShowOtherSchool] = useState(false);
  const [schoolText, setSchoolText] = useState([]);

  useEffect(() => {
    dispatch(getGenderList())
    dispatch(getGradeList())
    dispatch(getSchoolList())
    dispatch(getRelationshipList())
  }, [])

  useEffect(() => {
    if (formType === "edit") {
      const newData = defaultValues.kids.map(item => {
        return relationshipList.some(el => item?.relationship?.toLowerCase() !== el?.relationship?.toLowerCase());
      });
      setShowOtherRelationship(newData)

      const otherRelationshipData = defaultValues.kids.filter(item => {
        return relationshipList.map(el => item?.relationship?.toLowerCase() === el?.relationship?.toLowerCase());
      });
      setRelationshipText([...otherRelationshipData.map(el => el?.relationship)])

      const editData = defaultValues.kids.map(item => {
        return relationshipList.find(el => item?.relationship?.toLowerCase() === el?.relationship?.toLowerCase())
      });
      setRelationshipValue(editData.map((el) => { return !el?.relationship ? "other (please enter)" : el?.relationship }));
    }
  }, [defaultValues, formType, relationshipList])


  useEffect(() => {
    if (formType === "edit") {
      const newData = defaultValues.kids.map(item => {
        return schoolList.some(el => item?.school?.toLowerCase() !== el?.school?.toLowerCase());
      });
      setShowOtherSchool(newData)

      const otherSchoolData = defaultValues.kids.filter(item => {
        return schoolList.map(el => item?.school?.toLowerCase() === el?.school?.toLowerCase());
      });
      setSchoolText([...otherSchoolData.map(el => el?.school)])

      const editData = defaultValues.kids.map(item => {
        return schoolList.find(el => item?.school?.toLowerCase() === el?.school?.toLowerCase())
      });
      setSchoolValue(editData.map((el) => { return !el?.school ? "other (please enter)" : el?.school }));
    }
  }, [defaultValues, formType, schoolList])


  const { fields, append, remove } = useFieldArray({ control, name: 'kids' });
  if (fields.length === 0) {
    append({ name: null, grade: null, dob: null, school: null, relationship: null, gender: null, });
  }

  const renderTextFieldWithError = (field, label, errors, onKeyPress, type) => (
    <div className="tw-w-full">
      <TextField variant="outlined" type={type} fullWidth size="small" label={label} {...field} onKeyPress={onKeyPress}
        value={field.value || ''} />
      {errors && (
        <ErrorBox>
          <ErrorOutlineIcon fontSize="small" />
          <span>{errors.message}</span>
        </ErrorBox>
      )}
    </div>)


  return (
    <div className='tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white'>
      <div className='tw-flex tw-w-full tw-justify-between tw-items-center'>
        <Typography variant="h3" className='!tw-font-semibold tw-mb-1'>Kids Detail</Typography>
        <Button variant='contained' className="uppercase" disabled={fields.length < 5 ? false : true} onClick={() => {
          if (fields.length < 5) {
            append({ name: null, grade: null, dob: null, school: null, relationship: null, gender: null })
          }
        }}>Add More</Button>
      </div>
      <div className='tw-flex tw-flex-col tw-w-[94%] tw-items-start tw-gap-5 tw-self-stretch'>
        {fields.map((input, index) =>
          <div key={input.id} className={`tw-flex tw-items-start tw-flex-wrap tw-gap-6 ${index >= 1 ? "tw-border-t tw-border-[#EEEEEE] tw-pt-5" : "tw-border-0"}`}>
            <div className='tw-flex tw-flex-col'>
              <div className='tw-flex tw-items-start tw-gap-6 tw-mb-6 tw-self-stretch'>
                <div className='tw-w-[280px] tw-flex tw-items-center'>
                  <Controller
                    name={`kids.${index}.name`}
                    control={control}
                    rules={{
                      required: 'This field is mandatory',
                      validate: value => value.length >= 2 || 'Please enter a valid name',
                    }}
                    render={({ field, fieldState }) => renderTextFieldWithError(field, 'Name', fieldState.error, (e) => {
                      if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }, "text")}
                  />
                </div>
                <div className='tw-w-[280px] tw-flex tw-items-center'>
                  <Controller
                    name={`kids.${index}.dob`}
                    control={control}
                    rules={{
                      required: 'This field is mandatory',
                    }}
                    render={({ field, fieldState }) =>
                      <div className='tw-flex tw-flex-col tw-w-full'>
                        <BasicDatePicker {...field}
                          inputFormat="DD-MM-YYYY"
                          value={field.value}
                          maxDate={new Date()}
                          onChange={(newValue) => {
                            field.onChange(newValue);
                          }}
                          label="Date of Birth"
                        />
                        {fieldState.error && (
                          <ErrorBox>
                            <ErrorOutlineIcon fontSize="small" />
                            <span>{fieldState.error.message}</span>
                          </ErrorBox>
                        )}
                      </div>
                    }
                  />
                </div>
                <div className='tw-w-[280px] tw-flex tw-items-center'>
                  <Controller
                    name={`kids.${index}.gender`}
                    control={control}
                    rules={{
                      required: 'This field is mandatory',
                    }}
                    render={({ field, fieldState }) => (
                      <div className='tw-flex tw-flex-col tw-w-full'>
                        <Dropdown {...field}
                          options={genderList}
                          valuekey="gender"
                          labelkey="gender"
                          label="Gender"
                          value={field.value || ''}
                        />
                        {fieldState.error && (
                          <ErrorBox>
                            <ErrorOutlineIcon fontSize="small" />
                            <span>{fieldState.error.message}</span>
                          </ErrorBox>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className='tw-flex tw-items-start tw-gap-6 tw-self-stretch'>
                <div className='tw-w-[280px] tw-flex tw-flex-col tw-gap-6 tw-items-start'>
                  <Controller
                    name={`kids.${index}.relationship`}
                    control={control}
                    render={({ field: { onChange, value }, fieldState }) => {
                      const mergerOnChange = (selectValue) => {
                        onChange(selectValue);
                        const updatedRelationship = [...relationshipvalue];
                        updatedRelationship[index] = selectValue;
                        setRelationshipValue(updatedRelationship)
                        setRelationshipText([])
                      };
                      return (
                        <div className='tw-flex tw-flex-col tw-w-full'>
                          <Dropdown
                            options={relationshipList}
                            valuekey="relationship"
                            labelkey="relationship"
                            label="Relationship With Child (Optional)"
                            onChange={mergerOnChange}
                            value={formType === "edit" && showotherRelationship[index] ? relationshipvalue[index] : value || ""}
                          />
                          {fieldState.error && (
                            <ErrorBox>
                              <ErrorOutlineIcon fontSize="small" />
                              <span>{fieldState.error.message}</span>
                            </ErrorBox>
                          )}
                        </div>
                      )
                    }}
                  />
                  {relationshipvalue[index]?.includes("please") &&
                    <Controller
                      name={`kids.${index}.otherRelationship`}
                      control={control}
                      render={({ field: { value, onChange }, fieldState }) => {
                        const mergerOnChange = (e) => {
                          const updatedValue = e.target.value;
                          onChange(updatedValue);
                          const updatedRelationshipText = [...relationshipText];
                          updatedRelationshipText[index] = updatedValue;
                          setRelationshipText(updatedRelationshipText)
                        };
                        return (
                          <div className="tw-w-full">
                            <TextField variant="outlined" onChange={mergerOnChange} type="text" fullWidth size="small" label="Other Relationship Details"
                              value={formType === "edit" ? relationshipText[index] : value} />
                            {fieldState.error && (
                              <ErrorBox>
                                <ErrorOutlineIcon fontSize="small" />
                                <span>{fieldState.error.message}</span>
                              </ErrorBox>
                            )}
                          </div>
                        )
                      }}
                    />
                  }
                </div>
                <div className='tw-w-[280px] tw-flex tw-flex-col tw-gap-6 tw-items-start'>
                  <Controller
                    name={`kids.${index}.school`}
                    control={control}
                    rules={{
                      required: 'This field is mandatory',
                    }}
                    render={({ field: { onChange, value }, fieldState }) => {
                      const mergerOnChange = (selectValue) => {
                        onChange(selectValue);
                        const updatedSchool = [...schoolvalue];
                        updatedSchool[index] = selectValue;
                        setSchoolValue(updatedSchool)
                        setSchoolText([]);
                        setValue(`kids.${index}.grade`, "")
                        setError(`kids.${index}.grade`, {
                          type: '',
                          message: ''
                        })
                      };
                      return (
                        <div className='tw-flex tw-flex-col tw-w-full'>
                          <Dropdown
                            options={schoolList}
                            valuekey="school"
                            labelkey="school"
                            label="School type"
                            onChange={mergerOnChange}
                            value={formType === "edit" && showotherSchool[index] ? schoolvalue[index] : value || ""}
                          />
                          {fieldState.error && (
                            <ErrorBox>
                              <ErrorOutlineIcon fontSize="small" />
                              <span>{fieldState.error.message}</span>
                            </ErrorBox>
                          )}
                        </div>
                      )
                    }}
                  />
                  {schoolvalue[index]?.includes("please") &&
                    <Controller
                      name={`kids.${index}.otherschool`}
                      control={control}
                      rules={schoolText[index] ? null : {
                        required: 'Please enter school type',
                        validate: value => value.length >= 2 || 'Please enter a valid school type',
                      }}
                      render={({ field: { value, onChange }, fieldState }) => {
                        const mergerOnChange = (e) => {
                          const updatedValue = e.target.value;
                          onChange(updatedValue);
                          const updatedSchoolText = [...schoolText];
                          updatedSchoolText[index] = updatedValue;
                          setSchoolText(updatedSchoolText)
                        };
                        return (
                          <div className="tw-w-full">
                            <TextField variant="outlined" onChange={mergerOnChange} type="text" fullWidth size="small" label="Other School Type"
                              value={formType === "edit" ? schoolText[index] : value} />
                            {fieldState.error && (
                              <ErrorBox>
                                <ErrorOutlineIcon fontSize="small" />
                                <span>{fieldState.error.message}</span>
                              </ErrorBox>
                            )}
                          </div>
                        )
                      }}
                    />
                  }
                </div>
                <div className='tw-w-[280px] tw-flex tw-items-center'>
                  <Controller
                    name={`kids.${index}.grade`}
                    control={control}
                    rules={{
                      validate: {
                        required: value => schoolvalue.includes("Not in school") || value ? true : 'Please enter grade',
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <div className='tw-flex tw-flex-col tw-w-full'>
                        <Dropdown {...field}
                          options={gradesList}
                          valuekey="grade"
                          labelkey="grade"
                          label={schoolvalue.includes("Not in school") ? "Grade (optional)" : "Grade"}
                          value={field.value || ''}
                        />
                        {fieldState.error?.message && (
                          <ErrorBox>
                            <ErrorOutlineIcon fontSize="small" />
                            <span>{fieldState.error.message}</span>
                          </ErrorBox>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            {index >= 1 && <DeleteOutlineIcon className='tw-text-error tw-cursor-pointer tw-ml-3' onClick={() => {
              remove(index);
              const updatedRelationshipValue = [...relationshipvalue];
              updatedRelationshipValue.splice(index, 1); // Remove the item at index
              setRelationshipValue(updatedRelationshipValue);
              const updatedSchoolValue = [...schoolvalue];
              updatedSchoolValue.splice(index, 1); // Remove the item at index
              setSchoolValue(updatedSchoolValue);
            }} />}
          </div>
        )}
      </div>
    </div>
  )
})
