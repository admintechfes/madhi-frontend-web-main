import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Paper, Typography } from '@mui/material';
import { GetEngagementScoreDetail } from './duck/network';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

export default function EngagementScoreRule() {
  const navigate = useNavigate();
  const location = useLocation();
  const { unit, programId, programDetails } = location.state || {};
  const dispatch = useDispatch();
  const EngagementDetails = useSelector((state) => state.score.EngagementDetails)

  useEffect(() => {
    if (!programId && !unit) {
      navigate(`/programs`)
    }
    else {
      dispatch(GetEngagementScoreDetail({ program_unit_id: unit, program_id: programId }))
    }
  }, [])

  const onBack = () => {
    navigate(-1)
  }


  const getContent = (title, desc) => {
    return (
      <div className="tw-flex tw-flex-col tw-gap-1">
        <span className='tw-text-xs tw-text-grey tw-block'>{title}</span>
        <span className="tw-text-sm tw-text-primaryText">{desc ? desc : "-"}</span>
      </div>
    )
  }

  return (
    <div>
      <div className='tw-flex tw-items-center tw-w-full tw-justify-between'>
        <a className='tw-cursor-pointer' onClick={onBack}>
          <ArrowBackIcon className='tw-text-grey' />
          <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>Program/Current Engagement Score Rule</span>
        </a>
        <div className='tw-flex tw-gap-x-4 tw-items-center'>
          <Button variant="contained" onClick={() => navigate("/programs-unit/engagement-rule/create", { state: { unit: unit, programId: programId, programDetails: programDetails } })}>Update</Button>
          <Button variant="outlined" onClick={() => navigate("/programs-unit/engagement-rule/change-log", { state: { unit: unit, programId: programId } })}>View Change Log</Button>
        </div>
      </div>
      <Typography variant="h3" className='!tw-font-semibold'>Current Engagement Score Rule</Typography>
      <div className='tw-grid tw-grid-cols-4 tw-my-7 tw-gap-8'>
        <div className='tw-flex tw-flex-col tw-gap-2'>
          <span className='tw-text-xs tw-text-grey tw-block'>Total Engagement Score</span>
          <div className='tw-py-2 tw-px-3 tw-rounded-lg tw-bg-[#EEEEEE] tw-text-secondaryText'>
            <span className="tw-text-primaryText">{EngagementDetails?.weightage ? EngagementDetails?.weightage : 0}</span>
          </div>
        </div>
        {getContent("Current Score Updated On", EngagementDetails?.updated_at ? dayjs(EngagementDetails?.updated_at).format("DD MMM YYYY") : "NA")}
        {getContent("Last Score Updated On", EngagementDetails?.last_updated_at ? dayjs(EngagementDetails?.last_updated_at).format("DD MMM YYYY") : "NA")}
        {/* {getContent("Version Number", EngagementDetails?.updated_version ? EngagementDetails?.updated_version : "0")} */}
      </div>

      {/* Standalone Parents Quiz */}
      <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mb-6'>
        <Typography variant="h4" className='!tw-font-semibold'>Standalone Parents Quiz</Typography>
        <div className='tw-grid tw-grid-cols-2 tw-gap-32 tw-justify-start'>
          {getContent("Selected Parents Quiz", EngagementDetails?.quizzes?.quiz_title ? EngagementDetails?.quizzes?.quiz_title : "NA")}
          {getContent("Add Weightage in (%)", EngagementDetails?.quizzes?.quiz_weightage ? EngagementDetails?.quizzes?.quiz_weightage : "0")}
        </div>
        <div className='tw-grid tw-grid-cols-2 tw-gap-6 tw-w-full'>
          {EngagementDetails?.quizzes?.ranges?.length > 0 ? EngagementDetails?.quizzes?.ranges?.map((item, i) =>
            <div className='tw-p-4 tw-bg-backgroundDarkGrey tw-rounded-lg' key={i}>
              <span>Score Range {i + 1}</span>
              <div className='tw-grid tw-grid-cols-2 tw-justify-between tw-mt-5'>
                {getContent("Max. score range in (%)", item.range)}
                {getContent("Added Weightage in (%)", item.weightage)}
              </div>
            </div>
          )
            :
            <div className='tw-p-4 tw-bg-backgroundDarkGrey tw-rounded-lg'>
              <span>Score Range 1</span>
              <div className='tw-grid tw-grid-cols-2 tw-justify-between tw-mt-5'>
                {getContent("Max. score range in (%)", "0")}
                {getContent("Added Weightage in (%)", "0")}
              </div>
            </div>
          }
        </div>
      </Paper>

      {/* Standalone Student Quiz */}
      <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mb-6'>
        <Typography variant="h4" className='!tw-font-semibold'>Standalone Student Quiz</Typography>
        <div className='tw-grid tw-grid-cols-1'>
          {getContent("Add Weightage in (%)", EngagementDetails?.student_quizzes?.student_quiz_weightage ? EngagementDetails?.student_quizzes?.student_quiz_weightage : "0")}
        </div>
        <div className='tw-grid tw-grid-cols-2 tw-gap-6 tw-w-full'>
          {EngagementDetails?.student_quizzes?.ranges?.length > 0 ? EngagementDetails?.student_quizzes?.ranges?.map((item, i) =>
            <div className='tw-p-4 tw-bg-backgroundDarkGrey tw-rounded-lg' key={i}>
              <span>Quiz completion Range {i + 1}</span>
              <div className='tw-grid tw-grid-cols-2 tw-justify-between tw-mt-5'>
                {getContent("Max. score range in (%)", item.range)}
                {getContent("Added Weightage in (%)", item.weightage)}
              </div>
            </div>)
            :
            <div className='tw-p-4 tw-bg-backgroundDarkGrey tw-rounded-lg'>
              <span>Score Range 1</span>
              <div className='tw-grid tw-grid-cols-2 tw-justify-between tw-mt-5'>
                {getContent("Max. score range in (%)", "0")}
                {getContent("Added Weightage in (%)", "0")}
              </div>
            </div>
          }
        </div>
      </Paper>


      {/* Parents Workshop Quiz */}
      <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mb-6'>
        <Typography variant="h4" className='!tw-font-semibold'>Parents Workshop Quiz</Typography>
        <div className='tw-grid tw-grid-cols-3 tw-gap-32 tw-justify-start'>
          {getContent("Selected Workshop Number", EngagementDetails?.workshop_quizzes?.workshop_number ? EngagementDetails?.workshop_quizzes?.workshop_number : "NA")}
          {getContent("Selected Workshop Quiz", EngagementDetails?.workshop_quizzes?.workshop_quiz_title ? EngagementDetails?.workshop_quizzes?.workshop_quiz_title : "NA")}
          {getContent("Add Weightage in (%)", EngagementDetails?.workshop_quizzes?.workshop_quiz_weightage ? EngagementDetails?.workshop_quizzes?.workshop_quiz_weightage : "0")}
        </div>
        <div className='tw-grid tw-grid-cols-2 tw-gap-6 tw-w-full'>
          {EngagementDetails?.workshop_quizzes?.ranges?.length > 0 ? EngagementDetails?.workshop_quizzes?.ranges?.map((item, i) =>
            <div className='tw-p-4 tw-bg-backgroundDarkGrey tw-rounded-lg' key={i}>
              <span>Score Range {i + 1}</span>
              <div className='tw-grid tw-grid-cols-2 tw-justify-between tw-mt-5'>
                {getContent("Max. score range in (%)", item.range)}
                {getContent("Added Weightage in (%)", item.weightage)}
              </div>
            </div>
          )
            :
            <div className='tw-p-4 tw-bg-backgroundDarkGrey tw-rounded-lg'>
              <span>Score Range 1</span>
              <div className='tw-grid tw-grid-cols-2 tw-justify-between tw-mt-5'>
                {getContent("Max. score range in (%)", "0")}
                {getContent("Added Weightage in (%)", "0")}
              </div>
            </div>
          }
        </div>
      </Paper>


      {/* Workshop Attendance */}
      <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mb-6'>
        <Typography variant="h4" className='!tw-font-semibold'>Workshop Attendance</Typography>
        <div className='tw-grid tw-grid-cols-1'>
          {getContent("Add Weightage in (%)", EngagementDetails?.workshop_attendance?.workshop_attendance_weightage ? EngagementDetails?.workshop_attendance?.workshop_attendance_weightage : "0")}
        </div>
        <div className='tw-grid tw-grid-cols-2 tw-gap-6 tw-w-full'>
          {EngagementDetails?.workshop_attendance?.ranges?.length > 0 ? EngagementDetails?.workshop_attendance?.ranges?.map((item, i) =>
            <div className='tw-p-4 tw-bg-backgroundDarkGrey tw-rounded-lg' key={i}>
              <span>Attendance Range {i + 1}</span>
              <div className='tw-grid tw-grid-cols-2 tw-justify-between tw-mt-5'>
                {getContent("Max. score range in (%)", item.range)}
                {getContent("Added Weightage in (%)", item.weightage)}
              </div>
            </div>)
            :
            <div className='tw-p-4 tw-bg-backgroundDarkGrey tw-rounded-lg'>
              <span>Attendance Range 1</span>
              <div className='tw-grid tw-grid-cols-2 tw-justify-between tw-mt-5'>
                {getContent("Max. score range in (%)", "0")}
                {getContent("Added Weightage in (%)", "0")}
              </div>
            </div>
          }
        </div>
      </Paper>
    </div>
  )
}
