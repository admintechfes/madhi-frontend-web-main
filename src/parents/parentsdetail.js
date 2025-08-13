import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CallIcon from '@mui/icons-material/Call';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DirectionsIcon from '@mui/icons-material/Directions';
import { deleteParent, getParentsDetails } from './duck/network';
import dayjs from 'dayjs';
import { DeleteDialog } from '../components/Dialog';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import kids from '../../public/assets/icons/kids.svg';
import house from '../../public/assets/icons/house.svg';


export default function ParentsDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pathname = useParams();
  const ParentsDetail = useSelector((state) => state.parents.parentdetails)
  const loader = useSelector(state => state.parents.parentsListLoading)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const Permissions = JSON.parse(localStorage.getItem('permissions'))
  const [searchParams] = useSearchParams();


  useEffect(() => {
    dispatch(getParentsDetails(pathname))
  }, [pathname])

  const DeleteParent = (params) => {
    dispatch(deleteParent(params)).then((res) => res?.data?.statusCode == 200 && navigate('/parents'))
  }

  const handleClose = () => {
    setOpenDeleteDialog(false)
  }

  const GotoActivitylog = () => {
    navigate(`/view-activity-log`, { state: { parents: true, id: ParentsDetail.id, parentsData: ParentsDetail } })
  }

  return (
    <>
      <div className='tw-flex tw-items-center tw-w-full tw-justify-between'>
        <Link to={searchParams.get('redirect') == 'program' ? `/progress/village-users/${searchParams.get('villageAreaId')}?programId=${searchParams.get('programId')}&tab=${searchParams.get('tab')}` : "/parents"}>
          <ArrowBackIcon className='tw-text-grey' />
          <span className='tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal'>{searchParams.get('redirect') == 'program' ? 'Back' : 'Parents Listing / Parents Detail Page'}</span>
        </Link>
        <div className='tw-flex tw-gap-x-4 tw-items-center'>
          {Permissions?.Parents?.delete ? <Button variant="outlined" className='!tw-border-error !tw-text-error' onClick={() => setOpenDeleteDialog(true)}>Delete</Button> : null}
          {Permissions?.Parents?.update && <Button variant="contained" onClick={() => { navigate(`/parents/update-parent/${ParentsDetail?.id}`) }}>Edit Info</Button>}
        </div>
      </div>
      <Typography variant="h2" className='!tw-font-semibold !tw-text-secondaryText'>{ParentsDetail?.full_name}</Typography>
      {!loader ?
        <div className='tw-flex tw-flex-col tw-gap-6'>
          <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
            <Typography variant='h4' className='!tw-font-semibold !tw-text-secondaryText'>Basic Info</Typography>
            <div className='tw-flex tw-items-start tw-justify-between tw-gap-6 tw-w-full'>
              <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                <CallIcon className='tw-text-grey' />
                <div className='tw-flex tw-flex-col'>
                  <span className='tw-text-xs tw-text-grey'>WhatsApp Number</span>
                  <span className='tw-text-sm tw-text-primaryText'>{ParentsDetail?.whatsapp_number ? ParentsDetail?.whatsapp_number : "-"}</span>
                </div>
              </div>
              <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                <CallIcon className='tw-text-grey' />
                <div className='tw-flex tw-flex-col'>
                  <span className='tw-text-xs tw-text-grey'>Other number</span>
                  <span className='tw-text-sm tw-text-primaryText'>{ParentsDetail?.mobile ? ParentsDetail?.mobile : "-"}</span>
                </div>
              </div>
              <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                <LocationOnIcon className='tw-text-grey' />
                <div className='tw-flex tw-flex-col'>
                  <span className='tw-text-xs tw-text-grey'>House Address</span>
                  <span className='tw-text-sm tw-text-primaryText'>{ParentsDetail?.address ? ParentsDetail?.address : "-"}</span>
                </div>
              </div>
              {/* <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                <MailOutlineIcon className='tw-text-grey' />
                <div className='tw-flex tw-flex-col'>
                  <span className='tw-text-xs tw-text-grey'>Email</span>
                  <span className='tw-text-sm tw-text-primaryText'>{ParentsDetail?.email}</span>
                </div>
              </div> */}
            </div>
            <div className='tw-flex tw-items-start tw-justify-between tw-gap-6 tw-w-full'>
              <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                <LocationOnIcon className='tw-text-grey' />
                <div className='tw-flex tw-flex-col'>
                  <span className='tw-text-xs tw-text-grey'>Assigned Village/Area</span>
                  <span className='tw-text-sm tw-text-primaryText'>{ParentsDetail?.assigned_village_area ? ParentsDetail?.assigned_village_area : "-"}</span>
                </div>
              </div>
              <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                <AccountCircleIcon className='tw-text-grey' />
                <div className='tw-flex tw-flex-col'>
                  <span className='tw-text-xs tw-text-grey'>Assigned CEW</span>
                  <span className='tw-text-sm tw-text-primaryText'>{ParentsDetail?.assigned_village_worker ? ParentsDetail?.assigned_village_worker : "-"}</span>
                </div>
              </div>
              <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                <AccountCircleIcon className='tw-text-grey' />
                <div className='tw-flex tw-flex-col'>
                  <span className='tw-text-xs tw-text-grey'>Assigned Supervisor</span>
                  <span className='tw-text-sm tw-text-primaryText'>{ParentsDetail?.assigned_supervisor ? ParentsDetail?.assigned_supervisor : "-"}</span>
                </div>
              </div>
            </div>
            <div className='tw-flex tw-gap-20 tw-items-center'>
              <div className='tw-flex tw-flex-col'>
                <span className='tw-text-xs tw-text-grey'>Latitude</span>
                <span className='tw-text-sm tw-text-primaryText'>{ParentsDetail?.lat ? ParentsDetail?.lat : "-"}</span>
              </div>
              <div className='tw-flex tw-flex-col'>
                <span className='tw-text-xs tw-text-grey'>Longitude</span>
                <span className='tw-text-sm tw-text-primaryText'>{ParentsDetail?.long ? ParentsDetail?.long : "-"}</span>
              </div>
              <button disabled={ParentsDetail?.lat && ParentsDetail?.long ? false : true} className={`tw-flex tw-gap-2 tw-border tw-p-2 ${ParentsDetail?.lat && ParentsDetail?.long ? "tw-cursor-pointer" : "tw-cursor-not-allowed"}  tw-text-primary tw-border-primary tw-rounded `}
                onClick={() => window.open("https://maps.google.com?q=" + ParentsDetail?.lat + "," + ParentsDetail?.long)}>
                <DirectionsIcon className='tw-text-primary' />
                <span>View On Maps</span>
              </button>
            </div>
            <div className='tw-flex tw-items-start tw-gap-4 tw-w-[700px]'>
              <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                <CalendarMonthIcon className='tw-text-grey' />
                <div className='tw-flex tw-flex-col'>
                  <span className='tw-text-xs tw-text-grey'>Account Created On</span>
                  <span className='tw-text-sm tw-text-primaryText'>{dayjs(ParentsDetail?.created_at).format("D MMM, YYYY")}</span>
                </div>
              </div>
              <div className='tw-flex tw-flex-col'>
                <span className='tw-text-xs tw-text-grey'>Unique ID</span>
                <span className='tw-text-sm tw-text-primaryText'>{ParentsDetail?.serial_number}</span>
              </div>
            </div>
          </Paper>
          <Paper className='tw-w-full tw-p-6 tw-flex tw-flex-col tw-items-start tw-gap-6 tw-mt-6'>
            <Typography variant='h4' className='!tw-font-semibold !tw-text-secondaryText'>Kids Detail</Typography>
            {ParentsDetail?.kids?.length > 0 ? ParentsDetail?.kids?.map((el, i) =>
              <div key={i} className='tw-border-b tw-border-[#EEEEEE] tw-pb-6 tw-w-full tw-flex tw-flex-col tw-gap-6'>
                <div className='tw-flex tw-items-start tw-justify-between tw-gap-6 tw-w-full'>
                  <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                    <img src={kids} alt="kids name" />
                    <div className='tw-flex tw-flex-col'>
                      <span className='tw-text-xs tw-text-grey'>Name</span>
                      <span className='tw-text-sm tw-text-primaryText'>{el?.name ? el?.name : "-"}</span>
                    </div>
                  </div>
                  <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                    <EventIcon className='tw-text-grey' />
                    <div className='tw-flex tw-flex-col'>
                      <span className='tw-text-xs tw-text-grey'>Date of Birth</span>
                      <span className='tw-text-sm tw-text-primaryText'>{el?.dob ? dayjs(el?.dob).format("D MMMM YYYY") : "-"}</span>
                    </div>
                  </div>
                  <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                    <PersonIcon className='tw-text-grey' />
                    <div className='tw-flex tw-flex-col'>
                      <span className='tw-text-xs tw-text-grey'>Gender</span>
                      <span className='tw-text-sm tw-text-primaryText'>{el?.gender ? el?.gender : "-"}</span>
                    </div>
                  </div>
                </div>
                <div className='tw-flex tw-items-start tw-justify-between tw-gap-6 tw-w-full'>
                  <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                    <PersonIcon className='tw-text-grey' />
                    <div className='tw-flex tw-flex-col'>
                      <span className='tw-text-xs tw-text-grey'>Relationship with child</span>
                      <span className='tw-text-sm tw-text-primaryText'>{el?.relationship ? el?.relationship : "-"}</span>
                    </div>
                  </div>
                  <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                    <img src={house} alt="kids name" />
                    <div className='tw-flex tw-flex-col'>
                      <span className='tw-text-xs tw-text-grey'>School type</span>
                      <span className='tw-text-sm tw-text-primaryText'>{el?.school ? el?.school : "-"}</span>
                    </div>
                  </div>
                  <div className='tw-flex tw-items-start tw-gap-2 tw-w-1/2'>
                    <SchoolIcon className='tw-text-grey' />
                    <div className='tw-flex tw-flex-col'>
                      <span className='tw-text-xs tw-text-grey'>Grade</span>
                      <span className='tw-text-sm tw-text-primaryText'>{el?.grade ? el?.grade : "-"}</span>
                    </div>
                  </div>
                </div>
                <div className='tw-flex tw-items-start tw-justify-between tw-gap-6 tw-w-full'>
                  <div className='tw-flex tw-flex-col'>
                    <span className='tw-text-xs tw-text-grey'>Unique ID</span>
                    <span className='tw-text-sm tw-text-primaryText'>{el?.serial_number ? el?.serial_number : "-"}</span>
                  </div>
                </div>
              </div>)
              : <span>-</span>
            }
          </Paper>
          <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
            <div className='tw-flex tw-w-full tw-justify-between tw-items-center'>
              <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">Activity log</Typography>
              <Button variant='outlined' onClick={GotoActivitylog}>View Details</Button>
            </div>
          </div>
        </div>
        : <div className='tw-text-center tw-py-5'>
          <CircularProgress />
        </div>
      }
      {openDeleteDialog && (
        <DeleteDialog open={openDeleteDialog} loading={false} close={handleClose} delete={() => DeleteParent(ParentsDetail.id)} title="Delete Parent">
          <p>Are you sure, you want to delete this parent? This action is irreversible.</p>
        </DeleteDialog>
      )}

    </>
  )
}

