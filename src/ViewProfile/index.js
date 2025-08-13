import { Box, Button, Popover, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PersonIcon from '@mui/icons-material/Person';



import FormDialog from '../components/Dialog';

import { changeProfilePassword, getProfileDetails } from './duck/network';
import { formatDate } from '../components/Masters/TableMaster';
import { getUserDetails } from '../Users/duck/network';
import { setLoading } from '../Users/duck/userSlice';






export default function ViewProfile() {
  const [currentPassword, setCurrentpassword] = useState("")
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isForgetPassModalOpen, setIsForgetPassModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const pathname = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loader = useSelector((state) => state.user.loading);
  // const user=useSelector((state)=> state.user.userDetails)


  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const profileDetails = JSON.parse(userData);
      setUser(profileDetails)
      // dispatch(getUserDetails({ id: idProfile.id })).then(resp => setUser(resp))
    }
  }, [setLoading]);

  const open = Boolean(anchorEl);
  const close = () => {
    setErrors({
      password: '',
      confirmPassword: '',
    });
    setCurrentpassword("")
    setPassword("")
    setConfirmPassword("")
    setIsForgetPassModalOpen(false);
  }
  const handleForgetPasswordFormSubmit = (e) => {
    e.preventDefault();

    setErrors({
      password: '',
      confirmPassword: '',
    });



    if (currentPassword.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        currentPassword: 'This field is mandatory',
      }));
    }
    if (password.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'This field is mandatory',
      }));
    }

    if (confirmPassword.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'This field is mandatory',
      }));
    }


    if (password !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "New password and confirm password are not match",
      }));
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;

    if (!password.match(passwordRegex)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Password must be within 8 to 15 characters with one uppercase letter,one lowercase letter, one special characters and numbers.',
      }));
    }
    if (!confirmPassword.match(passwordRegex)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'Password must be within 8 to 15 characters with one uppercase letter,one lowercase letter, one special characters and numbers.',
      }));
    }

    if (password.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'This field is mandatory',
      }));
    }

    if (confirmPassword.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'This field is mandatory',
      }));
    }

    if (currentPassword!=="" && password !== '' && confirmPassword !== '' && password === confirmPassword && password.match(passwordRegex)) {
      const formData = {
        current_password: currentPassword,
        password: password,
        password_confirmation: confirmPassword,
      };

      dispatch(changeProfilePassword(formData)).then((res) => {
        if (res.data.statusCode === 200) {
          setIsForgetPassModalOpen(false);
          setCurrentpassword("")
          setPassword("")
          setConfirmPassword("")
        }
        if (res.data.statusCode === 422) {
          // setIsForgetPassModalOpen(false);
          // setCurrentpassword("")
          // setPassword("")
          // setConfirmPassword("")
        }
      });
    }
  };

  const handleAction = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {

    setAnchorEl(null);
  };

  const openChangePassword = () => {
    setIsForgetPassModalOpen(true)
  }


  const clearErrors = () => {
    setErrors(prevErrors => ({
        ...prevErrors,
        currentPassword: ''
    }));
  };


  const clearErrorsNew = () => {
    setErrors(prevErrors => ({
        ...prevErrors,
        password: ''
    }));
  };

  const clearErrorsConform = () => {
    setErrors(prevErrors => ({
        ...prevErrors,
        confirmPassword: ''
    }));
  };
  


  return (

    <>{!loader ? <div>
      <div className="tw-flex tw-items-center tw-w-full tw-justify-between">
        <div className='tw-flex tw-justify-center '>
          <Link to="/team-members"  >
            <ArrowBackIcon className="tw-text-grey" />
            <span className="tw-text-grey tw-ml-2 tw-mt-2 tw-text-sm tw-leading-normal">Back</span>
          </Link>
        </div>
        <div className='tw-flex tw-gap-5'>
          <Button variant="outlined" onClick={openChangePassword}
            className={`tw-px-1 tw-h-10 !tw-text-secondary  !tw-text-base   !tw-border-[0.1px]
      !tw-border-[#DDD] tw-rounded-lg tw-transition-all tw-duration-300 tw-w-14 tw-font-medium  tw-border-r-2   lg:tw-w-48      !tw-shadow-sm	 `}>
            Change Password
          </Button>

          <Button onClick={() => navigate(`/profile/update`)} variant="outlined" className='!tw-bg-none !tw-text-secondary !tw-text-base'>
            Edit Info
          </Button>
        </div>

      </div>
      {isForgetPassModalOpen ? (
        <div>
          <FormDialog open={isForgetPassModalOpen} close={close} title="Change Password" >

            <form onSubmit={handleForgetPasswordFormSubmit} className="tw-max-w-[400px] tw-mx-auto tw-py-2">
              <div className="tw-flex tw-flex-col tw-gap-6">
                <div className="text-center">
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    label="Enter Current Password"
                    type="text"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentpassword(e.target.value);
                        if (errors.currentPassword) {
                          clearErrors();
                        }
                      }}
                    error={Boolean(errors.currentPassword)}
                    helperText={errors.currentPassword}
                  />
                </div>
                <div className="text-center">
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    label="New Password"
                    type="text"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                        if (errors.password) {
                          clearErrorsNew();
                        }
                      }}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                  />
                </div>
                <div className="text-center">
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    label="Confirm Password"
                    type="text"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          clearErrorsConform();
                        }
                      }}
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword}
                  />
                </div>
              </div>
              <div className="tw-text-center tw-pt-10">
                <Button variant="contained" type="submit" disableElevation fullWidth className="tw-px-[105px] !tw-text-white !tw-text-base">
                  Change Password
                </Button>
              </div>
            </form>
          </FormDialog>
        </div>
      ) : null}
      <Popover
        sx={{
          '& .MuiPaper-root': {
            padding: '16px',
            overflow: 'visible',
          },
        }}
        id={1}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className='tw-text-base  !tw-text-primaryText tw-font-normal' onClick={openChangePassword}>Change Password</div>

      </Popover>
      <div className='tw-pt-2'>
        <h2 className='tw-text-secondaryText tw-font-bold tw-text-2xl '>{user?.full_name || "-"}</h2>
      </div>
      <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
        <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">Basic Info
        </Typography>
        <div className="tw-flex  tw-gap-x-10 tw-gap-y-6 tw-flex-wrap tw-pt-6">
        <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
              <div>
                <CallIcon className='tw-text-grey' />
              </div>
            <div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
              <span className="tw-text-xs  tw-text-grey">Mobile No.</span>
              <span className="tw-text-sm tw-text-primaryText tw-font-normal">{user?.mobile || "-"}</span>
            </div>
          </div>
          <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
              <div>
                <MailOutlineIcon className='tw-text-grey' />
              </div>
            <div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
              <span className="tw-text-xs  tw-text-grey">Email</span>
              <span className="tw-text-sm tw-text-primaryText tw-font-normal">{user?.email || "-"}</span>
            </div>

          </div>
          <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
              <div>
                <WorkOutlineIcon className='tw-text-grey' />
              </div>
            <div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
              <span className="tw-text-xs  tw-text-grey">Role</span>
              <span className="tw-text-sm tw-text-primaryText tw-font-normal">{user?.role_name || "-"}</span>
            </div>

          </div>


          <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
              <div>
                <InfoOutlinedIcon className='tw-text-grey' />
              </div>
            <div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
              <span className="tw-text-xs  tw-text-grey">Created On  </span>
              <span className="tw-text-sm tw-text-primaryText tw-font-normal">{user?.created_at ? formatDate(user?.created_at) : "-"}</span>
            </div>
          </div>

        </div>

      </div>

    </div> : (<div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>)}

    </>

  )
}

