
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import loginLogo from '../../../public/assets/images/login-banner.png';
import logo from '../../../public/assets/images/logo.svg';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';


import successIcon from '../../../public/assets/icons/success.svg';
import errorIcon from '../../../public/assets/icons/error.svg';
import { Button, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FormDialog, { InfoDialog } from '../../components/Dialog';
import { ErrorBox } from '../../components/Errorbox';
import { forgetPassword, login, verifyUser } from './duck/network';
// import { login } from './duck/network';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';


export default function Login() {
  const [isForgetPassModalOpen, setIsForgetPassModalOpen] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isForgetPasswordCallSucess, setIsForgetPasswordCallSuccess] = useState(null);
  const [isLoginFailed, setIsLoginFailed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)


  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    control: forgetPassControl,
    handleSubmit: forgetPassHandleSubmit,
    formState: { errors: forgetPassErrors },
  } = useForm();


  const dispatch = useDispatch();
  const loginLoader = useSelector((state) => state.auth.loading);
  const forgotLoader = useSelector((state) => state.auth.forgetLoader);

  const handleCredentialsSubmit = (credentials) => {
    dispatch(login(credentials)).then((res) => {
      if (res?.data?.statusCode === 200) {
        dispatch(verifyUser()).then((response) => {
          if (response?.data?.statusCode === 200) navigate('/');
        });
      } else {
        setIsLoginFailed(true)
      }
    });
  };

  const handleForgetPasswordFormSubmit = (formValues) => {
    dispatch(forgetPassword(formValues)).then((res) => {
      if (res?.data?.statusCode === 200) {
        setIsInfoDialogOpen(true);
        setIsForgetPasswordCallSuccess(true);
        setIsForgetPassModalOpen(false);
      }
      if (res?.data?.statusCode === 422) {



      }
    });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);


  const close = () => setIsForgetPassModalOpen(false);




  return (
    <div className="tw-w-full tw-bg-white">
      <div className="tw-flex ">
        <div className="tw-w-1/2 tw-flex tw-flex-col  tw-justify-center tw-items-center tw-bg-backgroundDarkGrey  tw-h-[93.9vh]  ">
          <div className=" tw-px-5 tw-py-5 ">
            <p className="tw-text-lg  tw-font-semiBold tw-font-inter tw-text-center tw-pb-14  tw-max-w-[640px] ">Ensuring access to meaningful primary education is the least we can do but the first thing we must do, for every child.</p>
            <div className='tw-flex tw-items-center tw-justify-center   '>
              <div className="tw-max-w-[500px] tw-max-h-[333px]  ">
                <img src={loginLogo} className="tw-h-[100%] tw-w-[100%]" />
              </div>
            </div>
          </div>
        </div>
        <div className="tw-w-1/2 tw-flex tw-flex-col tw-justify-center tw-min-h-[93.9vh]">
          <div className=" tw-mx-auto">
            <div className="tw-mx-5 tw-py-5">
              <div className="tw-max-w-[250px]    ">
                <img src={logo} className="tw-h-[100%] tw-w-[100%]" />
              </div>
              <div className='tw-pb-20 max-2xl:tw-pb-10'>
                <h1 className="tw-text-2xl tw-font-bold tw-font-inter tw-text-center tw-px-10 tw-pb-20   max-2xl:tw-pb-10  ">Admin Dashboard</h1>
                <div className="tw-w-[343px]">
                  <div className="text-center tw-h-[100%] tw-w-[100%]">
                    <form onSubmit={handleSubmit(handleCredentialsSubmit)} >
                      <div className="tw-mx-auto tw-py-3">
                        <Controller
                          name="username"
                          control={control}
                          rules={{
                            required: 'This field is mandatory',
                            pattern: {
                              value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                              message: 'Please enter valid email',
                            },
                          }}
                          render={({ field }) => (
                            <div className="text-center tw-text">
                              <TextField fullWidth size="small" label="Email"  {...field} error={errors.username ? true : false} />
                              {errors.username && (
                                <ErrorBox>
                                  <ErrorOutlineIcon fontSize="small" />
                                  <span>{errors.username.message}</span>
                                </ErrorBox>
                              )}
                            </div>
                          )}
                        />
                      </div>
                      <div className="tw-mx-auto tw-py-3">
                        <Controller
                          name="password"
                          control={control}
                          rules={{
                            required: 'This field is mandatory',
                          }}
                          render={({ field }) => (
                            <div className="text-center">
                              <TextField
                                variant="outlined"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                size="small"
                                label="Password"
                                {...field}
                                error={errors.password ? true : false}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                        className='!tw-text-grey '
                                      >
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              {errors.password && (
                                <ErrorBox>
                                  <ErrorOutlineIcon fontSize="small" />
                                  <span>{errors.password.message}</span>
                                </ErrorBox>
                              )}
                            </div>
                          )}
                        />
                      </div>
                      <div className="tw-text-end tw-text-primaryColor">
                        <Button onClick={() => setIsForgetPassModalOpen(true)} className="tw-p-0" variant="text" disableRipple disableElevation>
                          forgot password?
                        </Button>
                      </div>
                      <div className="tw-text-center tw-mt-14 max-2xl:tw-pt-1  ">
                        <LoadingButton
                          loading={loginLoader}
                          variant="contained"
                          type="submit"
                          disableElevation
                          fullWidth
                          size="medium"

                        >
                          Login
                        </LoadingButton>


                      </div>
                    </form>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        {isForgetPassModalOpen ? (
          <div>
            <FormDialog open={isForgetPassModalOpen} close={close} title="Forget Password">
              <p style={{ textAlign: 'center' }}>Enter your registered email ID. We will send you a link to change your password</p>
              <form onSubmit={forgetPassHandleSubmit(handleForgetPasswordFormSubmit)} className="tw-max-w-[400px] tw-mx-auto tw-py-5">
                <div className="tw-mx-auto tw-py-3">
                  <Controller
                    name="email"
                    control={forgetPassControl}
                    rules={{
                      required: 'This field is mandatory',
                      pattern: {
                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Please enter valid email',
                      },
                    }}
                    render={({ field }) => (
                      <div className="text-center">
                        <TextField variant="outlined" fullWidth size="small" label="Email" {...field} />
                        {forgetPassErrors.email && (
                          <ErrorBox>
                            <ErrorOutlineIcon fontSize="small" />
                            <span>{forgetPassErrors.email.message}</span>
                          </ErrorBox>
                        )}
                      </div>
                    )}
                  />
                </div>


                <div className="tw-text-center tw-mt-14 max-2xl:tw-pt-1  ">
                  <LoadingButton
                    loading={forgotLoader}
                    variant="contained"
                    type="submit"
                    disableElevation
                    fullWidth
                    size="small"
                    className={`tw-px-[105px] tw-h-[30px] !tw-py-1 ${forgotLoader ? '!tw-text-white' : ''} `}
                  >
                    {!forgotLoader && 'Continue'}
                  </LoadingButton>


                </div>

              </form>
            </FormDialog>
          </div>
        ) : null}
        {isInfoDialogOpen ? (
          <InfoDialog open={isInfoDialogOpen} close={() => setIsInfoDialogOpen(false)}>
            <div className="tw-text-center">
              <img className="tw-mx-auto" src={isForgetPasswordCallSucess ? successIcon : errorIcon} />
              <h3 className="tw-font-bold tw-text-inter tw-pt-5 ">
                {isForgetPasswordCallSucess ? `Password reset link sent` : 'Sorry! we could not find your account'}
              </h3>
              <p className="tw-pt-5">
                {isForgetPasswordCallSucess
                  ? `An email will be sent to your registered email id to set a new password.`
                  : `Looks like this isn’t your registered account. Please enter registered email id and try again`}
              </p>
              <div className="tw-pt-5">
                <Button
                  onClick={() => {
                    setIsInfoDialogOpen(false);
                    if (!isForgetPasswordCallSucess) setIsForgetPassModalOpen(true);
                  }}
                  variant="contained"
                  fullWidth
                  disableElevation
                  className="tw-px-[105px] !tw-text-white "
                >
                  Okay
                </Button>
              </div>
            </div>
          </InfoDialog>
        ) : null}

        {isLoginFailed ? (
          <InfoDialog open={isLoginFailed} close={() => setIsLoginFailed(false)}>
            <div className="tw-text-center">
              <img className="tw-mx-auto" src={errorIcon} />
              <h3 className="tw-font-bold tw-text-inter tw-pt-5  tw-text-secondaryText">
                Login Failed
              </h3>
              <p className="tw-pt-5">
                Your email or password is incorrect.</p>
              <p>Please try again</p>
              <div className="tw-pt-5">
                <Button
                  onClick={() => { setIsLoginFailed(false) }}
                  variant="contained"
                  fullWidth
                  disableElevation
                  className="tw-px-[105px] !tw-text-white "
                >
                  Try again
                </Button>
              </div>
            </div>
          </InfoDialog>
        ) : null
        }
      </div>
      <div className='tw-bg-primary tw-py-4 tw-px-[84px] tw-flex tw-justify-between tw-items-center'>
        <div className='tw-text-sm !tw-text-[#333] tw-font-normal'>
          <span>Copyright © 2024 Madhi Foundation. All Rights Reserved. </span>
        </div>
        <div className='tw-flex tw-gap-2'>
          <a target='_blank' href='/terms-and-conditions'>Terms & Conditions</a>
          <span>|</span>
          <a target='_blank' href='/privacy-policy'>Privacy Policy</a>
        </div>
      </div>
    </div>
  )
}
