import React from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useDispatch } from 'react-redux';
import { ContentLibraryUploadMedia } from '../../../contentlibrary/duck/network';
import { DropzoneText } from '../../../components/Dropzone/style';
import { ErrorBox } from '../../../components/Errorbox';

export function DropAudioImageWoV(props) {
  const {
    register,
    rootIndex,
    index,
    sectionIndex,
    allowedMediaType,
    setSelectedFile,
    setFileError,
    fileError,
    setError,
    error,
    setKey,
    onChange,
  } = props;
  
  const dispatch = useDispatch();

  const validateImageAspectRatio = (file, onValid, onError) => {
    const img = new Image();
    img.onload = () => {
      if (img.width === img.height) {
        onValid();
      } else {
        onError('Only 1:1 aspect ratio images are allowed');
      }
    };
    img.onerror = () => {
      onError('Invalid image file');
    };
    img.src = URL.createObjectURL(file);
  };

  const changeFiles = (e) => {
    setError('');
    setFileError('');

    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFileError('File size cannot be greater than 2MB');
      return;
    }

    const mediaTypeMap = {
      '1': ['image/jpeg', 'image/png', 'image/jpg'],
      '2': ['video/mp4'],
      '3': ['audio/mpeg'],
      '4': ['application/pdf'],
    };
    const validTypes = mediaTypeMap[allowedMediaType];

    if (validTypes && validTypes.includes(file.type)) {
      if (allowedMediaType === '1') { // Image validation
        validateImageAspectRatio(
          file,
          () => {
            uploadFile(file);
          },
          (errorMsg) => {
            setFileError(errorMsg);
          }
        );
      } else {
        uploadFile(file);
      }
    } else {
      setFileError(`Invalid file type. Only ${validTypes.join(', ')} are allowed.`);
    }
  };

  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    dispatch(ContentLibraryUploadMedia(formData)).then((resp) => {
      setSelectedFile(resp?.data);
      onChange(resp?.data);
      setError('');
      setFileError('');
    }).catch(error => {
      console.error("Upload failed:", error);
      setFileError('Upload failed');
    });
  };

  const removeFile = () => {
    setSelectedFile(null);
    setKey(Math.random());
    setFileError('');
    onChange(null);
  };


  return (
    <>
      {!props.selectedFile ? (
        <div className={`tw-border-2 tw-rounded-lg tw-w-[520px] tw-border-dashed tw-box-border ${props.css ? 'tw-py-[12px] tw-px-[10px]' : 'tw-p-6'} tw-text-center tw-border-[#CCC]`}>
          <label>
            <input
              type="file"
              name={`file_${sectionIndex}_${rootIndex}_${index}`}
              accept=".mp3,.jpeg,.png,.pdf,.mp4"
              onChange={changeFiles}
              key={props.key}
              className="tw-hidden"
            />
            <DropzoneText className="tw-justify-center">
              Drag and drop to upload file, or <span className="tw-cursor-pointer tw-text-primary tw-ml-1 tw-block">click here</span>
            </DropzoneText>
          </label>
        </div>
      ) : (
        <Box className={`tw-flex tw-items-center ${props.css ? 'tw-w-full' : 'tw-w-fit tw-mt-4 tw-mb-2'} tw-gap-5 tw-justify-between tw-py-2 tw-px-2 tw-bg-[#EEE] tw-rounded`}>
          <a href={props.selectedFile?.temporaryMediaUrl} target="_blank" className="tw-text-[#666] tw-flex tw-gap-2 tw-items-center">
            <AttachFileIcon fontSize="small" /> <p>{props.selectedFile?.mediaUrl}</p>
          </a>
          <IconButton sx={{ padding: 0 }} color="error" onClick={removeFile}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
      {fileError && (
        <ErrorBox>
          <ErrorOutlineIcon fontSize="small" />
          <span>{fileError}</span>
        </ErrorBox>
      )}
    </>
  );
}
