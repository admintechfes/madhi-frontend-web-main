import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUnitContentQuizDetail } from '../../duck/network';
import { CircularProgress } from '@mui/material';
import QuizForm from '../../QuizForm';

export default function QuizzesPreview() {
	const params = useParams();
	const location = useLocation();
	const dispatch = useDispatch();

	const unit = location?.state?.unit;
	const unitContent = location?.state?.unitContent;

	const quizDetail = useSelector((state) => state.unitContent.unitContentQuizDetails);
	const loading = useSelector((state) => state.unitContent.unitContentDetailsLoading);

	useEffect(() => {
		dispatch(getUnitContentQuizDetail(params.id || unitContent.id));
	}, []);

	return <>{!loading ? (<QuizForm questionnaireType="Quiz" type="preview" defaultValues={quizDetail} />) : <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>}</>;
}
