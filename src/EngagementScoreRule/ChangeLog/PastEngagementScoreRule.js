import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';

export default function PastEngagementScoreRule() {
  const navigate = useNavigate();
  const location = useLocation();
  const { PastDetails } = location.state || {};

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
          <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>Program/Engagement Score Rule/Past Engagement Score Rule</span>
        </a>
      </div>
      <Typography variant="h3" className='!tw-font-semibold'>Past Engagement Score Rule</Typography>
      <div className='tw-grid tw-grid-cols-4 tw-my-7 tw-gap-8'>
        <div className='tw-flex tw-flex-col tw-gap-2'>
          <span className='tw-text-xs tw-text-grey tw-block'>Total Engagement Score</span>
          <div className='tw-py-2 tw-px-3 tw-rounded-lg tw-bg-[#EEEEEE] tw-text-secondaryText'>
            <span className="tw-text-primaryText">{PastDetails?.weightage ? PastDetails?.weightage : "0"}</span>
          </div>
        </div>
        {/* {getContent("Current Score Updated On", PastDetails?.updated_at ? dayjs(PastDetails?.updated_at).format("DD MMM YYYY") : "NA")}
        {getContent("Last Score Updated On", PastDetails?.last_updated_at ? dayjs(PastDetails?.last_updated_at).format("DD MMM YYYY") : "NA")}
        {getContent("Version Number", PastDetails?.updated_version ? PastDetails?.updated_version : "0")} */}
      </div>

      {/* Standalone Parents Quiz */}
      <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mb-6'>
        <Typography variant="h4" className='!tw-font-semibold'>Standalone Parents Quiz</Typography>
        <div className='tw-grid tw-grid-cols-2 tw-gap-32 tw-justify-start'>
          {getContent("Selected Parents Quiz", PastDetails?.quizzes?.quiz_title ? PastDetails?.quizzes?.quiz_title : "NA")}
          {getContent("Add Weightage in (%)", PastDetails?.quizzes?.quiz_weightage ? PastDetails?.quizzes?.quiz_weightage : "0")}
        </div>
        <div className='tw-grid tw-grid-cols-2 tw-gap-6 tw-w-full'>
          {PastDetails?.quizzes?.ranges?.length > 0 ? PastDetails?.quizzes?.ranges?.map((item, i) =>
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
        {getContent("Add Weightage in (%)", PastDetails?.student_quizzes?.student_quiz_weightage ? PastDetails?.student_quizzes?.student_quiz_weightage : "0")}
        </div>
        <div className='tw-grid tw-grid-cols-2 tw-gap-6 tw-w-full'>
          {PastDetails?.student_quizzes?.ranges?.length > 0 ? PastDetails?.student_quizzes?.ranges?.map((item, i) =>
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
          {getContent("Selected Workshop Number", PastDetails?.workshop_quizzes?.workshop_number ? PastDetails?.workshop_quizzes?.workshop_number : "NA")}
          {getContent("Selected Workshop Quiz", PastDetails?.workshop_quizzes?.workshop_quiz_title ? PastDetails?.workshop_quizzes?.workshop_quiz_title : "NA")}
          {getContent("Add Weightage in (%)", PastDetails?.workshop_quizzes?.workshop_quiz_weightage ? PastDetails?.workshop_quizzes?.workshop_quiz_weightage : "0")}
        </div>
        <div className='tw-grid tw-grid-cols-2 tw-gap-6 tw-w-full'>
          {PastDetails?.workshop_quizzes?.ranges?.length > 0 ? PastDetails?.workshop_quizzes?.ranges?.map((item, i) =>
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
          {getContent("Add Weightage in (%)", PastDetails?.workshop_attendance?.workshop_attendance_weightage ? PastDetails?.workshop_attendance?.workshop_attendance_weightage : "0")}
        </div>
        <div className='tw-grid tw-grid-cols-2 tw-gap-6 tw-w-full'>
          {PastDetails?.workshop_attendance?.ranges?.length > 0 ? PastDetails?.workshop_attendance?.ranges?.map((item, i) =>
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
