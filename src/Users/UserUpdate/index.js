import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getUserDetails, getUserRoleNameList } from '../duck/network';
import UserCreateUpdate from '../UserCreate';

export default function UserUpdate() {
	const dispatch = useDispatch();
	const naviagte = useNavigate();
	const params = useParams();

	let details = useSelector((state) => state.user.userDetails);
	const loader = useSelector((state) => state.user.loading);

	useEffect(() => {
		dispatch(getUserRoleNameList())
		dispatch(getUserDetails(params))
	}, []);

	const newDetails = Array.isArray(details.assigned_details) ? details : { ...details, assigned_details: [details.assigned_details] }

	return (
		<>
			{!loader ? (<UserCreateUpdate defaultValues={newDetails} formtype={"edit"} />) : (<div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>)}
		</>
	)
};
