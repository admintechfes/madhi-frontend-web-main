import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

import { ErrorBox } from '../../components/Errorbox';
import { Dropdown } from '../../components/Select';
import DropDownWithSearch from '../../components/Masters/DropDownWithSearch';
import { getUserDetails, getUserRoleNameList } from '../../Users/duck/network';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { updateProfile } from '../duck/network';



function UpdateProfileDetails() {
  const [selectRole, setSelectRole] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const user1 = useSelector((state) => state.user.userDetails)
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      first_name: " ",
      last_name: " ",
      email: " ",
      mobile: " ",
    },
    mode: "onChange"
  });
  useEffect(() => {

    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      dispatch(getUserDetails({ id: parsedUserData.id })).then(resp => setUser(resp))
      Object.keys(parsedUserData).forEach(key => {
        setValue(key, parsedUserData[key]);
      });
      setSelectRole(parsedUserData.role_name)
    }

  }, [setUser])



  const handleCancel = () => {
    navigate(`/profile`)
  }

  const onSubmitUser = (values) => {


    dispatch(updateProfile(values)).then((res) => {
      if (res?.data?.statusCode === 200) {
        window.localStorage.setItem('user', JSON.stringify({ ...values, full_name: `${values?.first_name} ${values?.last_name}` }));
        navigate("/profile")
      }
    }
    )

  }

  const renderTextFieldWithError = (field, label, error, onKeyPress, type, params) => (
    <div className="!tw-w-[328px]">
      <TextField variant="outlined" size="small" label={label} type={type ? type : "text"} onKeyPress={onKeyPress} value={field.value || ''} {...field} className='!tw-w-[328px]' />

      {error && (
        <ErrorBox>
          <ErrorOutlineIcon fontSize="small" />
          <span>{error.message}</span>
        </ErrorBox>
      )}
    </div>
  );




  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitUser)}>
        <div className='!tw-bg-[#FAFCFE]'>
          <div className="tw-flex tw-items-center tw-w-full tw-justify-between ">
            <div className='tw-flex tw-justify-center '>
              <Link to="/profile"  >
                <ArrowBackIcon className="tw-text-grey" />
                <span className="tw-text-grey tw-ml-2 tw-mt-2 tw-text-sm tw-leading-normal">Back</span>
              </Link>
            </div>
            <div >
              <Button onClick={handleCancel} variant='outlined' className='!tw-bg-white !tw-text-primary !tw-mr-4 !tw-border-[#DDD] !tw-shadow-sm'>
                Cancel
              </Button>
              <Button type="submit" variant='outlined' className='!tw-bg-primary !tw-text-white !tw-shadow-sm'>
                Save
              </Button>
            </div>
          </div>
          <div className='tw-pt-2'>
            <h2 className='tw-text-secondaryText tw-font-bold tw-text-2xl '>Create New Member</h2>
          </div>
          <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
            <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">Basic Info
            </Typography>
            <div className='tw-flex tw-gap-8  tw-flex-wrap'>

              <Controller
                name="first_name"
                control={control}
                rules={{
                  required: 'This field is mandatory.',
                  validate: value => value.length > 1 || 'Please enter valid first name.',
                }}
                render={({ field }) => (

                  renderTextFieldWithError(field, 'First Name', errors.first_name, (e) => {
                    if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }

                  ))}

              />
              <Controller
                name="last_name"
                control={control}
                rules={{
                  required: 'This field is mandatory.',
                  validate: value => value.length > 1 || 'Please enter a valid last name.',
                }}
                render={({ field }) => renderTextFieldWithError(field, 'Last Name', errors.last_name, (e) => {
                  if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                    e.preventDefault();
                  }
                })}
              />
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'This field is mandatory.',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Please enter a valid email ID'
                  }
                }}
                render={({ field }) => renderTextFieldWithError(field, 'Email', errors.email)}
              />
              <Controller
                name="mobile"
                control={control}
                rules={{
                  required: 'This field is mandatory.',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid mobile number',
                  },
                }}
                render={({ field }) => renderTextFieldWithError(field, 'Mobile No', errors.mobile, (e) => {
                  if (!/^\d*$/.test(e.target.value)) {
                    e.preventDefault();
                  }

                  if (e.target.value.length === 10) {
                    e.preventDefault();
                  }
                }, "number")}
              />

              <Controller
                name="role_id"
                control={control}
                rules={{
                  required: "Please select role to create."
                }}
                render={({ field }) => (
                  <div className="!tw-w-[328px]">
                    <FormControl className="!tw-min-w-[180px] tw-w-full" size="small" disabled>
                      <InputLabel
                        id="demo-select-small"
                        className={` !tw-bg-none `}
                      >Role</InputLabel>
                      <Select
                        labelId="single-option-dropdown-label"
                        id="single-option-dropdown"
                        value={selectRole}
                      >
                        <MenuItem className="tw-text-SecondaryTextColor"
                          value={selectRole} disabled>{selectRole}</MenuItem>
                      </Select>
                    </FormControl>
                    {errors.role_id && (
                      <ErrorBox>
                        <ErrorOutlineIcon fontSize="small" />
                        <span>{errors.role_id.message}</span>
                      </ErrorBox>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UpdateProfileDetails