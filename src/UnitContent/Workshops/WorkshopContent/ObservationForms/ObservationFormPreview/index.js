import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkshopContentObservationFormsDetail } from '../../../duck/network';
import { CircularProgress } from '@mui/material';
import QuizForm from '../../../../QuizForm';

export default function ObservationFormsUpdate() {
	const params = useParams();
	const location = useLocation();
	const dispatch = useDispatch();

	const unit = location?.state?.unit;
	const workshopContent = location?.state?.workshopContent;

	const workshopContentQuizDetail = useSelector((state)=>state.workshopContent.workshopContentQuizDetails)
	const loading = useSelector((state) => state.workshopContent.workshopContentDetailsLoading);

	useEffect(() => {
		dispatch(getWorkshopContentObservationFormsDetail(params.id || workshopContent.id))
	}, []);

	return <>{!loading ? (<QuizForm type="preview" questionnaireType="Observation Form" defaultValues={workshopContentQuizDetail} />) : <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>}</>;
}
