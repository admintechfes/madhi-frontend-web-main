import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Paper, TextField, TextareaAutosize, Typography } from '@mui/material';
import { Link } from 'react-router-dom';


export default function Preview() {
  return (
    <>
      <div className='tw-flex tw-items-center tw-w-full tw-justify-between'>
        <Link to="/programs">
          <ArrowBackIcon className='tw-text-grey' />
          <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>Programs/Quiz/Preview</span>
        </Link>
        <div className='tw-flex tw-gap-x-4 tw-items-center'>
          <Button variant="contained">Submit</Button>
        </div>
      </div>
      <Typography variant="h2" className='!tw-font-semibold !tw-text-secondaryText'>Question</Typography>
      <Paper className='tw-w-full tw-p-6 tw-mt-6'>
        <div className='tw-flex tw-items-start tw-gap-6 tw-self-stretch tw-mb-6'>
          <div className='tw-flex tw-flex-col tw-gap-2 tw-w-1/2'>
            <span className='tw-text-xs tw-text-grey tw-font-normal'>Created By</span>
            <span className='tw-text-sm'>John Doe</span>
          </div>
          <div className='tw-flex tw-flex-col tw-gap-2 tw-w-1/2'>
            <span className='tw-text-xs tw-text-grey tw-font-normal'>Created On</span>
            <span className='tw-text-sm'>12 Mar, 2024</span>
          </div>
        </div>
        <div className='tw-flex tw-flex-col tw-gap-8'>
          <div className='tw-flex tw-flex-col tw-gap-2'>
            <span className='tw-text-base tw-text-secondaryText tw-font-semibold'>Q. How many child do you have?</span>
            <TextField variant="outlined" className='tw-w-[600px]' size="small" disabled={true} placeholder='Type Answer' />
          </div>
          <div className='tw-flex tw-flex-col tw-gap-2'>
            <span className='tw-text-base tw-text-secondaryText tw-font-semibold'>Q. How many child do you have?</span>
            <div className='tw-flex tw-mb-5 last:tw-mb-0 tw-gap-3 tw-items-center'>
              <a className="tw-p-2 tw-border tw-border-grey tw-rounded-full"></a>
              <span className='tw-text-base tw-text-primaryText'>2-3</span>
            </div>
          </div>
          <div className='tw-flex tw-flex-col tw-gap-2'>
            <span className='tw-text-base tw-text-secondaryText tw-font-semibold'>Q. How many child do you have?</span>
            <div className='tw-flex tw-mb-5 last:tw-mb-0 tw-gap-3 tw-items-center'>
              <a className="tw-p-2 tw-border tw-border-grey"></a>
              <span className='tw-text-base tw-text-primaryText'>2-3</span>
            </div>
          </div>
          <div className='tw-flex tw-flex-col tw-gap-2'>
            <span className='tw-text-base tw-text-secondaryText tw-font-semibold'>Q. How many child do you have?</span>
            <TextareaAutosize disabled={true} className='tw-w-[85%] tw-p-3' aria-label="minimum height" minRows={7} placeholder="Type Answer"  />
          </div>
        </div>
      </Paper >
    </>
  )
}

