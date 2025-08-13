import React, { useState } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import { DropzoneSubtext, DropzoneText } from '../Dropzone/style';
import { ErrorBox } from '../Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export function DropExcelDocument(props) {
  const { register } = props;

  const changeFiles = (e) => {
    if (e.target.files[0].size > 5 * 1024 * 1024) {
      props.setFileError('File size cannot be greater than 5MB')
    }
    if (e.target.files[0].type.includes("vnd")) {
      props.setSelectedFile(e.target.files[0])
      props.setError("")
    }
    else{
      props.setError("Only .xlsx file allowed")
    }
  };

  const removeFile = () => {
    props.setSelectedFile(null);
    // Generate a random key to reset input value
    props.setKey(Math.random());
    props.setFileError('')
  };

  return (
    <>
      <div className="tw-border tw-rounded-lg tw-w-full tw-border-dashed tw-box-border tw-p-6 tw-text-center tw-border-grey">
        <label>
          <input
            type="file"
            name="file"
            accept=".xlsx" // XLSX files
            {...register('file')}
            onChange={changeFiles}
            key={props.key} // Reset input value by changing the key
            className="tw-hidden"
          />
          <DropzoneText className='tw-justify-center'>
            Drag and drop to upload files, or <span className='tw-cursor-pointer tw-text-primary tw-ml-1 tw-block'>click here</span>
          </DropzoneText>
          <DropzoneSubtext>Accepted filetypes: .xlsx (under 5MB)</DropzoneSubtext>
        </label>
      </div>
      {props.error && <ErrorBox>{props.error}</ErrorBox>}
      {props.selectedFile && (
        <Box className="tw-flex tw-items-center tw-justify-between tw-py-2 tw-px-2 tw-my-2 tw-bg-backgroundBody tw-rounded">
          <div className="tw-text-[#666] tw-flex tw-gap-2 tw-items-center"><AttachFileIcon fontSize='small' /> <p>{props.selectedFile.name}</p></div>
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
