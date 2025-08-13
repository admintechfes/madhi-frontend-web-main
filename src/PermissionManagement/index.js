import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DropDownwithCheckmarks from '../components/Masters/DropDownwithCheckmarks';
import { getPermissionList, postPermissionList, updateRolePermissions } from './duck/network';
import { useDispatch } from 'react-redux';
import { fillPermissionList, resetPermissionList, updatePermissionList } from './duck/permissionSlice';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';

export default function PermissionManagement() {
	const [value, setValue] = useState('0');
	const [roleType, setRoleType] = useState('srsupervisor');
	const [permissionData, setPermissionData] = useState({});
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const permissionList = useSelector((state) => state.permissions.permissionList);
	const loader = useSelector((state) => state.permissions.loading);
	const loaderSubmit = useSelector((state) => state.permissions.loaderSubmit);

	useEffect(() => {
		return () => dispatch(resetPermissionList({}));
	}, []);

	useEffect(() => {
		const type = value === '0' ? 1 : 2;
		let tabType = 'srsupervisor';
		switch (value) {
			case '0':
				tabType = 'srsupervisor';
				setRoleType('srsupervisor');
				break;
			case '1':
				tabType = 'supervisor';
				setRoleType('supervisor');
				break;
			case '2':
				tabType = 'cew';
				setRoleType('cew');
				break;
			default:
				tabType = 'srsupervisor';
				setRoleType('srsupervisor');
		}
		if (Object.keys(permissionList[tabType]).length == 0) {
			dispatch(getPermissionList({ type: type, roleType: tabType }));
		}
		// dispatch(fillPermissionList(permissionData));
	}, [value, permissionData]);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleDropDown = (list, listName) => {
		// setPermissionData((prev) => ({ ...prev, [listName]: list }));

		let tabType = 'srsupervisor';
		switch (value) {
			case '0':
				tabType = 'srsupervisor';
				setRoleType('srsupervisor');
				break;
			case '1':
				tabType = 'supervisor';
				setRoleType('supervisor');
				break;
			case '2':
				tabType = 'cew';
				setRoleType('cew');
				break;
			default:
				tabType = 'srsupervisor';
				setRoleType('srsupervisor');
		}

		dispatch(updatePermissionList({ tabType, list, listName }));
	};

	const handleSubmitted = () => {
		dispatch(updateRolePermissions({ updatedRolePermissionData: permissionList }));
	};

	return !loader ? (
		<div>
			<div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
				<h1 className="tw-font-bold tw-text-[24px]">
					<h1 className="tw-px-2 tw-mt-[-4px]">{'Permission Managements'}</h1>
				</h1>
				<div className="tw-flex tw-gap-x-5">
					<div className="tw-flex tw-gap-x-5">
						{/* <Button onClick={() => navigate('/team-members')} type="button" variant="contained" size="small" className="tw-h-[35px] !tw-bg-white !tw-text-primary">
							Cancel
						</Button> */}

						<LoadingButton loading={loaderSubmit} type="button" variant="contained" size="small" className="tw-h-[35px]" onClick={handleSubmitted}>
							Save
						</LoadingButton>
					</div>
				</div>
			</div>
			<div>
				<div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
					<Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">
						Edit permission for below roles
					</Typography>

					<Box sx={{ width: '100%' }}>
						<TabContext value={value}>
							<Box sx={{ backgroundColor: '#F2F2F2', width: '26rem', borderRadius: '0.5rem' }}>
								<TabList onChange={handleChange} className="">
									<Tab
										label="Sr.Supervisor"
										value="0"
										sx={{
											fontSize: '16px',
											textTransform: 'capitalize',
											fontWeight: 'bold',
											color: '#666666 !important',
											backgroundColor: value === '0' ? 'white' : '',
											borderRadius: '0.5rem',
											marginLeft: '1rem',
											marginY: '0.4rem',
											position: 'relative',
											boxShadow: value === '0' ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
											'&::after': {
												content: '""',
												position: 'absolute',
												bottom: 0,
												left: '50%',
												transform: 'translateX(-50%)',
												width: '25%',
												borderBottom: value === '0' ? '3px solid #FFC40C' : 'none',
											},
										}}
									/>
									<Tab
										label="Supervisor"
										value="1"
										sx={{
											fontSize: '16px',
											textTransform: 'capitalize',
											fontWeight: 'bold',
											color: '#666666 !important',
											backgroundColor: value === '1' ? 'white' : '',
											borderRadius: '0.5rem',
											marginLeft: '1rem',
											marginY: '0.4rem',
											position: 'relative',
											boxShadow: value === '1' ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
											'&::after': {
												content: '""',
												position: 'absolute',
												bottom: 0,
												left: '50%',
												transform: 'translateX(-50%)',
												width: '25%',
												borderBottom: value === '1' ? '3px solid #FFC40C' : 'none',
											},
										}}
									/>
									<Tab
										label="CEW"
										value="2"
										sx={{
											fontSize: '16px',
											textTransform: 'capitalize',
											fontWeight: 'bold',
											color: '#666666 !important',
											backgroundColor: value === '2' ? 'white' : '',
											borderRadius: '0.5rem',
											marginLeft: '1rem',
											marginY: '0.4rem',
											position: 'relative',
											boxShadow: value === '2' ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
											'&::after': {
												content: '""',
												position: 'absolute',
												bottom: 0,
												left: '50%',
												transform: 'translateX(-50%)',
												width: '25%',
												borderBottom: value === '2' ? '3px solid #FFC40C' : 'none',
											},
										}}
									/>
								</TabList>
								<style>{`
                  .MuiTabs-indicator {
                    height: 0px !important;
                  }
                `}</style>
							</Box>
							<TabPanel value="0">
								<div className="tw-flex tw- tw-w-[100%] tw-pt-8 tw-gap-[10%]">
									<div>
										{['Team Members', 'Content Library', 'Programs'].map((item, i) => (
											<div key={i} className="tw-pb-10">
												<div className="tw-font-bold tw-text-lg">{item}</div>
												<div>
													<DropDownwithCheckmarks accessName={item} onChange={handleDropDown} roleType={roleType} data={permissionList[roleType]} />
												</div>
											</div>
										))}
									</div>
									<div>
										{['Masters', 'Parents'].map((item, i) => (
											<div key={i} className="tw-pb-10">
												<div className="tw-font-bold tw-text-lg">{item}</div>
												<div>
													<DropDownwithCheckmarks accessName={item} onChange={handleDropDown} data={permissionList[roleType]} />
												</div>
											</div>
										))}
									</div>
								</div>
							</TabPanel>
							<TabPanel value="1">
								<div className="tw-flex tw- tw-w-[100%] tw-pt-8 tw-gap-[10%]">
									<div>
										{['Workshop session', 'Parents'].map((item, i) => (
											<div key={i} className="tw-pb-10">
												<div className="tw-font-bold tw-text-lg">{item}</div>
												<div>
													<DropDownwithCheckmarks accessName={item} data={permissionList[roleType]} roleType={roleType} onChange={handleDropDown} />
												</div>
											</div>
										))}
									</div>
									<div>
										{['Visit'].map((item, i) => (
											<div key={i} className="tw-pb-10">
												<div className="tw-font-bold tw-text-lg">{item}</div>
												<div>
													<DropDownwithCheckmarks accessName={item} data={permissionList[roleType]} onChange={handleDropDown} />
												</div>
											</div>
										))}
									</div>
								</div>
							</TabPanel>
							<TabPanel value="2">
								<div className="tw-flex tw- tw-w-[100%] tw-pt-8 tw-gap-[10%]">
									<div>
										{['Workshop session', 'Parents'].map((item, i) => (
											<div key={i} className="tw-pb-10">
												<div className="tw-font-bold tw-text-lg">{item}</div>
												<div>
													<DropDownwithCheckmarks onChange={handleDropDown} accessName={item} roleType={roleType} data={permissionList[roleType]} />
												</div>
											</div>
										))}
									</div>
									<div>
										{['Visit'].map((item, i) => (
											<div key={i} className="tw-pb-10">
												<div className="tw-font-bold tw-text-lg">{item}</div>
												<div>
													<DropDownwithCheckmarks onChange={handleDropDown} accessName={item} data={permissionList[roleType]} />
												</div>
											</div>
										))}
									</div>
								</div>
							</TabPanel>
						</TabContext>
					</Box>
				</div>
			</div>
		</div>
	) : (
		<div className=" tw-h-[100vh] tw-flex tw-justify-center tw-items-center">
			<CircularProgress />
		</div>
	);
}
