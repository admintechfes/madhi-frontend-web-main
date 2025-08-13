import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { CircularProgress } from '@mui/material';

import { getUnitContentLearningActivityDetail } from '../../duck/network';
import { setSurveyForm } from '../../duck/unitContentSlice';
import LearningActivityCreate from '../LearningActivityCreate';

export default function LearningActivityUpdate() {
	const params = useParams();
	const location = useLocation();
	const dispatch = useDispatch();

	const unit = location?.state?.unit;
	const unitContent = location?.state?.unitContent;

	const unitContentLearningActivityDetail = useSelector((state) => state.unitContent.unitContentLearningActivityDetails);
	const loading = useSelector((state) => state.unitContent.unitContentDetailsLoading);

	useEffect(() => {
		dispatch(getUnitContentLearningActivityDetail(params.id || unitContent.id));
	}, []);

	return (
		<>{!loading ? <LearningActivityCreate type="update" defaultValues={unitContentLearningActivityDetail} /> : <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>}</>
	);
}
