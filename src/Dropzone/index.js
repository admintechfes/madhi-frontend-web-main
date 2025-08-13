import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DropzoneContainer, DropzoneSubtext, DropzoneText } from './style';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// import { SecondaryButton } from "../Button"
import { useDispatch } from 'react-redux';
// import documentIcon from "../../assets/images/document.png"
// import closeIcon from "../../assets/images/close-icon.svg"
import DocIcon from '@mui/icons-material/DescriptionOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { Box, CircularProgress, IconButton } from '@mui/material';
import { LoaderBg } from '../Loader/style';
import Loader from '../Loader';
import { toast } from 'react-toastify';

const thumbsContainer = {
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	marginTop: 16,
	width: '100%',
};

const thumbsContainerMultiple = {
	display: 'flex',
	flexWrap: 'wrap',
	marginTop: 16,
	marginBottom: 16,
	gap: '16px',
};

const thumb = {
	display: 'inline-flex',
	maxHeight: 200,
	boxSizing: 'border-box',
	position: 'relative',
};

const thumbMultiple = {
	display: 'flex',
	minWidth: 80,
	height: 80,
	boxSizing: 'border-box',
	marginBottom: '16px',
	position: 'relative',
};

const thumbInner = {
	display: 'flex',
	minWidth: 0,
	overflow: 'hidden',
};

const thumbInnerMultiple = {
	display: 'flex',
	minWidth: 0,
	overflow: 'hidden',
};

const img = {
	display: 'block',
	width: '80px',
	height: '100%',
	borderRadius: '8px',
};

const imgMultiple = {
	display: 'block',
	width: '80px',
	height: '100%',
	borderRadius: '8px',
};

const imgErrMultiple = {
	display: 'block',
	width: '80px',
	height: '100%',
	borderRadius: '8px',
	border: '2px solid red',
};
const changeBtn = {
	color: '#3892FF',
	border: 'none',
	outline: 'none',
	background: 'transparent',
};
const deleteBtn = {
	color: 'red',
	border: 'none',
	outline: 'none',
	background: 'transparent',
};
const ellipse = {
	maxWidth: '70%',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
};
const attachIcon = {
	color: '#768EA3',
	marginRight: '4px',
	fontSize: '16px',
	transform: 'rotate(45deg)',
};

const closeButton = {
	position: 'absolute',
	right: '5px',
	top: '5px',
	zIndex: 10,
	cursor: 'pointer',
};

export const DropzoneMultipleImage = (props) => {
	const [files, setFiles] = useState(props.value ? props.value : []);
	const [error, setError] = useState([]);
	const dispatch = useDispatch();
	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'image/jpeg': [],
			'image/png': [],
		},
		multiple: props.multiple || true,
		noDrag: false,
		onDrop: (acceptedFiles) => {
			const accfiles = acceptedFiles.map((file) => {
				const i = new Image();
				i.onload = () => {
					let reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => {
						console.log({
							src: file.preview,
							width: i.width,
							height: i.height,
							data: reader.result,
						});
					};
				};

				i.src = file.preview;
				props.onDrop(acceptedFiles, props.name);
				return Object.assign(file, {
					preview: URL.createObjectURL(file),
				});
			});
			setFiles([...files, ...accfiles]);
			if (props.onChange) {
				props.onChange(files);
			}
		},
	});

	const removeFile = (file) => () => {
		const newFiles = [...files];
		newFiles.splice(newFiles.indexOf(file), 1);
		setFiles(newFiles);
		props.handleRemove(file, props.name);
	};
	const thumbs = files.map((file, index) => {
		const err = props.error && props.error.find((element) => element == index);
		return (
			<div style={thumbMultiple} key={file.name}>
				<div style={thumbInnerMultiple}>
					{file.temporary_url ? (
						<img src={file.temporary_url} style={err >= 0 ? imgErrMultiple : imgMultiple} alt="" />
					) : file.type.includes('image') ? (
						<img src={file.preview} style={err >= 0 ? imgErrMultiple : imgMultiple} alt="" />
					) : (
						<img src={documentIcon} style={imgMultiple} alt="" />
					)}
				</div>
				<div onClick={removeFile(file)} style={closeButton}>
					<img src={closeIcon}></img>
				</div>
			</div>
		);
	});

	useEffect(
		() => () => {
			// Make sure to revoke the data uris to avoid memory leaks
			files.forEach((file) => URL.revokeObjectURL(file.preview));
		},
		[files]
	);

	return (
		<div className="d-inline-block" style={{ width: '100%' }}>
			<aside style={thumbsContainerMultiple}>{thumbs}</aside>
			<DropzoneContainer style={{ background: '#FFF', textAlign: 'center' }} {...getRootProps({ className: 'btn-dropzone' })}>
				<input {...getInputProps()} />
				<DropzoneText style={{ textAlign: 'center', justifyContent: 'center' }}>
					<div>
						Drag and drop to upload files, or <span style={{ color: '#7ABDF1' }}> click here to select files</span>
					</div>
				</DropzoneText>
				<DropzoneSubtext style={{ textAlign: 'center', justifyContent: 'center' }}>Accepted filetypes: .jpeg, .png (under 1MB)</DropzoneSubtext>
			</DropzoneContainer>
		</div>
	);
};

export function DropzoneNew(props) {
	const [files, setFiles] = useState([]);
	const [error, setError] = useState([]);
	const dispatch = useDispatch();

	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'video/*': [],
			'image/jpeg': [],
			'image/png': [],
		},
		multiple: props.multiple,
		noDrag: true,
		onDrop: (acceptedFiles) => {
			const files = acceptedFiles.map((file) => {
				const i = new Image();

				i.onload = () => {
					let reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => {
						console.log({
							src: file.preview,
							width: i.width,
							height: i.height,
							data: reader.result,
						});
					};
				};

				i.src = file.preview;
				props.onDrop(acceptedFiles, props.name);
				return Object.assign(file, {
					preview: URL.createObjectURL(file),
				});
			});
			setFiles(files);
			if (props.onChange) {
				props.onChange(files);
			}
		},
	});
	const removeFile = (file) => {
		setFiles([]);
		props.handleRemove(file, props.name);
	};

	const thumbs = files.map((file) => (
		<div style={thumb} key={file.name}>
			<div style={thumbInner}>
				{file.type.includes('image') ? (
					<img src={file.preview} style={img} alt="" />
				) : file.type.includes('video') ? (
					<video width="320" height="200" autoPlay controls>
						<source src={file.preview} type={file.type} />
					</video>
				) : (
					<img src={documentIcon} style={img} alt="" />
				)}
			</div>
			<a onClick={() => removeFile(file)} style={{ position: 'absolute', top: '2px', right: '4px', cursor: 'pointer' }}>
				<img src={closeIcon}></img>
			</a>
		</div>
	));

	return (
		<div className={props.isDelete && (files.length || props.value) ? 'd-flex' : 'd-inline-box'} style={{ width: '100%' }}>
			<DropzoneContainer {...getRootProps({ className: 'btn-dropzone' })} style={props.isDelete && (files.length || props.value) ? { width: '80%' } : null}>
				<input {...getInputProps()} />
				<DropzoneText>
					<div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
						<div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
							<AttachFileIcon sx={attachIcon} />
							<span style={ellipse}>
								{files.length > 0 ? (
									files[0].name
								) : props.value && typeof props.value == 'string' ? (
									props.value
								) : props.dialogType == 'edit' && props.value && Array.isArray(props.value) ? (
									props.value[0].path
								) : (
									<span style={{ color: '#7ABDF1' }}>{props.placeholder ? props.placeholder : 'Select file to upload'}</span>
								)}
							</span>
						</div>
						{files.length || props.value ? (
							<button type="button" style={changeBtn}>
								Change
							</button>
						) : null}
					</div>
				</DropzoneText>
			</DropzoneContainer>
			<aside style={thumbsContainerMultiple}>{thumbs}</aside>
		</div>
	);
}

export function DropzoneDocument(props) {
	const [files, setFiles] = useState([]);

	useEffect(
		() => () => {
			// Make sure to revoke the data uris to avoid memory leaks
			files.forEach((file) => URL.revokeObjectURL(file.preview));
		},
		[files]
	);

	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'application/pdf': ['.pdf'],
		},
		multiple: props.multiple,
		noDrag: false,
		onDrop: (acceptedFiles) => {
			if(acceptedFiles?.length == 0) toast.error('Only pdf files are allowed')
			setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
			props.onDrop([...acceptedFiles], props.name);
		},
	});

	const removeFile = (file) => {
		const newFiles = [...files];
		newFiles.splice(newFiles.indexOf(file), 1);
		setFiles(newFiles);
		props.handleDocRemove(file, props.name);
	};

	return (
		<div style={{ width: '100%' }} >
			<Tooltip arrow placement="top" title={`${props?.fileCount >=3 ? 'max limit reached': ''}`}>
			<span>
			<div className={`${props?.fileCount >=3 ? 'tw-cursor-not-allowed' : ''}`}>
			<div className={`${props?.fileCount >=3 ? 'tw-pointer-events-none' : ''}`}>
			<DropzoneContainer style={{ background: '#fff', width: '100%' }} {...getRootProps({ className: 'btn-dropzone' })}>
				<input {...getInputProps()} />
				<DropzoneText>
					<div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
						<div style={{ width: '100%', textAlign: 'center' }}>
							<div style={{ color: '#666' }}>Drag and drop to upload files, or <span className='tw-text-primary tw-cursor-pointer'>click here</span></div>
							<div className='tw-text-[#999] tw-text-xs'>Accepted filetypes: .pdf (under 5MB)</div>
						</div>
					</div>
				</DropzoneText>
			</DropzoneContainer>
			</div>
			</div>
			</span>
			</Tooltip>
			{files.length > 0 &&
				files.map((file, index) => {
					return (
						<Box key={index} className="tw-flex tw-items-center tw-justify-between tw-py-2 tw-px-2 tw-my-2 tw-bg-backgroundBody tw-rounded">
							<div className="tw-text-[#666] tw-flex tw-gap-2 tw-items-center"><AttachFileIcon fontSize='small' /> <p>{file.name}</p></div>
							<IconButton sx={{ padding: 0 }} color="error" onClick={() => removeFile()}>
								<DeleteIcon />
							</IconButton>
						</Box>
					);
				})}
		</div>
	);
}

export function DropzoneDocumentForActivity(props) {

	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'application/pdf': [],
		},
		multiple: props.multiple,
		noDrag: false,
		onDrop: (acceptedFiles) => {
			props.onDrop([...acceptedFiles], props.name);
		},
	});

	const removeFile = (file) => {
		props.handleDocRemove(file, props.name);
	};

	return (
		<div style={{ width: '100%' }}>
			<DropzoneContainer style={{ background: '#fff', width: '100%' }} {...getRootProps({ className: 'btn-dropzone' })}>
				<input {...getInputProps()} />
				<DropzoneText>
					<div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
						<div style={{ width: '100%', textAlign: 'center' }}>
							<div style={{ color: '#666' }}>Drag and drop to upload files, or <span className='tw-text-primary tw-cursor-pointer'>click here</span></div>
							<div className='tw-text-[#999] tw-text-xs'>Accepted filetypes: .pdf (under 5MB)</div>
						</div>
					</div>
				</DropzoneText>
			</DropzoneContainer>
		</div>
	);
}

export function DropzoneImagesForActivity(props) {

	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'image/jpeg': [],
			'image/png': [],
		},
		multiple: props.multiple,
		noDrag: false,
		onDrop: (acceptedFiles) => {
			props.onDrop([...acceptedFiles], props.name);
		},
	});

	const removeFile = (file) => {
		props.handleDocRemove(file, props.name);
	};

	return (
		<div style={{ width: '100%' }}>
			<DropzoneContainer style={{ background: '#fff', width: '100%' }} {...getRootProps({ className: 'btn-dropzone' })}>
				<input {...getInputProps()} />
				<DropzoneText>
					<div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
						<div style={{ width: '100%', textAlign: 'center' }}>
							<div style={{ color: '#666' }}>Drag and drop to upload files, or <span className='tw-text-primary tw-cursor-pointer'>click here</span></div>
							<div className='tw-text-[#999] tw-text-xs'>Accepted filetypes: .png, .jpg (under 5MB)</div>
						</div>
					</div>
				</DropzoneText>
			</DropzoneContainer>
		</div>
	);
}