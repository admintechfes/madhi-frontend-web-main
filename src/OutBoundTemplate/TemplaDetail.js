import React from 'react'
import { Button, Paper, TextField, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MultiMedia from '../../public/assets/icons/multimedia.svg'


export default function TemplateDetail() {
  const navigate = useNavigate();

  const getContent = (title, desc) => {
    return (
      <div className="tw-flex tw-flex-col tw-gap-1 tw-w-1/2">
        <span className='tw-text-xs tw-text-grey tw-block'>{title}</span>
        <span className="tw-text-sm tw-text-primaryText">{desc}</span>
      </div>
    )
  }

  const Back = () => {
    navigate(-1);
  }

  return (
    <>
      <div className="tw-flex tw-items-center tw-w-full tw-justify-between">
        <Link onClick={Back} className='tw-flex tw-justify-center'>
          <ArrowBackIcon className="tw-text-grey" />
          <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal tw-text-nowrap tw-block">Outbound IVRS</span>
        </Link>
        <div className='tw-flex tw-gap-x-4 tw-items-center'>
          <Button variant="outlined" className='!tw-border-error !tw-text-error'>Delete</Button>
          <Button variant="contained">Edit Info</Button>
        </div>
      </div>
      <Typography variant="h2" className='!tw-font-semibold !tw-text-secondaryText'>Greetings</Typography>
      <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
        <Typography variant="h4" className='!tw-font-semibold !tw-text-secondaryText'>Template</Typography>
        <div className='tw-flex tw-items-start tw-gap-6 tw-w-full'>
          <TextField variant="outlined" className='tw-w-full' size="small" disabled label="Template Name" type="text" value="Greetings" />
          <TextField variant="outlined" className='tw-w-full' size="small" disabled label="Select Tags" type="text" value="Festivity" />
        </div>
        {getContent("Template ID", "ID0303")}
        <Typography variant="h4" className='!tw-font-semibold !tw-text-secondaryText'>Attachment (optional)</Typography>
        <div className='tw-bg-[#FBFBFB] tw-p-6 tw-rounded-lg tw-flex tw-justify-between tw-w-full tw-items-center'>
          <div className='tw-flex tw-gap-1'>
            <img src={MultiMedia} className='tw-w-6' alt="media" />
            <span className='tw-text-black tw-text-base'>File 1</span>
          </div>
          <Button variant='outlined'>Listen</Button>
        </div>
      </Paper>

    </>
  )
}

