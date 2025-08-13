import React, { useEffect, useMemo } from 'react';
import ProgramCreateUpdate from '../ProgramCreate';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getProgramDetails, getProgramUpdateDetails } from '../duck/network';
import { setProgramDetailLoading } from '../duck/programSlice';

export default function ProgramUpdate() {
	const dispatch = useDispatch();
	const naviagte = useNavigate();
	const params = useParams();

	const programDetails = useSelector((state) => state.program.programDetails);
	const loader = useSelector((state) => state.program.programUpdateDetailLoading);

	useEffect(() => {
		dispatch(getProgramUpdateDetails(params.id));
	}, []);

	return (
    <>
    {!loader ? <ProgramCreateUpdate defaultValues={programDetails} />:(<div  className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>)}
    </>
  )
};
