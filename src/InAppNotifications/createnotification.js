import { Button, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ErrorBox } from '../components/Errorbox'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LoadingButton } from '@mui/lab';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DropDownAddWithSearch from '../components/contentlibrary/DropDownAddWithSearch';
import ManualParentPagination from '../ManualWhatsApp/ManualParentPagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTagManualcampaign, getTagNameList } from '../ManualWhatsApp/duck/network';
import { useDispatch } from 'react-redux';
import { fillNotificationCampaignAddedUsers } from './duck/notificationSlice';
import { CreateNotficationCampaign } from './duck/network';

const header = [
  {
    id: 'full_name',
    numeric: false,
    disablePadding: true,
    label: 'Member List',
    sort: true,
    width: 180,
  },
  {
    id: 'role_name',
    numeric: false,
    disablePadding: true,
    label: 'Role',
    sort: true,
    width: 180,
  },
  {
    id: 'assigned_districts',
    numeric: false,
    disablePadding: true,
    label: 'District',
    sort: true,
    width: 180,
  },
  // {
  //   id: 'assigned_block_zone',
  //   numeric: false,
  //   disablePadding: true,
  //   label: 'Block/Zone',
  //   sort: true,
  //   width: 120,
  // },
  // {
  //   id: 'assigned_panchayat_ward',
  //   numeric: false,
  //   disablePadding: true,
  //   label: 'Panchayat/Ward',
  //   sort: true,
  //   width: 120,
  // },
  {
    id: 'assigned_village_area',
    numeric: false,
    disablePadding: true,
    label: 'Village/Area',
    sort: true,
    width: 120,
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: true,
    label: 'Status',
    sort: true,
    width: 120,
  },
  {
    id: 'updatedOn',
    numeric: false,
    disablePadding: true,
    label: 'Status Updated On',
    sort: true,
    width: 120,
  }
];

export default function CreateNotification(props) {
  const [searchData, setSearchData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const tagsnameList = useSelector((state) => state.manualWhatsApp.tagsNameList);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const addedMembers = useSelector((state) => state.notification?.addedMembers)
  const formDataCampaign = useSelector((state) => state.notification?.formDataCampaign)
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors }, setValue, watch, getValues } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    dispatch(getTagNameList({ type: "manual_notification" })).then((response) => {
      setSearchData(response?.data)
    })
  }, [dispatch])

  useEffect(() => {
    if (formDataCampaign) {
      setValue('englishTitle', formDataCampaign?.englishTitle || '');
      setValue('englishDescription', formDataCampaign?.englishDescription || '');
      setValue('tamilTitle', formDataCampaign?.tamilTitle || '');
      setValue('tamilDescription', formDataCampaign?.tamilDescription || '');
      setValue('tags', formDataCampaign?.tags || []);
      setSelectedValues(formDataCampaign?.tags || []);
    }
  }, [formDataCampaign, setValue]);


  const onSubmitNotfication = (data) => {
    dispatch(CreateNotficationCampaign({ ...data, memberIds: addedMembers.map(el => el?.id) })).then((res) => res?.data?.statusCode == 200 && navigate('/manual-in-app-notification'))
  }

  const AddNewData = () => {
    dispatch(createTagManualcampaign({ name: searchText, type: "manual_notification" })).then((res) => {
      res.data.statusCode == 200 && dispatch(getTagNameList({ type: "manual_notification" })).then((response) => {
        setSearchData(response.data)
      })
    })
  }


  const onNavigateDetails = () => { }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitNotfication)}>
        <div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
          <div className="tw-font-bold tw-text-[24px]">
            <Button variant="text" onClick={() => navigate(-1)} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[14px]" disableRipple startIcon={<KeyboardBackspaceIcon />}>
              In app Memeber notification
            </Button>
            <h1 className="tw-px-2 tw-mt-[-4px]">Create Notification</h1>
          </div>
          <div className="tw-flex tw-gap-x-5">
            <div className="tw-flex tw-gap-x-5">
              <Button onClick={() => navigate('/manual-in-app-notification')} type="button" variant="contained" size="small" className="tw-h-[35px] !tw-bg-white !tw-text-primary">
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                size="small"
                disabled={!addedMembers.length}
                sx={{
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(0, 0, 0, 0.12)', // Default disabled background color
                    color: 'rgba(0, 0, 0, 0.26)', // Default disabled text color
                  },
                }}
                className="tw-h-[35px]"
              >
                Release
              </LoadingButton>
            </div>
          </div>
        </div>

        <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
          <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">Campaign Details</Typography>
          <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-3 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-lightGrey tw-w-full">
            <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
              English
            </Typography>
            <div className="!tw-w-full">
              <Controller
                name="englishTitle"
                control={control}
                rules={{
                  required: 'Please enter english title.',
                  validate: (value) => value.length > 1 || 'Please enter english title.',
                }}
                render={({ field }) => (
                  <div className="!tw-w-full">
                    <TextField variant="outlined" inputProps={{ maxLength: 65 }} size="small" label="Notification title" type="text" {...field} className="!tw-w-full" />
                    <span className='tw-text-xs tw-text-secondaryText'>Maximum 65 characters</span>
                    {errors.englishTitle && (
                      <ErrorBox>
                        <ErrorOutlineIcon fontSize="small" />
                        <span>{errors.englishTitle.message}</span>
                      </ErrorBox>
                    )}
                  </div>
                )}
              />
              <Controller
                name="englishDescription"
                control={control}
                rules={{
                  required: 'Please enter english description.',
                  validate: (value) => value.length > 1 || 'Please enter english description.',
                }}
                render={({ field }) => (
                  <div className="!tw-w-full tw-py-5">
                    <TextField variant="outlined" size="small" inputProps={{ maxLength: 128 }} label="Notification Description" type="text" {...field}
                      className="!tw-w-full" multiline rows={4} />
                    <span className='tw-text-xs tw-text-secondaryText'>Maximum 128 characters</span>
                    {errors.englishDescription && (
                      <ErrorBox>
                        <ErrorOutlineIcon fontSize="small" />
                        <span>{errors.englishDescription.message}</span>
                      </ErrorBox>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
          <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-6 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-lightGrey tw-w-full">
            <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
              Tamil
            </Typography>
            <div className="!tw-w-full">
              <Controller
                name="tamilTitle"
                control={control}
                rules={{
                  required: 'Please enter tamil title.',
                  validate: (value) => value.length > 1 || 'Please enter tamil title.',
                }}
                render={({ field }) => (
                  <div className="!tw-w-full">
                    <TextField variant="outlined" inputProps={{ maxLength: 65 }} size="small" label="Notification title" type="text" {...field} className="!tw-w-full" />
                    <span className='tw-text-xs tw-text-secondaryText'>Maximum 65 characters</span>
                    {errors.tamilTitle && (
                      <ErrorBox>
                        <ErrorOutlineIcon fontSize="small" />
                        <span>{errors.tamilTitle.message}</span>
                      </ErrorBox>
                    )}
                  </div>
                )}
              />
              <Controller
                name="tamilDescription"
                control={control}
                rules={{
                  required: 'Please enter tamil description.',
                  validate: (value) => value.length > 1 || 'Please enter tamil description.',
                }}
                render={({ field }) => (
                  <div className="!tw-w-full tw-py-5">
                    <TextField variant="outlined" size="small" inputProps={{ maxLength: 128 }} label="Notification Description" type="text" {...field}
                      className="!tw-w-full" multiline rows={4} />
                    <span className='tw-text-xs tw-text-secondaryText'>Maximum 128 characters</span>
                    {errors.tamilDescription && (
                      <ErrorBox>
                        <ErrorOutlineIcon fontSize="small" />
                        <span>{errors.tamilDescription.message}</span>
                      </ErrorBox>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
          <Controller name="tags" control={control} render={({ field }) => (
            <div className='tw-flex tw-flex-col tw-w-[400px]'>
              <DropDownAddWithSearch
                setSearchData={setSearchData}
                onChange={setSelectedValues}
                selectedValues={selectedValues}
                searchData={searchData}
                Data={tagsnameList}
                valuekey="id"
                labelkey="name"
                label="Add Tags (optional)"
                value={selectedValues}
                searchText={searchText}
                AddNewData={AddNewData}
                setSearchText={setSearchText}
                defaultValues={formDataCampaign?.tags}
                {...field}
              />
            </div>
          )} />
        </div>

        <div className="tw-p-6 tw-shadow-md tw-bg-white tw-rounded-xl">
          <div className="tw-flex tw-justify-between">
            <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">List of Members</Typography>
            <Button variant="contained" size="small" className="tw-h-[35px]"
              onClick={() => {
                dispatch(fillNotificationCampaignAddedUsers({ ...getValues() }))
                navigate('/team-members', {
                  state: {
                    redirectFrom: 'notificatin-team-member',
                    tags: selectedValues,
                  },
                });
              }}>
              Add new Memeber
            </Button>
          </div>
          <div>
            {addedMembers?.length > 0 ? (
              <ManualParentPagination
                scrollable
                onNavigateDetails={onNavigateDetails}
                actions={{ edit: true, preview: true }}
                columns={header}
                data={addedMembers}
                page={page}
                details={true}
                keyProp="uuid"
                setPage={setPage}
              />
            ) : (
              <div className="tw-p-6 tw-mt-5  tw-text-SecondaryTextColor tw-font-normal tw-text-base tw-text-center tw-rounded-lg">
                <span>No Members currently added. Start adding members by clicking on "Add New Member"</span>
              </div>
            )}
          </div>
        </div>

      </form>
    </div>
  )
}
