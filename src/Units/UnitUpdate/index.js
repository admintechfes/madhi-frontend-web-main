import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { CircularProgress } from '@mui/material';

import { getUnitDetails } from '../duck/network';
import UnitCreate from '../UnitCreate';

export default function UnitUpdate() {
	const dispatch = useDispatch();
	const params = useParams();

	const unitDetails = useSelector((state) => state.unit.unitDetails);
	const loader = useSelector((state) => state.unit.unitDetailLoading);

	useEffect(() => {
		dispatch(getUnitDetails(params.unitId));
	}, []);

	return (
    <>
    {!loader ? (<UnitCreate type="update" defaultValues={unitDetails} />):(<div  className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>)}
    </>
  )
};
