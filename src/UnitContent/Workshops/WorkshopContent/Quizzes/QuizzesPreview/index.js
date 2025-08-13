import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { getWorkshopContentQuizDetail } from '../../../duck/network';
import QuizForm from '../../../../QuizForm';

export default function QuizzesPreview() {
	const params = useParams();
	const location = useLocation();
	const dispatch = useDispatch();

	const unit = location?.state?.unit;
	const workshopContent = location?.state?.workshopContent;

	const workshopQuizDetail = useSelector((state)=>state.workshopContent.workshopContentQuizDetails)
	const loading = useSelector((state) => state.workshopContent.workshopContentDetailsLoading);
	

	useEffect(() => {
		dispatch(getWorkshopContentQuizDetail(params.id || workshopContent.id))
	}, []);

	return <>{!loading ? (<QuizForm type="preview"questionnaireType="Workshop Quiz" defaultValues={workshopQuizDetail} />) : <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>}</>;
}
