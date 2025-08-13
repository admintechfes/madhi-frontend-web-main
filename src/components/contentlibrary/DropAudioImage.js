import React from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import { DropzoneSubtext, DropzoneText } from '../Dropzone/style';
import { ErrorBox } from '../Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useDispatch } from 'react-redux';
import { ContentLibraryUploadMedia } from '../../contentlibrary/duck/network';

export function DropAudioImage(props) {
  const { register } = props;
  const dispatch = useDispatch()

  const changeFiles = (e) => {

    props.setError('');
    props.setFileError('');

    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("file", file)

    if (!file) return;

    if (props.bigSize) {
      if (file.size > 5 * 1024 * 1024) {
        props.setFileError('File size cannot be greater than 5MB');
        return;
      }
      else {
        if (file.size > 2 * 1024 * 1024) {
          props.setFileError('File size cannot be greater than 2MB');
          return;
        }
      }
    }



    const validTypes = ['image/jpeg', 'image/png', 'audio/mpeg'];
    if (validTypes.includes(file.type)) {
      dispatch(ContentLibraryUploadMedia(formData)).then((resp) => {
        if (file.type.startsWith('image/')) {
          const img = new Image();
          img.onload = () => {
            if (img.width === img.height) {
              props.setSelectedFile(resp?.data?.mediaUrl);
              props?.onChange(resp?.data?.mediaUrl); // Update the react-hook-form state
              props.setError('');
              props.setFileError('');
            } else {
              props.setFileError('Image must have a 1:1 aspect ratio');
            }
          };
          img.onerror = () => {
            props.setFileError('Error loading image');
          };
          img.src = URL.createObjectURL(file);
        }
        else {
          props.setSelectedFile(resp?.data?.mediaUrl);
          props?.onChange(resp?.data?.mediaUrl); // Update the react-hook-form state
          props.setError('');
          props.setFileError('');
        }
      })
    } else {
      props.setError('Only .jpeg, .png, and .mp3 files are allowed');
    }
  };

  const removeFile = () => {
    props.setSelectedFile(null);
    props.setKey(Math.random()); // Generate a random key to reset input value
    props.setFileError('');
    props?.onChange(null); // Update the react-hook-form state
  };

  return (
    <>
      {props?.selectedFile ? null : <div className={`tw-border-2 tw-rounded-lg  tw-w-full tw-border-dashed tw-box-border ${props.css ? "tw-py-[12px] tw-px-[10px]" : "tw-p-6"}  tw-text-center tw-border-[#CCC]`}>
        <label>
          <input
            type="file"
            name="file"
            accept={props.optionalFile ? ".mp3,.jpeg,.png" : (props.answertypeformat === "3" || props.answertypeformat === "5" || props.bigSize) ? ".mp3" : ".jpeg,.png"}
            onChange={changeFiles}
            key={props.key} // Reset input value by changing the key
            className="tw-hidden"
          />
          <DropzoneText className='tw-justify-center'>
            Drag and drop to upload file, or <span className='tw-cursor-pointer tw-text-primary tw-ml-1 tw-block'>click here</span>
          </DropzoneText>
          {props.bigSize &&
            <DropzoneSubtext>Accepted filetypes: .mp3, (under 5MB)</DropzoneSubtext>
          }
        </label>
      </div>}
      {props.error && <ErrorBox>{props.error}</ErrorBox>}
      {props?.selectedFile && (
        <Box className={`tw-flex tw-items-center ${props.css ? "tw-w-full" : "tw-w-fit tw-mt-4 tw-mb-2"}  tw-gap-5 tw-justify-between tw-py-2 tw-px-2 tw-bg-[#EEE] tw-rounded`}>
          <div className="tw-text-[#666] tw-flex tw-gap-2 tw-items-center"><AttachFileIcon fontSize='small' /> <p>{props.selectedFile}</p></div>
          <IconButton sx={{ padding: 0 }} color="error" onClick={removeFile}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
      {props.fileError && (
        <ErrorBox>
          <ErrorOutlineIcon fontSize="small" />
          <span>{props.fileError}</span>
        </ErrorBox>
      )}
    </>
  );
}
