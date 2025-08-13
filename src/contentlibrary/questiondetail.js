import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, CircularProgress, Paper, Typography, TextareaAutosize, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteQuestion, getContentLibraryDetails } from './duck/network';
import { DeleteDialog, InfoDialog } from '../components/Dialog';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Dropdown } from '../components/Select';
import { Controller, useForm } from 'react-hook-form';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallIcon from '@mui/icons-material/Call';
import DateRangeIcon from '@mui/icons-material/DateRange';

export default function QuestionDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pathname = useParams();
  const location = useLocation();
  const contentDetails = useSelector((state) => state.contentlibrary.contentdetails);
  const loader = useSelector((state) => state.contentlibrary.contentListLoading);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [optionOpen, setOptionOpen] = useState(false);
  const [selectedOptionUrl, setSelectedOptionUrl] = useState('');
  const Permissions = JSON.parse(localStorage.getItem('permissions'));
  const { control } = useForm();
  const [dropdownvalues, setDropDownValues] = useState([])

  useEffect(() => {
    dispatch(getContentLibraryDetails(pathname))
  }, [pathname])

  const DeleteQuestion = (params) => {
    dispatch(deleteQuestion({ id: params })).then((res) => res?.data?.statusCode === 200 && navigate('/content-library'))
  }

  const handleClose = () => {
    setOpenDeleteDialog(false)
  }

  const OptionsDialog = (url) => {
    setSelectedOptionUrl(url);
    setOptionOpen(true);
  };

  let MediaValue = '';
  let MediaTypeValue = '';

  switch (contentDetails?.questionnairesJson?.allowedMediaType) {
    case '1':
      MediaValue = 'Image';
      MediaTypeValue = '.jpeg .png,';
      break;
    case '2':
      MediaValue = 'Video';
      MediaTypeValue = '.mp4,';
      break;
    case '3':
      MediaValue = 'Audio';
      MediaTypeValue = '.mp3,';
      break;
    case '4':
      MediaValue = 'PDF';
      MediaTypeValue = '.pdf,';
      break;
    default:
      MediaValue = '';
      MediaTypeValue = '';
      break;
  }


  return (
    <>
      <div className="tw-flex tw-items-center tw-w-full tw-justify-between">
        {!location?.state?.redirectFrom === 'unitContent' ? (
          <Link to="/content-library">
            <ArrowBackIcon className="tw-text-grey" />
            <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">Content Library</span>
          </Link>
        ) : (
          <a className="tw-cursor-pointer" onClick={() => navigate(-1)}>
            <ArrowBackIcon className="tw-text-grey" />
            <span className="tw-text-grey tw-ml-2 tw-text-sm tw-leading-normal">Back</span>
          </a>
        )}
        {location?.state?.redirectFrom === 'unitContent' ? null : (
          <div className="tw-flex tw-gap-x-4 tw-items-center">
            {Permissions?.['Content Library']?.delete && (
              <Button variant="outlined" className="!tw-border-error !tw-text-error" onClick={() => setOpenDeleteDialog(true)}>
                Delete
              </Button>
            )}
            {Permissions?.['Content Library']?.update && (
              <Button variant="contained" onClick={() => navigate(`/content-library/update-question/${contentDetails.id}`)}>
                Edit Question
              </Button>
            )}
          </div>
        )}
      </div>
      <Typography variant="h2" className="!tw-font-semibold !tw-text-secondaryText">
        Question
      </Typography>
      {!loader ? (
        <Paper className="tw-w-full tw-flex tw-flex-col tw-p-6 tw-mt-6">
          <div className="tw-flex tw-items-start tw-gap-6 tw-self-stretch tw-mb-6">
            <div className="tw-flex tw-flex-col tw-gap-2 tw-w-1/2">
              <span className="tw-text-xs tw-text-grey tw-font-normal">Created By</span>
              <span className="tw-text-sm">{contentDetails.createdBy}</span>
            </div>
            <div className="tw-flex tw-flex-col tw-gap-2 tw-w-1/2">
              <span className="tw-text-xs tw-text-grey tw-font-normal">Created On</span>
              <span className="tw-text-sm">{contentDetails.createdOn}</span>
            </div>
            <div className="tw-flex tw-flex-col tw-gap-2 tw-w-1/2">
              <span className="tw-text-xs tw-text-grey tw-font-normal">Tags</span>
              <div className="tw-flex tw-flex-wrap">
                {contentDetails?.tagObject?.map((el, i) => (
                  <span className="tw-text-sm tw-mr-1" key={i}>
                    {' '}
                    {el.name} {i < contentDetails?.tagObject?.length - 1 && ','}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <span className="tw-text-base tw-text-secondaryText tw-font-semibold">
            Q.{pathname.index} {contentDetails.title}
          </span>
          {contentDetails.description && <p className="tw-text-sm tw-text-[#333] tw-mt-3">{contentDetails?.description}</p>}
          {contentDetails?.mediaUrl && contentDetails?.mediaUrl.endsWith('.mp3') ? (
            <audio controls className="tw-mt-3 tw-mb-2">
              <source src={contentDetails?.temporaryMediaUrl} type="audio/mpeg" />
            </audio>
          ) : contentDetails?.mediaUrl ? (
            <>
              <div className="tw-mt-2 tw-mb-3 tw-cursor-pointer" onClick={() => OptionsDialog(contentDetails?.temporaryMediaUrl)}>
                <img className="tw-rounded-2xl tw-w-20 tw-h-20" alt="image" src={contentDetails?.temporaryMediaUrl} />
              </div>
            </>
          ) : null}
          {contentDetails?.questionnairesJson?.options?.length > 0 && (
            <div className="tw-flex tw-flex-col tw-mt-5">
              {contentDetails?.questionnairesJson?.options?.map((item, i) => (
                <div className='tw-flex tw-flex-col tw-mb-5 last:tw-mb-0'>
                  <div key={i} className="tw-flex tw-gap-3 tw-items-start">
                    <a
                      className={`tw-p-3 tw-border tw-border-grey ${contentDetails?.questionnairesJson?.meta.answerType === '1' ? 'tw-rounded-full' : ''
                        }`}
                    ></a>
                    <div className="tw-flex tw-flex-col tw-justify-start tw-gap-2">
                      <span className="tw-text-base tw-text-primaryText">{(item.label === "Custom Response" || item.mediaUrl === "Custom Response") ? "Other" : item.label}</span>
                      {item?.mediaUrl === "Custom Response" ? null : item.mediaUrl &&
                        (contentDetails?.questionnairesJson?.meta?.answerFormat === '3' ||
                          contentDetails?.questionnairesJson?.meta?.answerFormat === '5') ? (
                          <audio controls>
                            <source src={item?.temporaryMediaUrl} type="audio/mpeg" />
                          </audio>
                        ) : item?.mediaUrl === "Custom Response" ? null : item.mediaUrl && (
                          <>
                            <img
                              className="tw-rounded-2xl tw-w-20 tw-h-20 tw-cursor-pointer"
                              onClick={() => OptionsDialog(item?.temporaryMediaUrl)}
                              alt="image"
                              src={item?.temporaryMediaUrl}
                            />
                          </>
                        )}
                    </div>
                  </div>
                  {(item.label || item.mediaUrl) === "Custom Response" ?
                    <TextField className='!tw-mt-5' variant="outlined" type="text" disabled={true}
                      size="small" value='To be add by user'
                    />
                    : null}
                </div>
              ))}
            </div>
          )}
          {contentDetails?.answerType?.includes('characters') && (
            <TextareaAutosize
              disabled={true}
              className="tw-w-full tw-mt-4 tw-p-5 tw-rounded-xl tw-bg-[#EEE]"
              aria-label="minimum height"
              minRows={5}
              placeholder="Answer"
            />
          )}
          {contentDetails?.questionnairesJson?.textboxes?.length > 0 && (
            <div className="tw-mt-5">
              {contentDetails?.questionnairesJson?.textboxes.map((el, i) => (
                <div className="tw-flex tw-flex-col tw-gap-2 tw-mb-7" key={i}>
                  <span>{el.label}</span>
                  <div className="tw-w-[300px] tw-flex tw-gap-2 tw-py-[8.5px] tw-px-4 tw-border-[#CCC] tw-border tw-rounded-md tw-text-[#999]">
                    <span>
                      Enter{' '}
                      {el.inputType === '1'
                        ? 'answer'
                        : el.inputType === '2'
                          ? 'phone number'
                          : el.inputType === '3'
                            ? 'email address'
                            : el.inputType === '4'
                              ? 'date'
                              : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {contentDetails?.questionnairesJson?.form &&
            <div className='tw-mt-5'>
              {contentDetails?.questionnairesJson?.form?.map((item, index) =>
                <div key={index} className='tw-mb-5'>
                  <span className='tw-text-base tw-block tw-mb-5' key={index}>{item.label}</span>
                  {item?.children?.length > 0 && item?.children?.map((el, i) =>
                    <div className='tw-flex tw-flex-col tw-gap-3 tw-ml-9 tw-mb-5' key={i}>
                      <span>{el?.label}</span>
                      {el?.inputType !== "5" ?
                        <div className="tw-w-[300px] tw-flex tw-gap-2 tw-py-[8.5px] tw-px-4 tw-border-[#CCC] tw-border tw-rounded-md tw-text-[#999]">
                          {el?.inputType === "2" ? <CallIcon className='tw-text-[#ccc]' />
                            : el?.inputType === "2" ?
                              <MailOutlineIcon className='tw-text-[#ccc]' /> :
                              el?.inputType === "4" ? <DateRangeIcon className='tw-text-[#ccc]' /> : null}
                          <span>
                            {el?.inputType === '1' ? 'Enter answer' : el?.inputType === '2' ? 'Enter phone number' : el?.inputType === '3'
                              ? 'Enter email address' : el?.inputType === '4' ? 'Select Date' : ''}
                          </span>
                        </div>
                        :
                        <Controller name="choose" control={control} render={({ field: { onChange, value } }) => {
                          const mergeOnChange = (selectValue) => {
                            onChange(selectValue);
                            let newData = [...dropdownvalues];
                            newData[index] = selectValue;
                            setDropDownValues(newData)
                            onChange(newData);
                          }
                          return (
                            <div className='tw-w-[300px]'>
                              <Dropdown options={el?.children}
                                valuekey="label" labelkey="label" label="Choose one" onChange={mergeOnChange} value={dropdownvalues[index] || ""} />
                            </div>
                          )
                        }
                        } />}
                    </div>
                  )}
                </div>
              )}
            </div>
          }

          {contentDetails?.questionnairesJson?.allowedMediaType && contentDetails?.questionnairesJson?.uploadLimit && (
            <div className="tw-flex tw-items-start tw-mt-8 tw-gap-2">
              <div className="tw-flex tw-flex-col tw-gap-3">
                <div className="tw-w-[300px] tw-py-[9px] tw-flex tw-gap-4 tw-items-center tw-px-4 tw-bg-[#EEE] tw-rounded-md tw-text-grey">
                  <AttachFileIcon className="tw-text-grey" />
                  <span>Choose {MediaValue}</span>
                </div>
                <p className="tw-text-sm tw-text-grey">
                  Accepted filetypes {MediaTypeValue} (under {contentDetails?.questionnairesJson?.allowedMediaType === '2' ? '5MB' : '2MB'})
                </p>
              </div>
              <span className="tw-text-sm tw-text-[#333] tw-mt-3">
                Upload limit: {contentDetails?.questionnairesJson?.uploadLimit}
              </span>
            </div>
          )}
        </Paper>
      ) : (
        <div className="tw-text-center tw-py-5">
          <CircularProgress />
        </div>
      )}
      {openDeleteDialog && (
        <DeleteDialog
          open={openDeleteDialog}
          loading={false}
          close={handleClose}
          delete={() => DeleteQuestion(contentDetails.id)}
          title="Delete Question"
        >
          <p>Are you sure, you want to delete this question? This action is irreversible</p>
        </DeleteDialog>
      )}
      {optionOpen && (
        <InfoDialog open={optionOpen} close={() => setOptionOpen(false)}>
          <div className="tw-mt-2 tw-mb-3">
            <img className="tw-rounded tw-w-full tw-h-full" alt="image" src={selectedOptionUrl} />
          </div>
        </InfoDialog>
      )}
    </>
  );
}
