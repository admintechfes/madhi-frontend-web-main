import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUnitContentVisitDetail } from '../../duck/network';
import { CircularProgress } from '@mui/material';
import QuizForm from '../../QuizForm';

export default function VisitsPreview() {
	const params = useParams();
	const location = useLocation();
	const dispatch = useDispatch();

	const unit = location?.state?.unit;
	const unitContent = location?.state?.unitContent;

	const surveyDetail = useSelector((state) => state.unitContent.unitContentSurveyDetails);
	const loading = useSelector((state) => state.unitContent.unitContentDetailsLoading);

	useEffect(() => {
		dispatch(getUnitContentVisitDetail(params.id || unitContent.id));
	}, []);

	return <>{!loading ? (<QuizForm previewType="Visit" questionnaireType="Survey" type="preview" defaultValues={surveyDetail} />) : <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>}</>;
}
