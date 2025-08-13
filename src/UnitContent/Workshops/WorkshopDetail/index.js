import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Button, CircularProgress, Container, IconButton, Paper, TextField, Tooltip } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LoadingButton } from '@mui/lab';

export default function WorkshopDetail(props) {
	const navigate = useNavigate();
	const qParams = useParams();
	const location = useLocation();

	const loading = useSelector((state) => state.unitContent.WorkshopCreateLoading);

	const unitContent = location?.state?.unitContent;
	const unit = location?.state?.unit;
	const programId = location?.state?.programId;
	const programDetails = JSON.parse(window.localStorage.getItem('currentProgram'));

	const [permissions, setPermissions] = useState({});

	useEffect(() => {
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
	}, []);

	return (
		<>
			<div>
				<div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
					<h1 className="tw-font-bold tw-text-[24px]">
						<Button
							variant="text"
							onClick={() => navigate(`/programs-unit/unit-content/${unit?.id}`, { state: { unit: unit, programId: programId, programDetails: programDetails } })}
							className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[12px]"
							disableRipple
							startIcon={<KeyboardBackspaceIcon />}
						>
							{`program / ${location?.state?.unit?.serialNumber}`}
						</Button>
						<h1 className="tw-px-2 tw-mt-[-4px]">{unitContent?.title}</h1>
					</h1>
					<div className="tw-flex tw-gap-x-5">
						<div className="tw-flex tw-gap-x-5">
							{permissions?.Programs?.program_unit?.ws.update && (
								<Button
									onClick={() => navigate(`/unit-content/workshops/update/${unit?.id}`, { state: { unit: unit, unitContent: unitContent, programId: programId, programDetails: programDetails } })}
									type="button"
									variant="outlined"
									size="small"
									className={`tw-h-[35px] ${programDetails?.status=="closed" ?  '' : '!tw-bg-white !tw-text-primary'}`}
									disabled={programDetails?.status=="closed" ? true : false}
								>
									Edit Workshop
								</Button>
							)}
							{/* <Button
								onClick={() => navigate(`/unit-content/workshop-content/${unitContent?.id}`, { state: { unit: unit, workshop: unitContent, programId: programId, programDetails: programDetails } })}
								variant="contained"
								size="small"
								className="tw-h-[35px]"
							>
								Manage Workshop
							</Button> */}
						</div>
					</div>
				</div>
				<div className="tw-pt-6">
					<Paper>
						<Container maxWidth={false}>
							<div className="tw-py-6">
								<p className="tw-text-sm tw-text-[#999999] tw-pb-2">Workshop Content</p>
								<p className="tw-text-[14px] tw-text-primaryText">{unitContent?.description}</p>
							</div>
						</Container>
					</Paper>
				</div>
			</div>
		</>
	);
}
