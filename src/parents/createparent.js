import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, CircularProgress, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import ParentsBasicForm from '../components/parents/parentsbasicform';
import Kidsdetailform from '../components/parents/kidsdetailform';
import ParentsOtherDetailsForm from '../components/parents/parentsotherdetailsform';
import { UpdateParent, createParent, } from './duck/network';
import { LoadingButton } from '@mui/lab';
import moment from 'moment';

export default function CreateParent(props) {
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors }, setValue, setError } = useForm({
    mode: "onChange", defaultValues: props.defaultValues ? props.defaultValues : {}
  });
  const navigate = useNavigate();
  const DistrictData = useSelector((state) => state.district.districtNameList)
  const loader = useSelector((state) => state.loader.openTableLoader);
  const createloader = useSelector((state) => state.parents.createparentloading);

  const onSubmitQuestions = (data) => {
    let code = {
      country_code: "91"
    }

    const KidsData = data?.kids?.map((el, i) => {
      el.dob = moment(el.dob).format("DD-MM-YYYY")
      if (el?.relationship?.includes("please")) {
        el.relationship = el?.otherRelationship
      }
      if (el?.school?.includes("please")) {
        el.school = el?.otherschool
      }
    })

    let newData = { ...code, ...data, ...KidsData }

    if (props.formType === "edit") {
      dispatch(UpdateParent(newData)).then((res) => res?.data?.statusCode == 200 && navigate('/parents'))
    }
    else {
      dispatch(createParent(newData)).then((res) => res?.data?.statusCode == 200 && navigate('/parents'))
    }
  }

  return (
    <>
      <div className='tw-flex tw-items-center tw-w-full tw-justify-between'>
        <a className='tw-cursor-pointer' onClick={() => navigate(-1)}>
          <ArrowBackIcon className='tw-text-grey' />
          <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>Parents</span>
        </a>
      </div>
      <Typography variant="h2" className='!tw-font-semibold !tw-text-secondaryText'>{props.formType === "edit" ? "Edit Parent" : "Create New Parent"}</Typography>
      <div className='tw-w-full tw-mt-6'>
        {loader ?
          <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">
            <CircularProgress />
          </div>
          :
          <form onSubmit={handleSubmit(onSubmitQuestions)}>
            <ParentsBasicForm control={control} errors={errors} />
            <Kidsdetailform setError={setError} control={control} errors={errors} setValue={setValue} formType={props.formType} defaultValues={props.defaultValues} />
            <ParentsOtherDetailsForm setValue={setValue} DistrictData={DistrictData} formType={props.formType} defaultValues={props.defaultValues} control={control} errors={errors} />
            <div className='tw-absolute tw-top-6 tw-right-[34px] tw-flex tw-gap-x-4'>
              <Button variant="outlined" className="uppercase" onClick={() => navigate(-1)}>Cancel</Button>
              <LoadingButton loading={createloader} disableElevation type='submit' variant="contained" className="uppercase">{props.formType === "edit" ? "Save" : "Create"}</LoadingButton>
            </div>
          </form>
        }
      </div>
    </>
  )
}

